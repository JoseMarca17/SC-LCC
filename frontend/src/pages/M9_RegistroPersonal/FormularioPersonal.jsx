import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function FormularioPersonal() {
  const [form, setForm] = useState({ codigoPersonal: '', nombres: '', apellidos: '', grado: 'Subteniente', unidadOrigen: '', idZona: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5183/api/Personal/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authService.getToken()}` },
        body: JSON.stringify({
          ...form,
          idZona: form.idZona ? parseInt(form.idZona) : null
        })
      });
      if (res.ok) {
        alert("Efectivo incorporado y validado en la Base de Datos con su HVT activa.");
        setForm({ codigoPersonal: '', nombres: '', apellidos: '', grado: 'Subteniente', unidadOrigen: '', idZona: '' });
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h3 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-[#0A192F]">Registrar / Pedir datos del Efectivo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Código Personal (SAGA / Matrícula)" value={form.codigoPersonal} onChange={e => setForm({...form, codigoPersonal: e.target.value})} className="border p-2.5 text-xs font-mono uppercase" required />
        <select value={form.grado} onChange={e => setForm({...form, grado: e.target.value})} className="border p-2.5 text-xs bg-white">
          <option value="Subteniente">Subteniente</option>
          <option value="Teniente">Teniente</option>
          <option value="Capitan">Capitán</option>
          <option value="Mayor">Mayor</option>
          <option value="Suboficial">Suboficial Primero</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Nombres" value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} className="border p-2.5 text-xs" required />
        <input type="text" placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} className="border p-2.5 text-xs" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Unidad de Origen (Ej: RI-23)" value={form.unidadOrigen} onChange={e => setForm({...form, unidadOrigen: e.target.value})} className="border p-2.5 text-xs" required />
        <input type="number" placeholder="ID Zona Inicial (Opcional)" value={form.idZona} onChange={e => setForm({...form, idZona: e.target.value})} className="border p-2.5 text-xs" />
      </div>
      <button type="submit" className="w-full bg-[#0A192F] hover:bg-amber-500 text-white font-black text-xs py-3.5 px-6 uppercase tracking-widest transition-all rounded-sm cursor-pointer">
        Validar y Asentar Alta de Efectivo
      </button>
    </form>
  );
}