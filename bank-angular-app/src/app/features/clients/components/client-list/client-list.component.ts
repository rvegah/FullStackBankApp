import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ClientService } from '../../../../core/services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cliente } from '../../../../core/models';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data properties
  clients: Cliente[] = [];
  filteredClients: Cliente[] = [];
  paginatedClients: Cliente[] = [];

  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  genderFilter: string = '';

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
  clientToDelete: Cliente | null = null;

  // Statistics
  totalClients: number = 0;
  activeClients: number = 0;

  constructor(
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
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading methods
  loadClients(): void {
    this.loading = true;
    
    this.clientService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients) => {
          this.clients = clients;
          this.calculateStatistics();
          this.applyFilters();
          this.loading = false;
          
          this.notificationService.showSuccess(
            'Datos cargados',
            `Se cargaron ${clients.length} clientes correctamente`
          );
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.loading = false;
          this.notificationService.showError(
            'Error de carga',
            'No se pudieron cargar los clientes. Intente nuevamente.'
          );
        }
      });
  }

  private calculateStatistics(): void {
    this.totalClients = this.clients.length;
    this.activeClients = this.clients.filter(client => client.estado).length;
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
    this.genderFilter = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.clients];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client =>
        client.nombre.toLowerCase().includes(term) ||
        client.identificacion.includes(term) ||
        client.telefono.includes(term) ||
        client.direccion.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== '') {
      const isActive = this.statusFilter === 'true';
      filtered = filtered.filter(client => client.estado === isActive);
    }

    // Apply gender filter
    if (this.genderFilter) {
      filtered = filtered.filter(client => client.genero === this.genderFilter);
    }

    this.filteredClients = filtered;
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

    this.filteredClients.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Cliente];
      let bValue: any = b[this.sortField as keyof Cliente];

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
    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
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
    return this.filteredClients.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredClients.length);
  }

  // Delete methods
  confirmDelete(client: Cliente): void {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.clientToDelete = null;
    this.showDeleteModal = false;
  }

  deleteClient(): void {
    if (!this.clientToDelete?.clienteId) return;

    this.deleting = true;
    
    this.clientService.delete(this.clientToDelete.clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Cliente eliminado',
            `El cliente ${this.clientToDelete!.nombre} fue eliminado correctamente`
          );
          
          // Remove from local arrays
          this.clients = this.clients.filter(c => c.clienteId !== this.clientToDelete!.clienteId);
          this.calculateStatistics();
          this.applyFilters();
          
          this.cancelDelete();
          this.deleting = false;
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.notificationService.showError(
            'Error al eliminar',
            'No se pudo eliminar el cliente. Intente nuevamente.'
          );
          this.deleting = false;
        }
      });
  }

  // Utility methods
  trackByClientId(index: number, client: Cliente): number | undefined {
    return client.clienteId;
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