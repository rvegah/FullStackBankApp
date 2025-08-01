import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente, ClienteCreateDto, ClienteUpdateDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly endpoint = 'Cliente';

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(this.endpoint);
  }

  getById(id: number): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  create(cliente: ClienteCreateDto): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  update(id: number, cliente: ClienteUpdateDto): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}