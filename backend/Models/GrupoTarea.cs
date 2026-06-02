using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("GrupoTarea")]
[Index("IdZona", Name = "IX_GrupoTarea_Zona")]
[Index("CodigoGrupo", Name = "UQ__GrupoTar__5B871EC972752984", IsUnique = true)]
public partial class GrupoTarea
{
    [Key]
    [Column("idGrupo")]
    public int IdGrupo { get; set; }

    [Column("codigoGrupo")]
    [StringLength(30)]
    public string CodigoGrupo { get; set; } = null!;

    [Column("idTipo")]
    public byte IdTipo { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("idFTC")]
    public int? IdFtc { get; set; }

    [Column("descripcion")]
    [StringLength(200)]
    public string? Descripcion { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("creadoPor")]
    public int? CreadoPor { get; set; }

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<AsignacionVehiculoOp> AsignacionVehiculoOps { get; set; } = new List<AsignacionVehiculoOp>();

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<Comiso> Comisos { get; set; } = new List<Comiso>();

    [ForeignKey("CreadoPor")]
    [InverseProperty("GrupoTareas")]
    public virtual Usuario? CreadoPorNavigation { get; set; }

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<Despliegue> Despliegues { get; set; } = new List<Despliegue>();

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<EfectivoGrupo> EfectivoGrupos { get; set; } = new List<EfectivoGrupo>();

    [ForeignKey("IdEstado")]
    [InverseProperty("GrupoTareas")]
    public virtual CatEstadoGrupo IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdFtc")]
    [InverseProperty("GrupoTareas")]
    public virtual FuerzaTareaConjunto? IdFtcNavigation { get; set; }

    [ForeignKey("IdTipo")]
    [InverseProperty("GrupoTareas")]
    public virtual CatTipoGrupo IdTipoNavigation { get; set; } = null!;

    [ForeignKey("IdZona")]
    [InverseProperty("GrupoTareas")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<OperativoMilitar> OperativoMilitars { get; set; } = new List<OperativoMilitar>();

    [InverseProperty("IdGrupoNavigation")]
    public virtual ICollection<ParteInmediato> ParteInmediatos { get; set; } = new List<ParteInmediato>();
}
