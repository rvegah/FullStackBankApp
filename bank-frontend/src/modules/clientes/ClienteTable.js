// src/modules/clientes/ClienteTable.js
import React from 'react';
import { Button } from '../../components/ui';

const ClienteTable = ({ clientes, onEdit, onDelete, loading }) => {
  const handleDelete = (cliente) => {
    if (window.confirm(`¿Está seguro de eliminar al cliente "${cliente.nombre}"?`)) {
      onDelete(cliente.clienteId);
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
        Cargando clientes...
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
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nombre</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Género</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Edad</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Identificación</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Teléfono</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={cliente.clienteId} style={{ 
              borderBottom: '1px solid #dee2e6',
              backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
            }}>
              <td style={{ padding: '12px 15px' }}>{cliente.clienteId}</td>
              <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{cliente.nombre}</td>
              <td style={{ padding: '12px 15px' }}>{cliente.genero === 'M' ? 'Masculino' : 'Femenino'}</td>
              <td style={{ padding: '12px 15px' }}>{cliente.edad}</td>
              <td style={{ padding: '12px 15px' }}>{cliente.identificacion}</td>
              <td style={{ padding: '12px 15px' }}>{cliente.telefono}</td>
              <td style={{ padding: '12px 15px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: cliente.estado ? '#d4edda' : '#f8d7da',
                  color: cliente.estado ? '#155724' : '#721c24'
                }}>
                  {cliente.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                <Button
                  variant="warning"
                  size="small"
                  onClick={() => onEdit(cliente)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(cliente)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clientes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#6c757d'
        }}>
          No se encontraron clientes
        </div>
      )}
    </div>
  );
};

export default ClienteTable;