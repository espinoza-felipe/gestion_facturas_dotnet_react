public class InvoiceWithCreditNotesImportDto
{
    public int Invoice_Number { get; set; }

    public List<CreditNoteJsonDto> Invoice_Credit_Note { get; set; } = new();
}
