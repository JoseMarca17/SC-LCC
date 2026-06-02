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
        var expiration = DateTime.UtcNow.AddMinutes(double.Parse(settings["AccessTokenExpirationMinutes"]!));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   usuario.IdUsuario.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(ClaimTypes.Name,               $"{usuario.Nombres} {usuario.Apellidos}"),
            new Claim(ClaimTypes.Role,               usuario.IdRol.ToString()),
            new Claim("rol_id",                      usuario.IdRol.ToString()),
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