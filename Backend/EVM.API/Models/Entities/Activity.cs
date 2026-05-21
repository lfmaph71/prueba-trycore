namespace EVM.API.Models.Entities;

public class Activity
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Bac { get; set; }
    public decimal PlannedPercent { get; set; }
    public decimal ActualPercent { get; set; }
    public decimal ActualCost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Project Project { get; set; } = null!;
}