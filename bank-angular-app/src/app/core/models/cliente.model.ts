import { Persona } from './persona.model';

export interface Cliente extends Persona {
  clienteId?: number;
  contrasena: string;
  estado: boolean;
}

export interface ClienteCreateDto {
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  contrasena: string;
  estado: boolean;
}

export interface ClienteUpdateDto extends ClienteCreateDto {
  clienteId: number;
}