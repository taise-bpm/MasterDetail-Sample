
using Serilog;
using System;
using System.Collections.Generic;

namespace MasterDetail.BusinessLogic.DomainServices
{
    public abstract class BaseDomainService
    {
        protected IDomainServiceContext DomainService { get; set; }
        protected IRepositoryContext Repository { get; set; }

        public BaseDomainService(IDomainServiceContext domainService, IRepositoryContext repository)
        {
            DomainService = domainService;
            Repository = repository;
        }

        protected bool HandleException(Exception ex)
        {
            Log.Error("Exception", ex);
            ApiResponse apiResponse = new ApiResponse();
            var apiErrorList = new List<ApiError>();

            apiResponse.HasErrors = true;

            var apiError = new ApiError();
            apiError.ErrorType = (int)ErrorType.Error;
            apiError.ErrorText = ex.Message + ex.InnerException;
            apiError.ErrorDetails = ex.StackTrace;

            apiErrorList.Add(apiError);

            apiResponse.Content = null;
            return false;
        }
    }
}

  