// src/modules/cuentas/CuentaForm.js
import React, { useState, useEffect } from 'react';
import { FormField, Button } from '../../components/ui';
import { validateCuenta } from '../../utils/validations';

const CuentaForm = ({ cuenta, clientes, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    tipoCuenta: '',
    saldoInicial: '',
    estado: true,
    clienteId: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Llenar formulario cuando se edita una cuenta
  useEffect(() => {
    if (cuenta) {
      setFormData({
        numeroCuenta: cuenta.numeroCuenta,
        tipoCuenta: cuenta.tipoCuenta,
        saldoInicial: cuenta.saldoInicial.toString(),
        estado: cuenta.estado,
        clienteId: cuenta.clienteId.toString()
      });
    }
  }, [cuenta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateCuenta(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const payload = {
        ...formData,
        saldoInicial: parseFloat(formData.saldoInicial),
        clienteId: parseInt(formData.clienteId)
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
        label="Número de Cuenta"
        value={formData.numeroCuenta}
        onChange={(value) => handleFieldChange('numeroCuenta', value)}
        required
        error={formErrors.numeroCuenta}
        placeholder="Entre 6 y 10 dígitos"
      />

      <FormField
        label="Tipo de Cuenta"
        value={formData.tipoCuenta}
        onChange={(value) => handleFieldChange('tipoCuenta', value)}
        options={[
          { value: 'Ahorro', label: 'Ahorro' },
          { value: 'Corriente', label: 'Corriente' }
        ]}
        required
        error={formErrors.tipoCuenta}
      />

      <FormField
        label="Saldo Inicial"
        type="number"
        step="0.01"
        value={formData.saldoInicial}
        onChange={(value) => handleFieldChange('saldoInicial', value)}
        required
        error={formErrors.saldoInicial}
        placeholder="0.00"
      />

      <FormField
        label="Cliente"
        value={formData.clienteId}
        onChange={(value) => handleFieldChange('clienteId', value)}
        options={clientes.map(cliente => ({
          value: cliente.clienteId.toString(),
          label: `${cliente.nombre} - ${cliente.identificacion}`
        }))}
        required
        error={formErrors.clienteId}
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.estado}
            onChange={(e) => handleFieldChange('estado', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Cuenta activa
        </label>
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
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default CuentaForm;