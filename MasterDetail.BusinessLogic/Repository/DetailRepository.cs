
using System.Collections.Generic;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.Models;

namespace MasterDetail.BusinessLogic.Repository
{
    public class DetailRepository: BaseRepository<DetailRecord>, IDetailRepository
    {
        public DetailRepository(IConnectionStringFactory connectionStringFactory) : base(connectionStringFactory)
    {
    Schema = "[dbo]";
    GetAllProc = "[Detail_GetAll]";

            InsertProc = "[Detail_BulkInsert]";
            UpdateProc = "[Detail_BulkUpdate]";
            DeleteProc = "[Detail_BulkDelete]";

            DymamicProc = "[Detail_DynamicSQL]";

            PageSortFilterProc = "[Detail_GetByPageSortFilter]";
        }
          
        public Task<DetailRecord> GetByIdAsync(int companyId, int detailId, bool bubbleException = false)
        {
            var filterByList = new List<FilterBySetting>()
              {
                  new FilterBySetting()
                  {
                      FilterByClause = "DetailId = " + detailId.ToString(),
                      FilterByOrd = 1
                  }
              };
            return GetByUniqueKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
        }

        
          public Task<IEnumerable<DetailRecord>> GetAllByMasterIdAsync(int masterId, int companyId, bool bubbleException = false)
          {
              var filterByList = new List<FilterBySetting>()
                {
                    new FilterBySetting()
                    {
                        FilterByClause = "MasterId = " + masterId.ToString(),
                        FilterByOrd = 1
                    }
                };
              return GetByForeignKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
          }
        
	  
    }

    public interface IDetailRepository
    {
        Task<IEnumerable<DetailRecord>> GetAllAsync(int companyId, bool bubbleException = false);
        Task<DetailRecord> CreateAsync(int companyId, DetailRecord entity, bool bubbleException = false);
        Task<int> DeleteAsync(int companyId, DetailRecord entity, bool bubbleException = false);
        Task<int> UpdateAsync(int companyId, DetailRecord entity, bool bubbleException = false);
        Task<IEnumerable<DetailRecord>> BulkInsertAsync(int companyId, List<DetailRecord> entityList, bool bubbleException = false);
        Task<int> BulkUpdateAsync(int companyId, List<DetailRecord> entityList, bool bubbleException = false);
        Task<int> BulkDeleteAsync(int companyId, List<DetailRecord> entityList, bool bubbleException = false);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(int companyId, PageSortFilterModel model, bool bubbleException = false);
        
		Task<DetailRecord> GetByIdAsync(int companyId, int detailId, bool bubbleException = false);

        
        Task<IEnumerable<DetailRecord>> GetAllByMasterIdAsync(int masterId, int companyId, bool bubbleException = false);
        
	   
    }
}
    