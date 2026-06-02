using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using System.Security.Claims;
using System.Text;
using System.Data;
using Microsoft.Data.SqlClient;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NovedadController : ControllerBase
{
    private readonly AppDbContext _db;

    public NovedadController(AppDbContext db) => _db = db;

    // ── 1. TOMA DE DATOS & REGISTRAR FORMULARIO ──────────────────────────────────
    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        // ── 2. VALIDACION DE DATOS ───────────────────────────────────────────────
        string descripcion = dto.GetProperty("descripcion").GetString();
        if (string.IsNullOrWhiteSpace(descripcion))
            return BadRequest(new { message = "La descripción del incidente es un requisito obligatorio." });

        byte idTipo = dto.GetProperty("idTipo").GetByte();
        byte idGravedad = dto.GetProperty("idGravedad").GetByte();
        
        int? idComiso = null;
        if (dto.TryGetProperty("idComiso", out System.Text.Json.JsonElement cEl) && cEl.ValueKind != System.Text.Json.JsonValueKind.Null)
            idComiso = cEl.GetInt32();

        int? idOperativo = null;
        if (dto.TryGetProperty("idOperativo", out System.Text.Json.JsonElement oEl) && oEl.ValueKind != System.Text.Json.JsonValueKind.Null)
            idOperativo = oEl.GetInt32();

        // Inserción directa via SQL para evitar errores de mapeo de clases por Scaffold
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO Novedad (idTipo, descripcion, fecha, idEstado, idGravedad, idComiso, idOperativo, registradoPor, fechaRegistro)
            VALUES ({idTipo}, {descripcion}, {DateTime.UtcNow}, 1, {idGravedad}, {idComiso}, {idOperativo}, {usuarioId}, {DateTime.UtcNow})
        ");

        // Obtener el ID recién creado para la bitácora
        var ultimoId = await _db.Database.SqlQuery<int>($"SELECT IDENT_CURRENT('Novedad') AS Value").FirstOrDefaultAsync();

        // Guardar en Bitácora (Sección 15 del SQL)
        string descCorta = descripcion.Substring(0, Math.Min(descripcion.Length, 50));
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Novedad', @registroId={ultimoId}, @valorNuevo={descCorta}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='NovedadesJuridicas'"
        );

        return Ok(new { message = "Formulario de novedad registrado.", idNovedad = ultimoId });
    }

    // ── 3. ADJUNTAR EVIDENCIA ────────────────────────────────────────────────────
    [HttpPost("adjuntar-evidencia")]
    public async Task<IActionResult> AdjuntarEvidencia([FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        int idNovedad = dto.GetProperty("idNovedad").GetInt32();
        string rutaArchivo = dto.GetProperty("rutaArchivo").GetString();
        string nombreOriginal = dto.GetProperty("nombreOriginal").GetString();

        if (string.IsNullOrEmpty(rutaArchivo))
            return BadRequest(new { message = "La ruta de la evidencia es inválida o vacía." });

        // Inserción limpia usando la estructura de la Sección 10 del script SQL
        await _db.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO NovEdadEvidencia (idNovedad, rutaArchivo, nombreOriginal, fechaSubida, subidoPor)
            VALUES ({idNovedad}, {rutaArchivo}, {nombreOriginal}, {DateTime.UtcNow}, {usuarioId})
        ");

        return Ok(new { message = "Evidencia legal adjuntada de forma correcta." });
    }

    // ── 4. CIERRE DE COMISOS / REGISTRO DE COMISO (ACTUALIZAR ESTADO) ───────────
    [HttpPut("cambiar-estado/{id}")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] dynamic dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        byte nuevoEstado = dto.GetProperty("idEstado").GetByte(); // 3 = Cerrada (Cierre de comisos)

        int filasAfectadas = await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE Novedad 
            SET idEstado = {nuevoEstado} 
            WHERE idNovedad = {id}
        ");

        if (filasAfectadas == 0) return NotFound(new { message = "El incidente jurídico no existe." });

        // Registrar acción en bitácora
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=2, @tabla='Novedad', @registroId={id}, @valorNuevo={$"Cierre de comiso / Estado {nuevoEstado}"}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='NovedadesJuridicas'"
        );

        return Ok(new { message = "Estado modificado. Operación de comiso procesada." });
    }

    // ── 5. CONSULTA Y LISTAR (Para las tablas de validación en la interfaz) ────
    [HttpGet("listar")]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _db.Database.SqlQuery<dynamic>($@"
            SELECT 
                n.idNovedad AS IdNovedad,
                t.descripcion AS Tipo,
                n.descripcion AS Descripcion,
                n.fecha AS Fecha,
                e.descripcion AS Estado,
                n.idEstado AS IdEstado,
                g.descripcion AS Gravedad,
                n.idComiso AS IdComiso,
                n.idOperativo AS IdOperativo
            FROM Novedad n
            INNER JOIN CatTipoNovedad t ON n.idTipo = t.id
            INNER JOIN CatEstadoNovedad e ON n.idEstado = e.id
            INNER JOIN CatNivelGravedad g ON n.idGravedad = g.id
        ").ToListAsync();

        return Ok(resultado);
    }

    // ── 6. GENERAR INFORME (BLINDADO A NIVEL ADO.NET CONTRA TABLAS VACÍAS) ──
    [AllowAnonymous]
    [HttpGet("exportar")]
    public async Task<IActionResult> Exportar([FromQuery] string? token)
    {
        if (string.IsNullOrEmpty(token)) return Unauthorized();

        var csv = new StringBuilder();
        csv.AppendLine('\uFEFF' + "ID,Tipo de Incidente,Relación de Hechos,Fecha Registro,Estado");

        try
        {
            // Bajamos a ADO.NET puro usando la conexión existente de EF Core.
            // Esto salta el Shaper/Parser de Linq que genera el "Sequence contains no elements".
            using (var command = _db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                    SELECT n.idNovedad, t.descripcion AS Tipo, n.descripcion, n.fecha, e.descripcion AS Estado
                    FROM Novedad n
                    INNER JOIN CatTipoNovedad t ON n.idTipo = t.id
                    INNER JOIN CatEstadoNovedad e ON n.idEstado = e.id";
                
                command.CommandType = CommandType.Text;
                
                if (command.Connection.State != ConnectionState.Open)
                    await command.Connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    bool tieneRegistros = false;
                    while (await reader.ReadAsync())
                    {
                        tieneRegistros = true;
                        var id = reader["idNovedad"];
                        var tipo = reader["Tipo"];
                        var desc = reader["descripcion"]?.ToString()?.Replace(",", ";").Replace("\r", " ").Replace("\n", " ") ?? "";
                        var fecha = reader["fecha"] != DBNull.Value ? Convert.ToDateTime(reader["fecha"]).ToString("dd/MM/yyyy") : "N/A";
                        var estado = reader["Estado"];

                        csv.AppendLine($"{id},{tipo},{desc},{fecha},{estado}");
                    }

                    // Si no entró al bucle while, la tabla está vacía y enviamos el reporte preventivo
                    if (!tieneRegistros)
                    {
                        csv.AppendLine("0,SISTEMA,No se encontraron incidentes registrados en la base de datos,N/A,SIN REGISTROS");
                    }
                }
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"Informe_Novedades_Incidentes_{DateTime.Now:yyyyMMdd}.csv");
        }
        catch (Exception ex)
        {
            // Si algo truena aquí, es que la base de datos está caída o el string de conexión murió
            return BadRequest(new { message = "Fallo crítico en la infraestructura de datos.", detalle = ex.Message });
        }
    }
}