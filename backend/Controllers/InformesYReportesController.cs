using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InformesYReportesController : ControllerBase
{
    private readonly AppDbContext _db;

    public InformesYReportesController(AppDbContext db) => _db = db;

    // ── CONFIGURACIÓN DE REPORTES SEGÚN CASOS DE USO (Filtros Avanzados) ──
    [HttpGet("generar-reporte")]
    public async Task<IActionResult> GenerarReporte(
        [FromQuery] byte tipoReporte, // 1=Operativos, 2=Comisos, 3=Casos, 4=General
        [FromQuery] short? idZona, 
        [FromQuery] byte? idCategoria, 
        [FromQuery] byte? idEstado,
        [FromQuery] string? fechaInicio,
        [FromQuery] string? fechaFin)
    {
        var resultado = new List<object>();
        try
        {
            using (var command = _db.Database.GetDbConnection().CreateCommand())
            {
                var query = new StringBuilder();

                if (tipoReporte == 1) // Generar reporte de operativos realizados
                {
                    query.Append(@"
                        SELECT o.idOperativo AS Id, o.codigoOperativo AS Codigo, o.descripcion AS Detalle, 
                               o.fechaInicio AS Fecha, co.descripcion AS Estado, z.nombre AS Lugar
                        FROM OperativoMilitar o
                        INNER JOIN CatEstadoOperativo co ON o.idEstado = co.id
                        LEFT JOIN CatZonaFronteriza z ON o.idZona = z.id
                        WHERE 1=1 ");
                    if (idZona.HasValue) query.Append($" AND o.idZona = {idZona.Value}");
                    if (idEstado.HasValue) query.Append($" AND o.idEstado = {idEstado.Value}");
                    if (!string.IsNullOrEmpty(fechaInicio)) query.Append($" AND o.fechaInicio >= '{fechaInicio}'");
                    if (!string.IsNullOrEmpty(fechaFin)) query.Append($" AND o.fechaInicio <= '{fechaFin}'");
                }
                else // Reportes de Comisos, Casos y Reporte General
                {
                    query.Append(@"
                        SELECT c.idComiso AS Id, c.codigoComiso AS Codigo, mi.tipoBien AS Detalle, 
                               c.fecha AS Fecha, ec.descripcion AS Estado, c.lugar AS Lugar, c.valorEstimadoTotal AS Valor
                        FROM Comiso c
                        INNER JOIN CatEstadoComiso ec ON c.idEstado = ec.id
                        LEFT JOIN CatZonaFronteriza z ON c.idZona = z.id
                        LEFT JOIN MaterialIncautado mi ON mi.idComiso = c.idComiso
                        WHERE 1=1 ");
                    if (idZona.HasValue) query.Append($" AND c.idZona = {idZona.Value}");
                    if (idEstado.HasValue) query.Append($" AND c.idEstado = {idEstado.Value}");
                    if (idCategoria.HasValue) query.Append($" AND mi.idCategoria = {idCategoria.Value}");
                    if (!string.IsNullOrEmpty(fechaInicio)) query.Append($" AND c.fecha >= '{fechaInicio}'");
                    if (!string.IsNullOrEmpty(fechaFin)) query.Append($" AND c.fecha <= '{fechaFin}'");
                    
                    if (tipoReporte == 3) query.Append(" AND c.idEstado IN (1, 3)"); // Filtrar por estado del caso (Activos y Cerrados)
                }

                command.CommandText = query.ToString();
                if (command.Connection.State != ConnectionState.Open) await command.Connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        resultado.Add(new {
                            id = reader["Id"],
                            codigo = reader["Codigo"]?.ToString(),
                            detalle = reader["Detalle"]?.ToString() ?? "Sin Datos",
                            fecha = reader["Fecha"] != DBNull.Value ? Convert.ToDateTime(reader["Fecha"]).ToString("yyyy-MM-dd") : "N/A",
                            estado = reader["Estado"]?.ToString(),
                            lugar = reader["Lugar"]?.ToString(),
                            valor = tipoReporte != 1 && reader["Valor"] != DBNull.Value ? Convert.ToDecimal(reader["Valor"]) : 0
                        });
                    }
                }
            }
            return Ok(resultado);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ── ESTADÍSTICAS COMPARATIVAS (Tiempo de cantidad de comisos y tipos de mercadería) ──
    [HttpGet("estadisticas-graficos")]
    public async Task<IActionResult> GetEstadisticasGraficos()
    {
        var porTiempo = new List<object>();
        var porMercaderia = new List<object>();
        var porDepartamento = new List<object>();

        using (var connection = _db.Database.GetDbConnection())
        {
            if (connection.State != ConnectionState.Open) await connection.OpenAsync();

            // Mostrar estadísticas comparativas por tiempo de cantidad de comisos
            using (var cmd1 = connection.CreateCommand())
            {
                cmd1.CommandText = "SELECT FORMAT(fecha, 'yyyy-MM') AS EjeX, COUNT(idComiso) AS Total FROM Comiso GROUP BY FORMAT(fecha, 'yyyy-MM')";
                using (var r = await cmd1.ExecuteReaderAsync())
                    while (await r.ReadAsync()) porTiempo.Add(new { label = r["EjeX"]?.ToString(), valor = r["Total"] });
            }

            // Mostrar estadísticas comparativas por tiempo de tipos de mercadería
            using (var cmd2 = connection.CreateCommand())
            {
                cmd2.CommandText = "SELECT cb.descripcion AS EjeX, COUNT(mi.idMaterial) AS Total FROM MaterialIncautado mi INNER JOIN CatCategoriaBien cb ON mi.idCategoria = cb.id GROUP BY cb.descripcion";
                using (var r = await cmd2.ExecuteReaderAsync())
                    while (await r.ReadAsync()) porMercaderia.Add(new { label = r["EjeX"]?.ToString(), valor = r["Total"] });
            }

            // Seleccionar departamento para ver sus estadísticas
            using (var cmd3 = connection.CreateCommand())
            {
                cmd3.CommandText = "SELECT ISNULL(z.departamento, 'RESERVA') AS Depto, COUNT(c.idComiso) AS Cant, SUM(c.valorEstimadoTotal) AS Total FROM Comiso c INNER JOIN CatZonaFronteriza z ON c.idZona = z.id GROUP BY z.departamento";
                using (var r = await cmd3.ExecuteReaderAsync())
                    while (await r.ReadAsync()) porDepartamento.Add(new { depto = r["Depto"]?.ToString(), comisos = r["Cant"], valor = r["Total"] });
            }
        }
        return Ok(new { porTiempo, porMercaderia, porDepartamento });
    }

    // ── GEOREFERENCIACIÓN (Ver mapa de incidencias y mapa de calor) ──
    [HttpGet("puntos-georeferenciados")]
    public async Task<IActionResult> GetPuntosGeoreferenciados()
    {
        var puntos = new List<object>();
        using (var command = _db.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = @"
                SELECT c.idComiso, c.codigoComiso, c.lugar, c.coordenadasLat, c.coordenadasLng, z.nombre AS Zona
                FROM Comiso c
                INNER JOIN CatZonaFronteriza z ON c.idZona = z.id
                WHERE c.coordenadasLat IS NOT NULL AND c.coordenadasLng IS NOT NULL";

            if (command.Connection.State != ConnectionState.Open) await command.Connection.OpenAsync();
            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    puntos.Add(new {
                        id = reader["idComiso"],
                        codigo = reader["codigoComiso"]?.ToString(),
                        lugar = reader["lugar"]?.ToString(),
                        lat = Convert.ToDouble(reader["coordenadasLat"]),
                        lng = Convert.ToDouble(reader["coordenadasLng"]),
                        zona = reader["Zona"]?.ToString()
                    });
                }
            }
        }
        return Ok(puntos);
    }
}