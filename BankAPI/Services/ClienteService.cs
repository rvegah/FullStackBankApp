using BankAPI.Models;
using BankAPI.Repositories;

namespace BankAPI.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;

        public ClienteService(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            return await _clienteRepository.GetAllAsync();
        }

        public async Task<Cliente?> GetByIdAsync(int id)
        {
            return await _clienteRepository.GetByIdAsync(id);
        }

        public async Task<Cliente> AddAsync(Cliente cliente)
        {
            return await _clienteRepository.AddAsync(cliente);
        }

        public async Task<Cliente?> UpdateAsync(int id, Cliente cliente)
        {
            return await _clienteRepository.UpdateAsync(id, cliente);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _clienteRepository.DeleteAsync(id);
        }
    }
}
