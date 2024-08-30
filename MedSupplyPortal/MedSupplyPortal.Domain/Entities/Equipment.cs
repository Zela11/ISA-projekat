using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsAvailable { get; set; }
        public int CompanyId { get; set; }
        public int Amount {  get; set; }
        public int ReservedAmount { get; set; }
        public EquipmentType Type { get; set; }
    }
}
