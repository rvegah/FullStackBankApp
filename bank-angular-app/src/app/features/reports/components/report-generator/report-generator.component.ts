import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MovementService } from '../../../../core/services/movement.service';
import { AccountService } from '../../../../core/services/account.service';
import { ClientService } from '../../../../core/services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cliente, Cuenta, Movimiento } from '../../../../core/models';

declare var jsPDF: any;

interface ReportData {
  cliente: Cliente;
  accounts: any[];
  movements: Movimiento[];
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  creditCount: number;
  debitCount: number;
  totalMovements: number;
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.css']
})
export class ReportGeneratorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  reportForm: FormGroup;
  clients: Cliente[] = [];
  accounts: Cuenta[] = [];
  movements: Movimiento[] = [];
  
  generating: boolean = false;
  progressPercentage: number = 0;
  reportData: ReportData | null = null;
  selectedClient: Cliente | null = null;
  
  today: string = new Date().toISOString().split('T')[0];
  
  // Expose Math to template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private movementService: MovementService,
    private accountService: AccountService,
    private clientService: ClientService,
    private notificationService: NotificationService
  ) {
    this.reportForm = this.fb.group({
      clienteId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      tipoReporte: ['completo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.setDefaultDates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClients(): void {
    this.clientService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.notificationService.showError(
            'Error de carga',
            'No se pudieron cargar los clientes'
          );
        }
      });
  }

  private setDefaultDates(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.reportForm.patchValue({
      fechaInicio: thirtyDaysAgo.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0]
    });
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      this.notificationService.showWarning(
        'Formulario incompleto',
        'Por favor complete todos los campos requeridos'
      );
      return;
    }

    this.generating = true;
    this.progressPercentage = 0;
    this.reportData = null;

    // Simulate progress
    this.simulateProgress();

    const formValue = this.reportForm.value;
    this.selectedClient = this.clients.find(c => c.clienteId == formValue.clienteId) || null;

    // Load all necessary data
    this.loadReportData(formValue);
  }

  private simulateProgress(): void {
    const interval = setInterval(() => {
      this.progressPercentage += 10;
      if (this.progressPercentage >= 90) {
        clearInterval(interval);
      }
    }, 200);
  }

  private loadReportData(formValue: any): void {
    Promise.all([
      this.loadAccountsForClient(formValue.clienteId),
      this.loadMovementsForClient(formValue.clienteId, formValue.fechaInicio, formValue.fechaFin)
    ]).then(() => {
      this.processReportData(formValue);
      this.progressPercentage = 100;
      setTimeout(() => {
        this.generating = false;
        this.notificationService.showSuccess(
          'Reporte generado',
          'El reporte se ha generado correctamente'
        );
      }, 500);
    }).catch((error) => {
      console.error('Error generating report:', error);
      this.generating = false;
      this.notificationService.showError(
        'Error al generar reporte',
        'No se pudo generar el reporte. Intente nuevamente.'
      );
    });
  }

  private loadAccountsForClient(clienteId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accountService.getByClientId(clienteId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            resolve();
          },
          error: reject
        });
    });
  }

  private loadMovementsForClient(clienteId: number, fechaInicio: string, fechaFin: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.movementService.getByClientId(clienteId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (movements) => {
            // Filter movements by date range
            const startDate = new Date(fechaInicio);
            const endDate = new Date(fechaFin);
            endDate.setHours(23, 59, 59, 999); // Include full end date

            this.movements = movements.filter(movement => {
              const movementDate = new Date(movement.fecha);
              return movementDate >= startDate && movementDate <= endDate;
            });
            resolve();
          },
          error: reject
        });
    });
  }

  private processReportData(formValue: any): void {
    if (!this.selectedClient) return;

    // Calculate statistics
    const totalCredits = this.movements
      .filter(m => m.tipoMovimiento === 'Crédito')
      .reduce((sum, m) => sum + m.valor, 0);

    const totalDebits = this.movements
      .filter(m => m.tipoMovimiento === 'Débito')
      .reduce((sum, m) => sum + Math.abs(m.valor), 0);

    const creditCount = this.movements.filter(m => m.tipoMovimiento === 'Crédito').length;
    const debitCount = this.movements.filter(m => m.tipoMovimiento === 'Débito').length;

    // Process accounts with movements data
    const accountsWithStats = this.accounts.map(account => {
      const accountMovements = this.movements.filter(m => m.cuentaId === account.cuentaId);
      const accountCredits = accountMovements
        .filter(m => m.tipoMovimiento === 'Crédito')
        .reduce((sum, m) => sum + m.valor, 0);
      const accountDebits = accountMovements
        .filter(m => m.tipoMovimiento === 'Débito')
        .reduce((sum, m) => sum + Math.abs(m.valor), 0);

      return {
        ...account,
        movimientosEnPeriodo: accountMovements.length,
        creditosEnPeriodo: accountCredits,
        debitosEnPeriodo: accountDebits,
        saldoActual: account.saldoInicial + accountCredits - accountDebits
      };
    });

    this.reportData = {
      cliente: this.selectedClient,
      accounts: accountsWithStats,
      movements: this.movements.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
      totalCredits,
      totalDebits,
      netBalance: totalCredits - totalDebits,
      creditCount,
      debitCount,
      totalMovements: this.movements.length,
      fechaInicio: formValue.fechaInicio,
      fechaFin: formValue.fechaFin
    };
  }

  previewReport(): void {
    this.generateReport();
  }

  private generatePDFText(): string {
    if (!this.reportData) return '';

    return `
  =====================================
      ESTADO DE CUENTA BANCARIO
  =====================================

  Cliente: ${this.selectedClient?.nombre}
  Cédula: ${this.selectedClient?.identificacion}
  Dirección: ${this.selectedClient?.direccion}
  Teléfono: ${this.selectedClient?.telefono}

  Período: ${this.reportData.fechaInicio} al ${this.reportData.fechaFin}
  Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}

  =====================================
          RESUMEN ESTADÍSTICO
  =====================================

  Total Créditos:    +$${this.reportData.totalCredits.toFixed(2)} (${this.reportData.creditCount} transacciones)
  Total Débitos:     -$${this.reportData.totalDebits.toFixed(2)} (${this.reportData.debitCount} transacciones)
  Balance Neto:       $${this.reportData.netBalance.toFixed(2)}
  Total Movimientos:  ${this.reportData.totalMovements}

  =====================================
          CUENTAS DEL CLIENTE
  =====================================

  ${this.reportData.accounts.map(account => `
  Cuenta: ${account.numeroCuenta}
  Tipo: ${account.tipoCuenta}
  Saldo Actual: $${account.saldoActual.toFixed(2)}
  Movimientos en Período: ${account.movimientosEnPeriodo}
  Créditos: +$${account.creditosEnPeriodo.toFixed(2)}
  Débitos: -$${account.debitosEnPeriodo.toFixed(2)}
  `).join('\n')}

  =====================================
          DETALLE DE MOVIMIENTOS
  =====================================

  ${this.reportData.movements.map(movement => `
  Fecha: ${new Date(movement.fecha).toLocaleDateString('es-ES')} ${new Date(movement.fecha).toLocaleTimeString('es-ES')}
  Cuenta: ${this.getAccountNumber(movement.cuentaId)}
  Tipo: ${movement.tipoMovimiento}
  Valor: ${movement.tipoMovimiento === 'Crédito' ? '+' : ''}$${movement.valor.toFixed(2)}
  Saldo: $${movement.saldo.toFixed(2)}
  ---
  `).join('')}

  =====================================
  Sistema Bancario BankApp
  Todos los derechos reservados
  =====================================
    `;
  }

  exportToPDF(): void {
    if (!this.reportData) {
      this.notificationService.showWarning(
        'Sin datos',
        'Debe generar un reporte primero'
      );
      return;
    }

    try {
      // Acceder a jsPDF desde el objeto window
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();
      
      // Configuración de la página
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPos = 30;
      
      // Función helper para agregar texto con salto de línea automático
      const addText = (text: string, x: number, y: number, maxWidth?: number) => {
        if (maxWidth) {
          const lines = doc.splitTextToSize(text, maxWidth);
          doc.text(lines, x, y);
          return y + (lines.length * 6);
        } else {
          doc.text(text, x, y);
          return y + 6;
        }
      };

      // Título principal
      doc.setFontSize(20);
      doc.setTextColor(0, 123, 255);
      yPos = addText('ESTADO DE CUENTA BANCARIO', margin, yPos);
      yPos += 5;

      // Información del cliente
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      yPos = addText(`Cliente: ${this.selectedClient?.nombre}`, margin, yPos);
      yPos += 5;

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      yPos = addText(`Período: ${this.reportData.fechaInicio} al ${this.reportData.fechaFin}`, margin, yPos);
      yPos = addText(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, margin, yPos);
      yPos += 10;

      // Línea separadora
      doc.setDrawColor(0, 123, 255);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;

      // Información detallada del cliente
      doc.setFontSize(14);
      doc.setTextColor(0, 123, 255);
      yPos = addText('INFORMACIÓN DEL CLIENTE', margin, yPos);
      yPos += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos = addText(`Cédula: ${this.selectedClient?.identificacion}`, margin, yPos);
      yPos = addText(`Dirección: ${this.selectedClient?.direccion}`, margin, yPos, pageWidth - 2 * margin);
      yPos = addText(`Teléfono: ${this.selectedClient?.telefono}`, margin, yPos);
      yPos += 10;

      // Resumen estadístico
      doc.setFontSize(14);
      doc.setTextColor(0, 123, 255);
      yPos = addText('RESUMEN ESTADÍSTICO', margin, yPos);
      yPos += 5;

      doc.setFontSize(10);
      doc.setTextColor(40, 167, 69);
      yPos = addText(`Total Créditos: +$${this.reportData.totalCredits.toFixed(2)} (${this.reportData.creditCount} transacciones)`, margin, yPos);
      
      doc.setTextColor(220, 53, 69);
      yPos = addText(`Total Débitos: -$${this.reportData.totalDebits.toFixed(2)} (${this.reportData.debitCount} transacciones)`, margin, yPos);
      
      doc.setTextColor(0, 123, 255);
      yPos = addText(`Balance Neto: $${this.reportData.netBalance.toFixed(2)}`, margin, yPos);
      yPos = addText(`Total Movimientos: ${this.reportData.totalMovements}`, margin, yPos);
      yPos += 15;

      // Cuentas del cliente
      doc.setFontSize(14);
      doc.setTextColor(0, 123, 255);
      yPos = addText('CUENTAS DEL CLIENTE', margin, yPos);
      yPos += 10;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Headers de tabla de cuentas
      doc.setFont(undefined, 'bold');
      doc.text('Número', margin, yPos);
      doc.text('Tipo', margin + 40, yPos);
      doc.text('Saldo Actual', margin + 80, yPos);
      doc.text('Movimientos', margin + 120, yPos);
      yPos += 5;

      // Línea bajo headers
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Datos de cuentas
      doc.setFont(undefined, 'normal');
      this.reportData.accounts.forEach(account => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.text(account.numeroCuenta, margin, yPos);
        doc.text(account.tipoCuenta, margin + 40, yPos);
        doc.text(`$${account.saldoActual.toFixed(2)}`, margin + 80, yPos);
        doc.text(account.movimientosEnPeriodo.toString(), margin + 120, yPos);
        yPos += 8;
      });

      yPos += 15;

      // Detalle de movimientos
      if (this.reportData.movements.length > 0) {
        if (yPos > 200) {
          doc.addPage();
          yPos = 30;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 123, 255);
        yPos = addText('DETALLE DE MOVIMIENTOS', margin, yPos);
        yPos += 10;

        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);

        // Headers de movimientos
        doc.setFont(undefined, 'bold');
        doc.text('Fecha', margin, yPos);
        doc.text('Cuenta', margin + 35, yPos);
        doc.text('Tipo', margin + 70, yPos);
        doc.text('Valor', margin + 100, yPos);
        doc.text('Saldo', margin + 140, yPos);
        yPos += 5;

        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 6;

        // Datos de movimientos (primeros 15)
        doc.setFont(undefined, 'normal');
        const movementsToShow = this.reportData.movements.slice(0, 15);
        
        movementsToShow.forEach(movement => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
          }

          const fecha = new Date(movement.fecha);
          doc.text(fecha.toLocaleDateString('es-ES'), margin, yPos);
          doc.text(this.getAccountNumber(movement.cuentaId), margin + 35, yPos);
          doc.text(movement.tipoMovimiento, margin + 70, yPos);
          
          // Valor con color
          const valor = `${movement.tipoMovimiento === 'Crédito' ? '+' : ''}$${movement.valor.toFixed(2)}`;
          if (movement.tipoMovimiento === 'Crédito') {
            doc.setTextColor(40, 167, 69);
          } else {
            doc.setTextColor(220, 53, 69);
          }
          doc.text(valor, margin + 100, yPos);
          
          doc.setTextColor(0, 0, 0);
          doc.text(`$${movement.saldo.toFixed(2)}`, margin + 140, yPos);
          yPos += 6;
        });

        if (this.reportData.movements.length > 15) {
          yPos += 5;
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          yPos = addText(`... y ${this.reportData.movements.length - 15} movimientos más`, margin, yPos);
        }
      }

      // Footer en todas las páginas
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Sistema Bancario BankApp - Página ${i} de ${totalPages}`, margin, 285);
      }

      // Descargar
      const fileName = `reporte-${this.selectedClient?.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      this.notificationService.showSuccess(
        'PDF generado',
        'El reporte PDF se ha descargado correctamente'
      );

    } catch (error) {
      console.error('Error generating PDF:', error);
      this.notificationService.showError(
        'Error de PDF',
        'No se pudo generar el PDF. Verifique que jsPDF esté cargado correctamente.'
      );
    }
  }

  exportToJSON(): void {
    if (!this.reportData) {
      this.notificationService.showWarning(
        'Sin datos',
        'Debe generar un reporte primero'
      );
      return;
    }

    try {
      const jsonData = JSON.stringify(this.reportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${this.selectedClient?.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.notificationService.showSuccess(
        'JSON exportado',
        'El reporte JSON se ha descargado correctamente'
      );
    } catch (error) {
      console.error('Error exporting JSON:', error);
      this.notificationService.showError(
        'Error de exportación',
        'No se pudo exportar el JSON. Intente nuevamente.'
      );
    }
  }

  private generatePDFContent(): string {
    if (!this.reportData) return '';

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Estado de Cuenta - ${this.selectedClient?.nombre}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #007bff; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .info-item { margin-bottom: 5px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f8f9fa; font-weight: bold; }
          .credit { color: #28a745; }
          .debit { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ESTADO DE CUENTA BANCARIO</h1>
          <h2>${this.selectedClient?.nombre}</h2>
          <p>Período: ${this.reportData.fechaInicio} al ${this.reportData.fechaFin}</p>
        </div>

        <div class="section">
          <h3 class="section-title">Información del Cliente</h3>
          <div class="info-grid">
            <div class="info-item"><strong>Nombre:</strong> ${this.selectedClient?.nombre}</div>
            <div class="info-item"><strong>Cédula:</strong> ${this.selectedClient?.identificacion}</div>
            <div class="info-item"><strong>Dirección:</strong> ${this.selectedClient?.direccion}</div>
            <div class="info-item"><strong>Teléfono:</strong> ${this.selectedClient?.telefono}</div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Resumen Estadístico</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <h4 class="credit">+$${this.reportData.totalCredits.toFixed(2)}</h4>
              <p>Total Créditos (${this.reportData.creditCount})</p>
            </div>
            <div class="stat-card">
              <h4 class="debit">-$${this.reportData.totalDebits.toFixed(2)}</h4>
              <p>Total Débitos (${this.reportData.debitCount})</p>
            </div>
            <div class="stat-card">
              <h4>$${this.reportData.netBalance.toFixed(2)}</h4>
              <p>Balance Neto</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Cuentas del Cliente</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Número de Cuenta</th>
                <th>Tipo</th>
                <th>Saldo Actual</th>
                <th>Movimientos</th>
                <th>Créditos</th>
                <th>Débitos</th>
              </tr>
            </thead>
            <tbody>
              ${this.reportData.accounts.map(account => `
                <tr>
                  <td>${account.numeroCuenta}</td>
                  <td>${account.tipoCuenta}</td>
                  <td>$${account.saldoActual.toFixed(2)}</td>
                  <td>${account.movimientosEnPeriodo}</td>
                  <td class="credit">+$${account.creditosEnPeriodo.toFixed(2)}</td>
                  <td class="debit">-$${account.debitosEnPeriodo.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3 class="section-title">Detalle de Movimientos</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${this.reportData.movements.map(movement => `
                <tr>
                  <td>${new Date(movement.fecha).toLocaleDateString('es-ES')} ${new Date(movement.fecha).toLocaleTimeString('es-ES')}</td>
                  <td>${this.getAccountNumber(movement.cuentaId)}</td>
                  <td class="${movement.tipoMovimiento === 'Crédito' ? 'credit' : 'debit'}">${movement.tipoMovimiento}</td>
                  <td class="${movement.tipoMovimiento === 'Crédito' ? 'credit' : 'debit'}">
                    ${movement.tipoMovimiento === 'Crédito' ? '+' : '-'}$${Math.abs(movement.valor).toFixed(2)}
                  </td>
                  <td>$${movement.saldo.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section" style="margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
          <p><strong>Reporte generado el:</strong> ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
          <p><em>Sistema Bancario BankApp - Todos los derechos reservados</em></p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  }

  generateQuickReport(type: string): void {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    switch (type) {
      case 'daily':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default:
        return;
    }

    // Set form values
    this.reportForm.patchValue({
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0],
      tipoReporte: 'completo'
    });

    // If no client selected, show warning
    if (!this.reportForm.get('clienteId')?.value) {
      this.notificationService.showWarning(
        'Cliente requerido',
        'Por favor seleccione un cliente para generar el reporte rápido'
      );
      return;
    }

    this.generateReport();
  }

  resetForm(): void {
    this.reportForm.reset();
    this.reportData = null;
    this.selectedClient = null;
    this.setDefaultDates();
    this.reportForm.patchValue({ tipoReporte: 'completo' });
  }

  getDaysDifference(): number {
    if (!this.reportData) return 0;
    const start = new Date(this.reportData.fechaInicio);
    const end = new Date(this.reportData.fechaFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getAccountNumber(accountId: number): string {
    const account = this.accounts.find(a => a.cuentaId === accountId);
    return account ? account.numeroCuenta : 'N/A';
  }
}