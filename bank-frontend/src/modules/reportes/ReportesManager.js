// src/modules/reportes/ReportesManager.js
import React, { useState, useEffect } from 'react';
import { useReportes } from '../../hooks/useReportes';
import { calculateReportStats } from '../../utils/reportUtils';
import ReportFilters from './ReportFilters';
import ReportStats from './ReportStats';
import ReportTable from './ReportTable';
import ReportActions from './ReportActions';
import { Button } from '../../components/ui';

const ReportesManager = () => {
  const {
    reportData,
    clientes,
    loading,
    error,
    generateReport,
    loadClientes,
    clearReport,
    setError
  } = useReportes();

  const [currentFilters, setCurrentFilters] = useState(null);
  const [reportStats, setReportStats] = useState(null);

  // Cargar clientes al montar
  useEffect(() => {
    loadClientes();
  }, []);

  // Calcular estadísticas cuando cambian los datos
  useEffect(() => {
    if (reportData.length > 0) {
      const stats = calculateReportStats(reportData);
      setReportStats(stats);
    } else {
      setReportStats(null);
    }
  }, [reportData]);

  // Generar reporte
  const handleGenerateReport = async (filters) => {
    try {
      setCurrentFilters(filters);
      await generateReport(filters.fechaInicio, filters.fechaFin, filters.clienteId || null);
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  // Limpiar reporte
  const handleClearReport = () => {
    clearReport();
    setCurrentFilters(null);
    setReportStats(null);
  };

  // Limpiar error
  const handleClearError = () => {
    setError('');
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>📊 Reportes y Estados de Cuenta</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
            Genere reportes detallados de movimientos bancarios
          </p>
        </div>
        {reportData.length > 0 && (
          <Button
            variant="secondary"
            onClick={handleClearReport}
          >
            🗑️ Limpiar Reporte
          </Button>
        )}
      </div>

      {/* Filtros */}
      <ReportFilters
        clientes={clientes}
        onGenerate={handleGenerateReport}
        loading={loading}
      />

      {/* Mensajes de error */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <Button
            variant="danger"
            size="small"
            onClick={handleClearError}
          >
            ×
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h3>Generando reporte...</h3>
          <p style={{ color: '#6c757d' }}>Por favor espere mientras procesamos la información</p>
        </div>
      )}

      {/* Resultados del reporte */}
      {!loading && reportData.length > 0 && reportStats && currentFilters && (
        <>
          {/* Estadísticas */}
          <ReportStats 
            stats={reportStats} 
            filtros={currentFilters} 
          />

          {/* Acciones de descarga */}
          <ReportActions
            movimientos={reportData}
            filtros={currentFilters}
            stats={reportStats}
          />

          {/* Tabla de datos */}
          <ReportTable movimientos={reportData} />
        </>
      )}

      {/* Estado vacío cuando no hay reporte generado */}
      {!loading && reportData.length === 0 && !error && (
        <div style={{
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>📈</div>
          <h3 style={{ color: '#495057', marginBottom: '15px' }}>¡Bienvenido a Reportes!</h3>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            Seleccione un rango de fechas y opcionalmente un cliente para generar un estado de cuenta detallado.
          </p>
          <p style={{ fontSize: '14px' }}>
            Podrá descargar el reporte en múltiples formatos: TXT, JSON, CSV o imprimirlo directamente.
          </p>
        </div>
      )}

      {/* Información adicional */}
      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
        border: '1px solid #bbdefb'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>ℹ️ Información sobre Reportes</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0', fontSize: '14px' }}>
          <li>Los reportes muestran todos los movimientos en el período seleccionado</li>
          <li>Puede filtrar por cliente específico o ver todos los clientes</li>
          <li>El rango máximo permitido es de 1 año</li>
          <li>Los saldos mostrados son progresivos (después de cada movimiento)</li>
          <li>Haga clic en las columnas de la tabla para ordenar los datos</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportesManager;