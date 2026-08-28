
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.BusinessLogic;
using MasterDetail.Web.UI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Sockets;
using System.Net;
using Serilog.Events;
using Serilog;
using System.Security.Cryptography.X509Certificates;
using StackExchange.Redis;
using Microsoft.AspNetCore.DataProtection;


var ipAddress = "127.0.0.1";

var builder = WebApplication.CreateBuilder(args);

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (String.IsNullOrEmpty(environment))
{
    environment = "Production";
}
try
{
    var ipAddressArray = Array.FindAll(Dns.GetHostEntry(string.Empty).AddressList,
                                a => a.AddressFamily == AddressFamily.InterNetwork);
    ipAddress = ipAddressArray[0]?.ToString();
}
catch { }

Log.Logger = new LoggerConfiguration()
            .Enrich.WithProperty("Application", "ShieldData-SuperAdmin")
            .Enrich.WithProperty("MachineName", Environment.MachineName)
            .Enrich.WithProperty("Environment", environment)
            .Enrich.WithProperty("IP", ipAddress)
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .WriteTo.Seq("http://seq.bpmbiinc.com/", apiKey: "OeKFs7Om3qaZ8UjoTOlu")
            .CreateLogger();

builder.Host.UseSerilog();

var machine = Environment.MachineName;
Log.Write(LogEventLevel.Information, "Starting ShieldApp Super Admin on " + machine);


try
{
    var redisConfig = builder.Configuration.GetSection("RedisServer").Get<RedisServerConfig>();

	ConfigurationOptions option = new ConfigurationOptions
	{
		EndPoints = { redisConfig.EndPoint },
		Password = redisConfig.Password
	};

	var redis = ConnectionMultiplexer.Connect(option);

	if (environment == Environments.Development)
	{
		builder.Services.AddDataProtection()
			.PersistKeysToStackExchangeRedis(redis, "DataProtection-Keys")
			.SetApplicationName("MasterDetail-Dev")
			.ProtectKeysWithCertificate(X509CertificateLoader.LoadPkcs12FromFile("keyprotection.mypfx", "P@ssw0rd"));
	}
	else
	{
		builder.Services.AddDataProtection()
			.PersistKeysToStackExchangeRedis(redis, "DataProtection-Keys")
			.SetApplicationName("MasterDetail-Prod")
			.ProtectKeysWithCertificate(X509CertificateLoader.LoadPkcs12FromFile("keyprotection.mypfx", "P@ssw0rd"));
	}
}
catch (Exception ex)
{
	if (!File.Exists("keyprotection.mypfx"))
	{
		Log.Write(LogEventLevel.Information, "keyprotection.mypfx not found");
	}

		Log.Error("Exception: ", ex);
}

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddSingleton<IConnectionStringFactory, ConnectionStringFactory>();


builder.Configuration.AddJsonFile("appsettings.json", false, true);
builder.Configuration.AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true);
builder.Configuration.AddJsonFile($"appsettings.{environment}.json", true, true);
#region ConfigSettings

builder.Services.Configure<MasterDetailSettings>(builder.Configuration.GetSection("MasterDetailSettings"));


#endregion


#region Repository

builder.Services.AddSingleton<IMasterRepository, MasterRepository>();

builder.Services.AddSingleton<IDetailRepository, DetailRepository>();

builder.Services.AddSingleton<IChildRepository, ChildRepository>();


#endregion Repository

#region DomainService

builder.Services.AddSingleton<IMasterDetailDomainService, MasterDetailDomainService>();

            
#endregion DomainService

#region FuncDomainService

builder.Services.AddTransient<Func<IMasterDetailDomainService>>(cont => () => cont.GetService<IMasterDetailDomainService>());

            
#endregion

#region Context

builder.Services.AddSingleton<IRepositoryContext, RepositoryContext>();
builder.Services.AddSingleton<IDomainServiceContext, DomainServiceContext>();

#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCookiePolicy();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();

public class RedisServerConfig
{
    public string EndPoint { get; set; }
    public string Password { get; set; }
}

  