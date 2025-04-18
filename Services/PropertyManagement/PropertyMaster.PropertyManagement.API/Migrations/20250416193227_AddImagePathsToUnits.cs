﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropertyMaster.PropertyManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePathsToUnits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePaths",
                table: "Units",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePaths",
                table: "Units");
        }
    }
}
