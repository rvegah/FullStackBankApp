using BankAPI.Models;
using BankAPI.Repositories;

namespace BankAPI.Services
{
    public class MovimientoService : IMovimientoService
    {
        private readonly IMovimientoRepository _movimientoRepository;
        private const decimal LIMITE_DIARIO = 1000m;

        public MovimientoService(IMovimientoRepository movimientoRepository)
        {
            _movimientoRepository = movimientoRepository;
        }

        public async Task<IEnumerable<Movimiento>> GetAllAsync()
        {
            return await _movimientoRepository.GetAllAsync();
        }

        public async Task<Movimiento?> GetByIdAsync(int id)
        {
            return await _movimientoRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Movimiento>> GetByCuentaIdAsync(int cuentaId)
        {
            return await _movimientoRepository.GetByCuentaIdAsync(cuentaId);
        }

        public async Task<IEnumerable<Movimiento>> GetByClienteIdAsync(int clienteId)
        {
            return await _movimientoRepository.GetByClienteIdAsync(clienteId);
        }

        public async Task<IEnumerable<Movimiento>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin, int? clienteId = null)
        {
            return await _movimientoRepository.GetByDateRangeAsync(fechaInicio, fechaFin, clienteId);
        }

        public async Task<Movimiento> AddAsync(string tipoMovimiento, decimal valor, int cuentaId)
        {
            // Validar que la cuenta existe
            if (!await _movimientoRepository.CuentaExistsAsync(cuentaId))
            {
                throw new ArgumentException($"Cuenta con ID {cuentaId} no existe");
            }

            // Validar que el valor sea positivo
            if (valor <= 0)
            {
                throw new ArgumentException("El valor debe ser mayor a cero");
            }

            // Obtener saldo actual
            var saldoActual = await _movimientoRepository.GetSaldoActualAsync(cuentaId);
            
            decimal valorMovimiento;
            decimal nuevoSaldo;

            if (tipoMovimiento.ToLower() == "crédito" || tipoMovimiento.ToLower() == "credito")
            {
                // CRÉDITO: valor positivo, suma al saldo
                valorMovimiento = Math.Abs(valor);
                nuevoSaldo = saldoActual + valorMovimiento;
            }
            else if (tipoMovimiento.ToLower() == "débito" || tipoMovimiento.ToLower() == "debito")
            {
                // DÉBITO: valor negativo, resta del saldo
                valorMovimiento = -Math.Abs(valor);
                nuevoSaldo = saldoActual + valorMovimiento; // Se suma porque ya es negativo

                // Validar saldo disponible
                if (nuevoSaldo < 0)
                {
                    throw new InvalidOperationException("Saldo no disponible");
                }

                // Validar límite diario
                var debitosDelDia = await _movimientoRepository.GetDebitosDelDiaAsync(cuentaId, DateTime.Now);
                if (debitosDelDia + Math.Abs(valorMovimiento) > LIMITE_DIARIO)
                {
                    throw new InvalidOperationException("Cupo diario Excedido");
                }
            }
            else
            {
                throw new ArgumentException("Tipo de movimiento debe ser 'Crédito' o 'Débito'");
            }

            var movimiento = new Movimiento
            {
                Fecha = DateTime.Now,
                TipoMovimiento = tipoMovimiento.ToLower() == "crédito" || tipoMovimiento.ToLower() == "credito" ? "Crédito" : "Débito",
                Valor = valorMovimiento,
                Saldo = nuevoSaldo,
                CuentaId = cuentaId,
                Cuenta = null! // Se cargará automáticamente por EF
            };

            return await _movimientoRepository.AddAsync(movimiento);
        }

        public async Task<Movimiento?> UpdateAsync(int id, string tipoMovimiento, decimal valor, int cuentaId)
        {
            // Validar que la cuenta existe
            if (!await _movimientoRepository.CuentaExistsAsync(cuentaId))
            {
                throw new ArgumentException($"Cuenta con ID {cuentaId} no existe");
            }

            // Para actualización, aplicamos la misma lógica que para crear
            // (En un sistema real, esto sería más complejo ya que afectaría los saldos subsecuentes)
            var saldoActual = await _movimientoRepository.GetSaldoActualAsync(cuentaId);
            
            decimal valorMovimiento;
            decimal nuevoSaldo;

            if (tipoMovimiento.ToLower() == "crédito" || tipoMovimiento.ToLower() == "credito")
            {
                valorMovimiento = Math.Abs(valor);
                nuevoSaldo = saldoActual + valorMovimiento;
            }
            else if (tipoMovimiento.ToLower() == "débito" || tipoMovimiento.ToLower() == "debito")
            {
                valorMovimiento = -Math.Abs(valor);
                nuevoSaldo = saldoActual + valorMovimiento;

                if (nuevoSaldo < 0)
                {
                    throw new InvalidOperationException("Saldo no disponible");
                }
            }
            else
            {
                throw new ArgumentException("Tipo de movimiento debe ser 'Crédito' o 'Débito'");
            }

            var movimiento = new Movimiento
            {
                TipoMovimiento = tipoMovimiento.ToLower() == "crédito" || tipoMovimiento.ToLower() == "credito" ? "Crédito" : "Débito",
                Valor = valorMovimiento,
                Saldo = nuevoSaldo,
                CuentaId = cuentaId,
                Cuenta = null!
            };

            return await _movimientoRepository.UpdateAsync(id, movimiento);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _movimientoRepository.DeleteAsync(id);
        }
    }
}