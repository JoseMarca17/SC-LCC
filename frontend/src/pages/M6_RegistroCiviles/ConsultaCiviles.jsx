import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function ConsultaCiviles() {
  const [civiles, setCiviles] = useState([]);
  const [buscar, setBuscar] = useState('');
  const token = authService.getToken();

  const cargarCiviles = async () => {
    const res = await fetch(`http://localhost:5183/api/Civil/listar?buscar=${buscar}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setCiviles(await res.json());
  };

  useEffect(() => { cargarCiviles(); }, [buscar]);

  return (
    <div className="space-y-6">
      <input type="text" placeholder="Buscar por Nombre, C.I. o Código..." value={buscar} onChange={e => setBuscar(e.target.value)} className="w-full border p-3.5 text-xs font-bold outline-none bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-sm shadow-inner" />
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-400 font-black uppercase"><th className="p-3">Código</th><th className="p-3">Documento</th><th className="p-3">Nombre Completo</th><th className="p-3">Rol</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {civiles.map(c => (
              <tr key={c.idCivil} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 text-indigo-600">{c.codigoRegistro}</td>
                <td className="p-3">{c.nroDocumento || 'S/D'}</td>
                <td className="p-3 text-slate-900 uppercase">{c.nombreCompleto}</td>
                <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{c.rol}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}