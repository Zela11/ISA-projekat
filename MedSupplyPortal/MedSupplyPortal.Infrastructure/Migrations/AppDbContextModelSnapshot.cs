﻿// <auto-generated />
using System;
using MedSupplyPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MedSupplyPortal.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Appointment", b =>
                {
                    b.Property<int>("CompanyId")
                        .HasColumnType("integer");

                    b.Property<int>("AdministratorId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Slot")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Duration")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("EquipmentAmount")
                        .HasColumnType("integer");

                    b.Property<int?>("EquipmentId")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("CompanyId", "AdministratorId", "Slot");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<double>("AverageRating")
                        .HasColumnType("double precision");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<TimeOnly>("End")
                        .HasColumnType("time without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<TimeOnly>("Start")
                        .HasColumnType("time without time zone");

                    b.HasKey("Id");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Equipment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("integer");

                    b.Property<int>("CompanyId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Equipments");
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("CompanyId")
                        .HasColumnType("integer");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<bool>("IsFirstLogin")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Occupation")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int>("PenaltyPoints")
                        .HasColumnType("integer");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Appointment", b =>
                {
                    b.HasOne("MedSupplyPortal.Domain.Entities.Company", null)
                        .WithMany("Appointments")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Company", b =>
                {
                    b.OwnsOne("MedSupplyPortal.Domain.Entities.Address", "Address", b1 =>
                        {
                            b1.Property<int>("CompanyId")
                                .HasColumnType("integer");

                            b1.Property<string>("City")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Country")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<double?>("Latitude")
                                .HasColumnType("double precision");

                            b1.Property<double?>("Longitude")
                                .HasColumnType("double precision");

                            b1.Property<string>("Street")
                                .IsRequired()
                                .HasMaxLength(255)
                                .HasColumnType("character varying(255)");

                            b1.HasKey("CompanyId");

                            b1.ToTable("Companies");

                            b1.WithOwner()
                                .HasForeignKey("CompanyId");
                        });

                    b.Navigation("Address")
                        .IsRequired();
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Equipment", b =>
                {
                    b.HasOne("MedSupplyPortal.Domain.Entities.Company", null)
                        .WithMany("EquipmentList")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.User", b =>
                {
                    b.HasOne("MedSupplyPortal.Domain.Entities.Company", null)
                        .WithMany("CompanyAdmins")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.OwnsOne("MedSupplyPortal.Domain.Entities.Address", "Address", b1 =>
                        {
                            b1.Property<int>("UserId")
                                .HasColumnType("integer");

                            b1.Property<string>("City")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Country")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<double?>("Latitude")
                                .HasColumnType("double precision");

                            b1.Property<double?>("Longitude")
                                .HasColumnType("double precision");

                            b1.Property<string>("Street")
                                .IsRequired()
                                .HasMaxLength(255)
                                .HasColumnType("character varying(255)");

                            b1.HasKey("UserId");

                            b1.ToTable("Users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.Navigation("Address")
                        .IsRequired();
                });

            modelBuilder.Entity("MedSupplyPortal.Domain.Entities.Company", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("CompanyAdmins");

                    b.Navigation("EquipmentList");
                });
#pragma warning restore 612, 618
        }
    }
}
