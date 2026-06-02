using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatFormatoExport")]
public partial class CatFormatoExport
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(10)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdFormatoNavigation")]
    public virtual ICollection<Reporte> Reportes { get; set; } = new List<Reporte>();
}
