// src/hooks/useClientes.js
import { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const createCliente = async (clienteData) => {
    try {
      setLoading(true);
      setError('');
      const newCliente = await clienteService.create(clienteData);
      await loadClientes(); // Recargar lista
      return newCliente;
    } catch (err) {
      setError('Error al crear cliente: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cliente
  const updateCliente = async (id, clienteData) => {
    try {
      setLoading(true);
      setError('');
      const updatedCliente = await clienteService.update(id, clienteData);
      await loadClientes(); // Recargar lista
      return updatedCliente;
    } catch (err) {
      setError('Error al actualizar cliente: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cliente
  const deleteCliente = async (id) => {
    try {
      setLoading(true);
      setError('');
      await clienteService.delete(id);
      await loadClientes(); // Recargar lista
    } catch (err) {
      setError('Error al eliminar cliente: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes al montar el hook
  useEffect(() => {
    loadClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    setError
  };
};