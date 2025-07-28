// src/modules/movimientos/MovimientoManager.js
import React, { useState, useMemo } from 'react';
import { Button, Modal, SearchBox } from '../../components/ui';
import { useMovimientos } from '../../hooks/useMovimientos';
import { filterMovimientos, formatCurrency } from '../../utils/validations';
import MovimientoForm from './MovimientoForm';
import MovimientoTable from './MovimientoTable';

const MovimientoManager = () => {
  const {
    movimientos,
    cuentas,
    loading,
    error,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    setError
  } = useMovimientos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar movimientos basado en búsqueda
  const filteredMovimientos = useMemo(() => {
    return filterMovimientos(movimientos, searchTerm);
  }, [movimientos, searchTerm]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayMovimientos = movimientos.filter(m => 
      new Date(m.fecha) >= startOfDay
    );

    return {
      total: movimientos.length,
      hoy: todayMovimientos.length,
      creditos: movimientos.filter(m => m.tipoMovimiento === 'Crédito').length,
      debitos: movimientos.filter(m => m.tipoMovimiento === 'Débito').length,
      totalCreditos: movimientos
        .filter(m => m.tipoMovimiento === 'Crédito')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0),
      totalDebitos: movimientos
        .filter(m => m.tipoMovimiento === 'Débito')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0),
      debitosHoy: todayMovimientos
        .filter(m => m.tipoMovimiento === 'Débito')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0)
    };
  }, [movimientos]);

  // Manejar creación/edición de movimiento
  const handleSubmit = async (movimientoData) => {
    try {
      if (editingMovimiento) {
        await updateMovimiento(editingMovimiento.movimientoId, movimientoData);
      } else {
        await createMovimiento(movimientoData);
      }
      handleCloseModal();
    } catch (err) {
      // Error ya manejado en el hook, se muestra en la UI
      throw err;
    }
  };

  // Manejar edición
  const handleEdit = (movimiento) => {
    setEditingMovimiento(movimiento);
    setIsModalOpen(true);
  };

  // Manejar eliminación
  const handleDelete = async (movimientoId) => {
    try {
      await deleteMovimiento(movimientoId);
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  // Manejar apertura del modal para nuevo movimiento
  const handleNewMovimiento = () => {
    setEditingMovimiento(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovimiento(null);
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
          <h1 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Gestión de Movimientos</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '15px',
            fontSize: '14px'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#007bff' }}>{stats.total}</div>
              <div style={{ color: '#6c757d' }}>Total</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#17a2b8' }}>{stats.hoy}</div>
              <div style={{ color: '#6c757d' }}>Hoy</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>{stats.creditos}</div>
              <div style={{ color: '#6c757d' }}>Créditos</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#dc3545' }}>{stats.debitos}</div>
              <div style={{ color: '#6c757d' }}>Débitos</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(stats.totalCreditos)}</div>
              <div style={{ color: '#6c757d' }}>Total Créditos</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#dc3545' }}>{formatCurrency(stats.totalDebitos)}</div>
              <div style={{ color: '#6c757d' }}>Total Débitos</div>
            </div>
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                color: stats.debitosHoy >= 1000 ? '#dc3545' : '#ffc107' 
              }}>
                {formatCurrency(stats.debitosHoy)}
              </div>
              <div style={{ color: '#6c757d' }}>Débitos Hoy</div>
            </div>
          </div>
        </div>

        {/* Botón nuevo movimiento */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="success"
            size="large"
            onClick={handleNewMovimiento}
          >
            + Nuevo Movimiento
          </Button>
        </div>
      </div>

      {/* Alerta de límite diario */}
      {stats.debitosHoy >= 800 && (
        <div style={{
          backgroundColor: stats.debitosHoy >= 1000 ? '#f8d7da' : '#fff3cd',
          color: stats.debitosHoy >= 1000 ? '#721c24' : '#856404',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: `1px solid ${stats.debitosHoy >= 1000 ? '#f5c6cb' : '#ffeaa7'}`,
          fontWeight: 'bold'
        }}>
          {stats.debitosHoy >= 1000 ? '🚫' : '⚠️'} 
          {stats.debitosHoy >= 1000 
            ? ` LÍMITE DIARIO ALCANZADO: Se han realizado débitos por ${formatCurrency(stats.debitosHoy)} hoy`
            : ` CERCA DEL LÍMITE: Se han realizado débitos por ${formatCurrency(stats.debitosHoy)} de $1,000 permitidos hoy`
          }
        </div>
      )}

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
        Mostrando {filteredMovimientos.length} de {movimientos.length} movimiento{movimientos.length !== 1 ? 's' : ''}
        {searchTerm && ` (filtrado por: "${searchTerm}")`}
      </div>

      <SearchBox
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por cuenta, cliente, tipo o valor..."
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

      {/* Tabla de movimientos */}
      <MovimientoTable
        movimientos={filteredMovimientos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMovimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        size="medium"
      >
        <MovimientoForm
          movimiento={editingMovimiento}
          cuentas={cuentas}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default MovimientoManager;