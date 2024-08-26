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
    Task UpdateAsync(Company company);
    Task AddEquipmentToCompanyAsync(int companyId, Equipment equipment);
    Task UpdateEquipmentAsync(Equipment equipment);
    Task DeleteEquipmentAsync(int companyId, int equipmentId);
    Task AddAppointmentToCompanyAsync(Appointment appointment);
    Task ReserveAppointmentAsync(Appointment appointment);
    Task CompleteAppointmentAsync(Appointment appointment);
}
