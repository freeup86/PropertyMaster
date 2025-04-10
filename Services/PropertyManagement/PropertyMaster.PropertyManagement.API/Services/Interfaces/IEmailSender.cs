using System.Threading.Tasks;

namespace PropertyMaster.PropertyManagement.API.Services.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}