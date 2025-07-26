namespace BankAPI.DTOs
{
    public class MovimientoDto
    {
        public int MovimientoId { get; set; }
        public DateTime Fecha { get; set; }
        public required string TipoMovimiento { get; set; }
        public decimal Valor { get; set; } // Positivo para crédito, negativo para débito
        public decimal Saldo { get; set; } // Saldo después del movimiento
        public int CuentaId { get; set; }
        public string? NumeroCuenta { get; set; }
        public string? NombreCliente { get; set; }
    }
}
