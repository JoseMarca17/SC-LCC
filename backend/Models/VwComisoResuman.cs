using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Keyless]
public partial class VwComisoResuman
{
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

    [Column("zona")]
    [StringLength(100)]
    [Unicode(false)]
    public string? Zona { get; set; }

    [Column("estado")]
    [StringLength(30)]
    [Unicode(false)]
    public string? Estado { get; set; }

    [Column("valorEstimadoTotal", TypeName = "decimal(18, 2)")]
    public decimal ValorEstimadoTotal { get; set; }

    [Column("cantidadItems")]
    public int? CantidadItems { get; set; }

    [Column("registradoPor")]
    [StringLength(201)]
    public string? RegistradoPor { get; set; }
}
