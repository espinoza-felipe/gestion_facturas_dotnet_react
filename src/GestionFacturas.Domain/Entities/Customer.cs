namespace GestionFacturas.Domain.Entities;

public class Customer
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Identification { get; set; } = null!;

    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
