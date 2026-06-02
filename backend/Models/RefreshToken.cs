using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("RefreshToken")]
[Index("Token", Name = "UQ__RefreshT__CA90DA7ABAEA408D", IsUnique = true)]
public partial class RefreshToken
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idUsuario")]
    public int IdUsuario { get; set; }

    [Column("token")]
    [StringLength(512)]
    public string Token { get; set; } = null!;

    [Column("fechaExpiracion")]
    public DateTime FechaExpiracion { get; set; }

    [Column("revocado")]
    public bool Revocado { get; set; }

    [Column("fechaRevocacion")]
    public DateTime? FechaRevocacion { get; set; }

    [Column("ipCreacion")]
    [StringLength(50)]
    public string? IpCreacion { get; set; }

    [Column("userAgent")]
    [StringLength(256)]
    public string? UserAgent { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [ForeignKey("IdUsuario")]
    [InverseProperty("RefreshTokens")]
    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
