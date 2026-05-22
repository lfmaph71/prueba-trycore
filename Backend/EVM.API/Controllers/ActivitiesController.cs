using EVM.API.Models.DTOs;
using EVM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EVM.API.Controllers;

[ApiController]
[Route("api/projects/{projectId}/activities")]
[Produces("application/json")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    /// <summary>
    /// Retrieves all activities for a project, each with its EVM indicators.
    /// </summary>
    /// <param name="projectId">The project ID.</param>
    /// <response code="200">Returns the list of activities with EVM indicators.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<ActivityDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ActivityDto>>> GetByProjectId(int projectId)
    {
        var activities = await _activityService.GetByProjectIdAsync(projectId);
        return Ok(activities);
    }

    /// <summary>
    /// Retrieves a specific activity with its EVM indicators.
    /// </summary>
    /// <param name="id">The activity ID.</param>
    /// <response code="200">Returns the activity with EVM indicators.</response>
    /// <response code="404">Activity not found.</response>
    [HttpGet("/api/activities/{id}")]
    [ProducesResponseType(typeof(ActivityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ActivityDto>> GetById(int id)
    {
        var activity = await _activityService.GetByIdAsync(id);

        if (activity == null)
        {
            return NotFound(new { message = $"Activity with id {id} not found." });
        }

        return Ok(activity);
    }

    /// <summary>
    /// Creates a new activity for a project.
    /// </summary>
    /// <param name="projectId">The project ID.</param>
    /// <param name="dto">Activity creation data.</param>
    /// <response code="201">Activity created successfully.</response>
    /// <response code="400">Invalid activity data.</response>
    /// <response code="404">Project not found.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ActivityDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ActivityDto>> Create(int projectId, [FromBody] CreateActivityDto dto)
    {
        try
        {
            var activity = await _activityService.CreateAsync(projectId, dto);
            return CreatedAtAction(nameof(GetById), new { id = activity.Id }, activity);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing activity.
    /// </summary>
    /// <param name="id">The activity ID.</param>
    /// <param name="dto">Activity update data.</param>
    /// <response code="200">Activity updated successfully.</response>
    /// <response code="404">Activity not found.</response>
    [HttpPut("/api/activities/{id}")]
    [ProducesResponseType(typeof(ActivityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ActivityDto>> Update(int id, [FromBody] UpdateActivityDto dto)
    {
        var activity = await _activityService.UpdateAsync(id, dto);

        if (activity == null)
        {
            return NotFound(new { message = $"Activity with id {id} not found." });
        }

        return Ok(activity);
    }

    /// <summary>
    /// Deletes an activity.
    /// </summary>
    /// <param name="id">The activity ID.</param>
    /// <response code="204">Activity deleted successfully.</response>
    /// <response code="404">Activity not found.</response>
    [HttpDelete("/api/activities/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _activityService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = $"Activity with id {id} not found." });
        }

        return NoContent();
    }
}