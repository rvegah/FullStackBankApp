import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, timer } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ClientService } from '../../core/services/client.service';
import { AccountService } from '../../core/services/account.service';
import { MovementService } from '../../core/services/movement.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Estadísticas principales
  totalClients: number = 0;
  totalAccounts: number = 0;
  totalMovements: number = 0;
  totalBalance: number = 0;
  
  // Estado de la aplicación
  isLoading: boolean = false;
  lastUpdate: Date = new Date();

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private movementService: MovementService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Usar forkJoin para cargar todos los datos en paralelo
    forkJoin({
      clients: this.clientService.getAll().pipe(
        catchError(error => {
          console.error('Error loading clients:', error);
          return of([]);
        })
      ),
      accounts: this.accountService.getAll().pipe(
        catchError(error => {
          console.error('Error loading accounts:', error);
          return of([]);
        })
      ),
      movements: this.movementService.getAll().pipe(
        catchError(error => {
          console.error('Error loading movements:', error);
          return of([]);
        })
      )
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.processStatistics(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.notificationService.showError(
          'Error de conexión',
          'No se pudieron cargar las estadísticas del sistema'
        );
        this.isLoading = false;
      }
    });
  }

  private processStatistics(data: any): void {
    // Procesar clientes
    this.totalClients = data.clients?.length || 0;
    
    // Procesar cuentas
    this.totalAccounts = data.accounts?.length || 0;
    
    // Calcular balance total
    this.totalBalance = data.accounts?.reduce((sum: number, account: any) => {
      return sum + (account.saldoInicial || 0);
    }, 0) || 0;
    
    // Procesar movimientos del día actual
    const today = new Date();
    const todayMovements = data.movements?.filter((movement: any) => {
      const movementDate = new Date(movement.fecha);
      return movementDate.toDateString() === today.toDateString();
    }) || [];
    
    this.totalMovements = todayMovements.length;
    
    // Mostrar notificación de éxito
    this.notificationService.showSuccess(
      'Datos actualizados',
      'Las estadísticas del sistema se han actualizado correctamente'
    );
  }

  refreshData(): void {
    if (this.isLoading) return;
    
    this.notificationService.showInfo(
      'Actualizando datos',
      'Obteniendo las últimas estadísticas del sistema...'
    );
    
    this.loadDashboardData();
  }

  private setupAutoRefresh(): void {
    // Auto-refrescar cada 5 minutos
    timer(300000, 300000) // 5 minutos en milisegundos
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          console.log('Auto-refreshing dashboard data...');
          this.loadDashboardData();
          return of(null);
        })
      )
      .subscribe();
  }
}