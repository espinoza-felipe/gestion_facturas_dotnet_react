using GestionFacturas.Domain.Enums;

namespace GestionFacturas.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public int InvoiceNumber { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime PaymentDueDate { get; set; }
    public decimal TotalAmount { get; set; }

    public InvoiceStatus Status { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }

    public ICollection<CreditNote> CreditNotes { get; set; } = new List<CreditNote>();

    public Invoice(int invoiceNumber, DateTime issueDate, DateTime paymentDueDate, decimal totalAmount)
{
    InvoiceNumber = invoiceNumber;
    IssueDate = issueDate;
    PaymentDueDate = paymentDueDate;
    TotalAmount = totalAmount;

    ActualizarEstados();
}

    public void CalcularEstadoFactura()
    {
        if (CreditNotes == null || !CreditNotes.Any())
        {
            Status = InvoiceStatus.Issued;
        }
        else
        {
            var montoTotalNotas = CreditNotes.Sum(n => n.Amount);

            if (montoTotalNotas == TotalAmount)
                Status = InvoiceStatus.Cancelled;
            else if (montoTotalNotas < TotalAmount)
                Status = InvoiceStatus.Partial;
        }
    }

    public void CalcularEstadoPago()
    {
        if (Status == InvoiceStatus.Cancelled)
        {
            PaymentStatus = PaymentStatus.Paid;
            return;
        }

        if (DateTime.Now < PaymentDueDate)
            PaymentStatus = PaymentStatus.Pending;
        else
            PaymentStatus = PaymentStatus.Overdue;
    }

    public void ActualizarEstados()
    {
        CalcularEstadoFactura();
        CalcularEstadoPago();
    }
}
