import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import GeneradorFiltros from './GeneradorFiltros';
import PanelEstadisticas from './PanelEstadisticas';
import LienzoCartografico from './LienzoCartografico';

export default function ReportesHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-ui text-slate-800">
      <Sidebar currentPath="reportes" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-500 ease-in-out flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* BANNER DINÁMICO E INSTITUCIONAL */}
        <header className="bg-[#060A12] pt-12 pb-16 px-10 relative overflow-hidden shrink-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[10%] w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-amber-500" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-amber-500 font-black uppercase">
                  Módulo Integrado de Inteligencia
                </span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                3. Informes y <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Reportes</span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-xl text-sm font-medium leading-relaxed border-l-2 border-[#003087] pl-6 uppercase tracking-widest opacity-80">
                Consolidación estadística, análisis de georreferenciación criminal y fiscalización operativa del Comando de Control.
              </p>
            </div>

            {subModulo !== 'hub' && (
              <button 
                onClick={() => setSubModulo('hub')}
                className="group flex items-center gap-3 bg-white text-[#060A12] font-black text-[10px] px-8 py-4 uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all shadow-2xl [clip-path:polygon(10px_0%,100%_0%,calc(100%-10px)_100%,0%_100%)] cursor-pointer"
              >
                <span>← Volver al Centro de Mando</span>
              </button>
            )}
          </div>
        </header>

        {/* HUB DE ACCIONES E INYECCIÓN DE SUB-MÓDULOS */}
        <div className="flex-1 px-10 py-12 flex flex-col justify-start relative z-20">
          {subModulo === 'hub' ? (
            <div className="mt-8 max-w-screen-xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <ActionCard 
                title="Generar Reportes" 
                desc="Acceso a sábanas documentales filtradas por zonas, tipos de mercadería y estados de casos activos o cerrados."
                icon="📊"
                onClick={() => setSubModulo('reportes')}
                accent="border-blue-500"
              />

              <ActionCard 
                title="Estadísticas Tácticas" 
                desc="Paneles dinámicos comparativos por líneas de tiempo, volumen físico e impacto de incautaciones."
                icon="📈"
                onClick={() => setSubModulo('estadisticas')}
                accent="border-amber-500"
              />

              <ActionCard 
                title="Georeferenciación" 
                desc="Despliegue geográfico de incidencias fronterizas y mapeo térmico de calor por volumen delictivo."
                icon="📍"
                onClick={() => setSubModulo('georeferencia')}
                accent="border-red-500"
              />

            </div>
          ) : (
            <div className="mt-4 max-w-screen-xl mx-auto w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100">
              {subModulo === 'reportes' && <GeneradorFiltros />}
              {subModulo === 'estadisticas' && <PanelEstadisticas />}
              {subModulo === 'georeferencia' && <LienzoCartografico />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ActionCard({ title, desc, icon, onClick, accent }) {
  return (
    <button 
      onClick={onClick}
      className={`relative bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/30 flex flex-col items-start text-left group transition-all duration-500 hover:-translate-y-2 border-t-4 ${accent} overflow-hidden h-72 w-full cursor-pointer`}
    >
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 rotate-12 group-hover:rotate-0 select-none">
        {icon}
      </div>

      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:bg-[#003087] group-hover:text-white transition-all duration-500">
        {icon}
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 group-hover:text-[#003087] transition-colors">
        {title}
      </h3>
      
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100">
        {desc}
      </p>

      <div className="mt-auto flex items-center gap-2">
        <span className="h-[2px] w-0 bg-[#003087] group-hover:w-8 transition-all duration-500" />
        <span className="text-[9px] font-black text-[#003087] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
          Desplegar Vistas
        </span>
      </div>
    </button>
  );
}