using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Index("EntidadTipo", "EntidadId", Name = "IX_Foto_Entidad")]
public partial class Fotografium
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("entidadTipo")]
    [StringLength(40)]
    public string EntidadTipo { get; set; } = null!;

    [Column("entidadId")]
    public int EntidadId { get; set; }

    [Column("rutaArchivo")]
    [StringLength(500)]
    public string RutaArchivo { get; set; } = null!;

    [Column("nombreOriginal")]
    [StringLength(200)]
    public string? NombreOriginal { get; set; }

    [Column("fechaSubida")]
    public DateTime FechaSubida { get; set; }

    [Column("subidoPor")]
    public int? SubidoPor { get; set; }

    [ForeignKey("SubidoPor")]
    [InverseProperty("Fotografia")]
    public virtual Usuario? SubidoPorNavigation { get; set; }
}
