import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { authService } from '../services/authService';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [errorAcceso, setErrorAcceso] = useState(false);
  
  const user = authService.getUser() || { nombreCompleto: "Usuario Desconocido", rolNombre: "Invitado" };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setErrorAcceso(false);
        const token = authService.getToken();
        
        const res = await fetch('http://localhost:5183/api/Dashboard/resumen', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error(`Error de comunicación con el Mando Central: ${res.status}`);
        }
        
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Fallo en la sincronización del Dashboard:", error);
        setErrorAcceso(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-ui text-slate-800 selection:bg-[#003087] selection:text-white">
      
      {/* Sidebar con persistencia de estados */}
      <Sidebar 
        currentPath="dashboard" 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Margen dinámico que reacciona al repliegue del panel de control */}
      <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* BANNER INSTITUCIONAL MILITAR */}
        <header className="bg-[#060A12] p-10 border-b border-[#1E3050] text-white shadow-xl relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] text-amber-500 font-black uppercase mb-3 italic">
                Estado Plurinacional de Bolivia <span className="text-white/20 mx-2">|</span> Ministerio de Defensa
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Sistema de Control de Lucha <br /> 
                <span className="text-slate-400 font-light italic">Contra el Contrabando</span>
              </h1>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-5 rounded border border-white/10 min-w-[320px]">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-1 italic">
                Identidad Operativa Confirmada
              </p>
              <p className="text-lg font-bold uppercase tracking-tight">{user.nombreCompleto}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                {user.rolNombre} // MANDO CENTRAL
              </p>
            </div>
          </div>
        </header>

        {/* CUERPO DEL CENTRO DE MANDO */}
        <div className="p-8 flex-1 overflow-y-auto">
          {loading && (
            <div className="h-full flex flex-col items-center justify-center font-mono text-slate-400 gap-2 py-20">
              <span className="animate-spin text-xl">⏳</span>
              <span>[ INICIALIZANDO MÓDULOS DE INTELIGENCIA TÁCTICA... ]</span>
            </div>
          )}

          {errorAcceso && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-sm font-mono text-xs space-y-2">
              <p className="font-black uppercase">⚠️ CRITICAL_ERROR: FALLO DE COMUNICACIÓN CON EL BACKEND</p>
              <p className="text-slate-600">No se pudo recuperar el lote de datos centralizados. Verifica que tu API en .NET esté corriendo en el puerto 5183 y que tu sesión no haya expirado.</p>
            </div>
          )}

          {dashboardData && !loading && !errorAcceso && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* KPIs COMPLETA Y DIRECTAMENTE VINCULADOS A TUS TABLAS DE LA BASE DE DATOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatBox 
                  title="Personal Activo" 
                  value={dashboardData.kpis?.efectivos ?? 0} 
                  desc="Módulo de Personal militar desplegado" 
                  color="border-blue-600" 
                />
                <StatBox 
                  title="Flota del Parque Automotor" 
                  value={dashboardData.kpis?.vehiculosOp ?? 0} 
                  desc="Unidades logísticas operativas" 
                  color="border-emerald-500" 
                />
                <StatBox 
                  title="Valor Incautado Mes (Bs)" 
                  value={(dashboardData.kpis?.valorIncautado ?? 0).toLocaleString('es-BO')} 
                  desc="Suma acumulada de actas de comiso" 
                  color="border-amber-500" 
                />
                <StatBox 
                  title="Alertas Críticas Abiertas" 
                  value={dashboardData.kpis?.novedadesCriticas < 10 ? `0${dashboardData.kpis?.novedadesCriticas}` : dashboardData.kpis?.novedadesCriticas} 
                  desc="Incidentes urgentes sin procesar" 
                  color="border-red-600" 
                />
              </div>

              {/* PANALES DINÁMICOS ANALÍTICOS DE SEGUNDO NIVEL */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Recharts Líneas: Historial del valor monetario incautado */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003087]">Evolución Financiera de Comisos (Año Actual)</h3>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">MÓDULO: REPORTE_TENDENCIAS</span>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.graficoComisos || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(value) => `Bs.${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                        <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace', borderRadius: '2px', border: '1px solid #cbd5e1' }} />
                        <Line type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recharts Barras: Carga de trabajo operativa en Zonas Fronterizas */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003087] mb-6">Top Zonas con Mayor Actividad Operativa</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.graficoZonas || []} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="zona" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={100} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '11px', border: '1px solid #cbd5e1' }} />
                        <Bar dataKey="operativos" fill="#003087" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Módulo de Auditoría de Seguridad: Sesiones Online Vivas */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Fiscalización de Seguridad: Sesiones Activas</h3>
                    <span className="flex items-center gap-2 text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> CONEXIONES EN VIVO
                    </span>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="text-slate-400 bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="p-4 font-normal">Operador Autenticado</th>
                          <th className="p-4 font-normal">Rol Asignado</th>
                          <th className="p-4 font-normal text-right">Dirección IP de Origen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dashboardData.usuariosActivos?.length === 0 ? (
                          <tr><td colSpan="3" className="p-4 text-center text-slate-400 italic">No hay registros de sesiones activas.</td></tr>
                        ) : (
                          dashboardData.usuariosActivos?.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-bold text-slate-700">{u.nombre}</td>
                              <td className="p-4"><span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold">{u.rol}</span></td>
                              <td className="p-4 text-right text-slate-500 font-mono">{u.ip}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recharts Torta / Donut: Distribución de la Flota vehicular institucional */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 flex flex-col">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003087] mb-2 text-center">Disponibilidad del Parque Automotor</h3>
                  <div className="h-44 w-full flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={dashboardData.estadoLogistico || []} 
                          innerRadius={50} 
                          outerRadius={70} 
                          paddingAngle={3} 
                          dataKey="value"
                        >
                          {(dashboardData.estadoLogistico || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '11px', border: '1px solid #cbd5e1' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {(dashboardData.estadoLogistico || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-50 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="text-slate-900 font-mono">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// COMPONENTE AUXILIAR INTERNO OPTIMIZADO PARA KPIs
function StatBox({ title, value, desc, color }) {
  return (
    <div className={`bg-white p-5 border-t-4 ${color} rounded-sm shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-36`}>
       <div>
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">
           {title}
         </p>
         <p className="text-3xl font-black text-slate-800 tracking-tighter font-mono">
           {value}
         </p>
       </div>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide border-t border-slate-100 pt-2 shrink-0">
         {desc}
       </p>
    </div>
  );
}