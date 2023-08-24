using Microsoft.Extensions.Hosting;
using Serilog;

namespace API.Extensions
{
    public static class IHostBuilderExtension
    {
        public static IHostBuilder UseHostBuilderExtension(this IHostBuilder host)
        {
            // _ = host.UseSerilog((context, services, configuration) =>
            //     configuration.ReadFrom.Configuration(context.Configuration)
            // );
            // _ = host.UseSerilog();
            _ = host.UseSerilog((context, services, configuration) => configuration.ReadFrom.Configuration(context.Configuration).ReadFrom.Services(services).Enrich.FromLogContext().WriteTo.Console());
            return host;
        }
    }
}