using EVM.API.Models.DTOs;
using EVM.API.Services;
using EVM.Tests.TestHelpers;
using Xunit;

namespace EVM.Tests.Services;

public class EvmCalculationServiceTests
{
    private readonly EvmCalculationService _service;

    public EvmCalculationServiceTests()
    {
        _service = new EvmCalculationService();
    }

    // =========================================================
    // STANDARD CALCULATION TESTS
    // =========================================================

    [Fact]
    public void Calculate_WithTypicalValues_ReturnsCorrectIndicators()
    {
        // Arrange
        decimal bac = 100000m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 40m;
        decimal actualCost = 45000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert - PV = 50% * 100000 = 50000
        Assert.Equal(50000m, result.PlannedValue);

        // EV = 40% * 100000 = 40000
        Assert.Equal(40000m, result.EarnedValue);

        // AC = 45000
        Assert.Equal(45000m, result.ActualCost);

        // CV = 40000 - 45000 = -5000
        Assert.Equal(-5000m, result.CostVariance);

        // SV = 40000 - 50000 = -10000
        Assert.Equal(-10000m, result.ScheduleVariance);

        // CPI = 40000 / 45000 = 0.89
        Assert.Equal(0.89m, result.CostPerformanceIndex);

        // SPI = 40000 / 50000 = 0.80
        Assert.Equal(0.80m, result.SchedulePerformanceIndex);

        // EAC = 100000 / (40000/45000) = 112500 (without intermediate rounding)
        Assert.Equal(112500m, result.EstimateAtCompletion);

        // VAC = 100000 - 112500 = -12500
        Assert.Equal(-12500m, result.VarianceAtCompletion);

        // Interpretations
        Assert.Equal("Sobre presupuesto", result.CpiInterpretation);
        Assert.Equal("Atrasado", result.SpiInterpretation);
    }

    [Fact]
    public void Calculate_WithProjectOnBudgetAndOnSchedule_ReturnsExpectedValues()
    {
        // Arrange - Project is exactly on track: 50% planned, 50% completed, cost = 50% of BAC
        decimal bac = 100000m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 50m;
        decimal actualCost = 50000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(50000m, result.PlannedValue);
        Assert.Equal(50000m, result.EarnedValue);
        Assert.Equal(50000m, result.ActualCost);
        Assert.Equal(0m, result.CostVariance);
        Assert.Equal(0m, result.ScheduleVariance);
        Assert.Equal(1m, result.CostPerformanceIndex);
        Assert.Equal(1m, result.SchedulePerformanceIndex);
        Assert.Equal(100000m, result.EstimateAtCompletion);
        Assert.Equal(0m, result.VarianceAtCompletion);
        Assert.Equal("En presupuesto", result.CpiInterpretation);
        Assert.Equal("En cronograma", result.SpiInterpretation);
    }

    [Fact]
    public void Calculate_WithProjectUnderBudget_ReturnsCorrectInterpretation()
    {
        // Arrange - Project cost less than planned: EV > AC
        decimal bac = 100000m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 50m;
        decimal actualCost = 40000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.True(result.CostPerformanceIndex > 1m);
        Assert.Equal("Bajo presupuesto", result.CpiInterpretation);
    }

    [Fact]
    public void Calculate_WithProjectAheadOfSchedule_ReturnsCorrectInterpretation()
    {
        // Arrange - Project ahead: EV > PV
        decimal bac = 100000m;
        decimal plannedPercent = 30m;
        decimal actualPercent = 50m;
        decimal actualCost = 45000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.True(result.SchedulePerformanceIndex > 1m);
        Assert.Equal("Adelantado", result.SpiInterpretation);
    }

    // =========================================================
    // EDGE CASES
    // =========================================================

    [Fact]
    public void Calculate_WhenActualCostIsZeroAndProgressIsZero_ReturnsCpiEqualToOne()
    {
        // Arrange - AC = 0 and EV = 0 (no work done, no money spent)
        decimal bac = 100000m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 0m;
        decimal actualCost = 0m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(1m, result.CostPerformanceIndex);
        Assert.Equal("En presupuesto", result.CpiInterpretation);
        Assert.Equal(0m, result.EarnedValue);
    }

    [Fact]
    public void Calculate_WhenActualCostIsZeroAndProgressIsPositive_ReturnsMaxCpi()
    {
        // Arrange - AC = 0 but EV > 0 (work done without spending money - unrealistic but must be handled)
        decimal bac = 100000m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 30m;
        decimal actualCost = 0m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(1000000m, result.CostPerformanceIndex);
        Assert.Equal("Bajo presupuesto", result.CpiInterpretation);
        Assert.Equal(30000m, result.EarnedValue);
    }

    [Fact]
    public void Calculate_WhenPlannedPercentIsZeroAndProgressIsZero_ReturnsSpiEqualToOne()
    {
        // Arrange - PV = 0 and EV = 0 (project just started)
        decimal bac = 100000m;
        decimal plannedPercent = 0m;
        decimal actualPercent = 0m;
        decimal actualCost = 0m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(1m, result.SchedulePerformanceIndex);
        Assert.Equal(1m, result.CostPerformanceIndex);
        Assert.Equal("En cronograma", result.SpiInterpretation);
        Assert.Equal("En presupuesto", result.CpiInterpretation);
    }

    [Fact]
    public void Calculate_WhenPlannedPercentIsZeroAndProgressIsPositive_ReturnsMaxSpi()
    {
        // Arrange - PV = 0 but EV > 0 (work done without planned schedule)
        decimal bac = 100000m;
        decimal plannedPercent = 0m;
        decimal actualPercent = 10m;
        decimal actualCost = 5000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(1000000m, result.SchedulePerformanceIndex);
        Assert.Equal("Adelantado", result.SpiInterpretation);
    }

    [Fact]
    public void Calculate_WhenBacIsZero_ReturnsAllZeros()
    {
        // Arrange - BAC = 0 (no budget allocated)
        decimal bac = 0m;
        decimal plannedPercent = 50m;
        decimal actualPercent = 50m;
        decimal actualCost = 0m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(0m, result.PlannedValue);
        Assert.Equal(0m, result.EarnedValue);
        Assert.Equal(0m, result.ActualCost);
        Assert.Equal(0m, result.CostVariance);
        Assert.Equal(0m, result.ScheduleVariance);
        Assert.Equal(0m, result.EstimateAtCompletion);
        Assert.Equal(0m, result.VarianceAtCompletion);
    }

    [Fact]
    public void Calculate_WhenProjectIsComplete_ReturnsFullValues()
    {
        // Arrange - 100% complete
        decimal bac = 50000m;
        decimal plannedPercent = 100m;
        decimal actualPercent = 100m;
        decimal actualCost = 48000m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert
        Assert.Equal(50000m, result.PlannedValue);
        Assert.Equal(50000m, result.EarnedValue);
        Assert.Equal(2000m, result.CostVariance);
        Assert.Equal(0m, result.ScheduleVariance);
        Assert.True(result.CostPerformanceIndex > 1m);
        Assert.Equal(1m, result.SchedulePerformanceIndex);
    }

    [Fact]
    public void Calculate_WithHighPrecisionValues_ReturnsRoundedResults()
    {
        // Arrange - Values that produce decimals
        decimal bac = 99999.99m;
        decimal plannedPercent = 33.33m;
        decimal actualPercent = 66.67m;
        decimal actualCost = 75000.50m;

        // Act
        var result = _service.Calculate(bac, plannedPercent, actualPercent, actualCost);

        // Assert - All values must be rounded to 2 decimal places
        Assert.Equal(2, GetDecimalPlaces(result.PlannedValue));
        Assert.Equal(2, GetDecimalPlaces(result.EarnedValue));
        Assert.Equal(2, GetDecimalPlaces(result.CostVariance));
        Assert.Equal(2, GetDecimalPlaces(result.ScheduleVariance));
        Assert.Equal(2, GetDecimalPlaces(result.EstimateAtCompletion));
        Assert.Equal(2, GetDecimalPlaces(result.VarianceAtCompletion));

        // Verify specific values
        Assert.Equal(33330m, result.PlannedValue);
        Assert.Equal(66669.99m, result.EarnedValue);
    }

    // =========================================================
    // CONSOLIDATED CALCULATION TESTS
    // =========================================================

    [Fact]
    public void CalculateConsolidated_WithEmptyList_ReturnsZeroIndicators()
    {
        // Arrange
        var emptyList = new List<EvmIndicatorsDto>();

        // Act
        var result = _service.CalculateConsolidated(emptyList);

        // Assert
        Assert.Equal(0m, result.PlannedValue);
        Assert.Equal(0m, result.EarnedValue);
        Assert.Equal(0m, result.ActualCost);
        Assert.Equal(0m, result.CostVariance);
        Assert.Equal(0m, result.ScheduleVariance);
        Assert.Equal(1m, result.CostPerformanceIndex);
        Assert.Equal(1m, result.SchedulePerformanceIndex);
        Assert.Equal("En presupuesto", result.CpiInterpretation);
        Assert.Equal("En cronograma", result.SpiInterpretation);
    }

    [Fact]
    public void CalculateConsolidated_WithNullList_ReturnsZeroIndicators()
    {
        // Act
        var result = _service.CalculateConsolidated(null!);

        // Assert
        Assert.Equal(0m, result.PlannedValue);
        Assert.Equal(0m, result.EarnedValue);
        Assert.Equal(0m, result.ActualCost);
        Assert.Equal(1m, result.CostPerformanceIndex);
        Assert.Equal(1m, result.SchedulePerformanceIndex);
    }

    [Fact]
    public void CalculateConsolidated_WithSingleActivity_ReturnsSameAsIndividual()
    {
        // Arrange
        var individual = _service.Calculate(50000m, 60m, 50m, 30000m);
        var activities = new List<EvmIndicatorsDto> { individual };

        // Act
        var result = _service.CalculateConsolidated(activities);

        // Assert
        Assert.Equal(individual.PlannedValue, result.PlannedValue);
        Assert.Equal(individual.EarnedValue, result.EarnedValue);
        Assert.Equal(individual.ActualCost, result.ActualCost);
        Assert.Equal(individual.CostVariance, result.CostVariance);
        Assert.Equal(individual.ScheduleVariance, result.ScheduleVariance);
    }

    [Fact]
    public void CalculateConsolidated_WithMultipleActivities_ReturnsAggregatedValues()
    {
        // Arrange
        var act1 = _service.Calculate(50000m, 100m, 100m, 45000m);  // Completed under budget
        var act2 = _service.Calculate(30000m, 50m, 30m, 20000m);    // Behind and over budget
        var act3 = _service.Calculate(20000m, 0m, 0m, 0m);          // Not started

        var activities = new List<EvmIndicatorsDto> { act1, act2, act3 };

        // Act
        var result = _service.CalculateConsolidated(activities);

        // Assert - Aggregated values
        decimal expectedTotalPv = act1.PlannedValue + act2.PlannedValue + act3.PlannedValue;
        decimal expectedTotalEv = act1.EarnedValue + act2.EarnedValue + act3.EarnedValue;
        decimal expectedTotalAc = act1.ActualCost + act2.ActualCost + act3.ActualCost;

        Assert.Equal(expectedTotalPv, result.PlannedValue);
        Assert.Equal(expectedTotalEv, result.EarnedValue);
        Assert.Equal(expectedTotalAc, result.ActualCost);

        // Consolidated CPI should be between individual CPIs
        decimal expectedCpi = expectedTotalEv / expectedTotalAc;
        Assert.Equal(Math.Round(expectedCpi, 2), result.CostPerformanceIndex);
    }

    [Fact]
    public void CalculateConsolidated_WithAllActivitiesOverBudget_ReturnsOverBudgetInterpretation()
    {
        // Arrange - All activities are over budget
        var act1 = _service.Calculate(50000m, 50m, 40m, 40000m);  // CPI = 0.50
        var act2 = _service.Calculate(30000m, 50m, 30m, 25000m);  // CPI = 0.36

        var activities = new List<EvmIndicatorsDto> { act1, act2 };

        // Act
        var result = _service.CalculateConsolidated(activities);

        // Assert
        Assert.True(result.CostPerformanceIndex < 1m);
        Assert.Equal("Sobre presupuesto", result.CpiInterpretation);
        Assert.True(result.SchedulePerformanceIndex < 1m);
        Assert.Equal("Atrasado", result.SpiInterpretation);
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    private static int GetDecimalPlaces(decimal value)
    {
        return BitConverter.GetBytes(decimal.GetBits(value)[3])[2];
    }
}