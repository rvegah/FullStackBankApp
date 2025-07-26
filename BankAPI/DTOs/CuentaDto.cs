namespace BankAPI.DTOs
{
    public class CuentaDto
    {
        public int CuentaId { get; set; }
        public required string NumeroCuenta { get; set; }
        public required string TipoCuenta { get; set; }
        public decimal SaldoInicial { get; set; }
        public bool Estado { get; set; }
        public int ClienteId { get; set; }
        public string? NombreCliente { get; set; } // Para mostrar el nombre del cliente
    }
}