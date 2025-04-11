using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropertyMaster.PropertyManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubCategory",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TransactionCategory",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubCategory",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "TransactionCategory",
                table: "Transactions");
        }
    }
}
