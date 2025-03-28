namespace GestionFacturas.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; }
    public DateTime PaymentDueDate { get; set; }
    public decimal TotalAmount { get; set; }

    public ICollection<CreditNote> CreditNotes { get; set; } = new List<CreditNote>();
}
