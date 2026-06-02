import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function ConsultaNovedades() {
  const [incidentes, setIncidentes] = useState([]);
  const [evidencia, setEvidencia] = useState({ idNovedad: '', rutaArchivo: '', nombreOriginal: '' });

  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:5183/api/Novedad/listar', {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIncidentes(data);
      }
    } catch (err) {
      console.error("Error al recuperar bitácora de novedades", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCierreComiso = async (id) => {
    if (!window.confirm("¿Confirma la validación legal para proceder al Cierre definitivo del Incidente/Comiso?")) return;

    try {
      const res = await fetch(`http://localhost:5183/api/Novedad/cambiar-estado/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ idEstado: 3 }) // 3 = Cerrada según CatEstadoNovedad
      });

      if (res.ok) {
        alert("Cierre de comiso asentado en los registros.");
        cargarDatos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjuntarEvidencia = async (e) => {
    e.preventDefault();
    if (!evidencia.idNovedad || !evidencia.rutaArchivo) {
      alert("Asigne un ID de incidente y una ruta válida.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5183/api/Novedad/adjuntar-evidencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          idNovedad: parseInt(evidencia.idNovedad),
          rutaArchivo: evidencia.rutaArchivo,
          nombreOriginal: evidencia.nombreOriginal || "EVIDENCIA_JUDICIAL.pdf"
        })
      });

      if (res.ok) {
        alert("Evidencia documental adjuntada de forma satisfactoria.");
        setEvidencia({ idNovedad: '', rutaArchivo: '', nombreOriginal: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECCIÓN: ADJUNTAR EVIDENCIA */}
      <form onSubmit={handleAdjuntarEvidencia} className="bg-slate-50 p-6 border border-slate-200 rounded-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="col-span-1 md:col-span-3 border-b border-slate-200 pb-1 mb-1">
          <h3 className="text-xs font-black uppercase text-[#0A192F] tracking-wide">Adjuntar Evidencia Documental</h3>
        </div>
        <div className="flex flex-col">
          <label className="text-[9px] font-mono text-slate-500 mb-1">ID INCIDENTE</label>
          <input type="number" placeholder="Ej: 1" value={evidencia.idNovedad} onChange={e => setEvidencia({ ...evidencia, idNovedad: e.target.value })} className="border p-2 text-xs bg-white rounded-sm" required />
        </div>
        <div className="flex flex-col">
          <label className="text-[9px] font-mono text-slate-500 mb-1">NOMBRE DEL ARCHIVO EVIDENCIA</label>
          <input type="text" placeholder="Ej: Acta_De_Infraccion.pdf" value={evidencia.nombreOriginal} onChange={e => setEvidencia({ ...evidencia, nombreOriginal: e.target.value })} className="border p-2 text-xs bg-white rounded-sm" required />
        </div>
        <div className="flex flex-col">
          <label className="text-[9px] font-mono text-slate-500 mb-1">RUTA / URL DEL BLOB STORAGE</label>
          <input type="text" placeholder="https://storage.sclcc.mil.bo/..." value={evidencia.rutaArchivo} onChange={e => setEvidencia({ ...evidencia, rutaArchivo: e.target.value })} className="border p-2 text-xs bg-white rounded-sm" required />
        </div>
        <button type="submit" className="bg-amber-500 text-white font-black text-xs py-2.5 px-4 uppercase tracking-wider rounded-sm md:col-span-3 hover:bg-[#0A192F] transition-all cursor-pointer">
          Vincular Documento de Evidencia
        </button>
      </form>

      {/* SECCIÓN: VALIDACIÓN Y TABLA */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase text-[#0A192F] tracking-wider">Validación y Padrón Judicial de Incidentes</h3>
        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0A192F] text-white uppercase font-mono tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Clasificación</th>
                <th className="p-4">Relación de Hechos</th>
                <th className="p-4">Severidad</th>
                <th className="p-4">Estado Acta</th>
                <th className="p-4 text-center">Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {incidentes.map((inc) => (
                <tr key={inc.IdNovedad} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-500">#{inc.IdNovedad}</td>
                  <td className="p-4 font-black text-amber-600 uppercase tracking-tight text-[11px]">{inc.Tipo}</td>
                  <td className="p-4 text-slate-600 font-medium italic">"{inc.Descripcion}"</td>
                  <td className="p-4 font-bold text-slate-700">{inc.Gravedad}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full ${inc.IdEstado === 3 ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800'}`}>
                      {inc.Estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {inc.IdEstado !== 3 ? (
                      <button onClick={() => handleCierreComiso(inc.IdNovedad)} className="bg-red-600 hover:bg-black text-white font-mono text-[9px] font-black px-3 py-2 uppercase tracking-wider rounded-sm transition-all cursor-pointer">
                        Cierre comiso
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold font-mono text-[10px] uppercase">✓ Resuelto</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}