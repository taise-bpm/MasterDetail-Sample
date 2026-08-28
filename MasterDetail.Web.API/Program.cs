
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.BusinessLogic;
using Serilog.Events;
using Serilog;
using MasterDetail.Web.API;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using StackExchange.Redis;
using System.Security.Cryptography.X509Certificates;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (String.IsNullOrEmpty(environment))
{
    environment = "Production";
}
var builder = WebApplication.CreateBuilder(args);
var ipAddress = "127.0.0.1";

// Add services to the container.
Log.Logger = new LoggerConfiguration()
            .Enrich.WithProperty("Application", "MasterDetail-API")
            .Enrich.WithProperty("MachineName", Environment.MachineName)
            .Enrich.WithProperty("Environment", environment)
            .Enrich.WithProperty("IP", ipAddress)
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .WriteTo.Seq("http://seq.shielddatasolutions.com/", apiKey: "OeKFs7Om3qaZ8UjoTOlu")
            .CreateLogger();

builder.Host.UseSerilog();
var machine = Environment.MachineName;
Log.Write(LogEventLevel.Information, "Starting MasterDetail API on " + machine);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(["http://localhost:54681"]) // React App URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Configuration.AddJsonFile("appsettings.json", false, true);
builder.Configuration.AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true);
builder.Configuration.AddJsonFile($"appsettings.{environment}.json", true, true);
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IConnectionStringFactory, ConnectionStringFactory>();
builder.Services.Configure<MasterDetailSettings>(builder.Configuration.GetSection("MasterDetailSettings"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                      .AddJwtBearer(options =>
                      {
                          options.TokenValidationParameters = new TokenValidationParameters
                          {
                              ValidateIssuer = true,
                              ValidateAudience = false,
                              ValidateLifetime = true,
                              ValidateIssuerSigningKey = true,

                              ValidIssuer = "https://api.shielddatasolutions.com",
                              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSetting.SecurityKey))
                          };
                      });

#region Repository

builder.Services.AddSingleton<IMasterRepository, MasterRepository>();

builder.Services.AddSingleton<IDetailRepository, DetailRepository>();

builder.Services.AddSingleton<IChildRepository, ChildRepository>();


#endregion Repository

#region DomainService

builder.Services.AddSingleton<IMasterDomainService, MasterDomainService>();
builder.Services.AddSingleton<IDetailDomainService, DetailDomainService>();
builder.Services.AddSingleton<IChildDomainService, ChildDomainService>();

            
#endregion DomainService

#region FuncDomainService

builder.Services.AddTransient<Func<IMasterDomainService>>(cont => () => cont.GetService<IMasterDomainService>());
builder.Services.AddTransient<Func<IDetailDomainService>>(cont => () => cont.GetService<IDetailDomainService>());
builder.Services.AddTransient<Func<IChildDomainService>>(cont => () => cont.GetService<IChildDomainService>());

            
#endregion

#region Context

builder.Services.AddSingleton<IRepositoryContext, RepositoryContext>();
builder.Services.AddSingleton<IDomainServiceContext, DomainServiceContext>();

#endregion




try
{
    var redisConfig = builder.Configuration.GetSection("RedisServer").Get<RedisServerConfig>();

    ConfigurationOptions option = new ConfigurationOptions
    {
        AbortOnConnectFail = false,
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
    Log.Error("Redis Block Exception: ", ex);
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public class RedisServerConfig
{
    public string EndPoint { get; set; }
    public string Password { get; set; }
}

	