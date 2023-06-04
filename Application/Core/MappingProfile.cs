using AutoMapper;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        protected MappingProfile()
        {
            CreateMap<Domain.Activity, Domain.Activity>();
        }
    }
}