// src/modules/clientes/ClienteForm.js
import React, { useState, useEffect } from 'react';
import { FormField, Button } from '../../components/ui';
import { validateCliente } from '../../utils/validations';

const ClienteForm = ({ cliente, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    genero: '',
    edad: '',
    identificacion: '',
    direccion: '',
    telefono: '',
    contrasena: '',
    estado: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Llenar formulario cuando se edita un cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        genero: cliente.genero,
        edad: cliente.edad.toString(),
        identificacion: cliente.identificacion,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        contrasena: '****', // No mostramos la contraseña real
        estado: cliente.estado
      });
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateCliente(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const payload = {
        ...formData,
        edad: parseInt(formData.edad)
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
        label="Nombre Completo"
        value={formData.nombre}
        onChange={(value) => handleFieldChange('nombre', value)}
        required
        error={formErrors.nombre}
        placeholder="Ingrese el nombre completo"
      />

      <FormField
        label="Género"
        value={formData.genero}
        onChange={(value) => handleFieldChange('genero', value)}
        options={[
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' }
        ]}
        required
        error={formErrors.genero}
      />

      <FormField
        label="Edad"
        type="number"
        value={formData.edad}
        onChange={(value) => handleFieldChange('edad', value)}
        required
        error={formErrors.edad}
        placeholder="Edad entre 18 y 100 años"
      />

      <FormField
        label="Identificación"
        value={formData.identificacion}
        onChange={(value) => handleFieldChange('identificacion', value)}
        required
        error={formErrors.identificacion}
        placeholder="Mínimo 8 caracteres"
      />

      <FormField
        label="Dirección"
        value={formData.direccion}
        onChange={(value) => handleFieldChange('direccion', value)}
        required
        error={formErrors.direccion}
        placeholder="Dirección completa"
      />

      <FormField
        label="Teléfono"
        value={formData.telefono}
        onChange={(value) => handleFieldChange('telefono', value)}
        required
        error={formErrors.telefono}
        placeholder="9 o 10 dígitos"
      />

      <FormField
        label="Contraseña"
        type="password"
        value={formData.contrasena}
        onChange={(value) => handleFieldChange('contrasena', value)}
        required
        error={formErrors.contrasena}
        placeholder="Mínimo 4 caracteres"
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.estado}
            onChange={(e) => handleFieldChange('estado', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Cliente activo
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

export default ClienteForm;