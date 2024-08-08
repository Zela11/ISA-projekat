using MedSupplyPortal.Application.Dtos;
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

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
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
}
