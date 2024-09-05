using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Domain.Entities
{
    public class CategoryScale
    {
        public string Name { get; set; }
        public int MinimumPoints { get; set; }
        public int PenaltyThreshold { get; set; }
        public int Discount {  get; set; }
    }
}
