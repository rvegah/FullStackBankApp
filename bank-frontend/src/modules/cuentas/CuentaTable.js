// src/modules/cuentas/CuentaTable.js
import React from 'react';
import { Button } from '../../components/ui';

const CuentaTable = ({ cuentas, onEdit, onDelete, loading }) => {
  const handleDelete = (cuenta) => {
    if (window.confirm(`¿Está seguro de eliminar la cuenta "${cuenta.numeroCuenta}"?`)) {
      onDelete(cuenta.cuentaId);
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
        Cargando cuentas...
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
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Número de Cuenta</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Tipo</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Saldo Inicial</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Cliente</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta, index) => (
            <tr key={cuenta.cuentaId} style={{ 
              borderBottom: '1px solid #dee2e6',
              backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
            }}>
              <td style={{ padding: '12px 15px' }}>{cuenta.cuentaId}</td>
              <td style={{ padding: '12px 15px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {cuenta.numeroCuenta}
              </td>
              <td style={{ padding: '12px 15px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: cuenta.tipoCuenta === 'Ahorro' ? '#e3f2fd' : '#fff3e0',
                  color: cuenta.tipoCuenta === 'Ahorro' ? '#1976d2' : '#f57c00'
                }}>
                  {cuenta.tipoCuenta}
                </span>
              </td>
              <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#28a745' }}>
                ${cuenta.saldoInicial.toFixed(2)}
              </td>
              <td style={{ padding: '12px 15px' }}>
                {cuenta.nombreCliente || 'Sin asignar'}
              </td>
              <td style={{ padding: '12px 15px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: cuenta.estado ? '#d4edda' : '#f8d7da',
                  color: cuenta.estado ? '#155724' : '#721c24'
                }}>
                  {cuenta.estado ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                <Button
                  variant="warning"
                  size="small"
                  onClick={() => onEdit(cuenta)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(cuenta)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cuentas.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#6c757d'
        }}>
          No se encontraron cuentas
        </div>
      )}
    </div>
  );
};

export default CuentaTable;