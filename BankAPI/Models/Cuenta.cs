namespace BankAPI.Models
{
    public class Cuenta
    {
        public int CuentaId { get; set; }
        public required string NumeroCuenta { get; set; }
        public required string TipoCuenta { get; set; }
        public decimal SaldoInicial { get; set; }
        public bool Estado { get; set; }

        public int ClienteId { get; set; }
        public required Cliente Cliente { get; set; }

        public ICollection<Movimiento>? Movimientos { get; set; }
    }
}
