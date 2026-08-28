using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.Common;
using MasterDetail.Common.Models;

namespace MasterDetail.BusinessLogic.DomainServices
{
    public class ChildDomainService : BaseDomainService, IChildDomainService
    {

        public ChildDomainService(IDomainServiceContext domainService, IRepositoryContext repository) : base(domainService, repository)
        {

        }

        public async Task<List<ChildRecord>> GetAllAsync()
        {
            var records = await Repository.ChildRepository.GetAllAsync(Database.NonScalling);
            return records.ToList();
        }

        public async Task<ChildRecord> GetChildByIdAsync(int childId)
        {
            var record = await Repository.ChildRepository.GetByIdAsync(Database.NonScalling, childId);
            return record;
        }

        public async Task<List<ChildRecord>> GetChildsByMasterIdAsync(int masterId)
        {
            var record = await Repository.ChildRepository.GetAllByMasterIdAsync(masterId, Database.NonScalling);
            return record.ToList();
        }
        public async Task<List<ChildRecord>> GetChildsByDetailIdAsync(int detailId)
        {
            var record = await Repository.ChildRepository.GetAllByDetailIdAsync(detailId, Database.NonScalling);
            return record.ToList();
        }

        public async Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model)
        {
            var record = await Repository.ChildRepository.GetPageSortFilterAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<ChildRecord> CreateChildAsync(ChildRecord model)
        {
            var record = await Repository.ChildRepository.CreateAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<bool> UpdateChildAsync(ChildRecord model)
        {
            var row = await Repository.ChildRepository.UpdateAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<bool> DeleteChildAsync(ChildRecord model)
        {
            var row = await Repository.ChildRepository.DeleteAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<List<ChildRecord>> BulkCreateChildAsync(List<ChildRecord> model)
        {
            var record = await Repository.ChildRepository.BulkInsertAsync(Database.NonScalling, model);
            return record.ToList();
        }

        public async Task<bool> BulkUpdateChildAsync(List<ChildRecord> model)
        {
            var rows = await Repository.ChildRepository.BulkUpdateAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

        public async Task<bool> BulkDeleteChildAsync(List<ChildRecord> model)
        {
            var rows = await Repository.ChildRepository.BulkDeleteAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

    }

    public interface IChildDomainService
    {

        Task<ChildRecord> GetChildByIdAsync(int childId);
        Task<List<ChildRecord>> GetAllAsync();
        Task<List<ChildRecord>> GetChildsByMasterIdAsync(int masterId);
        Task<List<ChildRecord>> GetChildsByDetailIdAsync(int detailId);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model);
        Task<ChildRecord> CreateChildAsync(ChildRecord model);
        Task<bool> UpdateChildAsync(ChildRecord model);
        Task<bool> DeleteChildAsync(ChildRecord model);
        Task<List<ChildRecord>> BulkCreateChildAsync(List<ChildRecord> model);
        Task<bool> BulkUpdateChildAsync(List<ChildRecord> model);
        Task<bool> BulkDeleteChildAsync(List<ChildRecord> model);

    }
}