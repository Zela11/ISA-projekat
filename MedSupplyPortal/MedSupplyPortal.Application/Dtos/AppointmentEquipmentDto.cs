using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Dtos
{
    public class AppointmentEquipmentDto
    {
        public AppointmentDto appointmentDto { get; set; }
        public EquipmentDto equipmentDto { get; set; }

    }
}
