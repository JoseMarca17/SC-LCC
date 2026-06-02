import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Verificar2FA() {
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  const [codigo,  setCodigo]  = useState('');
  const [timer,   setTimer]   = useState(300); // 5 minutos = 300s
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const email = sessionStorage.getItem('pending2FA_email');

  // Si no hay email pendiente redirige al login
  useEffect(() => {
    if (!email) navigate('/login');
    inputRef.current?.focus();
  }, []);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const formatTimer = () => {
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (codigo.length < 6) return;
    setError('');
    setLoading(true);
    try {
      const data = await authService.verifyOtp(email, codigo);
      authService.saveSession(data);
      sessionStorage.removeItem('pending2FA_email');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setCodigo('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Solo permite dígitos
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCodigo(val);
  };

  return (
    <div className="min-h-screen flex font-ui overflow-hidden">

      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex w-[55%] bg-[#060A12] flex-col justify-center items-start p-20 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,209,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,209,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-azul-fab opacity-50" />

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

        <div className="font-mono text-xs tracking-[0.28em] text-azul-fab uppercase mb-5 flex items-center gap-3 z-10 font-bold">
          <span className="w-6 h-[1px] bg-azul-fab" /> SEGURIDAD DE NIVEL 2
        </div>
        <h1 className="font-display font-black text-6xl uppercase text-white leading-none mb-6 z-10 tracking-tighter">
          VERIFICACIÓN <br /> <span className="text-azul-fab block">DE IDENTIDAD</span>
        </h1>
        <p className="font-display font-medium text-sm tracking-wide text-[#6A88A8] uppercase max-w-sm mb-16 leading-relaxed z-10 border-l-2 border-[#1E3050] pl-6">
          Se ha enviado un código de seguridad a su correo institucional. Confirme su identidad para continuar.
        </p>

        {/* Email parcialmente oculto */}
        {email && (
          <div className="z-10 font-mono text-[10px] text-white/40 uppercase tracking-widest">
            Enviado a: {email.replace(/(.{2}).+(@.+)/, '$1•••$2')}
          </div>
        )}
      </div>

      {/* PANEL DERECHO */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center p-10 md:p-20 relative">
        <Link to="/login" className="absolute top-10 right-10 flex items-center gap-3 font-mono text-[10px] font-bold text-[#475569] hover:text-[#060A12] transition-colors group uppercase tracking-widest">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Cancelar
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-12">
            <div className="font-mono text-[9px] tracking-[0.3em] text-[#94A3B8] uppercase mb-3 font-bold">// DOBLE FACTOR DE ACCESO</div>
            <h2 className="font-display font-black text-4xl text-[#060A12] uppercase tracking-tighter italic leading-none">Confirmar Código</h2>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-8">

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-l-red-500 text-red-700 font-mono text-[10px] uppercase tracking-widest font-bold">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] tracking-widest text-[#475569] font-black uppercase">
                Código de 6 dígitos
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={codigo}
                maxLength={6}
                onChange={handleChange}
                placeholder="000000"
                disabled={loading || timer === 0}
                className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] text-[#060A12] font-mono text-4xl p-5 text-center tracking-[0.4em] outline-none focus:border-azul-fab transition-all shadow-inner disabled:opacity-50"
              />

              <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest mt-1">
                <span className={`font-bold ${timer <= 60 ? 'text-red-500' : 'text-[#94A3B8]'}`}>
                  Expira en: <b>{formatTimer()}</b>
                </span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={() => navigate('/login')}
                  className="text-azul-fab font-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Reenviar Código
                </button>
              </div>
            </div>

            {timer === 0 && (
              <div className="p-4 bg-amber-50 border-l-4 border-l-amber-500 text-amber-700 font-mono text-[10px] uppercase tracking-widest font-bold">
                ⏱ Código expirado. Vuelva a iniciar sesión.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || codigo.length < 6 || timer === 0}
              className="w-full font-display font-bold text-sm tracking-[0.3em] uppercase bg-[#060A12] text-white py-5 transition-all hover:bg-azul-fab shadow-xl [clip-path:polygon(12px_0%,100%_0%,calc(100%-12px)_100%,0%_100%)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Confirmar Acceso'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}