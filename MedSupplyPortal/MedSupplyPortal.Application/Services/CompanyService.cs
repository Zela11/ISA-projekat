using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Domain;
using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

    public async Task<bool> CreateCompanyAsync(CompanyDto companyDto)
        {
            TimeOnly start;
            TimeOnly end;

            start = TimeOnly.Parse(companyDto.Start);
            end = TimeOnly.Parse(companyDto.End);
            

            var address = new Address
            {
                City = companyDto.Address?.City,
                Country = companyDto.Address?.Country,
                Street = companyDto.Address?.Street,
                Latitude = companyDto.Address?.Latitude,
                Longitude = companyDto.Address?.Longitude
            };
            var company = new Company
            {
                Name = companyDto.Name,
                Description = companyDto.Description,
                AverageRating = companyDto.AverageRating,
                Address = address,
                Start = start,
                End = end,
                EquipmentList = [],
                CompanyAdmins = [],
            };

            await _companyRepository.AddAsync(company);
            return true;
        }

        public async Task<List<Company>> GetAllAsync()  
        {
            return await _companyRepository.GetAllAsync();
        }
        public async Task<Company> GetByIdAsync(int id) 
        {
            return await _companyRepository.GetByIdAsync(id);
        }

        public async Task<bool> UpdateCompanyAsync(int id, CompanyDto companyDto)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            if (company == null)
            {
                return false;
            }
            var address = new Address
            {
                City = companyDto.Address.City,
                Country = companyDto.Address.Country,
                Street = companyDto.Address.Street,
                Latitude = companyDto.Address.Latitude,
                Longitude = companyDto.Address.Longitude
            };
            company.AverageRating = companyDto.AverageRating;
            company.Address = address;
            company.Description = companyDto.Description;
            company.Name = companyDto.Name;

            await _companyRepository.UpdateAsync(company);
            return true;
        }
        public async Task AddEquipmentToCompanyAsync(int companyId, EquipmentDto equipmentDto)
        {
            var equipment = new Equipment
            {
                Name = equipmentDto.Name,
                Description = equipmentDto.Description,
                IsAvailable = equipmentDto.IsAvailable,
                CompanyId = companyId,
                Amount = equipmentDto.Amount,
                ReservedAmount = equipmentDto.ReservedAmount,
                Type = (EquipmentType)equipmentDto.Type,
                Price = equipmentDto.Price
            };

            await _companyRepository.AddEquipmentToCompanyAsync(companyId, equipment);
        }
        public async Task UpdateEquipmentAsync(int companyId, int equipmentId, EquipmentDto equipmentDto)
        {
            var equipment = await _companyRepository.GetByIdAsync(companyId);
            if (equipment != null)
            {
                var existingEquipment = equipment.EquipmentList?.FirstOrDefault(e => e.Id == equipmentId);
                if (existingEquipment != null)
                {
                    existingEquipment.Name = equipmentDto.Name;
                    existingEquipment.Description = equipmentDto.Description;
                    existingEquipment.IsAvailable = equipmentDto.IsAvailable;
                    existingEquipment.CompanyId = companyId;
                    existingEquipment.Amount = equipmentDto.Amount;
                    existingEquipment.Type = (EquipmentType)equipmentDto.Type;
                    existingEquipment.Price = equipmentDto.Price;
                    await _companyRepository.UpdateEquipmentAsync(existingEquipment);
                }
            }
        }
        public async Task UpdateEquipmentAmountAsync(int companyId, int equipmentId, EquipmentDto equipmentDto)
        {
            var equipment = await _companyRepository.GetByIdAsync(companyId);
            if (equipment != null)
            {
                var existingEquipment = equipment.EquipmentList?.FirstOrDefault(e => e.Id == equipmentId);
                if (existingEquipment != null)
                {
                    existingEquipment.Amount = equipmentDto.Amount;
                    existingEquipment.ReservedAmount = equipmentDto.ReservedAmount;

                    await _companyRepository.UpdateEquipmentAsync(existingEquipment);
                }
            }
        }

        public async Task DeleteEquipmentAsync(int companyId, int equipmentId)
        {
            await _companyRepository.DeleteEquipmentAsync(companyId, equipmentId);
        }

        public async Task AddAppointmentToCompanyAsync(int companyId, AppointmentDto appointmentDto)
        {
            var appointment = new Appointment
            {
                CompanyId = companyId,
                AdministratorId = appointmentDto.AdministratorId,
                UserId = appointmentDto.UserId,
                Duration = appointmentDto.Duration.ToString(),
                Slot = appointmentDto.Slot,
                Status = appointmentDto.Status,
                EquipmentId = appointmentDto.EquipmentId,
                EquipmentAmount = appointmentDto.EquipmentAmount,
                UniqueReservationId = appointmentDto.UniqueReservationId,
                TotalPrice = appointmentDto.TotalPrice

            };

            await _companyRepository.AddAppointmentToCompanyAsync(appointment);

        }

        public async Task ReserveAppointmentAsync(int companyId, AppointmentDto appointmentDto)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            if (company != null)
            {
                var existingAppointment = company.Appointments?.FirstOrDefault(a => a.AdministratorId == appointmentDto.AdministratorId && a.Slot == appointmentDto.Slot);
                if (existingAppointment != null)
                {
                    existingAppointment.UserId = appointmentDto.UserId;
                    existingAppointment.EquipmentId = appointmentDto.EquipmentId;
                    existingAppointment.EquipmentAmount = appointmentDto.EquipmentAmount;
                    existingAppointment.Status = AppointmentStatus.Reserved;
                    existingAppointment.UniqueReservationId = appointmentDto.UniqueReservationId;
                    existingAppointment.TotalPrice = appointmentDto.TotalPrice;
                    await _companyRepository.ReserveAppointmentAsync(existingAppointment);
                }
            }
        }

        public async Task CompleteAppointmentAsync(int companyId, AppointmentDto appointmentDto)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            if (company != null)
            {
                var existingAppointment = company.Appointments?.FirstOrDefault(a => a.AdministratorId == appointmentDto.AdministratorId && a.Slot == appointmentDto.Slot);
                if (existingAppointment != null)
                {
                    existingAppointment.Status = appointmentDto.Status;
                    await _companyRepository.CompleteAppointmentAsync(existingAppointment);
                }
            }
        }

        public async Task<List<Equipment>> GetEquipments()
        {
            return await _companyRepository.GetEquipmets();
        }

        public async Task<bool> IsEquipmentReservedAsync(int equipmentId)
        {
            var appointments = await _companyRepository.GetAppointments();
            if (appointments == null)
            {
                return false;
            }

            foreach (var appointment in appointments)
             {
                if (appointment.EquipmentId == equipmentId && appointment.Status == AppointmentStatus.Reserved)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
