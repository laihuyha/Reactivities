using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace API.Extensions
{
    public static class AppBuilderExtension
    {
        public static IApplicationBuilder UseAppBuilderExtension(this IApplicationBuilder app, IConfiguration config)
        {
            app.UseSerilogRequestLogging();
            return app;
        }
    }
}