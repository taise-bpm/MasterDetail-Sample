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
    public class DetailController : BaseApiController
    {
        public DetailController(IDomainServiceContext domainContext)
            : base(domainContext)
        {
        }

        /* ----------------------------------------------------
           GET ALL DETAIL (OPTIONAL PAGINATION)
        ---------------------------------------------------- */
        [HttpGet("GetAllPaged/{masterId:int}")]
        public async Task<ActionResult> GetAllPaged(
            [FromRoute] int masterId,
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

            if (masterId > 0 || !string.IsNullOrEmpty(search))
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
            if (search != null)
            {
                filterModel.FilterByList.Add(new FilterBySetting
                {
                    FilterByClause = $"Name LIKE '%{search}%' OR Descritpion LIKE '%{search}%'",
                    FilterByOrd = 2
                });
            }

            if (reverse)
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "DetailId DESC",
                    OrderByOrd = 1
                });
            }
            else
            {
                filterModel.OrderbyList.Add(new OrderBySetting
                {
                    OrderByClause = "DetailId ASC",
                    OrderByOrd = 1
                });
            }

            var pagedResult = await DomainContext
                .DetailDomainService
                .GetPageSortFilterAsync(filterModel);

            var totalCount = pagedResult.TotalCount;

            return Ok(new
            {
                details = pagedResult.Content,
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
            var detailList = await DomainContext
                .DetailDomainService
                .GetAllAsync();

            if (detailList == null)
                return NotFound("Detail not found.");

            return Ok(detailList);
        }

        /* ----------------------------------------------------
           GET BY ID
        ---------------------------------------------------- */
        [HttpGet("getbyid/{detailId:int}")]
        public async Task<ActionResult> GetById(int detailId)
        {
            var detailList = await DomainContext
                .DetailDomainService
                .GetDetailByIdAsync(detailId);

            if (detailList == null)
                return NotFound("Detail not found.");

            return Ok(detailList);
        }

        /* ----------------------------------------------------
           GET BY MASTERID
        ---------------------------------------------------- */
        [HttpGet("getbymasterid/{masterId:int}")]
        public async Task<ActionResult> GetByMasterId(int masterId)
        {
            var detailList = await DomainContext
                .DetailDomainService
                .GetDetailsByMasterIdAsync(masterId);

            if (detailList == null)
                return NotFound("Detail not found.");

            return Ok(new
            {
                detailList
            });
        }

        /* ----------------------------------------------------
           CREATE
        ---------------------------------------------------- */
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] DetailRecord record)
        {
            if (record == null)
                return BadRequest("DetailRecord cannot be null.");


            record.CreatedOn = DateTime.UtcNow;
            record.CreatedBy = GetLoggedUserId().ToString();
            record.CreatedIP = GetUserIpAddress();

            record.ModifiedOn = DateTime.UtcNow;
            record.ModifiedBy = GetLoggedUserId().ToString();
            record.ModifiedIP = GetUserIpAddress();

            var created = await DomainContext
                .DetailDomainService
                .CreateDetailAsync(record);

            return Ok(created);
        }

        /* ----------------------------------------------------
           UPDATE
        ---------------------------------------------------- */
        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] DetailRecord record)
        {
            if (record == null)
                return BadRequest("DetailRecord cannot be null.");

            var existingDetail = await DomainContext
                .DetailDomainService
                .GetDetailByIdAsync(record.DetailId);

            if (existingDetail == null) return NotFound("Detail not found.");

            existingDetail.Name = record.Name;
            existingDetail.Descritpion = record.Descritpion;

            existingDetail.ModifiedOn = DateTime.UtcNow;
            existingDetail.ModifiedBy = GetLoggedUserId().ToString();
            existingDetail.ModifiedIP = GetUserIpAddress();

            var updateStatus = await DomainContext
                .DetailDomainService
                .UpdateDetailAsync(existingDetail);

            if (!updateStatus)
                return BadRequest("Detail update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           DELETE
        ---------------------------------------------------- */
        [HttpDelete("delete/{detailId}")]
        public async Task<ActionResult> Delete(int detailId)
        {
            var detail = await DomainContext
                .DetailDomainService
                .GetDetailByIdAsync(detailId);

            if (detail == null)
                return NotFound("Detail not found.");

            detail.ModifiedOn = DateTime.UtcNow;
            detail.ModifiedBy = GetLoggedUserId().ToString();
            detail.ModifiedIP = GetUserIpAddress();

            var deleteStatus = await DomainContext
                .DetailDomainService
                .DeleteDetailAsync(detail);

            if (!deleteStatus)
                return BadRequest("Detail delete failed.");

            return Ok(new { success = deleteStatus });
        }

        /* ----------------------------------------------------
           BULK CREATE
        ---------------------------------------------------- */
        [HttpPost("bulkcreate")]
        public async Task<ActionResult> BulkCreate([FromBody] List<DetailRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("DetailRecords cannot be null or empty.");

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
                .DetailDomainService
                .BulkCreateDetailAsync(records);

            return Ok(createdList);
        }

        /* ----------------------------------------------------
           BULK UPDATE
        ---------------------------------------------------- */
        [HttpPut("bulkupdate")]
        public async Task<ActionResult> BulkUpdate([FromBody] List<DetailRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("DetailRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var updateStatus = await DomainContext
                .DetailDomainService
                .BulkUpdateDetailAsync(records);

            if (!updateStatus)
                return BadRequest("Detail bulk update failed.");

            return Ok(new { success = updateStatus });
        }

        /* ----------------------------------------------------
           BULK DELETE
        ---------------------------------------------------- */
        [HttpDelete("bulkdelete")]
        public async Task<ActionResult> BulkDelete([FromBody] List<DetailRecord> records)
        {
            if (records == null || !records.Any())
                return BadRequest("DetailRecords cannot be null or empty.");

            foreach (var record in records)
            {
                record.ModifiedOn = DateTime.UtcNow;
                record.ModifiedBy = GetLoggedUserId().ToString();
                record.ModifiedIP = GetUserIpAddress();
            }

            var deleteStatus = await DomainContext
                .DetailDomainService
                .BulkDeleteDetailAsync(records);

            if (!deleteStatus)
                return BadRequest("Detail bulk delete failed.");

            return Ok(new { success = deleteStatus });
        }
    }
}