﻿using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Application.Services;
using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using Microsoft.AspNetCore.Mvc;

namespace MedSupplyPortal.Api.Controllers;

[ApiController]
[Route("api/companies")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;

    public CompanyController(ICompanyService companyService, IEmailService emailService, IUserService userService)
    {
        _companyService = companyService;
        _emailService = emailService;
        _userService = userService;
    }
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CompanyDto companyDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _companyService.CreateCompanyAsync(companyDto);
        if (!result)
        {
            return BadRequest("Registration failed.");
        }

        return Ok(new { message = "Company created successfully." });
    }
    [HttpGet]
    public async Task<ActionResult<List<Company>>> GetAll()
    {
        var companies = await _companyService.GetAllAsync();
        return Ok(companies);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> GetById(int id)
    {
        var company = await _companyService.GetByIdAsync(id);
        if (company == null)
        {
            return NotFound();
        }
        return Ok(company);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompany(int id, [FromBody] CompanyDto companyDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _companyService.UpdateCompanyAsync(id, companyDto);
        if (!result)
        {
            return NotFound("Company not found.");
        }

        return Ok(new { message = "Company updated successfully." });
    }
    [HttpPost("{companyId}/equipment")]
    public async Task<IActionResult> AddEquipment(int companyId, [FromBody] EquipmentDto equipmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _companyService.AddEquipmentToCompanyAsync(companyId, equipmentDto);
        return Ok(new { message = "Equipment created successfully." });
    }
    [HttpPut("{companyId}/equipment/{equipmentId}")]
    public async Task<IActionResult> UpdateEquipment(int companyId, int equipmentId, [FromBody] EquipmentDto equipmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _companyService.UpdateEquipmentAsync(companyId, equipmentId, equipmentDto);
        return Ok(new { message = "Equipment updated successfully." });
    }

    [HttpDelete("{companyId}/equipment/{equipmentId}")]
    public async Task<IActionResult> DeleteEquipment(int companyId, int equipmentId)
    {
        await _companyService.DeleteEquipmentAsync(companyId, equipmentId);
        return Ok(new { message = "Equipment deleted successfully." });
    }
    [HttpPut("{companyId}/equipmentAmount/{equipmentId}")]
    public async Task<IActionResult> UpdateEquipmentAmount(int companyId, int equipmentId, [FromBody] EquipmentDto equipmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _companyService.UpdateEquipmentAmountAsync(companyId, equipmentId, equipmentDto);
        return Ok(new { message = "Equipment updated successfully." });
    }
    [HttpPost("{companyId}/appointment")]
    public async Task<IActionResult> AddAppointment(int companyId, [FromBody] AppointmentDto appointmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _companyService.AddAppointmentToCompanyAsync(companyId, appointmentDto);
        return Ok();
    }
    [HttpPut("{companyId}/appointment")]
    public async Task<IActionResult> ReserveAppointment(int companyId, [FromBody] AppointmentDto appointmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _companyService.ReserveAppointmentAsync(companyId, appointmentDto);
        return Ok(new { message = "Appointment updated successfully." });
    }
    [HttpPut("{companyId}/completeAppointment")]
    public async Task<IActionResult> CompleteAppointment(int companyId, [FromBody] AppointmentDto appointmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.GetByIdAsync((int)appointmentDto.UserId);

        await _companyService.CompleteAppointmentAsync(companyId, appointmentDto);
        await _emailService.SendEmailAsync(user.Email, "Appointment Completed", "Your appointment has been completed.");
        return Ok(new { message = "Appointment updated successfully." });
    }
}
