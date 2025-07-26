namespace BankAPI.DTOs
{
    public class ClienteDto
    {
        public int ClienteId { get; set; }
        public required string Nombre { get; set; }
        public required string Genero { get; set; }
        public int Edad { get; set; }
        public required string Identificacion { get; set; }
        public required string Direccion { get; set; }
        public required string Telefono { get; set; }
        public bool Estado { get; set; }
        // NO incluimos Contrasena por seguridad
        // NO incluimos Cuentas para evitar referencias circulares
    }
}