namespace GestionFacturas.WebApi.DTOs.Invoices;

public class InvoiceDto
{
    public int InvoiceNumber { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime PaymentDueDate { get; set; }
    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;

    public CustomerDto Customer { get; set; } = null!;
    public PaymentDto? Payment { get; set; }
    public List<InvoiceDetailDto> Details { get; set; } = new();
    public List<CreditNoteDto> CreditNotes { get; set; } = new();
}
