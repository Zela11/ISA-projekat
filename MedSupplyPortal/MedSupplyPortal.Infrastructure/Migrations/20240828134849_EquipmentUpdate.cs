using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedSupplyPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EquipmentUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Equipments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Equipments");
        }
    }
}
