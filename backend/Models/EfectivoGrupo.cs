using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("EfectivoGrupo")]
public partial class EfectivoGrupo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("idGrupo")]
    public int IdGrupo { get; set; }

    [Column("fechaAsignacion")]
    public DateOnly FechaAsignacion { get; set; }

    [Column("fechaBaja")]
    public DateOnly? FechaBaja { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [Column("asignadoPor")]
    public int? AsignadoPor { get; set; }

    [ForeignKey("AsignadoPor")]
    [InverseProperty("EfectivoGrupos")]
    public virtual Usuario? AsignadoPorNavigation { get; set; }

    [ForeignKey("IdEfectivo")]
    [InverseProperty("EfectivoGrupos")]
    public virtual Efectivo IdEfectivoNavigation { get; set; } = null!;

    [ForeignKey("IdGrupo")]
    [InverseProperty("EfectivoGrupos")]
    public virtual GrupoTarea IdGrupoNavigation { get; set; } = null!;
}
