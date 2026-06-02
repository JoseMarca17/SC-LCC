using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatRol")]
public partial class CatRol
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("nombre")]
    [StringLength(50)]
    [Unicode(false)]
    public string Nombre { get; set; } = null!;

    [Column("descripcion")]
    [StringLength(200)]
    [Unicode(false)]
    public string? Descripcion { get; set; }

    [InverseProperty("IdRolNavigation")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
