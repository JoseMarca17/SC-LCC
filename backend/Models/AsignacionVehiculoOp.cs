using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("AsignacionVehiculoOp")]
public partial class AsignacionVehiculoOp
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idVehOp")]
    public int IdVehOp { get; set; }

    [Column("idOperativo")]
    public int? IdOperativo { get; set; }

    [Column("idGrupo")]
    public int? IdGrupo { get; set; }

    [Column("fechaAsignacion")]
    public DateTime FechaAsignacion { get; set; }

    [Column("fechaDevolucion")]
    public DateTime? FechaDevolucion { get; set; }

    [Column("asignadoPor")]
    public int? AsignadoPor { get; set; }

    [ForeignKey("AsignadoPor")]
    [InverseProperty("AsignacionVehiculoOps")]
    public virtual Usuario? AsignadoPorNavigation { get; set; }

    [ForeignKey("IdGrupo")]
    [InverseProperty("AsignacionVehiculoOps")]
    public virtual GrupoTarea? IdGrupoNavigation { get; set; }

    [ForeignKey("IdOperativo")]
    [InverseProperty("AsignacionVehiculoOps")]
    public virtual OperativoMilitar? IdOperativoNavigation { get; set; }

    [ForeignKey("IdVehOp")]
    [InverseProperty("AsignacionVehiculoOps")]
    public virtual VehiculoOperativo IdVehOpNavigation { get; set; } = null!;
}
