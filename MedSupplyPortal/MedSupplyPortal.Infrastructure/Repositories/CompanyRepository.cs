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
               .ToListAsync();
    }

    public async Task<Company> GetByIdAsync(int id)
    {
        return await _context.Companies.FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task UpdateAsync(Company company)
    {
        _context.Set<Company>().Update(company);
        await _context.SaveChangesAsync();
    }
}
