using MedSupplyPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.IRepositories
{
    public interface ILoyaltyProgramRepository
    {
        public Task AddAsync(LoyaltyProgram loyaltyProgram);
        public Task<List<LoyaltyProgram>> GetAsync();
        public Task AddCategoryScaleToLoyaltyProgramAsync(CategoryScale categoryScale);
        public Task DeleteLoyaltyProgramAsync();
        public Task DeleteCategoryScaleAsync(string categoryName);
        public Task UpdateCategoryScaleAsync(CategoryScale categoryScale);
    }
}
