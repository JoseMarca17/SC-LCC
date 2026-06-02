import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function FormularioNovedad() {
  const [form, setForm] = useState({ idTipo: '1', idGravedad: '1', descripcion: '', idComiso: '', idOperativo: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ── VALIDACIÓN DE DATOS EN FRONTEND ──
    if (!form.descripcion.trim()) {
      alert("La descripción detallada del incidente es obligatoria.");
      return;
    }

    setLoading(false);
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:5183/api/Novedad/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idTipo: parseInt(form.idTipo),
          idGravedad: parseInt(form.idGravedad),
          descripcion: form.descripcion,
          idComiso: form.idComiso ? parseInt(form.idComiso) : null,
          idOperativo: form.idOperativo ? parseInt(form.idOperativo) : null
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Formulario registrado de forma válida. ID Generado: ${data.idNovedad}`);
        setForm({ idTipo: '1', idGravedad: '1', descripcion: '', idComiso: '', idOperativo: '' });
      } else {
        alert(data.message || "Error al procesar el formulario.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el centro de mando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#0A192F]">7. Toma de Datos y Registro de Formulario</h2>
        <p className="text-xs text-slate-400 mt-1">Ingrese los datos punitivos del altercado para iniciar el acta legal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Clasificación del Incidente</label>
            <select value={form.idTipo} onChange={e => setForm({ ...form, idTipo: e.target.value })} className="border p-2.5 text-xs bg-white rounded-sm">
              <option value="1">Incidente Operativo</option>
              <option value="4">Enfrentamiento Armado</option>
              <option value="5">Accidente de Tránsito / Logístico</option>
              <option value="6">Hallazgo de Mercadería</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Nivel de Gravedad Jurídica</label>
            <select value={form.idGravedad} onChange={e => setForm({ ...form, idGravedad: e.target.value })} className="border p-2.5 text-xs bg-white rounded-sm">
              <option value="1">Baja (Faltas menores)</option>
              <option value="2">Media (Sanciones administrativas)</option>
              <option value="3">Alta (Crimen organizado / Contrabando masivo)</option>
              <option value="4">Crítica (Fallecidos / Uso de fuego hostil)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ID Acta de Comiso (Opcional)</label>
            <input type="number" placeholder="Ej: 14" value={form.idComiso} onChange={e => setForm({ ...form, idComiso: e.target.value })} className="border p-2.5 text-xs rounded-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ID Operativo Militar (Opcional)</label>
            <input type="number" placeholder="Ej: 5" value={form.idOperativo} onChange={e => setForm({ ...form, idOperativo: e.target.value })} className="border p-2.5 text-xs rounded-sm" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Relación Histórica de los Hechos</label>
          <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Escriba minuciosamente las novedades encontradas, datos de la patrulla e incidentes observados..." className="border p-3 text-xs h-36 rounded-sm resize-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#0A192F] hover:bg-amber-500 text-white font-black text-xs py-3.5 px-6 uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer disabled:opacity-50">
          {loading ? 'Procesando Transmisión...' : 'Registrar Formulario Oficial'}
        </button>
      </form>
    </div>
  );
}