﻿using System.Net;
using System.Net.Mail;
using MedSupplyPortal.Application.IServices;
using MedSupplyPortal.Domain;
using Microsoft.Extensions.Options;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _emailSettings;

    public EmailService(IOptions<SmtpSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string recipientEmail, string subject, string body, byte[] attachment = null)
    {
        using (var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort))
        {
            client.Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(recipientEmail);
            
            if (attachment != null)
            {
                var attachmentStream = new MemoryStream(attachment);
                var qrAttachment = new Attachment(attachmentStream, "QRCode.png", "image/png");

                mailMessage.Attachments.Add(qrAttachment);
            }

            await client.SendMailAsync(mailMessage);
        }
    }
}
