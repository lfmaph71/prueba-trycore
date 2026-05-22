using System.Net;
using System.Net.Http.Json;
using EVM.API.Models.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace EVM.Tests.Integration;

public class ProjectsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProjectsControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAllProjects_ReturnsOkResponse()
    {
        // Act
        var response = await _client.GetAsync("/api/projects");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var projects = await response.Content.ReadFromJsonAsync<List<ProjectDto>>();
        Assert.NotNull(projects);
        Assert.IsType<List<ProjectDto>>(projects);
    }

    [Fact]
    public async Task CreateProject_WithValidData_ReturnsCreatedProject()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Test Project Integration",
            Description = "Project created during integration test"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects", newProject);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var createdProject = await response.Content.ReadFromJsonAsync<ProjectDto>();
        Assert.NotNull(createdProject);
        Assert.Equal(newProject.Name, createdProject!.Name);
        Assert.Equal(newProject.Description, createdProject.Description);
        Assert.True(createdProject.Id > 0);
        Assert.NotNull(createdProject.EvmSummary);
    }

    [Fact]
    public async Task GetProjectById_WithExistingId_ReturnsProject()
    {
        // Arrange - Create a project first
        var newProject = new CreateProjectDto
        {
            Name = "Project For GetById Test",
            Description = "Test description"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var createdProject = await createResponse.Content.ReadFromJsonAsync<ProjectDto>();

        // Act
        var response = await _client.GetAsync($"/api/projects/{createdProject!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var project = await response.Content.ReadFromJsonAsync<ProjectDto>();
        Assert.NotNull(project);
        Assert.Equal(createdProject.Id, project!.Id);
        Assert.Equal(createdProject.Name, project.Name);
    }

    [Fact]
    public async Task GetProjectById_WithNonExistingId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/projects/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProject_WithValidData_ReturnsUpdatedProject()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Project To Update",
            Description = "Original description"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var createdProject = await createResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var updateDto = new UpdateProjectDto
        {
            Name = "Updated Project Name",
            Description = "Updated description"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/projects/{createdProject!.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updatedProject = await response.Content.ReadFromJsonAsync<ProjectDto>();
        Assert.NotNull(updatedProject);
        Assert.Equal(updateDto.Name, updatedProject!.Name);
        Assert.Equal(updateDto.Description, updatedProject.Description);
    }

    [Fact]
    public async Task DeleteProject_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Project To Delete",
            Description = "Will be deleted"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var createdProject = await createResponse.Content.ReadFromJsonAsync<ProjectDto>();

        // Act
        var response = await _client.DeleteAsync($"/api/projects/{createdProject!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task CreateProject_WithEmptyName_ReturnsBadRequest()
    {
        // This test validates the contract response for validation errors
        var invalidProject = new CreateProjectDto
        {
            Name = "",
            Description = null
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects", invalidProject);

        // Assert - Should return 400 Bad Request due to FluentValidation
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}