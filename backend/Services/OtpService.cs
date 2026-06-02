using System.Collections.Concurrent;

namespace SCLCC.Backend.Services;

public interface IOtpService
{
    string GenerateOtp(string email);
    bool VerifyOtp(string email, string code);
}

public class OtpService : IOtpService
{
    private readonly ConcurrentDictionary<string, (string Code, DateTime ExpiresAt)> _store = new();

    public string GenerateOtp(string email)
    {
        var code = Random.Shared.Next(100000, 999999).ToString();
        _store[email] = (code, DateTime.UtcNow.AddMinutes(5));
        return code;
    }

    public bool VerifyOtp(string email, string code)
    {
        if (!_store.TryGetValue(email, out var entry))
            return false;

        if (DateTime.UtcNow > entry.ExpiresAt)
        {
            _store.TryRemove(email, out _);
            return false;
        }

        if (entry.Code != code)
            return false;

        _store.TryRemove(email, out _);
        return true;
    }
}