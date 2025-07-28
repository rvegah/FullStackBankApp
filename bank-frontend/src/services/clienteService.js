// src/services/clienteService.js
import { apiCall } from './apiService';

export const clienteService = {
  // Obtener todos los clientes
  getAll: async () => {
    return await apiCall('/Cliente');
  },

  // Obtener cliente por ID
  getById: async (id) => {
    return await apiCall(`/Cliente/${id}`);
  },

  // Crear nuevo cliente
  create: async (clienteData) => {
    return await apiCall('/Cliente', {
      method: 'POST',
      body: JSON.stringify(clienteData)
    });
  },

  // Actualizar cliente
  update: async (id, clienteData) => {
    return await apiCall(`/Cliente/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData)
    });
  },

  // Eliminar cliente
  delete: async (id) => {
    return await apiCall(`/Cliente/${id}`, {
      method: 'DELETE'
    });
  }
};