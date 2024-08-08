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
        
        public async Task<(string Token, int UserId)> AuthenticationAsync(string email, string password)
        {
            
            var user = await _userRepository.GetUserByEmailAsync(email); ;
            if (user == null || !VerifyPasswordHash(password, user.Password))
            {
                return (null,0);
            }

            var token = _tokenService.GenerateToken(user);
            return (token , user.Id);
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

            // Kreirajte User entitet i postavite adresu
            var user = new User
            {
                FirstName = registerUserDto.FirstName,
                LastName = registerUserDto.LastName,
                Email = registerUserDto.Email,
                Password = registerUserDto.Password,
                Address = address, // Postavite Address entitet
                PhoneNumber = registerUserDto.PhoneNumber,
                Occupation = registerUserDto.Occupation,
                Type = (UserType)registerUserDto.UserType, // Pretpostavljam da ste dodali UserType u DTO
                PenaltyPoints = registerUserDto.PenaltyPoints,
                CompanyId = registerUserDto.CompanyId
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
                }
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
                }
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
                Password = userDto.Password, // Hash password before saving
                PhoneNumber = userDto.PhoneNumber,
                Occupation = userDto.Occupation,
                Type = UserType.CompanyAdmin, // Assuming UserType.Admin is appropriate for company admins
                PenaltyPoints = userDto.PenaltyPoints,
                Address = new Address
                {
                    City = userDto.Address.City,
                    Country = userDto.Address.Country,
                    Street = userDto.Address.Street,
                    Latitude = userDto.Address.Latitude,
                    Longitude = userDto.Address.Longitude
                },
                CompanyId = companyId
            };

            await _userRepository.AddAsync(user);


            company.CompanyAdmins.Add(user);
            // Save the updated company
            await _companyRepository.UpdateAsync(company);

            return true;
        }


    }
    
}
