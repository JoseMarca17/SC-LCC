using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("OperativoMilitar")]
[Index("IdEstado", Name = "IX_Operativo_Estado")]
[Index("IdZona", Name = "IX_Operativo_Zona")]
[Index("CodigoOperativo", Name = "UQ__Operativ__F28A7AD69E1F1BB7", IsUnique = true)]
public partial class OperativoMilitar
{
    [Key]
    [Column("idOperativo")]
    public int IdOperativo { get; set; }

    [Column("codigoOperativo")]
    [StringLength(30)]
    public string CodigoOperativo { get; set; } = null!;

    [Column("idTipo")]
    public byte IdTipo { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("fechaInicio")]
    public DateTime FechaInicio { get; set; }

    [Column("fechaFin")]
    public DateTime? FechaFin { get; set; }

    [Column("descripcion")]
    [StringLength(500)]
    public string? Descripcion { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("idGrupo")]
    public int? IdGrupo { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<AsignacionVehiculoOp> AsignacionVehiculoOps { get; set; } = new List<AsignacionVehiculoOp>();

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<Comiso> Comisos { get; set; } = new List<Comiso>();

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<HvtOperativo> HvtOperativos { get; set; } = new List<HvtOperativo>();

    [ForeignKey("IdEstado")]
    [InverseProperty("OperativoMilitars")]
    public virtual CatEstadoOperativo IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdGrupo")]
    [InverseProperty("OperativoMilitars")]
    public virtual GrupoTarea? IdGrupoNavigation { get; set; }

    [ForeignKey("IdTipo")]
    [InverseProperty("OperativoMilitars")]
    public virtual CatTipoOperativo IdTipoNavigation { get; set; } = null!;

    [ForeignKey("IdZona")]
    [InverseProperty("OperativoMilitars")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<Novedad> Novedads { get; set; } = new List<Novedad>();

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<OperativoEfectivo> OperativoEfectivos { get; set; } = new List<OperativoEfectivo>();

    [InverseProperty("IdOperativoNavigation")]
    public virtual ICollection<OrdenDium> OrdenDia { get; set; } = new List<OrdenDium>();

    [ForeignKey("RegistradoPor")]
    [InverseProperty("OperativoMilitars")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
