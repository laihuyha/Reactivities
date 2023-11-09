using System;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<CloudinaryUploadResult> AddPhoto(IFormFile file, string userId);
        Task<string> DeletePhoto(String publicId);
    }
}