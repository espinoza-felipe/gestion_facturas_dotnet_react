using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


using GestionFacturas.Infrastructure.Data;
using GestionFacturas.Domain.Entities;
using GestionFacturas.Domain.Enums;
using GestionFacturas.WebApi.DTOs.Invoices;
using GestionFacturas.WebApi.Mappers;





namespace GestionFacturas.WebApi.Controllers;


[ApiController]
[Route("api/Invoices")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InvoicesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/invoices/123
    [HttpGet("{invoiceNumber}")]
    [Authorize]
    public async Task<IActionResult> GetByInvoiceNumber(int invoiceNumber)
    {
        var invoice = await _context.Invoices
            .Include(i => i.CreditNotes)
            .Include(i => i.Customer)
            .Include(i => i.Details)
            .Include(i => i.Payment)
            .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);

        if (invoice == null)
            return NotFound($"No se encontró la factura #{invoiceNumber}");

        var dto = MapToDto(invoice);
        return Ok(dto);
    }

    // GET: api/invoices/status?factura=Issued&pago=Paid
    [HttpGet("status")]
    [Authorize]
    public async Task<IActionResult> GetByStatus([FromQuery] int? factura, [FromQuery] int? pago)
    {
        if ((factura.HasValue && !Enum.IsDefined(typeof(InvoiceStatus), factura.Value)) ||
            (pago.HasValue && !Enum.IsDefined(typeof(PaymentStatus), pago.Value)))
        {
            return BadRequest("Valores inválidos para estado de factura o estado de pago.");
        }

        var query = _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Details)
            .Include(i => i.Payment)
            .Include(i => i.CreditNotes)
            .AsQueryable();

        if (factura.HasValue)
        {
            query = query.Where(i => (int)i.Status == factura.Value);
        }

        if (pago.HasValue)
        {
            query = query.Where(i => (int)i.PaymentStatus == pago.Value);
        }

        var results = await query.ToListAsync();

        var dtoList = results.Select(InvoiceMapper.ToDto).ToList();
        return Ok(dtoList);
    }




    private InvoiceDto MapToDto(Invoice invoice)
    {
        return new InvoiceDto
        {
            InvoiceNumber = invoice.InvoiceNumber,
            IssueDate = invoice.IssueDate,
            PaymentDueDate = invoice.PaymentDueDate,
            TotalAmount = invoice.TotalAmount,
            Status = invoice.Status.ToString(),
            PaymentStatus = invoice.PaymentStatus.ToString(),

            Customer = new CustomerDto
            {
                Name = invoice.Customer.Name,
                Email = invoice.Customer.Email,
                Identification = invoice.Customer.Identification
            },

            Payment = invoice.Payment == null ? null : new PaymentDto
            {
                PaymentMethod = invoice.Payment.PaymentMethod,
                PaymentDate = invoice.Payment.PaymentDate
            },

            Details = invoice.Details.Select(d => new InvoiceDetailDto
            {
                ProductName = d.ProductName,
                UnitPrice = d.UnitPrice,
                Quantity = d.Quantity,
                Subtotal = d.Subtotal
            }).ToList(),

            CreditNotes = invoice.CreditNotes.Select(c => new CreditNoteDto
            {
                Amount = c.Amount,
                Reason = c.Reason,
                CreatedAt = c.CreatedAt
            }).ToList()
        };
    }

}
