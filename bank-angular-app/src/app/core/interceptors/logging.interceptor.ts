import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    
    // Log de la petición saliente
    console.log('🚀 HTTP Request:', {
      method: request.method,
      url: request.url,
      headers: this.getLogHeaders(request.headers),
      body: request.body ? this.sanitizeBody(request.body) : null,
      timestamp: new Date().toISOString()
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            
            // Log de la respuesta exitosa
            console.log('✅ HTTP Response:', {
              method: request.method,
              url: request.url,
              status: event.status,
              statusText: event.statusText,
              duration: `${duration}ms`,
              responseSize: this.getResponseSize(event),
              timestamp: new Date().toISOString()
            });
          }
        },
        (error) => {
          const duration = Date.now() - startTime;
          
          // Log del error
          console.error('❌ HTTP Error:', {
            method: request.method,
            url: request.url,
            status: error.status,
            statusText: error.statusText,
            duration: `${duration}ms`,
            error: error.error,
            timestamp: new Date().toISOString()
          });
        }
      )
    );
  }

  private getLogHeaders(headers: any): any {
    const logHeaders: any = {};
    
    // Solo incluir headers importantes para el log
    const importantHeaders = ['content-type', 'authorization', 'accept'];
    
    importantHeaders.forEach(header => {
      if (headers.has(header)) {
        logHeaders[header] = headers.get(header);
      }
    });
    
    return logHeaders;
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    
    // Crear una copia del body para sanitizar
    const sanitized = JSON.parse(JSON.stringify(body));
    
    // Remover campos sensibles
    const sensitiveFields = ['contrasena', 'password', 'token', 'key'];
    
    this.removeSensitiveFields(sanitized, sensitiveFields);
    
    return sanitized;
  }

  private removeSensitiveFields(obj: any, sensitiveFields: string[]): void {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (sensitiveFields.includes(key.toLowerCase())) {
          obj[key] = '***HIDDEN***';
        } else if (typeof obj[key] === 'object') {
          this.removeSensitiveFields(obj[key], sensitiveFields);
        }
      });
    }
  }

  private getResponseSize(response: HttpResponse<any>): string {
    if (!response.body) return '0 B';
    
    const size = JSON.stringify(response.body).length;
    
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  }
}