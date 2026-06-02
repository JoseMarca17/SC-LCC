import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function GestionLogisticaPersonal() {
  const [personal, setPersonal] = useState({ idOperativo: '', idEfectivo: '', rol: 'Destacado' });
  const [logistica, setLogistica] = useState({ idOperativo: '', idVehOp: '' });

  const handleAsignarPersonal = async (e) => {
    e.preventDefault();
    if (!personal.idOperativo || !personal.idEfectivo) return;

    try {
      const res = await fetch('http://localhost:5183/api/Operacion/asignar-personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          idOperativo: parseInt(personal.idOperativo),
          idEfectivo: parseInt(personal.idEfectivo),
          rol: personal.rol
        })
      });

      if (res.ok) {
        alert("Personal militar añadido a la columna de operaciones.");
        setPersonal({ idOperativo: personal.idOperativo, idEfectivo: '', rol: 'Destacado' });
      }
    } catch (err) { console.error(err); }
  };

  const handleAsignarVehiculo = async (e) => {
    e.preventDefault();
    if (!logistica.idOperativo || !logistica.idVehOp) return;

    try {
      const res = await fetch('http://localhost:5183/api/Operacion/asignar-vehiculo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          idOperativo: parseInt(logistica.idOperativo),
          idVehOp: parseInt(logistica.idVehOp)
        })
      });

      if (res.ok) {
        alert("Unidad del parque automotor asignada a la misión.");
        setLogistica({ idOperativo: logistica.idOperativo, idVehOp: '' });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* COLUMNA IZQUIERDA: ORGANIZACIÓN DEL PERSONAL */}
      <div className="space-y-5 border-r border-slate-100 pr-0 md:pr-10">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black uppercase text-[#0A192F] tracking-wider">Organización del Personal</h3>
          <p className="text-[11px] text-slate-400">Asignar oficiales y tropas al despliegue táctico.</p>
        </div>

        <form onSubmit={handleAsignarPersonal} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-slate-500 mb-1">ID OPERATIVO MILITAR</label>
            <input type="number" placeholder="Ej: 1" value={personal.idOperativo} onChange={e => setPersonal({...personal, idOperativo: e.target.value})} className="border p-2 text-xs" required />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-slate-500 mb-1">ID EFECTIVO (Militar)</label>
            <input type="number" placeholder="Ej: 24" value={personal.idEfectivo} onChange={e => setPersonal({...personal, idEfectivo: e.target.value})} className="border p-2 text-xs" required />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-slate-500 mb-1">Rol en la Patrulla</label>
            <input type="text" placeholder="Ej: Comandante de Grupo, Conductor, Tirador" value={personal.rol} onChange={e => setPersonal({...personal, rol: e.target.value})} className="border p-2 text-xs" required />
          </div>
          <button type="submit" className="w-full bg-[#0A192F] hover:bg-amber-500 text-white font-mono text-[10px] font-black py-2.5 uppercase tracking-widest transition-all rounded-sm cursor-pointer">
            Desplegar Personal
          </button>
        </form>
      </div>

      {/* COLUMNA DERECHA: GESTIÓN DEL PARQUE AUTOMOTOR */}
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black uppercase text-[#0A192F] tracking-wider">Gestión del Parque Automotor</h3>
          <p className="text-[11px] text-slate-400">Asignación de material rodante e ítems logísticos institucionales.</p>
        </div>

        <form onSubmit={handleAsignarVehiculo} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-slate-500 mb-1">ID OPERATIVO MILITAR</label>
            <input type="number" placeholder="Ej: 1" value={logistica.idOperativo} onChange={e => setLogistica({...logistica, idOperativo: e.target.value})} className="border p-2 text-xs" required />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-slate-500 mb-1">ID VEHÍCULO OPERATIVO INSTITUCIONAL</label>
            <input type="number" placeholder="Ej: 3 (Camioneta Ford)" value={logistica.idVehOp} onChange={e => setLogistica({...logistica, idVehOp: e.target.value})} className="border p-2 text-xs" required />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-black text-white font-mono text-[10px] font-black py-2.5 uppercase tracking-widest transition-all rounded-sm cursor-pointer">
            Asignar Unidad de Transporte
          </button>
        </form>
      </div>
    </div>
  );
}