namespace Application.Core
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            _ = CreateMap<Domain.Entities.Activity, Domain.Entities.Activity>();
        }
    }
}