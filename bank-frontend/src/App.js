// src/App.js
import React, { useState } from 'react';
import './App.css';
import { ClienteManager } from './modules/clientes';
import { CuentaManager } from './modules/cuentas';
import { MovimientoManager } from './modules/movimientos';
import { ReportesManager } from './modules/reportes'; // 👈 NUEVA LÍNEA

// Layout Component (mantener igual)
const Layout = ({ children, currentSection, onSectionChange }) => (
  <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
    <nav style={{
      width: '200px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px 0'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        BANCO
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {['clientes', 'cuentas', 'movimientos', 'reportes'].map(section => (
          <li key={section}>
            <button
              onClick={() => onSectionChange(section)}
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: currentSection === section ? '#34495e' : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                textTransform: 'capitalize'
              }}
            >
              {section}
            </button>
          </li>
        ))}
      </ul>
    </nav>
    <main style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
      {children}
    </main>
  </div>
);

// Main App Component
function App() {
  const [currentSection, setCurrentSection] = useState('clientes');

  const renderSection = () => {
    switch (currentSection) {
      case 'clientes':
        return <ClienteManager />;
      case 'cuentas':
        return <CuentaManager />;
      case 'movimientos':
        return <MovimientoManager />;
      case 'reportes':
        return <ReportesManager />; // 👈 ACTUALIZADO
      default:
        return <ClienteManager />;
    }
  };

  return (
    <Layout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </Layout>
  );
}

export default App;