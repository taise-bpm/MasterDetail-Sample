
using MasterDetail.BusinessLogic.Repository;

namespace MasterDetail.BusinessLogic
{
    public interface IRepositoryContext
    {
        
          IMasterRepository MasterRepository { get; set; }
        
          IDetailRepository DetailRepository { get; set; }
        
          IChildRepository ChildRepository { get; set; }
        
    }
}
    