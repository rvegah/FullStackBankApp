using BankAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Repositories
{
    public class CuentaRepository : ICuentaRepository
    {
        private readonly ApplicationDbContext _context;

        public CuentaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cuenta>> GetAllAsync()
        {
            return await _context.Cuentas
                .Include(c => c.Cliente)
                .ToListAsync();
        }

        public async Task<Cuenta?> GetByIdAsync(int id)
        {
            return await _context.Cuentas
                .Include(c => c.Cliente)
                .FirstOrDefaultAsync(c => c.CuentaId == id);
        }

        public async Task<IEnumerable<Cuenta>> GetByClienteIdAsync(int clienteId)
        {
            return await _context.Cuentas
                .Include(c => c.Cliente)
                .Where(c => c.ClienteId == clienteId)
                .ToListAsync();
        }

        public async Task<Cuenta> AddAsync(Cuenta cuenta)
        {
            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();
            
            // Reload with Cliente data
            return await GetByIdAsync(cuenta.CuentaId) ?? cuenta;
        }

        public async Task<Cuenta?> UpdateAsync(int id, Cuenta cuenta)
        {
            var existing = await _context.Cuentas.FindAsync(id);
            if (existing == null) return null;

            existing.NumeroCuenta = cuenta.NumeroCuenta;
            existing.TipoCuenta = cuenta.TipoCuenta;
            existing.SaldoInicial = cuenta.SaldoInicial;
            existing.Estado = cuenta.Estado;
            existing.ClienteId = cuenta.ClienteId;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null) return false;

            _context.Cuentas.Remove(cuenta);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClienteExistsAsync(int clienteId)
        {
            return await _context.Clientes.AnyAsync(c => c.ClienteId == clienteId);
        }
    }
}