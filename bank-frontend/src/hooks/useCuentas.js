// src/hooks/useCuentas.js
import { useState, useEffect } from 'react';
import { cuentaService } from '../services/cuentaService';
import { clienteService } from '../services/clienteService';

export const useCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar cuentas y clientes
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cuentasData, clientesData] = await Promise.all([
        cuentaService.getAll(),
        clienteService.getAll()
      ]);
      setCuentas(cuentasData);
      setClientes(clientesData);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear cuenta
  const createCuenta = async (cuentaData) => {
    try {
      setLoading(true);
      setError('');
      const newCuenta = await cuentaService.create(cuentaData);
      await loadData(); // Recargar datos
      return newCuenta;
    } catch (err) {
      setError('Error al crear cuenta: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cuenta
  const updateCuenta = async (id, cuentaData) => {
    try {
      setLoading(true);
      setError('');
      const updatedCuenta = await cuentaService.update(id, cuentaData);
      await loadData(); // Recargar datos
      return updatedCuenta;
    } catch (err) {
      setError('Error al actualizar cuenta: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cuenta
  const deleteCuenta = async (id) => {
    try {
      setLoading(true);
      setError('');
      await cuentaService.delete(id);
      await loadData(); // Recargar datos
    } catch (err) {
      setError('Error al eliminar cuenta: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el hook
  useEffect(() => {
    loadData();
  }, []);

  return {
    cuentas,
    clientes,
    loading,
    error,
    loadData,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    setError
  };
};