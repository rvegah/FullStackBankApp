import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Validador personalizado para cédula ecuatoriana
  static cedulaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const cedula = control.value.toString();
      if (cedula.length !== 10) return { cedulaInvalida: true };
      
      // Algoritmo de validación de cédula ecuatoriana
      const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let suma = 0;
      
      for (let i = 0; i < 9; i++) {
        let resultado = parseInt(cedula[i]) * coeficientes[i];
        if (resultado > 9) resultado -= 9;
        suma += resultado;
      }
      
      const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
      
      return digitoVerificador === parseInt(cedula[9]) ? null : { cedulaInvalida: true };
    };
  }

  // Validador para números de cuenta
  static numeroCuentaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const numero = control.value.toString();
      return numero.length >= 6 && numero.length <= 10 ? null : { numeroCuentaInvalido: true };
    };
  }

  // Validador para montos positivos
  static montoPositivoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const valor = parseFloat(control.value);
      return valor > 0 ? null : { montoInvalido: true };
    };
  }

  // Validador para edad
  static edadValidator(min: number = 18, max: number = 100): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const edad = parseInt(control.value);
      if (edad < min || edad > max) {
        return { edadInvalida: { min, max, actual: edad } };
      }
      
      return null;
    };
  }

  // Método para obtener mensajes de error personalizados
  getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    if (errors['required']) {
      return `${fieldName} es requerido`;
    }
    
    if (errors['email']) {
      return `${fieldName} debe ser un email válido`;
    }
    
    if (errors['minlength']) {
      return `${fieldName} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['maxlength']) {
      return `${fieldName} no puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
    }
    
    if (errors['cedulaInvalida']) {
      return `${fieldName} no es una cédula válida`;
    }
    
    if (errors['numeroCuentaInvalido']) {
      return `${fieldName} debe tener entre 6 y 10 dígitos`;
    }
    
    if (errors['montoInvalido']) {
      return `${fieldName} debe ser mayor a 0`;
    }
    
    if (errors['edadInvalida']) {
      return `${fieldName} debe estar entre ${errors['edadInvalida'].min} y ${errors['edadInvalida'].max} años`;
    }
    
    return `${fieldName} no es válido`;
  }
}