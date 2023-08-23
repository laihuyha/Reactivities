using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Persistence
{
    public static class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            List<string> AvailabelCity = new() { "London", "NewYork", "California", "WashingtonDC", "HoChiMinh", "Paris", "Tokyo", "Kyoto" };
            List<string> AvailabelActivities = new() { "eat", "drinks", "play games", "take photos", "fuck", "shopping", "rest", "go somewhere" };
            List<string> AvailabelLocation = new() { "Pub", "Bar", "Restaurant", "Gaming House", "Pagoda", "Shopping center", "House", "Downtown" };
            Dictionary<int, string> AvailabelCityDictionary = new();
            Dictionary<int, string> AvailabelActivitiesDictionary = new();
            Dictionary<int, string> AvailabelLocationDictionary = new();
            for (var i = 0; i < AvailabelActivities.Count; i++)
            {
                _ = AvailabelActivitiesDictionary.TryAdd(i, AvailabelActivities[i]);
                _ = AvailabelCityDictionary.TryAdd(i, AvailabelCity[i]);
                _ = AvailabelLocationDictionary.TryAdd(i, AvailabelLocation[i]);
            }

            if (context.Activities.Any()) return;

            for (var i = 0; i < 20; i++)
            {
                var random = new Random();
                var randomDate = DateTime.Now.AddMonths(random.Next(-10, 0));
                var dateSubtract = (int)(DateTime.Now.Subtract(randomDate).TotalDays / 30);
                var activity = new Activity
                {
                    Title = $"Past Activity {i}",
                    Date = randomDate.ToString("yyyyMMdd"),
                    Category = AvailabelActivitiesDictionary.GetValueOrDefault(random.Next(0, 8)),
                    City = AvailabelCityDictionary.GetValueOrDefault(random.Next(0, 8)),
                    Id = Guid.NewGuid(),
                    Venue = AvailabelLocationDictionary.GetValueOrDefault(random.Next(0, 8)),
                    Description = dateSubtract > 0 ? $"Activity {(int)DateTime.Now.Subtract(randomDate).TotalDays / 30} months ago" : "Recently"
                };

                _ = await context.Activities.AddAsync(activity);
            }
            _ = await context.SaveChangesAsync();
        }
    }
}