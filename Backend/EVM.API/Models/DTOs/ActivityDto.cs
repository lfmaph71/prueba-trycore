namespace EVM.API.Models.DTOs;

public class ActivityDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Bac { get; set; }
    public decimal PlannedPercent { get; set; }
    public decimal ActualPercent { get; set; }
    public decimal ActualCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public EvmIndicatorsDto Indicators { get; set; } = null!;
}