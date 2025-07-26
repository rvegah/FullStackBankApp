using System.ComponentModel.DataAnnotations;

namespace BankAPI.DTOs
{
    public class ClienteCreateDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public required string Nombre { get; set; }

        [Required(ErrorMessage = "El género es obligatorio")]
        [RegularExpression("^[MF]$", ErrorMessage = "El género debe ser M o F")]
        public required string Genero { get; set; }

        [Required(ErrorMessage = "La edad es obligatoria")]
        [Range(18, 100, ErrorMessage = "La edad debe estar entre 18 y 100 años")]
        public int Edad { get; set; }

        [Required(ErrorMessage = "La identificación es obligatoria")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "La identificación debe tener entre 8 y 20 caracteres")]
        [RegularExpression(@"^\d+$", ErrorMessage = "La identificación solo debe contener números")]
        public required string Identificacion { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria")]
        [StringLength(200, MinimumLength = 10, ErrorMessage = "La dirección debe tener entre 10 y 200 caracteres")]
        public required string Direccion { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        [RegularExpression(@"^\d{9,10}$", ErrorMessage = "El teléfono debe tener 9 o 10 dígitos")]
        public required string Telefono { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "La contraseña debe tener entre 4 y 50 caracteres")]
        public required string Contrasena { get; set; }

        public bool Estado { get; set; } = true;
    }
}