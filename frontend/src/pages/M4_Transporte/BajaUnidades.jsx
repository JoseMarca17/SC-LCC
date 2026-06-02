import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function BajaUnidades() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState({ idVehiculo: '', idEstado: '', motivo: '' });
  const token = authService.getToken();

  useEffect(() => {
    fetch('http://localhost:5183/api/Transporte/listar-activos', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setVehiculos(data));
  }, []);

  const handleBaja = async (e) => {
    e.preventDefault();
    if (!window.confirm("¿Confirma la baja definitiva de esta unidad?")) return;
    
    const res = await fetch('http://localhost:5183/api/Transporte/registrar-baja', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) alert("Registro de baja completado.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b-2 border-red-600 pb-2">
        <h2 className="text-xl font-black uppercase text-slate-900">Registro de Baja / Destrucción</h2>
      </div>
      <form onSubmit={handleBaja} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Seleccionar Vehículo</label>
          <select onChange={e => setForm({...form, idVehiculo: e.target.value})} className="border p-3 text-xs font-bold outline-none focus:border-red-600 bg-white">
            <option value="">-- Buscar por Placa --</option>
            {vehiculos.map(v => <option key={v.idVehiculo} value={v.idVehiculo}>{v.placa} - {v.marca}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Nuevo Estado de la Unidad</label>
          <select onChange={e => setForm({...form, idEstado: e.target.value})} className="border p-3 text-xs font-bold outline-none focus:border-red-600 bg-white">
            <option value="">Seleccione condición...</option>
            <option value="4">Incinerado</option>
            <option value="5">Destruido</option>
          </select>
        </div>
        <textarea 
          placeholder="Descripción detallada de la novedad / motivo de la baja..." 
          className="w-full border p-3 text-xs font-bold min-h-[100px] outline-none focus:border-red-600"
          onChange={e => setForm({...form, motivo: e.target.value})}
        />
        <button className="w-full bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
          Confirmar Baja en Inventario
        </button>
      </form>
    </div>
  );
}