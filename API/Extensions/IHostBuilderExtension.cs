using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Exceptions;

namespace API.Extensions
{
    public static class IHostBuilderExtension
    {
        public static IHostBuilder UseHostBuilderExtension(this IHostBuilder host)
        {
            _ = host.UseSerilog((context, services, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithClientIp()
            .Enrich.WithCorrelationId()
            .Enrich.WithEnvironmentName()
            .Enrich.WithEnvironmentUserName()
            .Enrich.WithExceptionDetails()
            .Enrich.WithMachineName()
            .WriteTo.Console());
            return host;
        }
    }
}