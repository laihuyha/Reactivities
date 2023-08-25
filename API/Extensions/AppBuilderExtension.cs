using API.Middleware;
using Microsoft.AspNetCore.Builder;
using Serilog;

namespace API.Extensions
{
    public static class AppBuilderExtension
    {
        public static IApplicationBuilder UseAppBuilderExtension(this IApplicationBuilder app)
        {
            _ = app.UseSerilogRequestLogging();

            _ = app.UseHttpsRedirection();

            _ = app.UseAuthentication();

            _ = app.UseAuthorization();

            _ = app.UseCors("CorsPolicy");

            _ = app.UseMiddleware<ExceptionMiddleWare>();
            return app;
        }
    }
}