using MasterDetail.BusinessLogic.DomainServices;
using System;

namespace MasterDetail.BusinessLogic.DomainServices
{
    public class DomainServiceContext : IDomainServiceContext
    {
        #region Private Readonly
        private readonly Lazy<IMasterDomainService> _masterDomainService;
        private readonly Lazy<IDetailDomainService> _detailDomainService;
        private readonly Lazy<IChildDomainService> _childDomainService;
        #endregion

        public IMasterDomainService MasterDomainService => _masterDomainService.Value;
        public IDetailDomainService DetailDomainService => _detailDomainService.Value;
        public IChildDomainService ChildDomainService => _childDomainService.Value;

        public DomainServiceContext(
            Func<IMasterDomainService> masterServiceFactory,
            Func<IDetailDomainService> detailServiceFactory,
            Func<IChildDomainService> childServiceFactory
        )
        {
            _masterDomainService = new Lazy<IMasterDomainService>(masterServiceFactory);
            _detailDomainService = new Lazy<IDetailDomainService>(detailServiceFactory);
            _childDomainService = new Lazy<IChildDomainService>(childServiceFactory);
        }
    }

    public interface IDomainServiceContext
    {
        IMasterDomainService MasterDomainService { get; }
        IDetailDomainService DetailDomainService { get; }
        IChildDomainService ChildDomainService { get; }
    }
}