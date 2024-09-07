using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities
{
    public class Appointment
    {
        public int CompanyId { get; set; }
        public int AdministratorId { get; set; }
        public int? UserId { get; set; }
        public string Duration {  get; set; } 
        public DateTime Slot { get; set; }
        public AppointmentStatus Status { get; set; }
        public int? EquipmentId { get; set; }
        public int? EquipmentAmount {  get; set; }
        public string? UniqueReservationId { get; set; }
        public double? TotalPrice { get; set; }
    }
}