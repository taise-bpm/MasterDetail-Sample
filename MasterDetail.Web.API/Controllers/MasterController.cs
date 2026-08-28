using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using System.Data;

namespace MasterDetail.Web.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class MasterController : BaseApiController
    {
        public MasterController(IDomainServiceContext domainContext)
            : base(domainContext)
        {
        }

        /* ----------------------------------------------------
           GET ALL MASTER (OPTIONAL PAGINATION)
        ---------------------------------------------------- */
        [HttpGet("GetAllPaged")]
        public async Task<ActionResult> GetAllPaged(
            [FromQuery] string search = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] bool reverse = false)
        {
            if (page < 1 || limit < 1)
                return BadRequest("Page and limit must be greater than 0.");

            var filterModel = new PageSortFilterModel
            {
                Skip = (page - 1) * limit,
                Take = limit
            };

            if (!string.IsNullOrEmpty(search))
            {
                filterModel.IncludeFilteredCount = true;
            }
            else
            {
                filterModel.IncludeTotalCount = true;
            }

            if (search != null)
            {
                filterModel.FilterByList.Add(new FilterBySetting
                {
                    FilterByClause = $"Name LIKE '%{search}%' OR Descritption LIKE '%{search}%'",
                    FilterByOrd = 1
                });
            }

            if (reverse)
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "MasterId DESC",
                    OrderByOrd = 1
                });
            }
            else
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "MasterId ASC",
                    OrderByOrd = 1
                });
            }

            var pagedResult = await DomainContext
                .MasterDomainService
                .GetPageSortFilterAsync(filterModel);

            var totalCount = pagedResult.TotalCount;

            return Ok(new
            {
                masters = pagedResult.Content,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / limit),
                currentPage = page
            });
        }

        /* ----------------------------------------------------
           GET ALL
        ---------------------------------------------------- */
        [HttpGet("getall")]
        public async Task<ActionResult> GetAll()
        {
            var masterList = await DomainContext
                .MasterDomainService
                .GetAllAsync();

            if (masterList == null)
                return NotFound("Master not found.");

            return Ok(masterList);
        }

        /* ----------------------------------------------------
           GET BY ID
        ---------------------------------------------------- */
        [HttpGet("getbyid/{masterId:int}")]
        public async Task<ActionResult> GetById(int masterId)
        {
            var masterList = await DomainContext
                .MasterDomainService
                .GetMasterByIdAsync(masterId);

            if (masterList == null)
                return NotFound("Master not found.");

            return Ok(masterList);
        }


        /* ----------------------------------------------------
           CREATE
        ---------------------------------------------------- */
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] MasterRecord record)
        {
            if (record == null)
                return BadRequest("MasterRecord cannot be null.");


            record.CreatedOn = DateTime.UtcNow;
            record.CreatedBy = GetLoggedUserId().ToString();
            record.CreatedIP = GetUserIpAddress();

            record.ModifiedOn = DateTime.UtcNow;
            record.ModifiedBy = GetLoggedUserId().ToString();
            record.ModifiedIP = GetUserIpAddress();

            var created = await DomainContext
                .MasterDomainService
                .CreateMasterAsync(record);

            return Ok(created);
        }

        /* ----------------------------------------------------
           UPDATE
        ---------------------------------------------------- */
        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] MasterRecord record)
        {
            if (record == null)
                return BadRequest("MasterRecord cannot be null.");

            var existingMaster = await DomainContext
                .MasterDomainService
                .GetMasterByIdAsync(record.MasterId);

            if (existingMaster == null) return NotFound("Master not found.");

            existingMaster.Name = record.Name;
            existingMaster.Descritption = record.Descritption;

            existingMaster.ModifiedOn = DateTime.UtcNow;
            existingMaster.ModifiedBy = GetLoggedUserId().ToString();
            existingMaster.ModifiedIP = GetUserIpAddress();

            var updateStatus = await DomainContext
                .MasterDomainService
                .UpdateMasterAsync(existingMaster);

            if (!updateStatus)
                return BadRequest("Master update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           DELETE
        ---------------------------------------------------- */
        [HttpDelete("delete/{masterId}")]
        public async Task<ActionResult> Delete(int masterId)
        {
            var master = await DomainContext
                .MasterDomainService
                .GetMasterByIdAsync(masterId);

            if (master == null)
                return NotFound("Master not found.");

            master.ModifiedOn = DateTime.UtcNow;
            master.ModifiedBy = GetLoggedUserId().ToString();
            master.ModifiedIP = GetUserIpAddress();

            var deleteStatus = await DomainContext
                .MasterDomainService
                .DeleteMasterAsync(master);

            if (!deleteStatus)
                return BadRequest("Master delete failed.");

            return Ok(new { success = deleteStatus });
        }

        /* ----------------------------------------------------
           BULK CREATE
        ---------------------------------------------------- */
        [HttpPost("bulkcreate")]
        public async Task<ActionResult> BulkCreate([FromBody] List<MasterRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("MasterRecords cannot be null or empty.");

            foreach (var record in records)
            {

                record.CreatedOn = DateTime.UtcNow;
                record.CreatedBy = GetLoggedUserId().ToString();
                record.CreatedIP = GetUserIpAddress();

                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var createdList = await DomainContext
                .MasterDomainService
                .BulkCreateMasterAsync(records);

            return Ok(createdList);
        }

        /* ----------------------------------------------------
           BULK UPDATE
        ---------------------------------------------------- */
        [HttpPut("bulkupdate")]
        public async Task<ActionResult> BulkUpdate([FromBody] List<MasterRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("MasterRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var updateStatus = await DomainContext
                .MasterDomainService
                .BulkUpdateMasterAsync(records);

            if (!updateStatus)
                return BadRequest("Master bulk update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           BULK DELETE
        ---------------------------------------------------- */
        [HttpDelete("bulkdelete")]
        public async Task<ActionResult> BulkDelete([FromBody] List<MasterRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("MasterRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var deleteStatus = await DomainContext
                .MasterDomainService
                .BulkDeleteMasterAsync(records);

            if (!deleteStatus)
                return BadRequest("Master bulk delete failed.");

            return Ok(new { success = deleteStatus });
        }
    }
}