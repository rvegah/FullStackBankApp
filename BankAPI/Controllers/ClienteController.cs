using BankAPI.Models;
using BankAPI.Services;
using BankAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public ClienteController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetAll()
        {
            var clientes = await _clienteService.GetAllAsync();
            var clientesDto = clientes.Select(c => new ClienteDto
            {
                ClienteId = c.ClienteId,
                Nombre = c.Nombre,
                Genero = c.Genero,
                Edad = c.Edad,
                Identificacion = c.Identificacion,
                Direccion = c.Direccion,
                Telefono = c.Telefono,
                Estado = c.Estado
            });
            return Ok(clientesDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDto>> GetById(int id)
        {
            var cliente = await _clienteService.GetByIdAsync(id);
            if (cliente == null) return NotFound();

            var clienteDto = new ClienteDto
            {
                ClienteId = cliente.ClienteId,
                Nombre = cliente.Nombre,
                Genero = cliente.Genero,
                Edad = cliente.Edad,
                Identificacion = cliente.Identificacion,
                Direccion = cliente.Direccion,
                Telefono = cliente.Telefono,
                Estado = cliente.Estado
            };

            return Ok(clienteDto);
        }

        [HttpPost]
        public async Task<ActionResult<ClienteDto>> Create(ClienteCreateDto clienteCreateDto)
        {
            var cliente = new Cliente
            {
                Nombre = clienteCreateDto.Nombre,
                Genero = clienteCreateDto.Genero,
                Edad = clienteCreateDto.Edad,
                Identificacion = clienteCreateDto.Identificacion,
                Direccion = clienteCreateDto.Direccion,
                Telefono = clienteCreateDto.Telefono,
                Contrasena = clienteCreateDto.Contrasena,
                Estado = clienteCreateDto.Estado
            };

            var created = await _clienteService.AddAsync(cliente);

            var clienteDto = new ClienteDto
            {
                ClienteId = created.ClienteId,
                Nombre = created.Nombre,
                Genero = created.Genero,
                Edad = created.Edad,
                Identificacion = created.Identificacion,
                Direccion = created.Direccion,
                Telefono = created.Telefono,
                Estado = created.Estado
            };

            return CreatedAtAction(nameof(GetById), new { id = clienteDto.ClienteId }, clienteDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ClienteDto>> Update(int id, ClienteUpdateDto clienteUpdateDto)
        {
            var cliente = new Cliente
            {
                Nombre = clienteUpdateDto.Nombre,
                Genero = clienteUpdateDto.Genero,
                Edad = clienteUpdateDto.Edad,
                Identificacion = clienteUpdateDto.Identificacion,
                Direccion = clienteUpdateDto.Direccion,
                Telefono = clienteUpdateDto.Telefono,
                Contrasena = clienteUpdateDto.Contrasena,
                Estado = clienteUpdateDto.Estado
            };

            var updated = await _clienteService.UpdateAsync(id, cliente);
            if (updated == null) return NotFound();

            var clienteDto = new ClienteDto
            {
                ClienteId = updated.ClienteId,
                Nombre = updated.Nombre,
                Genero = updated.Genero,
                Edad = updated.Edad,
                Identificacion = updated.Identificacion,
                Direccion = updated.Direccion,
                Telefono = updated.Telefono,
                Estado = updated.Estado
            };

            return Ok(clienteDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _clienteService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}