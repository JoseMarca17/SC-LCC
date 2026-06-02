import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const NavIcon = ({ d }) => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  usuario: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Escudo
  incautacion: "M11 5L6 9v11h12V9l-5-4z M12 12v4 M9 14h6", // Martillo/Mazo
  reportes: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", // Documento
  transporte: "M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M5 17h-2v-11h11v11", // Camión
  material: "M21 8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8 M1 10h22", // Caja
  civiles: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8", // Personas
  juridico: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M8 11h8", // Balanza/Justicia
  operaciones: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", // Estrella/Operación
  personal: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8", // Militar
  medios: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12", // Radio/Comunicación
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"
};

export default function Sidebar({ currentPath, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const user = authService.getUser();

  // Mapeo exacto según tablas de Procesos
  const modulos = [
    { id: "dashboard", label: "Dashboard", icon: ICONS.dashboard, path: "/dashboard" },
    { id: "seguridad", label: "1. Gestión de Usuario", icon: ICONS.usuario, path: "/usuarios", roles: [1] },
    { id: "incautacion", label: "2. Registro de Incautación", icon: ICONS.incautacion, path: "/incautacion" },
    { id: "reportes", label: "3. Informes y Reportes", icon: ICONS.reportes, path: "/reportes" },
    { id: "transporte", label: "4. Transporte", icon: ICONS.transporte, path: "/transporte" },
    { id: "material", label: "5. Material Incautado", icon: ICONS.material, path: "/material" },
    { id: "civiles", label: "6. Registro Civiles", icon: ICONS.civiles, path: "/civiles" },
    { id: "juridico", label: "7. Novedades e Incidentes Jurídicos", icon: ICONS.juridico, path: "/novedades" },
    { id: "operaciones", label: "8. Registro de Operaciones", icon: ICONS.operaciones, path: "/operaciones" },
    { id: "personal", label: "9. Registro de Personal", icon: ICONS.personal, path: "/personal" },
    { id: "medios", label: "10. Registro de Medios de Transporte", icon: ICONS.medios, path: "/medios-transporte" }
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col shadow-2xl ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* HEADER CEO-LCC */}
      <div className="h-24 bg-[#060A12] flex flex-col items-center justify-center relative shrink-0 border-b border-white/5">
        <div className="w-10 h-10 mb-1">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#FFD100" strokeWidth="1.5" fill="none"/>
            <circle cx="20" cy="20" r="14" stroke="#0057B8" strokeWidth="1" fill="#003087"/>
            <circle cx="20" cy="20" r="4" fill="#060A12" stroke="#FFD100" strokeWidth="1"/>
          </svg>
        </div>
        {!isCollapsed && (
          <div className="text-center overflow-hidden animate-in fade-in duration-500">
            <span className="font-display font-black text-xl text-white tracking-widest leading-none uppercase italic">SICLCC</span>
            <p className="text-[8px] font-bold text-amarillo-fab uppercase tracking-[0.2em] mt-1">Mando Central</p>
          </div>
        )}
      </div>

      {/* BOTÓN REPLEGAR */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50/50 border-b border-slate-100 text-slate-400 hover:text-[#003087] transition-all cursor-pointer group"
      >
        <NavIcon d={isCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"} />
        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Replegar Panel</span>}
      </button>

      {/* NAVEGACIÓN BASADA EN PROCESOS */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {modulos.map((mod) => (
          (!mod.roles || mod.roles.includes(user?.rolId)) && (
            <button
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className={`w-full flex items-center px-6 py-3.5 transition-all duration-200 border-l-4 ${
                currentPath === mod.id 
                ? 'bg-blue-50/50 border-[#003087] text-[#003087] font-black' 
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <NavIcon d={mod.icon} />
              {!isCollapsed && <span className="ml-4 text-[9px] font-bold uppercase tracking-widest text-left leading-tight">{mod.label}</span>}
            </button>
          )
        ))}
      </nav>

      {/* FINALIZAR SESIÓN */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button onClick={() => { authService.logout(); navigate('/login'); }} className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-sm font-black text-[9px] uppercase tracking-widest">
          <NavIcon d={ICONS.logout} />
          {!isCollapsed && <span className="ml-4">Finalizar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}