using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SCLCC.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumenDashboard()
    {
        try
        {
            using var command = _db.Database.GetDbConnection().CreateCommand();
            
            // ── LOTE SQL OPTIMIZADO (5 consultas en 1 viaje a la DB) ──
            command.CommandText = @"
                -- 0: KPIs (Efectivos activos, Vehículos totales, Valor Comisos mes actual, Novedades Críticas abiertas)
                SELECT 
                    (SELECT COUNT(*) FROM Efectivo WHERE idEstado = 1) AS efectivos,
                    (SELECT COUNT(*) FROM VehiculoOperativo) AS vehiculosOp,
                    (SELECT ISNULL(SUM(valorEstimadoTotal), 0) FROM Comiso WHERE MONTH(fecha) = MONTH(GETDATE()) AND YEAR(fecha) = YEAR(GETDATE())) AS valorIncautado,
                    (SELECT COUNT(*) FROM Novedad WHERE idGravedad = 4 AND idEstado IN (1,2)) AS novedadesCriticas;

                -- 1: Gráfico de Comisos (Evolución anual sumando valoración en Bs)
                SELECT FORMAT(fecha, 'MMM', 'es-ES') AS mes, MONTH(fecha) AS numMes, ISNULL(SUM(valorEstimadoTotal), 0) AS valor
                FROM Comiso
                WHERE YEAR(fecha) = YEAR(GETDATE())
                GROUP BY FORMAT(fecha, 'MMM', 'es-ES'), MONTH(fecha)
                ORDER BY numMes;

                -- 2: Gráfico de Zonas (Top 5 Operativos por Zona en el año actual)
                SELECT TOP 5 z.nombre AS zona, COUNT(o.idOperativo) AS operativos
                FROM OperativoMilitar o
                INNER JOIN CatZonaFronteriza z ON o.idZona = z.id
                WHERE YEAR(o.fechaInicio) = YEAR(GETDATE())
                GROUP BY z.nombre
                ORDER BY operativos DESC;

                -- 3: Estado Logístico (Parque Automotor Institucional)
                SELECT c.id AS idEstado, c.descripcion AS nombre, COUNT(v.idVehOp) AS cantidad
                FROM VehiculoOperativo v
                INNER JOIN CatEstadoVehiculo c ON v.idEstado = c.id
                GROUP BY c.id, c.descripcion;

                -- 4: Usuarios Activos (Sesiones Online Vivas)
                SELECT TOP 5 u.idUsuario AS id, u.nombres + ' ' + u.apellidos AS nombre, r.nombre AS rol, s.ipOrigen AS ip
                FROM SesionActiva s
                INNER JOIN Usuario u ON s.idUsuario = u.idUsuario
                INNER JOIN CatRol r ON u.idRol = r.id
                WHERE s.idEstado = 1
                ORDER BY s.ultimaActividad DESC;
            ";

            if (command.Connection.State != ConnectionState.Open) await command.Connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            // ── RESULT SET 0: KPIs ──
            await reader.ReadAsync();
            var kpis = new
            {
                efectivos = reader.GetInt32(0),
                vehiculosOp = reader.GetInt32(1),
                valorIncautado = reader.GetDecimal(2),
                novedadesCriticas = reader.GetInt32(3)
            };

            // ── RESULT SET 1: Evolución Comisos ──
            await reader.NextResultAsync();
            var graficoComisos = new List<object>();
            while (await reader.ReadAsync())
            {
                graficoComisos.Add(new {
                    mes = reader["mes"].ToString()?.ToUpper(),
                    valor = Convert.ToDecimal(reader["valor"])
                });
            }

            // ── RESULT SET 2: Zonas Tácticas ──
            await reader.NextResultAsync();
            var graficoZonas = new List<object>();
            while (await reader.ReadAsync())
            {
                graficoZonas.Add(new {
                    zona = reader["zona"].ToString(),
                    operativos = Convert.ToInt32(reader["operativos"])
                });
            }

            // ── RESULT SET 3: Logística (Cálculo de Porcentajes y Colores) ──
            await reader.NextResultAsync();
            var estadoLogistico = new List<object>();
            decimal totalVehiculos = kpis.vehiculosOp == 0 ? 1 : kpis.vehiculosOp; // Evitar división por cero
            
            while (await reader.ReadAsync())
            {
                int idEstado = Convert.ToInt32(reader["idEstado"]);
                decimal cantidad = Convert.ToDecimal(reader["cantidad"]);
                
                // Asignación de colores HEX basada en la gravedad del estado de tu base de datos
                string color = idEstado switch {
                    2 => "#10b981", // Asignado a Operacion (Verde Operativo)
                    3 => "#f59e0b", // En Deposito / Mantenimiento (Ambar)
                    4 or 5 => "#ef4444", // Incinerado / Destruido (Rojo Crítico)
                    _ => "#64748b"  // Estado genérico (Gris)
                };

                estadoLogistico.Add(new {
                    name = reader["nombre"].ToString(),
                    value = Math.Round((cantidad / totalVehiculos) * 100, 1), // Lo mandamos ya calculado al frontend
                    color
                });
            }

            // ── RESULT SET 4: Sesiones Activas ──
            await reader.NextResultAsync();
            var usuariosActivos = new List<object>();
            while (await reader.ReadAsync())
            {
                usuariosActivos.Add(new {
                    id = Convert.ToInt32(reader["id"]),
                    nombre = reader["nombre"].ToString(),
                    rol = reader["rol"].ToString(),
                    ip = reader["ip"].ToString()
                });
            }

            return Ok(new {
                kpis,
                graficoComisos,
                graficoZonas,
                estadoLogistico,
                usuariosActivos
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Fallo crítico al extraer datos de inteligencia.", detalle = ex.Message });
        }
    }
}