
namespace MasterDetail.Common.Models
{
    public class ResultModel
    {
        public string ErrorText { get; set; }
        public bool IsSuccess { get; set; }
        public bool HasError { get; set; }
        public dynamic Data { get; set; }

    }
}
  