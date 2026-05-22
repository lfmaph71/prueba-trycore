namespace EVM.API.Models.DTOs;

public class UpdateActivityDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Bac { get; set; }
    public decimal PlannedPercent { get; set; }
    public decimal ActualPercent { get; set; }
    public decimal ActualCost { get; set; }
}