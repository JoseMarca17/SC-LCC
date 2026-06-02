using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("FuerzaTareaConjunto")]
public partial class FuerzaTareaConjunto
{
    [Key]
    [Column("idFTC")]
    public int IdFtc { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    public string Nombre { get; set; } = null!;

    [Column("puestoComando")]
    [StringLength(100)]
    public string? PuestoComando { get; set; }

    [Column("zonaResponsabilidad")]
    [StringLength(100)]
    public string? ZonaResponsabilidad { get; set; }

    [Column("kmFrontera")]
    public int? KmFrontera { get; set; }

    [Column("puntosIngreso")]
    public int? PuntosIngreso { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [InverseProperty("IdFtcNavigation")]
    public virtual ICollection<GrupoTarea> GrupoTareas { get; set; } = new List<GrupoTarea>();

    [ForeignKey("IdZona")]
    [InverseProperty("FuerzaTareaConjuntos")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }
}
