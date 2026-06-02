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
public class OperacionController : ControllerBase
{
    private readonly AppDbContext _db;

    public OperacionController(AppDbContext db) => _db = db;

    // ── 1. REGISTRO DE LA ORDEN DE OPERACIÓN / OPERATIVO MILITAR ────────────────
    [HttpPost("registrar-operativo")]
    public async Task<IActionResult> RegistrarOperativo([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        string codigoOperativo = dto.GetProperty("codigoOperativo").GetString();
        byte idTipo = dto.GetProperty("idTipo").GetByte();
        short? idZona = null;
        if (dto.TryGetProperty("idZona", out System.Text.Json.JsonElement zEl) && zEl.ValueKind != System.Text.Json.JsonValueKind.Null)
        {
            idZona = zEl.GetInt16();
        }
        string descripcion = dto.GetProperty("descripcion").GetString();
        int? idGrupo = null;
        if (dto.TryGetProperty("idGrupo", out System.Text.Json.JsonElement gEl) && gEl.ValueKind != System.Text.Json.JsonValueKind.Null)
        {
            idGrupo = gEl.GetInt32();
        }
        // Inserción limpia en OperativoMilitar (Sección 5 de la DB)
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO OperativoMilitar (codigoOperativo, idTipo, idZona, fechaInicio, descripcion, idEstado, idGrupo, registradoPor, fechaRegistro)
            VALUES ({codigoOperativo}, {idTipo}, {idZona}, {DateTime.UtcNow}, {descripcion}, 1, {idGrupo}, {usuarioId}, {DateTime.UtcNow})
        ");

        var idOp = await _db.Database.SqlQuery<int>($"SELECT IDENT_CURRENT('OperativoMilitar') AS Value").FirstOrDefaultAsync();

        // Auditoría automática en bitácora
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=1, @tabla='OperativoMilitar', @registroId={idOp}, @valorNuevo={codigoOperativo}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='GestionOperaciones'"
        );

        return Ok(new { message = "Orden de operación registrada de forma táctica.", idOperativo = idOp });
    }

    // ── 2. ORGANIZACIÓN DEL PERSONAL (ASIGNAR EFECTIVOS A LA MISIÓN) ───────────
    [HttpPost("asignar-personal")]
    public async Task<IActionResult> AsignarPersonal([FromBody] dynamic dto)
    {
        int idOperativo = dto.GetProperty("idOperativo").GetInt32();
        int idEfectivo = dto.GetProperty("idEfectivo").GetInt32();
        string rol = dto.GetProperty("rol").GetString() ?? "Patrullero";

        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO OperativoEfectivo (idOperativo, idEfectivo, rol)
            VALUES ({idOperativo}, {idEfectivo}, {rol})
        ");

        return Ok(new { message = "Personal militar desplegado y organizado en el operativo." });
    }

    // ── 3. PLANIFICACIÓN DE ÍTEMS / GESTIÓN DEL PARQUE AUTOMOTOR ────────────────
    [HttpPost("asignar-vehiculo")]
    public async Task<IActionResult> AsignarVehiculo([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int usuarioId = int.Parse(claimId!);

        int idVehOp = dto.GetProperty("idVehOp").GetInt32();
        int idOperativo = dto.GetProperty("idOperativo").GetInt32();

        // Registrar la asignación logística de la patrulla institucional
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO AsignacionVehiculoOp (idVehOp, idOperativo, fechaAsignacion, asignadoPor)
            VALUES ({idVehOp}, {idOperativo}, {DateTime.UtcNow}, {usuarioId})
        ");

        return Ok(new { message = "Vehículo operativo asignado correctamente a la columna." });
    }

    // ── 4. REGISTRO DE LA ORDEN DEL DÍA EN LA BASE DE DATOS ─────────────────────
    [HttpPost("registrar-orden-dia")]
    public async Task<IActionResult> RegistrarOrdenDia([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int usuarioId = int.Parse(claimId!);

        string descripcion = dto.GetProperty("descripcion").GetString();
        int idOperativo = dto.GetProperty("idOperativo").GetInt32();

        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO OrdenDia (fecha, descripcion, idEstado, firmado, idOperativo, creadoPor, fechaCreacion)
            VALUES ({DateTime.UtcNow.ToString("yyyy-MM-dd")}, {descripcion}, 1, 0, {idOperativo}, {usuarioId}, {DateTime.UtcNow})
        ");

        return Ok(new { message = "Orden del día registrada en la base de datos en estado Borrador." });
    }

    // ── 5. VERIFICACIÓN DE LA ORDEN DEL DÍA (FIRMA Y CAMBIO DE ESTADO) ──────────
    [HttpPut("verificar-orden/{id}")]
    public async Task<IActionResult> VerificarOrden(int id, [FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int usuarioId = int.Parse(claimId!);
        
        string personalFirma = dto.GetProperty("personalFirma").GetString();

        // Cambia estado a 2 (Verificado según CatEstadoOrden) y asienta la firma militar
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE OrdenDia 
            SET idEstado = 2, firmado = 1, personalFirma = {personalFirma}, idJefeOperaciones = {usuarioId}
            WHERE idOrden = {id}
        ");

        return Ok(new { message = "Orden del día verificada, firmada y publicada en el comando." });
    }

    // ── 6. CONSULTA GENERAL DE OPERACIONES (TABLA RECTANGULAR BLINDADA) ────────
    [HttpGet("listar-operaciones")]
    public async Task<IActionResult> ListarOperaciones()
    {
        var resultado = new List<object>();

        using (var command = _db.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = @"
                SELECT 
                    o.idOperativo, o.codigoOperativo, o.descripcion, o.fechaInicio,
                    co.descripcion AS Estado, o.idEstado,
                    ct.descripcion AS Tipo
                FROM OperativoMilitar o
                INNER JOIN CatEstadoOperativo co ON o.idEstado = co.id
                INNER JOIN CatTipoOperativo ct ON o.idTipo = ct.id";
            
            command.CommandType = CommandType.Text;
            if (command.Connection.State != ConnectionState.Open)
                await command.Connection.OpenAsync();

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    resultado.Add(new {
                        IdOperativo = reader["idOperativo"],
                        CodigoOperativo = reader["codigoOperativo"]?.ToString(),
                        Descripcion = reader["descripcion"]?.ToString(),
                        FechaInicio = reader["fechaInicio"] != DBNull.Value ? Convert.ToDateTime(reader["fechaInicio"]).ToString("yyyy-MM-dd HH:mm") : "N/A",
                        Estado = reader["Estado"]?.ToString(),
                        IdEstado = reader["idEstado"],
                        Tipo = reader["Tipo"]?.ToString()
                    });
                }
            }
        }

        return Ok(resultado);
    }
}