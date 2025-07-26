using BankAPI.Models;

namespace BankAPI.Services
{
    public interface IClienteService
    {
        Task<IEnumerable<Cliente>> GetAllAsync();
        Task<Cliente?> GetByIdAsync(int id);
        Task<Cliente> AddAsync(Cliente cliente);
        Task<Cliente?> UpdateAsync(int id, Cliente cliente);
        Task<bool> DeleteAsync(int id);
    }
}
