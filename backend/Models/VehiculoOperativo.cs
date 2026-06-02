using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("VehiculoOperativo")]
[Index("Placa", Name = "UQ__Vehiculo__0C057425ADA3A565", IsUnique = true)]
public partial class VehiculoOperativo
{
    [Key]
    [Column("idVehOp")]
    public int IdVehOp { get; set; }

    [Column("placa")]
    [StringLength(20)]
    public string Placa { get; set; } = null!;

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

    [Column("kilometraje")]
    public int Kilometraje { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [InverseProperty("IdVehOpNavigation")]
    public virtual ICollection<AsignacionVehiculoOp> AsignacionVehiculoOps { get; set; } = new List<AsignacionVehiculoOp>();

    [ForeignKey("IdEstado")]
    [InverseProperty("VehiculoOperativos")]
    public virtual CatEstadoVehiculo IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdTipo")]
    [InverseProperty("VehiculoOperativos")]
    public virtual CatTipoVehiculo IdTipoNavigation { get; set; } = null!;

    [ForeignKey("IdZona")]
    [InverseProperty("VehiculoOperativos")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }

    [ForeignKey("RegistradoPor")]
    [InverseProperty("VehiculoOperativos")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
