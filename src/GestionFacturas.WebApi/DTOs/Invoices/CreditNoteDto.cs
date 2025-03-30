namespace GestionFacturas.WebApi.DTOs.Invoices;

public class CreditNoteDto
{
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
}
