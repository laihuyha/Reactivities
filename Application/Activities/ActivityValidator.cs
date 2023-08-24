using Domain.Entities;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            _ = RuleFor(x => x.Title).NotEmpty();
            _ = RuleFor(x => x.Date).NotEmpty();
            _ = RuleFor(x => x.Category).NotEmpty();
            _ = RuleFor(x => x.City).NotEmpty();
            _ = RuleFor(x => x.Description);
            _ = RuleFor(x => x.Venue);
        }
    }
}