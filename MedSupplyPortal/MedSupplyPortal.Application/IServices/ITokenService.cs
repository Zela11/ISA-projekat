﻿using MedSupplyPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.IServices
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
