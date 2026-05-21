using EVM.API.Data;
using EVM.API.Models.DTOs;
using EVM.API.Models.Entities;
using EVM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EVM.API.Services;

public class ActivityService : IActivityService
{
    private readonly AppDbContext _context;
    private readonly IEvmCalculationService _evmCalculationService;

    public ActivityService(AppDbContext context, IEvmCalculationService evmCalculationService)
    {
        _context = context;
        _evmCalculationService = evmCalculationService;
    }

    public async Task<List<ActivityDto>> GetByProjectIdAsync(int projectId)
    {
        var activities = await _context.Activities
            .Where(a => a.ProjectId == projectId)
            .OrderBy(a => a.Name)
            .ToListAsync();

        return activities.Select(MapToDto).ToList();
    }

    public async Task<ActivityDto?> GetByIdAsync(int id)
    {
        var activity = await _context.Activities.FindAsync(id);

        return activity == null ? null : MapToDto(activity);
    }

    public async Task<ActivityDto> CreateAsync(int projectId, CreateActivityDto dto)
    {
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with id {projectId} not found.");
        }

        var activity = new Activity
        {
            ProjectId = projectId,
            Name = dto.Name,
            Bac = dto.Bac,
            PlannedPercent = dto.PlannedPercent,
            ActualPercent = dto.ActualPercent,
            ActualCost = dto.ActualCost,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();

        return MapToDto(activity);
    }

    public async Task<ActivityDto?> UpdateAsync(int id, UpdateActivityDto dto)
    {
        var activity = await _context.Activities.FindAsync(id);

        if (activity == null)
        {
            return null;
        }

        activity.Name = dto.Name;
        activity.Bac = dto.Bac;
        activity.PlannedPercent = dto.PlannedPercent;
        activity.ActualPercent = dto.ActualPercent;
        activity.ActualCost = dto.ActualCost;
        activity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(activity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var activity = await _context.Activities.FindAsync(id);

        if (activity == null)
        {
            return false;
        }

        _context.Activities.Remove(activity);
        await _context.SaveChangesAsync();

        return true;
    }

    private ActivityDto MapToDto(Activity activity)
    {
        var indicators = _evmCalculationService.Calculate(
            activity.Bac,
            activity.PlannedPercent,
            activity.ActualPercent,
            activity.ActualCost);

        return new ActivityDto
        {
            Id = activity.Id,
            ProjectId = activity.ProjectId,
            Name = activity.Name,
            Bac = activity.Bac,
            PlannedPercent = activity.PlannedPercent,
            ActualPercent = activity.ActualPercent,
            ActualCost = activity.ActualCost,
            CreatedAt = activity.CreatedAt,
            UpdatedAt = activity.UpdatedAt,
            Indicators = indicators
        };
    }
}