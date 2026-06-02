import React from 'react';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default function Noticias() {
  const articulos = [
    { id: 1, cat: 'OPERATIVOS', fecha: '28 MAY 2026', titulo: 'Decomiso masivo en la zona de Desaguadero: Bs. 1.2M incautados', desc: 'Personal del CEO-LCC interceptó un convoy con mercadería de contrabando durante la madrugada.' },
    { id: 2, cat: 'INSTITUCIONAL', fecha: '24 MAY 2026', titulo: 'Nueva resolución ministerial amplía controles en pasos fronterizos', desc: 'Se han establecido nuevos protocolos de seguridad para el tránsito de carga pesada.' },
    { id: 3, cat: 'TECNOLOGÍA', fecha: '20 MAY 2026', titulo: 'Actualización del sistema SICLCC para monitoreo satelital en tiempo real', desc: 'La versión 2.6 introduce mejoras en la visualización geoespacial de unidades móviles.' }
  ];

  return (
    <div className="min-h-screen bg-white font-ui">
      <Topbar />
      <div className="pt-32 pb-20 px-10 md:px-24 max-w-7xl mx-auto">
        <div className="border-l-4 border-azul-fab pl-6 mb-16">
          <span className="font-mono text-xs text-azul-fab font-black tracking-widest uppercase">Sala de Prensa</span>
          <h1 className="font-display font-black text-6xl text-[#060A12] uppercase tracking-tighter">Comunicados Oficiales</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articulos.map(art => (
            <div key={art.id} className="group cursor-pointer">
              <div className="bg-[#060A12] aspect-video mb-6 border border-[#1E3050] relative overflow-hidden">
                <div className="absolute inset-0 bg-azul-fab/10 group-hover:bg-transparent transition-all" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-[10px] font-mono font-black text-azul-fab tracking-widest">{art.cat}</span>
                <span className="text-[10px] font-mono text-gray-400">{art.fecha}</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#060A12] uppercase leading-none group-hover:text-azul-fab transition-colors mb-4">{art.titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{art.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}