
using System;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace MasterDetail.Common.Models
{
    public class DetailViewModel
    {
      
        public int  DetailId { get; set; }
        public int  MasterId { get; set; }
        public string    Name { get; set; }
        public string    Descritpion { get; set; }
        public string    CreatedBy { get; set; }
        public DateTime?  CreatedOn { get; set; }
        public string    CreatedIP { get; set; }
        public string    ModifiedBy { get; set; }
        public DateTime?  ModifiedOn { get; set; }
        public string    ModifiedIP { get; set; }
        public DetailViewModel()
        {
          
        }
    }
}
  