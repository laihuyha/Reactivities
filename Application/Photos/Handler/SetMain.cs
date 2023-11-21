using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos.Handler
{
    public static class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string PhotoPublicId { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(IUserAccessor userAccessor, DataContext context)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(e => e.Photos).FirstOrDefaultAsync(e => e.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);
                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(e => e.Id == request.PhotoPublicId);
                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(e => e.IsMain);
                if (currentMain != null) currentMain.IsMain = false;
                photo.IsMain = true;

                var results = await _context.SaveChangesAsync(cancellationToken) > 0;

                return results ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}