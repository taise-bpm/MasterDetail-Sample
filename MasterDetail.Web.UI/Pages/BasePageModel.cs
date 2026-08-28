
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MasterDetail.Web.UI.Pages
{
    public class BasePageModel : PageModel
    {
        protected string UserGuid { get; set; } = Guid.Empty.ToString();
        protected int UserId { get; set; } = 0;

        protected readonly ILogger<BasePageModel> Logger;
        protected IDomainServiceContext DomainService { get; }
        public BasePageModel(IDomainServiceContext domainServiceContext, ILogger<BasePageModel> logger)
        {
            DomainService = domainServiceContext;
            Logger = logger;
        }

        public int GetLoggedUserId()
        {
            if (UserId > 0)
            {
                return UserId;
            }
            else
            {
                UserId = User.Identity.GetUserId();
                return UserId;
            }
        }

        public string GetUserIpAddress()
        {
            return Request.HttpContext.Connection.RemoteIpAddress.ToString();
        }

        public string GetLoggedUserGuid()
        {
            var userGuid = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userGuid))
            {
                userGuid = Guid.Empty.ToString();
            }
            return userGuid;
        }

        public string GetLoggedUserName()
        {
            var userName = User?.FindFirst(ClaimTypes.Name)?.Value;
            return userName;
        }

        public string GetLoggedUserEmail()
        {
            var email = User?.FindFirst(ClaimTypes.Email)?.Value;
            return email;
        }

        public void HandleException(Exception ex, bool ignoreException = false)
        {
            if (!ignoreException)
            {
                Logger.LogError("{Exception}", ex);
            }
        }
        public int GetLoggedCompanyId()
        {
            var companyId = User.Identity.GetCompanyId();
            return companyId;
        }
        public string GetUserName(UserRecord user)
        {
            return (user.FirstName + " " + user.LastName);
        }
        protected async Task<bool> SetLoginInfo(string email)
        {
            var user = await DomainService.AccountDomainService.GetUserByEmailAddress(email);

            if (!(user.UserGuid == Guid.Empty))
            {
                var identity = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.UserData, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, GetFullName(user)),
                new Claim(ClaimTypes.Email, user.EmailAddress),
                new Claim(ClaimTypes.NameIdentifier, user.UserGuid.ToString()),
                new Claim("CompanyId", "1")},
                 Constants.ApplicationScheme);

                await HttpContext.SignInAsync(Constants.ApplicationScheme, new ClaimsPrincipal(identity));

                return true;
            }
            else
            {
                return false;
            }
        }

        protected string GetFullName(UserRecord user)
        {
            var firstName = string.IsNullOrEmpty(user.FirstName) ? "FNU" : user.FirstName;
            var lastName = string.IsNullOrEmpty(user.LastName) ? "LNU" : user.LastName;

            return firstName + " " + lastName;
        }
    }
}

  