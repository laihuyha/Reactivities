using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(e => e.Photos).FirstOrDefaultAsync(e => e.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(e => e.Id.Contains(request.Id));
                if (photo == null) return Result<Unit>.Failure("Photo not found");

                #region Unsafe way
                // var result = await _photoAccessor.DeletePhoto(request.Id);
                // if (result == null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary");
                // // // executing direct SQL DELETE statements then affected rows in database immediately no need to call SaveChangesAsync
                // var sqlDeleteResult = await _context.Photos.Where(e => e.Id.Contains(request.Id)).ExecuteDeleteAsync() > 0;

                // return sqlDeleteResult ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting photo from API");
                #endregion Unsafe way

                using (var transaction = _context.Database.BeginTransaction())
                {
                    var result = await _photoAccessor.DeletePhoto(request.Id);
                    if (result == null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary");

                    _ = _context.Photos.Remove(photo);
                    var saveChangeResult = await _context.SaveChangesAsync(cancellationToken) > 0;

                    if (!saveChangeResult)
                    {
                        transaction.Rollback();
                        return Result<Unit>.Failure("Problem deleting photo from API");
                    }

                    transaction.Commit();
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}