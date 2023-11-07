using System;
using System.Collections.Generic;

namespace Application.Activities.DTO
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public string HostUserName { get; set; }
        public ICollection<Profile.Profile> Attendees { get; set; }
    }
}