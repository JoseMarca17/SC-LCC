using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatCanalRecepcion")]
public partial class CatCanalRecepcion
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(30)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdCanalNavigation")]
    public virtual ICollection<ParteInmediato> ParteInmediatos { get; set; } = new List<ParteInmediato>();
}
