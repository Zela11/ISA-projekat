using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
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
                CompanyId = companyId
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
                Duration = appointmentDto.Duration.ToString(),
                Slot = appointmentDto.Slot
            };

            await _companyRepository.AddAppointmentToCompanyAsync(appointment);
        }

    }
}
