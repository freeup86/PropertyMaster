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
using PropertyMaster.PropertyManagement.API;
using System;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;
using PropertyMaster.PropertyManagement.API.Services.Implementations;
using PropertyMaster.PropertyManagement.API.Services.BackgroundServices;

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
    options.SaveToken = true; // Save token in AuthenticationProperties (useful sometimes)
    options.RequireHttpsMetadata = false; // Set true in production (requires HTTPS)
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true, // Validate the server that generated the token (Issuer)
        ValidateAudience = true, // Validate the recipient of the token is authorized (Audience)
        ValidateLifetime = true, // Check if the token is expired
        ValidateIssuerSigningKey = true, // Validate the signature of the token
        ValidAudience = builder.Configuration["Jwt:Audience"], // Get Audience from appsettings.json
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Get Issuer from appsettings.json
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Get Secret Key from appsettings.json
    };
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