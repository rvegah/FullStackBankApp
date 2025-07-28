// src/services/cuentaService.js
import { apiCall } from './apiService';

export const cuentaService = {
  // Obtener todas las cuentas
  getAll: async () => {
    return await apiCall('/Cuenta');
  },

  // Obtener cuenta por ID
  getById: async (id) => {
    return await apiCall(`/Cuenta/${id}`);
  },

  // Obtener cuentas por cliente ID
  getByClienteId: async (clienteId) => {
    return await apiCall(`/Cuenta/cliente/${clienteId}`);
  },

  // Crear nueva cuenta
  create: async (cuentaData) => {
    return await apiCall('/Cuenta', {
      method: 'POST',
      body: JSON.stringify(cuentaData)
    });
  },

  // Actualizar cuenta
  update: async (id, cuentaData) => {
    return await apiCall(`/Cuenta/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cuentaData)
    });
  },

  // Eliminar cuenta
  delete: async (id) => {
    return await apiCall(`/Cuenta/${id}`, {
      method: 'DELETE'
    });
  }
};