
using System.Collections.Generic;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.Models;

namespace MasterDetail.BusinessLogic.Repository
{
    public class MasterRepository : BaseRepository<MasterRecord>, IMasterRepository
    {
        public MasterRepository(IConnectionStringFactory connectionStringFactory) : base(connectionStringFactory)
        {
            Schema = "[dbo]";
            GetAllProc = "[Master_GetAll]";

            InsertProc = "[Master_BulkInsert]";
            UpdateProc = "[Master_BulkUpdate]";
            DeleteProc = "[Master_BulkDelete]";

            DymamicProc = "[Master_DynamicSQL]";

            PageSortFilterProc = "[Master_GetByPageSortFilter]";
        }

        public Task<MasterRecord> GetByIdAsync(int companyId, int masterId, bool bubbleException = false)
        {
            var filterByList = new List<FilterBySetting>()
              {
                  new FilterBySetting()
                  {
                      FilterByClause = "MasterId = " + masterId.ToString(),
                      FilterByOrd = 1
                  }
              };
            return GetByUniqueKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
        }


        public Task<IEnumerable<MasterRecord>> GetAllByCompanyIdAsync(int companyId, bool bubbleException = false)
        {
            var filterByList = new List<FilterBySetting>()
                  {
                      new FilterBySetting()
                      {
                          FilterByClause = "CompanyId = " + companyId.ToString(),
                          FilterByOrd = 1
                      }
                  };
            return GetByForeignKey(companyId, filterByList, orderByList: new List<OrderBySetting>(), bubbleException: bubbleException);
        }


    }

    public interface IMasterRepository
    {
        Task<IEnumerable<MasterRecord>> GetAllAsync(int companyId, bool bubbleException = false);
        Task<MasterRecord> CreateAsync(int companyId, MasterRecord entity, bool bubbleException = false);
        Task<int> DeleteAsync(int companyId, MasterRecord entity, bool bubbleException = false);
        Task<int> UpdateAsync(int companyId, MasterRecord entity, bool bubbleException = false);
        Task<IEnumerable<MasterRecord>> BulkInsertAsync(int companyId, List<MasterRecord> entityList, bool bubbleException = false);
        Task<int> BulkUpdateAsync(int companyId, List<MasterRecord> entityList, bool bubbleException = false);
        Task<int> BulkDeleteAsync(int companyId, List<MasterRecord> entityList, bool bubbleException = false);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(int companyId, PageSortFilterModel model, bool bubbleException = false);

        Task<IEnumerable<MasterRecord>> GetAllByCompanyIdAsync(int companyId, bool bubbleException = false);

        Task<MasterRecord> GetByIdAsync(int companyId, int masterId, bool bubbleException = false);



    }
}
