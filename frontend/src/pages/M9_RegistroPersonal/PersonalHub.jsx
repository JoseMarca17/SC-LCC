import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import FormularioPersonal from './FormularioPersonal';
import ConsultaPersonalHVT from './ConsultaPersonalHVT';
import { authService } from '../../services/authService';

export default function PersonalHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');
  const token = authService.getToken();

  const handleExportarReporte = () => {
    if (!token) {
      alert("Sesión expirada.");
      return;
    }
    window.open(`http://localhost:5183/api/Personal/exportar?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-ui text-slate-800">
      <Sidebar currentPath="personal" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="bg-[#0A192F] py-12 px-10 shadow-2xl">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[1px] w-12 bg-amber-500" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-amber-500 font-black uppercase">Fuerzas del Orden y Despliegue</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                9. Registro de <span className="text-amber-500">Personal Militar</span>
              </h1>
            </div>
            {subModulo !== 'hub' && (
              <button onClick={() => setSubModulo('hub')} className="bg-white text-[#0A192F] font-black text-[10px] px-8 py-3.5 uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl cursor-pointer rounded-sm">
                ← Volver al Menú
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 px-10 py-12">
          <div className="max-w-screen-xl mx-auto">
            {subModulo === 'hub' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ActionCard title="Alta de Personal" desc="Registrar datos de efectivo, asignación inicial de Grado, Unidad de Origen y validación." icon="🪖" onClick={() => setSubModulo('registrar')} color="border-amber-500" />
                <ActionCard title="HVT & Despliegues" desc="Asignar a Grupos de Tarea, registrar despliegue en zona fronteriza y consultar Hoja de Vida Táctica." icon="🗃️" onClick={() => setSubModulo('hvt')} color="border-red-600" />
                <ActionCard title="Generar Reporte" desc="Descargar el manifiesto general del personal desplegado y de reserva en CSV." icon="📊" onClick={handleExportarReporte} color="border-slate-400" />
              </div>
            ) : (
              <div className="bg-white p-10 shadow-2xl border border-slate-100 rounded-sm">
                {subModulo === 'registrar' && <FormularioPersonal />}
                {subModulo === 'hvt' && <ConsultaPersonalHVT />}
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
    <button onClick={onClick} className={`bg-white p-10 border-t-4 ${color} shadow-lg flex flex-col items-start text-left hover:-translate-y-2 transition-all h-72 cursor-pointer group w-full`}>
      <div className="text-4xl mb-8 bg-slate-50 w-16 h-16 flex items-center justify-center shadow-inner group-hover:bg-[#0A192F] group-hover:text-white transition-all rounded-sm">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest mb-3">{title}</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">{desc}</p>
    </button>
  );
}