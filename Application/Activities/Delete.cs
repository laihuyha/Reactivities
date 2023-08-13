using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public static class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(new object[] { request.Id }, cancellationToken: cancellationToken); // Find activity by ID
                if (activity != null)
                {
                    _context.Remove(activity); // Remove activity
                    await _context.SaveChangesAsync(cancellationToken); // Save changes to DB
                    return Unit.Value;
                }
                return Unit.Value;
            }
        }
    }
}