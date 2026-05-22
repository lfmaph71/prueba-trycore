using EVM.API.Services;
using EVM.API.Services.Interfaces;

namespace EVM.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IEvmCalculationService, EvmCalculationService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IActivityService, ActivityService>();

        return services;
    }
}