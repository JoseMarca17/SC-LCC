using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Bitacora")]
[Index("Fecha", Name = "IX_Bitacora_Fecha")]
[Index("Tabla", Name = "IX_Bitacora_Tabla")]
[Index("IdUsuario", Name = "IX_Bitacora_Usuario")]
public partial class Bitacora
{
    [Key]
    [Column("idRegistro")]
    public long IdRegistro { get; set; }

    [Column("idAccion")]
    public byte IdAccion { get; set; }

    [Column("tabla")]
    [StringLength(100)]
    public string Tabla { get; set; } = null!;

    [Column("registroId")]
    [StringLength(50)]
    public string? RegistroId { get; set; }

    [Column("valorAnterior")]
    public string? ValorAnterior { get; set; }

    [Column("valorNuevo")]
    public string? ValorNuevo { get; set; }

    [Column("fecha")]
    public DateTime Fecha { get; set; }

    [Column("ip")]
    [StringLength(50)]
    public string? Ip { get; set; }

    [Column("idUsuario")]
    public int? IdUsuario { get; set; }

    [Column("modulo")]
    [StringLength(80)]
    public string? Modulo { get; set; }

    [ForeignKey("IdAccion")]
    [InverseProperty("Bitacoras")]
    public virtual CatTipoAccionBitacora IdAccionNavigation { get; set; } = null!;

    [ForeignKey("IdUsuario")]
    [InverseProperty("Bitacoras")]
    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
