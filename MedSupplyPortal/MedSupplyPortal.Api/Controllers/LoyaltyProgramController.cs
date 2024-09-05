using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Application.Services;
using MedSupplyPortal.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MedSupplyPortal.Api.Controllers;

[ApiController]
[Route("api/loyaltyProgram")]
public class LoyaltyProgramController : ControllerBase
{
    private readonly ILoyaltyProgramService _loyaltyProgramService;

    public LoyaltyProgramController(ILoyaltyProgramService loyaltyProgramService)
    {
        _loyaltyProgramService = loyaltyProgramService;
    }
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] LoyaltyProgramDto loyaltyProgramDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _loyaltyProgramService.CreateLoyaltyProgramAsync(loyaltyProgramDto);
        if (!result)
        {
            return BadRequest("Creating loyalty program failed.");
        }

        return Ok(new { message = "Loyalty program created successfully." });
    }

    [HttpGet]
    public async Task<ActionResult<List<LoyaltyProgram>>> Get()
    {
        var companies = await _loyaltyProgramService.GetAsync();
        return Ok(companies);
    }

    [HttpPost("addCategoryScale")]
    public async Task<IActionResult> AddCategoryScale([FromBody] CategoryScaleDto categoryScaleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _loyaltyProgramService.AddCategoryScaleToLoyaltyProgramAsync(categoryScaleDto);
        return Ok(new { message = "Category created successfully." });
    }
    [HttpDelete("deleteLoyaltyProgram")]
    public async Task<IActionResult> DeleteEquipment()
    {
        await _loyaltyProgramService.DeleteLoyaltyProgramAsync();
        return Ok(new { message = "Loyalty program deleted successfully." });
    }
    [HttpDelete("categoryScale/{categoryName}")]
    public async Task<IActionResult> DeleteEquipment([FromRoute] string categoryName)
    {
        await _loyaltyProgramService.DeleteCategoryScaleAsync(categoryName);
        return Ok(new { message = "Equipment deleted successfully." });
    }
    [HttpPut("updateCategoryScale")]
    public async Task<IActionResult> UpdateEquipmentAmount([FromBody] CategoryScaleDto categoryScaleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _loyaltyProgramService.UpdateCategoryScaleAsync(categoryScaleDto);
        return Ok(new { message = "Category scale updated successfully." });
    }
}
