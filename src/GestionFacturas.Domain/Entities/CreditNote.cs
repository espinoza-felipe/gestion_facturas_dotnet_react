namespace GestionFacturas.Domain.Entities;

public class CreditNote
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }

    public Invoice? Invoice { get; set; }
}
