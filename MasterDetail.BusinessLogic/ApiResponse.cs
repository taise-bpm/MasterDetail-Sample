
using System.Collections.Generic;

namespace MasterDetail.BusinessLogic
{
    public class ApiResponse: IApiResponse
    {
        public bool HasErrors { get; set; }
        public dynamic Content { get; set; }
        public IEnumerable<ApiError> ApiErrors { get; set; }

        public ApiResponse()
        {
            HasErrors = false;
            ApiErrors = new List<ApiError>();
        }
    }

    public interface IApiResponse
    {
        bool HasErrors { get; set; }
        dynamic Content { get; set; }
        IEnumerable<ApiError> ApiErrors { get; set; }
    }
}
  