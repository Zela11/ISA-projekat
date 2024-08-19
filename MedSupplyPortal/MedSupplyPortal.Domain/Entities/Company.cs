using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Address Address { get; set; }
        public double AverageRating { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }
        public List<Appointment>? Appointments { get; set; }
        public List<Equipment>? EquipmentList { get; set; }
        public List<User> CompanyAdmins { get; set; }
    }
}
