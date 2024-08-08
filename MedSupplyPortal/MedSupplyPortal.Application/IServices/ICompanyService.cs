using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.IServices;

public interface ICompanyService
{
    Task<bool> CreateCompanyAsync(CompanyDto companyDto);
    Task<List<Company>> GetAllAsync();

}
