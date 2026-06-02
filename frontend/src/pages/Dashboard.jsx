import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { authService } from '../services/authService';

export default function Dashboard() {
  // Manejamos el estado aquí para que afecte a ambos componentes
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = authService.getUser();

  return (
    <div className="min-h-screen bg-slate-50 flex font-ui text-slate-800 selection:bg-[#003087] selection:text-white">
      
      {/* Sidebar recibe el estado y la función para cambiarlo */}
      <Sidebar 
        currentPath="dashboard" 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* El margen cambia de 72 (18rem) a 20 (5rem) suavemente */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* BANNER INSTITUCIONAL - CORRECCIÓN DE COLOR (SIN CELESTE) */}
        <header className="bg-[#060A12] p-10 border-b border-[#1E3050] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] text-amarillo-fab font-black uppercase mb-3 italic">
                Estado Plurinacional de Bolivia <span className="text-white/20 mx-2">|</span> Ministerio de Defensa
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Sistema de Control de Lucha <br /> 
                <span className="text-slate-300 font-light italic">Contra el Contrabando</span>
              </h1>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-5 rounded border border-white/10 min-w-[320px]">
              <p className="text-[10px] text-amarillo-fab font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-1 italic">
                Identidad Operativa Confirmada
              </p>
              <p className="text-lg font-bold uppercase tracking-tight">{user.nombreCompleto}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                {user.rolNombre} // CEO-LCC // SECURE_SESSION
              </p>
            </div>
          </div>
        </header>

        {/* CONTENIDO OPERATIVO */}
        <div className="p-8 space-y-8 animate-on-scroll">
          
          {/* KPIs CON ESTILO FORMAL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatBox title="Personal en Zona" value="1,402" desc="Efectivos Desplegados" color="border-[#003087]" />
            <StatBox title="Parque Automotor" value="92" desc="Unidades de Transporte" color="border-slate-400" />
            <StatBox title="Valor Decomisado" value="Bs. 2.8M" desc="Aporte Económico Mes" color="border-emerald-600" />
            <StatBox title="Incidentes" value="05" desc="Casos de Alta Gravedad" color="border-red-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabla de Mercadería (Referencia Caso de Uso 5) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center font-bold">
                <span className="text-[11px] uppercase tracking-widest text-[#003087]">Inventario de Material Incautado</span>
                <span className="text-[9px] text-slate-400">VISTA: TABLA_MERCADERIA</span>
              </div>
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                  <tr><th className="p-4">Código</th><th className="p-4">Descripción</th><th className="p-4 text-right">Valor Est.</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50"><td className="p-4 font-bold text-blue-900">MAT-2026-001</td><td className="p-4">TEXTILES / ROPA AMERICANA</td><td className="p-4 text-right font-black">Bs. 85,000</td></tr>
                  <tr className="hover:bg-slate-50"><td className="p-4 font-bold text-blue-900">MAT-2026-002</td><td className="p-4">HIDROCARBUROS / DIESEL</td><td className="p-4 text-right font-black">Bs. 12,000</td></tr>
                </tbody>
              </table>
            </div>

            {/* Disponibilidad Logística (Referencia Caso de Uso 4) */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-8 block">Estado de Flota Automotriz</span>
              <div className="space-y-8">
                <CapacityIndicator label="Unidades Operativas" val="82" color="bg-emerald-500" />
                <CapacityIndicator label="En Mantenimiento" val="12" color="bg-amber-500" />
                <CapacityIndicator label="Fuera de Servicio" val="6" color="bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTES AUXILIARES
function StatBox({ title, value, desc, color }) {
  return (
    <div className={`bg-white p-6 border-b-4 ${color} rounded shadow-sm hover:shadow-md transition-shadow`}>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
       <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
       <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide">{desc}</p>
    </div>
  );
}

function CapacityIndicator({ label, val, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span>{val}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${val}%` }}></div>
      </div>
    </div>
  );
}