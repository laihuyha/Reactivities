using AutoMapper;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            _ = CreateMap<Domain.Entities.Activity, Domain.Entities.Activity>();
        }
    }
}