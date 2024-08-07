using MedSupplyPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.IRepositories;

public interface ICompanyRepository
{
    Task<Company> GetByIdAsync(int id);
    Task AddAsync(Company company);
    Task<List<Company>> GetAllAsync();
    Task UpdateAsync(Company company); // Dodaj ovu liniju

}
