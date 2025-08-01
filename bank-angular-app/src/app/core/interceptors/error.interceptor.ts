import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado';
        let errorTitle = 'Error';

        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = error.error.message;
          errorTitle = 'Error de conexión';
        } else {
          // Error del servidor
          switch (error.status) {
            case 400:
              errorTitle = 'Datos inválidos';
              errorMessage = error.error || 'Los datos enviados no son válidos';
              break;
            case 401:
              errorTitle = 'No autorizado';
              errorMessage = 'No tiene permisos para realizar esta acción';
              break;
            case 404:
              errorTitle = 'No encontrado';
              errorMessage = 'El recurso solicitado no existe';
              break;
            case 500:
              errorTitle = 'Error del servidor';
              errorMessage = 'Error interno del servidor. Intente nuevamente';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        // Mostrar notificación de error
        this.notificationService.showError(errorTitle, errorMessage);

        // Log del error para debugging
        console.error('HTTP Error:', {
          status: error.status,
          message: error.message,
          url: request.url,
          method: request.method,
          error: error.error
        });

        return throwError(errorMessage);
      })
    );
  }
}