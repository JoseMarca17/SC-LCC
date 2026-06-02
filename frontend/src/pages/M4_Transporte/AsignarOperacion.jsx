import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function AsignarOperacion() {
  const [vehiculos, setVehiculos] = useState([]);
  const [operativos, setOperativos] = useState([]);
  const [form, setForm] = useState({ idVehOp: '', idOperativo: '', idGrupo: '', fechaAsignacion: '' });
  const [loading, setLoading] = useState(false);

  const token = authService.getToken();

  useEffect(() => {
    // Cargar vehículos disponibles (Estado 1 = Incautado) y Operativos activos
    const fetchData = async () => {
      try {
        const resVeh = await fetch('http://localhost:5183/api/Transporte/listar-disponibles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resOp = await fetch('http://localhost:5183/api/Transporte/catalogos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resVeh.ok && resOp.ok) {
          setVehiculos(await resVeh.json());
          const cat = await resOp.json();
          setOperativos(cat.operativos);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5183/api/Transporte/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("✓ Vehículo asignado exitosamente a la columna logística.");
        setForm({ idVehOp: '', idOperativo: '', idGrupo: '', fechaAsignacion: '' });
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b-2 border-blue-600 pb-4">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Tarea 4.6 // Logística Militar</span>
        <h2 className="text-2xl font-black uppercase text-slate-900">Asignación de Vehículo a Operación</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-sm shadow-inner border border-slate-200">
        
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Unidad de Transporte (Placa/VIN)</label>
          <select 
            required 
            onChange={e => setForm({...form, idVehOp: e.target.value})}
            className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="">Seleccione vehículo disponible...</option>
            {vehiculos.map(v => (
              <option key={v.idVehiculo} value={v.idVehiculo}>{v.placa} - {v.marca} {v.modelo}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Operativo Destino</label>
          <select 
            required 
            onChange={e => setForm({...form, idOperativo: e.target.value})}
            className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="">Seleccione código operativo...</option>
            {operativos.map(o => (
              <option key={o.idOperativo} value={o.idOperativo}>{o.codigoOperativo}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 p-4 bg-blue-100/50 border-l-4 border-blue-600 text-[11px] font-bold text-blue-900 italic">
          Nota: Al confirmar, el estado del vehículo cambiará automáticamente a "Asignado a Operación" en el inventario central.
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="md:col-span-2 bg-[#0F172A] text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:bg-slate-400"
        >
          {loading ? 'Procesando Asignación...' : 'Confirmar Despliegue Logístico'}
        </button>
      </form>
    </div>
  );
}