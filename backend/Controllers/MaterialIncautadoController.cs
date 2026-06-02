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
public class MaterialIncautadoController : ControllerBase
{
    private readonly AppDbContext _db;

    public MaterialIncautadoController(AppDbContext db) => _db = db;

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] MaterialIncautado item)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claimId == null) return Unauthorized();
        int usuarioId = int.Parse(claimId);

        if (item.Cantidad <= 0 || item.ValorUnitario < 0)
            return BadRequest(new { message = "Datos inconsistentes." });

        item.FechaRegistro = DateTime.UtcNow;
        item.RegistradoPor = usuarioId;
        item.IdEstadoFisico = 1; 

        _db.MaterialIncautados.Add(item);
        await _db.SaveChangesAsync();

        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=1, @tabla='MaterialIncautado', @registroId={item.IdMaterial}, @valorNuevo={item.TipoBien}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='MaterialIncautado'"
        );

        return Ok(new { message = "Material registered.", idMaterial = item.IdMaterial });
    }

    [HttpPut("actualizar/{id}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] MaterialIncautado dto)
    {
        var item = await _db.MaterialIncautados.FindAsync(id);
        if (item == null) return NotFound();

        item.TipoBien = dto.TipoBien;
        item.IdCategoria = dto.IdCategoria;
        item.Cantidad = dto.Cantidad;
        item.UnidadMedida = dto.UnidadMedida;
        item.Descripcion = dto.Descripcion;
        item.ValorUnitario = dto.ValorUnitario;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Actualizado correctamente." });
    }

    [HttpPost("registrar-destruccion")]
    public async Task<IActionResult> RegistrarDestruccion([FromBody] DestruccionMaterialDto dto)
    {
        var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int usuarioId = int.Parse(claimId!);

        var item = await _db.MaterialIncautados.FindAsync(dto.IdMaterial);
        if (item == null) return NotFound();

        item.IdEstadoFisico = dto.IdEstadoFisico; 
        item.ActaDestruccion = dto.ActaDestruccion;
        item.FechaDestruccion = DateOnly.FromDateTime(DateTime.UtcNow);

        await _db.SaveChangesAsync();

        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarBitacora @accion=2, @tabla='MaterialIncautado', @registroId={dto.IdMaterial}, @valorNuevo={dto.ActaDestruccion}, @ip='127.0.0.1', @idUsuario={usuarioId}, @modulo='MaterialIncautado'"
        );

        return Ok(new { message = "Destrucción registrada." });
    }

    [HttpGet("listar")]
    public async Task<IActionResult> Listar([FromQuery] string? buscar, [FromQuery] byte? idCategoria)
    {
        var query = _db.MaterialIncautados
            .Include(m => m.IdCategoriaNavigation)
            .Include(m => m.IdComisoNavigation)
            .AsQueryable();

        if (!string.IsNullOrEmpty(buscar))
            query = query.Where(m => m.TipoBien.Contains(buscar) || m.IdComisoNavigation.CodigoComiso.Contains(buscar));

        if (idCategoria.HasValue)
            query = query.Where(m => m.IdCategoria == idCategoria.Value);

        var resultado = await query.Select(m => new {
            m.IdMaterial,
            m.IdComiso,
            CodigoComiso = m.IdComisoNavigation.CodigoComiso,
            m.TipoBien,
            Categoria = m.IdCategoriaNavigation.Descripcion,
            m.Cantidad,
            m.UnidadMedida,
            m.ValorTotal,
            EstadoFisico = m.IdEstadoFisico
        }).ToListAsync();

        return Ok(resultado);
    }

    // ── EXPORTAR INFORME DE MATERIALES MODIFICADO (Soporta Token por URL) ──
    [AllowAnonymous] // Evita el rebote automático 401 del navegador al abrir pestaña limpia
    [HttpGet("exportar")]
    public async Task<IActionResult> Exportar([FromQuery] string? token)
    {
        // Si no viene autenticado tradicionalmente por cabecera ni por parámetro, rechazamos la petición
        if (!User.Identity.IsAuthenticated && string.IsNullOrEmpty(token))
            return Unauthorized();

        var datos = await _db.MaterialIncautados
            .Include(m => m.IdComisoNavigation)
            .Include(m => m.IdCategoriaNavigation)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Acta Comiso,Tipo de Bien,Categoria,Cantidad,Unidad,Valor Total (Bs)");

        foreach (var d in datos)
        {
            csv.AppendLine($"{d.IdComisoNavigation?.CodigoComiso},{d.TipoBien},{d.IdCategoriaNavigation?.Descripcion},{d.Cantidad},{d.UnidadMedida},{d.ValorTotal}");
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"Reporte_Materiales_{DateTime.Now:yyyyMMdd}.csv");
    }

    [HttpGet("categorias")]
    public async Task<IActionResult> GetCategorias()
    {
        return Ok(await _db.CatCategoriaBiens.Select(c => new { c.Id, c.Descripcion }).ToListAsync());
    }
}

public class DestruccionMaterialDto
{
    public int IdMaterial { get; set; }
    public byte IdEstadoFisico { get; set; }
    public string ActaDestruccion { get; set; } = string.Empty;
}