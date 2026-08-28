
namespace MasterDetail.Web.API
{
    public class MasterDetailSettings
    {
        public string BaseUrl { get; set; }
        public string SeqUrl { get; set; }
        public string EmailFrom { get; set; }
        public string ContactFormEmailTo { get; set; }
        public string ContactFormEmailCc { get; set; }
        public string ContactFormEmailBcc { get; set; }
        public int CacheTimeout { get; set; }
    }
    public class JwtSetting
    {
        public const int ExpiryDays = 30;
        public const string SecurityKey = "UhFOREHtVbTJAl8C6M3QKXjeB9iG6BMY";
        public const string BaseAddress = "https://api.appifytesting.com/";
    }
}
	