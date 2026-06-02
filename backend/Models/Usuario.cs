using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Usuario")]
[Index("Email", Name = "IX_Usuario_Email")]
[Index("IdRol", Name = "IX_Usuario_IdRol")]
[Index("Email", Name = "UQ__Usuario__AB6E6164B0CBBD80", IsUnique = true)]
public partial class Usuario
{
    [Key]
    [Column("idUsuario")]
    public int IdUsuario { get; set; }

    [Column("nombres")]
    [StringLength(100)]
    public string Nombres { get; set; } = null!;

    [Column("apellidos")]
    [StringLength(100)]
    public string Apellidos { get; set; } = null!;

    [Column("email")]
    [StringLength(150)]
    public string Email { get; set; } = null!;

    [Column("contrasenaHash")]
    [StringLength(256)]
    public string ContrasenaHash { get; set; } = null!;

    [Column("salt")]
    [StringLength(100)]
    public string? Salt { get; set; }

    [Column("idEstado")]
    public byte IdEstado { get; set; }

    [Column("idRol")]
    public byte IdRol { get; set; }

    [Column("secreto2FA")]
    [StringLength(256)]
    public string? Secreto2Fa { get; set; }

    [Column("habilitado2FA")]
    public bool Habilitado2Fa { get; set; }

    [Column("codigosRecuperacion")]
    public string? CodigosRecuperacion { get; set; }

    [Column("fechaCreacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fechaUltimoAcceso")]
    public DateTime? FechaUltimoAcceso { get; set; }

    [Column("intentosFallidos")]
    public byte IntentosFallidos { get; set; }

    [Column("fechaBloqueo")]
    public DateTime? FechaBloqueo { get; set; }

    [Column("creadoPor")]
    public int? CreadoPor { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [InverseProperty("AsignadoPorNavigation")]
    public virtual ICollection<AsignacionVehiculoOp> AsignacionVehiculoOps { get; set; } = new List<AsignacionVehiculoOp>();

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<Bitacora> Bitacoras { get; set; } = new List<Bitacora>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<Civil> Civils { get; set; } = new List<Civil>();

    [InverseProperty("AprobadoPorNavigation")]
    public virtual ICollection<Comiso> ComisoAprobadoPorNavigations { get; set; } = new List<Comiso>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<Comiso> ComisoRegistradoPorNavigations { get; set; } = new List<Comiso>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<Despliegue> Despliegues { get; set; } = new List<Despliegue>();

    [InverseProperty("CreadoPorNavigation")]
    public virtual ICollection<Efectivo> EfectivoCreadoPorNavigations { get; set; } = new List<Efectivo>();

    [InverseProperty("AsignadoPorNavigation")]
    public virtual ICollection<EfectivoGrupo> EfectivoGrupos { get; set; } = new List<EfectivoGrupo>();

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<Efectivo> EfectivoIdUsuarioNavigations { get; set; } = new List<Efectivo>();

    [InverseProperty("SubidoPorNavigation")]
    public virtual ICollection<Evidencium> Evidencia { get; set; } = new List<Evidencium>();

    [InverseProperty("SubidoPorNavigation")]
    public virtual ICollection<Fotografium> Fotografia { get; set; } = new List<Fotografium>();

    [InverseProperty("CreadoPorNavigation")]
    public virtual ICollection<GrupoTarea> GrupoTareas { get; set; } = new List<GrupoTarea>();

    [ForeignKey("IdEstado")]
    [InverseProperty("Usuarios")]
    public virtual CatEstadoUsuario IdEstadoNavigation { get; set; } = null!;

    [ForeignKey("IdRol")]
    [InverseProperty("Usuarios")]
    public virtual CatRol IdRolNavigation { get; set; } = null!;

    [InverseProperty("BloqueadoPorNavigation")]
    public virtual ICollection<Ipbloqueadum> Ipbloqueada { get; set; } = new List<Ipbloqueadum>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<MaterialIncautado> MaterialIncautados { get; set; } = new List<MaterialIncautado>();

    [InverseProperty("SubidoPorNavigation")]
    public virtual ICollection<NovEdadEvidencium> NovEdadEvidencia { get; set; } = new List<NovEdadEvidencium>();

    [InverseProperty("Destinatario")]
    public virtual ICollection<Novedad> NovedadDestinatarios { get; set; } = new List<Novedad>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<Novedad> NovedadRegistradoPorNavigations { get; set; } = new List<Novedad>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<OperativoMilitar> OperativoMilitars { get; set; } = new List<OperativoMilitar>();

    [InverseProperty("CreadoPorNavigation")]
    public virtual ICollection<OrdenDium> OrdenDiumCreadoPorNavigations { get; set; } = new List<OrdenDium>();

    [InverseProperty("IdJefeLogisticaNavigation")]
    public virtual ICollection<OrdenDium> OrdenDiumIdJefeLogisticaNavigations { get; set; } = new List<OrdenDium>();

    [InverseProperty("IdJefeOperacionesNavigation")]
    public virtual ICollection<OrdenDium> OrdenDiumIdJefeOperacionesNavigations { get; set; } = new List<OrdenDium>();

    [InverseProperty("IdJefePersonalNavigation")]
    public virtual ICollection<OrdenDium> OrdenDiumIdJefePersonalNavigations { get; set; } = new List<OrdenDium>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<ParteInmediato> ParteInmediatos { get; set; } = new List<ParteInmediato>();

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    [InverseProperty("GeneradoPorNavigation")]
    public virtual ICollection<Reporte> Reportes { get; set; } = new List<Reporte>();

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<SesionActiva> SesionActivas { get; set; } = new List<SesionActiva>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<VehiculoOperativo> VehiculoOperativos { get; set; } = new List<VehiculoOperativo>();

    [InverseProperty("RegistradoPorNavigation")]
    public virtual ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();
}
