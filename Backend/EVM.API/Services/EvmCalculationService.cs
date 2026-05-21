using EVM.API.Models.DTOs;
using EVM.API.Models.Enums;
using EVM.API.Services.Interfaces;

namespace EVM.API.Services;

public class EvmCalculationService : IEvmCalculationService
{
    private const decimal MaxCpiValue = 1000000m;

    public EvmIndicatorsDto Calculate(decimal bac, decimal plannedPercent, decimal actualPercent, decimal actualCost)
    {
        decimal plannedValue = CalculatePlannedValue(bac, plannedPercent);
        decimal earnedValue = CalculateEarnedValue(bac, actualPercent);
        decimal costVariance = CalculateCostVariance(earnedValue, actualCost);
        decimal scheduleVariance = CalculateScheduleVariance(earnedValue, plannedValue);
        decimal costPerformanceIndex = CalculateCostPerformanceIndex(earnedValue, actualCost);
        decimal schedulePerformanceIndex = CalculateSchedulePerformanceIndex(earnedValue, plannedValue);
        decimal estimateAtCompletion = CalculateEstimateAtCompletion(bac, costPerformanceIndex);
        decimal varianceAtCompletion = CalculateVarianceAtCompletion(bac, estimateAtCompletion);
        string cpiInterpretation = InterpretCpi(costPerformanceIndex);
        string spiInterpretation = InterpretSpi(schedulePerformanceIndex);

        return new EvmIndicatorsDto
        {
            PlannedValue = Math.Round(plannedValue, 2),
            EarnedValue = Math.Round(earnedValue, 2),
            ActualCost = Math.Round(actualCost, 2),
            CostVariance = Math.Round(costVariance, 2),
            ScheduleVariance = Math.Round(scheduleVariance, 2),
            CostPerformanceIndex = Math.Round(costPerformanceIndex, 2),
            SchedulePerformanceIndex = Math.Round(schedulePerformanceIndex, 2),
            EstimateAtCompletion = Math.Round(estimateAtCompletion, 2),
            VarianceAtCompletion = Math.Round(varianceAtCompletion, 2),
            CpiInterpretation = cpiInterpretation,
            SpiInterpretation = spiInterpretation
        };
    }

    public EvmIndicatorsDto CalculateConsolidated(List<EvmIndicatorsDto> activityIndicators)
    {
        if (activityIndicators == null || activityIndicators.Count == 0)
        {
            return new EvmIndicatorsDto
            {
                PlannedValue = 0,
                EarnedValue = 0,
                ActualCost = 0,
                CostVariance = 0,
                ScheduleVariance = 0,
                CostPerformanceIndex = 1,
                SchedulePerformanceIndex = 1,
                EstimateAtCompletion = 0,
                VarianceAtCompletion = 0,
                CpiInterpretation = InterpretCpi(1),
                SpiInterpretation = InterpretSpi(1)
            };
        }

        decimal totalPv = activityIndicators.Sum(i => i.PlannedValue);
        decimal totalEv = activityIndicators.Sum(i => i.EarnedValue);
        decimal totalAc = activityIndicators.Sum(i => i.ActualCost);
        decimal totalBac = activityIndicators.Sum(i => i.PlannedValue + (i.EarnedValue - i.PlannedValue));

        decimal costVariance = CalculateCostVariance(totalEv, totalAc);
        decimal scheduleVariance = CalculateScheduleVariance(totalEv, totalPv);
        decimal costPerformanceIndex = CalculateCostPerformanceIndex(totalEv, totalAc);
        decimal schedulePerformanceIndex = CalculateSchedulePerformanceIndex(totalEv, totalPv);
        decimal estimateAtCompletion = CalculateEstimateAtCompletion(totalBac, costPerformanceIndex);
        decimal varianceAtCompletion = CalculateVarianceAtCompletion(totalBac, estimateAtCompletion);

        return new EvmIndicatorsDto
        {
            PlannedValue = Math.Round(totalPv, 2),
            EarnedValue = Math.Round(totalEv, 2),
            ActualCost = Math.Round(totalAc, 2),
            CostVariance = Math.Round(costVariance, 2),
            ScheduleVariance = Math.Round(scheduleVariance, 2),
            CostPerformanceIndex = Math.Round(costPerformanceIndex, 2),
            SchedulePerformanceIndex = Math.Round(schedulePerformanceIndex, 2),
            EstimateAtCompletion = Math.Round(estimateAtCompletion, 2),
            VarianceAtCompletion = Math.Round(varianceAtCompletion, 2),
            CpiInterpretation = InterpretCpi(costPerformanceIndex),
            SpiInterpretation = InterpretSpi(schedulePerformanceIndex)
        };
    }

    private static decimal CalculatePlannedValue(decimal bac, decimal plannedPercent)
    {
        return (plannedPercent / 100m) * bac;
    }

    private static decimal CalculateEarnedValue(decimal bac, decimal actualPercent)
    {
        return (actualPercent / 100m) * bac;
    }

    private static decimal CalculateCostVariance(decimal earnedValue, decimal actualCost)
    {
        return earnedValue - actualCost;
    }

    private static decimal CalculateScheduleVariance(decimal earnedValue, decimal plannedValue)
    {
        return earnedValue - plannedValue;
    }

    private static decimal CalculateCostPerformanceIndex(decimal earnedValue, decimal actualCost)
    {
        if (actualCost == 0m)
        {
            return earnedValue == 0m ? 1m : MaxCpiValue;
        }

        return earnedValue / actualCost;
    }

    private static decimal CalculateSchedulePerformanceIndex(decimal earnedValue, decimal plannedValue)
    {
        if (plannedValue == 0m)
        {
            return earnedValue == 0m ? 1m : MaxCpiValue;
        }

        return earnedValue / plannedValue;
    }

    private static decimal CalculateEstimateAtCompletion(decimal bac, decimal cpi)
    {
        if (cpi == 0m)
        {
            return bac;
        }

        if (cpi >= MaxCpiValue)
        {
            return 0m;
        }

        return bac / cpi;
    }

    private static decimal CalculateVarianceAtCompletion(decimal bac, decimal eac)
    {
        return bac - eac;
    }

    private static string InterpretCpi(decimal cpi)
    {
        if (cpi >= 1m)
        {
            return cpi == 1m ? EvmInterpretation.OnBudget : EvmInterpretation.UnderBudget;
        }

        return EvmInterpretation.OverBudget;
    }

    private static string InterpretSpi(decimal spi)
    {
        if (spi >= 1m)
        {
            return spi == 1m ? EvmInterpretation.OnSchedule : EvmInterpretation.AheadSchedule;
        }

        return EvmInterpretation.BehindSchedule;
    }
}