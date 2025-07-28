// src/components/ui/FormField.js
import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  options = null, 
  error = '',
  placeholder = '',
  disabled = false
}) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    {options ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '2px solid #dc3545' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: disabled ? '#f8f9fa' : 'white'
        }}
      >
        <option value="">Seleccionar...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '2px solid #dc3545' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: disabled ? '#f8f9fa' : 'white'
        }}
      />
    )}
    {error && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{error}</div>}
  </div>
);

export default FormField;