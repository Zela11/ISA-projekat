using MedSupplyPortal.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.IServices
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<(string Token, int UserId)> AuthenticationAsync(string email, string password);
        Task<RegisterUserDto> GetByIdAsync(int id); 
        Task<IEnumerable<RegisterUserDto>> GetSystemAdmins();
        Task<bool> RegisterCompanyAdminAsync(RegisterUserDto userDto, int companyId);

    }
}
