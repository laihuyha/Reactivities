using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos.Handler
{
    public static class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
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

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(e => e.Photos).FirstOrDefaultAsync(e => e.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);

                if (user == null) return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File, user.Id);

                var photo = new Photo { Url = photoUploadResult.Url, Id = photoUploadResult.PublicId };

                if (!user.Photos.Any(e => e.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}