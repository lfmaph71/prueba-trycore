namespace EVM.API.Models.DTOs;

public class EvmIndicatorsDto
{
    public decimal PlannedValue { get; set; }
    public decimal EarnedValue { get; set; }
    public decimal ActualCost { get; set; }
    public decimal CostVariance { get; set; }
    public decimal ScheduleVariance { get; set; }
    public decimal CostPerformanceIndex { get; set; }
    public decimal SchedulePerformanceIndex { get; set; }
    public decimal EstimateAtCompletion { get; set; }
    public decimal VarianceAtCompletion { get; set; }
    public string CpiInterpretation { get; set; } = string.Empty;
    public string SpiInterpretation { get; set; } = string.Empty;
}