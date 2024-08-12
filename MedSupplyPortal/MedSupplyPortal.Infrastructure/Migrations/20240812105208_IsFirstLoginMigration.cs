using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedSupplyPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IsFirstLoginMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFirstLogin",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFirstLogin",
                table: "Users");
        }
    }
}
