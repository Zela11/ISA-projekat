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
    }
}
