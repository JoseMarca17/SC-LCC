import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import TickerStatus from '../components/TickerStatus';
import Footer from '../components/Footer';

export default function Inicio() {
  const navigate = useNavigate();

  // Implementación de Intersection Observer para animaciones (Contenido intacto)
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden selection:bg-amarillo-fab selection:text-negro-comando font-ui">
      {/* Grid Background sutil adaptado a Light Mode */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,80,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,80,184,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0" />
      
      <Topbar />

      {/* ── HERO SECTION (BANNER PRO CON COLOR ENTERO INSTITUCIONAL) ── */}
      <section className="relative h-[85vh] flex flex-col justify-center px-10 md:px-24 pt-20 bg-[#060A12] overflow-hidden border-b border-[#1E3050] shadow-2xl">
        
        {/* Mira telescópica estructural original en gris sutil sobre fondo sólido */}
        <svg className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-5 pointer-events-none z-0" viewBox="0 0 400 400" fill="none">
          <polygon points="200,10 380,110 380,290 200,390 20,290 20,110" stroke="#64748B" strokeWidth="1" />
          <polygon points="200,90 320,155 320,245 200,310 80,245 80,155" stroke="#64748B" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="120" stroke="#64748B" strokeWidth="0.3" strokeDasharray="2 8" />
          <line x1="200" y1="140" x2="200" y2="260" stroke="#64748B" strokeWidth="0.5" opacity="0.5" />
          <line x1="140" y1="200" x2="260" y2="200" stroke="#64748B" strokeWidth="0.5" opacity="0.5" />
        </svg>

        {/* Línea lateral de acento militar */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amarillo-fab opacity-80 z-10" />

        <div className="relative z-10 max-w-5xl animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
          <div className="font-mono text-[10px] tracking-[0.4em] text-amarillo-fab font-bold uppercase mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-amarillo-fab" />
            Comando Estratégico Operacional · CEO-LCC
          </div>

          <h1 className="font-display font-black text-6xl md:text-[5.5rem] text-white uppercase tracking-tighter leading-[0.9] mb-8">
            PORTAL INSTITUCIONAL DE LUCHA <br /> 
            <span className="text-amarillo-fab block">CONTRA EL CONTRABANDO</span>
          </h1>

          <p className="font-display font-medium text-lg md:text-xl text-[#6A88A8] max-w-2xl uppercase tracking-widest leading-relaxed mb-12 border-l-2 border-amarillo-fab pl-8 opacity-90">
            Salvaguardando la soberanía económica y la seguridad fronteriza a través de la modernización tecnológica del Estado Plurinacional de Bolivia.
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-[#060A12] font-display font-bold text-xs tracking-[0.2em] uppercase px-12 py-5 hover:bg-amarillo-fab transition-all shadow-xl [clip-path:polygon(10px_0%,100%_0%,calc(100%-10px)_100%,0%_100%)]">
              Comunicados Oficiales
            </button>
            <button className="bg-white/5 border border-amarillo-fab/30 text-amarillo-fab font-display font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:bg-white/10 transition-all">
              Transparencia Institucional
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 p-10 opacity-[0.02] pointer-events-none select-none">
          <span className="font-display font-black text-[22rem] leading-none text-white tracking-tighter">LCC</span>
        </div>
      </section>

      {/* ── TICKER (VELOCIDAD SUAVE Y CONTRASTES MEJORADOS) ── */}
      <div className="relative z-20 border-b border-[#1E3050] bg-[#0D1520] overflow-hidden h-12 flex items-center shadow-lg">
        <div className="flex-shrink-0 bg-amarillo-fab px-6 h-full flex items-center font-mono text-[10px] font-bold text-[#060A12] tracking-widest z-10 border-r border-[#1E3050]">
          // ESTADO OPERATIVO
        </div>
        <div className="flex whitespace-nowrap animate-ticker-smooth">
          {[1, 2].map((loop) => (
            <div key={loop} className="flex items-center">
              {[
                { l: 'SISTEMA ACTIVO', v: '■', c: 'text-emerald-400' },
                { l: 'OPERATIVOS HOY', v: '12' },
                { l: 'VEHÍCULOS INCAUTADOS', v: '47' },
                { l: 'ACTAS PENDIENTES', v: '3', c: 'text-red-400' },
                { l: 'PERSONAL DESPLEGADO', v: '128' },
                { l: 'ZONA NORTE', v: 'ACTIVA' },
                { l: 'ZONA SUR', v: 'ACTIVA' }
              ].map((item, idx) => (
                <span key={idx} className="font-mono font-bold text-[10px] tracking-[0.15em] text-[#6A88A8] px-10">
                  {item.l}: <span className={item.c || 'text-amarillo-fab'}>{item.v}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-smooth {
          animation: ticker-smooth 60s linear infinite;
        }
      `}} />

      {/* ── NOTICIAS ── */}
      <section id="noticias" className="relative z-10 bg-white py-24 px-10 md:px-24">
        <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-8 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
          <div>
            <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-azul-fab uppercase mb-3">// Sala de Prensa Oficial</div>
            <h2 className="font-display font-black text-5xl text-[#0F172A] uppercase tracking-tight leading-none">Últimas Noticias</h2>
          </div>
          <button className="font-mono text-[11px] font-bold text-azul-fab border-b-2 border-azul-fab pb-1 uppercase hover:text-amarillo-dim transition-all">Ver Historial →</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#0F172A]">
          <div className="lg:col-span-2 group cursor-pointer animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100">
            <div className="bg-gray-50 aspect-video mb-8 overflow-hidden relative border border-gray-200">
              <div className="absolute inset-0 bg-[#060A12]/10 group-hover:bg-transparent transition-all duration-500" />
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-amarillo-fab text-[#060A12] font-mono text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest shadow-lg">Destacado</span>
              </div>
            </div>
            <h3 className="font-display font-bold text-4xl uppercase leading-none group-hover:text-azul-fab transition-colors mb-4">
              Operativo Frontera Norte: Decomiso masivo de mercadería ilegal valorada en Bs. 2.8M
            </h3>
            <p className="text-gray-500 font-medium text-lg leading-relaxed line-clamp-2">
              Efectivos del CEO-LCC ejecutaron un golpe estratégico al contrabando en la zona fronteriza con apoyo de unidades aerotransportadas.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { d: '24 MAR', t: 'Fortalecimiento de la vigilancia electrónica en pasos fronterizos del Sur.' },
              { d: '18 MAR', t: 'Nuevos protocolos de interoperabilidad con la Aduana Nacional de Bolivia.' },
              { d: '12 MAR', t: 'Capacitación intensiva en el SICLCC para oficiales destacados en oriente.' }
            ].map((news, idx) => (
              <div key={idx} className="group cursor-pointer border-b border-gray-100 pb-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300">
                <span className="font-mono text-[11px] text-azul-fab font-black tracking-widest">{news.d} 2026</span>
                <h4 className="font-display font-bold text-xl text-[#0F172A] uppercase mt-2 group-hover:text-azul-fab transition-colors leading-tight">{news.t}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESTADÍSTICAS ── */}
      <section className="relative z-20 w-full bg-[#060A12] py-24 px-10 md:px-24 border-y border-[#1E3050]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/3 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
            <span className="font-mono text-amarillo-fab text-xs tracking-[0.3em] font-bold uppercase mb-4 block">// Datos Abiertos</span>
            <h2 className="font-display font-black text-5xl text-white uppercase leading-[0.9]">Impacto <br /> <span className="text-amarillo-fab italic font-light">Operacional</span></h2>
          </div>
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '312', l: 'Operativos' },
              { n: '1.8K', l: 'Toneladas' },
              { n: '463', l: 'Vehículos' },
              { n: '9+', l: 'Zonas' }
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left border-l border-white/10 pl-6 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
                <div className="font-display font-black text-5xl text-white tracking-tighter">{s.n}</div>
                <div className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPA Y COBERTURA ── */}
      <section id="mapa" className="relative z-10 px-10 md:px-24 py-24 bg-white grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-20 items-center border-b border-gray-100">
        <div className="relative h-[500px] bg-[#F8FAFC] border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,48,135,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,48,135,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <svg className="relative z-10 opacity-80 scale-125" viewBox="0 0 300 320" width="300" fill="none">
            <path d="M85,20 L175,15 L230,45 L255,80 L245,130 L260,160 L250,200 L220,240 L190,280 L155,305 L120,295 L85,260 L60,220 L40,175 L35,130 L50,85 L75,50 Z" stroke="#003087" strokeWidth="1.5" fill="rgba(0,48,135,0.02)" strokeDasharray="4 2"/>
            <text x="75" y="120" fill="#94A3B8" fontSize="8" fontFamily="'Share Tech Mono'" fontWeight="bold">LA PAZ</text>
            <text x="185" y="175" fill="#94A3B8" fontSize="7" fontFamily="'Share Tech Mono'" fontWeight="bold">SANTA CRUZ</text>
          </svg>
          <div className="absolute z-20 left-[35%] top-[34%]">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-azul-fab animate-ping opacity-40"></div>
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-azul-fab shadow-[0_0_10px_#003087]"></div>
          </div>
          <div className="absolute bottom-6 left-6 font-mono text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            COBERTURA <span className="text-azul-fab">NACIONAL ESTRATÉGICA</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
          <div>
            <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-azul-fab uppercase mb-3">// Presencia Territorial</div>
            <h2 className="font-display font-black text-5xl text-[#0F172A] uppercase leading-none italic">Vigilancia de Fronteras</h2>
          </div>
          <p className="text-lg font-medium text-gray-500 leading-relaxed">
            Centralizamos el monitoreo táctico en los puntos críticos de ingreso y salida del territorio nacional, asegurando una respuesta coordinada 24/7.
          </p>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex items-center gap-4 bg-gray-50 border-r-4 border-r-azul-fab p-5 shadow-sm group hover:bg-white transition-all">
               <span className="font-display font-black text-3xl text-azul-fab/20 group-hover:text-azul-fab transition-colors">01</span>
               <span className="font-display font-bold text-sm uppercase text-[#0F172A] tracking-wider">Unidades de Frontera Norte (Desaguadero)</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}