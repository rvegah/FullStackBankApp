// src/modules/cuentas/CuentaManager.js
import React, { useState, useMemo } from 'react';
import { Button, Modal, SearchBox } from '../../components/ui';
import { useCuentas } from '../../hooks/useCuentas';
import { filterCuentas } from '../../utils/validations';
import CuentaForm from './CuentaForm';
import CuentaTable from './CuentaTable';

const CuentaManager = () => {
  const {
    cuentas,
    clientes,
    loading,
    error,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    setError
  } = useCuentas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar cuentas basado en búsqueda
  const filteredCuentasData = useMemo(() => {
    return filterCuentas(cuentas, searchTerm);
  }, [cuentas, searchTerm]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    return {
      total: cuentas.length,
      activas: cuentas.filter(c => c.estado).length,
      ahorro: cuentas.filter(c => c.tipoCuenta === 'Ahorro').length,
      corriente: cuentas.filter(c => c.tipoCuenta === 'Corriente').length,
      saldoTotal: cuentas.reduce((sum, c) => sum + c.saldoInicial, 0)
    };
  }, [cuentas]);

  // Manejar creación/edición de cuenta
  const handleSubmit = async (cuentaData) => {
    try {
      if (editingCuenta) {
        await updateCuenta(editingCuenta.cuentaId, cuentaData);
      } else {
        await createCuenta(cuentaData);
      }
      handleCloseModal();
    } catch (err) {
      // Error ya manejado en el hook
      throw err;
    }
  };

  // Manejar edición
  const handleEdit = (cuenta) => {
    setEditingCuenta(cuenta);
    setIsModalOpen(true);
  };

  // Manejar eliminación
  const handleDelete = async (cuentaId) => {
    try {
      await deleteCuenta(cuentaId);
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  // Manejar apertura del modal para nueva cuenta
  const handleNewCuenta = () => {
    setEditingCuenta(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCuenta(null);
  };

  // Limpiar error
  const handleClearError = () => {
    setError('');
  };

  return (
    <div>
      {/* Header con estadísticas */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Información y estadísticas */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Gestión de Cuentas</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '15px',
            fontSize: '14px'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#007bff' }}>{stats.total}</div>
              <div style={{ color: '#6c757d' }}>Total</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>{stats.activas}</div>
              <div style={{ color: '#6c757d' }}>Activas</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#17a2b8' }}>{stats.ahorro}</div>
              <div style={{ color: '#6c757d' }}>Ahorro</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#fd7e14' }}>{stats.corriente}</div>
              <div style={{ color: '#6c757d' }}>Corriente</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>${stats.saldoTotal.toFixed(2)}</div>
              <div style={{ color: '#6c757d' }}>Saldo Total</div>
            </div>
          </div>
        </div>

        {/* Botón nueva cuenta */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="success"
            size="large"
            onClick={handleNewCuenta}
          >
            + Nueva Cuenta
          </Button>
        </div>
      </div>

      {/* Contador y búsqueda */}
      <div style={{
        marginBottom: '10px',
        padding: '10px 15px',
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0',
        borderBottom: '1px solid #dee2e6',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        Mostrando {filteredCuentasData.length} de {cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''}
        {searchTerm && ` (filtrado por: "${searchTerm}")`}
      </div>

      <SearchBox
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por número de cuenta, cliente o tipo..."
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

      {/* Tabla de cuentas */}
      <CuentaTable
        cuentas={filteredCuentasData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
        size="medium"
      >
        <CuentaForm
          cuenta={editingCuenta}
          clientes={clientes}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default CuentaManager;