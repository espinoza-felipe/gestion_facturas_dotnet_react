namespace GestionFacturas.WebApi.DTOs.Invoices;

public class PaymentDto
{
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
}
