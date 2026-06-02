using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using SCLCC.Backend.Models; 
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediosTransporteController : ControllerBase
{
    private readonly AppDbContext _db;

    public MediosTransporteController(AppDbContext db) => _db = db;

    // ── FASE 1/2: Ficha de Medio de Transporte ──
    [HttpGet("flota")]
    public async Task<IActionResult> GetFlota()
    {
        try
        {
            // Sincronizado con PascalCase exacto de tus entidades autogeneradas
            var flota = await _db.VehiculoOperativos
                .Select(v => new {
                    id = v.IdVehOp, // Con 'I' y 'V' mayúsculas según tu llave primaria
                    placa = v.Placa,
                    marca = v.Marca,
                    modelo = v.Modelo,
                    kilometraje = v.Kilometraje,
                    idTipo = v.IdTipo, 
                    idEstado = v.IdEstado 
                })
                .ToListAsync();

            return Ok(flota);
        }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    // ── Evaluación de Aptitud (¿Vehículo apto?) ──
    [HttpPost("evaluar-ficha")]
    public async Task<IActionResult> EvaluarVehiculo([FromBody] EvaluacionVehiculoDto dto)
    {
        var vehiculo = await _db.VehiculoOperativos.FindAsync(dto.IdVehiculo);
        if (vehiculo == null) return NotFound("Vehículo no encontrado en el parque automotor.");

        // Modificando las propiedades con mayúsculas de tu modelo
        vehiculo.IdEstado = dto.EsApto ? (byte)1 : (byte)3;
        vehiculo.Kilometraje = dto.KilometrajeActual;
        
        await _db.SaveChangesAsync();
        return Ok(new { message = "Ficha vehicular actualizada correctamente." });
    }

    // ── FASE 3: Asignación y Control durante el operativo ──
    [HttpPost("asignar")]
    public async Task<IActionResult> AsignarAOperativo([FromBody] AsignacionDto dto)
    {
        var vehiculo = await _db.VehiculoOperativos.FindAsync(dto.IdVehiculo);
        if (vehiculo == null || vehiculo.IdEstado != 1) 
            return BadRequest("El vehículo no existe o no se encuentra disponible (APTO).");

        var operativo = await _db.OperativoMilitars.FindAsync(dto.IdOperativo);
        if (operativo == null) return BadRequest("El operativo militar especificado no existe.");

        // Recuperar ID de usuario de forma segura
        var claimId = User.FindFirst("idUsuario")?.Value ?? User.FindFirst("rol_id")?.Value;
        int.TryParse(claimId, out int idUsuarioAsignador);

        // Instancia del modelo respetando las mayúsculas del scaffolding
        var asignacion = new AsignacionVehiculoOp {
            IdVehOp = dto.IdVehiculo,
            IdOperativo = dto.IdOperativo,
            FechaAsignacion = DateTime.UtcNow
        };
        
        if (idUsuarioAsignador > 0) asignacion.AsignadoPor = idUsuarioAsignador;

        vehiculo.IdEstado = 2; // Estado: Asignado a Operación

        _db.AsignacionVehiculoOps.Add(asignacion);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Vehículo desplegado exitosamente al teatro de operaciones." });
    }

    // ── FASE 4: Cierre del operativo y parte vehicular ──
    [HttpPost("cerrar-parte")]
    public async Task<IActionResult> CerrarParteVehicular([FromBody] CierreParteDto dto)
    {
        // Consulta usando las propiedades mapeadas por tu DbContext
        var asignacion = await _db.AsignacionVehiculoOps
            .Where(a => a.IdVehOp == dto.IdVehiculo && a.FechaDevolucion == null)
            .OrderByDescending(a => a.FechaAsignacion)
            .FirstOrDefaultAsync();

        if (asignacion == null) return BadRequest("El vehículo no cuenta con un despliegue operativo activo.");

        var vehiculo = await _db.VehiculoOperativos.FindAsync(dto.IdVehiculo);
        
        asignacion.FechaDevolucion = DateTime.UtcNow;
        vehiculo.Kilometraje = dto.KilometrajeFinal;
        
        // 3 = En Deposito/Mantenimiento, 1 = Disponible/Apto de nuevo
        vehiculo.IdEstado = dto.RequiereMantenimiento ? (byte)3 : (byte)1;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Parte vehicular cerrado. Registro de misión finalizado." });
    }
}

// ── Data Transfer Objects (DTOs) ──
public class EvaluacionVehiculoDto { public int IdVehiculo { get; set; } public bool EsApto { get; set; } public int KilometrajeActual { get; set; } }
public class AsignacionDto { public int IdVehiculo { get; set; } public int IdOperativo { get; set; } }
public class CierreParteDto { public int IdVehiculo { get; set; } public int KilometrajeFinal { get; set; } public bool RequiereMantenimiento { get; set; } }