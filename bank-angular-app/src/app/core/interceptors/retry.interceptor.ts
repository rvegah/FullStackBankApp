import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 segundo

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo reintentar peticiones GET y que no tengan header de no retry
    if (request.method !== 'GET' || request.headers.has('X-Skip-Retry')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index: number) => {
            // Solo reintentar en errores 5xx o errores de red
            const shouldRetry = (error.status >= 500 || error.status === 0) && index < this.MAX_RETRIES;
            
            if (shouldRetry) {
              console.log(`🔄 Retrying request (${index + 1}/${this.MAX_RETRIES}):`, request.url);
              return timer(this.RETRY_DELAY * (index + 1)); // Backoff exponencial
            }
            
            return throwError(error);
          }),
          finalize(() => {
            console.log('🔄 Retry attempts completed for:', request.url);
          })
        )
      )
    );
  }
}