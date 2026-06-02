using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using SCLCC.Backend.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CivilController : ControllerBase
{
    private readonly AppDbContext _db;

    public CivilController(AppDbContext db) => _db = db;

    // ── 1. REGISTRAR CIVIL Y VINCULAR CON COMISO (Tareas 6.1, 6.2, 6.3, 6.6) ──
    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] CivilCreateDto dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        // Tarea: Validar datos esenciales del formulario
        if (string.IsNullOrEmpty(dto.Nombres) || string.IsNullOrEmpty(dto.Apellidos))
            return BadRequest(new { message = "Los nombres y apellidos son campos obligatorios." });

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            // Tarea: Validar si el ciudadano ya existe mediante su documento de identidad
            Civil itemCivil = null;
            if (!string.IsNullOrEmpty(dto.NroDocumento) && dto.IdTipoDocumento != 4) // 4 = Sin Documento
            {
                itemCivil = await _db.Civils.FirstOrDefaultAsync(c => c.NroDocumento == dto.NroDocumento);
            }

            // Si no existe, se procede con el alta nueva en la tabla Civil
            if (itemCivil == null)
            {
                itemCivil = new Civil
                {
                    NroDocumento = dto.NroDocumento,
                    IdTipoDocumento = dto.IdTipoDocumento,
                    Nombres = dto.Nombres.ToUpper(),
                    Apellidos = dto.Apellidos.ToUpper(),
                    Nacionalidad = string.IsNullOrEmpty(dto.Nacionalidad) ? "Boliviana" : dto.Nacionalidad,
                    IdRol = dto.IdRol, // Conductor, Pasajero, Contrabandista, etc.
                    CodigoRegistro = "CIV-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    Telefono = dto.Telefono,
                    Direccion = dto.Direccion,
                    Observaciones = dto.Observaciones,
                    RegistradoPor = usuarioId,
                    FechaRegistro = DateTime.UtcNow
                };

                _db.Civils.Add(itemCivil);
                await _db.SaveChangesAsync();

                // Auditoría en Bitacora de la creación
                await _db.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Civil', @registroId={itemCivil.IdCivil}, @valorNuevo={itemCivil.CodigoRegistro}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='RegistroCiviles'"
                );
            }

            // Tarea: Vincular civil con comisos (Tabla intermedia ComisoXcivil)
            if (dto.IdComiso.HasValue && dto.IdComiso.Value > 0)
            {
                var yaVinculado = await _db.ComisoXcivils.AnyAsync(cx => cx.IdComiso == dto.IdComiso.Value && cx.IdCivil == itemCivil.IdCivil);
                if (!yaVinculado)
                {
                    var vinculacion = new ComisoXcivil
                    {
                        IdComiso = dto.IdComiso.Value,
                        IdCivil = itemCivil.IdCivil
                    };
                    _db.ComisoXcivils.Add(vinculacion);
                    await _db.SaveChangesAsync();
                }
            }

            await transaction.CommitAsync();
            return Ok(new { message = "Ciudadano procesado e indexado correctamente.", codigo = itemCivil.CodigoRegistro });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { message = ex.Message });
        }
    }

    // ── 2. CONSULTA AL SISTEMA / BUSCAR (Tarea 6.4) ──
    [HttpGet("listar")]
    public async Task<IActionResult> Listar([FromQuery] string? buscar)
    {
        var query = _db.Civils.Include(c => c.IdRolNavigation).AsQueryable();

        if (!string.IsNullOrEmpty(buscar))
        {
            query = query.Where(c => c.Nombres.Contains(buscar) || 
                                     c.Apellidos.Contains(buscar) || 
                                     c.NroDocumento.Contains(buscar) || 
                                     c.CodigoRegistro.Contains(buscar));
        }

        var lista = await query.Select(c => new {
            c.IdCivil,
            c.CodigoRegistro,
            c.NroDocumento,
            NombreCompleto = c.Nombres + " " + c.Apellidos,
            c.Nacionalidad,
            Rol = c.IdRolNavigation.Descripcion,
            c.Telefono
        }).ToListAsync();

        return Ok(lista);
    }

    // ── 3. EXPORTAR INFORME SEGURO DE CIVILES DECOMISADOS ──
    [AllowAnonymous]
    [HttpGet("exportar")]
    public async Task<IActionResult> Exportar([FromQuery] string? token)
    {
        if (!User.Identity.IsAuthenticated && string.IsNullOrEmpty(token))
            return Unauthorized();

        var datos = await _db.Civils.Include(c => c.IdRolNavigation).ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Codigo Registro,Documento,Nombres,Apellidos,Nacionalidad,Rol Declarado,Fecha Registro");

        foreach (var c in datos)
        {
            csv.AppendLine($"{c.CodigoRegistro},{c.NroDocumento},{c.Nombres},{c.Apellidos},{c.Nacionalidad},{c.IdRolNavigation?.Descripcion},{c.FechaRegistro:dd/MM/yyyy}");
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"Reporte_Civiles_{DateTime.Now:yyyyMMdd}.csv");
    }

    [HttpGet("catalogos")]
    public async Task<IActionResult> GetCatalogos()
    {
        var rolesCiviles = await _db.CatRolCivils.Select(r => new { r.Id, r.Descripcion }).ToListAsync();
        var tiposDoc = await _db.CatTipoDocumentos.Select(t => new { t.Id, t.Descripcion }).ToListAsync();
        var comisosActivos = await _db.Comisos.Where(c => c.IdEstado == 1).Select(c => new { c.IdComiso, c.CodigoComiso }).ToListAsync();

        return Ok(new { rolesCiviles, tiposDoc, comisosActivos });
    }
}

// DTO para la carga y validación unificada de datos
public class CivilCreateDto
{
    public string? NroDocumento { get; set; }
    public byte IdTipoDocumento { get; set; }
    public string Nombres { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Nacionalidad { get; set; }
    public byte IdRol { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Observaciones { get; set; }
    public int? IdComiso { get; set; } // Acta de comiso a vincular opcionalmente
}