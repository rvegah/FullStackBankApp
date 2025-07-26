using BankAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Repositories
{
    public class MovimientoRepository : IMovimientoRepository
    {
        private readonly ApplicationDbContext _context;

        public MovimientoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Movimiento>> GetAllAsync()
        {
            return await _context.Movimientos
                .Include(m => m.Cuenta)
                .ThenInclude(c => c.Cliente)
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();
        }

        public async Task<Movimiento?> GetByIdAsync(int id)
        {
            return await _context.Movimientos
                .Include(m => m.Cuenta)
                .ThenInclude(c => c.Cliente)
                .FirstOrDefaultAsync(m => m.MovimientoId == id);
        }

        public async Task<IEnumerable<Movimiento>> GetByCuentaIdAsync(int cuentaId)
        {
            return await _context.Movimientos
                .Include(m => m.Cuenta)
                .ThenInclude(c => c.Cliente)
                .Where(m => m.CuentaId == cuentaId)
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();
        }

        public async Task<IEnumerable<Movimiento>> GetByClienteIdAsync(int clienteId)
        {
            return await _context.Movimientos
                .Include(m => m.Cuenta)
                .ThenInclude(c => c.Cliente)
                .Where(m => m.Cuenta.ClienteId == clienteId)
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();
        }

        public async Task<IEnumerable<Movimiento>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin, int? clienteId = null)
        {
            var query = _context.Movimientos
                .Include(m => m.Cuenta)
                .ThenInclude(c => c.Cliente)
                .Where(m => m.Fecha.Date >= fechaInicio.Date && m.Fecha.Date <= fechaFin.Date);

            if (clienteId.HasValue)
            {
                query = query.Where(m => m.Cuenta.ClienteId == clienteId.Value);
            }

            return await query
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();
        }

        public async Task<Movimiento> AddAsync(Movimiento movimiento)
        {
            _context.Movimientos.Add(movimiento);
            await _context.SaveChangesAsync();
            
            // Reload with navigation properties
            return await GetByIdAsync(movimiento.MovimientoId) ?? movimiento;
        }

        public async Task<Movimiento?> UpdateAsync(int id, Movimiento movimiento)
        {
            var existing = await _context.Movimientos.FindAsync(id);
            if (existing == null) return null;

            existing.TipoMovimiento = movimiento.TipoMovimiento;
            existing.Valor = movimiento.Valor;
            existing.Saldo = movimiento.Saldo;
            existing.CuentaId = movimiento.CuentaId;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var movimiento = await _context.Movimientos.FindAsync(id);
            if (movimiento == null) return false;

            _context.Movimientos.Remove(movimiento);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CuentaExistsAsync(int cuentaId)
        {
            return await _context.Cuentas.AnyAsync(c => c.CuentaId == cuentaId);
        }

        public async Task<decimal> GetSaldoActualAsync(int cuentaId)
        {
            // Obtener el último movimiento para esta cuenta
            var ultimoMovimiento = await _context.Movimientos
                .Where(m => m.CuentaId == cuentaId)
                .OrderByDescending(m => m.Fecha)
                .FirstOrDefaultAsync();

            if (ultimoMovimiento != null)
            {
                return ultimoMovimiento.Saldo;
            }

            // Si no hay movimientos, retornar el saldo inicial de la cuenta
            var cuenta = await _context.Cuentas.FindAsync(cuentaId);
            return cuenta?.SaldoInicial ?? 0;
        }

        public async Task<decimal> GetDebitosDelDiaAsync(int cuentaId, DateTime fecha)
        {
            var debitosDelDia = await _context.Movimientos
                .Where(m => m.CuentaId == cuentaId 
                       && m.Fecha.Date == fecha.Date 
                       && m.TipoMovimiento == "Débito")
                .SumAsync(m => Math.Abs(m.Valor)); // Usar valor absoluto

            return debitosDelDia;
        }
    }
}