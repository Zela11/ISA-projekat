﻿using Microsoft.VisualBasic.FileIO;
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

        public UserService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;

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
            var user = new User
            {
                FirstName = registerUserDto.FirstName,
                LastName = registerUserDto.LastName,
                Email = registerUserDto.Email,
                Password = registerUserDto.Password,
                City = registerUserDto.City,
                Country = registerUserDto.Country,
                PhoneNumber = registerUserDto.PhoneNumber,
                Occupation = registerUserDto.Occupation,
                CompanyInfo = registerUserDto.CompanyInfo,
                Type = UserType.RegisteredUser,
                PenaltyPoints = registerUserDto.PenaltyPoints,
            };
            await _userRepository.AddAsync(user);
            return true;
        }
        private bool VerifyPasswordHash(string password, string storedPassword)
        {
            if(password == storedPassword) {  return true; }
            return false;
        }
    }
}
