using EVM.API.Models.DTOs;
using FluentValidation;

namespace EVM.API.Validators;

public class CreateActivityValidator : AbstractValidator<CreateActivityDto>
{
    public CreateActivityValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Activity name is required.")
            .MaximumLength(200).WithMessage("Activity name must not exceed 200 characters.");

        RuleFor(x => x.Bac)
            .GreaterThanOrEqualTo(0).WithMessage("BAC must be greater than or equal to 0.");

        RuleFor(x => x.PlannedPercent)
            .InclusiveBetween(0, 100).WithMessage("Planned percent must be between 0 and 100.");

        RuleFor(x => x.ActualPercent)
            .InclusiveBetween(0, 100).WithMessage("Actual percent must be between 0 and 100.");

        RuleFor(x => x.ActualCost)
            .GreaterThanOrEqualTo(0).WithMessage("Actual cost must be greater than or equal to 0.");
    }
}