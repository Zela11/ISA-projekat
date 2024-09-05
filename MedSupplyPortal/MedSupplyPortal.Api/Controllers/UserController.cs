namespace MedSupplyPortal.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.RegisterUserAsync(registerUserDto);
        if (!result)
        {
            return BadRequest("Registration failed.");
        }
        
        return Ok(new { message = "User registered successfully." });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
    {
        var (token ,userId, companyId) = await _userService.AuthenticationAsync(loginDto.Email, loginDto.Password);
        if (token == null)
        {
            return Unauthorized();
        }

        return Ok(new { Token = token, UserId = userId, CompanyId = companyId });
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<RegisterUserDto>> GetUserById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(user);
    }
    [Authorize(Roles = "SystemAdmin")]
    [HttpGet("getSystemAdmins")]
    public async Task<ActionResult<IEnumerable<RegisterUserDto>>> GetSystemAdmins()
    {
        try
        {
            var admins = await _userService.GetSystemAdmins();
            return Ok(admins);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");

        }
    }
    [HttpPost("createCompanyAdmin/{companyId}")]
    public async Task<IActionResult> RegisterCompanyAdmin([FromBody] RegisterUserDto userDto, [FromRoute] int companyId)
    {
        if (userDto == null)
        {
            return BadRequest("Invalid data.");
        }

        var result = await _userService.RegisterCompanyAdminAsync(userDto, companyId);
        if (result)
        {
            return Ok("Company admin registered successfully.");
        }
        return NotFound("Company not found.");
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] RegisterUserDto updateUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.UpdateUserAsync(id, updateUserDto);
        if (!result)
        {
            return NotFound("User not found.");
        }

        return Ok(new { message = "User updated successfully." });
    }
    [HttpPut("{userId}/change-password")]
    public async Task<IActionResult> ChangePassword(int userId, [FromBody] ChangePasswordDto changePasswordDto)
    {
        
        
        var result = await _userService.ChangePasswordAsync(userId, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
        return Ok(new { message = "Password updated successfully" });
    }
    [HttpPut("deleteAllCategoryNames")]
    public async Task<IActionResult> ResetAllUsersCategoryNames()
    {
        try
        {
            var result = await _userService.ResetAllUsersCategoryNamesAsync();
            if (!result)
            {
                return NotFound("No users found to update.");
            }

            return Ok(new { message = "All user category names reset to null successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
    [HttpPut("updateUserCategories")]
    public async Task<IActionResult> UpdateAllUsersCategoryNames()
    {
        try
        {
            var result = await _userService.UpdateAllUsersCategoryNamesAsync();
            if (!result)
            {
                return NotFound("No users found to update.");
            }

            return Ok(new { message = "All user category names reset to null successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}
