using System.Text;
using API.Services;
using Domain.Entities;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            _ = services.AddIdentityCore<AppUser>(options => { options.Password.RequireNonAlphanumeric = false; options.User.RequireUniqueEmail = true; }).AddEntityFrameworkStores<DataContext>();
            _ = services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["SecurityKey"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            _ = services.AddAuthorization(opt => opt.AddPolicy("IsHost", policy => policy.Requirements.Add(new IsHostRequirement())));
            _ = services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            _ = services.AddScoped<TokenService>();
            return services;
        }
    }
}