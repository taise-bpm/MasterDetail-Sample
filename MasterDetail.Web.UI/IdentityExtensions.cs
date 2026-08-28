
using MasterDetail.Common;
using System.Security.Claims;
using System.Security.Principal;

namespace MasterDetail.Web.UI 
{
    public static class IdentityExtensions
    {
        public static int GetCompanyId(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(CustomClaimTypes.CompanyId);

            if (claim == null)
                return 0;

            return int.Parse(claim.Value);
        }

        public static string GetName(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.Name);

            return claim?.Value ?? string.Empty;
        }

        public static string GetEmail(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.Email);

            return claim?.Value ?? string.Empty;
        }

        public static string GetUserGuid(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.NameIdentifier);

            return claim?.Value ?? string.Empty;
        }

        public static int GetUserId(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.UserData);

            if (claim == null)
                return 0;

            return int.Parse(claim.Value);
        }
    }
}

  