using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Dtos
{
    public class AppointmentDto
    {
        public int CompanyId { get; set; }
        public int AdministratorId { get; set; }
        public int Duration { get; set; }
        public DateTime Slot { get; set; }
    }
}
