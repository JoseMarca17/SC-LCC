using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

public partial class OrdenDium
{
    [Key]
    [Column("idOrden")]
    public int IdOrden { get; set; }

    [Column("fecha")]
    public DateOnly Fecha { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; } = null!;

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("firmado")]
    public bool Firmado { get; set; }

    [Column("personalFirma")]
    [StringLength(150)]
    public string? PersonalFirma { get; set; }

    [Column("idOperativo")]
    public int? IdOperativo { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("creadoPor")]
    public int? CreadoPor { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("idJefeOperaciones")]
    public int? IdJefeOperaciones { get; set; }

    [Column("idJefePersonal")]
    public int? IdJefePersonal { get; set; }

    [Column("idJefeLogistica")]
    public int? IdJefeLogistica { get; set; }

    [ForeignKey("CreadoPor")]
    [InverseProperty("OrdenDiumCreadoPorNavigations")]
    public virtual Usuario? CreadoPorNavigation { get; set; }

    [ForeignKey("IdEstado")]
    [InverseProperty("OrdenDia")]
    public virtual CatEstadoOrden IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdJefeLogistica")]
    [InverseProperty("OrdenDiumIdJefeLogisticaNavigations")]
    public virtual Usuario? IdJefeLogisticaNavigation { get; set; }

    [ForeignKey("IdJefeOperaciones")]
    [InverseProperty("OrdenDiumIdJefeOperacionesNavigations")]
    public virtual Usuario? IdJefeOperacionesNavigation { get; set; }

    [ForeignKey("IdJefePersonal")]
    [InverseProperty("OrdenDiumIdJefePersonalNavigations")]
    public virtual Usuario? IdJefePersonalNavigation { get; set; }

    [ForeignKey("IdOperativo")]
    [InverseProperty("OrdenDia")]
    public virtual OperativoMilitar? IdOperativoNavigation { get; set; }

    [ForeignKey("IdZona")]
    [InverseProperty("OrdenDia")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }
}
