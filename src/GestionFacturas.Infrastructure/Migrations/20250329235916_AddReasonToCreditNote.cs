using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionFacturas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReasonToCreditNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "CreditNotes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reason",
                table: "CreditNotes");
        }
    }
}
