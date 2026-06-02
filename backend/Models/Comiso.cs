using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Comiso")]
[Index("IdEstado", Name = "IX_Comiso_Estado")]
[Index("Fecha", Name = "IX_Comiso_Fecha")]
[Index("IdZona", Name = "IX_Comiso_Zona")]
[Index("CodigoComiso", Name = "UQ__Comiso__A453621ACB55779D", IsUnique = true)]
public partial class Comiso
{
    [Key]
    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("codigoComiso")]
    [StringLength(30)]
    public string CodigoComiso { get; set; } = null!;

    [Column("fecha")]
    public DateTime Fecha { get; set; }

    [Column("lugar")]
    [StringLength(200)]
    public string? Lugar { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("coordenadasLat", TypeName = "decimal(10, 7)")]
    public decimal? CoordenadasLat { get; set; }

    [Column("coordenadasLng", TypeName = "decimal(10, 7)")]
    public decimal? CoordenadasLng { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("valorEstimadoTotal", TypeName = "decimal(18, 2)")]
    public decimal ValorEstimadoTotal { get; set; }

    [Column("motivoAnulacion")]
    [StringLength(300)]
    public string? MotivoAnulacion { get; set; }

    [Column("idParte")]
    public int? IdParte { get; set; }

    [Column("idOperativo")]
    public int? IdOperativo { get; set; }

    [Column("idGrupo")]
    public int? IdGrupo { get; set; }

    [Column("aprobadoPor")]
    public int? AprobadoPor { get; set; }

    [Column("fechaAprobacion")]
    public DateTime? FechaAprobacion { get; set; }

    [Column("registradoPor")]
    public int RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [ForeignKey("AprobadoPor")]
    [InverseProperty("ComisoAprobadoPorNavigations")]
    public virtual Usuario? AprobadoPorNavigation { get; set; }

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<ComisoXcivil> ComisoXcivils { get; set; } = new List<ComisoXcivil>();

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<ComisoXefectivo> ComisoXefectivos { get; set; } = new List<ComisoXefectivo>();

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<ComisoXvehiculo> ComisoXvehiculos { get; set; } = new List<ComisoXvehiculo>();

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<Evidencium> Evidencia { get; set; } = new List<Evidencium>();

    [ForeignKey("IdEstado")]
    [InverseProperty("Comisos")]
    public virtual CatEstadoComiso IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdGrupo")]
    [InverseProperty("Comisos")]
    public virtual GrupoTarea? IdGrupoNavigation { get; set; }

    [ForeignKey("IdOperativo")]
    [InverseProperty("Comisos")]
    public virtual OperativoMilitar? IdOperativoNavigation { get; set; }

    [ForeignKey("IdParte")]
    [InverseProperty("Comisos")]
    public virtual ParteInmediato? IdParteNavigation { get; set; }

    [ForeignKey("IdZona")]
    [InverseProperty("Comisos")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<MaterialIncautado> MaterialIncautados { get; set; } = new List<MaterialIncautado>();

    [InverseProperty("IdComisoNavigation")]
    public virtual ICollection<Novedad> Novedads { get; set; } = new List<Novedad>();

    [ForeignKey("RegistradoPor")]
    [InverseProperty("ComisoRegistradoPorNavigations")]
    public virtual Usuario RegistradoPorNavigation { get; set; } = null!;
}
