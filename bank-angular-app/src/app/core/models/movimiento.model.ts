import { Cuenta } from './cuenta.model';

export interface Movimiento {
  movimientoId?: number;
  fecha: Date | string;
  tipoMovimiento: 'Crédito' | 'Débito';
  valor: number;
  saldo: number;
  cuentaId: number;
  cuenta?: Cuenta;
}

export interface MovimientoCreateDto {
  tipoMovimiento: string;
  valor: number;
  cuentaId: number;
}

export interface MovimientoUpdateDto extends MovimientoCreateDto {
  movimientoId: number;
}