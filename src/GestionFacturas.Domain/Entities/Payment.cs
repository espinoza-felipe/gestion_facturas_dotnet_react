namespace GestionFacturas.Domain.Entities;

public class Payment
{
    public int Id { get; set; }

    public string PaymentMethod { get; set; } = null!;
    public DateTime PaymentDate { get; set; }

    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
}
