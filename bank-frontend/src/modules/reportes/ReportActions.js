// src/modules/reportes/ReportActions.js
import React from 'react';
import { Button } from '../../components/ui';
import { 
  generateReportContent, 
  generateJsonReport, 
  downloadFile 
} from '../../utils/reportUtils';

const ReportActions = ({ movimientos, filtros, stats, disabled = false }) => {
  const handleDownloadTxt = () => {
    const content = generateReportContent(movimientos, filtros, stats);
    const filename = `estado_cuenta_${filtros.fechaInicio}_${filtros.fechaFin}.txt`;
    downloadFile(content, filename, 'text/plain');
  };

  const handleDownloadJson = () => {
    const content = generateJsonReport(movimientos, filtros, stats);
    const filename = `estado_cuenta_${filtros.fechaInicio}_${filtros.fechaFin}.json`;
    downloadFile(content, filename, 'application/json');
  };

  const handleDownloadCsv = () => {
    let csvContent = 'Fecha,Tipo,Valor,Saldo,Cuenta,Cliente\n';
    
    movimientos.forEach(mov => {
      const fecha = new Date(mov.fecha).toLocaleDateString('es-ES');
      const tipo = mov.tipoMovimiento;
      const valor = mov.valor.toFixed(2);
      const saldo = mov.saldo.toFixed(2);
      const cuenta = mov.numeroCuenta || 'N/A';
      const cliente = (mov.nombreCliente || 'Sin asignar').replace(/,/g, ';'); // Evitar problemas con comas
      
      csvContent += `"${fecha}","${tipo}","${valor}","${saldo}","${cuenta}","${cliente}"\n`;
    });

    const filename = `estado_cuenta_${filtros.fechaInicio}_${filtros.fechaFin}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Estado de Cuenta</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .credit { color: #28a745; }
            .debit { color: #dc3545; }
            .money { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ESTADO DE CUENTA BANCARIO</h1>
            <p>Sistema Bancario v1.0</p>
          </div>
          
          <div class="info">
            <p><strong>Período:</strong> ${filtros.fechaInicio} al ${filtros.fechaFin}</p>
            <p><strong>Cliente:</strong> ${filtros.clienteNombre || 'Todos los clientes'}</p>
            <p><strong>Generado:</strong> ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
          </div>

          <div class="stats">
            <div class="stat-card">
              <h4>Total Movimientos</h4>
              <p>${stats.totalMovimientos}</p>
            </div>
            <div class="stat-card">
              <h4>Total Créditos</h4>
              <p class="credit">$${stats.montoCreditos.toFixed(2)}</p>
            </div>
            <div class="stat-card">
              <h4>Total Débitos</h4>
              <p class="debit">$${stats.montoDebitos.toFixed(2)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Saldo</th>
                <th>Cuenta</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody>
              ${movimientos.map(mov => `
                <tr>
                  <td>${new Date(mov.fecha).toLocaleDateString('es-ES')}</td>
                  <td>${mov.tipoMovimiento}</td>
                  <td class="money ${mov.tipoMovimiento === 'Crédito' ? 'credit' : 'debit'}">
                    ${mov.tipoMovimiento === 'Crédito' ? '+' : '-'}$${Math.abs(mov.valor).toFixed(2)}
                  </td>
                  <td class="money ${mov.saldo >= 0 ? 'credit' : 'debit'}">$${mov.saldo.toFixed(2)}</td>
                  <td>${mov.numeroCuenta || 'N/A'}</td>
                  <td>${mov.nombreCliente || 'Sin asignar'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (disabled || movimientos.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <p>Genere un reporte para ver las opciones de descarga</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>📥 Descargar Reporte</h4>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="primary"
            size="large"
            onClick={handleDownloadTxt}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            📄 Descargar TXT
          </Button>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            Formato de texto plano
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            variant="success"
            size="large"
            onClick={handleDownloadJson}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            📋 Descargar JSON
          </Button>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            Formato estructurado
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            variant="warning"
            size="large"
            onClick={handleDownloadCsv}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            📊 Descargar CSV
          </Button>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            Para Excel/Calc
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            variant="secondary"
            size="large"
            onClick={handlePrint}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            🖨️ Imprimir
          </Button>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            Versión imprimible
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '13px',
        color: '#6c757d'
      }}>
        💡 <strong>Tip:</strong> El archivo TXT es ideal para informes oficiales, 
        JSON para integración con otros sistemas, y CSV para análisis en Excel.
      </div>
    </div>
  );
};

export default ReportActions;