import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function ConsultaPersonalHVT() {
  const [buscarCodigo, setBuscarCodigo] = useState('');
  const [efectivo, setEfectivo] = useState(null);
  
  // Estados de los sub-formularios de asignación
  const [idGrupo, setIdGrupo] = useState('');
  const [idZonaDespliegue, setIdZonaDespliegue] = useState('');
  const [obsDespliegue, setObsDespliegue] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();
    setEfectivo(null);
    try {
      const res = await fetch(`http://localhost:5183/api/Personal/buscar?codigo=${buscarCodigo}`, {
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEfectivo(data);
      } else { alert("Efectivo inexistente o dado de baja."); }
    } catch (err) { console.error(err); }
  };

  const handleAsignarGrupo = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5183/api/Personal/asignar-grupo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authService.getToken()}` },
      body: JSON.stringify({ idEfectivo: efectivo.IdEfectivo, idGrupo: parseInt(idGrupo) })
    });
    if (res.ok) alert("Efectivo reasignado a Grupo de Tarea.");
  };

  const handleRegistrarDespliegue = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5183/api/Personal/registrar-despliegue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authService.getToken()}` },
      body: JSON.stringify({ idEfectivo: efectivo.IdEfectivo, idZona: parseInt(idZonaDespliegue), observaciones: obsDespliegue })
    });
    if (res.ok) {
      alert("Movimiento fronterizo asentado en HVT.");
      setBuscarCodigo(efectivo.CodigoPersonal);
      handleBuscar(e); // Recargar datos frescos
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleBuscar} className="flex gap-4 border-b pb-4">
        <input type="text" placeholder="Solicitar Datos del Efectivo a Buscar (Código)..." value={buscarCodigo} onChange={e => setBuscarCodigo(e.target.value)} className="border p-2 text-xs w-full font-mono uppercase" required />
        <button type="submit" className="bg-[#0A192F] hover:bg-amber-500 text-white font-bold text-xs px-6 uppercase rounded-sm cursor-pointer whitespace-nowrap">Buscar Efectivo</button>
      </form>

      {efectivo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Ficha de datos */}
          <div className="bg-slate-50 p-6 border rounded-sm md:col-span-1 space-y-3 text-xs">
            <h4 className="font-mono text-[10px] tracking-wider text-amber-600 font-black uppercase">Mostrar datos del Efectivo</h4>
            <p><strong>Fuerza:</strong> {efectivo.Grado} {efectivo.Nombres} {efectivo.Apellidos}</p>
            <p><strong>Código Táctico:</strong> <span className="font-mono">{efectivo.CodigoPersonal}</span></p>
            <p><strong>Unidad Base:</strong> {efectivo.UnidadOrigen}</p>
            <p><strong>Ubicación Actual:</strong> <span className="text-red-600 font-bold">{efectivo.ZonaAsignada}</span></p>
            <p><strong>Estado:</strong> <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full text-[10px]">{efectivo.Estado}</span></p>
          </div>

          {/* Hoja de Vida Táctica */}
          <div className="bg-slate-50 p-6 border border-t-red-600 rounded-sm md:col-span-2 space-y-4 text-xs">
            <h4 className="font-mono text-[10px] tracking-wider text-red-600 font-black uppercase">Consultar Hoja de Vida Táctica (HVT)</h4>
            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div><span className="text-slate-400 block text-[10px]">Total Operativos</span><span className="text-2xl font-black text-[#0A192F] font-mono">{efectivo.TotalOperativos}</span></div>
              <div><span className="text-slate-400 block text-[10px]">Último Despliegue</span><span className="text-sm font-bold font-mono">{efectivo.FechaUltimoDespliegue}</span></div>
            </div>
            <p className="italic text-slate-500 text-[11px]"><strong>Observaciones Legales:</strong> "{efectivo.ObservacionesHVT}"</p>

            {/* Operaciones de asignación rápida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <form onSubmit={handleAsignarGrupo} className="flex gap-2 items-end">
                <input type="number" placeholder="ID Grupo de Tarea" value={idGrupo} onChange={e => setIdGrupo(e.target.value)} className="border p-1.5 text-[11px] w-full bg-white" required />
                <button type="submit" className="bg-[#0A192F] text-white text-[10px] p-2 uppercase font-bold rounded-sm cursor-pointer whitespace-nowrap">Asignar Grupo</button>
              </form>
              <form onSubmit={handleRegistrarDespliegue} className="flex flex-col gap-2 border-l pl-4">
                <div className="flex gap-2">
                  <input type="number" placeholder="ID Frontera" value={idZonaDespliegue} onChange={e => setIdZonaDespliegue(e.target.value)} className="border p-1.5 text-[11px] w-full bg-white" required />
                  <button type="submit" className="bg-red-600 text-white text-[10px] p-2 uppercase font-bold rounded-sm cursor-pointer whitespace-nowrap">Desplegar</button>
                </div>
                <input type="text" placeholder="Observaciones / Motivo de despliegue" value={obsDespliegue} onChange={e => setObsDespliegue(e.target.value)} className="border p-1.5 text-[11px] bg-white" required />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}