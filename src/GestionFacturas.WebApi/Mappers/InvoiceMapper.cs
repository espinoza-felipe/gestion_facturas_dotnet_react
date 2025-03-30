using GestionFacturas.Domain.Entities;
using GestionFacturas.WebApi.DTOs.Invoices;

namespace GestionFacturas.WebApi.Mappers;

public static class InvoiceMapper
{
    public static InvoiceDto ToDto(Invoice invoice)
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
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice,
                Subtotal = d.Subtotal
            }).ToList(),
            CreditNotes = invoice.CreditNotes.Select(n => new CreditNoteDto
            {
                Amount = n.Amount,
                Reason = n.Reason
            }).ToList()
        };
    }
}