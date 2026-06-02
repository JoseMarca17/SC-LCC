using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatTipoOperativo")]
public partial class CatTipoOperativo
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(50)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdTipoNavigation")]
    public virtual ICollection<OperativoMilitar> OperativoMilitars { get; set; } = new List<OperativoMilitar>();
}
