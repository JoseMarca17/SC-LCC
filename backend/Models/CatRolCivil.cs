using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatRolCivil")]
public partial class CatRolCivil
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(30)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdRolNavigation")]
    public virtual ICollection<Civil> Civils { get; set; } = new List<Civil>();
}
