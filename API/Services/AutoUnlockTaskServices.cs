using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Persistence.Sevices
{
    /// <summary>
    /// Background Services using Timer as setTimeout for Unlock Task.
    /// <br/>
    /// Make sure that server is turned on before the time that is set by dev (23:59:00)
    /// <br/>
    /// If the server is turned on after that time, the task will be done on the next day not that day.
    /// </summary>
    public class AutoUnlockTaskServices : IHostedService, IDisposable
    {
        private Timer _timerMidnight;
        private readonly IServiceProvider _serviceProvider;

        public AutoUnlockTaskServices(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Schedule the task to run initially and repeat every day at 9:00 AM
            DateTime scheduledTime = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 0); // Example: Today at 23:59 PM
            TimeSpan timeUntilScheduled = scheduledTime - DateTime.Now;
            if (timeUntilScheduled.TotalMilliseconds < 0)
            {
                scheduledTime = scheduledTime.AddDays(1); // If scheduled time has already passed today, move it to the next day
                timeUntilScheduled = scheduledTime - DateTime.Now;
            }

            _timerMidnight = new Timer(ExecuteTask, null, timeUntilScheduled, TimeSpan.FromDays(1));

            return Task.CompletedTask;
        }

        private async void ExecuteTask(object state)
        {
            using var scope = _serviceProvider.CreateScope();
            IMediator mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
            DataContext context = scope.ServiceProvider.GetRequiredService<DataContext>();

            var a = await context.Activities.AsNoTracking().ToListAsync();
            try
            {
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error Message: {0}", ex.Message);
                Console.WriteLine($"Error Inner Message: {0}", ex.InnerException?.Message);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _ = (_timerMidnight?.Change(Timeout.Infinite, 0));
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timerMidnight?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}