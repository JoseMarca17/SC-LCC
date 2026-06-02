using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

public partial class Evidencium
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("tipoEvidencia")]
    [StringLength(60)]
    public string TipoEvidencia { get; set; } = null!;

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

    [ForeignKey("IdComiso")]
    [InverseProperty("Evidencia")]
    public virtual Comiso IdComisoNavigation { get; set; } = null!;

    [ForeignKey("SubidoPor")]
    [InverseProperty("Evidencia")]
    public virtual Usuario? SubidoPorNavigation { get; set; }
}
