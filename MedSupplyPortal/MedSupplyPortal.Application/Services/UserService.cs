using Microsoft.VisualBasic.FileIO;
using MedSupplyPortal.Application.Dtos;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Net.Sockets;
using System.ComponentModel.Design;


namespace MedSupplyPortal.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly ICompanyRepository _companyRepository;

        public UserService(IUserRepository userRepository, ITokenService tokenService,ICompanyRepository companyRepository )
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _companyRepository = companyRepository;

        }
        
        public async Task<(string Token, int UserId, int CompanyId)> AuthenticationAsync(string email, string password)
        {
            
            var user = await _userRepository.GetUserByEmailAsync(email); ;
            if (user == null || !VerifyPasswordHash(password, user.Password))
            {
                return (null,0, 0);
            }
            var companyId = 0;
            if (user.CompanyId != null)
            {
                companyId = (int)user.CompanyId;
            }
            var token = _tokenService.GenerateToken(user);
            
            return (token , user.Id, companyId);
        }
        
        public async Task<bool> RegisterUserAsync(RegisterUserDto registerUserDto)
        {
            var address = new Address
            {
                City = registerUserDto.Address?.City,
                Country = registerUserDto.Address?.Country,
                Street = registerUserDto.Address?.Street,
                Latitude = registerUserDto.Address?.Latitude,
                Longitude = registerUserDto.Address?.Longitude
            };

            var user = new User
            {
                FirstName = registerUserDto.FirstName,
                LastName = registerUserDto.LastName,
                Email = registerUserDto.Email,
                Password = registerUserDto.Password,
                Address = address,
                PhoneNumber = registerUserDto.PhoneNumber,
                Occupation = registerUserDto.Occupation,
                Type = (UserType)registerUserDto.UserType,
                PenaltyPoints = registerUserDto.PenaltyPoints,
                CompanyId = registerUserDto.CompanyId,
                IsFirstLogin = true
            };

            await _userRepository.AddAsync(user);
            if(registerUserDto.CompanyId != null)
            {
                int id = (int)registerUserDto.CompanyId;
                var company = await _companyRepository.GetByIdAsync(id);
                if(company != null)
                {
                    company.CompanyAdmins.Add(user);
                    await _companyRepository.UpdateAsync(company);
                }
            }


            return true;
        }
        private bool VerifyPasswordHash(string password, string storedPassword)
        {
            if(password == storedPassword) {  return true; }
            return false;
        }
        public async Task<RegisterUserDto> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            return new RegisterUserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Password = user.Password,
                PhoneNumber = user.PhoneNumber,
                Occupation = user.Occupation,
                UserType = (int)user.Type,
                PenaltyPoints = user.PenaltyPoints,
                Address = new AddressDto
                {
                    City = user.Address.City,
                    Country = user.Address.Country,
                    Street = user.Address.Street,
                    Latitude = user.Address.Latitude,
                    Longitude = user.Address.Longitude
                },
                CompanyId = user.CompanyId,
                IsFirstLogin = user.IsFirstLogin
            };
        }

        public async Task<IEnumerable<RegisterUserDto>> GetSystemAdmins()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var systemAdmins = users.Where(u => u.Type == UserType.SystemAdmin);
            return systemAdmins.Select(u => new RegisterUserDto
            {
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Occupation = u.Occupation,
                UserType = (int)u.Type,
                PenaltyPoints = u.PenaltyPoints,
                Address = new AddressDto
                {
                    City = u.Address.City,
                    Country = u.Address.Country,
                    Street = u.Address.Street,
                    Latitude = u.Address.Latitude,
                    Longitude = u.Address.Longitude
                },
                IsFirstLogin = u.IsFirstLogin
            });
        }
        public async Task<bool> RegisterCompanyAdminAsync(RegisterUserDto userDto, int companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            if (company == null)
            {
                return false; // Company not found
            }

            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = userDto.Password, 
                PhoneNumber = userDto.PhoneNumber,
                Occupation = userDto.Occupation,
                Type = UserType.CompanyAdmin,
                PenaltyPoints = userDto.PenaltyPoints,
                Address = new Address
                {
                    City = userDto.Address.City,
                    Country = userDto.Address.Country,
                    Street = userDto.Address.Street,
                    Latitude = userDto.Address.Latitude,
                    Longitude = userDto.Address.Longitude
                },
                CompanyId = companyId,
                IsFirstLogin = true

            };

            await _userRepository.AddAsync(user);


            company.CompanyAdmins.Add(user);
            await _companyRepository.UpdateAsync(company);

            return true;
        }
        public async Task<bool> UpdateUserAsync(int id, RegisterUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            var address = new Address
            {
                City = updateUserDto.Address.City,
                Country = updateUserDto.Address.Country,
                Street = updateUserDto.Address.Street,
                Latitude = updateUserDto.Address.Latitude,
                Longitude = updateUserDto.Address.Longitude
            };

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.PhoneNumber = updateUserDto.PhoneNumber;
            user.Email = updateUserDto.Email;
            user.Address = address;
            user.Password = updateUserDto.Password;
            user.CompanyId = updateUserDto.CompanyId == 0 ? (int?)null : updateUserDto.CompanyId;
            user.Occupation = updateUserDto.Occupation;
            user.Type = (UserType)updateUserDto.UserType;
            user.PenaltyPoints = updateUserDto.PenaltyPoints;
            user.IsFirstLogin = updateUserDto.IsFirstLogin;

            await _userRepository.UpdateAsync(user);
            return true;
        }
        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            if (!_userRepository.CheckPassword(userId, currentPassword))
            {
                throw new ArgumentException("Current password is incorrect");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            user.Password = newPassword;
            if(user.IsFirstLogin == true)
            {
                user.IsFirstLogin = false;
            }
            await _userRepository.UpdateAsync(user);
            return true;
            
        }
    }
}
