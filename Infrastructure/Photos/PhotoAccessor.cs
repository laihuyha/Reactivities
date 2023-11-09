using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        private readonly string _locatePhotoFolder;
        public PhotoAccessor(IOptions<CloudinarySetting> config)
        {
            Account account = new(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;

            _locatePhotoFolder = config.Value.LocatePhotoFolder;
        }

        public async Task<CloudinaryUploadResult> AddPhoto(IFormFile file, string userId)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new(file.FileName, stream),
                    PublicId = new StringBuilder().AppendFormat("{0}_{1}_{2}", userId, Guid.NewGuid().ToString(), Path.ChangeExtension(file.FileName, null)).ToString(),
                    Folder = _locatePhotoFolder,
                    Overwrite = true,
                    Tags = "User Photo",
                    DisplayName = userId,
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
                };
                var result = await _cloudinary.UploadAsync(uploadParams);
                return result.Error != null
                    ? throw new Exception(result.Error.Message)
                    : new CloudinaryUploadResult { PublicId = result.PublicId, Url = result.SecureUrl.ToString() };
            }
            return null;
        }

        public async Task<string> DeletePhoto(string shortedPublicId)
        {
            var publicId = new StringBuilder().AppendFormat("{0}/{1}", _locatePhotoFolder, shortedPublicId).ToString();
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}