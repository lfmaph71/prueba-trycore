using EVM.API.Models.DTOs;

namespace EVM.Tests.TestHelpers;

public static class TestDataFactory
{
    public static EvmIndicatorsDto CreateExpectedIndicators(
        decimal bac, decimal plannedPercent, decimal actualPercent, decimal actualCost)
    {
        const decimal maxCpiValue = 1000000m;

        decimal pv = (plannedPercent / 100m) * bac;
        decimal ev = (actualPercent / 100m) * bac;
        decimal ac = actualCost;

        decimal cv = ev - ac;
        decimal sv = ev - pv;
        decimal cpi = ac == 0m ? (ev == 0m ? 1m : maxCpiValue) : ev / ac;
        decimal spi = pv == 0m ? (ev == 0m ? 1m : maxCpiValue) : ev / pv;
        decimal eac = cpi == 0m ? bac : (cpi >= maxCpiValue ? 0m : bac / cpi);
        decimal vac = bac - eac;

        string cpiInterpretation = cpi >= 1m
            ? (cpi == 1m ? "En presupuesto" : "Bajo presupuesto")
            : "Sobre presupuesto";

        string spiInterpretation = spi >= 1m
            ? (spi == 1m ? "En cronograma" : "Adelantado")
            : "Atrasado";

        return new EvmIndicatorsDto
        {
            PlannedValue = Math.Round(pv, 2),
            EarnedValue = Math.Round(ev, 2),
            ActualCost = Math.Round(ac, 2),
            CostVariance = Math.Round(cv, 2),
            ScheduleVariance = Math.Round(sv, 2),
            CostPerformanceIndex = Math.Round(cpi, 2),
            SchedulePerformanceIndex = Math.Round(spi, 2),
            EstimateAtCompletion = Math.Round(eac, 2),
            VarianceAtCompletion = Math.Round(vac, 2),
            CpiInterpretation = cpiInterpretation,
            SpiInterpretation = spiInterpretation
        };
    }
}