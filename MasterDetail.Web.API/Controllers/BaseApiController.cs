using Microsoft.AspNetCore.Mvc;
using MasterDetail.BusinessLogic;
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.Common;

namespace MasterDetail.Web.API.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        internal IDomainServiceContext DomainContext;

        public BaseApiController(IDomainServiceContext domainContext)
        {
            DomainContext = domainContext;
        }
       
        protected string GetUserIpAddress()
        {
            return Request?.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;
        }
        protected int GetLoggedAgencyId()
        {
            var agencyId = User?.Identity?.GetAgencyId();
            return agencyId ?? 0;
        }
        protected int GetLoggedUserId()
        {
            var userId = User?.Identity?.GetUserId();
            return userId ?? 0;
        }
    }
}
