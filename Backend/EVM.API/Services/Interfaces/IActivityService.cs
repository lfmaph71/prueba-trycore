using EVM.API.Models.DTOs;

namespace EVM.API.Services.Interfaces;

public interface IActivityService
{
    Task<List<ActivityDto>> GetByProjectIdAsync(int projectId);
    Task<ActivityDto?> GetByIdAsync(int id);
    Task<ActivityDto> CreateAsync(int projectId, CreateActivityDto dto);
    Task<ActivityDto?> UpdateAsync(int id, UpdateActivityDto dto);
    Task<bool> DeleteAsync(int id);
}