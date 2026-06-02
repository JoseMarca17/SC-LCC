import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function GeneradorFiltros() {
  const [dataGrid, setDataGrid] = useState([]);
  const [filtros, setFiltros] = useState({
    tipoReporte: 1, // 1=Operativos, 2=Comisos, 3=Casos, 4=General
    idZona: '',
    idCategoria: '',
    idEstado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const token = authService.getToken();

  const cargarReportesFiltrados = async () => {
    try {
      // Construcción dinámica de la query string basada en tu controlador
      const queryParams = new URLSearchParams({ tipoReporte: filtros.tipoReporte });
      if (filtros.idZona) queryParams.append('idZona', filtros.idZona);
      if (filtros.idCategoria) queryParams.append('idCategoria', filtros.idCategoria);
      if (filtros.idEstado) queryParams.append('idEstado', filtros.idEstado);
      if (filtros.fechaInicio) queryParams.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) queryParams.append('fechaFin', filtros.fechaFin);

      const res = await fetch(`http://localhost:5183/api/InformesYReportes/generar-reporte?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDataGrid(data);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  };

  const exportarCSV = () => {
    // Aquí asumo que tienes el endpoint listo, de lo contrario esto genera el CSV en frontend
    console.log("Exportando CSV... asegúrate de tener el endpoint en el backend");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-5 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end rounded-sm">
        
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Tipo Reporte</label>
          <select 
            onChange={e => setFiltros({...filtros, tipoReporte: e.target.value})} 
            className="border p-2 text-xs bg-slate-50"
            value={filtros.tipoReporte}
          >
            <option value={1}>Operativos Realizados</option>
            <option value={2}>Comisos e Incautaciones</option>
            <option value={3}>Casos Activos/Cerrados</option>
            <option value={4}>Reporte General</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Zona Fronteriza (ID)</label>
          <input type="number" placeholder="Ej. 1" onChange={e => setFiltros({...filtros, idZona: e.target.value})} className="border p-2 text-xs bg-slate-50" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Inicio</label>
          <input type="date" onChange={e => setFiltros({...filtros, fechaInicio: e.target.value})} className="border p-2 text-xs bg-slate-50" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Fin</label>
          <input type="date" onChange={e => setFiltros({...filtros, fechaFin: e.target.value})} className="border p-2 text-xs bg-slate-50" />
        </div>

        <div className="lg:col-span-2 flex gap-2 h-[34px]">
          <button onClick={cargarReportesFiltrados} className="bg-[#0A192F] hover:bg-[#003087] transition-colors text-white text-xs font-bold px-4 uppercase tracking-wider w-full rounded-sm cursor-pointer">
            Aplicar Filtros
          </button>
          <button onClick={exportarCSV} className="bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-xs font-bold px-4 uppercase rounded-sm cursor-pointer">
            CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#060A12] text-slate-300 uppercase font-mono tracking-wider">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Lugar/Zona</th>
              <th className="p-3">Detalle</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Valoración (Bs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataGrid.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-400 italic">No hay registros para mostrar. Aplica filtros.</td></tr>
            ) : (
              dataGrid.map((d, index) => (
                <tr key={d.id || index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-amber-600 font-mono">{d.codigo}</td>
                  <td className="p-3">{d.fecha}</td>
                  <td className="p-3 font-medium text-slate-600">{d.lugar}</td>
                  <td className="p-3 italic text-slate-500 truncate max-w-xs">{d.detalle}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-slate-200 text-slate-800 rounded-sm text-[9px] font-black uppercase tracking-widest">
                      {d.estado}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold font-mono text-emerald-600">
                    {d.valor > 0 ? d.valor.toLocaleString('es-BO') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}