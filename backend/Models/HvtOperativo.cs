using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("HVT_Operativo")]
[Index("IdHoja", "IdOperativo", Name = "UQ_HVT_Op", IsUnique = true)]
public partial class HvtOperativo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idHoja")]
    public int IdHoja { get; set; }

    [Column("idOperativo")]
    public int IdOperativo { get; set; }

    [ForeignKey("IdHoja")]
    [InverseProperty("HvtOperativos")]
    public virtual HojaVidaTactica IdHojaNavigation { get; set; } = null!;

    [ForeignKey("IdOperativo")]
    [InverseProperty("HvtOperativos")]
    public virtual OperativoMilitar IdOperativoNavigation { get; set; } = null!;
}
