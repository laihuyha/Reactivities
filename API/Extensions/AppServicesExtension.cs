using Application.Activities;
using Application.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace API.Extensions
{
    public static class AppServicesExtension
    {
        public static IServiceCollection AddAppServicesExtension(this IServiceCollection services, IConfiguration config)
        {
            // Add services to the container.

            _ = services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            _ = services.AddEndpointsApiExplorer();
            _ = services.AddSwaggerGen();
            _ = services.AddDbContext<DataContext>(options => options.UseSqlite(config.GetConnectionString("DefaultConnection")));

            _ = services.AddCors(opt => opt.AddPolicy("CorsPolicy", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

            _ = services.AddMediatR(typeof(List.Handler).Assembly);
            _ = services.AddAutoMapper(typeof(MappingProfile));
            _ = services.AddFluentValidationAutoValidation();
            _ = services.AddValidatorsFromAssemblyContaining<Create>();
            return services;
        }
    }
}