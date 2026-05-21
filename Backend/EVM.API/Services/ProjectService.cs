using EVM.API.Data;
using EVM.API.Models.DTOs;
using EVM.API.Models.Entities;
using EVM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EVM.API.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;
    private readonly IEvmCalculationService _evmCalculationService;

    public ProjectService(AppDbContext context, IEvmCalculationService evmCalculationService)
    {
        _context = context;
        _evmCalculationService = evmCalculationService;
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var projects = await _context.Projects
            .Include(p => p.Activities)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return projects.Select(MapToDto).ToList();
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Activities)
            .FirstOrDefaultAsync(p => p.Id == id);

        return project == null ? null : MapToDto(project);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return MapToDto(project);
    }

    public async Task<ProjectDto?> UpdateAsync(int id, UpdateProjectDto dto)
    {
        var project = await _context.Projects
            .Include(p => p.Activities)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
        {
            return null;
        }

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(project);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project == null)
        {
            return false;
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return true;
    }

    private ProjectDto MapToDto(Project project)
    {
        var activityDtos = project.Activities.Select(a => new ActivityDto
        {
            Id = a.Id,
            ProjectId = a.ProjectId,
            Name = a.Name,
            Bac = a.Bac,
            PlannedPercent = a.PlannedPercent,
            ActualPercent = a.ActualPercent,
            ActualCost = a.ActualCost,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt,
            Indicators = _evmCalculationService.Calculate(a.Bac, a.PlannedPercent, a.ActualPercent, a.ActualCost)
        }).ToList();

        var activityIndicators = activityDtos.Select(a => a.Indicators).ToList();
        var consolidatedIndicators = _evmCalculationService.CalculateConsolidated(activityIndicators);

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            ActivityCount = project.Activities.Count,
            EvmSummary = consolidatedIndicators
        };
    }
}