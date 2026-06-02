import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Credenciales de seguridad incompletas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      sessionStorage.setItem('pending2FA_email', email);
      navigate('/verificar-2fa');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-ui overflow-hidden">

      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex w-[55%] bg-[#060A12] flex-col justify-center items-start p-20 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,209,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,209,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-amarillo-fab opacity-50" />

        <div className="flex items-center gap-4 mb-16 z-10">
          <div className="w-12 h-12">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="#FFD100" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="20" r="14" stroke="#0057B8" strokeWidth="1" fill="#003087"/>
              <path d="M4 20 Q12 14 20 20 Q12 26 4 20Z" fill="#FFD100"/>
              <path d="M36 20 Q28 14 20 20 Q28 26 36 20Z" fill="#FFD100"/>
              <circle cx="20" cy="20" r="4" fill="#003087" stroke="#FFD100" strokeWidth="1"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-2xl tracking-wider text-white uppercase">SICLCC</span>
            <span className="font-mono text-[9px] text-amarillo-fab tracking-widest font-bold italic">SISTEMA INTEGRADO DE CONTROL</span>
          </div>
        </div>

        <div className="font-mono text-xs tracking-[0.28em] text-amarillo-fab uppercase mb-5 flex items-center gap-3 z-10 font-bold">
          <span className="w-6 h-[1px] bg-amarillo-fab" /> ACCESO RESTRINGIDO
        </div>
        <h1 className="font-display font-black text-6xl uppercase text-white leading-none mb-6 z-10 tracking-tighter">
          PORTAL DE <br /> <span className="text-amarillo-fab block">AUTENTICACIÓN</span>
        </h1>
        <p className="font-display font-medium text-sm tracking-wide text-[#6A88A8] uppercase max-w-sm mb-16 leading-relaxed z-10 border-l-2 border-[#1E3050] pl-6">
          Área de acceso exclusivo para personal del CEO-LCC en cumplimiento de protocolos de seguridad digital.
        </p>
        <div className="mt-auto font-mono text-[9px] text-white/30 uppercase tracking-widest z-10">
          ESTADO PLURINACIONAL DE BOLIVIA // 2026
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center p-10 md:p-20 relative">
        <Link to="/" className="absolute top-10 right-10 flex items-center gap-3 font-mono text-[10px] font-bold text-[#475569] hover:text-[#060A12] transition-colors group uppercase tracking-widest">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Portal
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[9px] tracking-[0.3em] text-[#94A3B8] uppercase mb-3 font-bold">// IDENTIDAD DIGITAL v2.6</div>
            <h2 className="font-display font-black text-4xl text-[#060A12] uppercase tracking-tighter italic leading-none">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-l-red-500 text-red-700 font-mono text-[10px] uppercase tracking-widest font-bold">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-widest text-[#475569] font-black uppercase">
                Correo Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gob.bo"
                disabled={loading}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#060A12] font-mono text-xs p-4 outline-none focus:border-azul-fab focus:bg-white transition-all shadow-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-widest text-[#475569] font-black uppercase">
                Clave de Acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#060A12] font-mono text-xs p-4 outline-none focus:border-azul-fab focus:bg-white transition-all shadow-sm disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-display font-bold text-sm tracking-[0.3em] uppercase bg-[#060A12] text-white py-5 mt-4 transition-all hover:bg-azul-fab shadow-xl [clip-path:polygon(12px_0%,100%_0%,calc(100%-12px)_100%,0%_100%)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}