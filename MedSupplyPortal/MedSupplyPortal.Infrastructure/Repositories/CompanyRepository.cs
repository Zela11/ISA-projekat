using MedSupplyPortal.Domain;
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
               .Include(c => c.Appointments)
               .ToListAsync();
    }

    public async Task<List<Appointment>> GetAllAppointmentsByAdminAsync(int companyId, int adminId)
    {
        var company = await GetByIdAsync(companyId);

        if (company != null)
        {
            var appointments = company.Appointments
                .Where(a => company.CompanyAdmins.Any(admin => admin.Id == adminId))
                .ToList();

            return appointments;
        }

        return new List<Appointment>();
    }

    public async Task<Company> GetByIdAsync(int id)
    {
        return await _context.Companies
            .Include(c => c.CompanyAdmins)
            .Include(c => c.EquipmentList)
            .Include(c => c.Appointments)
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
    public async Task AddAppointmentToCompanyAsync(Appointment appointment)
    {
        var company = await GetByIdAsync(appointment.CompanyId);
        var appointments = await GetAllAppointmentsByAdminAsync(appointment.CompanyId, appointment.AdministratorId);
        appointment.Slot = appointment.Slot.ToUniversalTime();

        bool overlaps = CheckOverlap(appointments, appointment);
        bool isInWorkingHours = appointment.Slot.Hour >= company.Start.Hour && appointment.Slot.Hour <= company.End.Hour;
        bool appointmentExists = company.Appointments.Exists(a => a.Slot == appointment.Slot);

        if (company != null && isInWorkingHours && !appointmentExists && !overlaps)
        {
            company.Appointments ??= new List<Appointment>();
            company.Appointments.Add(appointment);
            _context.Companies.Update(company);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ReserveAppointmentAsync(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task CompleteAppointmentAsync(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
    }

    private bool CheckOverlap(List<Appointment> appointments, Appointment appointment)
    {   
        double duration = Double.Parse(appointment.Duration);
        if (appointments == null)
            return true;
        //Proverava da li je pocetak termina izmedju pocetka i kraja drugog termina
        else if (appointments.Exists(a => appointment.Slot > a.Slot && appointment.Slot < a.Slot.AddMinutes(Double.Parse(a.Duration))))
            return true;
        //Proverava da li je kraj termina izmedju pocetka i kraja drugog termina
        else if (appointments.Exists(a => appointment.Slot.AddMinutes(duration) > a.Slot && appointment.Slot.AddMinutes(duration) < a.Slot.AddMinutes(Double.Parse(a.Duration))))
            return true;
        //Proverava da li je ceo drugi termin unutar termina koji kreiramo
        else if (appointments.Exists(a => appointment.Slot < a.Slot && appointment.Slot.AddMinutes(duration) > a.Slot.AddMinutes(Int32.Parse(a.Duration))))
            return true;
        else return false;
    }

    public async Task<List<Equipment>> GetEquipmets()
    {
       return await _context.Equipments.ToListAsync();
    }
}
