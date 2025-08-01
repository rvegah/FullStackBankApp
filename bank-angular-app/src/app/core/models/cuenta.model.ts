// src/app/core/models/cliente.model.ts
import { Cliente } from './cliente.model';

export interface Cuenta {
  cuentaId?: number;
  numeroCuenta: string;
  tipoCuenta: 'Ahorro' | 'Corriente';
  saldoInicial: number;
  estado: boolean;
  clienteId: number;
  cliente?: Cliente;
}

export interface CuentaCreateDto {
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  clienteId: number;
}

export interface CuentaUpdateDto extends CuentaCreateDto {
  cuentaId: number;
}