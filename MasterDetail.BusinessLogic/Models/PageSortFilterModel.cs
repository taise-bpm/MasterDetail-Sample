
using System.Collections.Generic;
using MasterDetail.BusinessLogic.Repository;

namespace MasterDetail.BusinessLogic.Models
{
    public class PageSortFilterModel
    {
        public long Skip { get; set; } = 0L;
        public long Take { get; set; } = long.MaxValue;
        public bool IncludeTotalCount { get; set; } = false;
        public bool IncludeFilteredCount { get; set; } = false;
        public List<OrderBySetting> OrderbyList { get; set; } = new List<OrderBySetting>();
        public List<FilterBySetting> FilterByList { get; set; } = new List<FilterBySetting>();
    }
}
  