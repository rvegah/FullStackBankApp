using BankAPI.Models;
using BankAPI.Services;
using BankAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentaController : ControllerBase
    {
        private readonly ICuentaService _cuentaService;

        public CuentaController(ICuentaService cuentaService)
        {
            _cuentaService = cuentaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuentaDto>>> GetAll()
        {
            var cuentas = await _cuentaService.GetAllAsync();
            var cuentasDto = cuentas.Select(c => new CuentaDto
            {
                CuentaId = c.CuentaId,
                NumeroCuenta = c.NumeroCuenta,
                TipoCuenta = c.TipoCuenta,
                SaldoInicial = c.SaldoInicial,
                Estado = c.Estado,
                ClienteId = c.ClienteId,
                NombreCliente = c.Cliente?.Nombre
            });
            return Ok(cuentasDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CuentaDto>> GetById(int id)
        {
            var cuenta = await _cuentaService.GetByIdAsync(id);
            if (cuenta == null) return NotFound();

            var cuentaDto = new CuentaDto
            {
                CuentaId = cuenta.CuentaId,
                NumeroCuenta = cuenta.NumeroCuenta,
                TipoCuenta = cuenta.TipoCuenta,
                SaldoInicial = cuenta.SaldoInicial,
                Estado = cuenta.Estado,
                ClienteId = cuenta.ClienteId,
                NombreCliente = cuenta.Cliente?.Nombre
            };

            return Ok(cuentaDto);
        }

        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<CuentaDto>>> GetByClienteId(int clienteId)
        {
            var cuentas = await _cuentaService.GetByClienteIdAsync(clienteId);
            var cuentasDto = cuentas.Select(c => new CuentaDto
            {
                CuentaId = c.CuentaId,
                NumeroCuenta = c.NumeroCuenta,
                TipoCuenta = c.TipoCuenta,
                SaldoInicial = c.SaldoInicial,
                Estado = c.Estado,
                ClienteId = c.ClienteId,
                NombreCliente = c.Cliente?.Nombre
            });
            return Ok(cuentasDto);
        }

        [HttpPost]
        public async Task<ActionResult<CuentaDto>> Create(CuentaCreateDto cuentaCreateDto)
        {
            try
            {
                var cuenta = new Cuenta
                {
                    NumeroCuenta = cuentaCreateDto.NumeroCuenta,
                    TipoCuenta = cuentaCreateDto.TipoCuenta,
                    SaldoInicial = cuentaCreateDto.SaldoInicial,
                    Estado = cuentaCreateDto.Estado,
                    ClienteId = cuentaCreateDto.ClienteId,
                    Cliente = null! // Se cargará automáticamente por EF
                };

                var created = await _cuentaService.AddAsync(cuenta);

                var cuentaDto = new CuentaDto
                {
                    CuentaId = created.CuentaId,
                    NumeroCuenta = created.NumeroCuenta,
                    TipoCuenta = created.TipoCuenta,
                    SaldoInicial = created.SaldoInicial,
                    Estado = created.Estado,
                    ClienteId = created.ClienteId,
                    NombreCliente = created.Cliente?.Nombre
                };

                return CreatedAtAction(nameof(GetById), new { id = cuentaDto.CuentaId }, cuentaDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CuentaDto>> Update(int id, CuentaUpdateDto cuentaUpdateDto)
        {
            try
            {
                var cuenta = new Cuenta
                {
                    NumeroCuenta = cuentaUpdateDto.NumeroCuenta,
                    TipoCuenta = cuentaUpdateDto.TipoCuenta,
                    SaldoInicial = cuentaUpdateDto.SaldoInicial,
                    Estado = cuentaUpdateDto.Estado,
                    ClienteId = cuentaUpdateDto.ClienteId,
                    Cliente = null!
                };

                var updated = await _cuentaService.UpdateAsync(id, cuenta);
                if (updated == null) return NotFound();

                var cuentaDto = new CuentaDto
                {
                    CuentaId = updated.CuentaId,
                    NumeroCuenta = updated.NumeroCuenta,
                    TipoCuenta = updated.TipoCuenta,
                    SaldoInicial = updated.SaldoInicial,
                    Estado = updated.Estado,
                    ClienteId = updated.ClienteId,
                    NombreCliente = updated.Cliente?.Nombre
                };

                return Ok(cuentaDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _cuentaService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}