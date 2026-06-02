using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Vehiculo")]
[Index("IdEstado", Name = "IX_Vehiculo_Estado")]
[Index("Placa", Name = "UQ_Vehiculo_Placa", IsUnique = true)]
public partial class Vehiculo
{
    [Key]
    [Column("idVehiculo")]
    public int IdVehiculo { get; set; }

    [Column("placa")]
    [StringLength(20)]
    public string Placa { get; set; } = null!;

    [Column("vin")]
    [StringLength(30)]
    public string? Vin { get; set; }

    [Column("marca")]
    [StringLength(50)]
    public string? Marca { get; set; }

    [Column("modelo")]
    [StringLength(50)]
    public string? Modelo { get; set; }

    [Column("anio")]
    public short? Anio { get; set; }

    [Column("color")]
    [StringLength(30)]
    public string? Color { get; set; }

    [Column("idTipo")]
    public byte IdTipo { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("propietario")]
    [StringLength(150)]
    public string? Propietario { get; set; }

    [Column("idDisposicion")]
    public byte IdDisposicion { get; set; }

    [Column("actaDisposicion")]
    [StringLength(100)]
    public string? ActaDisposicion { get; set; }

    [Column("idCivil")]
    public int? IdCivil { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [InverseProperty("IdVehiculoNavigation")]
    public virtual ICollection<ComisoXvehiculo> ComisoXvehiculos { get; set; } = new List<ComisoXvehiculo>();

    [ForeignKey("IdCivil")]
    [InverseProperty("Vehiculos")]
    public virtual Civil? IdCivilNavigation { get; set; }

    [ForeignKey("IdDisposicion")]
    [InverseProperty("Vehiculos")]
    public virtual CatDisposicionFinal IdDisposicionNavigation { get; set; } = null!;

    [ForeignKey("IdEstado")]
    [InverseProperty("Vehiculos")]
    public virtual CatEstadoVehiculo IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdTipo")]
    [InverseProperty("Vehiculos")]
    public virtual CatTipoVehiculo IdTipoNavigation { get; set; } = null!;

    [ForeignKey("RegistradoPor")]
    [InverseProperty("Vehiculos")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
