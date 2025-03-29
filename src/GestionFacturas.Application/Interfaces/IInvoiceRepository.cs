using GestionFacturas.Domain.Entities;

namespace GestionFacturas.Application.Interfaces;

public interface IInvoiceRepository
{
    Task<Invoice?> GetByInvoiceNumberAsync(int invoiceNumber);
    Task UpdateAsync(Invoice invoice);
}
