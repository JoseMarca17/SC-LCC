import React from 'react';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default function Contacto() {
  return (
    <div className="min-h-screen bg-white font-ui">
      <Topbar />
      <div className="pt-32 pb-20 px-10 md:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <div className="border-l-4 border-amarillo-fab pl-6 mb-12">
            <span className="font-mono text-xs text-gray-500 font-black tracking-widest uppercase">Atención al Ciudadano</span>
            <h1 className="font-display font-black text-6xl text-[#060A12] uppercase tracking-tighter">Contáctanos</h1>
          </div>
          
          <p className="text-gray-600 text-lg mb-10 leading-relaxed uppercase font-medium">
            Para consultas institucionales, solicitudes de información pública o coordinación técnica, utilice los canales oficiales.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 border border-gray-100">
              <div className="text-2xl">📍</div>
              <div>
                <div className="font-display font-bold text-[#060A12] uppercase">Dirección Central</div>
                <div className="text-sm text-gray-500">Calle 20 de Octubre, La Paz, Bolivia</div>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-gray-50 border border-gray-100">
              <div className="text-2xl">📞</div>
              <div>
                <div className="font-display font-bold text-[#060A12] uppercase">Línea Gratuita de Denuncias</div>
                <div className="text-sm text-gray-500">800 - 10 - 2000 (Atención 24/7)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#060A12] p-10 shadow-2xl relative border-b-4 border-amarillo-fab">
          <h2 className="font-display font-bold text-2xl text-white uppercase mb-8 tracking-widest italic">Formulario de Consulta</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em]">Nombre Completo / Entidad</label>
              <input type="text" className="w-full bg-[#0D1520] border border-[#1E3050] p-4 text-white font-mono text-xs outline-none focus:border-amarillo-fab transition-all" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em]">Correo Electrónico</label>
              <input type="email" className="w-full bg-[#0D1520] border border-[#1E3050] p-4 text-white font-mono text-xs outline-none focus:border-amarillo-fab transition-all" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em]">Mensaje</label>
              <textarea rows="4" className="w-full bg-[#0D1520] border border-[#1E3050] p-4 text-white font-mono text-xs outline-none focus:border-amarillo-fab transition-all resize-none"></textarea>
            </div>
            <button className="w-full bg-amarillo-fab text-[#060A12] font-display font-bold text-sm tracking-widest uppercase py-4 [clip-path:polygon(10px_0%,100%_0%,calc(100%-10px)_100%,0%_100%)]">Enviar Mensaje</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}