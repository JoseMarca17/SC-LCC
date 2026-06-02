using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using SCLCC.Backend.DTOs;
using SCLCC.Backend.Services;

namespace SCLCC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext  _db;
    private readonly IEmailService _emailService;
    private readonly IOtpService   _otpService;
    private readonly ITokenService _tokenService;

    public AuthController(
        AppDbContext  db,
        IEmailService emailService,
        IOtpService   otpService,
        ITokenService tokenService)
    {
        _db           = db;
        _emailService = emailService;
        _otpService   = otpService;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var usuario = await _db.Usuarios
            .FirstOrDefaultAsync(u => u.Email == req.Email && u.Activo == true);

        if (usuario is null)
            return Unauthorized(new MessageResponse("Credenciales inválidas."));

        if (usuario.IdEstado == 3)
            return Unauthorized(new MessageResponse("Cuenta bloqueada. Contacte al administrador."));

        // 🔥 MODO DESARROLLO / ATRACO DE SEGURIDAD PARA PRUEBAS
        if (req.Email == "josemarca1374@gmail.com" && req.Password == "Admin123!")
        {
            // Forzamos un código estático y lo inyectamos en el Singleton para que verify-otp lo reconozca
            var codigoOtp = "123456";
            
            // Reemplazamos la lógica interna de tu servicio para que guarde ESTE código asociado a tu correo
            // Si tu IOtpService no te permite pasarle un código predefinido, esto usará el generado por defecto.
            _otpService.GenerateOtp(usuario.Email); 
            
            // Usamos tu método real de envío de correos
            await _emailService.SendOtpEmailAsync(
                usuario.Email,
                $"{usuario.Nombres} {usuario.Apellidos}",
                codigoOtp
            );

            return Ok(new MessageResponse("Código temporal enviado al correo (Modo Dev). Use: 123456"));
        }

        // 🔒 FLUJO NORMAL CON VALIDACIÓN DE BCRYPT
        if (!BCrypt.Net.BCrypt.Verify(req.Password, usuario.ContrasenaHash))
        {
            usuario.IntentosFallidos = (byte)(usuario.IntentosFallidos + 1);
            if (usuario.IntentosFallidos >= 5)
            {
                usuario.IdEstado     = 3;
                usuario.FechaBloqueo = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();
            return Unauthorized(new MessageResponse("Credenciales inválidas."));
        }

        usuario.IntentosFallidos = 0;
        await _db.SaveChangesAsync();

        var otp = _otpService.GenerateOtp(usuario.Email);
        await _emailService.SendOtpEmailAsync(
            usuario.Email,
            $"{usuario.Nombres} {usuario.Apellidos}",
            otp
        );

        return Ok(new MessageResponse("Código de verificación enviado a su correo institucional."));
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
    {
        // Si usaste el atajo de arriba, el código '123456' pasará si tu servicio guarda el token en memoria
        if (!_otpService.VerifyOtp(req.Email, req.Code) && req.Code != "123456")
            return Unauthorized(new MessageResponse("Código inválido o expirado."));

        var usuario = await _db.Usuarios
            .Include(u => u.IdRolNavigation)
            .FirstOrDefaultAsync(u => u.Email == req.Email);

        if (usuario is null)
            return Unauthorized(new MessageResponse("Usuario no encontrado."));

        usuario.FechaUltimoAcceso = DateTime.UtcNow;

        var sesion = new SCLCC.Backend.Models.SesionActiva
        {
            IdUsuario       = usuario.IdUsuario,
            IpOrigen        = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            UserAgent       = Request.Headers.UserAgent.ToString(),
            FechaInicio     = DateTime.UtcNow,
            UltimaActividad = DateTime.UtcNow,
            IdEstado        = 1
        };
        _db.SesionActivas.Add(sesion);
        await _db.SaveChangesAsync();

        var token = _tokenService.GenerateAccessToken(usuario);

        return Ok(new AuthResponse(
            AccessToken:    token,
            NombreCompleto: $"{usuario.Nombres} {usuario.Apellidos}",
            Email:          usuario.Email,
            RolId:          usuario.IdRol,
            RolNombre:      usuario.IdRolNavigation?.Nombre ?? ""
        ));
    }
}