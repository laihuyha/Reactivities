using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            List<string> AvailabelCity = new List<string> { "London", "NewYork", "California", "WashingtonDC", "HoChiMinh", "Paris", "Tokyo", "Kyoto" };
            List<string> AvailabelActivities = new List<string> { "eat", "drinks", "play games", "take photos", "fuck", "shopping", "rest", "go somewhere" };
            List<string> AvailabelLocation = new List<string> { "Pub", "Bar", "Restaurant", "Gaming House", "Pagoda", "Shopping center", "House", "Downtown" };
            Dictionary<int, string> AvailabelCityDictionary = new Dictionary<int, string>();
            Dictionary<int, string> AvailabelActivitiesDictionary = new Dictionary<int, string>();
            Dictionary<int, string> AvailabelLocationDictionary = new Dictionary<int, string>();
            for (var i = 0; i < AvailabelActivities.Count; i++)
            {
                AvailabelActivitiesDictionary.TryAdd(i, AvailabelActivities[i]);
                AvailabelCityDictionary.TryAdd(i, AvailabelCity[i]);
                AvailabelLocationDictionary.TryAdd(i, AvailabelLocation[i]);
            }

            if (context.Activities.Any()) return;

            for (var i = 0; i < 20; i++)
            {
                var random = new Random();
                var activity = new Activity
                {
                    Title = $"Past Activity {i}",
                    Date = DateTime.Now.AddMonths(random.Next(-10, 0)),
                    Category = AvailabelActivitiesDictionary.GetValueOrDefault(random.Next(0, 8)),
                    City = AvailabelCityDictionary.GetValueOrDefault(random.Next(0, 8)),
                    Id = Guid.NewGuid(),
                    Venue = AvailabelLocationDictionary.GetValueOrDefault(random.Next(0, 8))
                };
                activity.Description = $"Activity {DateTime.Now.Month - activity.Date.Month} months ago";

                await context.Activities.AddAsync(activity);
            }
            await context.SaveChangesAsync();
        }
    }
}