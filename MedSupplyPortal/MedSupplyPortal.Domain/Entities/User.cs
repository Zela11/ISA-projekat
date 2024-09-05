using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public Address Address { get; set; }
    public string PhoneNumber { get; set; }
    public string Occupation { get; set; }
    public UserType Type { get; set; }
    public int PenaltyPoints { get; set; }
    public int? CompanyId {  get; set; }
    public bool IsFirstLogin { get; set; }
    public int Points {  get; set; }
    public string? CategoryName { get; set; }
}
