
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.RazorPages;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using System.Collections.Generic;
    using MasterDetail.BusinessLogic;
    using MasterDetail.BusinessLogic.DomainServices;
    using MasterDetail.BusinessLogic.Models;
    using MasterDetail.Common;
    using MasterDetail.Common.Models;
    using MasterDetail.Web.UI.Pages;
    
    namespace MasterDetail.Web.UI.Pages
    
    {   
        [BindProperties]
        public class MasterDetailModel : BasePageModel
        {
            
            public MasterRecord Master { get; set; }
            
            public List<DetailRecord>Details { get; set; }
            
            
            public MasterDetailModel(IDomainServiceContext domainContext, ILogger <BasePageModel> logger) : base(domainContext, logger)
            {

            }
            
            public async Task<IActionResult> OnGet(int MasterId=0)
            {
                Master = await DomainService.MasterDetailDomainService.GetMasterByIdAsync(MasterId);
                    Details = await DomainService.MasterDetailDomainService.GetAllDetailByMasterIdAsync(MasterId);
                  
                return Page();
            }
            
            public PartialViewResult OnGetAddPartial(int MasterId)
            {
                
                var detailViewModel = new DetailViewModel()
                {
                    MasterId = MasterId,
                };
                
                return Partial("_AddDetailPartial", detailViewModel);
            }
            
            public async Task<PartialViewResult> OnGetEditPartial(int DetailId)
            {
                var detailRecord = await DomainService.MasterDetailDomainService.GetDetailByIdAsync(DetailId);
                
                var detailViewModel = new DetailViewModel()
                {
                    DetailId = detailRecord.DetailId,
                    MasterId = detailRecord.MasterId,
                    Name = detailRecord.Name,
                    Descritpion = detailRecord.Descritpion,
                    CreatedBy = detailRecord.CreatedBy,
                    CreatedOn = detailRecord.CreatedOn,
                    CreatedIP = detailRecord.CreatedIP,
                    ModifiedBy = detailRecord.ModifiedBy,
                    ModifiedOn = detailRecord.ModifiedOn,
                    ModifiedIP = detailRecord.ModifiedIP,
                    
                };
                
                return Partial("_EditDetailPartial", detailViewModel);
            }
            
            public async Task<JsonResult> OnPostAddDetail(DetailViewModel model)
            {
                var result = new ResultModel();

                if (ModelState.IsValid)
                {
                    var detailRecord = new DetailRecord()
                    {
                        DetailId = model.DetailId,
                          MasterId = model.MasterId,
                          Name = model.Name,
                          Descritpion = model.Descritpion,
                          CreatedBy = model.CreatedBy,
                          CreatedOn = model.CreatedOn,
                          CreatedIP = model.CreatedIP,
                          ModifiedBy = model.ModifiedBy,
                          ModifiedOn = model.ModifiedOn,
                          ModifiedIP = model.ModifiedIP,
                          
                    };

                    detailRecord = await DomainService.MasterDetailDomainService.CreateDetailAsync(detailRecord);

                    if (detailRecord.DetailId>0)
                    {
                        
                        result.Data = detailRecord.MasterId;
                        
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.ErrorText = "Creation of Detail failed. Please try again. If error persists please contact site administrator.";
                    }
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorText = "Data Validation of Detail failed. Please try again with Required Valid Data.";
                }

                return new JsonResult(result);
            }
            
            public async Task<JsonResult> OnPostEditDetail(DetailViewModel model)
            {
                var result = new ResultModel();

                if (ModelState.IsValid)
                {
                    var detailRecord = await DomainService.MasterDetailDomainService.GetDetailByIdAsync(model.DetailId);

                    if (detailRecord.DetailId> 0)
                    {
                        
                          detailRecord.DetailId = model.DetailId;
                          
                          detailRecord.MasterId = model.MasterId;
                          
                          detailRecord.Name = model.Name;
                          
                          detailRecord.Descritpion = model.Descritpion;
                          
                          detailRecord.CreatedBy = model.CreatedBy;
                          
                          detailRecord.CreatedOn = model.CreatedOn;
                          
                          detailRecord.CreatedIP = model.CreatedIP;
                          
                          detailRecord.ModifiedBy = model.ModifiedBy;
                          
                          detailRecord.ModifiedOn = model.ModifiedOn;
                          
                          detailRecord.ModifiedIP = model.ModifiedIP;
                          
                        var success = await DomainService.MasterDetailDomainService.UpdateDetailAsync(detailRecord);

                        if (success)
                        {
                            
                            result.Data = detailRecord.MasterId;
                            
                            result.IsSuccess = true;
                        }
                        else
                        {
                            result.IsSuccess = false;
                            result.ErrorText = "Detailt updation failed. Please try again. If error persists please contact site administrator.";
                        }
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.ErrorText = "Detail updation failed. Please try again. If error persists please contact site administrator.";
                    }
                }
                else
                {
                    result.IsSuccess = false;
                    result.ErrorText = "Data Validation of Detail failed. Please try again with Required Valid Data.";
                }

                return new JsonResult(result);
            }
            
        }
    }
  