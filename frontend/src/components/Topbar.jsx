import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#060A12] border-b border-[#1E3050] shadow-md flex items-center justify-between px-10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="#FFD100" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="20" r="14" stroke="#0057B8" strokeWidth="1" fill="#003087"/>
              <path d="M4 20 Q12 14 20 20 Q12 26 4 20Z" fill="#FFD100"/>
              <path d="M36 20 Q28 14 20 20 Q28 26 36 20Z" fill="#FFD100"/>
              <circle cx="20" cy="20" r="4" fill="#003087" stroke="#FFD100" strokeWidth="1"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-xl tracking-widest text-white uppercase">SICLCC</span>
            <span className="font-mono text-[9px] text-amarillo-fab tracking-widest mt-1 font-bold italic">PORTAL INSTITUCIONAL</span>
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-4 mt-1">
        <Link to="/" className="font-display font-bold text-xs tracking-widest uppercase text-white hover:text-amarillo-fab px-3 py-2 transition-all">Inicio</Link>
        <Link to="/noticias" className="font-display font-bold text-xs tracking-widest uppercase text-white/70 hover:text-amarillo-fab px-3 py-2 transition-all">Noticias</Link>
        <Link to="/contacto" className="font-display font-bold text-xs tracking-widest uppercase text-white/70 hover:text-amarillo-fab px-3 py-2 transition-all">Contacto</Link>
      </nav>

      <div className="flex items-center gap-6">
        
        <button 
          onClick={() => navigate('/login')}
          className="font-display font-bold text-xs tracking-widest uppercase bg-amarillo-fab text-[#060A12] px-6 py-2.5 hover:bg-white transition-all [clip-path:polygon(6px_0%,100%_0%,calc(100%-6px)_100%,0%_100%)] shadow-lg"
        >
          Acceso Personal
        </button>
      </div>
    </header>
  );
}