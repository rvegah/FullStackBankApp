using Xunit;
using Moq;
using BankAPI.Services;
using BankAPI.Repositories;
using BankAPI.Models;

namespace BankAPI.Tests
{
    public class MovimientoServiceTests
    {
        private readonly Mock<IMovimientoRepository> _mockRepository;
        private readonly MovimientoService _movimientoService;

        public MovimientoServiceTests()
        {
            _mockRepository = new Mock<IMovimientoRepository>();
            _movimientoService = new MovimientoService(_mockRepository.Object);
        }

        [Fact]
        public async Task AddAsync_DebitoConSaldoInsuficiente_DeberiaLanzarExcepcion()
        {
            // Arrange
            var cuentaId = 1;
            var tipoMovimiento = "Débito";
            var valor = 1000m;
            var saldoActual = 500m; // Saldo insuficiente

            _mockRepository.Setup(r => r.CuentaExistsAsync(cuentaId))
                          .ReturnsAsync(true);

            _mockRepository.Setup(r => r.GetSaldoActualAsync(cuentaId))
                          .ReturnsAsync(saldoActual);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _movimientoService.AddAsync(tipoMovimiento, valor, cuentaId)
            );

            Assert.Equal("Saldo no disponible", exception.Message);
        }

        [Fact]
        public async Task AddAsync_CreditoExitoso_DeberiaCrearMovimiento()
        {
            // Arrange
            var cuentaId = 1;
            var tipoMovimiento = "Crédito";
            var valor = 500m;
            var saldoActual = 1000m;
            var nuevoSaldo = saldoActual + valor;

            var movimientoEsperado = new Movimiento
            {
                MovimientoId = 1,
                Fecha = DateTime.Now,
                TipoMovimiento = "Crédito",
                Valor = valor,
                Saldo = nuevoSaldo,
                CuentaId = cuentaId,
                Cuenta = new Cuenta 
                { 
                    CuentaId = cuentaId, 
                    NumeroCuenta = "478758", 
                    TipoCuenta = "Ahorro", 
                    SaldoInicial = 1000,
                    Estado = true,
                    ClienteId = 1,
                    Cliente = new Cliente 
                    { 
                        ClienteId = 1, 
                        Nombre = "José Lema",
                        Genero = "M",
                        Edad = 35,
                        Identificacion = "12345678",
                        Direccion = "Otavalo sn y principal",
                        Telefono = "098254785",
                        Contrasena = "1234",
                        Estado = true
                    }
                }
            };

            _mockRepository.Setup(r => r.CuentaExistsAsync(cuentaId))
                          .ReturnsAsync(true);

            _mockRepository.Setup(r => r.GetSaldoActualAsync(cuentaId))
                          .ReturnsAsync(saldoActual);

            _mockRepository.Setup(r => r.AddAsync(It.IsAny<Movimiento>()))
                          .ReturnsAsync(movimientoEsperado);

            // Act
            var resultado = await _movimientoService.AddAsync(tipoMovimiento, valor, cuentaId);

            // Assert
            Assert.NotNull(resultado);
            Assert.Equal("Crédito", resultado.TipoMovimiento);
            Assert.Equal(valor, resultado.Valor);
            Assert.Equal(nuevoSaldo, resultado.Saldo);
            Assert.Equal(cuentaId, resultado.CuentaId);

            // Verificar que se llamaron los métodos esperados
            _mockRepository.Verify(r => r.CuentaExistsAsync(cuentaId), Times.Once);
            _mockRepository.Verify(r => r.GetSaldoActualAsync(cuentaId), Times.Once);
            _mockRepository.Verify(r => r.AddAsync(It.IsAny<Movimiento>()), Times.Once);
        }

        [Fact]
        public async Task AddAsync_DebitoConCupoDiarioExcedido_DeberiaLanzarExcepcion()
        {
            // Arrange
            var cuentaId = 1;
            var tipoMovimiento = "Débito";
            var valor = 600m;
            var saldoActual = 2000m;
            var debitosDelDia = 500m; // Ya se retiraron $500 hoy
            // Total sería $1100, excede el límite de $1000

            _mockRepository.Setup(r => r.CuentaExistsAsync(cuentaId))
                          .ReturnsAsync(true);

            _mockRepository.Setup(r => r.GetSaldoActualAsync(cuentaId))
                          .ReturnsAsync(saldoActual);

            _mockRepository.Setup(r => r.GetDebitosDelDiaAsync(cuentaId, It.IsAny<DateTime>()))
                          .ReturnsAsync(debitosDelDia);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _movimientoService.AddAsync(tipoMovimiento, valor, cuentaId)
            );

            Assert.Equal("Cupo diario Excedido", exception.Message);
        }

        [Fact]
        public async Task AddAsync_CuentaNoExiste_DeberiaLanzarExcepcion()
        {
            // Arrange
            var cuentaId = 999; // Cuenta que no existe
            var tipoMovimiento = "Crédito";
            var valor = 100m;

            _mockRepository.Setup(r => r.CuentaExistsAsync(cuentaId))
                          .ReturnsAsync(false);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(
                () => _movimientoService.AddAsync(tipoMovimiento, valor, cuentaId)
            );

            Assert.Equal($"Cuenta con ID {cuentaId} no existe", exception.Message);
        }

        [Fact]
        public async Task AddAsync_ValorNegativo_DeberiaLanzarExcepcion()
        {
            // Arrange
            var cuentaId = 1;
            var tipoMovimiento = "Crédito";
            var valor = -100m; // Valor negativo

            _mockRepository.Setup(r => r.CuentaExistsAsync(cuentaId))
                          .ReturnsAsync(true);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(
                () => _movimientoService.AddAsync(tipoMovimiento, valor, cuentaId)
            );

            Assert.Equal("El valor debe ser mayor a cero", exception.Message);
        }
    }
}