using System.Text.Json;

namespace VictoryLane.Api.Services;

public class PaystackVerificationResult
{
    public bool Success { get; set; }
    public string Status { get; set; } = "";
    public decimal AmountMajorUnits { get; set; } // converted from kobo/pesewas to GHS
    public string Currency { get; set; } = "";
    public string? FailureReason { get; set; }
}

/// <summary>
/// Verifies Paystack transactions server-side using the secret key.
/// Never trust a paymentReference from the client without calling this first —
/// the client-side Paystack popup only proves a charge was *attempted*, not that it succeeded.
/// </summary>
public class PaystackService
{
    private readonly HttpClient _http;
    private readonly ILogger<PaystackService> _logger;
    private readonly bool _configured;

    public PaystackService(HttpClient http, IConfiguration config, ILogger<PaystackService> logger)
    {
        _http = http;
        _logger = logger;

        var secretKey = config["Paystack:SecretKey"];
        _configured = !string.IsNullOrWhiteSpace(secretKey);

        if (_configured)
        {
            _http.BaseAddress = new Uri("https://api.paystack.co/");
            _http.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", secretKey);
        }
    }

    public bool IsConfigured => _configured;

    public async Task<PaystackVerificationResult> VerifyTransactionAsync(string reference)
    {
        if (!_configured)
        {
            // Fail closed: if we can't verify, we don't trust the payment.
            _logger.LogError("Paystack:SecretKey is not configured; refusing to trust unverified payment reference {Reference}", reference);
            return new PaystackVerificationResult { Success = false, FailureReason = "Payment verification is not configured on the server." };
        }

        HttpResponseMessage response;
        try
        {
            response = await _http.GetAsync($"transaction/verify/{Uri.EscapeDataString(reference)}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Paystack verification request failed for reference {Reference}", reference);
            return new PaystackVerificationResult { Success = false, FailureReason = "Could not reach Paystack to verify payment." };
        }

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Paystack verification returned {StatusCode} for reference {Reference}", response.StatusCode, reference);
            return new PaystackVerificationResult { Success = false, FailureReason = "Payment reference could not be verified." };
        }

        using var stream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(stream);
        var root = doc.RootElement;

        var apiSuccess = root.TryGetProperty("status", out var statusProp) && statusProp.ValueKind == JsonValueKind.True;
        if (!apiSuccess || !root.TryGetProperty("data", out var data))
        {
            return new PaystackVerificationResult { Success = false, FailureReason = "Unexpected response from Paystack." };
        }

        var txStatus = data.TryGetProperty("status", out var s) ? s.GetString() ?? "" : "";
        var amountKobo = data.TryGetProperty("amount", out var a) ? a.GetInt64() : 0;
        var currency = data.TryGetProperty("currency", out var c) ? c.GetString() ?? "" : "";

        return new PaystackVerificationResult
        {
            Success = txStatus == "success",
            Status = txStatus,
            AmountMajorUnits = amountKobo / 100m,
            Currency = currency,
            FailureReason = txStatus == "success" ? null : $"Transaction status was '{txStatus}', not 'success'.",
        };
    }
}
