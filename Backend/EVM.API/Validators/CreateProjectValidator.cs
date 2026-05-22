using EVM.API.Models.DTOs;
using FluentValidation;

namespace EVM.API.Validators;

public class CreateProjectValidator : AbstractValidator<CreateProjectDto>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Project name is required.")
            .MaximumLength(200).WithMessage("Project name must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).When(x => x.Description != null)
            .WithMessage("Description must not exceed 1000 characters.");
    }
}