using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("ComisoXCivil")]
[Index("IdComiso", "IdCivil", Name = "UQ_ComisoXCivil", IsUnique = true)]
public partial class ComisoXcivil
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("idCivil")]
    public int IdCivil { get; set; }

    [ForeignKey("IdCivil")]
    [InverseProperty("ComisoXcivils")]
    public virtual Civil IdCivilNavigation { get; set; } = null!;

    [ForeignKey("IdComiso")]
    [InverseProperty("ComisoXcivils")]
    public virtual Comiso IdComisoNavigation { get; set; } = null!;
}
