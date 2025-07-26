using BankAPI.Models;

namespace BankAPI.Repositories
{
    public interface IMovimientoRepository
    {
        Task<IEnumerable<Movimiento>> GetAllAsync();
        Task<Movimiento?> GetByIdAsync(int id);
        Task<IEnumerable<Movimiento>> GetByCuentaIdAsync(int cuentaId);
        Task<IEnumerable<Movimiento>> GetByClienteIdAsync(int clienteId);
        Task<IEnumerable<Movimiento>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin, int? clienteId = null);
        Task<Movimiento> AddAsync(Movimiento movimiento);
        Task<Movimiento?> UpdateAsync(int id, Movimiento movimiento);
        Task<bool> DeleteAsync(int id);
        Task<bool> CuentaExistsAsync(int cuentaId);
        Task<decimal> GetSaldoActualAsync(int cuentaId);
        Task<decimal> GetDebitosDelDiaAsync(int cuentaId, DateTime fecha);
    }
}