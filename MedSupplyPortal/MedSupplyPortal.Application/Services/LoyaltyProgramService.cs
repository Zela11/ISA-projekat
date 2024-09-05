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
    public class LoyaltyProgramService : ILoyaltyProgramService
    {
        private readonly ILoyaltyProgramRepository _repository;

        public LoyaltyProgramService(ILoyaltyProgramRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> CreateLoyaltyProgramAsync(LoyaltyProgramDto loyaltyProgramDto)
        {
            var loyaltyProgram = new LoyaltyProgram
            {
                PointsPerPickup = loyaltyProgramDto.PointsPerPickup,
                CategoryScales = []
            };

            await _repository.AddAsync(loyaltyProgram);
            return true;
        }
        public async Task<List<LoyaltyProgram>> GetAsync()
        {
            return await _repository.GetAsync();
        }
        public async Task AddCategoryScaleToLoyaltyProgramAsync(CategoryScaleDto categoryScaleDto)
        {
            var categoryScale = new CategoryScale
            {
                Name = categoryScaleDto.Name,
                MinimumPoints = categoryScaleDto.MinimumPoints,
                PenaltyThreshold = categoryScaleDto.PenaltyThreshold,
                Discount = categoryScaleDto.Discount,

            };

            await _repository.AddCategoryScaleToLoyaltyProgramAsync(categoryScale);
        }
        public async Task DeleteLoyaltyProgramAsync()
        {
            await _repository.DeleteLoyaltyProgramAsync();
        }
        public async Task DeleteCategoryScaleAsync(string categoryName)
        {
            await _repository.DeleteCategoryScaleAsync(categoryName);
        }
        public async Task UpdateCategoryScaleAsync(CategoryScaleDto categoryScaleDto)
        {
            var loyaltyPrograms = await _repository.GetAsync();
            var loyaltyProgram = loyaltyPrograms.FirstOrDefault();
            if (loyaltyProgram != null)
            {
                var existingCategoryScale = loyaltyProgram.CategoryScales.FirstOrDefault(c => c.Name == categoryScaleDto.Name && c.MinimumPoints == categoryScaleDto.MinimumPoints);
                if (existingCategoryScale != null)
                {
                    existingCategoryScale.Name = categoryScaleDto.Name;
                    existingCategoryScale.MinimumPoints = categoryScaleDto.MinimumPoints;
                    existingCategoryScale.PenaltyThreshold = categoryScaleDto.PenaltyThreshold;
                    existingCategoryScale.Discount = categoryScaleDto.Discount;

                    await _repository.UpdateCategoryScaleAsync(existingCategoryScale);
                }
            }
        }
    }
}
