import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import RegistrarUsuario from './RegistrarUsuario';
import ConsultarUsuarios from './ConsultarUsuarios';
import AuditoriaBitacora from './AuditoriaBitacora';
import ControlSesiones from './ControlSesiones';

export default function UsuariosHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub');

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-ui text-slate-800">
      <Sidebar currentPath="seguridad" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Usamos flex flex-col para que el contenido ocupe el alto disponible */}
      <main className={`flex-1 transition-all duration-500 ease-in-out flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* BANNER DINÁMICO (Sin cambios en el diseño, solo ajuste de altura si es necesario) */}
        <header className="bg-[#060A12] pt-12 pb-16 px-10 relative overflow-hidden shrink-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[10%] w-64 h-64 bg-amarillo-fab/5 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-amarillo-fab" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-amarillo-fab font-black uppercase">
                  Área de Seguridad Perimetral
                </span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Usuarios</span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-xl text-sm font-medium leading-relaxed border-l-2 border-[#003087] pl-6 uppercase tracking-widest opacity-80">
                Administración centralizada de identidades, privilegios de mando y auditoría forense del Estado Plurinacional.
              </p>
            </div>

            {subModulo !== 'hub' && (
              <button 
                onClick={() => setSubModulo('hub')}
                className="group flex items-center gap-3 bg-white text-[#060A12] font-black text-[10px] px-8 py-4 uppercase tracking-[0.2em] hover:bg-amarillo-fab transition-all shadow-2xl [clip-path:polygon(10px_0%,100%_0%,calc(100%-10px)_100%,0%_100%)] cursor-pointer"
              >
                <span>← Volver al Centro de Mando</span>
              </button>
            )}
          </div>
        </header>

        {/* HUB DE ACCIONES - Ajustado para que baje y se centre */}
        <div className="flex-1 px-10 py-12 flex flex-col justify-start relative z-20">
          {subModulo === 'hub' ? (
            /* Agregamos un contenedor centrado y con margen superior para despegarlo del banner */
            <div className="mt-8 max-w-screen-xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <ActionCard 
                title="Alta de Personal" 
                desc="Registro de nuevos efectivos y configuración de credenciales."
                icon="👤+"
                onClick={() => setSubModulo('registrar')}
                accent="border-blue-500"
              />

              <ActionCard 
                title="Padrón de Cuentas" 
                desc="Búsqueda, edición y control de estados operativos."
                icon="🔍"
                onClick={() => setSubModulo('consultar')}
                accent="border-slate-400"
              />

              <ActionCard 
                title="Logs de Auditoría" 
                desc="Trazabilidad total de movimientos en la base de datos."
                icon="📜"
                onClick={() => setSubModulo('bitacora')}
                accent="border-amber-500"
              />

              <ActionCard 
                title="Monitor de Red" 
                desc="Gestión de sesiones activas y bloqueo de amenazas IP."
                icon="🛡️"
                onClick={() => setSubModulo('sesiones')}
                accent="border-red-500"
              />

            </div>
          ) : (
            /* Espacio para los componentes hijos también con margen superior */
            <div className="mt-4 max-w-screen-xl mx-auto w-full">
              {subModulo === 'registrar' && <RegistrarUsuario />}
              {subModulo === 'consultar' && <ConsultarUsuarios />}
              {subModulo === 'bitacora' && <AuditoriaBitacora />}
              {subModulo === 'sesiones' && <ControlSesiones />}
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
      className={`relative bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/30 flex flex-col items-start text-left group transition-all duration-500 hover:-translate-y-2 border-t-4 ${accent} overflow-hidden h-72 cursor-pointer`}
    >
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 rotate-12 group-hover:rotate-0">
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
          Iniciar Proceso
        </span>
      </div>
    </button>
  );
}