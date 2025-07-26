using BankAPI.Models;

namespace BankAPI.Repositories
{
    public interface ICuentaRepository
    {
        Task<IEnumerable<Cuenta>> GetAllAsync();
        Task<Cuenta?> GetByIdAsync(int id);
        Task<IEnumerable<Cuenta>> GetByClienteIdAsync(int clienteId);
        Task<Cuenta> AddAsync(Cuenta cuenta);
        Task<Cuenta?> UpdateAsync(int id, Cuenta cuenta);
        Task<bool> DeleteAsync(int id);
        Task<bool> ClienteExistsAsync(int clienteId);
    }
}