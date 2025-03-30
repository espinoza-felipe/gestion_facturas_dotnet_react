namespace GestionFacturas.Application.DTOs.CreditNotes;

public class CreateCreditNoteDto
{
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
}