using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatZonaFronteriza")]
public partial class CatZonaFronteriza
{
    [Key]
    [Column("id")]
    public short Id { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    [Unicode(false)]
    public string Nombre { get; set; } = null!;

    [Column("departamento")]
    [StringLength(60)]
    [Unicode(false)]
    public string? Departamento { get; set; }

    [Column("kmFrontera")]
    public int? KmFrontera { get; set; }

    [Column("activa")]
    public bool Activa { get; set; }

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<Comiso> Comisos { get; set; } = new List<Comiso>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<Despliegue> Despliegues { get; set; } = new List<Despliegue>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<Efectivo> Efectivos { get; set; } = new List<Efectivo>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<FuerzaTareaConjunto> FuerzaTareaConjuntos { get; set; } = new List<FuerzaTareaConjunto>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<GrupoTarea> GrupoTareas { get; set; } = new List<GrupoTarea>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<Novedad> Novedads { get; set; } = new List<Novedad>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<OperativoMilitar> OperativoMilitars { get; set; } = new List<OperativoMilitar>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<OrdenDium> OrdenDia { get; set; } = new List<OrdenDium>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<Reporte> Reportes { get; set; } = new List<Reporte>();

    [InverseProperty("IdZonaNavigation")]
    public virtual ICollection<VehiculoOperativo> VehiculoOperativos { get; set; } = new List<VehiculoOperativo>();
}
