
using Microsoft.Extensions.Configuration;

namespace MasterDetail.BusinessLogic
{
    public class ConnectionStringFactory : IConnectionStringFactory
    {
        public IConfiguration Configuration { get; }

        public ConnectionStringFactory(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public string GetConnectionString()
        {
            var connectionString = Configuration.GetConnectionString("MasterDetailDB");
            return connectionString;
        }
    }
}
  