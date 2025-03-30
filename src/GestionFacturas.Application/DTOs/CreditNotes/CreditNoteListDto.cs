namespace GestionFacturas.Application.DTOs.CreditNotes;

public class CreditNoteListDto
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
