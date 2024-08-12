using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using MedSupplyPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Infrastructure.Repositories;

public class CompanyRepository : ICompanyRepository
{

    private readonly AppDbContext _context;

    public CompanyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Company company)
    {
        if (company != null) { await _context.Companies.AddAsync(company); }
        await _context.SaveChangesAsync();
    }

    public async Task<List<Company>> GetAllAsync()
    {
        return await _context.Companies
               .Include(c => c.Address)
               .Include(c => c.CompanyAdmins)
               .Include(c => c.EquipmentList)
               .ToListAsync();
    }

    public async Task<Company> GetByIdAsync(int id)
    {
        return await _context.Companies
            .Include(c => c.CompanyAdmins)
            .Include(c => c.EquipmentList)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task UpdateAsync(Company company)
    {
        _context.Set<Company>().Update(company);
        await _context.SaveChangesAsync();
    }
    public async Task AddEquipmentToCompanyAsync(int companyId, Equipment equipment)
    {
        var company = await GetByIdAsync(companyId);
        if (company != null)
        {
            company.EquipmentList ??= new List<Equipment>();
            company.EquipmentList.Add(equipment);
            _context.Companies.Update(company);
            await _context.SaveChangesAsync();
        }
    }
    public async Task UpdateEquipmentAsync(Equipment equipment)
    {
        _context.Equipments.Update(equipment);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteEquipmentAsync(int companyId, int equipmentId)
    {
        var company = await GetByIdAsync(companyId);
        if (company != null)
        {
            var equipment = company.EquipmentList?.FirstOrDefault(e => e.Id == equipmentId);
            if (equipment != null)
            {
                company.EquipmentList.Remove(equipment);
                _context.Equipments.Remove(equipment);
                _context.Companies.Update(company);
                await _context.SaveChangesAsync();
            }
        }
    }
}
