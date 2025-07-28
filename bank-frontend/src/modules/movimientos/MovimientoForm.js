// src/modules/movimientos/MovimientoForm.js
import React, { useState, useEffect } from 'react';
import { FormField, Button } from '../../components/ui';
import { validateMovimiento } from '../../utils/validations';

const MovimientoForm = ({ movimiento, cuentas, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    tipoMovimiento: '',
    valor: '',
    cuentaId: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  // Llenar formulario cuando se edita un movimiento
  useEffect(() => {
    if (movimiento) {
      setFormData({
        tipoMovimiento: movimiento.tipoMovimiento,
        valor: Math.abs(movimiento.valor).toString(), // Siempre mostrar valor positivo
        cuentaId: movimiento.cuentaId.toString()
      });
    }
  }, [movimiento]);

  // Buscar cuenta seleccionada para mostrar información
  useEffect(() => {
    if (formData.cuentaId) {
      const cuenta = cuentas.find(c => c.cuentaId.toString() === formData.cuentaId);
      setSelectedCuenta(cuenta);
    } else {
      setSelectedCuenta(null);
    }
  }, [formData.cuentaId, cuentas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateMovimiento(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const payload = {
        ...formData,
        valor: parseFloat(formData.valor),
        cuentaId: parseInt(formData.cuentaId)
      };
      
      try {
        await onSubmit(payload);
      } catch (err) {
        // Error handling is done in the parent component
      }
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Tipo de Movimiento"
        value={formData.tipoMovimiento}
        onChange={(value) => handleFieldChange('tipoMovimiento', value)}
        options={[
          { value: 'Crédito', label: 'Crédito (Depósito)' },
          { value: 'Débito', label: 'Débito (Retiro)' }
        ]}
        required
        error={formErrors.tipoMovimiento}
      />

      <FormField
        label="Valor"
        type="number"
        step="0.01"
        value={formData.valor}
        onChange={(value) => handleFieldChange('valor', value)}
        required
        error={formErrors.valor}
        placeholder="0.00"
      />

      <FormField
        label="Cuenta"
        value={formData.cuentaId}
        onChange={(value) => handleFieldChange('cuentaId', value)}
        options={cuentas.map(cuenta => ({
          value: cuenta.cuentaId.toString(),
          label: `${cuenta.numeroCuenta} - ${cuenta.nombreCliente || 'Sin cliente'} (${cuenta.tipoCuenta})`
        }))}
        required
        error={formErrors.cuentaId}
      />

      {/* Información de la cuenta seleccionada */}
      {selectedCuenta && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Información de la Cuenta</h4>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            <div><strong>Número:</strong> {selectedCuenta.numeroCuenta}</div>
            <div><strong>Tipo:</strong> {selectedCuenta.tipoCuenta}</div>
            <div><strong>Cliente:</strong> {selectedCuenta.nombreCliente}</div>
            <div><strong>Saldo Inicial:</strong> ${selectedCuenta.saldoInicial.toFixed(2)}</div>
            <div><strong>Estado:</strong> {selectedCuenta.estado ? 'Activa' : 'Inactiva'}</div>
          </div>
        </div>
      )}

      {/* Advertencias sobre validaciones de negocio */}
      <div style={{
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #ffeaa7',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Validaciones del Sistema</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
          <li>Los débitos no pueden exceder el saldo disponible</li>
          <li>Límite diario de débitos: $1,000</li>
          <li>Valor máximo por transacción: $10,000</li>
          <li>Solo se permiten valores positivos</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Realizar Movimiento'}
        </Button>
      </div>
    </form>
  );
};

export default MovimientoForm;