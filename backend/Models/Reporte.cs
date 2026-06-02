using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("Reporte")]
[Index("FechaGeneracion", Name = "IX_Reporte_Fecha")]
[Index("IdTipo", Name = "IX_Reporte_Tipo")]
[Index("GeneradoPor", Name = "IX_Reporte_Usuario")]
public partial class Reporte
{
    [Key]
    [Column("idReporte")]
    public int IdReporte { get; set; }

    [Column("idTipo")]
    public byte IdTipo { get; set; }

    [Column("fechaGeneracion")]
    public DateTime FechaGeneracion { get; set; }

    [Column("filtros")]
    public string? Filtros { get; set; }

    [Column("idFormato")]
    public byte IdFormato { get; set; }

    [Column("rutaArchivo")]
    [StringLength(500)]
    public string? RutaArchivo { get; set; }

    [Column("generadoPor")]
    public int GeneradoPor { get; set; }

    [Column("idZona")]
    public short? IdZona { get; set; }

    [ForeignKey("GeneradoPor")]
    [InverseProperty("Reportes")]
    public virtual Usuario GeneradoPorNavigation { get; set; } = null!;

    [ForeignKey("IdFormato")]
    [InverseProperty("Reportes")]
    public virtual CatFormatoExport IdFormatoNavigation { get; set; } = null!;

    [ForeignKey("IdTipo")]
    [InverseProperty("Reportes")]
    public virtual CatTipoReporte IdTipoNavigation { get; set; } = null!;

    [ForeignKey("IdZona")]
    [InverseProperty("Reportes")]
    public virtual CatZonaFronteriza? IdZonaNavigation { get; set; }
}
