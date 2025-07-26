using BankAPI.Models;
using BankAPI.Services;
using BankAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientoController : ControllerBase
    {
        private readonly IMovimientoService _movimientoService;

        public MovimientoController(IMovimientoService movimientoService)
        {
            _movimientoService = movimientoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetAll()
        {
            var movimientos = await _movimientoService.GetAllAsync();
            var movimientosDto = movimientos.Select(m => new MovimientoDto
            {
                MovimientoId = m.MovimientoId,
                Fecha = m.Fecha,
                TipoMovimiento = m.TipoMovimiento,
                Valor = m.Valor,
                Saldo = m.Saldo,
                CuentaId = m.CuentaId,
                NumeroCuenta = m.Cuenta?.NumeroCuenta,
                NombreCliente = m.Cuenta?.Cliente?.Nombre
            });
            return Ok(movimientosDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoDto>> GetById(int id)
        {
            var movimiento = await _movimientoService.GetByIdAsync(id);
            if (movimiento == null) return NotFound();

            var movimientoDto = new MovimientoDto
            {
                MovimientoId = movimiento.MovimientoId,
                Fecha = movimiento.Fecha,
                TipoMovimiento = movimiento.TipoMovimiento,
                Valor = movimiento.Valor,
                Saldo = movimiento.Saldo,
                CuentaId = movimiento.CuentaId,
                NumeroCuenta = movimiento.Cuenta?.NumeroCuenta,
                NombreCliente = movimiento.Cuenta?.Cliente?.Nombre
            };

            return Ok(movimientoDto);
        }

        [HttpGet("cuenta/{cuentaId}")]
        public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetByCuentaId(int cuentaId)
        {
            var movimientos = await _movimientoService.GetByCuentaIdAsync(cuentaId);
            var movimientosDto = movimientos.Select(m => new MovimientoDto
            {
                MovimientoId = m.MovimientoId,
                Fecha = m.Fecha,
                TipoMovimiento = m.TipoMovimiento,
                Valor = m.Valor,
                Saldo = m.Saldo,
                CuentaId = m.CuentaId,
                NumeroCuenta = m.Cuenta?.NumeroCuenta,
                NombreCliente = m.Cuenta?.Cliente?.Nombre
            });
            return Ok(movimientosDto);
        }

        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetByClienteId(int clienteId)
        {
            var movimientos = await _movimientoService.GetByClienteIdAsync(clienteId);
            var movimientosDto = movimientos.Select(m => new MovimientoDto
            {
                MovimientoId = m.MovimientoId,
                Fecha = m.Fecha,
                TipoMovimiento = m.TipoMovimiento,
                Valor = m.Valor,
                Saldo = m.Saldo,
                CuentaId = m.CuentaId,
                NumeroCuenta = m.Cuenta?.NumeroCuenta,
                NombreCliente = m.Cuenta?.Cliente?.Nombre
            });
            return Ok(movimientosDto);
        }

        [HttpGet("reportes")]
        public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetReporte(
            [FromQuery] DateTime fechaInicio,
            [FromQuery] DateTime fechaFin,
            [FromQuery] int? clienteId = null)
        {
            var movimientos = await _movimientoService.GetByDateRangeAsync(fechaInicio, fechaFin, clienteId);
            var movimientosDto = movimientos.Select(m => new MovimientoDto
            {
                MovimientoId = m.MovimientoId,
                Fecha = m.Fecha,
                TipoMovimiento = m.TipoMovimiento,
                Valor = m.Valor,
                Saldo = m.Saldo,
                CuentaId = m.CuentaId,
                NumeroCuenta = m.Cuenta?.NumeroCuenta,
                NombreCliente = m.Cuenta?.Cliente?.Nombre
            });
            return Ok(movimientosDto);
        }

        [HttpPost]
        public async Task<ActionResult<MovimientoDto>> Create(MovimientoCreateDto movimientoCreateDto)
        {
            try
            {
                var created = await _movimientoService.AddAsync(
                    movimientoCreateDto.TipoMovimiento,
                    movimientoCreateDto.Valor,
                    movimientoCreateDto.CuentaId
                );

                var movimientoDto = new MovimientoDto
                {
                    MovimientoId = created.MovimientoId,
                    Fecha = created.Fecha,
                    TipoMovimiento = created.TipoMovimiento,
                    Valor = created.Valor,
                    Saldo = created.Saldo,
                    CuentaId = created.CuentaId,
                    NumeroCuenta = created.Cuenta?.NumeroCuenta,
                    NombreCliente = created.Cuenta?.Cliente?.Nombre
                };

                return CreatedAtAction(nameof(GetById), new { id = movimientoDto.MovimientoId }, movimientoDto);
            }
            catch (InvalidOperationException ex)
            {
                // Errores de negocio: "Saldo no disponible", "Cupo diario Excedido"
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Errores de validación
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MovimientoDto>> Update(int id, MovimientoUpdateDto movimientoUpdateDto)
        {
            try
            {
                var updated = await _movimientoService.UpdateAsync(
                    id,
                    movimientoUpdateDto.TipoMovimiento,
                    movimientoUpdateDto.Valor,
                    movimientoUpdateDto.CuentaId
                );

                if (updated == null) return NotFound();

                var movimientoDto = new MovimientoDto
                {
                    MovimientoId = updated.MovimientoId,
                    Fecha = updated.Fecha,
                    TipoMovimiento = updated.TipoMovimiento,
                    Valor = updated.Valor,
                    Saldo = updated.Saldo,
                    CuentaId = updated.CuentaId,
                    NumeroCuenta = updated.Cuenta?.NumeroCuenta,
                    NombreCliente = updated.Cuenta?.Cliente?.Nombre
                };

                return Ok(movimientoDto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _movimientoService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
