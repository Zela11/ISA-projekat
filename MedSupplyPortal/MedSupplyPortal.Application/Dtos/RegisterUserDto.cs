using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Dtos;

public class RegisterUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public string Occupation { get; set; }
    public int UserType { get; set; }
    public int PenaltyPoints { get; set; }
    public AddressDto Address { get; set; }
    public int? CompanyId { get; set; }

}
