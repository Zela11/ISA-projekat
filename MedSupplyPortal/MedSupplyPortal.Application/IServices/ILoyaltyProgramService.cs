using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.IServices
{
    public interface ILoyaltyProgramService
    {
        Task<bool> CreateLoyaltyProgramAsync(LoyaltyProgramDto loyaltyProgramDto);
        public Task<List<LoyaltyProgram>> GetAsync();
        public Task AddCategoryScaleToLoyaltyProgramAsync(CategoryScaleDto categoryScaleDto);
        public Task DeleteLoyaltyProgramAsync();
        public Task DeleteCategoryScaleAsync(string categoryName);
        public Task UpdateCategoryScaleAsync(CategoryScaleDto categoryScaleDto);
    }
}
