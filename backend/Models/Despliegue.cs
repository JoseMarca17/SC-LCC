using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Despliegue")]
[Index("IdEfectivo", Name = "IX_Despliegue_Efectivo")]
[Index("IdZona", Name = "IX_Despliegue_Zona")]
public partial class Despliegue
{
    [Key]
    [Column("idDespliegue")]
    public int IdDespliegue { get; set; }

    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("idGrupo")]
    public int? IdGrupo { get; set; }

    [Column("idZona")]
    public short IdZona { get; set; }

    [Column("fechaInicio")]
    public DateOnly FechaInicio { get; set; }

    [Column("fechaFin")]
    public DateOnly? FechaFin { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("observaciones")]
    [StringLength(300)]
    public string? Observaciones { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [ForeignKey("IdEfectivo")]
    [InverseProperty("Despliegues")]
    public virtual Efectivo IdEfectivoNavigation { get; set; } = null!;

    [ForeignKey("IdEstado")]
    [InverseProperty("Despliegues")]
    public virtual CatEstadoDespliegue IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdGrupo")]
    [InverseProperty("Despliegues")]
    public virtual GrupoTarea? IdGrupoNavigation { get; set; }

    [ForeignKey("IdZona")]
    [InverseProperty("Despliegues")]
    public virtual CatZonaFronteriza IdZonaNavigation { get; set; } = null!;

    [ForeignKey("RegistradoPor")]
    [InverseProperty("Despliegues")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
