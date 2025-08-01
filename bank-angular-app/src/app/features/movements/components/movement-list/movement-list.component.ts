import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MovementService } from '../../../../core/services/movement.service';
import { AccountService } from '../../../../core/services/account.service';
import { ClientService } from '../../../../core/services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Movimiento, Cuenta, Cliente } from '../../../../core/models';

@Component({
  selector: 'app-movement-list',
  templateUrl: './movement-list.component.html',
  styleUrls: ['./movement-list.component.css']
})
export class MovementListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data properties
  movements: Movimiento[] = [];
  accounts: Cuenta[] = [];
  clients: Cliente[] = [];
  filteredMovements: Movimiento[] = [];
  paginatedMovements: Movimiento[] = [];

  // Search and filter properties
  searchTerm: string = '';
  typeFilter: string = '';
  accountFilter: string = '';
  dateFilter: string = '';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  // Sorting properties
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'desc'; // Default to desc for recent movements first

  // State properties
  loading: boolean = false;
  deleting: boolean = false;

  // Modal properties
  showDeleteModal: boolean = false;
  movementToDelete: Movimiento | null = null;

  // Statistics
  totalCredits: number = 0;
  totalDebits: number = 0;
  netBalance: number = 0;

  // Expose Math to template
  Math = Math;

  constructor(
    private movementService: MovementService,
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
    
    Promise.all([
      this.loadMovements(),
      this.loadAccounts(),
      this.loadClients()
    ]).then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  private loadMovements(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.movementService.getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (movements) => {
            this.movements = movements;
            this.calculateStatistics();
            this.applyFilters();
            this.notificationService.showSuccess(
              'Movimientos cargados',
              `Se cargaron ${movements.length} movimientos correctamente`
            );
            resolve();
          },
          error: (error) => {
            console.error('Error loading movements:', error);
            this.notificationService.showError(
              'Error de carga',
              'No se pudieron cargar los movimientos. Intente nuevamente.'
            );
            reject(error);
          }
        });
    });
  }

  private loadAccounts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accountService.getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            resolve();
          },
          error: (error) => {
            console.error('Error loading accounts:', error);
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
    this.totalCredits = this.movements
      .filter(m => m.tipoMovimiento === 'Crédito')
      .reduce((sum, m) => sum + m.valor, 0);

    this.totalDebits = this.movements
      .filter(m => m.tipoMovimiento === 'Débito')
      .reduce((sum, m) => sum + Math.abs(m.valor), 0);

    this.netBalance = this.totalCredits - this.totalDebits;
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
    this.typeFilter = '';
    this.accountFilter = '';
    this.dateFilter = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.movements];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(movement => {
        const account = this.getAccountInfo(movement.cuentaId);
        const client = this.getClientNameByAccountId(movement.cuentaId);
        return (
          account?.numeroCuenta.toLowerCase().includes(term) ||
          client.toLowerCase().includes(term) ||
          movement.valor.toString().includes(term) ||
          movement.tipoMovimiento.toLowerCase().includes(term)
        );
      });
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(movement => movement.tipoMovimiento === this.typeFilter);
    }

    // Apply account filter
    if (this.accountFilter) {
      filtered = filtered.filter(movement => movement.cuentaId.toString() === this.accountFilter);
    }

    // Apply date filter
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      filtered = filtered.filter(movement => {
        const movementDate = new Date(movement.fecha);
        return movementDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredMovements = filtered;
    this.applySorting();
    this.currentPage = 1;
    this.updatePagination();
  }

  // Sorting methods
  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = field === 'fecha' ? 'desc' : 'asc'; // Recent dates first
    }
    this.applySorting();
    this.updatePagination();
  }

  private applySorting(): void {
    if (!this.sortField) return;

    this.filteredMovements.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Movimiento];
      let bValue: any = b[this.sortField as keyof Movimiento];

      // Handle date comparisons
      if (this.sortField === 'fecha') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle number comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

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
    this.totalPages = Math.ceil(this.filteredMovements.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMovements = this.filteredMovements.slice(startIndex, endIndex);
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
    let end = Math.min(this.totalPages, start + maxVisible - 1);

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
    return this.filteredMovements.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredMovements.length);
  }

  // Delete methods
  confirmDelete(movement: Movimiento): void {
    this.movementToDelete = movement;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.movementToDelete = null;
    this.showDeleteModal = false;
  }

  deleteMovement(): void {
    if (!this.movementToDelete?.movimientoId) return;

    this.deleting = true;
    this.movementService.delete(this.movementToDelete.movimientoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Movimiento eliminado',
            `El movimiento fue eliminado correctamente`
          );
          // Remove from local arrays
          this.movements = this.movements.filter(m => m.movimientoId !== this.movementToDelete!.movimientoId);
          this.calculateStatistics();
          this.applyFilters();
          this.cancelDelete();
          this.deleting = false;
        },
        error: (error) => {
          console.error('Error deleting movement:', error);
          this.notificationService.showError(
            'Error al eliminar',
            'No se pudo eliminar el movimiento. Intente nuevamente.'
          );
          this.deleting = false;
        }
      });
  }

  // Utility methods
  trackByMovementId(index: number, movement: Movimiento): number | undefined {
    return movement.movimientoId;
  }

  getAccountInfo(accountId: number): Cuenta | undefined {
    return this.accounts.find(a => a.cuentaId === accountId);
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.clienteId === clientId);
    return client ? client.nombre : 'Cliente no encontrado';
  }

  getClientNameByAccountId(accountId: number): string {
    const account = this.getAccountInfo(accountId);
    return account ? this.getClientName(account.clienteId) : 'Cliente no encontrado';
  }

  getAccountTypeClass(tipo: string | undefined): string {
    if (!tipo) return '';
    return tipo === 'Ahorro' ? 'type-savings' : 'type-current';
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
}