using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatEstadoOrden")]
public partial class CatEstadoOrden
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(20)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdEstadoNavigation")]
    public virtual ICollection<OrdenDium> OrdenDia { get; set; } = new List<OrdenDium>();
}
