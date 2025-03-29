namespace GestionFacturas.Application.DTOs.Import;

public class InvoiceJsonRootDto
{
    public List<InvoiceImportDto> Invoices { get; set; } = new();
}
