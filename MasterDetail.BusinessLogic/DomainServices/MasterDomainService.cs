using MasterDetail.BusinessLogic.Repository;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.Common;

namespace MasterDetail.BusinessLogic.DomainServices
{
    public class MasterDomainService : BaseDomainService, IMasterDomainService
    {

        public MasterDomainService(IDomainServiceContext domainService, IRepositoryContext repository) : base(domainService, repository)
        {

        }

        public async Task<List<MasterRecord>> GetAllAsync()
        {
            var records = await Repository.MasterRepository.GetAllAsync(Database.NonScalling);
            return records.ToList();
        }

        public async Task<MasterRecord> GetMasterByIdAsync(int masterId)
        {
            var record = await Repository.MasterRepository.GetByIdAsync(Database.NonScalling, masterId);
            return record;
        }


        public async Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model)
        {
            var record = await Repository.MasterRepository.GetPageSortFilterAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<MasterRecord> CreateMasterAsync(MasterRecord model)
        {
            var record = await Repository.MasterRepository.CreateAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<bool> UpdateMasterAsync(MasterRecord model)
        {
            var row = await Repository.MasterRepository.UpdateAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<bool> DeleteMasterAsync(MasterRecord model)
        {
            var row = await Repository.MasterRepository.DeleteAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<List<MasterRecord>> BulkCreateMasterAsync(List<MasterRecord> model)
        {
            var record = await Repository.MasterRepository.BulkInsertAsync(Database.NonScalling, model);
            return record.ToList();
        }

        public async Task<bool> BulkUpdateMasterAsync(List<MasterRecord> model)
        {
            var rows = await Repository.MasterRepository.BulkUpdateAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

        public async Task<bool> BulkDeleteMasterAsync(List<MasterRecord> model)
        {
            var rows = await Repository.MasterRepository.BulkDeleteAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

    }

    public interface IMasterDomainService
    {

        Task<MasterRecord> GetMasterByIdAsync(int masterId);
        Task<List<MasterRecord>> GetAllAsync();
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model);
        Task<MasterRecord> CreateMasterAsync(MasterRecord model);
        Task<bool> UpdateMasterAsync(MasterRecord model);
        Task<bool> DeleteMasterAsync(MasterRecord model);
        Task<List<MasterRecord>> BulkCreateMasterAsync(List<MasterRecord> model);
        Task<bool> BulkUpdateMasterAsync(List<MasterRecord> model);
        Task<bool> BulkDeleteMasterAsync(List<MasterRecord> model);

    }
}