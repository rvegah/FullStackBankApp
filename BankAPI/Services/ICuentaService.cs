using BankAPI.Models;

namespace BankAPI.Services
{
    public interface ICuentaService
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