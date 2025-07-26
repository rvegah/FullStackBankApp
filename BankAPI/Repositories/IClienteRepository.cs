using BankAPI.Models;

namespace BankAPI.Repositories
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> GetAllAsync();
        Task<Cliente?> GetByIdAsync(int id);
        Task<Cliente> AddAsync(Cliente cliente);
        Task<Cliente?> UpdateAsync(int id, Cliente cliente);
        Task<bool> DeleteAsync(int id);
    }
}
