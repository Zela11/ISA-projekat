using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Application.Services;
using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

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

        var user = await _userService.GetByIdAsync((int)appointmentDto.UserId);
        var company = await _companyService.GetByIdAsync(companyId);
        var equipment = company.EquipmentList.Find(e => e.Id == appointmentDto.EquipmentId);
        var qrCodeImage = GenerateQrCode(company.Name, equipment.Name, appointmentDto);

        await _companyService.ReserveAppointmentAsync(companyId, appointmentDto);
        await _emailService.SendEmailAsync(user.Email, "Reservation Confirmation", "Your reservation has been confirmed!", qrCodeImage);
        return Ok(new { message = "Appointment updated successfully." });
    }
    [HttpPut("{companyId}/completeAppointment")]
    public async Task<IActionResult> CompleteAppointment(int companyId, [FromBody] AppointmentDto appointmentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.GetByIdAsync((int)appointmentDto.UserId);
        await _companyService.CompleteAppointmentAsync(companyId, appointmentDto);

        if(appointmentDto.Status == AppointmentStatus.Completed)
            await _emailService.SendEmailAsync(user.Email, "Appointment Completed", "Your appointment has been completed.");
        return Ok(new { message = "Appointment updated successfully." });
    }
    [HttpGet("equipments")]
    public async Task<ActionResult<List<Equipment>>> GetEquipments()
    {
        var equipments = await _companyService.GetEquipments();
        if (equipments == null || !equipments.Any())
        {
            return NotFound("No equipment found for this company.");
        }
        return Ok(equipments);
    }
    private byte[] GenerateQrCode(string companyName, string equipmentName, AppointmentDto appointmentDto)
    {
;        var qrData = $"Unique Reservation ID: {appointmentDto.UniqueReservationId}\n" +
            $"Company ID: {appointmentDto.CompanyId}\n" +
            $"Company: {companyName}\n" +
            $"Admin Id: {appointmentDto.AdministratorId}\n" +
            $"Slot: {appointmentDto.Slot}\n" +
            $"Duration: {appointmentDto.Duration}\n" +
            $"Equipment: {equipmentName}\n" +
            $"Amount: {appointmentDto.EquipmentAmount}";

        using (var qrGenerator = new QRCodeGenerator())
        {
            var qrCodeData = qrGenerator.CreateQrCode(qrData, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new QRCode(qrCodeData);

            using (var qrCodeImage = qrCode.GetGraphic(20))
            using (var stream = new MemoryStream())
            {
                qrCodeImage.Save(stream, ImageFormat.Png);
                return stream.ToArray(); 
            }
        }
    }
}
