import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function ControlSesiones() {
  const [sesiones, setSesiones] = useState([]);
  const [ipBloquear, setIpBloquear] = useState('');
  const [motivo, setMotivo] = useState('');
  const [notificacion, setNotificacion] = useState('');

  const token = authService.getToken();

  const cargarSesiones = async () => {
    try {
      const res = await fetch('http://localhost:5183/api/Usuarios/sesiones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setSesiones(await res.json());
    } catch (err) { console.error("Error cargando flujos de red", err); }
  };

  useEffect(() => {
    cargarSesiones();
    const interval = setInterval(cargarSesiones, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, []);

  const handleForzarCierre = async (idSesion) => {
    if (!window.confirm("¿Confirma la expulsión inmediata de esta sesión del sistema?")) return;
    try {
      const res = await fetch(`http://localhost:5183/api/Usuarios/sesiones/${idSesion}/forzar-cierre`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotificacion("Sesión revocada exitosamente.");
        cargarSesiones();
      }
    } catch (err) { console.error(err); }
  };

  const handleBloquearIP = async (e) => {
    e.preventDefault();
    if (!window.confirm(`¿Confirma el bloqueo permanente de la IP: ${ipBloquear}?`)) return;
    try {
      const res = await fetch('http://localhost:5183/api/Usuarios/bloquear-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ip: ipBloquear, motivo })
      });
      if (res.ok) {
        setNotificacion(`IP ${ipBloquear} agregada a la lista de denegación perimetral.`);
        setIpBloquear(''); setMotivo('');
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in duration-300 font-ui">
      
      {/* Listado de Sesiones Concurrentes */}
      <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <h3 className="text-sm font-black uppercase text-[#003087] mb-4 tracking-wider">// Monitoreo de Sesiones Activas</h3>
        {notificacion && <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono rounded-sm font-bold uppercase">✓ {notificacion}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                <th className="p-3">Usuario</th>
                <th className="p-3">Dirección IP</th>
                <th className="p-3">Última Actividad</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sesiones.map(s => (
                <tr key={s.idSesion} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 uppercase">{s.usuario}</td>
                  <td className="p-3 text-blue-700 font-bold">{s.ipOrigen}</td>
                  <td className="p-3 text-slate-500">{new Date(s.ultimaActividad).toLocaleTimeString()}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleForzarCierre(s.idSesion)} className="text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-sm text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                      Revocar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario de Bloqueo de IP */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm h-fit">
        <h3 className="text-sm font-black uppercase text-red-600 mb-4 tracking-wider">// Restricción de Perímetro (IP)</h3>
        <form onSubmit={handleBloquearIP} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Dirección IP de Amenaza</label>
            <input type="text" value={ipBloquear} onChange={e => setIpBloquear(e.target.value)} required placeholder="ej: 192.168.1.50" className="border border-slate-200 p-2.5 text-xs bg-slate-50 rounded-sm font-mono font-bold" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Motivo del Bloqueo Técnico</label>
            <textarea value={motivo} onChange={e => setMotivo(e.target.value)} required placeholder="ej: Intentos masivos de fuerza bruta detected por logs..." className="border border-slate-200 p-2.5 text-xs bg-slate-50 rounded-sm font-medium h-24 outline-none" />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black uppercase py-3 tracking-widest shadow-md cursor-pointer transition-all">
            Ejecutar Bloqueo de Firewall
          </button>
        </form>
      </div>

    </div>
  );
}