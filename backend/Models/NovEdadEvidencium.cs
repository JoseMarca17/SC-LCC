using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

public partial class NovEdadEvidencium
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idNovedad")]
    public int IdNovedad { get; set; }

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

    [ForeignKey("IdNovedad")]
    [InverseProperty("NovEdadEvidencia")]
    public virtual Novedad IdNovedadNavigation { get; set; } = null!;

    [ForeignKey("SubidoPor")]
    [InverseProperty("NovEdadEvidencia")]
    public virtual Usuario? SubidoPorNavigation { get; set; }
}
