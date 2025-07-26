using System.ComponentModel.DataAnnotations;

namespace BankAPI.DTOs
{
    public class MovimientoCreateDto
    {
        [Required(ErrorMessage = "El tipo de movimiento es obligatorio")]
        [RegularExpression("^(Crédito|Débito|Credito|Debito)$", ErrorMessage = "El tipo de movimiento debe ser 'Crédito' o 'Débito'")]
        public required string TipoMovimiento { get; set; }

        [Required(ErrorMessage = "El valor es obligatorio")]
        [Range(0.01, 10000, ErrorMessage = "El valor debe estar entre 0.01 y 10,000")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "El ID de la cuenta es obligatorio")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID de la cuenta debe ser válido")]
        public int CuentaId { get; set; }
    }
}