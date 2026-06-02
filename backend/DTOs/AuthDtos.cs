namespace SCLCC.Backend.DTOs;

public record LoginRequest(string Email, string Password);

public record VerifyOtpRequest(string Email, string Code);

public record AuthResponse(
    string AccessToken,
    string NombreCompleto,
    string Email,
    int    RolId,
    string RolNombre
);

public record MessageResponse(string Message);