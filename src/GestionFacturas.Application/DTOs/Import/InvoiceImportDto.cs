namespace GestionFacturas.Application.DTOs.Import;

public class InvoiceImportDto
{
    public int Invoice_Number { get; set; }
    public DateTime Invoice_Date { get; set; }
    public string Invoice_Status { get; set; } = string.Empty;
    public decimal Total_Amount { get; set; }
    public int Days_To_Due { get; set; }
    public DateTime Payment_Due_Date { get; set; }
    public string Payment_Status { get; set; } = string.Empty;

    public List<InvoiceDetailDto> Invoice_Detail { get; set; } = new();
    public InvoicePaymentDto Invoice_Payment { get; set; } = new();
    public List<CreditNoteJsonDto> Invoice_Credit_Note { get; set; } = new();
    public CustomerDto Customer { get; set; } = new();
}
