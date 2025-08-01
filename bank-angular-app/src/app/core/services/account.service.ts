import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cuenta, CuentaCreateDto, CuentaUpdateDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly endpoint = 'Cuenta';

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Cuenta[]> {
    return this.apiService.get<Cuenta[]>(this.endpoint);
  }

  getById(id: number): Observable<Cuenta> {
    return this.apiService.get<Cuenta>(`${this.endpoint}/${id}`);
  }

  getByClientId(clientId: number): Observable<Cuenta[]> {
    return this.apiService.get<Cuenta[]>(`${this.endpoint}/cliente/${clientId}`);
  }

  create(cuenta: CuentaCreateDto): Observable<Cuenta> {
    return this.apiService.post<Cuenta>(this.endpoint, cuenta);
  }

  update(id: number, cuenta: CuentaUpdateDto): Observable<Cuenta> {
    return this.apiService.put<Cuenta>(`${this.endpoint}/${id}`, cuenta);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}