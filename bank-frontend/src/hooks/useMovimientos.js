// src/hooks/useMovimientos.js
import { useState, useEffect } from 'react';
import { movimientoService } from '../services/movimientoService';
import { cuentaService } from '../services/cuentaService';
import { clienteService } from '../services/clienteService';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar todos los datos necesarios
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [movimientosData, cuentasData, clientesData] = await Promise.all([
        movimientoService.getAll(),
        cuentaService.getAll(),
        clienteService.getAll()
      ]);
      setMovimientos(movimientosData);
      setCuentas(cuentasData);
      setClientes(clientesData);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear movimiento (aquí es donde se aplican las validaciones de negocio)
  const createMovimiento = async (movimientoData) => {
    try {
      setLoading(true);
      setError('');
      const newMovimiento = await movimientoService.create(movimientoData);
      await loadData(); // Recargar datos para ver saldos actualizados
      return newMovimiento;
    } catch (err) {
      // Los errores de negocio vienen del backend con mensajes específicos
      setError('Error: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar movimiento
  const updateMovimiento = async (id, movimientoData) => {
    try {
      setLoading(true);
      setError('');
      const updatedMovimiento = await movimientoService.update(id, movimientoData);
      await loadData(); // Recargar datos
      return updatedMovimiento;
    } catch (err) {
      setError('Error al actualizar movimiento: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar movimiento
  const deleteMovimiento = async (id) => {
    try {
      setLoading(true);
      setError('');
      await movimientoService.delete(id);
      await loadData(); // Recargar datos
    } catch (err) {
      setError('Error al eliminar movimiento: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener movimientos por cuenta
  const getMovimientosByCuenta = async (cuentaId) => {
    try {
      setLoading(true);
      setError('');
      const data = await movimientoService.getByCuentaId(cuentaId);
      return data;
    } catch (err) {
      setError('Error al cargar movimientos: ' + err.message);
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
    movimientos,
    cuentas,
    clientes,
    loading,
    error,
    loadData,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    getMovimientosByCuenta,
    setError
  };
};