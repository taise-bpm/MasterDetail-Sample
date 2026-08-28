
using System;

namespace MasterDetail.BusinessLogic.Models
{
    public class ChildRecord
    {
      
        public int  ChildId { get; set; }
        public int  MasterId { get; set; }
        public int  DetailId { get; set; }
        public string    Name { get; set; }
        public string    Description { get; set; }
        public string    CreatedBy { get; set; }
        public DateTime?  CreatedOn { get; set; }
        public string    CreatedIP { get; set; }
        public string    ModifiedBy { get; set; }
        public DateTime?  ModifiedOn { get; set; }
        public string    ModifiedIP { get; set; }
    }
}
  