using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Keyless]
public partial class VwSesionesActiva
{
    [Column("idSesion")]
    public int IdSesion { get; set; }

    [Column("usuario")]
    [StringLength(201)]
    public string Usuario { get; set; } = null!;

    [Column("rol")]
    [StringLength(50)]
    [Unicode(false)]
    public string Rol { get; set; } = null!;

    [Column("ipOrigen")]
    [StringLength(50)]
    public string IpOrigen { get; set; } = null!;

    [Column("fechaInicio")]
    public DateTime FechaInicio { get; set; }

    [Column("ultimaActividad")]
    public DateTime UltimaActividad { get; set; }
}
