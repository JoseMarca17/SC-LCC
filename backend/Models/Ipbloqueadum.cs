using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("IPBloqueada")]
[Index("Ip", Name = "UQ__IPBloque__3213E8224860CA2D", IsUnique = true)]
public partial class Ipbloqueadum
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("ip")]
    [StringLength(50)]
    public string Ip { get; set; } = null!;

    [Column("motivo")]
    [StringLength(200)]
    public string? Motivo { get; set; }

    [Column("bloqueadoPor")]
    public int? BloqueadoPor { get; set; }

    [Column("fechaBloqueo")]
    public DateTime FechaBloqueo { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey("BloqueadoPor")]
    [InverseProperty("Ipbloqueada")]
    public virtual Usuario? BloqueadoPorNavigation { get; set; }
}
