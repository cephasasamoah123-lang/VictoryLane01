using VictoryLane.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VictoryLane.Api.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize(Roles = "admin")]
public class UploadController : ControllerBase
{
    private static readonly string[] AllowedTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    private readonly CloudinaryService _cloudinary;

    public UploadController(CloudinaryService cloudinary)
    {
        _cloudinary = cloudinary;
    }

    [HttpPost]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> UploadSingle(IFormFile? image)
    {
        if (image is null)
            return BadRequest(new { success = false, message = "No image file provided" });

        if (!AllowedTypes.Contains(image.ContentType))
            return BadRequest(new { success = false, message = "Only JPEG, PNG, GIF, and WebP images are allowed" });

        if (image.Length > MaxFileSize)
            return BadRequest(new { success = false, message = "File too large. Maximum size is 5MB." });

        try
        {
            await using var stream = image.OpenReadStream();
            var url = await _cloudinary.UploadAsync(stream, image.FileName);
            return Ok(new { success = true, url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPost("multiple")]
    public async Task<IActionResult> UploadMultiple(List<IFormFile> images)
    {
        if (images is null || images.Count == 0)
            return BadRequest(new { success = false, message = "No image files provided" });

        if (images.Count > 5)
            return BadRequest(new { success = false, message = "Maximum 5 images allowed." });

        foreach (var image in images)
        {
            if (!AllowedTypes.Contains(image.ContentType))
                return BadRequest(new { success = false, message = "Only JPEG, PNG, GIF, and WebP images are allowed" });
            if (image.Length > MaxFileSize)
                return BadRequest(new { success = false, message = "File too large. Maximum size is 5MB per file." });
        }

        try
        {
            var urls = new List<string>();
            foreach (var image in images)
            {
                await using var stream = image.OpenReadStream();
                urls.Add(await _cloudinary.UploadAsync(stream, image.FileName));
            }
            return Ok(new { success = true, urls });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
