using System.ComponentModel.DataAnnotations;

namespace BankAPI.DTOs
{
    public class CuentaCreateDto
    {
        [Required(ErrorMessage = "El número de cuenta es obligatorio")]
        [StringLength(10, MinimumLength = 6, ErrorMessage = "El número de cuenta debe tener entre 6 y 10 dígitos")]
        [RegularExpression(@"^\d+$", ErrorMessage = "El número de cuenta solo debe contener números")]
        public required string NumeroCuenta { get; set; }

        [Required(ErrorMessage = "El tipo de cuenta es obligatorio")]
        [RegularExpression("^(Ahorro|Corriente)$", ErrorMessage = "El tipo de cuenta debe ser 'Ahorro' o 'Corriente'")]
        public required string TipoCuenta { get; set; }

        [Required(ErrorMessage = "El saldo inicial es obligatorio")]
        [Range(0, double.MaxValue, ErrorMessage = "El saldo inicial debe ser mayor o igual a 0")]
        public decimal SaldoInicial { get; set; }

        public bool Estado { get; set; } = true;

        [Required(ErrorMessage = "El ID del cliente es obligatorio")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del cliente debe ser válido")]
        public int ClienteId { get; set; }
    }
}