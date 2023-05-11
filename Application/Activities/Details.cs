using System;
using System.Threading.Tasks;
using Domain;
using MediatR;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            public Handler()
            {
            }

            public async Task<Activity> Handle(Query request, System.Threading.CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}