namespace GestionFacturas.Application.DTOs.Import;

public class InvoiceDetailDto
{
    public string Product_Name { get; set; } = string.Empty;
    public decimal Unit_Price { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}
