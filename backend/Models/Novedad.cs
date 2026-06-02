using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Novedad")]
[Index("IdComiso", Name = "IX_Novedad_Comiso")]
[Index("IdEfectivo", Name = "IX_Novedad_Efectivo")]
[Index("IdGravedad", Name = "IX_Novedad_Gravedad")]
public partial class Novedad
{
    [Key]
    [Column("idNovedad")]
    public int IdNovedad { get; set; }

    [Column("idTipo")]
    public byte IdTipo { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; } = null!;

    [Column("fecha")]
    public DateTime Fecha { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("idGravedad")]
    public byte IdGravedad { get; set; }

    [Column("idEfectivo")]
    public int? IdEfectivo { get; set; }

    [Column("idComiso")]
    public int? IdComiso { get; set; }

    [Column("idOperativo")]
    public int? IdOperativo { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("destinatarioId")]
    public int? DestinatarioId { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [ForeignKey("DestinatarioId")]
    [InverseProperty("NovedadDestinatarios")]
    public virtual Usuario? Destinatario { get; set; }

    [InverseProperty("IdNovedadNavigation")]
    public virtual ICollection<HvtNovedad> HvtNovedads { get; set; } = new List<HvtNovedad>();

    [ForeignKey("IdComiso")]
    [InverseProperty("Novedads")]
    public virtual Comiso? IdComisoNavigation { get; set; }

    [ForeignKey("IdEfectivo")]
    [InverseProperty("Novedads")]
    public virtual Efectivo? IdEfectivoNavigation { get; set; }

    [ForeignKey("IdEstado")]
    [InverseProperty("Novedads")]
    public virtual CatEstadoNovedad IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdGravedad")]
    [InverseProperty("Novedads")]
    public virtual CatNivelGravedad IdGravedadNavigation { get; set; } = null!;

    [ForeignKey("IdOperativo")]
    [InverseProperty("Novedads")]
    public virtual OperativoMilitar? IdOperativoNavigation { get; set; }

    [ForeignKey("IdTipo")]
    [InverseProperty("Novedads")]
    public virtual CatTipoNovedad IdTipoNavigation { get; set; } = null!;

    [ForeignKey("IdZona")]
    [InverseProperty("Novedads")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [InverseProperty("IdNovedadNavigation")]
    public virtual ICollection<NovEdadEvidencium> NovEdadEvidencia { get; set; } = new List<NovEdadEvidencium>();

    [ForeignKey("RegistradoPor")]
    [InverseProperty("NovedadRegistradoPorNavigations")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
