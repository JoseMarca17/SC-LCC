import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function FormularioCivil() {
  const [cat, setCat] = useState({ rolesCiviles: [], tiposDoc: [], comisosActivos: [] });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nroDocumento: '', idTipoDocumento: '1', nombres: '', apellidos: '',
    nacionalidad: 'Boliviana', idRol: '', telefono: '', direccion: '', observaciones: '', idComiso: ''
  });

  const token = authService.getToken();

  useEffect(() => {
    fetch('http://localhost:5183/api/Civil/catalogos', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setCat(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5183/api/Civil/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("✓ Registro civil e indexación completados de forma exitosa.");
        setForm({ nroDocumento: '', idTipoDocumento: '1', nombres: '', apellidos: '', nacionalidad: 'Boliviana', idRol: '', telefono: '', direccion: '', observaciones: '', idComiso: '' });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error al procesar el formulario.");
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black uppercase text-slate-900">Formulario de Registro Civil</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingrese los datos para la verificación e indexación de antecedentes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Nombres *</label>
          <input type="text" required value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-indigo-600 outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Apellidos *</label>
          <input type="text" required value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-indigo-600 outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Vincular a Acta de Comiso</label>
          <select value={form.idComiso} onChange={e => setForm({...form, idComiso: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold outline-none focus:border-indigo-600">
            <option value="">-- Seleccionar Acta (Opcional) --</option>
            {cat.comisosActivos.map(c => <option key={c.idComiso} value={c.idComiso}>{c.codigoComiso}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Tipo Documento</label>
          <select value={form.idTipoDocumento} onChange={e => setForm({...form, idTipoDocumento: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold outline-none">
            {cat.tiposDoc.map(t => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Nro Documento</label>
          <input type="text" value={form.nroDocumento} onChange={e => setForm({...form, nroDocumento: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-indigo-600 outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Rol / Condición *</label>
          <select required value={form.idRol} onChange={e => setForm({...form, idRol: e.target.value})} className="bg-slate-50 border-b-2 border-slate-200 p-3 text-xs font-bold outline-none focus:border-indigo-600">
            <option value="">Seleccione...</option>
            {cat.rolesCiviles.map(r => <option key={r.id} value={r.id}>{r.descripcion}</option>)}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 font-mono text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg">
        {loading ? 'Validando Ciudadano...' : 'Legalizar Registro en SC-LCC'}
      </button>
    </form>
  );
}