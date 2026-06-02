using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using System.Security.Claims;
using System.Text;
using System.Data;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PersonalController : ControllerBase
{
    private readonly AppDbContext _db;

    public PersonalController(AppDbContext db) => _db = db;

    // ── 1. REGISTRAR DATOS DE EFECTIVO (CORREGIDO) ──────────────────────────────
    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        string codigoPersonal = dto.GetProperty("codigoPersonal").GetString();
        string nombres = dto.GetProperty("nombres").GetString();
        string apellidos = dto.GetProperty("apellidos").GetString();
        string grado = dto.GetProperty("grado").GetString();
        string unidadOrigen = dto.GetProperty("unidadOrigen").GetString();

        // FIX: Tipado explícito para evitar error de image_a7b2cc.png
        short? idZona = null;
        if (dto.TryGetProperty("idZona", out System.Text.Json.JsonElement zEl) && zEl.ValueKind != System.Text.Json.JsonValueKind.Null)
        {
            idZona = zEl.GetInt16();
        }

        if (string.IsNullOrWhiteSpace(codigoPersonal))
            return BadRequest(new { message = "El código institucional es obligatorio." });

        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO Efectivo (codigoPersonal, nombres, apellidos, grado, unidadOrigen, idZona, idEstado, fechaIngreso, fechaCreacion, creadoPor)
            VALUES ({codigoPersonal}, {nombres}, {apellidos}, {grado}, {unidadOrigen}, {idZona}, 1, CAST(GETDATE() AS DATE), GETDATE(), {usuarioId})
        ");

        var idEfectivo = await _db.Database.SqlQuery<int>($"SELECT IDENT_CURRENT('Efectivo') AS Value").FirstOrDefaultAsync();

        // Inicializar Hoja de Vida Táctica (Sección 3 y 13 del SQL)
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO HojaVidaTactica (idEfectivo, totalOperativos, observaciones, ultimaActualizacion)
            VALUES ({idEfectivo}, 0, 'Registro inicial', GETDATE())
        ");

        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Efectivo', @registroId={idEfectivo}, @valorNuevo={codigoPersonal}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='GestionPersonal'"
        );

        return Ok(new { message = "Efectivo registrado.", idEfectivo });
    }

    // ── 2. REGISTRAR DESPLIEGUE (CORREGIDO) ─────────────────────────────────────
    [HttpPost("registrar-despliegue")]
    public async Task<IActionResult> RegistrarDespliegue([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int usuarioId = int.Parse(claimId!);

        int idEfectivo = dto.GetProperty("idEfectivo").GetInt32();
        short idZona = dto.GetProperty("idZona").GetInt16();
        string observaciones = dto.GetProperty("observaciones").GetString();

        // FIX: Tipado explícito para evitar error de image_a7b2cc.png
        int? idGrupo = null;
        if (dto.TryGetProperty("idGrupo", out System.Text.Json.JsonElement gEl) && gEl.ValueKind != System.Text.Json.JsonValueKind.Null)
        {
            idGrupo = gEl.GetInt32();
        }

        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO Despliegue (idEfectivo, idGrupo, idZona, fechaInicio, idEstado, observaciones, registradoPor, fechaRegistro)
            VALUES ({idEfectivo}, {idGrupo}, {idZona}, CAST(GETDATE() AS DATE), 2, {observaciones}, {usuarioId}, GETDATE())
        ");

        // Actualizar estado maestro y HVT (Sección 3 y 13 del SQL)
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE Efectivo SET idZona = {idZona}, idEstado = 3 WHERE idEfectivo = {idEfectivo};
            UPDATE HojaVidaTactica SET fechaUltimoDespliegue = CAST(GETDATE() AS DATE), totalOperativos = totalOperativos + 1, ultimaActualizacion = GETDATE() WHERE idEfectivo = {idEfectivo};
        ");

        return Ok(new { message = "Despliegue fronterizo registrado." });
    }

    // ── 3. BUSCAR / MOSTRAR DATOS DEL EFECTIVO ──────────────────────────────────
    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar([FromQuery] string codigo)
    {
        using (var command = _db.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = @"
                SELECT 
                    e.idEfectivo, e.codigoPersonal, e.nombres, e.apellidos, e.grado, e.unidadOrigen,
                    ee.descripcion AS Estado, ISNULL(z.nombre, 'Sin Zona') AS ZonaAsignada,
                    h.totalOperativos, h.fechaUltimoDespliegue
                FROM Efectivo e
                INNER JOIN CatEstadoEfectivo ee ON e.idEstado = ee.id
                LEFT JOIN CatZonaFronteriza z ON e.idZona = z.id
                LEFT JOIN HojaVidaTactica h ON e.idEfectivo = h.idEfectivo
                WHERE e.codigoPersonal = @codigo";
            
            var p = command.CreateParameter();
            p.ParameterName = "@codigo";
            p.Value = codigo;
            command.Parameters.Add(p);

            if (command.Connection.State != ConnectionState.Open) await command.Connection.OpenAsync();

            using (var reader = await command.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    return Ok(new {
                        IdEfectivo = reader["idEfectivo"],
                        CodigoPersonal = reader["codigoPersonal"],
                        Nombres = reader["nombres"],
                        Apellidos = reader["apellidos"],
                        Grado = reader["grado"],
                        Estado = reader["Estado"],
                        ZonaAsignada = reader["ZonaAsignada"],
                        TotalOperativos = reader["totalOperativos"]
                    });
                }
            }
        }
        return NotFound(new { message = "Efectivo no encontrado." });
    }

    // ── 4. EXPORTAR REPORTE (BLINDADO) ──────────────────────────────────────────
    [AllowAnonymous]
    [HttpGet("exportar")]
    public async Task<IActionResult> Exportar([FromQuery] string? token)
    {
        if (string.IsNullOrEmpty(token)) return Unauthorized();

        var csv = new StringBuilder();
        csv.AppendLine('\uFEFF' + "Código,Nombres,Apellidos,Grado,Unidad,Estado,Zona");

        using (var command = _db.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = @"
                SELECT e.codigoPersonal, e.nombres, e.apellidos, e.grado, e.unidadOrigen, ee.descripcion AS Estado, ISNULL(z.nombre, 'RESERVA') AS Zona
                FROM Efectivo e
                INNER JOIN CatEstadoEfectivo ee ON e.idEstado = ee.id
                LEFT JOIN CatZonaFronteriza z ON e.idZona = z.id";

            if (command.Connection.State != ConnectionState.Open) await command.Connection.OpenAsync();

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    csv.AppendLine($"{reader["codigoPersonal"]},{reader["nombres"]},{reader["apellidos"]},{reader["grado"]},{reader["unidadOrigen"]},{reader["Estado"]},{reader["Zona"]}");
                }
            }
        }
        return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "Reporte_Personal.csv");
    }
}