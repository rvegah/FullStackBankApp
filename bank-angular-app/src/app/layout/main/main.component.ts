import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '../../core/services/loading.service';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoading$: Observable<boolean>;
  notifications$: Observable<Notification[]>;

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.isLoading$ = this.loadingService.loading$;
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit(): void {
    this.showWelcomeMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  private showWelcomeMessage(): void {
    setTimeout(() => {
      this.notificationService.showSuccess(
        'Sistema Bancario',
        'Bienvenido al sistema de gestión bancaria'
      );
    }, 1000);
  }
}