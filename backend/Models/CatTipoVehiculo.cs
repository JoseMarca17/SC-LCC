using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("CatTipoVehiculo")]
public partial class CatTipoVehiculo
{
    [Key]
    [Column("id")]
    public byte Id { get; set; }

    [Column("descripcion")]
    [StringLength(40)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [InverseProperty("IdTipoNavigation")]
    public virtual ICollection<VehiculoOperativo> VehiculoOperativos { get; set; } = new List<VehiculoOperativo>();

    [InverseProperty("IdTipoNavigation")]
    public virtual ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();
}
