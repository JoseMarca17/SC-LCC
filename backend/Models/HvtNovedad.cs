using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("HVT_Novedad")]
[Index("IdHoja", "IdNovedad", Name = "UQ_HVT_Nov", IsUnique = true)]
public partial class HvtNovedad
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idHoja")]
    public int IdHoja { get; set; }

    [Column("idNovedad")]
    public int IdNovedad { get; set; }

    [ForeignKey("IdHoja")]
    [InverseProperty("HvtNovedads")]
    public virtual HojaVidaTactica IdHojaNavigation { get; set; } = null!;

    [ForeignKey("IdNovedad")]
    [InverseProperty("HvtNovedads")]
    public virtual Novedad IdNovedadNavigation { get; set; } = null!;
}
