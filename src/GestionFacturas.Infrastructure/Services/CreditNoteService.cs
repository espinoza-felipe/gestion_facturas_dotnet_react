using GestionFacturas.Application.DTOs.CreditNotes;
using GestionFacturas.Application.Interfaces;
using GestionFacturas.Domain.Entities;
using GestionFacturas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionFacturas.Infrastructure.Services;

public class CreditNoteService : ICreditNoteService
{
    private readonly AppDbContext _context;

    public CreditNoteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddCreditNoteAsync(int invoiceId, CreateCreditNoteDto dto)
    {
        var invoice = await _context.Invoices
            .Include(i => i.CreditNotes)
            .FirstOrDefaultAsync(i => i.Id == invoiceId);

        if (invoice == null)
            return false;

        var totalNotasActuales = invoice.CreditNotes.Sum(n => n.Amount);
        var montoPendiente = invoice.TotalAmount - totalNotasActuales;

        if (dto.Amount > montoPendiente)
            return false;

        var creditNote = new CreditNote
        {
            Amount = dto.Amount,
            Reason = dto.Reason,
            CreatedAt = DateTime.Now,
            InvoiceId = invoiceId
        };

        _context.CreditNotes.Add(creditNote);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<CreditNoteListDto>> GetAllCreditNotesAsync()
    {
        var notas = await _context.CreditNotes.Include(n => n.Invoice).ToListAsync();

        return notas.Select(n => new CreditNoteListDto
        {
            Id = n.Id,
            InvoiceId = n.InvoiceId,
            Amount = n.Amount,
            Reason = n.Reason,
            CreatedAt = n.CreatedAt
        });
    }

}
