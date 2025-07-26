using BankAPI.Models;

namespace BankAPI.Services
{
    public interface IMovimientoService
    {
        Task<IEnumerable<Movimiento>> GetAllAsync();
        Task<Movimiento?> GetByIdAsync(int id);
        Task<IEnumerable<Movimiento>> GetByCuentaIdAsync(int cuentaId);
        Task<IEnumerable<Movimiento>> GetByClienteIdAsync(int clienteId);
        Task<IEnumerable<Movimiento>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin, int? clienteId = null);
        Task<Movimiento> AddAsync(string tipoMovimiento, decimal valor, int cuentaId);
        Task<Movimiento?> UpdateAsync(int id, string tipoMovimiento, decimal valor, int cuentaId);
        Task<bool> DeleteAsync(int id);
    }
}