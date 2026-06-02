using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using SCLCC.Backend.DTOs;
using SCLCC.Backend.Models;
using System.Security.Claims;

namespace SCLCC.Backend.Controllers;

[Authorize(Roles = "1")] // Restricción estricta: Solo Administrador (Rol 1)
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsuariosController(AppDbContext db)
    {
        _db = db;
    }

    // ── 1. REGISTRAR NUEVO USUARIO (UC-01-01) ─────────────────────────────────
    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] UsuarioCreateRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new MessageResponse("El correo y la contraseña son obligatorios."));

        // Verificar unicidad de email
        if (await _db.Usuarios.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new MessageResponse("El correo electrónico ya está registrado en el sistema."));

        // Hashear la contraseña usando el mismo proveedor del AuthController (BCrypt)
        string hashContrasena = BCrypt.Net.BCrypt.HashPassword(req.Password, 12);

        var nuevoUsuario = new Usuario
        {
            Nombres = req.Nombres,
            Apellidos = req.Apellidos,
            Email = req.Email,
            ContrasenaHash = hashContrasena,
            IdEstado = 1, // 1 = Activo (según tu CatEstadoUsuario)
            IdRol = req.IdRol,
            Habilitado2Fa = false,
            Activo = true,
            FechaCreacion = DateTime.UtcNow,
            IntentosFallidos = 0,
            CreadoPor = ObtenerUsuarioIdDeToken()
        };

        _db.Usuarios.Add(nuevoUsuario);
        await _db.SaveChangesAsync();

        // Registro automático en Bitácora usando tu SP nativo sp_RegistrarBitacora
        await RegistrarEnBitacora(1, "Usuario", nuevoUsuario.IdUsuario.ToString(), null, "{\"Accion\":\"Registro Inicial\"}");

        return Ok(new MessageResponse("Usuario registrado exitosamente en el sistema de control."));
    }

    // ── 2. BUSCAR / LISTAR USUARIOS (UC-01-03) ────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> ListarUsuarios([FromQuery] string? buscar)
    {
        var query = _db.Usuarios
            .Include(u => u.IdRolNavigation)
            .Include(u => u.IdEstadoNavigation)
            .Where(u => u.Activo == true);

        if (!string.IsNullOrWhiteSpace(buscar))
        {
            query = query.Where(u => u.Email.Contains(buscar) || 
                                     u.Nombres.Contains(buscar) || 
                                     u.Apellidos.Contains(buscar));
        }

        var lista = await query.Select(u => new {
            u.IdUsuario,
            u.Nombres,
            u.Apellidos,
            u.Email,
            RolId = u.IdRol,
            RolNombre = u.IdRolNavigation.Nombre,
            EstadoId = u.IdEstado,
            EstadoDescripcion = u.IdEstadoNavigation.Descripcion,
            u.FechaCreacion,
            u.FechaUltimoAcceso
        }).ToListAsync();

        return Ok(lista);
    }

    // ── 3. MODIFICAR DATOS DEL USUARIO (UC-01-02) ─────────────────────────────
    [HttpPut("{id}")]
    public async Task<IActionResult> Modificar(int id, [FromBody] UsuarioUpdateRequest req)
    {
        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == id && u.Activo == true);
        if (usuario is null) return NotFound(new MessageResponse("Usuario no encontrado o dado de baja."));

        // Almacenar el valor anterior para auditoría
        var valorAnterior = $"{{\"Nombres\":\"{usuario.Nombres}\",\"Apellidos\":\"{usuario.Apellidos}\",\"IdRol\":{usuario.IdRol}}}";

        usuario.Nombres = req.Nombres;
        usuario.Apellidos = req.Apellidos;
        usuario.IdRol = req.IdRol;

        await _db.SaveChangesAsync();

        var valorNuevo = $"{{\"Nombres\":\"{usuario.Nombres}\",\"Apellidos\":\"{usuario.Apellidos}\",\"IdRol\":{usuario.IdRol}}}";
        await RegistrarEnBitacora(2, "Usuario", usuario.IdUsuario.ToString(), valorAnterior, valorNuevo);

        return Ok(new MessageResponse("Datos de usuario actualizados correctamente."));
    }

    // ── 4. CAMBIAR ESTADO DE USUARIO (UC-01-04) ───────────────────────────────
    [HttpPut("{id}/estado")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] CambiarEstadoRequest req)
    {
        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == id && u.Activo == true);
        if (usuario is null) return NotFound(new MessageResponse("Usuario no encontrado."));

        var valorAnterior = $"{{\"IdEstado\":{usuario.IdEstado}}}";
        
        usuario.IdEstado = req.IdEstado; // 1 = Activo, 2 = Inactivo, 3 = Bloqueado
        if(req.IdEstado == 1) usuario.IntentosFallidos = 0; // Limpia bloqueos si se reactiva

        await _db.SaveChangesAsync();

        var valorNuevo = $"{{\"IdEstado\":{usuario.IdEstado}}}";
        await RegistrarEnBitacora(2, "Usuario", usuario.IdUsuario.ToString(), valorAnterior, valorNuevo);

        return Ok(new MessageResponse("Estado del usuario modificado exitosamente."));
    }
    // ── 5. CONSULTAR BITÁCORA DE AUDITORÍA (UC-01-43) ─────────────────────────
[HttpGet("bitacora")]
public async Task<IActionResult> ConsultarBitacora([FromQuery] string? modulo, [FromQuery] string? tabla)
{
    var query = _db.Bitacoras
        .Include(b => b.IdUsuarioNavigation)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(modulo))
        query = query.Where(b => b.Modulo == modulo);

    if (!string.IsNullOrWhiteSpace(tabla))
        query = query.Where(b => b.Tabla == tabla);

    var logs = await query
        .OrderByDescending(b => b.Fecha)
        .Select(b => new {
            b.IdRegistro,
            b.IdAccion,
            b.Tabla,
            b.RegistroId,
            b.ValorAnterior,
            b.ValorNuevo,
            b.Fecha,
            b.Ip,
            Operador = b.IdUsuarioNavigation != null ? $"{b.IdUsuarioNavigation.Nombres} {b.IdUsuarioNavigation.Apellidos}" : "Sistema",
            b.Modulo
        })
        .ToListAsync();

    return Ok(logs);
}

// ── 6. LISTAR SESIONES ACTIVAS (UC-01-45) ──────────────────────────────────
[HttpGet("sesiones")]
public async Task<IActionResult> ListarSesionesActivas()
{
    // Usamos la vista nativa que creaste en tu script de SQL Server: vw_SesionesActivas
    // Si no mapeaste la vista en EF Core, podemos consultarla por Raw SQL de forma directa
    var sesiones = await _db.SesionActivas
        .Where(s => s.IdEstado == 1) // 1 = Activa (según CatEstadoSesion)
        .Include(s => s.IdUsuarioNavigation)
        .Select(s => new {
            s.IdSesion,
            Usuario = $"{s.IdUsuarioNavigation.Nombres} {s.IdUsuarioNavigation.Apellidos}",
            s.IpOrigen,
            s.FechaInicio,
            s.UltimaActividad,
            s.UserAgent
        })
        .ToListAsync();

    return Ok(sesiones);
}

// ── 7. FORZAR CIERRE DE SESIÓN ACTIVA (UC-01-47) ───────────────────────────
[HttpPost("sesiones/{idSesion}/forzar-cierre")]
public async Task<IActionResult> ForzarCierreSesion(int idSesion)
{
    // Ejecución de tu SP nativo: sp_CerrarSesion con motivo 4 (Forzada)
    await _db.Database.ExecuteSqlRawAsync("EXEC sp_CerrarSesion @idSesion={0}, @motivo=4", idSesion);
    
    // Auditoría
    await RegistrarEnBitacora(7, "SesionActiva", idSesion.ToString(), "{\"idEstado\":1}", "{\"idEstado\":4}");

    return Ok(new MessageResponse("Cierre de sesión remoto ordenado exitosamente."));
}

// ── 8. BLOQUEAR IP AMENAZANTE (UC-01-49) ───────────────────────────────────
[HttpPost("bloquear-ip")]
public async Task<IActionResult> BloquearIP([FromBody] BloquearIpRequest req)
{
    if (string.IsNullOrWhiteSpace(req.Ip))
        return BadRequest(new MessageResponse("La dirección IP es obligatoria."));

    int? adminId = ObtenerUsuarioIdDeToken();

    // Ejecución de tu SP nativo: sp_BloquearIP
    await _db.Database.ExecuteSqlRawAsync(
        "EXEC sp_BloquearIP @ip={0}, @motivo={1}, @bloqueadoPor={2}",
        req.Ip, req.Motivo ?? "Irregularidades detectadas por el Administrador", adminId
    );

    // Auditoría
    await RegistrarEnBitacora(1, "IPBloqueada", req.Ip, null, $"{{\"Ip\":\"{req.Ip}\",\"Motivo\":\"{req.Motivo}\"}}");

    return Ok(new MessageResponse($"Dirección IP {req.Ip} bloqueada permanentemente de los servicios de autenticación."));
}

public record BloquearIpRequest(string Ip, string Motivo);
    // ── MÉTODOS INTERNOS AUXILIARES ──────────────────────────────────────────
    private int? ObtenerUsuarioIdDeToken()
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claimId, out int id) ? id : null;
    }

    private async Task RegistrarEnBitacora(byte accion, string tabla, string registroId, string? anterior, string? nuevo)
    {
        try
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            int? usuarioId = ObtenerUsuarioIdDeToken();

            // Invocación segura mediante Raw SQL del Stored Procedure sp_RegistrarBitacora de tu script
            await _db.Database.ExecuteSqlRawAsync(
                "EXEC sp_RegistrarBitacora @accion={0}, @tabla={1}, @registroId={2}, @valorAnterior={3}, @valorNuevo={4}, @ip={5}, @idUsuario={6}, @modulo={7}",
                accion, tabla, registroId, anterior, nuevo, ip, usuarioId, "GestionUsuarios"
            );
        }
        catch { /* Prevenir caídas si falla la bitácora en pruebas */ }
    }
}

// ── DTOs NECESARIOS PARA EL MÓDULO ───────────────────────────────────────────
public record UsuarioCreateRequest(string Nombres, string Apellidos, string Email, string Password, byte IdRol);
public record UsuarioUpdateRequest(string Nombres, string Apellidos, byte IdRol);
public record CambiarEstadoRequest(byte IdEstado);

