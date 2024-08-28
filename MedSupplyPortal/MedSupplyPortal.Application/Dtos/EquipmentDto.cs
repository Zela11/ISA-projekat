using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.Dtos
{
    public class EquipmentDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsAvailable { get; set; }
        public int Amount { get; set; }
        public int ReservedAmount { get; set; }
        public int Type { get; set; }
    }
}
