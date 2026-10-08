using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace VictoryLane.Api.Services;

public class CloudinaryService
{
    private readonly Cloudinary? _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var cloudName = config["Cloudinary:CloudName"];
        var apiKey = config["Cloudinary:ApiKey"];
        var apiSecret = config["Cloudinary:ApiSecret"];

        if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
        {
            Console.WriteLine("WARNING: Cloudinary configuration is missing. Image uploads will fail.");
            return;
        }

        _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName)
    {
        if (_cloudinary is null)
            throw new InvalidOperationException("Cloudinary is not configured.");

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "victorylane",
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error is not null)
            throw new Exception(result.Error.Message);

        return result.SecureUrl.ToString();
    }
}
