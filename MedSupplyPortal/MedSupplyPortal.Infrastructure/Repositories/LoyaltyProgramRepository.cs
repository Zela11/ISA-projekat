using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using MedSupplyPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Infrastructure.Repositories
{
    public class LoyaltyProgramRepository : ILoyaltyProgramRepository
    {
        private readonly AppDbContext _context;

        public LoyaltyProgramRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(LoyaltyProgram loyaltyProgram)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable))
            {
                try
                {
                    if (loyaltyProgram != null)
                    {
                        var existingProgram = await _context.LoyaltyProgram.FirstOrDefaultAsync();

                        if (existingProgram == null)
                        {
                            await _context.AddAsync(loyaltyProgram);
                            await _context.SaveChangesAsync();
                            await transaction.CommitAsync();
                        }
                        else
                        {
                            throw new InvalidOperationException("A Loyalty program  already exists.");
                        }
                    }
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }


        public async Task<List<LoyaltyProgram>> GetAsync()
        {
            return await _context.LoyaltyProgram
                    .Include(c => c.CategoryScales)
                    .ToListAsync();
        }
        public async Task AddCategoryScaleToLoyaltyProgramAsync(CategoryScale categoryScale)
        {
            var loyaltyPrograms = await GetAsync();
            var loyaltyProgram = loyaltyPrograms.FirstOrDefault();
            if (loyaltyProgram != null)
            {
                loyaltyProgram.CategoryScales ??= new List<CategoryScale>();
                loyaltyProgram.CategoryScales.Add(categoryScale);
                _context.LoyaltyProgram.Update(loyaltyProgram);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteLoyaltyProgramAsync()
        {
            var loyaltyPrograms = await GetAsync();
            var loyaltyProgram = loyaltyPrograms?.FirstOrDefault();
            if (loyaltyProgram != null)
            {
                _context.Remove(loyaltyProgram);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteCategoryScaleAsync(string categoryName)
        {
            var loyaltyPrograms = await GetAsync();
            var loyaltyProgram = loyaltyPrograms?.FirstOrDefault();
            if (loyaltyProgram != null)
            {
                var categoryScale = loyaltyProgram.CategoryScales.FirstOrDefault(c => c.Name == categoryName);
                if (categoryScale != null)
                {
                    loyaltyProgram.CategoryScales.Remove(categoryScale);
                    _context.CategoryScales.Remove(categoryScale);
                    _context.LoyaltyProgram.Update(loyaltyProgram);
                    await _context.SaveChangesAsync();
                }
            }
        }
        public async Task UpdateCategoryScaleAsync(CategoryScale categoryScale)
        {
            _context.CategoryScales.Update(categoryScale);
            await _context.SaveChangesAsync();
        }
    }
}
