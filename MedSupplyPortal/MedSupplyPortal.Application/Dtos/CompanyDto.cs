using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Dtos;

public class CompanyDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public AddressDto Address { get; set; }
    public double AverageRating { get; set; }
    public string Start {  get; set; }
    public string End { get; set; }

}
