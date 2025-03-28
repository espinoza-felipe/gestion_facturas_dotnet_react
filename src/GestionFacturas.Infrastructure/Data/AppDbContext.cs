using Microsoft.EntityFrameworkCore;
using GestionFacturas.Domain.Entities;

namespace GestionFacturas.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<CreditNote> CreditNotes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>().HasIndex(i => i.InvoiceNumber).IsUnique();
        }
    }
}