import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import RegistrarComiso from './RegistrarComiso';
import ListadoComisos from './ListadoComisos'; 
// ── CORRECCIÓN 1: Importar el componente de evidencias fotográficas ──
import EvidenciaFoto from './EvidenciaFoto'; 

export default function IncautacionHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-ui text-slate-800">
      <Sidebar currentPath="incautacion" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="bg-[#060A12] py-10 px-10 shadow-2xl">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-[1px] w-10 bg-amarillo-fab" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-amarillo-fab font-black uppercase">Operaciones CEO-LCC</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Registro de <span className="text-white/70 font-light italic">Incautación</span>
              </h1>
            </div>
            {subModulo !== 'hub' && (
              <button onClick={() => setSubModulo('hub')} className="bg-white text-[#060A12] font-black text-[10px] px-8 py-3.5 uppercase tracking-widest hover:bg-amarillo-fab transition-all shadow-xl cursor-pointer">
                ← Regresar al Tablero
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 px-10 py-12">
          <div className="max-w-screen-xl mx-auto">
            {subModulo === 'hub' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ActionCard title="Nuevo Comiso" desc="Registro de acta, ubicación y material." icon="📦" onClick={() => setSubModulo('registrar')} color="border-emerald-600" />
                <ActionCard title="Consultar Actas" desc="Búsqueda de comisos y estados." icon="🔍" onClick={() => setSubModulo('consultar')} color="border-slate-500" />
                <ActionCard title="Evidencia Foto" desc="Adjuntar fotografías de mercadería." icon="📸" onClick={() => setSubModulo('fotos')} color="border-blue-500" />
                <ActionCard title="Anulación" desc="Baja lógica de registros erróneos." icon="🚫" onClick={() => setSubModulo('consultar')} color="border-red-600" />
              </div>
            ) : (
              <div className="bg-white rounded-sm shadow-2xl border border-slate-200 p-8 animate-in fade-in zoom-in-95 duration-300">
                {subModulo === 'registrar' && <RegistrarComiso />}
                {subModulo === 'consultar' && <ListadoComisos />}
                
                {/* ── CORRECCIÓN 2: Evaluar el estado 'fotos' para pintar la vista de evidencias ── */}
                {subModulo === 'fotos' && <EvidenciaFoto />}
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
    <button onClick={onClick} className={`bg-white p-8 rounded-sm shadow-lg border-t-4 ${color} flex flex-col items-start text-left group transition-all duration-300 hover:-translate-y-2 h-64 relative overflow-hidden cursor-pointer`}>
      <div className="text-2xl mb-6 bg-slate-50 w-12 h-12 flex items-center justify-center rounded shadow-inner group-hover:bg-[#003087] group-hover:text-white transition-all">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-[11px] text-slate-500 font-medium italic">{desc}</p>
    </button>
  );
}