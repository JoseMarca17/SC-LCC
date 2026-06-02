using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("OperativoEfectivo")]
[Index("IdOperativo", "IdEfectivo", Name = "UQ_OpEfectivo", IsUnique = true)]
public partial class OperativoEfectivo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idOperativo")]
    public int IdOperativo { get; set; }

    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("rol")]
    [StringLength(50)]
    public string? Rol { get; set; }

    [ForeignKey("IdEfectivo")]
    [InverseProperty("OperativoEfectivos")]
    public virtual Efectivo IdEfectivoNavigation { get; set; } = null!;

    [ForeignKey("IdOperativo")]
    [InverseProperty("OperativoEfectivos")]
    public virtual OperativoMilitar IdOperativoNavigation { get; set; } = null!;
}
