using BankAPI.Models;
using BankAPI.Repositories;

namespace BankAPI.Services
{
    public class CuentaService : ICuentaService
    {
        private readonly ICuentaRepository _cuentaRepository;

        public CuentaService(ICuentaRepository cuentaRepository)
        {
            _cuentaRepository = cuentaRepository;
        }

        public async Task<IEnumerable<Cuenta>> GetAllAsync()
        {
            return await _cuentaRepository.GetAllAsync();
        }

        public async Task<Cuenta?> GetByIdAsync(int id)
        {
            return await _cuentaRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Cuenta>> GetByClienteIdAsync(int clienteId)
        {
            return await _cuentaRepository.GetByClienteIdAsync(clienteId);
        }

        public async Task<Cuenta> AddAsync(Cuenta cuenta)
        {
            // Validar que el cliente existe
            if (!await _cuentaRepository.ClienteExistsAsync(cuenta.ClienteId))
            {
                throw new ArgumentException($"Cliente con ID {cuenta.ClienteId} no existe");
            }

            return await _cuentaRepository.AddAsync(cuenta);
        }

        public async Task<Cuenta?> UpdateAsync(int id, Cuenta cuenta)
        {
            // Validar que el cliente existe
            if (!await _cuentaRepository.ClienteExistsAsync(cuenta.ClienteId))
            {
                throw new ArgumentException($"Cliente con ID {cuenta.ClienteId} no existe");
            }

            return await _cuentaRepository.UpdateAsync(id, cuenta);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _cuentaRepository.DeleteAsync(id);
        }

        public async Task<bool> ClienteExistsAsync(int clienteId)
        {
            return await _cuentaRepository.ClienteExistsAsync(clienteId);
        }
    }
}