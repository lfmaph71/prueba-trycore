using System.Net;
using System.Net.Http.Json;
using EVM.API.Models.DTOs;
using Xunit;

namespace EVM.Tests.Integration;

public class ActivitiesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ActivitiesControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateActivity_WithValidData_ReturnsCreatedActivity()
    {
        // Arrange - Create a project first
        var newProject = new CreateProjectDto
        {
            Name = "Project For Activity Test",
            Description = "Testing activities"
        };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var newActivity = new CreateActivityDto
        {
            Name = "Test Activity",
            Bac = 50000m,
            PlannedPercent = 50m,
            ActualPercent = 30m,
            ActualCost = 20000m
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", newActivity);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var createdActivity = await response.Content.ReadFromJsonAsync<ActivityDto>();
        Assert.NotNull(createdActivity);
        Assert.Equal(newActivity.Name, createdActivity!.Name);
        Assert.Equal(newActivity.Bac, createdActivity.Bac);
        Assert.Equal(newActivity.PlannedPercent, createdActivity.PlannedPercent);
        Assert.Equal(newActivity.ActualPercent, createdActivity.ActualPercent);
        Assert.Equal(newActivity.ActualCost, createdActivity.ActualCost);
        Assert.NotNull(createdActivity.Indicators);
        Assert.True(createdActivity.Indicators.PlannedValue > 0);
    }

    [Fact]
    public async Task GetActivitiesByProjectId_ReturnsActivitiesList()
    {
        // Arrange - Create a project with activities
        var newProject = new CreateProjectDto
        {
            Name = "Project With Activities",
            Description = "Has activities"
        };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        // Create two activities
        var activity1 = new CreateActivityDto
        {
            Name = "Activity One",
            Bac = 30000m, PlannedPercent = 100m, ActualPercent = 100m, ActualCost = 28000m
        };
        var activity2 = new CreateActivityDto
        {
            Name = "Activity Two",
            Bac = 20000m, PlannedPercent = 50m, ActualPercent = 40m, ActualCost = 15000m
        };

        await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", activity1);
        await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", activity2);

        // Act
        var response = await _client.GetAsync($"/api/projects/{project.Id}/activities");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var activities = await response.Content.ReadFromJsonAsync<List<ActivityDto>>();
        Assert.NotNull(activities);
        Assert.Equal(2, activities!.Count);
    }

    [Fact]
    public async Task GetActivityById_WithExistingId_ReturnsActivity()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Project For GetActivity",
            Description = "Test"
        };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var newActivity = new CreateActivityDto
        {
            Name = "Activity To Find",
            Bac = 10000m, PlannedPercent = 30m, ActualPercent = 30m, ActualCost = 3000m
        };
        var createResponse = await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", newActivity);
        var createdActivity = await createResponse.Content.ReadFromJsonAsync<ActivityDto>();

        // Act
        var response = await _client.GetAsync($"/api/activities/{createdActivity!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var activity = await response.Content.ReadFromJsonAsync<ActivityDto>();
        Assert.NotNull(activity);
        Assert.Equal(createdActivity.Id, activity!.Id);
        Assert.Equal(createdActivity.Name, activity.Name);
        Assert.NotNull(activity.Indicators);
    }

    [Fact]
    public async Task GetActivityById_WithNonExistingId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/activities/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateActivity_WithValidData_ReturnsUpdatedActivity()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Project For Update Activity",
            Description = "Test"
        };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var newActivity = new CreateActivityDto
        {
            Name = "Activity To Update",
            Bac = 20000m, PlannedPercent = 50m, ActualPercent = 40m, ActualCost = 10000m
        };
        var createResponse = await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", newActivity);
        var createdActivity = await createResponse.Content.ReadFromJsonAsync<ActivityDto>();

        var updateDto = new UpdateActivityDto
        {
            Name = "Updated Activity Name",
            Bac = 25000m,
            PlannedPercent = 60m,
            ActualPercent = 55m,
            ActualCost = 14000m
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/activities/{createdActivity!.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updatedActivity = await response.Content.ReadFromJsonAsync<ActivityDto>();
        Assert.NotNull(updatedActivity);
        Assert.Equal(updateDto.Name, updatedActivity!.Name);
        Assert.Equal(updateDto.Bac, updatedActivity.Bac);
        Assert.Equal(updateDto.PlannedPercent, updatedActivity.PlannedPercent);
        Assert.Equal(updateDto.ActualPercent, updatedActivity.ActualPercent);
        Assert.Equal(updateDto.ActualCost, updatedActivity.ActualCost);
    }

    [Fact]
    public async Task DeleteActivity_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        var newProject = new CreateProjectDto
        {
            Name = "Project For Delete Activity",
            Description = "Test"
        };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var newActivity = new CreateActivityDto
        {
            Name = "Activity To Delete",
            Bac = 10000m, PlannedPercent = 10m, ActualPercent = 0m, ActualCost = 0m
        };
        var createResponse = await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", newActivity);
        var createdActivity = await createResponse.Content.ReadFromJsonAsync<ActivityDto>();

        // Act
        var response = await _client.DeleteAsync($"/api/activities/{createdActivity!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task CreateActivity_WithNegativeBac_ReturnsBadRequest()
    {
        // Arrange
        var newProject = new CreateProjectDto { Name = "Project Bad Activity", Description = null };
        var projectResponse = await _client.PostAsJsonAsync("/api/projects", newProject);
        var project = await projectResponse.Content.ReadFromJsonAsync<ProjectDto>();

        var invalidActivity = new CreateActivityDto
        {
            Name = "Bad Activity",
            Bac = -100m,
            PlannedPercent = 50m,
            ActualPercent = 10m,
            ActualCost = 1000m
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/projects/{project!.Id}/activities", invalidActivity);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}