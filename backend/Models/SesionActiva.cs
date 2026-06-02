using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("SesionActiva")]
[Index("IdEstado", Name = "IX_Sesion_Estado")]
[Index("IdUsuario", Name = "IX_Sesion_Usuario")]
public partial class SesionActiva
{
    [Key]
    [Column("idSesion")]
    public int IdSesion { get; set; }

    [Column("idUsuario")]
    public int IdUsuario { get; set; }

    [Column("ipOrigen")]
    [StringLength(50)]
    public string IpOrigen { get; set; } = null!;

    [Column("userAgent")]
    [StringLength(256)]
    public string? UserAgent { get; set; }

    [Column("fechaInicio")]
    public DateTime FechaInicio { get; set; }

    [Column("ultimaActividad")]
    public DateTime UltimaActividad { get; set; }

    [Column("fechaCierre")]
    public DateTime? FechaCierre { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [ForeignKey("IdEstado")]
    [InverseProperty("SesionActivas")]
    public virtual CatEstadoSesion IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdUsuario")]
    [InverseProperty("SesionActivas")]
    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
