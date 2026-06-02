using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SCLCC.Backend.Models;

[Table("MaterialIncautado")]
[Index("IdCategoria", Name = "IX_Material_Categoria")]
[Index("IdComiso", Name = "IX_Material_Comiso")]
public partial class MaterialIncautado
{
    [Key]
    [Column("idMaterial")]
    public int IdMaterial { get; set; }

    [Column("idComiso")]
    public int IdComiso { get; set; }

    [Column("tipoBien")]
    [StringLength(100)]
    public string TipoBien { get; set; } = null!;

    [Column("idCategoria")]
    public byte IdCategoria { get; set; }

    [Column("cantidad", TypeName = "decimal(12, 3)")]
    public decimal Cantidad { get; set; }

    [Column("unidadMedida")]
    [StringLength(30)]
    public string UnidadMedida { get; set; } = null!;

    [Column("descripcion")]
    [StringLength(400)]
    public string? Descripcion { get; set; }

    [Column("valorUnitario", TypeName = "decimal(18, 2)")]
    public decimal ValorUnitario { get; set; }

    [Column("valorTotal", TypeName = "decimal(31, 5)")]
    public decimal? ValorTotal { get; set; }

    [Column("idEstadoFisico")]
    public byte IdEstadoFisico { get; set; }

    [Column("actaDestruccion")]
    [StringLength(100)]
    public string? ActaDestruccion { get; set; }

    [Column("fechaDestruccion")]
    public DateOnly? FechaDestruccion { get; set; }

    [Column("registradoPor")]
    public int? RegistradoPor { get; set; }

    [Column("fechaRegistro")]
    public DateTime FechaRegistro { get; set; }

    [ForeignKey("IdCategoria")]
    [InverseProperty("MaterialIncautados")]
    public virtual CatCategoriaBien IdCategoriaNavigation { get; set; } = null!;

    [ForeignKey("IdComiso")]
    [InverseProperty("MaterialIncautados")]
    public virtual Comiso IdComisoNavigation { get; set; } = null!;

    [ForeignKey("IdEstadoFisico")]
    [InverseProperty("MaterialIncautados")]
    public virtual CatEstadoFisico IdEstadoFisicoNavigation { get; set; } = null!;

    [ForeignKey("RegistradoPor")]
    [InverseProperty("MaterialIncautados")]
    public virtual Usuario? RegistradoPorNavigation { get; set; }
}
