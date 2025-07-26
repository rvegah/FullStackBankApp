namespace BankAPI.Models
{
    public class Persona
    {
        public int PersonaId { get; set; }
        public required string Nombre { get; set; }
        public required string Genero { get; set; }
        public int Edad { get; set; }
        public required string Identificacion { get; set; }
        public required string Direccion { get; set; }
        public required string Telefono { get; set; }
    }
}

