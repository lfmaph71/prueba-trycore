using EVM.API.Models.DTOs;

namespace EVM.API.Services.Interfaces;

public interface IEvmCalculationService
{
    EvmIndicatorsDto Calculate(decimal bac, decimal plannedPercent, decimal actualPercent, decimal actualCost);
    EvmIndicatorsDto CalculateConsolidated(List<EvmIndicatorsDto> activityIndicators);
}