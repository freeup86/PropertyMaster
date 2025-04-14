using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PropertyMaster.PropertyManagement.API;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using PropertyMaster.PropertyManagement.API.Services.Implementations;
using PropertyMaster.PropertyManagement.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PropertyMaster.Models.Entities;
using System;
using PropertyMaster.PropertyManagement.API.Services.BackgroundServices;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Entity Framework
builder.Services.AddDbContext<PropertyMasterApiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    // Configure password settings, lockout, etc., as needed
    options.SignIn.RequireConfirmedAccount = false; // Set true if you implement email confirmation later
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<PropertyMasterApiContext>() // Tell Identity to use your DbContext
.AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        
        // Add role validation
        RoleClaimType = ClaimTypes.Role
    };
});

// Configure authorization roles
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole(UserRole.Admin.ToString()));
    
    options.AddPolicy("OwnerOrAdmin", policy => 
        policy.RequireRole(UserRole.Owner.ToString(), UserRole.Admin.ToString()));
    
    options.AddPolicy("PropertyManagerAccess", policy => 
        policy.RequireRole(
            UserRole.PropertyManager.ToString(), 
            UserRole.Admin.ToString(), 
            UserRole.Owner.ToString()));
    
    options.AddPolicy("TenantAccess", policy => 
        policy.RequireRole(
            UserRole.Tenant.ToString(), 
            UserRole.PropertyManager.ToString(), 
            UserRole.Admin.ToString(), 
            UserRole.Owner.ToString()));
});

// Register services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IUnitService, UnitService>();
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<IFinancialService, FinancialService>();
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHostedService<NotificationBackgroundService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHostedService<NotificationBackgroundService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Property Master API", Version = "v1" });
});

var app = builder.Build();

// Seed data
//app.SeedData();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowReactApp");

// Comment out HTTPS redirection for development
// app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();