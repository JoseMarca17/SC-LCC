using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SCLCC.Backend.Models;

namespace SCLCC.Backend.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AsignacionVehiculoOp> AsignacionVehiculoOps { get; set; }

    public virtual DbSet<Bitacora> Bitacoras { get; set; }

    public virtual DbSet<CatCanalRecepcion> CatCanalRecepcions { get; set; }

    public virtual DbSet<CatCategoriaBien> CatCategoriaBiens { get; set; }

    public virtual DbSet<CatDisposicionFinal> CatDisposicionFinals { get; set; }

    public virtual DbSet<CatEstadoComiso> CatEstadoComisos { get; set; }

    public virtual DbSet<CatEstadoDespliegue> CatEstadoDespliegues { get; set; }

    public virtual DbSet<CatEstadoEfectivo> CatEstadoEfectivos { get; set; }

    public virtual DbSet<CatEstadoFisico> CatEstadoFisicos { get; set; }

    public virtual DbSet<CatEstadoGrupo> CatEstadoGrupos { get; set; }

    public virtual DbSet<CatEstadoNovedad> CatEstadoNovedads { get; set; }

    public virtual DbSet<CatEstadoOperativo> CatEstadoOperativos { get; set; }

    public virtual DbSet<CatEstadoOrden> CatEstadoOrdens { get; set; }

    public virtual DbSet<CatEstadoParte> CatEstadoPartes { get; set; }

    public virtual DbSet<CatEstadoSesion> CatEstadoSesions { get; set; }

    public virtual DbSet<CatEstadoUsuario> CatEstadoUsuarios { get; set; }

    public virtual DbSet<CatEstadoVehiculo> CatEstadoVehiculos { get; set; }

    public virtual DbSet<CatFormatoExport> CatFormatoExports { get; set; }

    public virtual DbSet<CatNivelGravedad> CatNivelGravedads { get; set; }

    public virtual DbSet<CatRol> CatRols { get; set; }

    public virtual DbSet<CatRolCivil> CatRolCivils { get; set; }

    public virtual DbSet<CatTipoAccionBitacora> CatTipoAccionBitacoras { get; set; }

    public virtual DbSet<CatTipoDocumento> CatTipoDocumentos { get; set; }

    public virtual DbSet<CatTipoGrupo> CatTipoGrupos { get; set; }

    public virtual DbSet<CatTipoNovedad> CatTipoNovedads { get; set; }

    public virtual DbSet<CatTipoOperativo> CatTipoOperativos { get; set; }

    public virtual DbSet<CatTipoReporte> CatTipoReportes { get; set; }

    public virtual DbSet<CatTipoVehiculo> CatTipoVehiculos { get; set; }

    public virtual DbSet<CatZonaFronteriza> CatZonaFronterizas { get; set; }

    public virtual DbSet<Civil> Civils { get; set; }

    public virtual DbSet<Comiso> Comisos { get; set; }

    public virtual DbSet<ComisoXcivil> ComisoXcivils { get; set; }

    public virtual DbSet<ComisoXefectivo> ComisoXefectivos { get; set; }

    public virtual DbSet<ComisoXvehiculo> ComisoXvehiculos { get; set; }

    public virtual DbSet<Despliegue> Despliegues { get; set; }

    public virtual DbSet<Efectivo> Efectivos { get; set; }

    public virtual DbSet<EfectivoGrupo> EfectivoGrupos { get; set; }

    public virtual DbSet<Evidencium> Evidencia { get; set; }

    public virtual DbSet<Fotografium> Fotografia { get; set; }

    public virtual DbSet<FuerzaTareaConjunto> FuerzaTareaConjuntos { get; set; }

    public virtual DbSet<GrupoTarea> GrupoTareas { get; set; }

    public virtual DbSet<HojaVidaTactica> HojaVidaTacticas { get; set; }

    public virtual DbSet<HvtNovedad> HvtNovedads { get; set; }

    public virtual DbSet<HvtOperativo> HvtOperativos { get; set; }

    public virtual DbSet<Ipbloqueadum> Ipbloqueada { get; set; }

    public virtual DbSet<MaterialIncautado> MaterialIncautados { get; set; }

    public virtual DbSet<NovEdadEvidencium> NovEdadEvidencia { get; set; }

    public virtual DbSet<Novedad> Novedads { get; set; }

    public virtual DbSet<OperativoEfectivo> OperativoEfectivos { get; set; }

    public virtual DbSet<OperativoMilitar> OperativoMilitars { get; set; }

    public virtual DbSet<OrdenDium> OrdenDia { get; set; }

    public virtual DbSet<ParteInmediato> ParteInmediatos { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Reporte> Reportes { get; set; }

    public virtual DbSet<SesionActiva> SesionActivas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Vehiculo> Vehiculos { get; set; }

    public virtual DbSet<VehiculoOperativo> VehiculoOperativos { get; set; }

    public virtual DbSet<VwComisoResuman> VwComisoResumen { get; set; }

    public virtual DbSet<VwEfectivoResuman> VwEfectivoResumen { get; set; }

    public virtual DbSet<VwSesionesActiva> VwSesionesActivas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Modern_Spanish_CI_AS");

        modelBuilder.Entity<AsignacionVehiculoOp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Asignaci__3213E83FC59DDF9F");

            entity.Property(e => e.FechaAsignacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AsignadoPorNavigation).WithMany(p => p.AsignacionVehiculoOps).HasConstraintName("FK__Asignacio__asign__4D2A7347");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.AsignacionVehiculoOps).HasConstraintName("FK__Asignacio__idGru__4B422AD5");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.AsignacionVehiculoOps).HasConstraintName("FK__Asignacio__idOpe__4A4E069C");

            entity.HasOne(d => d.IdVehOpNavigation).WithMany(p => p.AsignacionVehiculoOps)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Asignacio__idVeh__4959E263");
        });

        modelBuilder.Entity<Bitacora>(entity =>
        {
            entity.HasKey(e => e.IdRegistro).HasName("PK__Bitacora__62FC8F5818574305");

            entity.Property(e => e.Fecha).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdAccionNavigation).WithMany(p => p.Bitacoras)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bitacora__idAcci__1AD3FDA4");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Bitacoras).HasConstraintName("FK__Bitacora__idUsua__1CBC4616");
        });

        modelBuilder.Entity<CatCanalRecepcion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatCanal__3213E83F8A98CB7F");
        });

        modelBuilder.Entity<CatCategoriaBien>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatCateg__3213E83F4517EBF2");
        });

        modelBuilder.Entity<CatDisposicionFinal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatDispo__3213E83FD5E93521");
        });

        modelBuilder.Entity<CatEstadoComiso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F8E4476D4");
        });

        modelBuilder.Entity<CatEstadoDespliegue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F6BA83BCA");
        });

        modelBuilder.Entity<CatEstadoEfectivo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F260DDC2C");
        });

        modelBuilder.Entity<CatEstadoFisico>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F083DE30D");
        });

        modelBuilder.Entity<CatEstadoGrupo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F1701D769");
        });

        modelBuilder.Entity<CatEstadoNovedad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83FB2BB762C");
        });

        modelBuilder.Entity<CatEstadoOperativo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F5970147C");
        });

        modelBuilder.Entity<CatEstadoOrden>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F0820C364");
        });

        modelBuilder.Entity<CatEstadoParte>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F7DAD379C");
        });

        modelBuilder.Entity<CatEstadoSesion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F1E1B643D");
        });

        modelBuilder.Entity<CatEstadoUsuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F7256B0B3");
        });

        modelBuilder.Entity<CatEstadoVehiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatEstad__3213E83F72879FAA");
        });

        modelBuilder.Entity<CatFormatoExport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatForma__3213E83F06B02D60");
        });

        modelBuilder.Entity<CatNivelGravedad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatNivel__3213E83F98116672");
        });

        modelBuilder.Entity<CatRol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatRol__3213E83FBABB7DE0");
        });

        modelBuilder.Entity<CatRolCivil>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatRolCi__3213E83F5CCA8789");
        });

        modelBuilder.Entity<CatTipoAccionBitacora>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoA__3213E83FC96C1282");
        });

        modelBuilder.Entity<CatTipoDocumento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoD__3213E83F9FDB9BD1");
        });

        modelBuilder.Entity<CatTipoGrupo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoG__3213E83FB65CD09C");
        });

        modelBuilder.Entity<CatTipoNovedad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoN__3213E83FF04EC2E7");
        });

        modelBuilder.Entity<CatTipoOperativo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoO__3213E83FC0F1D33F");
        });

        modelBuilder.Entity<CatTipoReporte>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoR__3213E83FB62EFC5C");
        });

        modelBuilder.Entity<CatTipoVehiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatTipoV__3213E83F9A6BA907");
        });

        modelBuilder.Entity<CatZonaFronteriza>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CatZonaF__3213E83F9BA2E0AA");

            entity.Property(e => e.Activa).HasDefaultValue(true);
        });

        modelBuilder.Entity<Civil>(entity =>
        {
            entity.HasKey(e => e.IdCivil).HasName("PK__Civil__45041FCD8FF11FC9");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Nacionalidad).HasDefaultValue("Boliviana");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Civils)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Civil__idRol__70A8B9AE");

            entity.HasOne(d => d.IdTipoDocumentoNavigation).WithMany(p => p.Civils)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Civil__idTipoDoc__6EC0713C");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.Civils).HasConstraintName("FK__Civil__registrad__719CDDE7");
        });

        modelBuilder.Entity<Comiso>(entity =>
        {
            entity.HasKey(e => e.IdComiso).HasName("PK__Comiso__B2AD4255380DD305");

            entity.Property(e => e.Fecha).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.AprobadoPorNavigation).WithMany(p => p.ComisoAprobadoPorNavigations).HasConstraintName("FK__Comiso__aprobado__0C50D423");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Comisos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comiso__idEstado__078C1F06");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.Comisos).HasConstraintName("FK__Comiso__idGrupo__0B5CAFEA");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.Comisos).HasConstraintName("FK__Comiso__idOperat__0A688BB1");

            entity.HasOne(d => d.IdParteNavigation).WithMany(p => p.Comisos).HasConstraintName("FK__Comiso__idParte__09746778");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.Comisos).HasConstraintName("FK__Comiso__idZona__05A3D694");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.ComisoRegistradoPorNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comiso__registra__0D44F85C");
        });

        modelBuilder.Entity<ComisoXcivil>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ComisoXC__3213E83F90EF3B93");

            entity.HasOne(d => d.IdCivilNavigation).WithMany(p => p.ComisoXcivils)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXCi__idCiv__12FDD1B2");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.ComisoXcivils)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXCi__idCom__1209AD79");
        });

        modelBuilder.Entity<ComisoXefectivo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ComisoXE__3213E83FEB66970C");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.ComisoXefectivos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXEf__idCom__1B9317B3");

            entity.HasOne(d => d.IdEfectivoNavigation).WithMany(p => p.ComisoXefectivos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXEf__idEfe__1C873BEC");
        });

        modelBuilder.Entity<ComisoXvehiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ComisoXV__3213E83F7A32DB6F");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.ComisoXvehiculos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXVe__idCom__16CE6296");

            entity.HasOne(d => d.IdVehiculoNavigation).WithMany(p => p.ComisoXvehiculos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ComisoXVe__idVeh__17C286CF");
        });

        modelBuilder.Entity<Despliegue>(entity =>
        {
            entity.HasKey(e => e.IdDespliegue).HasName("PK__Desplieg__A773226876529FC3");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdEfectivoNavigation).WithMany(p => p.Despliegues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Despliegu__idEfe__42E1EEFE");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Despliegues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Despliegu__idEst__46B27FE2");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.Despliegues).HasConstraintName("FK__Despliegu__idGru__43D61337");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.Despliegues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Despliegu__idZon__44CA3770");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.Despliegues).HasConstraintName("FK__Despliegu__regis__47A6A41B");
        });

        modelBuilder.Entity<Efectivo>(entity =>
        {
            entity.HasKey(e => e.IdEfectivo).HasName("PK__Efectivo__A7ACA73286DDCBA5");

            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.EfectivoCreadoPorNavigations).HasConstraintName("FK__Efectivo__creado__25518C17");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Efectivos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Efectivo__idEsta__22751F6C");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.EfectivoIdUsuarioNavigations).HasConstraintName("FK__Efectivo__idUsua__236943A5");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.Efectivos).HasConstraintName("FK__Efectivo__idZona__208CD6FA");
        });

        modelBuilder.Entity<EfectivoGrupo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Efectivo__3213E83F87B6722F");

            entity.HasIndex(e => new { e.IdEfectivo, e.IdGrupo }, "UQ_EfectivoGrupo_Activo")
                .IsUnique()
                .HasFilter("([activo]=(1))");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAsignacion).HasDefaultValueSql("(CONVERT([date],getdate()))");

            entity.HasOne(d => d.AsignadoPorNavigation).WithMany(p => p.EfectivoGrupos).HasConstraintName("FK__EfectivoG__asign__40058253");

            entity.HasOne(d => d.IdEfectivoNavigation).WithMany(p => p.EfectivoGrupos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EfectivoG__idEfe__3C34F16F");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.EfectivoGrupos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EfectivoG__idGru__3D2915A8");
        });

        modelBuilder.Entity<Evidencium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Evidenci__3213E83FFC7990E7");

            entity.Property(e => e.FechaSubida).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.Evidencia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Evidencia__idCom__27F8EE98");

            entity.HasOne(d => d.SubidoPorNavigation).WithMany(p => p.Evidencia).HasConstraintName("FK__Evidencia__subid__29E1370A");
        });

        modelBuilder.Entity<Fotografium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Fotograf__3213E83F2F0E2B48");

            entity.Property(e => e.FechaSubida).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.SubidoPorNavigation).WithMany(p => p.Fotografia).HasConstraintName("FK__Fotografi__subid__00DF2177");
        });

        modelBuilder.Entity<FuerzaTareaConjunto>(entity =>
        {
            entity.HasKey(e => e.IdFtc).HasName("PK__FuerzaTa__39CE247CD68B7BA7");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.FuerzaTareaConjuntos).HasConstraintName("FK__FuerzaTar__idZon__2DE6D218");
        });

        modelBuilder.Entity<GrupoTarea>(entity =>
        {
            entity.HasKey(e => e.IdGrupo).HasName("PK__GrupoTar__EC597A8718B22544");

            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.GrupoTareas).HasConstraintName("FK__GrupoTare__cread__395884C4");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.GrupoTareas)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GrupoTare__idEst__367C1819");

            entity.HasOne(d => d.IdFtcNavigation).WithMany(p => p.GrupoTareas).HasConstraintName("FK__GrupoTare__idFTC__37703C52");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.GrupoTareas)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GrupoTare__idTip__339FAB6E");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.GrupoTareas).HasConstraintName("FK__GrupoTare__idZon__3493CFA7");
        });

        modelBuilder.Entity<HojaVidaTactica>(entity =>
        {
            entity.HasKey(e => e.IdHoja).HasName("PK__HojaVida__770444D515B35F71");

            entity.Property(e => e.UltimaActualizacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdEfectivoNavigation).WithOne(p => p.HojaVidaTactica)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HojaVidaT__idEfe__29221CFB");
        });

        modelBuilder.Entity<HvtNovedad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HVT_Nove__3213E83F8109E5A4");

            entity.HasOne(d => d.IdHojaNavigation).WithMany(p => p.HvtNovedads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HVT_Noved__idHoj__5C6CB6D7");

            entity.HasOne(d => d.IdNovedadNavigation).WithMany(p => p.HvtNovedads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HVT_Noved__idNov__5D60DB10");
        });

        modelBuilder.Entity<HvtOperativo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HVT_Oper__3213E83F5FEBEDE7");

            entity.HasOne(d => d.IdHojaNavigation).WithMany(p => p.HvtOperativos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HVT_Opera__idHoj__57A801BA");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.HvtOperativos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HVT_Opera__idOpe__589C25F3");
        });

        modelBuilder.Entity<Ipbloqueadum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IPBloque__3213E83FC4552C0B");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaBloqueo).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.BloqueadoPorNavigation).WithMany(p => p.Ipbloqueada).HasConstraintName("FK__IPBloquea__bloqu__0F624AF8");
        });

        modelBuilder.Entity<MaterialIncautado>(entity =>
        {
            entity.HasKey(e => e.IdMaterial).HasName("PK__Material__6AC7E3EB8F52D78B");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstadoFisico).HasDefaultValue((byte)1);
            entity.Property(e => e.ValorTotal).HasComputedColumnSql("([cantidad]*[valorUnitario])", true);

            entity.HasOne(d => d.IdCategoriaNavigation).WithMany(p => p.MaterialIncautados)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MaterialI__idCat__2057CCD0");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.MaterialIncautados)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MaterialI__idCom__1F63A897");

            entity.HasOne(d => d.IdEstadoFisicoNavigation).WithMany(p => p.MaterialIncautados)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MaterialI__idEst__2334397B");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.MaterialIncautados).HasConstraintName("FK__MaterialI__regis__24285DB4");
        });

        modelBuilder.Entity<NovEdadEvidencium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NovEdadE__3213E83FD082D845");

            entity.Property(e => e.FechaSubida).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdNovedadNavigation).WithMany(p => p.NovEdadEvidencia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NovEdadEv__idNov__3B0BC30C");

            entity.HasOne(d => d.SubidoPorNavigation).WithMany(p => p.NovEdadEvidencia).HasConstraintName("FK__NovEdadEv__subid__3CF40B7E");
        });

        modelBuilder.Entity<Novedad>(entity =>
        {
            entity.HasKey(e => e.IdNovedad).HasName("PK__Novedad__CD11A516398AABCD");

            entity.Property(e => e.Fecha).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);
            entity.Property(e => e.IdGravedad).HasDefaultValue((byte)1);

            entity.HasOne(d => d.Destinatario).WithMany(p => p.NovedadDestinatarios).HasConstraintName("FK__Novedad__destina__36470DEF");

            entity.HasOne(d => d.IdComisoNavigation).WithMany(p => p.Novedads).HasConstraintName("FK__Novedad__idComis__336AA144");

            entity.HasOne(d => d.IdEfectivoNavigation).WithMany(p => p.Novedads).HasConstraintName("FK__Novedad__idEfect__32767D0B");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Novedads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Novedad__idEstad__2F9A1060");

            entity.HasOne(d => d.IdGravedadNavigation).WithMany(p => p.Novedads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Novedad__idGrave__318258D2");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.Novedads).HasConstraintName("FK__Novedad__idOpera__345EC57D");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.Novedads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Novedad__idTipo__2CBDA3B5");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.Novedads).HasConstraintName("FK__Novedad__idZona__3552E9B6");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.NovedadRegistradoPorNavigations).HasConstraintName("FK__Novedad__registr__373B3228");
        });

        modelBuilder.Entity<OperativoEfectivo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Operativ__3213E83F756432D5");

            entity.HasOne(d => d.IdEfectivoNavigation).WithMany(p => p.OperativoEfectivos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Operativo__idEfe__56E8E7AB");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.OperativoEfectivos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Operativo__idOpe__55F4C372");
        });

        modelBuilder.Entity<OperativoMilitar>(entity =>
        {
            entity.HasKey(e => e.IdOperativo).HasName("PK__Operativ__0216BABE604F70B3");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.OperativoMilitars)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Operativo__idEst__4F47C5E3");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.OperativoMilitars).HasConstraintName("FK__Operativo__idGru__503BEA1C");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.OperativoMilitars)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Operativo__idTip__4C6B5938");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.OperativoMilitars).HasConstraintName("FK__Operativo__idZon__4D5F7D71");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.OperativoMilitars).HasConstraintName("FK__Operativo__regis__51300E55");
        });

        modelBuilder.Entity<OrdenDium>(entity =>
        {
            entity.HasKey(e => e.IdOrden).HasName("PK__OrdenDia__C8AAF6F3742F66FF");

            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.OrdenDiumCreadoPorNavigations).HasConstraintName("FK__OrdenDia__creado__5E8A0973");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.OrdenDia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrdenDia__idEsta__5AB9788F");

            entity.HasOne(d => d.IdJefeLogisticaNavigation).WithMany(p => p.OrdenDiumIdJefeLogisticaNavigations).HasConstraintName("FK__OrdenDia__idJefe__625A9A57");

            entity.HasOne(d => d.IdJefeOperacionesNavigation).WithMany(p => p.OrdenDiumIdJefeOperacionesNavigations).HasConstraintName("FK__OrdenDia__idJefe__607251E5");

            entity.HasOne(d => d.IdJefePersonalNavigation).WithMany(p => p.OrdenDiumIdJefePersonalNavigations).HasConstraintName("FK__OrdenDia__idJefe__6166761E");

            entity.HasOne(d => d.IdOperativoNavigation).WithMany(p => p.OrdenDia).HasConstraintName("FK__OrdenDia__idOper__5CA1C101");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.OrdenDia).HasConstraintName("FK__OrdenDia__idZona__5D95E53A");
        });

        modelBuilder.Entity<ParteInmediato>(entity =>
        {
            entity.HasKey(e => e.IdParte).HasName("PK__ParteInm__54A22504DE46B1E9");

            entity.Property(e => e.FechaRecepcion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdCanalNavigation).WithMany(p => p.ParteInmediatos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ParteInme__idCan__681373AD");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.ParteInmediatos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ParteInme__idEst__69FBBC1F");

            entity.HasOne(d => d.IdGrupoNavigation).WithMany(p => p.ParteInmediatos).HasConstraintName("FK__ParteInme__idGru__671F4F74");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.ParteInmediatos).HasConstraintName("FK__ParteInme__regis__6AEFE058");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RefreshT__3213E83FB82AC087");

            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.RefreshTokens)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RefreshTo__idUsu__09A971A2");
        });

        modelBuilder.Entity<Reporte>(entity =>
        {
            entity.HasKey(e => e.IdReporte).HasName("PK__Reporte__40D65D3C19DED527");

            entity.Property(e => e.FechaGeneracion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.GeneradoPorNavigation).WithMany(p => p.Reportes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reporte__generad__52E34C9D");

            entity.HasOne(d => d.IdFormatoNavigation).WithMany(p => p.Reportes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reporte__idForma__51EF2864");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.Reportes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reporte__idTipo__5006DFF2");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.Reportes).HasConstraintName("FK__Reporte__idZona__53D770D6");
        });

        modelBuilder.Entity<SesionActiva>(entity =>
        {
            entity.HasKey(e => e.IdSesion).HasName("PK__SesionAc__DB6C2DE6441F8F7F");

            entity.Property(e => e.FechaInicio).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);
            entity.Property(e => e.UltimaActividad).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.SesionActivas)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SesionAct__idEst__17F790F9");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.SesionActivas)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SesionAct__idUsu__14270015");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuario__645723A6E68A09DA");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Usuarios)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuario__idEstad__01142BA1");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuario__idRol__02084FDA");
        });

        modelBuilder.Entity<Vehiculo>(entity =>
        {
            entity.HasKey(e => e.IdVehiculo).HasName("PK__Vehiculo__48682970538678AA");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdDisposicion).HasDefaultValue((byte)1);
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdCivilNavigation).WithMany(p => p.Vehiculos).HasConstraintName("FK__Vehiculo__idCivi__7B264821");

            entity.HasOne(d => d.IdDisposicionNavigation).WithMany(p => p.Vehiculos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__idDisp__7A3223E8");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Vehiculos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__idEsta__7849DB76");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.Vehiculos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehiculo__idTipo__76619304");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.Vehiculos).HasConstraintName("FK__Vehiculo__regist__7C1A6C5A");
        });

        modelBuilder.Entity<VehiculoOperativo>(entity =>
        {
            entity.HasKey(e => e.IdVehOp).HasName("PK__Vehiculo__3095C75A351A52AF");

            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IdEstado).HasDefaultValue((byte)1);

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.VehiculoOperativos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VehiculoO__idEst__42ACE4D4");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.VehiculoOperativos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VehiculoO__idTip__40C49C62");

            entity.HasOne(d => d.IdZonaNavigation).WithMany(p => p.VehiculoOperativos).HasConstraintName("FK__VehiculoO__idZon__44952D46");

            entity.HasOne(d => d.RegistradoPorNavigation).WithMany(p => p.VehiculoOperativos).HasConstraintName("FK__VehiculoO__regis__4589517F");
        });

        modelBuilder.Entity<VwComisoResuman>(entity =>
        {
            entity.ToView("vw_ComisoResumen");
        });

        modelBuilder.Entity<VwEfectivoResuman>(entity =>
        {
            entity.ToView("vw_EfectivoResumen");
        });

        modelBuilder.Entity<VwSesionesActiva>(entity =>
        {
            entity.ToView("vw_SesionesActivas");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
