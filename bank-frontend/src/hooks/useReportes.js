// src/hooks/useReportes.js
import { useState } from 'react';
import { movimientoService } from '../services/movimientoService';
import { clienteService } from '../services/clienteService';

export const useReportes = () => {
  const [reportData, setReportData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar clientes para el filtro
  const loadClientes = async () => {
    try {
      const clientesData = await clienteService.getAll();
      setClientes(clientesData);
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message);
    }
  };

  // Generar reporte
  const generateReport = async (fechaInicio, fechaFin, clienteId = null) => {
    try {
      setLoading(true);
      setError('');
      
      const data = await movimientoService.getReportes(fechaInicio, fechaFin, clienteId);
      setReportData(data);
      
      return data;
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar reporte
  const clearReport = () => {
    setReportData([]);
    setError('');
  };

  return {
    reportData,
    clientes,
    loading,
    error,
    generateReport,
    loadClientes,
    clearReport,
    setError
  };
};