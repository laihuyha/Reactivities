using AutoMapper;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Entities.Activity, Domain.Entities.Activity>();
        }
    }
}