// src/utils/validations.js
export const validateCliente = (formData) => {
  const errors = {};

  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (formData.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!formData.genero) {
    errors.genero = 'El género es obligatorio';
  }

  if (!formData.edad) {
    errors.edad = 'La edad es obligatoria';
  } else if (formData.edad < 18 || formData.edad > 100) {
    errors.edad = 'La edad debe estar entre 18 y 100 años';
  }

  if (!formData.identificacion.trim()) {
    errors.identificacion = 'La identificación es obligatoria';
  } else if (formData.identificacion.length < 8) {
    errors.identificacion = 'La identificación debe tener al menos 8 caracteres';
  }

  if (!formData.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria';
  } else if (formData.direccion.length < 10) {
    errors.direccion = 'La dirección debe tener al menos 10 caracteres';
  }

  if (!formData.telefono.trim()) {
    errors.telefono = 'El teléfono es obligatorio';
  } else if (!/^\d{9,10}$/.test(formData.telefono)) {
    errors.telefono = 'El teléfono debe tener 9 o 10 dígitos';
  }

  if (!formData.contrasena.trim()) {
    errors.contrasena = 'La contraseña es obligatoria';
  } else if (formData.contrasena.length < 4) {
    errors.contrasena = 'La contraseña debe tener al menos 4 caracteres';
  }

  return errors;
};

export const filterClientes = (clientes, searchTerm) => {
  if (!searchTerm.trim()) {
    return clientes;
  }
  
  return clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.identificacion.includes(searchTerm) ||
    cliente.telefono.includes(searchTerm)
  );
};

export const validateCuenta = (formData) => {
  const errors = {};

  if (!formData.numeroCuenta.trim()) {
    errors.numeroCuenta = 'El número de cuenta es obligatorio';
  } else if (formData.numeroCuenta.length < 6 || formData.numeroCuenta.length > 10) {
    errors.numeroCuenta = 'El número de cuenta debe tener entre 6 y 10 dígitos';
  } else if (!/^\d+$/.test(formData.numeroCuenta)) {
    errors.numeroCuenta = 'El número de cuenta solo debe contener números';
  }

  if (!formData.tipoCuenta) {
    errors.tipoCuenta = 'El tipo de cuenta es obligatorio';
  }

  if (formData.saldoInicial === '' || formData.saldoInicial === null || formData.saldoInicial === undefined) {
    errors.saldoInicial = 'El saldo inicial es obligatorio';
  } else if (parseFloat(formData.saldoInicial) < 0) {
    errors.saldoInicial = 'El saldo inicial debe ser mayor o igual a 0';
  }

  if (!formData.clienteId || formData.clienteId === '') {
    errors.clienteId = 'Debe seleccionar un cliente';
  }

  return errors;
};

export const filterCuentas = (cuentas, searchTerm) => {
  if (!searchTerm.trim()) {
    return cuentas;
  }
  
  return cuentas.filter(cuenta =>
    cuenta.numeroCuenta.includes(searchTerm) ||
    (cuenta.nombreCliente && cuenta.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cuenta.tipoCuenta.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const validateMovimiento = (formData) => {
  const errors = {};

  if (!formData.tipoMovimiento) {
    errors.tipoMovimiento = 'El tipo de movimiento es obligatorio';
  }

  if (formData.valor === '' || formData.valor === null || formData.valor === undefined) {
    errors.valor = 'El valor es obligatorio';
  } else {
    const valor = parseFloat(formData.valor);
    if (valor <= 0) {
      errors.valor = 'El valor debe ser mayor a 0';
    } else if (valor > 10000) {
      errors.valor = 'El valor no puede ser mayor a $10,000';
    }
  }

  if (!formData.cuentaId || formData.cuentaId === '') {
    errors.cuentaId = 'Debe seleccionar una cuenta';
  }

  return errors;
};

export const filterMovimientos = (movimientos, searchTerm) => {
  if (!searchTerm.trim()) {
    return movimientos;
  }
  
  return movimientos.filter(movimiento =>
    movimiento.numeroCuenta?.includes(searchTerm) ||
    (movimiento.nombreCliente && movimiento.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
    movimiento.tipoMovimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimiento.valor.toString().includes(searchTerm)
  );
};

// Función para formatear fechas
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};