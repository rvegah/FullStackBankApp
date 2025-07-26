using BankAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly ApplicationDbContext _context;

        public ClienteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            return await _context.Clientes.ToListAsync();
        }

        public async Task<Cliente?> GetByIdAsync(int id)
        {
            return await _context.Clientes.FindAsync(id);
        }

        public async Task<Cliente> AddAsync(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<Cliente?> UpdateAsync(int id, Cliente cliente)
        {
            var existing = await _context.Clientes.FindAsync(id);
            if (existing == null) return null;

            // Actualiza propiedades
            existing.Nombre = cliente.Nombre;
            existing.Genero = cliente.Genero;
            existing.Edad = cliente.Edad;
            existing.Identificacion = cliente.Identificacion;
            existing.Direccion = cliente.Direccion;
            existing.Telefono = cliente.Telefono;
            existing.Contrasena = cliente.Contrasena;
            existing.Estado = cliente.Estado;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return false;

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
