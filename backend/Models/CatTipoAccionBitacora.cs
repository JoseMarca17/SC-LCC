using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatTipoAccionBitacora")]
public partial class CatTipoAccionBitacora
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(30)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdAccionNavigation")]
    public virtual ICollection<Bitacora> Bitacoras { get; set; } = new List<Bitacora>();
}
