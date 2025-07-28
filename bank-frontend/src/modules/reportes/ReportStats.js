// src/modules/reportes/ReportStats.js
import React from 'react';
import { formatCurrency } from '../../utils/validations';

const ReportStats = ({ stats, filtros }) => {
  const StatCard = ({ title, value, subtitle, color = '#007bff', icon }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>{icon}</span>
        <h4 style={{ margin: 0, color: '#495057', fontSize: '16px' }}>{title}</h4>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color, marginBottom: '5px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Header del reporte */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>📈 Estado de Cuenta</h2>
        <div style={{ color: '#6c757d', fontSize: '14px' }}>
          <div><strong>Período:</strong> {filtros.fechaInicio} al {filtros.fechaFin}</div>
          <div><strong>Cliente:</strong> {filtros.clienteNombre || 'Todos los clientes'}</div>
          <div><strong>Generado:</strong> {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}</div>
        </div>
      </div>

      {/* Grid de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <StatCard
          title="Total Movimientos"
          value={stats.totalMovimientos}
          subtitle="En el período seleccionado"
          color="#007bff"
          icon="📊"
        />

        <StatCard
          title="Créditos"
          value={stats.totalCreditos}
          subtitle={formatCurrency(stats.montoCreditos)}
          color="#28a745"
          icon="⬆️"
        />

        <StatCard
          title="Débitos"
          value={stats.totalDebitos}
          subtitle={formatCurrency(stats.montoDebitos)}
          color="#dc3545"
          icon="⬇️"
        />

        <StatCard
          title="Diferencia"
          value={formatCurrency(stats.diferencia)}
          subtitle={stats.diferencia >= 0 ? 'Balance positivo' : 'Balance negativo'}
          color={stats.diferencia >= 0 ? '#28a745' : '#dc3545'}
          icon={stats.diferencia >= 0 ? '✅' : '⚠️'}
        />

        <StatCard
          title="Saldo Final"
          value={formatCurrency(stats.saldoFinal)}
          subtitle="Al final del período"
          color={stats.saldoFinal >= 0 ? '#28a745' : '#dc3545'}
          icon="💰"
        />

        <StatCard
          title="Promedio por Movimiento"
          value={formatCurrency(stats.totalMovimientos > 0 ? (stats.montoCreditos + stats.montoDebitos) / stats.totalMovimientos : 0)}
          subtitle="Valor promedio"
          color="#17a2b8"
          icon="📈"
        />
      </div>
    </div>
  );
};

export default ReportStats;