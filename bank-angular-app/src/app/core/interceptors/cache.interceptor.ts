import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo cachear peticiones GET
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Verificar si la petición tiene header para no cachear
    if (request.headers.has('X-Skip-Cache')) {
      return next.handle(request);
    }

    const cacheKey = this.getCacheKey(request);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      console.log('📦 Cache Hit:', request.url);
      return of(cached);
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.addToCache(cacheKey, event);
          console.log('💾 Cache Stored:', request.url);
        }
      })
    );
  }

  private getCacheKey(request: HttpRequest<any>): string {
    return `${request.method}-${request.url}-${JSON.stringify(request.params)}`;
  }

  private getFromCache(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.response;
  }

  private addToCache(key: string, response: HttpResponse<any>): void {
    const entry: CacheEntry = {
      response: response.clone(),
      timestamp: Date.now()
    };
    
    this.cache.set(key, entry);
    
    // Limpiar cache viejo cada 100 entradas
    if (this.cache.size > 100) {
      this.cleanOldEntries();
    }
  }

  private cleanOldEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🧹 Cache cleaned: ${keysToDelete.length} entries removed`);
  }

  // Método público para limpiar cache manualmente
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared manually');
  }

  // Método para limpiar cache de un endpoint específico
  clearCacheForUrl(url: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (key.includes(url)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Cache cleared for ${url}: ${keysToDelete.length} entries removed`);
  }
}