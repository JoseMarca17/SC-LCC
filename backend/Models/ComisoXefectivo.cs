using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("ComisoXEfectivo")]
[Index("IdComiso", "IdEfectivo", Name = "UQ_ComisoXEfectivo", IsUnique = true)]
public partial class ComisoXefectivo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("rolIntervencion")]
    [StringLength(60)]
    public string? RolIntervencion { get; set; }

    [ForeignKey("IdComiso")]
    [InverseProperty("ComisoXefectivos")]
    public virtual Comiso IdComisoNavigation { get; set; } = null!;

    [ForeignKey("IdEfectivo")]
    [InverseProperty("ComisoXefectivos")]
    public virtual Efectivo IdEfectivoNavigation { get; set; } = null!;
}
