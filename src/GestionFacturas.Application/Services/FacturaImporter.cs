using System.Text.Json;
using GestionFacturas.Application.DTOs.Import;
using GestionFacturas.Application.Interfaces;
using GestionFacturas.Infrastructure.Data;
using GestionFacturas.Domain.Entities;

namespace GestionFacturas.Application.Services;

public class FacturaImporter : IFacturaImporter
{

    private readonly AppDbContext _context;

    public FacturaImporter(AppDbContext context)
    {
        _context = context;
    }
    public async Task ImportFromJsonAsync(string jsonContent)
    {

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var root = JsonSerializer.Deserialize<InvoiceJsonRootDto>(jsonContent, options);
        if (root?.Invoices == null || !root.Invoices.Any())
        {
            Console.WriteLine("No hay facturas para importar.");
            return;
        }

        foreach (var factura in root.Invoices)
        {
            Console.WriteLine($"Procesando factura #{factura.Invoice_Number}");

            // Validar unicidad
            bool existeFactura = await _context.Invoices
                .AnyAsync(f => f.InvoiceNumber == factura.Invoice_Number);
            if (existeFactura)
            {
                Console.WriteLine("⚠️ Factura ya existe. Saltando.");
                continue;
            }

            // Crear entidad Cliente
            var cliente = new Customer
            {
                Name = factura.Customer.Customer_Name,
                Email = factura.Customer.Customer_Email,
                Identification = factura.Customer.Customer_Run
            };

            // Crear entidad Factura
            var invoice = new Invoice(
                factura.Invoice_Number,
                factura.Invoice_Date,
                factura.Payment_Due_Date,
                factura.Total_Amount
            )
            {
                Customer = cliente
            };

            // Agregar detalles
            foreach (var detalle in factura.Invoice_Detail)
            {
                invoice.Details.Add(new InvoiceDetail
                {
                    ProductName = detalle.Product_Name,
                    UnitPrice = detalle.Unit_Price,
                    Quantity = detalle.Quantity,
                    Subtotal = detalle.Subtotal
                });
            }

            // Agregar notas de crédito (si hay)
            foreach (var nota in factura.Invoice_Credit_Note)
            {
                invoice.CreditNotes.Add(new CreditNote
                {
                    Amount = nota.Credit_Note_Amount,
                    CreatedAt = nota.Credit_Note_Date,
                    Invoice = invoice
                });
            }

            // Agregar método de pago (si hay)
            if (factura.Invoice_Payment?.Payment_Date != null)
            {
                invoice.Payment = new Payment
                {
                    PaymentMethod = factura.Invoice_Payment.Payment_Method ?? "Desconocido",
                    PaymentDate = factura.Invoice_Payment.Payment_Date.Value,
                    Invoice = invoice
                };
            }

            // Actualizar estados automáticos
            invoice.ActualizarEstados();

            // Guardar en base de datos
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            Console.WriteLine($"💾 Factura #{invoice.InvoiceNumber} guardada correctamente.");
        }
    }
}
