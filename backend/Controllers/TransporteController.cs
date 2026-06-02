using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using SCLCC.Backend.Models;
using System.Security.Claims;
using System.Text;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransporteController : ControllerBase
{
    private readonly AppDbContext _db;

    public TransporteController(AppDbContext db) => _db = db;

    // ── 1. REGISTRAR VEHÍCULO E INFRAFACTOR ──
    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] VehiculoFullDto dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        using var transaction = await _db.Database.BeginTransactionAsync();

        try 
        {
            if (await _db.Vehiculos.AnyAsync(v => v.Placa == dto.Placa))
                return BadRequest(new { message = $"La placa {dto.Placa} ya existe en el sistema." });

            int? idCivil = null;

            if (!string.IsNullOrEmpty(dto.NombresProp)) 
            {
                var nuevoCivil = new Civil 
                {
                    Nombres = dto.NombresProp.ToUpper(),
                    Apellidos = dto.ApellidosProp.ToUpper(),
                    NroDocumento = dto.NroDocProp,
                    IdTipoDocumento = dto.IdTipoDocProp,
                    IdRol = 3, // Propietario (CatRolCivil)
                    CodigoRegistro = "CIV-" + Guid.NewGuid().ToString().Substring(0,8),
                    RegistradoPor = usuarioId,
                    FechaRegistro = DateTime.UtcNow
                };
                _db.Civils.Add(nuevoCivil);
                await _db.SaveChangesAsync();
                idCivil = nuevoCivil.IdCivil;
            }

            var nuevoVehiculo = new Vehiculo 
            {
                Placa = dto.Placa.ToUpper(),
                Vin = dto.Vin,
                Marca = dto.Marca?.ToUpper(),
                Modelo = dto.Modelo?.ToUpper(),
                Anio = dto.Anio,
                Color = dto.Color?.ToUpper(),
                IdTipo = dto.IdTipo,
                IdEstado = 1, // Incautado
                IdCivil = idCivil,
                RegistradoPor = usuarioId,
                FechaRegistro = DateTime.UtcNow
            };

            _db.Vehiculos.Add(nuevoVehiculo);
            await _db.SaveChangesAsync();

            await _db.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Vehiculo', @registroId={nuevoVehiculo.IdVehiculo}, @valorNuevo={dto.Placa}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='Transporte'"
            );

            await transaction.CommitAsync();
            return Ok(new { message = "Vehículo y propietario registrados correctamente." });
        } 
        catch (Exception ex) 
        {
            await transaction.RollbackAsync();
            return BadRequest(new { message = ex.Message });
        }
    }

    // ── 2. ASIGNAR VEHÍCULO A OPERACIÓN ──
    [HttpPost("asignar")]
    public async Task<IActionResult> Asignar([FromBody] AsignacionVehiculoOp asignacion)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        asignacion.FechaAsignacion = DateTime.UtcNow;
        asignacion.AsignadoPor = usuarioId;

        _db.AsignacionVehiculoOps.Add(asignacion);
        
        var vehiculo = await _db.Vehiculos.FindAsync(asignacion.IdVehOp);
        if (vehiculo != null) vehiculo.IdEstado = 2; // Asignado a Operación

        await _db.SaveChangesAsync();
        return Ok(new { message = "Vehículo asignado a la misión táctica." });
    }

    // ── 3. REGISTRAR BAJA (INCINERADO / DESTRUIDO) ──
    [HttpPost("registrar-baja")]
    public async Task<IActionResult> RegistrarBaja([FromBody] BajaDto dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        var vehiculo = await _db.Vehiculos.FindAsync(dto.IdVehiculo);
        if (vehiculo == null) return NotFound(new { message = "Vehículo no encontrado." });

        vehiculo.IdEstado = dto.IdEstado; // 4=Incinerado, 5=Destruido
        
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=2, @tabla='Vehiculo', @registroId={dto.IdVehiculo}, @valorNuevo={dto.Motivo}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='Transporte'"
        );

        await _db.SaveChangesAsync();
        return Ok(new { message = "Baja de unidad registrada exitosamente." });
    }

    // ── 4. EXPORTAR INFORME SEGURO (Ruta: api/Transporte/exportar) ──
    [AllowAnonymous] // Permite la entrada de la petición de la pestaña limpia
    [HttpGet("exportar")]
    public async Task<IActionResult> Exportar([FromQuery] string? token)
    {
        // Si la petición no está autenticada por Header tradicional Y tampoco trae el token por URL, rechazar
        if (!User.Identity.IsAuthenticated && string.IsNullOrEmpty(token))
            return Unauthorized();

        // Extraemos los datos del DbSet de tu AppDbContext
        var datos = await _db.Vehiculos.ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Placa,VIN,Marca,Modelo,Anio,Color,Fecha Registro");

        foreach (var v in datos)
        {
            csv.AppendLine($"{v.Placa},{v.Vin},{v.Marca},{v.Modelo},{v.Anio},{v.Color},{v.FechaRegistro:dd/MM/yyyy}");
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"Reporte_Transporte_{DateTime.Now:yyyyMMdd}.csv");
    }

    // ── 5. CATÁLOGOS Y CONSULTAS ──
    [HttpGet("catalogos")]
    public async Task<IActionResult> GetCatalogos()
    {
        var tipos = await _db.CatTipoVehiculos.ToListAsync();
        var estados = await _db.CatEstadoVehiculos.ToListAsync();
        return Ok(new { tipos, estados });
    }

    [HttpGet("listar-activos")]
    public async Task<IActionResult> ListarActivos()
    {
        var lista = await _db.Vehiculos
            .Where(v => v.IdEstado == 1) // Solo incautados/disponibles
            .Select(v => new { v.IdVehiculo, v.Placa, v.Marca, v.Modelo })
            .ToListAsync();
        return Ok(lista);
    }
}

public class VehiculoFullDto
{
    public string Placa { get; set; } = null!;
    public string? Vin { get; set; }
    public string? Marca { get; set; }
    public string? Modelo { get; set; }
    public short? Anio { get; set; }
    public string? Color { get; set; }
    public byte IdTipo { get; set; }
    public string? NombresProp { get; set; }
    public string? ApellidosProp { get; set; }
    public string? NroDocProp { get; set; }
    public byte IdTipoDocProp { get; set; }
}

public class BajaDto 
{
    public int IdVehiculo { get; set; }
    public byte IdEstado { get; set; }
    public string Motivo { get; set; } = "";
}