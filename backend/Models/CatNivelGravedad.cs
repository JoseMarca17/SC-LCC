using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatNivelGravedad")]
public partial class CatNivelGravedad
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(20)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdGravedadNavigation")]
    public virtual ICollection<Novedad> Novedads { get; set; } = new List<Novedad>();
}
