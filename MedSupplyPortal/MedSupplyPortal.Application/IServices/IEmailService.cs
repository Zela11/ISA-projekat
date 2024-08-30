using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedSupplyPortal.Application.IServices
{
    public interface IEmailService
    {
        public Task SendEmailAsync(string recipientEmail, string subject, string body, byte[] attachment = null);
    }
}
