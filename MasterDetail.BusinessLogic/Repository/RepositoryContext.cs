
namespace MasterDetail.BusinessLogic.Repository
{
    public class RepositoryContext: IRepositoryContext
    {
        
        public IMasterRepository MasterRepository { get; set; }
        
        public IDetailRepository DetailRepository { get; set; }
        
        public IChildRepository ChildRepository { get; set; }
        
        

        public RepositoryContext(IConnectionStringFactory connectionStringFactory)
        {
            MasterRepository = new MasterRepository(connectionStringFactory);
            DetailRepository = new DetailRepository(connectionStringFactory);
            ChildRepository = new ChildRepository(connectionStringFactory);
            
        }
    }
}
    