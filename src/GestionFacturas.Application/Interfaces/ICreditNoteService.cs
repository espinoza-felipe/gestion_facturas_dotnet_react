using GestionFacturas.Application.DTOs.CreditNotes;

namespace GestionFacturas.Application.Interfaces;

public interface ICreditNoteService
{
    Task<bool> AddCreditNoteAsync(int invoiceId, CreateCreditNoteDto dto);
    Task<IEnumerable<CreditNoteListDto>> GetAllCreditNotesAsync();

}
