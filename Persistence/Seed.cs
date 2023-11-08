using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public static class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            List<AppUser> users = new()
            {
                new() {DisplayName = "Test User", UserName = "ax001", Email = "ax001@ax.com"},
                new() {DisplayName = "Mahesvara", UserName = "Tatsuya", Email = "ax002@ax.com"},
                new() {DisplayName = "Emiya", UserName = "Shiro", Email = "ax003@ax.com"},
            };
            if (!userManager.Users.Any())
            {
                foreach (AppUser user in users)
                {
                    _ = await userManager.CreateAsync(user, "Passw0rd");
                }
            }

            List<string> AvailabelCity = new() { "London", "NewYork", "California", "WashingtonDC", "HoChiMinh", "Paris", "Tokyo", "Kyoto" };
            List<string> AvailabelActivities = new() { "eat", "drinks", "play games", "take photos", "fuck", "shopping", "rest", "go somewhere" };
            List<string> AvailabelLocation = new() { "Pub", "Bar", "Restaurant", "Gaming House", "Pagoda", "Shopping center", "House", "Downtown" };
            Dictionary<int, string> AvailabelCityDictionary = new();
            Dictionary<int, string> AvailabelActivitiesDictionary = new();
            Dictionary<int, string> AvailabelLocationDictionary = new();
            for (int i = 0; i < AvailabelActivities.Count; i++)
            {
                _ = AvailabelActivitiesDictionary.TryAdd(i, AvailabelActivities[i]);
                _ = AvailabelCityDictionary.TryAdd(i, AvailabelCity[i]);
                _ = AvailabelLocationDictionary.TryAdd(i, AvailabelLocation[i]);
            }

            if (context.Activities.Any())
            {
                return;
            }

            for (int i = 0; i < 20; i++)
            {
                Random random = new();
                DateTime randomDate = DateTime.Now.AddMonths(random.Next(-10, 0));
                int dateSubtract = (int)(DateTime.Now.Subtract(randomDate).TotalDays / 30);
                Activity activity = new()
                {
                    Title = $"Past Activity {i}",
                    Date = randomDate.ToString("yyyyMMdd"),
                    Category = AvailabelActivitiesDictionary.GetValueOrDefault(random.Next(0, 8)),
                    City = AvailabelCityDictionary.GetValueOrDefault(random.Next(0, 8)),
                    Id = Guid.NewGuid(),
                    Venue = AvailabelLocationDictionary.GetValueOrDefault(random.Next(0, 8)),
                    Description = dateSubtract > 0 ? $"Activity {(int)DateTime.Now.Subtract(randomDate).TotalDays / 30} months ago" : "Recently",
                    Attendees = new List<ActivityAttendee>
                    {
                        new() {
                            AppUser = users[random.Next(0, users.Count - 1)],
                            IsHost = true
                        }
                    }
                };

                _ = await context.Activities.AddAsync(activity);
            }
            _ = await context.SaveChangesAsync();
        }
    }
}