using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

// Asegúrate de que estos usings coincidan con tus carpetas reales
using SCLCC.Backend.Data;
using SCLCC.Backend.Models; 

namespace SCLCC.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IncautacionController : ControllerBase
    {
        private readonly AppDbContext _db;

        public IncautacionController(AppDbContext db)
        {
            _db = db;
        }

        // ── 1. REGISTRAR COMISO Y DETALLE DE MATERIAL (Sección 9) ──────────────────
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] ComisoFullCreateDto dto)
        {
            var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claimId == null) return Unauthorized();
            int usuarioId = int.Parse(claimId);

            using var transaction = await _db.Database.BeginTransactionAsync();

            try 
            {
                // A. Cabecera en la tabla 'Comiso'
                var nuevoComiso = new Comiso
                {
                    CodigoComiso = "CM-" + DateTime.Now.Ticks.ToString().Substring(10), 
                    Fecha = DateTime.UtcNow,
                    Lugar = dto.Lugar,
                    IdZona = dto.IdZona,
                    CoordenadasLat = dto.Latitud,
                    CoordenadasLng = dto.Longitud,
                    IdEstado = 1, // 1 = Abierto[cite: 2]
                    IdOperativo = dto.IdOperativo,
                    IdGrupo = dto.IdGrupo,
                    RegistradoPor = usuarioId,
                    FechaRegistro = DateTime.UtcNow
                };

                // Según tu AppDbContext el DbSet es plural
                _db.Comisos.Add(nuevoComiso); 
                await _db.SaveChangesAsync();

                // B. Detalle en la tabla 'MaterialIncautado'
                var detalleMaterial = new MaterialIncautado
                {
                    IdComiso = nuevoComiso.IdComiso,
                    TipoBien = dto.TipoBien,
                    IdCategoria = dto.IdCategoria, 
                    Cantidad = dto.Cantidad,
                    UnidadMedida = dto.UnidadMedida,
                    Descripcion = dto.DescripcionDetallada,
                    ValorUnitario = dto.ValorUnitario,
                    IdEstadoFisico = dto.IdEstadoFisico, 
                    RegistradoPor = usuarioId,
                    FechaRegistro = DateTime.UtcNow
                };

                // Según tu AppDbContext el DbSet es plural
                _db.MaterialIncautados.Add(detalleMaterial); 
                await _db.SaveChangesAsync();

                // ── AUDITORÍA: sp_RegistrarBitacora ──
                string jsonDetalle = $"{{\"Codigo\":\"{nuevoComiso.CodigoComiso}\"}}";
                string ipLocal = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

                await _db.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Comiso', @registroId={nuevoComiso.IdComiso}, @valorAnterior=NULL, @valorNuevo={jsonDetalle}, @ip={ipLocal}, @idUsuario={usuarioId}, @modulo='Incautacion'"
                );

                await transaction.CommitAsync();
                return Ok(new { id = nuevoComiso.IdComiso, codigo = nuevoComiso.CodigoComiso });
            }
            catch (Exception ex) 
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = ex.Message }); 
            }
        }

        // ── 2. CATÁLOGOS (Corregido según DbSet de AppDbContext) ──────────────────
        [HttpGet("catalogos")]
        public async Task<IActionResult> GetCatalogos()
        {
            // Nota: En C# usamos PascalCase para las propiedades de las entidades
            var categorias = await _db.CatCategoriaBiens
                .Select(c => new { id = c.Id, descripcion = c.Descripcion }).ToListAsync();

            var zonas = await _db.CatZonaFronterizas
                .Where(z => z.Activa == true)
                .Select(z => new { id = z.Id, nombre = z.Nombre }).ToListAsync();

            var operativos = await _db.OperativoMilitars
                .Where(o => o.IdEstado == 2) // 2 = En Ejecucion[cite: 2]
                .Select(o => new { id = o.IdOperativo, codigo = o.CodigoOperativo }).ToListAsync();

            return Ok(new { categorias, zonas, operativos });
        }

        // ── 3. LISTAR COMISOS (Usando DbSet Comisos) ──────────────────────────────
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            var lista = await _db.Comisos
                .Include(c => c.RegistradoPorNavigation)
                .Include(c => c.IdZonaNavigation)
                .Select(c => new {
                    idComiso = c.IdComiso,
                    codigoComiso = c.CodigoComiso,
                    fecha = c.Fecha,
                    lugar = c.Lugar,
                    zona = c.IdZonaNavigation != null ? c.IdZonaNavigation.Nombre : "N/A",
                    registradoPor = c.RegistradoPorNavigation != null ? (c.RegistradoPorNavigation.Nombres + " " + c.RegistradoPorNavigation.Apellidos) : "Sistema"
                }).ToListAsync();

            return Ok(lista);
        }

        // ── 4. ADJUNTAR EVIDENCIA FOTOGRÁFICA (Tabla Fotografia) ──────────────────
        [HttpPost("subir-foto")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubirFoto([FromForm] IFormFile archivo, [FromForm] int comisoId)
        {
            var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claimId == null) return Unauthorized();
            int usuarioId = int.Parse(claimId);

            if (archivo == null || archivo.Length == 0)
                return BadRequest(new { message = "Archivo no válido." });

            try
            {
                var carpetaUploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(carpetaUploads)) Directory.CreateDirectory(carpetaUploads);

                var nombreUnico = $"{Guid.NewGuid()}_{Path.GetFileName(archivo.FileName)}";
                var rutaCompleta = Path.Combine(carpetaUploads, nombreUnico);

                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                // Según AppDbContext, la entidad se llama 'Fotografium' y el DbSet es 'Fotografia'
                var nuevaFoto = new Fotografium
                {
                    EntidadTipo = "MaterialIncautado",
                    EntidadId = comisoId,
                    RutaArchivo = $"/uploads/{nombreUnico}",
                    NombreOriginal = archivo.FileName,
                    FechaSubida = DateTime.UtcNow,
                    SubidoPor = usuarioId
                };

                _db.Fotografia.Add(nuevaFoto); // DbSet se llama Fotografia en singular[cite: 3]
                await _db.SaveChangesAsync();

                string jsonFoto = $"{{\"Archivo\":\"{nombreUnico}\"}}";
                string ipLocal = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

                await _db.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC sp_RegistrarBitacora @accion=1, @tabla='Fotografia', @registroId={nuevaFoto.Id}, @valorAnterior=NULL, @valorNuevo={jsonFoto}, @ip={ipLocal}, @idUsuario={usuarioId}, @modulo='Incautacion'"
                );

                return Ok(new { message = "Foto guardada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class ComisoFullCreateDto
    {
        public string Lugar { get; set; } = string.Empty;
        public short IdZona { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public int IdOperativo { get; set; }
        public int? IdGrupo { get; set; }
        public string TipoBien { get; set; } = string.Empty;
        public byte IdCategoria { get; set; }
        public decimal Cantidad { get; set; }
        public string UnidadMedida { get; set; } = string.Empty;
        public string DescripcionDetallada { get; set; } = string.Empty;
        public decimal ValorUnitario { get; set; }
        public byte IdEstadoFisico { get; set; }
    }
}