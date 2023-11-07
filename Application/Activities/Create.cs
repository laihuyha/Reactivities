using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                _ = RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _context.Users.FirstOrDefaultAsync(e => e.UserName == _userAccessor.GetUserName(), cancellationToken: CancellationToken.None);
                    var attendee = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = request.Activity,
                        IsHost = true
                    };
                    request.Activity.Attendees.Add(attendee);

                    // Nếu dùng AddAsync cho request.Activity thì sẽ bị thiếu attendee nên cần đảm bảo add attendee vào context trước
                    // Nếu dùng Add thì ko cần dùng lệnh _ = await _context.ActivityAttendees.AddAsync(attendee, cancellationToken); này nữa
                    _ = await _context.ActivityAttendees.AddAsync(attendee, cancellationToken);
                    _ = await _context.Activities.AddAsync(request.Activity, cancellationToken);

                    _ = await _context.SaveChangesAsync(cancellationToken); // Save changes to DB
                    return Result<Unit>.Success(Unit.Value);
                }
                catch (Exception ex)
                {
                    return Result<Unit>.Failure(ex.Message ?? ex.InnerException.Message);
                }
            }
        }
    }
}