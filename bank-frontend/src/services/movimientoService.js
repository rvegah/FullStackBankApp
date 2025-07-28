// src/services/movimientoService.js
import { apiCall } from './apiService';

export const movimientoService = {
  // Obtener todos los movimientos
  getAll: async () => {
    return await apiCall('/Movimiento');
  },

  // Obtener movimiento por ID
  getById: async (id) => {
    return await apiCall(`/Movimiento/${id}`);
  },

  // Obtener movimientos por cuenta ID
  getByCuentaId: async (cuentaId) => {
    return await apiCall(`/Movimiento/cuenta/${cuentaId}`);
  },

  // Obtener movimientos por cliente ID
  getByClienteId: async (clienteId) => {
    return await apiCall(`/Movimiento/cliente/${clienteId}`);
  },

  // Obtener reportes por rango de fechas
  getReportes: async (fechaInicio, fechaFin, clienteId = null) => {
    let endpoint = `/Movimiento/reportes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    if (clienteId) {
      endpoint += `&clienteId=${clienteId}`;
    }
    return await apiCall(endpoint);
  },

  // Crear nuevo movimiento
  create: async (movimientoData) => {
    return await apiCall('/Movimiento', {
      method: 'POST',
      body: JSON.stringify(movimientoData)
    });
  },

  // Actualizar movimiento
  update: async (id, movimientoData) => {
    return await apiCall(`/Movimiento/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movimientoData)
    });
  },

  // Eliminar movimiento
  delete: async (id) => {
    return await apiCall(`/Movimiento/${id}`, {
      method: 'DELETE'
    });
  }
};