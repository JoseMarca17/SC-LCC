using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Civil")]
[Index("NroDocumento", Name = "IX_Civil_Documento")]
[Index("CodigoRegistro", Name = "UQ__Civil__219AA2F82B7C1E40", IsUnique = true)]
public partial class Civil
{
    [Key]
    [Column("idCivil")]
    public int IdCivil { get; set; }

    [Column("nroDocumento")]
    [StringLength(30)]
    public string? NroDocumento { get; set; }

    [Column("idTipoDocumento")]
    public byte IdTipoDocumento { get; set; }

    [Column("nombres")]
    [StringLength(100)]
    public string Nombres { get; set; } = null!;

    [Column("apellidos")]
    [StringLength(100)]
    public string Apellidos { get; set; } = null!;

    [Column("nacionalidad")]
    [StringLength(60)]
    public string Nacionalidad { get; set; } = null!;

    [Column("idRol")]
    public byte IdRol { get; set; }

    [Column("codigoRegistro")]
    [StringLength(30)]
    public string CodigoRegistro { get; set; } = null!;

    [Column("telefono")]
    [StringLength(20)]
    public string? Telefono { get; set; }

    [Column("direccion")]
    [StringLength(200)]
    public string? Direccion { get; set; }

    [Column("observaciones")]
    [StringLength(300)]
    public string? Observaciones { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [InverseProperty("IdCivilNavigation")]
    public virtual ICollection<ComisoXcivil> ComisoXcivils { get; set; } = new List<ComisoXcivil>();

    [ForeignKey("IdRol")]
    [InverseProperty("Civils")]
    public virtual CatRolCivil IdRolNavigation { get; set; } = null!;

    [ForeignKey("IdTipoDocumento")]
    [InverseProperty("Civils")]
    public virtual CatTipoDocumento IdTipoDocumentoNavigation { get; set; } = null!;

    [ForeignKey("RegistradoPor")]
    [InverseProperty("Civils")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }

    [InverseProperty("IdCivilNavigation")]
    public virtual ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();
}
