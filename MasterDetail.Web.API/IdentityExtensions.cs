using MasterDetail.Common;
using System.Security.Claims;
using System.Security.Principal;

namespace MasterDetail.Web.API
{
    public static class IdentityExtensions
    {
        public static int GetAgencyId(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(CustomClaimTypes.CompanyId);

            if (claim == null)
                return 0;

            return int.Parse(claim.Value);
        }
        public static int GetUserId(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(CustomClaimTypes.UserId);

            if (claim == null)
                return 0;

            return int.Parse(claim.Value);
        }
    }
}
