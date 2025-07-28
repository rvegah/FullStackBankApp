// src/utils/reportUtils.js
import { formatCurrency, formatDate } from './validations';

// Calcular estadísticas del reporte
export const calculateReportStats = (movimientos) => {
  const creditos = movimientos.filter(m => m.tipoMovimiento === 'Crédito');
  const debitos = movimientos.filter(m => m.tipoMovimiento === 'Débito');
  
  const totalCreditos = creditos.reduce((sum, m) => sum + Math.abs(m.valor), 0);
  const totalDebitos = debitos.reduce((sum, m) => sum + Math.abs(m.valor), 0);
  
  return {
    totalMovimientos: movimientos.length,
    totalCreditos: creditos.length,
    totalDebitos: debitos.length,
    montoCreditos: totalCreditos,
    montoDebitos: totalDebitos,
    diferencia: totalCreditos - totalDebitos,
    saldoFinal: movimientos.length > 0 ? movimientos[movimientos.length - 1].saldo : 0
  };
};

// Generar contenido del reporte para descarga
export const generateReportContent = (movimientos, filtros, stats) => {
  const cliente = filtros.clienteNombre ? filtros.clienteNombre : 'Todos los clientes';
  
  let content = `ESTADO DE CUENTA BANCARIO\n`;
  content += `${'='.repeat(80)}\n\n`;
  content += `Período: ${filtros.fechaInicio} al ${filtros.fechaFin}\n`;
  content += `Cliente: ${cliente}\n`;
  content += `Fecha de generación: ${new Date().toLocaleDateString('es-ES')}\n`;
  content += `\n${'='.repeat(80)}\n\n`;
  
  // Headers de la tabla
  content += `${'Fecha'.padEnd(18)} ${'Tipo'.padEnd(12)} ${'Valor'.padEnd(15)} ${'Saldo'.padEnd(15)} ${'Cuenta'.padEnd(12)} ${'Cliente'.padEnd(20)}\n`;
  content += `${'-'.repeat(80)}\n`;
  
  // Datos de movimientos
  movimientos.forEach(mov => {
    const fecha = formatDate(mov.fecha);
    const tipo = mov.tipoMovimiento;
    const valor = formatCurrency(mov.valor);
    const saldo = formatCurrency(mov.saldo);
    const cuenta = mov.numeroCuenta || 'N/A';
    const clienteNombre = mov.nombreCliente || 'N/A';
    
    content += `${fecha.padEnd(18)} ${tipo.padEnd(12)} ${valor.padEnd(15)} ${saldo.padEnd(15)} ${cuenta.padEnd(12)} ${clienteNombre.padEnd(20)}\n`;
  });

  // Resumen estadístico
  content += `\n${'-'.repeat(80)}\n`;
  content += `RESUMEN ESTADÍSTICO\n`;
  content += `${'-'.repeat(80)}\n`;
  content += `Total de movimientos: ${stats.totalMovimientos}\n`;
  content += `Total créditos: ${stats.totalCreditos} movimientos - ${formatCurrency(stats.montoCreditos)}\n`;
  content += `Total débitos: ${stats.totalDebitos} movimientos - ${formatCurrency(stats.montoDebitos)}\n`;
  content += `Diferencia: ${formatCurrency(stats.diferencia)}\n`;
  content += `Saldo final: ${formatCurrency(stats.saldoFinal)}\n`;
  content += `\n${'-'.repeat(80)}\n`;
  content += `Reporte generado por Sistema Bancario v1.0\n`;

  return content;
};

// Descargar archivo
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generar JSON del reporte
export const generateJsonReport = (movimientos, filtros, stats) => {
  return JSON.stringify({
    reporte: {
      generado: new Date().toISOString(),
      periodo: {
        inicio: filtros.fechaInicio,
        fin: filtros.fechaFin
      },
      cliente: filtros.clienteNombre || 'Todos los clientes',
      estadisticas: stats,
      movimientos: movimientos.map(mov => ({
        id: mov.movimientoId,
        fecha: mov.fecha,
        tipo: mov.tipoMovimiento,
        valor: mov.valor,
        saldo: mov.saldo,
        cuenta: mov.numeroCuenta,
        cliente: mov.nombreCliente
      }))
    }
  }, null, 2);
};