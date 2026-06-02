using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Efectivo")]
[Index("CodigoPersonal", Name = "IX_Efectivo_Codigo")]
[Index("CodigoPersonal", Name = "UQ__Efectivo__D3A2D7A9497717CB", IsUnique = true)]
public partial class Efectivo
{
    [Key]
    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("codigoPersonal")]
    [StringLength(20)]
    public string CodigoPersonal { get; set; } = null!;

    [Column("nombres")]
    [StringLength(100)]
    public string Nombres { get; set; } = null!;

    [Column("apellidos")]
    [StringLength(100)]
    public string Apellidos { get; set; } = null!;

    [Column("grado")]
    [StringLength(60)]
    public string Grado { get; set; } = null!;

    [Column("unidadOrigen")]
    [StringLength(100)]
    public string UnidadOrigen { get; set; } = null!;

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("idUsuario")]
    public int? IdUsuario { get; set; }

    [Column("fechaIngreso")]
    public DateOnly? FechaIngreso { get; set; }

    [Column("telefono")]
    [StringLength(20)]
    public string? Telefono { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("creadoPor")]
    public int? CreadoPor { get; set; }

    [InverseProperty("IdEfectivoNavigation")]
    public virtual ICollection<ComisoXefectivo> ComisoXefectivos { get; set; } = new List<ComisoXefectivo>();

    [ForeignKey("CreadoPor")]
    [InverseProperty("EfectivoCreadoPorNavigations")]
    public virtual Usuario? CreadoPorNavigation { get; set; }

    [InverseProperty("IdEfectivoNavigation")]
    public virtual ICollection<Despliegue> Despliegues { get; set; } = new List<Despliegue>();

    [InverseProperty("IdEfectivoNavigation")]
    public virtual ICollection<EfectivoGrupo> EfectivoGrupos { get; set; } = new List<EfectivoGrupo>();

    [InverseProperty("IdEfectivoNavigation")]
    public virtual HojaVidaTactica? HojaVidaTactica { get; set; }

    [ForeignKey("IdEstado")]
    [InverseProperty("Efectivos")]
    public virtual CatEstadoEfectivo IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdUsuario")]
    [InverseProperty("EfectivoIdUsuarioNavigations")]
    public virtual Usuario? IdUsuarioNavigation { get; set; }

    [ForeignKey("IdZona")]
    [InverseProperty("Efectivos")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [InverseProperty("IdEfectivoNavigation")]
    public virtual ICollection<Novedad> Novedads { get; set; } = new List<Novedad>();

    [InverseProperty("IdEfectivoNavigation")]
    public virtual ICollection<OperativoEfectivo> OperativoEfectivos { get; set; } = new List<OperativoEfectivo>();
}
