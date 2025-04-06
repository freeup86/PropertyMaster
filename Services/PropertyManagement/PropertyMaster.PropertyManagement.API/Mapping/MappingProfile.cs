using AutoMapper;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;

namespace PropertyMaster.PropertyManagement.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Property mappings
            CreateMap<Property, PropertyDto>()
                .ForMember(dest => dest.UnitCount, opt => opt.MapFrom(src => src.Units != null ? src.Units.Count : 0));
            CreateMap<CreatePropertyDto, Property>();
            CreateMap<UpdatePropertyDto, Property>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Unit mappings
            CreateMap<Unit, UnitDto>()
                .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property != null ? src.Property.Name : null));
            CreateMap<CreateUnitDto, Unit>();
            CreateMap<UpdateUnitDto, Unit>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}