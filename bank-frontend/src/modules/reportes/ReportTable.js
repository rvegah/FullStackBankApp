// src/modules/reportes/ReportTable.js
import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { formatDate, formatCurrency } from '../../utils/validations';

const ReportTable = ({ movimientos }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  // Ordenar movimientos
  const sortedMovimientos = React.useMemo(() => {
    let sortableMovimientos = [...movimientos];
    
    if (sortConfig.key) {
      sortableMovimientos.sort((a, b) => {
        if (sortConfig.key === 'fecha') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortConfig.key === 'valor' || sortConfig.key === 'saldo') {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableMovimientos;
  }, [movimientos, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↕️';
  };

  if (movimientos.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
        <h3>No se encontraron movimientos</h3>
        <p>No hay movimientos en el período seleccionado para este cliente.</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Header de la tabla */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h4 style={{ margin: 0, color: '#495057' }}>📋 Detalle de Movimientos</h4>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          {movimientos.length} movimiento{movimientos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('movimientoId')}
              >
                ID{getSortIcon('movimientoId')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('fecha')}
              >
                Fecha{getSortIcon('fecha')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('tipoMovimiento')}
              >
                Tipo{getSortIcon('tipoMovimiento')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('valor')}
              >
                Valor{getSortIcon('valor')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('saldo')}
              >
                Saldo{getSortIcon('saldo')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('numeroCuenta')}
              >
                Cuenta{getSortIcon('numeroCuenta')}
              </th>
              <th 
                style={{ 
                  padding: '12px 15px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => requestSort('nombreCliente')}
              >
                Cliente{getSortIcon('nombreCliente')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMovimientos.map((movimiento, index) => (
              <tr key={movimiento.movimientoId} style={{
                borderBottom: '1px solid #dee2e6',
                backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
              }}>
                <td style={{ padding: '12px 15px' }}>{movimiento.movimientoId}</td>
                <td style={{ padding: '12px 15px', fontSize: '13px' }}>
                  {formatDate(movimiento.fecha)}
                </td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: movimiento.tipoMovimiento === 'Crédito' ? '#d4edda' : '#f8d7da',
                    color: movimiento.tipoMovimiento === 'Crédito' ? '#155724' : '#721c24'
                  }}>
                    {movimiento.tipoMovimiento}
                  </span>
                </td>
                <td style={{
                  padding: '12px 15px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  color: movimiento.tipoMovimiento === 'Crédito' ? '#28a745' : '#dc3545'
                }}>
                  {movimiento.tipoMovimiento === 'Crédito' ? '+' : '-'}{formatCurrency(Math.abs(movimiento.valor))}
                </td>
                <td style={{
                  padding: '12px 15px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  color: movimiento.saldo >= 0 ? '#28a745' : '#dc3545'
                }}>
                  {formatCurrency(movimiento.saldo)}
                </td>
                <td style={{ padding: '12px 15px', fontFamily: 'monospace' }}>
                  {movimiento.numeroCuenta || 'N/A'}
                </td>
                <td style={{ padding: '12px 15px' }}>
                  {movimiento.nombreCliente || 'Sin asignar'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;