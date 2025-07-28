// src/modules/clientes/ClienteManager.js
import React, { useState, useMemo } from 'react';
import { Button, Modal, SearchBox } from '../../components/ui';
import { useClientes } from '../../hooks/useClientes';
import { filterClientes } from '../../utils/validations';
import ClienteForm from './ClienteForm';
import ClienteTable from './ClienteTable';

const ClienteManager = () => {
  const {
    clientes,
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    setError
  } = useClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar clientes basado en búsqueda
  const filteredClientes = useMemo(() => {
    return filterClientes(clientes, searchTerm);
  }, [clientes, searchTerm]);

  // Manejar creación/edición de cliente
  const handleSubmit = async (clienteData) => {
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.clienteId, clienteData);
      } else {
        await createCliente(clienteData);
      }
      handleCloseModal();
    } catch (err) {
      // Error ya manejado en el hook
      throw err;
    }
  };

  // Manejar edición
  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  // Manejar eliminación
  const handleDelete = async (clienteId) => {
    try {
      await deleteCliente(clienteId);
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  // Manejar apertura del modal para nuevo cliente
  const handleNewCliente = () => {
    setEditingCliente(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestión de Clientes</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
            Total: {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
            {searchTerm && ` (filtrado de ${clientes.length})`}
          </p>
        </div>
        <Button
          variant="success"
          size="large"
          onClick={handleNewCliente}
        >
          + Nuevo Cliente
        </Button>
      </div>

      {/* Búsqueda */}
      <SearchBox
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nombre, identificación o teléfono..."
        disabled={loading}
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

      {/* Tabla de clientes */}
      <ClienteTable
        clientes={filteredClientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="medium"
      >
        <ClienteForm
          cliente={editingCliente}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default ClienteManager;