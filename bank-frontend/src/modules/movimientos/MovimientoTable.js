// src/modules/movimientos/MovimientoTable.js
import React from 'react';
import { Button } from '../../components/ui';
import { formatDate, formatCurrency } from '../../utils/validations';

const MovimientoTable = ({ movimientos, onEdit, onDelete, loading }) => {
  const handleDelete = (movimiento) => {
    if (window.confirm(`¿Está seguro de eliminar el movimiento de ${formatCurrency(movimiento.valor)}?`)) {
      onDelete(movimiento.movimientoId);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Cargando movimientos...
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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Tipo</th>
            <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Valor</th>
            <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Saldo</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Cuenta</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Cliente</th>
            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento, index) => (
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
              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                <Button
                  variant="warning"
                  size="small"
                  onClick={() => onEdit(movimiento)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(movimiento)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {movimientos.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#6c757d'
        }}>
          No se encontraron movimientos
        </div>
      )}
    </div>
  );
};

export default MovimientoTable;