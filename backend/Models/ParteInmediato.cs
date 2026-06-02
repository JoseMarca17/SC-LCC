using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("ParteInmediato")]
[Index("FechaRecepcion", Name = "IX_Parte_Fecha")]
[Index("IdGrupo", Name = "IX_Parte_Grupo")]
[Index("CodigoParte", Name = "UQ__ParteInm__FA7B4097D7F88E33", IsUnique = true)]
public partial class ParteInmediato
{
    [Key]
    [Column("idParte")]
    public int IdParte { get; set; }

    [Column("codigoParte")]
    [StringLength(30)]
    public string CodigoParte { get; set; } = null!;

    [Column("fechaRecepcion")]
    public DateTime FechaRecepcion { get; set; }

    [Column("origenGrupoTarea")]
    [StringLength(100)]
    public string? OrigenGrupoTarea { get; set; }

    [Column("idGrupo")]
    public int? IdGrupo { get; set; }

    [Column("idCanal")]
    public byte IdCanal { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [InverseProperty("IdParteNavigation")]
    public virtual ICollection<Comiso> Comisos { get; set; } = new List<Comiso>();

    [ForeignKey("IdCanal")]
    [InverseProperty("ParteInmediatos")]
    public virtual CatCanalRecepcion IdCanalNavigation { get; set; } = null!;

    [ForeignKey("IdEstado")]
    [InverseProperty("ParteInmediatos")]
    public virtual CatEstadoParte IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdGrupo")]
    [InverseProperty("ParteInmediatos")]
    public virtual GrupoTarea? IdGrupoNavigation { get; set; }

    [ForeignKey("RegistradoPor")]
    [InverseProperty("ParteInmediatos")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
