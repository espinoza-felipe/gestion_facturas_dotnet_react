using GestionFacturas.Application.Interfaces;
using GestionFacturas.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace GestionFacturas.Infrastructure.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        return services;
    }
}
