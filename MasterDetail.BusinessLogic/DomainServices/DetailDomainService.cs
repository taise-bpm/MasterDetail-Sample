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
    public class DetailDomainService : BaseDomainService, IDetailDomainService
    {

        public DetailDomainService(IDomainServiceContext domainService, IRepositoryContext repository) : base(domainService, repository)
        {

        }

        public async Task<List<DetailRecord>> GetAllAsync()
        {
            var records = await Repository.DetailRepository.GetAllAsync(Database.NonScalling);
            return records.ToList();
        }

        public async Task<DetailRecord> GetDetailByIdAsync(int detailId)
        {
            var record = await Repository.DetailRepository.GetByIdAsync(Database.NonScalling, detailId);
            return record;
        }

        public async Task<List<DetailRecord>> GetDetailsByMasterIdAsync(int masterId)
        {
            var record = await Repository.DetailRepository.GetAllByMasterIdAsync(masterId, Database.NonScalling);
            return record.ToList();
        }

        public async Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model)
        {
            var record = await Repository.DetailRepository.GetPageSortFilterAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<DetailRecord> CreateDetailAsync(DetailRecord model)
        {
            var record = await Repository.DetailRepository.CreateAsync(Database.NonScalling, model);
            return record;
        }

        public async Task<bool> UpdateDetailAsync(DetailRecord model)
        {
            var row = await Repository.DetailRepository.UpdateAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<bool> DeleteDetailAsync(DetailRecord model)
        {
            var row = await Repository.DetailRepository.DeleteAsync(Database.NonScalling, model);
            return row > 0 ? true : false;
        }

        public async Task<List<DetailRecord>> BulkCreateDetailAsync(List<DetailRecord> model)
        {
            var record = await Repository.DetailRepository.BulkInsertAsync(Database.NonScalling, model);
            return record.ToList();
        }

        public async Task<bool> BulkUpdateDetailAsync(List<DetailRecord> model)
        {
            var rows = await Repository.DetailRepository.BulkUpdateAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

        public async Task<bool> BulkDeleteDetailAsync(List<DetailRecord> model)
        {
            var rows = await Repository.DetailRepository.BulkDeleteAsync(Database.NonScalling, model);
            return rows > 0 ? true : false;
        }

    }

    public interface IDetailDomainService
    {

        Task<DetailRecord> GetDetailByIdAsync(int detailId);
        Task<List<DetailRecord>> GetAllAsync();
        Task<List<DetailRecord>> GetDetailsByMasterIdAsync(int masterId);
        Task<PageOrderFilterReturn> GetPageSortFilterAsync(PageSortFilterModel model);
        Task<DetailRecord> CreateDetailAsync(DetailRecord model);
        Task<bool> UpdateDetailAsync(DetailRecord model);
        Task<bool> DeleteDetailAsync(DetailRecord model);
        Task<List<DetailRecord>> BulkCreateDetailAsync(List<DetailRecord> model);
        Task<bool> BulkUpdateDetailAsync(List<DetailRecord> model);
        Task<bool> BulkDeleteDetailAsync(List<DetailRecord> model);

    }
}