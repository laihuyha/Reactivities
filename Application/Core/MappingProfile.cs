using System.Linq;
using Application.Activities.DTO;
using Domain.Entities;

namespace Application.Core
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            _ = CreateMap<Activity, Activity>();

            _ = CreateMap<Activity, ActivityDto>()
            .ForMember(e => e.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            _ = CreateMap<ActivityAttendee, Profile.Profile>()
            .ForMember(e => e.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(e => e.UserName, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(e => e.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}