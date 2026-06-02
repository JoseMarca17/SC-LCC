import React from 'react';
import EmblemFAB from './EmblemFAB';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#060A12] border-t border-[#1E3050] pt-16 pb-8 px-10 md:px-24 font-ui overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute right-[-50px] bottom-[-20px] font-display font-black text-[10rem] text-white/[0.02] select-none pointer-events-none">
        CEO-LCC
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        {/* Identidad */}
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 opacity-80">
              <EmblemFAB />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-white tracking-widest uppercase">SICLCC</span>
              <span className="font-mono text-[9px] text-amarillo-fab tracking-widest font-bold">FUERZA AÉREA BOLIVIANA</span>
            </div>
          </div>
          <p className="text-[#6A88A8] text-xs font-medium leading-relaxed uppercase tracking-wider">
            Sistema Integrado de Control de Lucha Contra el Contrabando. Organismo encargado del monitoreo y transparencia de las operaciones fronterizas.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div className="grid grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-2">// Institución</span>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Normativa</a>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Organigrama</a>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Transparencia</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-2">// Soporte</span>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Contacto</a>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Denuncias</a>
            <a href="#" className="text-[#6A88A8] hover:text-amarillo-fab text-xs uppercase tracking-widest transition-colors">Manual de Usuario</a>
          </div>
        </div>

        {/* Sello de Seguridad */}
        <div className="flex flex-col items-end gap-4">
          <div className="bg-azul-fab text-white px-5 py-2 font-mono text-[10px] font-bold tracking-[0.3em] border border-azul-claro/30 shadow-[0_0_15px_rgba(0,48,135,0.2)]">
            CONFIDENCIAL
          </div>
          <div className="text-right">
             <div className="font-mono text-[9px] text-[#6A88A8] uppercase tracking-widest">Servidor Local: <span className="text-white">ACTIVO</span></div>
             <div className="font-mono text-[9px] text-[#6A88A8] uppercase tracking-widest mt-1">Versión Sistema: <span className="text-white">v2.6.1</span></div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#1E3050] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-[9px] text-[#6A88A8] uppercase tracking-[0.15em]">
          © 2026 FUERZA AÉREA BOLIVIANA · CEO-LCC · ESCUELA MILITAR DE INGENIERÍA
        </div>
        <div className="flex gap-6">
           <span className="font-mono text-[9px] text-[#1E3050] uppercase tracking-widest select-none">Estado Plurinacional de Bolivia</span>
        </div>
      </div>
    </footer>
  );
}