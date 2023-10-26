using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public static class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var activity = await _context.Activities.FindAsync(new object[] { request.Id }, cancellationToken: cancellationToken); // Find activity by ID
                    if (activity != null)
                    {
                        _ = _context.Remove(activity); // Remove activity
                        _ = await _context.SaveChangesAsync(cancellationToken); // Save changes to DB
                        return Result<Unit>.Success(Unit.Value);
                    }
                    return Result<Unit>.Failure("Activity not found");
                }
                catch (Exception ex)
                {
                    return Result<Unit>.Failure(ex.Message ?? ex.InnerException.Message);
                }
            }
        }
    }
}