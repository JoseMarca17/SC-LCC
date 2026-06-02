import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function AuditoriaBitacora() {
  const [logs, setLogs] = useState([]);
  const token = authService.getToken();

  useEffect(() => {
    const cargarBitacora = async () => {
      try {
        const res = await fetch('http://localhost:5183/api/Usuarios/bitacora', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setLogs(await res.json());
      } catch (err) { console.error(err); }
    };
    cargarBitacora();
  }, []);

  const getAccionLabel = (id) => {
    const acciones = { 1: 'INSERT', 2: 'UPDATE', 3: 'DELETE', 5: 'LOGIN', 6: 'LOGOUT', 7: 'REVOCACIÓN' };
    return acciones[id] || 'SISTEMA';
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 p-6 rounded-sm shadow-sm font-ui animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <span className="text-[9px] font-mono font-bold text-[#003087] uppercase tracking-widest">// Inteligencia Forense</span>
        <h2 className="text-lg font-black uppercase text-slate-900 mt-0.5">Bitácora de Auditoría del Sistema (UC-01-43)</h2>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full text-left font-mono text-[10px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 tracking-wider">
              <th className="p-3">Fecha Transacción</th>
              <th className="p-3">Operación</th>
              <th className="p-3">Tabla Afectada</th>
              <th className="p-3">Operador Remoto</th>
              <th className="p-3">Dirección IP</th>
              <th className="p-3">Estado Nuevo (JSON)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-bold">
            {logs.map(log => (
              <tr key={log.idRegistro} className="hover:bg-slate-50/50">
                <td className="p-3 text-slate-400 font-normal">{new Date(log.fecha).toLocaleString()}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-sm font-black text-[9px] ${log.idAccion === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : log.idAccion === 2 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{getAccionLabel(log.idAccion)}</span></td>
                <td className="p-3 text-slate-800 uppercase tracking-tight">{log.tabla} (ID: {log.registroId})</td>
                <td className="p-3 text-[#003087] uppercase">{log.operador}</td>
                <td className="p-3 text-slate-900">{log.ip}</td>
                <td className="p-3 text-slate-400 font-mono text-[9px] max-w-xs truncate" title={log.valorNuevo}>{log.valorNuevo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}