// src/modules/reportes/ReportFilters.js
import React, { useState, useEffect } from 'react';
import { FormField, Button } from '../../components/ui';

const ReportFilters = ({ clientes, onGenerate, loading }) => {
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    clienteId: ''
  });

  const [errors, setErrors] = useState({});

  // Establecer fechas por defecto (último mes)
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    setFilters({
      fechaInicio: lastMonth.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0],
      clienteId: ''
    });
  }, []);

  const validateFilters = () => {
    const newErrors = {};

    if (!filters.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!filters.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (filters.fechaInicio && filters.fechaFin) {
      const inicio = new Date(filters.fechaInicio);
      const fin = new Date(filters.fechaFin);
      
      if (inicio > fin) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }

      // Validar que no sea más de 1 año
      const diffTime = Math.abs(fin - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 365) {
        newErrors.fechaFin = 'El rango no puede ser mayor a 1 año';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateFilters()) {
      const clienteSeleccionado = clientes.find(c => c.clienteId.toString() === filters.clienteId);
      
      onGenerate({
        ...filters,
        clienteNombre: clienteSeleccionado?.nombre || null
      });
    }
  };

  const handleFieldChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const setQuickRange = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    setFilters({
      ...filters,
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0]
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>🔍 Filtros de Reporte</h3>
      
      {/* Botones de rangos rápidos */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
          Rangos rápidos:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setQuickRange(7)}
          >
            Últimos 7 días
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setQuickRange(30)}
          >
            Últimos 30 días
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setQuickRange(90)}
          >
            Últimos 3 meses
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setQuickRange(365)}
          >
            Último año
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <FormField
            label="Fecha de Inicio"
            type="date"
            value={filters.fechaInicio}
            onChange={(value) => handleFieldChange('fechaInicio', value)}
            required
            error={errors.fechaInicio}
          />

          <FormField
            label="Fecha de Fin"
            type="date"
            value={filters.fechaFin}
            onChange={(value) => handleFieldChange('fechaFin', value)}
            required
            error={errors.fechaFin}
          />

          <FormField
            label="Cliente (Opcional)"
            value={filters.clienteId}
            onChange={(value) => handleFieldChange('clienteId', value)}
            options={clientes.map(cliente => ({
              value: cliente.clienteId.toString(),
              label: `${cliente.nombre} - ${cliente.identificacion}`
            }))}
            error={errors.clienteId}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '15px',
          borderTop: '1px solid #dee2e6'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            {filters.fechaInicio && filters.fechaFin && (
              <>
                Período seleccionado: {Math.ceil((new Date(filters.fechaFin) - new Date(filters.fechaInicio)) / (1000 * 60 * 60 * 24))} días
              </>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
          >
            {loading ? 'Generando...' : '📊 Generar Reporte'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportFilters;