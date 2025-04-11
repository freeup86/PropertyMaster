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

            // Tenant mappings
            CreateMap<Tenant, TenantDto>()
                .ForMember(dest => dest.UnitNumber, opt => opt.MapFrom(src => src.Unit != null ? src.Unit.UnitNumber : null))
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.Unit != null ? src.Unit.PropertyId : Guid.Empty))
                .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Unit != null && src.Unit.Property != null ? src.Unit.Property.Name : null));
            CreateMap<CreateTenantDto, Tenant>();
            CreateMap<UpdateTenantDto, Tenant>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Transaction mappings
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property != null ? src.Property.Name : null))
                .ForMember(dest => dest.UnitNumber, opt => opt.MapFrom(src => src.Unit != null ? src.Unit.UnitNumber : null))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.CategoryType, opt => opt.MapFrom(src => src.Category != null ? src.Category.Type : null));
                //.ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account != null ? src.Account.Name : null));
            CreateMap<CreateTransactionDto, Transaction>();
            CreateMap<UpdateTransactionDto, Transaction>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Add the Document mapping
            CreateMap<Document, DocumentDto>()
                .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property != null ? src.Property.Name : null))
                .ForMember(dest => dest.UnitNumber, opt => opt.MapFrom(src => src.Unit != null ? src.Unit.UnitNumber : null))
                .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => src.Tenant != null ? $"{src.Tenant.FirstName} {src.Tenant.LastName}" : null))
                .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => src.CreatedDate));

            // Maintenance Request mapping
            CreateMap<MaintenanceRequest, MaintenanceRequestDto>()
                  .ForMember(dest => dest.UnitNumber, opt => opt.MapFrom(src => src.Unit.UnitNumber))
                  .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => $"{src.Tenant.FirstName} {src.Tenant.LastName}"))
                  .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property.Name))
                  .ReverseMap();
              CreateMap<CreateMaintenanceRequestDto, MaintenanceRequest>();
              CreateMap<UpdateMaintenanceRequestDto, MaintenanceRequest>();
        }
    }
}