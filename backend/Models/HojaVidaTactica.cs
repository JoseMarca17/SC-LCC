using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("HojaVidaTactica")]
[Index("IdEfectivo", Name = "UQ__HojaVida__A7ACA7337920981F", IsUnique = true)]
public partial class HojaVidaTactica
{
    [Key]
    [Column("idHoja")]
    public int IdHoja { get; set; }

    [Column("idEfectivo")]
    public int IdEfectivo { get; set; }

    [Column("totalOperativos")]
    public int TotalOperativos { get; set; }

    [Column("fechaUltimoDespliegue")]
    public DateOnly? FechaUltimoDespliegue { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("ultimaActualizacion")]
    public DateTime UltimaActualizacion { get; set; }

    [InverseProperty("IdHojaNavigation")]
    public virtual ICollection<HvtNovedad> HvtNovedads { get; set; } = new List<HvtNovedad>();

    [InverseProperty("IdHojaNavigation")]
    public virtual ICollection<HvtOperativo> HvtOperativos { get; set; } = new List<HvtOperativo>();

    [ForeignKey("IdEfectivo")]
    [InverseProperty("HojaVidaTactica")]
    public virtual Efectivo IdEfectivoNavigation { get; set; } = null!;
}
