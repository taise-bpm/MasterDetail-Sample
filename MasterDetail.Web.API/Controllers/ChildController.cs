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
    public class ChildController : BaseApiController
    {
        public ChildController(IDomainServiceContext domainContext)
            : base(domainContext)
        {
        }

        /* ----------------------------------------------------
           GET ALL CHILD (OPTIONAL PAGINATION)
        ---------------------------------------------------- */
        [HttpGet("GetAllPaged/{masterId:int}/{detailId:int}")]
        public async Task<ActionResult> GetAllPaged(
            [FromRoute] int masterId,
            [FromRoute] int detailId,
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

            if (masterId > 0 || detailId > 0 || !string.IsNullOrEmpty(search))
            {
                filterModel.IncludeFilteredCount = true;
            }
            else
            {
                filterModel.IncludeTotalCount = true;
            }

            if (masterId > 0)
            {
                filterModel.FilterByList.Add(new FilterBySetting
                {
                    FilterByClause = $"MasterId = {masterId}",
                    FilterByOrd = 1
                });
            }
            if (detailId > 0)
            {
                filterModel.FilterByList.Add(new FilterBySetting
                {
                    FilterByClause = $"DetailId = {detailId}",
                    FilterByOrd = 2
                });
            }
            if (search != null)
            {
                filterModel.FilterByList.Add(new FilterBySetting
                {
                    FilterByClause = $"Name LIKE '%{search}%' OR Description LIKE '%{search}%'",
                    FilterByOrd = 3
                });
            }

            if (reverse)
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "ChildId DESC",
                    OrderByOrd = 1
                });
            }
            else
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "ChildId ASC",
                    OrderByOrd = 1
                });
            }

            var pagedResult = await DomainContext
                .ChildDomainService
                .GetPageSortFilterAsync(filterModel);

            var totalCount = pagedResult.TotalCount;

            return Ok(new
            {
                childs = pagedResult.Content,
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
            var childList = await DomainContext
                .ChildDomainService
                .GetAllAsync();

            if (childList == null)
                return NotFound("Child not found.");

            return Ok(childList);
        }

        /* ----------------------------------------------------
           GET BY ID
        ---------------------------------------------------- */
        [HttpGet("getbyid/{childId:int}")]
        public async Task<ActionResult> GetById(int childId)
        {
            var childList = await DomainContext
                .ChildDomainService
                .GetChildByIdAsync(childId);

            if (childList == null)
                return NotFound("Child not found.");

            return Ok(childList);
        }

        /* ----------------------------------------------------
           GET BY MASTERID
        ---------------------------------------------------- */
        [HttpGet("getbymasterid/{masterId:int}")]
        public async Task<ActionResult> GetByMasterId(int masterId)
        {
            var childList = await DomainContext
                .ChildDomainService
                .GetChildByMasterIdAsync(masterId);

            if (childList == null)
                return NotFound("Child not found.");

            return Ok(new
            {
                childList
            });
        }
        /* ----------------------------------------------------
           GET BY DETAILID
        ---------------------------------------------------- */
        [HttpGet("getbydetailid/{detailId:int}")]
        public async Task<ActionResult> GetByDetailId(int detailId)
        {
            var childList = await DomainContext
                .ChildDomainService
                .GetChildByDetailIdAsync(detailId);

            if (childList == null)
                return NotFound("Child not found.");

            return Ok(new
            {
                childList
            });
        }

        /* ----------------------------------------------------
           CREATE
        ---------------------------------------------------- */
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] ChildRecord record)
        {
            if (record == null)
                return BadRequest("ChildRecord cannot be null.");


            record.CreatedOn = DateTime.UtcNow;
            record.CreatedBy = GetLoggedUserId().ToString();
            record.CreatedIP = GetUserIpAddress();

            record.ModifiedOn = DateTime.UtcNow;
            record.ModifiedBy = GetLoggedUserId().ToString();
            record.ModifiedIP = GetUserIpAddress();

            var created = await DomainContext
                .ChildDomainService
                .CreateChildAsync(record);

            return Ok(created);
        }

        /* ----------------------------------------------------
           UPDATE
        ---------------------------------------------------- */
        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] ChildRecord record)
        {
            if (record == null)
                return BadRequest("ChildRecord cannot be null.");

            var existingChild = await DomainContext
                .ChildDomainService
                .GetChildByIdAsync(record.ChildId);

            if (existingChild == null) return NotFound("Child not found.");

            existingChild.Name = record.Name;
            existingChild.Description = record.Description;

            existingChild.ModifiedOn = DateTime.UtcNow;
            existingChild.ModifiedBy = GetLoggedUserId().ToString();
            existingChild.ModifiedIP = GetUserIpAddress();

            var updateStatus = await DomainContext
                .ChildDomainService
                .UpdateChildAsync(existingChild);

            if (!updateStatus)
                return BadRequest("Child update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           DELETE
        ---------------------------------------------------- */
        [HttpDelete("delete/{childId}")]
        public async Task<ActionResult> Delete(int childId)
        {
            var child = await DomainContext
                .ChildDomainService
                .GetChildByIdAsync(childId);

            if (child == null)
                return NotFound("Child not found.");

            child.ModifiedOn = DateTime.UtcNow;
            child.ModifiedBy = GetLoggedUserId().ToString();
            child.ModifiedIP = GetUserIpAddress();

            var deleteStatus = await DomainContext
                .ChildDomainService
                .DeleteChildAsync(child);

            if (!deleteStatus)
                return BadRequest("Child delete failed.");

            return Ok(new { success = deleteStatus });
        }

        /* ----------------------------------------------------
           BULK CREATE
        ---------------------------------------------------- */
        [HttpPost("bulkcreate")]
        public async Task<ActionResult> BulkCreate([FromBody] List<ChildRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("ChildRecords cannot be null or empty.");

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
                .ChildDomainService
                .BulkCreateChildAsync(records);

            return Ok(createdList);
        }

        /* ----------------------------------------------------
           BULK UPDATE
        ---------------------------------------------------- */
        [HttpPut("bulkupdate")]
        public async Task<ActionResult> BulkUpdate([FromBody] List<ChildRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("ChildRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var updateStatus = await DomainContext
                .ChildDomainService
                .BulkUpdateChildAsync(records);

            if (!updateStatus)
                return BadRequest("Child bulk update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           BULK DELETE
        ---------------------------------------------------- */
        [HttpDelete("bulkdelete")]
        public async Task<ActionResult> BulkDelete([FromBody] List<ChildRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("ChildRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var deleteStatus = await DomainContext
                .ChildDomainService
                .BulkDeleteChildAsync(records);

            if (!deleteStatus)
                return BadRequest("Child bulk delete failed.");

            return Ok(new { success = deleteStatus });
        }
    }
}