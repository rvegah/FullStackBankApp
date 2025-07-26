namespace BankAPI.Models
{
    public class Movimiento
    {
        public int MovimientoId { get; set; }
        public DateTime Fecha { get; set; }
        public required string TipoMovimiento { get; set; } // "Crédito" o "Débito"
        public decimal Valor { get; set; }
        public decimal Saldo { get; set; }

        public int CuentaId { get; set; }
        public required Cuenta Cuenta { get; set; }
    }
}