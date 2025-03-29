using GestionFacturas.Application.Interfaces;
using GestionFacturas.Domain.Entities;
using GestionFacturas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionFacturas.Infrastructure.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly AppDbContext _context;

    public InvoiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Invoice?> GetByInvoiceNumberAsync(int invoiceNumber)
    {
        return await _context.Invoices
            .Include(i => i.CreditNotes)
            .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);
    }

    public async Task UpdateAsync(Invoice invoice)
    {
        _context.Invoices.Update(invoice);
        await _context.SaveChangesAsync();
    }
}
