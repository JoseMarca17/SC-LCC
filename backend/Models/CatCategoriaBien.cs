using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatCategoriaBien")]
public partial class CatCategoriaBien
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(50)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdCategoriaNavigation")]
    public virtual ICollection<MaterialIncautado> MaterialIncautados { get; set; } = new List<MaterialIncautado>();
}
