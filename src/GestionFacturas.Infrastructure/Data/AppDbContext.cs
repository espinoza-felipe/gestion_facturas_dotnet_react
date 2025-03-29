using Microsoft.EntityFrameworkCore;
using GestionFacturas.Domain.Entities;

namespace GestionFacturas.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<InvoiceDetail> InvoiceDetails => Set<InvoiceDetail>();
        public DbSet<CreditNote> CreditNotes => Set<CreditNote>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Payment> Payments => Set<Payment>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>().HasIndex(i => i.InvoiceNumber).IsUnique();
        }
    }
}