import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AccountService } from '../../../../core/services/account.service';
import { ClientService } from '../../../../core/services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cuenta, Cliente } from '../../../../core/models';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data properties
  accounts: Cuenta[] = [];
  clients: Cliente[] = [];
  filteredAccounts: Cuenta[] = [];
  paginatedAccounts: Cuenta[] = [];

  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  typeFilter: string = '';
  clientFilter: string = '';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  // Sorting properties
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // State properties
  loading: boolean = false;
  deleting: boolean = false;

  // Modal properties
  showDeleteModal: boolean = false;
  accountToDelete: Cuenta | null = null;

  // Statistics
  totalAccounts: number = 0;
  activeAccounts: number = 0;
  totalBalance: number = 0;
  savingsAccounts: number = 0;
  currentAccounts: number = 0;

  constructor(
    private accountService: AccountService,
    private clientService: ClientService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading methods
  loadData(): void {
    this.loading = true;
    
    // Load accounts and clients in parallel
    Promise.all([
      this.loadAccounts(),
      this.loadClients()
    ]).then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  private loadAccounts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accountService.getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            this.calculateStatistics();
            this.applyFilters();
            this.notificationService.showSuccess(
              'Cuentas cargadas',
              `Se cargaron ${accounts.length} cuentas correctamente`
            );
            resolve();
          },
          error: (error) => {
            console.error('Error loading accounts:', error);
            this.notificationService.showError(
              'Error de carga',
              'No se pudieron cargar las cuentas. Intente nuevamente.'
            );
            reject(error);
          }
        });
    });
  }

  private loadClients(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientService.getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (clients) => {
            this.clients = clients;
            resolve();
          },
          error: (error) => {
            console.error('Error loading clients:', error);
            reject(error);
          }
        });
    });
  }

  private calculateStatistics(): void {
    this.totalAccounts = this.accounts.length;
    this.activeAccounts = this.accounts.filter(account => account.estado).length;
    this.totalBalance = this.accounts.reduce((sum, account) => sum + (account.saldoInicial || 0), 0);
    this.savingsAccounts = this.accounts.filter(account => account.tipoCuenta === 'Ahorro').length;
    this.currentAccounts = this.accounts.filter(account => account.tipoCuenta === 'Corriente').length;
  }

  // Search and filter methods
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.clientFilter = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.accounts];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(account =>
        account.numeroCuenta.toLowerCase().includes(term) ||
        account.tipoCuenta.toLowerCase().includes(term) ||
        this.getClientName(account.clienteId).toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== '') {
      const isActive = this.statusFilter === 'true';
      filtered = filtered.filter(account => account.estado === isActive);
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(account => account.tipoCuenta === this.typeFilter);
    }

    // Apply client filter
    if (this.clientFilter) {
      filtered = filtered.filter(account => account.clienteId.toString() === this.clientFilter);
    }

    this.filteredAccounts = filtered;
    this.applySorting();
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  // Sorting methods
  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
    this.updatePagination();
  }

  private applySorting(): void {
    if (!this.sortField) return;

    this.filteredAccounts.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Cuenta];
      let bValue: any = b[this.sortField as keyof Cuenta];

      // Special handling for client name sorting
      if (this.sortField === 'clienteId') {
        aValue = this.getClientName(a.clienteId);
        bValue = this.getClientName(b.clienteId);
      }

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle number comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparisons
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortClass(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? 'asc' : 'desc';
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAccounts.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAccounts = this.filteredAccounts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getVisiblePages(): number[] {
    const maxVisible = 5;
    const pages: number[] = [];
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible + 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Pagination info getters
  get startItem(): number {
    return this.filteredAccounts.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredAccounts.length);
  }

  // Delete methods
  confirmDelete(account: Cuenta): void {
    this.accountToDelete = account;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.accountToDelete = null;
    this.showDeleteModal = false;
  }

  deleteAccount(): void {
    if (!this.accountToDelete?.cuentaId) return;

    this.deleting = true;
    this.accountService.delete(this.accountToDelete.cuentaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Cuenta eliminada',
            `La cuenta ${this.accountToDelete!.numeroCuenta} fue eliminada correctamente`
          );
          // Remove from local arrays
          this.accounts = this.accounts.filter(a => a.cuentaId !== this.accountToDelete!.cuentaId);
          this.calculateStatistics();
          this.applyFilters();
          this.cancelDelete();
          this.deleting = false;
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          this.notificationService.showError(
            'Error al eliminar',
            'No se pudo eliminar la cuenta. Intente nuevamente.'
          );
          this.deleting = false;
        }
      });
  }

  // Utility methods
  trackByAccountId(index: number, account: Cuenta): number | undefined {
    return account.cuentaId;
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.clienteId === clientId);
    return client ? client.nombre : 'Cliente no encontrado';
  }

  getAccountTypeClass(tipo: string): string {
    return tipo === 'Ahorro' ? 'type-savings' : 'type-current';
  }

  getAccountTypeLabel(tipo: string): string {
    return tipo === 'Ahorro' ? 'Cuenta de Ahorro' : 'Cuenta Corriente';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  refreshData(): void {
    this.loadData();
  }

  getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
}