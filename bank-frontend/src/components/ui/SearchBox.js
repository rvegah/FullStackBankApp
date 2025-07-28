// src/components/ui/SearchBox.js
import React from 'react';

const SearchBox = ({ value, onChange, placeholder = "Buscar...", disabled = false }) => (
  <div style={{ 
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: disabled ? '#f8f9fa' : 'white'
      }}
    />
  </div>
);

export default SearchBox;