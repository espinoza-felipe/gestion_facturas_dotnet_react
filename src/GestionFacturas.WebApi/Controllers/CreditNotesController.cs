using GestionFacturas.Application.DTOs.CreditNotes;
using GestionFacturas.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionFacturas.WebApi.Controllers;

[ApiController]
[Route("api/CreditNotes")]
[Authorize]
public class CreditNotesController : ControllerBase
{
    private readonly ICreditNoteService _creditNoteService;

    public CreditNotesController(ICreditNoteService creditNoteService)
    {
        _creditNoteService = creditNoteService;
    }

    [HttpPost("{invoiceId}")]
    public async Task<IActionResult> AddCreditNote(int invoiceId, [FromBody] CreateCreditNoteDto dto)
    {
        var result = await _creditNoteService.AddCreditNoteAsync(invoiceId, dto);

        if (!result)
            return BadRequest("No se pudo agregar la nota de crédito. Revisa el monto o la factura.");

        return Ok("Nota de crédito agregada correctamente.");
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCreditNotes()
    {
        var creditNotes = await _creditNoteService.GetAllCreditNotesAsync();
        return Ok(creditNotes);
    }

}
