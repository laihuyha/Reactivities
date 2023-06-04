using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id); // Find activity by ID
                if (activity != null)
                {
                    // activity.Title = request.Activity.Title ?? activity.Title; // If request.Activity.Title is null, then use activity.Title
                    // activity.Description = request.Activity.Description ?? activity.Description;
                    // activity.Category = request.Activity.Category ?? activity.Category;
                    // activity.Date = DateTime.Now;
                    // activity.City = request.Activity.City ?? activity.City;
                    // activity.Venue = request.Activity.Venue ?? activity.Venue;

                    _mapper.Map(request.Activity, activity); // Map request.Activity to activity

                    await _context.SaveChangesAsync(); // Save changes to DB
                    return Unit.Value;
                }
                return Unit.Value;
            }
        }
    }
}