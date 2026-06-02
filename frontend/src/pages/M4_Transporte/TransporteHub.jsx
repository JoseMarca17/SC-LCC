import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import RegistrarVehiculo from './RegistrarVehiculo';
import AsignarOperacion from './AsignarOperacion';
import BajaUnidades from './BajaUnidades';
import { authService } from '../../services/authService';

export default function TransporteHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');
  const token = authService.getToken();

  // ── EXPORTACIÓN INTERACTIVA PASANDO EL JWT POR QUERY STRING ──
  const handleExportar = () => {
    if (!token) {
      alert("Sesión expirada. Por favor vuelva a iniciar sesión.");
      return;
    }
    // Viaja el token por parámetro para eludir las restricciones nativas de window.open
    window.open(`http://localhost:5183/api/Transporte/exportar?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-ui text-slate-800">
      <Sidebar currentPath="transporte" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="bg-[#0F172A] py-12 px-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-blue-400" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-blue-400 font-black uppercase">División de Logística y Transporte</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
              Control de <span className="text-blue-400">Transporte</span>
            </h1>
            {subModulo !== 'hub' && (
              <button onClick={() => setSubModulo('hub')} className="mt-8 bg-white text-slate-900 font-black text-[10px] px-8 py-3 uppercase tracking-widest hover:bg-blue-400 transition-all shadow-xl cursor-pointer">
                ← Volver al Panel Logístico
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 px-10 py-12">
          <div className="max-w-screen-xl mx-auto">
            {subModulo === 'hub' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                <ActionCard title="Registrar Incautado" desc="Ingreso de nuevos vehículos, placas y VIN." icon="🚜" onClick={() => setSubModulo('registrar')} color="border-blue-600" />
                <ActionCard title="Asignar Operación" desc="Vinculación de unidades a misiones tácticas." icon="📑" onClick={() => setSubModulo('asignar')} color="border-emerald-600" />
                <ActionCard title="Baja de Unidades" desc="Registro de vehículos incinerados o destruidos." icon="🔥" onClick={() => setSubModulo('baja')} color="border-red-600" />
                <ActionCard title="Exportar Informe" desc="Generar y descargar padrón automotor en formato Excel/CSV." icon="📊" onClick={handleExportar} color="border-slate-400" />
              </div>
            ) : (
              <div className="bg-white p-10 shadow-xl border border-slate-100 rounded-sm animate-in fade-in slide-in-from-top-4 duration-500">
                {subModulo === 'registrar' && <RegistrarVehiculo />}
                {subModulo === 'asignar' && <AsignarOperacion />}
                {subModulo === 'baja' && <BajaUnidades />}
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
    <button onClick={onClick} className={`bg-white p-8 border-b-4 ${color} shadow-md flex flex-col items-start text-left hover:-translate-y-2 transition-all h-72 cursor-pointer group rounded-sm`}>
      <div className="text-4xl mb-8 bg-slate-50 w-14 h-14 flex items-center justify-center shadow-inner group-hover:bg-[#0F172A] group-hover:text-white transition-all rounded-sm">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest mb-3">{title}</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">{desc}</p>
    </button>
  );
}