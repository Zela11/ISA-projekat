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
    Task<Company> GetByIdAsync(int id);
    Task<bool> UpdateCompanyAsync(int id, CompanyDto companyDto);
    Task AddEquipmentToCompanyAsync(int companyId, EquipmentDto equipmentDto);
    Task UpdateEquipmentAsync(int companyId, int equipmentId, EquipmentDto equipmentDto);
    Task DeleteEquipmentAsync(int companyId, int equipmentId);
    Task UpdateEquipmentAmountAsync(int companyId, int equipmentId, EquipmentDto equipmentDto);
    Task AddAppointmentToCompanyAsync(int companyId, AppointmentDto appointmentDto);
    Task ReserveAppointmentAsync(int companyId, AppointmentEquipmentDto appointmentEquipmentDto);
    Task CompleteAppointmentAsync(int companyId, AppointmentDto appointmentDto);
    Task<List<Equipment>> GetEquipments();
    Task<bool> IsEquipmentReservedAsync(int equipmentId);

}
