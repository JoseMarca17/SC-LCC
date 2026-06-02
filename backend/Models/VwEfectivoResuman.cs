using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Keyless]
public partial class VwEfectivoResuman
{
    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("codigoPersonal")]
    [StringLength(20)]
    public string CodigoPersonal { get; set; } = null!;

    [Column("nombreCompleto")]
    [StringLength(201)]
    public string NombreCompleto { get; set; } = null!;

    [Column("grado")]
    [StringLength(60)]
    public string Grado { get; set; } = null!;

    [Column("unidadOrigen")]
    [StringLength(100)]
    public string UnidadOrigen { get; set; } = null!;

    [Column("estado")]
    [StringLength(30)]
    [Unicode(false)]
    public string? Estado { get; set; }

    [Column("zonaAsignada")]
    [StringLength(100)]
    [Unicode(false)]
    public string? ZonaAsignada { get; set; }

    [Column("grupoActual")]
    [StringLength(30)]
    public string? GrupoActual { get; set; }
}
