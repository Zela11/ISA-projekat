using Microsoft.EntityFrameworkCore;
using MedSupplyPortal.Domain.Entities;
using MedSupplyPortal.Domain.IRepositories;
using MedSupplyPortal.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{

    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(User user)
    {
        if(user != null) { await _context.Users.AddAsync(user); }
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> GetByIdAsync(int id)
    {
        return await _context.Users
                        .Include(u => u.Address)
                        .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}
