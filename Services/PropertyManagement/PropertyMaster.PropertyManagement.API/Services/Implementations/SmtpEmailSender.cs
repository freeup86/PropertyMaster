using Microsoft.Extensions.Configuration; // Required for IConfiguration
using Microsoft.Extensions.Logging;     // Required for ILogger
using PropertyMaster.PropertyManagement.API.Services.Interfaces; // Required for IEmailSender
using System;
using System.Net;               // Required for NetworkCredential
using System.Net.Mail;          // Required for SmtpClient, MailMessage
using System.Threading.Tasks;

namespace PropertyMaster.PropertyManagement.API.Services.Implementations
{
    /// <summary>
    /// Sends emails using System.Net.Mail.SmtpClient.
    /// Requires SMTP settings (Host, Port, Credentials, SSL) configured securely.
    /// </summary>
    public class SmtpEmailSender : IEmailSender
    {
        private readonly ILogger<SmtpEmailSender> _logger;
        private readonly string _host;
        private readonly int _port;
        private readonly bool _enableSsl;
        private readonly string _userName;
        private readonly string _password;
        private readonly string _fromAddress;

        // Inject IConfiguration to access settings securely
        public SmtpEmailSender(IConfiguration configuration, ILogger<SmtpEmailSender> logger)
        {
            _logger = logger;

            // --- Retrieve your SMTP settings securely from configuration ---
            // Use User Secrets (`dotnet user-secrets set "Smtp:Host" "..."`) or Environment Variables
            _host = configuration["Smtp:Host"];
            _port = configuration.GetValue<int>("Smtp:Port", 587); // Default to 587 if not specified
            _enableSsl = configuration.GetValue<bool>("Smtp:EnableSsl", true); // Default to true
            _userName = configuration["Smtp:Username"]; // MUST be stored securely
            _password = configuration["Smtp:Password"]; // MUST be stored securely
            _fromAddress = configuration["Smtp:FromAddress"]; // The 'From' email address

            // Basic validation
            if (string.IsNullOrEmpty(_host) || string.IsNullOrEmpty(_userName) || string.IsNullOrEmpty(_password) || string.IsNullOrEmpty(_fromAddress))
            {
                _logger.LogError("SMTP configuration (Host, Username, Password, FromAddress) is missing or invalid. Check secure configuration (User Secrets/Environment Variables).");
                throw new InvalidOperationException("SMTP configuration is missing or invalid.");
            }
        }

        /// <summary>
        /// Sends an email using SmtpClient.
        /// </summary>
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            _logger.LogInformation("Attempting to send email via SMTP to {Email} with subject {Subject}", email, subject);

            try
            {
                using (var client = new SmtpClient(_host, _port))
                {
                    client.EnableSsl = _enableSsl;
                    // Provide credentials only if username/password are set
                    if (!string.IsNullOrEmpty(_userName) && !string.IsNullOrEmpty(_password))
                    {
                         client.Credentials = new NetworkCredential(_userName, _password);
                    }
                    // Some servers might require different delivery methods
                    // client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_fromAddress), // Use configured 'From' address
                        Subject = subject,
                        Body = htmlMessage,
                        IsBodyHtml = true, // Ensure body is treated as HTML
                    };
                    mailMessage.To.Add(email); // Add recipient

                    // Use SendMailAsync for non-blocking operation
                    await client.SendMailAsync(mailMessage);

                    _logger.LogInformation("Email successfully sent via SMTP to {Email}", email);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while sending email via SMTP to {Email}", email);
                // Rethrow or handle as appropriate. SmtpException can provide more details.
                throw;
            }
        }
    }
}