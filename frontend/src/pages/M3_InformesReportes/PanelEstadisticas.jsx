import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function PanelEstadisticas() {
  const [stats, setStats] = useState({ porTiempo: [], porMercaderia: [], porDepartamento: [] });
  const [loading, setLoading] = useState(true);
  const token = authService.getToken();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5183/api/InformesYReportes/estadisticas-graficos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats({
          porTiempo: data.porTiempo || [],
          porMercaderia: data.porMercaderia || [],
          porDepartamento: data.porDepartamento || []
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-10 text-center text-slate-500 font-mono animate-pulse">Cargando métricas tácticas...</div>;

  // Calculamos el máximo para escalar las barras visuales
  const maxTiempo = Math.max(...stats.porTiempo.map(s => s.valor), 1);
  const maxMercaderia = Math.max(...stats.porMercaderia.map(s => s.valor), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Comparativa por Tiempo */}
      <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm space-y-5">
        <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-2">
          // Línea de Tiempo (Comisos)
        </h3>
        <div className="space-y-4">
          {stats.porTiempo.length === 0 ? <p className="text-xs text-slate-400">Sin datos.</p> : stats.porTiempo.map((pt, i) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono font-bold text-slate-700">
                <span>{pt.label}</span>
                <span>{pt.valor} actas</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${(pt.valor / maxTiempo) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativa por Mercadería */}
      <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm space-y-5">
        <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-2">
          // Top Mercadería Incautada
        </h3>
        <div className="space-y-4">
          {stats.porMercaderia.length === 0 ? <p className="text-xs text-slate-400">Sin datos.</p> : stats.porMercaderia.map((pm, i) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono font-bold text-slate-700">
                <span className="truncate pr-2">{pm.label}</span>
                <span>{pm.valor} items</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(pm.valor / maxMercaderia) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impacto por Departamento */}
      <div className="bg-[#060A12] p-6 rounded-sm shadow-xl space-y-5 lg:col-span-1 md:col-span-2">
        <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
          // Impacto Financiero x Depto
        </h3>
        <div className="space-y-4">
          {stats.porDepartamento.length === 0 ? <p className="text-xs text-slate-500">Sin datos.</p> : stats.porDepartamento.map((dep, i) => (
            <div key={i} className="flex justify-between items-center text-xs bg-slate-900/50 p-3 rounded-sm border border-slate-800">
              <div>
                <span className="font-black uppercase block text-slate-200 tracking-wider">{dep.depto}</span>
                <span className="text-[10px] text-slate-500 font-mono">{dep.comisos} Actas Procesadas</span>
              </div>
              <span className="font-mono text-emerald-500 font-black text-sm">
                Bs {dep.valor > 0 ? dep.valor.toLocaleString('es-BO') : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}