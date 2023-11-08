using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.DTO;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var activities = await _context.Activities.AsNoTracking().Include(e => e.Attendees).ThenInclude(u => u.AppUser).ToListAsync(cancellationToken: cancellationToken);
                // var result = _mapper.Map<List<ActivityDto>>(activities);
                // return Result<List<ActivityDto>>.Success(result);

                return Result<List<ActivityDto>>.Success(await _context.Activities.AsNoTracking().ProjectTo<ActivityDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken: cancellationToken));
            }
        }
    }
}