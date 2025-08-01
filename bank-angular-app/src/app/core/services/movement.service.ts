import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Movimiento, MovimientoCreateDto, MovimientoUpdateDto, ReporteMovimiento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private readonly endpoint = 'Movimiento';

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(this.endpoint);
  }

  getById(id: number): Observable<Movimiento> {
    return this.apiService.get<Movimiento>(`${this.endpoint}/${id}`);
  }

  getByAccountId(accountId: number): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(`${this.endpoint}/cuenta/${accountId}`);
  }

  getByClientId(clientId: number): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(`${this.endpoint}/cliente/${clientId}`);
  }

  create(movimiento: MovimientoCreateDto): Observable<Movimiento> {
    return this.apiService.post<Movimiento>(this.endpoint, movimiento);
  }

  update(id: number, movimiento: MovimientoUpdateDto): Observable<Movimiento> {
    return this.apiService.put<Movimiento>(`${this.endpoint}/${id}`, movimiento);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  // Método para generar reportes
  generateReport(fechaInicio: string, fechaFin: string, clienteId?: number): Observable<ReporteMovimiento[]> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    
    if (clienteId) {
      params = params.set('clienteId', clienteId.toString());
    }

    return this.apiService.get<ReporteMovimiento[]>(`${this.endpoint}/reportes`, params);
  }
}