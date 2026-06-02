using Microsoft.IdentityModel.Tokens;
using SCLCC.Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SCLCC.Backend.Services;

public interface ITokenService
{
    string GenerateAccessToken(Usuario usuario);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateAccessToken(Usuario usuario)
    {
        var settings   = _config.GetSection("JwtSettings");
        var key        = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings["SecretKey"]!));
        var creds      = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        // ── CONTROL DE EXPIRACIÓN AMPLIADO PARA DESARROLLO ──
        // Si quieres cambiarlo dinámicamente, lee el appsettings, si no, usa 480 minutos (8 horas)
        double minutosExpiracion = double.TryParse(settings["AccessTokenExpirationMinutes"], out var mins) ? mins : 30;
        
#if DEBUG
        // Mientras compiles en modo Debug (desarrollo), dale 8 horas de vida al token
        minutosExpiracion = 480; 
#endif

        var expiration = DateTime.UtcNow.AddMinutes(minutosExpiracion);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   usuario.IdUsuario.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(ClaimTypes.Name,               $"{usuario.Nombres} {usuario.Apellidos}"),
            new Claim(ClaimTypes.Role,               usuario.IdRol.ToString()),
            new Claim("rol_id",                      usuario.IdRol.ToString()), // Mapeo para tu front
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer:             settings["Issuer"],
            audience:           settings["Audience"],
            claims:             claims,
            expires:            expiration,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}