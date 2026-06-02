import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function ListadoComisos() {
  const [comisos, setComisos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const token = authService.getToken();

  const cargarComisos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5183/api/Incautacion/listar?filtro=${filtro}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComisos(data);
      }
    } catch (err) {
      console.error("Error de conexión con las actas: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarComisos();
  }, [filtro]);

  const handleAnular = async (idComiso) => {
    if (!window.confirm("¿Está seguro de anular esta acta de incautación? Esta acción se registrará en la bitácora.")) return;
    
    try {
      const res = await fetch(`http://localhost:5183/api/Incautacion/${idComiso}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Acta anulada correctamente.");
        cargarComisos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-ui">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] font-mono font-bold text-[#003087] uppercase tracking-widest">// Padrón de Operaciones</span>
          <h2 className="text-lg font-black uppercase text-slate-900 mt-0.5">Actas de Comiso Registradas</h2>
        </div>
        <input 
          type="text" 
          placeholder="Filtrar por descripción de mercadería..." 
          value={filtro} 
          onChange={e => setFiltro(e.target.value)} 
          className="border border-slate-200 p-2.5 text-xs bg-slate-50 w-full md:w-80 outline-none focus:bg-white focus:border-[#003087] rounded-sm font-bold" 
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase">
              <th className="p-3">Fecha y Hora</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Detalle / Tipo de Bien</th>
              <th className="p-3 text-right">Cantidad Total</th>
              <th className="p-3 text-center">Ubicación GPS</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
            {loading ? (
              <tr><td colSpan="6" className="p-5 text-center text-slate-400">Consultando Base de Datos SC_LCC...</td></tr>
            ) : comisos.length === 0 ? (
              <tr><td colSpan="6" className="p-5 text-center text-slate-400">No se encontraron actas de incautación activas.</td></tr>
            ) : (
              comisos.map(c => (
                <tr key={c.idComiso} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-400 font-normal">{new Date(c.fechaRegistro).toLocaleString()}</td>
                  <td className="p-3 text-[#003087] uppercase text-[10px]">{c.categoria}</td>
                  <td className="p-3 text-slate-900 uppercase">{c.descripcion}</td>
                  <td className="p-3 text-right text-slate-900 font-black">{c.cantidad}</td>
                  <td className="p-3 text-center text-slate-400 text-[10px]">{c.latitud ? `${c.latitud}, ${c.longitud}` : 'Sin GPS'}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleAnular(c.idComiso)}
                      className="text-red-600 bg-red-50 border border-red-200 px-3 py-1 text-[10px] uppercase font-black hover:bg-red-600 hover:text-white transition-colors cursor-pointer rounded-sm"
                    >
                      Anular Acta
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}