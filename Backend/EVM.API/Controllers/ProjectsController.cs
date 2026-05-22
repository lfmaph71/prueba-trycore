using EVM.API.Models.DTOs;
using EVM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EVM.API.Controllers;

[ApiController]
[Route("api/projects")]
[Produces("application/json")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <summary>
    /// Retrieves all projects with consolidated EVM indicators.
    /// </summary>
    /// <response code="200">Returns the list of projects.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<ProjectDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ProjectDto>>> GetAll()
    {
        var projects = await _projectService.GetAllAsync();
        return Ok(projects);
    }

    /// <summary>
    /// Retrieves a specific project by its ID, including consolidated EVM indicators.
    /// </summary>
    /// <param name="id">The project ID.</param>
    /// <response code="200">Returns the project with EVM summary.</response>
    /// <response code="404">Project not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDto>> GetById(int id)
    {
        var project = await _projectService.GetByIdAsync(id);

        if (project == null)
        {
            return NotFound(new { message = $"Project with id {id} not found." });
        }

        return Ok(project);
    }

    /// <summary>
    /// Creates a new project.
    /// </summary>
    /// <param name="dto">Project creation data.</param>
    /// <response code="201">Project created successfully.</response>
    /// <response code="400">Invalid project data.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] CreateProjectDto dto)
    {
        var project = await _projectService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    /// <summary>
    /// Updates an existing project.
    /// </summary>
    /// <param name="id">The project ID.</param>
    /// <param name="dto">Project update data.</param>
    /// <response code="200">Project updated successfully.</response>
    /// <response code="404">Project not found.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDto>> Update(int id, [FromBody] UpdateProjectDto dto)
    {
        var project = await _projectService.UpdateAsync(id, dto);

        if (project == null)
        {
            return NotFound(new { message = $"Project with id {id} not found." });
        }

        return Ok(project);
    }

    /// <summary>
    /// Deletes a project and all its activities.
    /// </summary>
    /// <param name="id">The project ID.</param>
    /// <response code="204">Project deleted successfully.</response>
    /// <response code="404">Project not found.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _projectService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = $"Project with id {id} not found." });
        }

        return NoContent();
    }
}