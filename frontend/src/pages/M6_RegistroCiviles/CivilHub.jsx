import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import FormularioCivil from './FormularioCivil';
import ConsultaCiviles from './ConsultaCiviles';
import { authService } from '../../services/authService';

export default function CivilHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');
  const token = authService.getToken();

  const handleExportar = () => {
    if (!token) return alert("Sesión inválida.");
    window.open(`http://localhost:5183/api/Civil/exportar?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-ui text-slate-800">
      <Sidebar currentPath="civiles" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="bg-[#1E293B] py-12 px-10 shadow-2xl">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[1px] w-12 bg-indigo-400" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-indigo-400 font-black uppercase">Módulo 6 // Control de Personas e Infractores</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                Registro de <span className="text-indigo-400">Civiles</span>
              </h1>
            </div>
            {subModulo !== 'hub' && (
              <button onClick={() => setSubModulo('hub')} className="bg-white text-slate-900 font-black text-[10px] px-8 py-3.5 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl cursor-pointer rounded-sm">
                ← Volver al Panel
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 px-10 py-12">
          <div className="max-w-screen-xl mx-auto">
            {subModulo === 'hub' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ActionCard title="Registrar Persona" desc="Llenar formulario e indexar infractores, conductores o testigos." icon="👤" onClick={() => setSubModulo('registrar')} color="border-indigo-500" />
                <ActionCard title="Consulta Civiles" desc="Buscar de forma inmediata antecedentes y vinculaciones en el sistema." icon="🔍" onClick={() => setSubModulo('consultar')} color="border-slate-500" />
                <ActionCard title="Exportar Historial" desc="Descargar padrón oficial de civiles retenidos en operativos." icon="📊" onClick={handleExportar} color="border-slate-400" />
              </div>
            ) : (
              <div className="bg-white p-10 shadow-xl border border-slate-100 rounded-sm animate-in fade-in slide-in-from-top-4 duration-500">
                {subModulo === 'registrar' && <FormularioCivil />}
                {subModulo === 'consultar' && <ConsultaCiviles />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionCard({ title, desc, icon, onClick, color }) {
  return (
    <button onClick={onClick} className={`bg-white p-10 border-b-4 ${color} shadow-lg flex flex-col items-start text-left hover:-translate-y-2 transition-all h-72 cursor-pointer group`}>
      <div className="text-4xl mb-8 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest mb-3">{title}</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">{desc}</p>
    </button>
  );
}