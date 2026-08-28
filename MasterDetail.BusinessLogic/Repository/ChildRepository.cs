
using System.Collections.Generic;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.Models;

namespace MasterDetail.BusinessLogic.Repository
{
    public class ChildRepository : BaseRepository<ChildRecord>, IChildRepository
    {
        public ChildRepository(IConnectionStringFactory connectionStringFactory) : base(connectionStringFactory)
        {
            Schema = "[dbo]";
            GetAllProc = "[Child_GetAll]";

            InsertProc = "[Child_BulkInsert]";
            UpdateProc = "[Child_BulkUpdate]";
            DeleteProc = "[Child_BulkDelete]";

            DymamicProc = "[Child_DynamicSQL]";

            PageSortFilterProc = "[Child_GetByPageSortFilter]";
        }

        public Task<ChildRecord> GetByIdAsync(int companyId, int childId, bool bubbleException = false)
        {
            var filterByList = new List<FilterBySetting>()
              {
                  new FilterBySetting()
                  {
                      FilterByClause = "ChildId = " + childId.ToString(),
                      FilterByOrd = 1
                  }
              };
            return GetByUniqueKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
        }


        public Task<IEnumerable<ChildRecord>> GetAllByMasterIdAsync(int masterId, int companyId, bool bubbleException = false)
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

        public Task<IEnumerable<ChildRecord>> GetAllByDetailIdAsync(int detailId, int companyId, bool bubbleException = false)
        {
            var filterByList = new List<FilterBySetting>()
                {
                    new FilterBySetting()
                    {
                        FilterByClause = "DetailId = " + detailId.ToString(),
                        FilterByOrd = 1
                    }
                };
            return GetByForeignKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
        }


    }

    public interface IChildRepository
    {
        Task<IEnumerable<ChildRecord>> GetAllAsync(int companyId, bool bubbleException = false);
        Task<ChildRecord> CreateAsync(int companyId, ChildRecord entity, bool bubbleException = false);
        Task<int> DeleteAsync(int companyId, ChildRecord entity, bool bubbleException = false);
        Task<int> UpdateAsync(int companyId, ChildRecord entity, bool bubbleException = false);
        Task<IEnumerable<ChildRecord>> BulkInsertAsync(int companyId, List<ChildRecord> entityList, bool bubbleException = false);
        Task<int> BulkUpdateAsync(int companyId, List<ChildRecord> entityList, bool bubbleException = false);
        Task<int> BulkDeleteAsync(int companyId, List<ChildRecord> entityList, bool bubbleException = false);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(int companyId, PageSortFilterModel model, bool bubbleException = false);
        Task<ChildRecord> GetByIdAsync(int companyId, int childId, bool bubbleException = false);
        Task<IEnumerable<ChildRecord>> GetAllByMasterIdAsync(int masterId, int companyId, bool bubbleException = false);
        Task<IEnumerable<ChildRecord>> GetAllByDetailIdAsync(int detailId, int companyId, bool bubbleException = false);


    }
}
