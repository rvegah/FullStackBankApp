// src/components/ui/Button.js
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    warning: { backgroundColor: '#ffc107', color: '#212529' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' }
  };

  const sizes = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '8px 16px', fontSize: '14px' },
    large: { padding: '12px 24px', fontSize: '16px' }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        margin: '0 5px',
        opacity: disabled ? 0.6 : 1,
        ...variants[variant],
        ...sizes[size]
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;