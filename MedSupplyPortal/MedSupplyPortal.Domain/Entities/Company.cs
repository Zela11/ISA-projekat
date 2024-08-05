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
        // da li imati objekat klase Location ili sve ovo u companiju
        public string City { get; set; }
        public string Country { get; set; }
        public string AverageRating { get; set; }
        public List<Appointment> Appointments {  get; set; }
        public List<User> Administrators { get; set; }
        public List<Equipment> equipments { get; set; }
    }
}
