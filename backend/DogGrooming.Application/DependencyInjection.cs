using DogGrooming.Application.Interfaces.Services;
using DogGrooming.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DogGrooming.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<IHaircutTypeService, HaircutTypeService>();
        return services;
    }
}
