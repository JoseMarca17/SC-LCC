using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("ComisoXVehiculo")]
[Index("IdComiso", "IdVehiculo", Name = "UQ_ComisoXVehiculo", IsUnique = true)]
public partial class ComisoXvehiculo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("idVehiculo")]
    public int IdVehiculo { get; set; }

    [ForeignKey("IdComiso")]
    [InverseProperty("ComisoXvehiculos")]
    public virtual Comiso IdComisoNavigation { get; set; } = null!;

    [ForeignKey("IdVehiculo")]
    [InverseProperty("ComisoXvehiculos")]
    public virtual Vehiculo IdVehiculoNavigation { get; set; } = null!;
}
