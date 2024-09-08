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
        Task<(string Token, int UserId, int CompanyId)> AuthenticationAsync(string email, string password);
        Task<RegisterUserDto> GetByIdAsync(int id); 
        Task<IEnumerable<RegisterUserDto>> GetSystemAdmins();
        Task<bool> RegisterCompanyAdminAsync(RegisterUserDto userDto, int companyId);
        Task<bool> UpdateUserAsync(int id, RegisterUserDto updateUserDto);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> ResetAllUsersCategoryNamesAsync();
        Task<bool> UpdateAllUsersCategoryNamesAsync();
        Task<IEnumerable<RegisterUserDto>> GetUsersWithEquipmentReservationForCompany(int companyId);
    }
}
