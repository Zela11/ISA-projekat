using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities
{
    public class LoyaltyProgram
    {
        public int PointsPerPickup { get; set; }
        public List<CategoryScale> CategoryScales { get; set; }
    }
}
