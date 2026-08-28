
using System;

namespace MasterDetail.BusinessLogic.Models
{
    public class MasterRecord
    {
      
        public int  MasterId { get; set; }
        public string    Name { get; set; }
        public string    Descritption { get; set; }
        public string    CreatedBy { get; set; }
        public DateTime?  CreatedOn { get; set; }
        public string    CreatedIP { get; set; }
        public string    ModifiedBy { get; set; }
        public DateTime?  ModifiedOn { get; set; }
        public string    ModifiedIP { get; set; }
    }
}
  