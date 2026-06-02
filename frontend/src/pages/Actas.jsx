import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Actas() {
  const [modalOpen, setModalOpen] = useState(false);

  const dataActas = [
    { id: 'ACT-2026-1847', fecha: '26/03/2026', zona: 'Desaguadero / N-1', tipo: 'Textiles / Ropa', peso: '1.2', valor: '48,200', resp: 'Cap. García R.', estado: 'Cerrada', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { id: 'ACT-2026-1846', fecha: '26/03/2026', zona: 'Charaña / N-2', tipo: 'Electrónica', peso: '0.4', valor: '120,500', resp: 'Tte. Mamani S.', estado: 'En revisión', color: 'text-amarilloFAB border-amarilloFAB/20 bg-amarilloFAB/5' },
    { id: 'ACT-2026-1845', fecha: '26/03/2026', zona: 'Puerto Suárez / E-1', tipo: 'Alimentos procesados', peso: '3.8', valor: '22,800', resp: 'Sgto. Flores P.', estado: 'Cerrada', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { id: 'ACT-2026-1844', fecha: '25/03/2026', zona: 'Bermejo / S-2', tipo: 'Combustibles', peso: '2.1', valor: '84,000', resp: 'Cap. Quispe A.', estado: 'Impugnada', color: 'text-red-400 border-red-500/20 bg-red-500/5' },
  ];

  return (
    <div className="min-h-screen bg-negroTactico text-textoBase font-ui flex">
      <Sidebar currentPath="actas" />

      <main className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Topbar de módulo */}
        <div className="h-14 bg-[#060A12]/95 border-b border-grisLinea flex items-center justify-between px-8 text-xs font-mono text-textoDim">
          <div>SICLCC <span className="text-grisLinea">/</span> MÓDULOS <span className="text-grisLinea">/</span> <span className="text-amarilloFAB uppercase">Actas de Comiso</span></div>
          <div className="font-mono">ESTADO: <span className="text-emerald-400">● MÓDULO OPERATIVO</span></div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* Encabezado con Botón de Registro */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="font-mono text-[9px] tracking-[0.28em] text-amarilloFAB uppercase mb-1">// MÓDULO 01 · REGISTRO PENAL</div>
              <h1 className="font-display font-black text-4xl text-white uppercase tracking-tight">Actas de Comiso</h1>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="font-display font-bold text-xs tracking-widest uppercase bg-azulMedio text-white border border-azulClaro px-6 py-3 transition-colors hover:bg-azulClaro [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)] flex items-center gap-2"
            >
              ➕ Nueva Acta
            </button>
          </div>

          {/* BARRA DE FILTRADO TÁCTICO */}
          <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-xs">
            <input type="text" placeholder="Buscar por N° acta, zona, mercadería..." className="bg-grisOscuro border border-grisLinea text-textoBase p-2.5 outline-none focus:border-azulClaro min-w-[240px]" />
            <select className="bg-grisOscuro border border-grisLinea text-textoBase p-2.5 outline-none cursor-pointer">
              <option value="">Todos los estados</option>
              <option>Cerrada</option>
              <option>En revisión</option>
              <option>Impugnada</option>
            </select>
            <button className="border border-grisLinea px-4 py-2.5 text-textoDim hover:border-azulClaro hover:text-azulClaro transition-colors uppercase text-[11px] font-display font-semibold tracking-wider">Filtrar</button>
            <div className="ml-auto text-textoDim text-[10px] uppercase">Mostrando <span className="text-white">1–4</span> de <span className="text-white">1,847</span> registros</div>
          </div>

          {/* TABLA PRINCIPAL DE DATOS */}
          <div className="bg-grisOscuro border border-grisLinea overflow-hidden">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-[#0D1520]/60 text-textoDim text-[9px] tracking-wider uppercase border-b border-grisLinea">
                  <th className="p-4">N° Acta</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Zona / Punto</th>
                  <th className="p-4">Tipo Mercadería</th>
                  <th className="p-4 text-right">Peso (T)</th>
                  <th className="p-4 text-right">Valor (Bs)</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grisLinea/30">
                {dataActas.map((row, idx) => (
                  <tr key={idx} className="hover:bg-azulClaro/[0.01] transition-colors">
                    <td className="p-4 text-white font-medium">{row.id}</td>
                    <td className="p-4 text-textoDim">{row.fecha}</td>
                    <td className="p-4">{row.zona}</td>
                    <td className="p-4 text-textoBase">{row.tipo}</td>
                    <td className="p-4 text-right">{row.peso}</td>
                    <td className="p-4 text-right font-medium text-white">{row.valor}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-[9px] px-2.5 py-0.5 border uppercase ${row.color}`}>
                        {row.estado}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="border border-grisLinea px-2.5 py-1 text-[9px] uppercase hover:border-azulClaro hover:text-azulClaro transition-colors">Ver</button>
                        <button className="border border-grisLinea px-2.5 py-1 text-[9px] uppercase hover:border-red-500 hover:text-red-400 transition-colors">Anular</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL INYECTADO: REGISTRO DE NUEVA ACTA */}
      {modalOpen && (
        <div className="fixed inset-0 bg-negroTactico/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-ui">
          <div className="bg-grisOscuro border border-grisLinea w-full max-w-2xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-amarilloFAB animate-fadeUp">
            <div className="p-6 border-b border-grisLinea flex justify-between items-center">
              <div>
                <div className="font-mono text-[9px] tracking-widest text-amarilloFAB uppercase mb-0.5">// NUEVO REGISTRO DIGITAL</div>
                <h3 className="font-display font-black text-2xl text-white uppercase">Nueva Acta de Comiso</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="border border-grisLinea text-textoDim px-3 py-1 text-sm hover:border-red-500 hover:text-red-400 transition-colors">✕</button>
            </div>

            {/* Formulario Estructurado */}
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-textoDim uppercase">// N° Acta (Autogenerado)</label>
                <input type="text" value="ACT-2026-1848" readOnly className="bg-grisMedio border border-grisLinea p-3 text-textoDim outline-none opacity-50 cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-textoDim uppercase">// Fecha Operativo</label>
                <input type="date" className="bg-grisMedio border border-grisLinea p-3 text-white outline-none focus:border-azulClaro" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[9px] text-textoDim uppercase">// Grado y Nombre del Responsable</label>
                <input type="text" placeholder="Ej. CAP. LINAREZ TORRES JUAN" className="bg-grisMedio border border-grisLinea p-3 text-white outline-none focus:border-azulClaro uppercase" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[9px] text-textoDim uppercase">// Descripción Detallada del Decomiso</label>
                <textarea rows="3" placeholder="Detalle de las circunstancias, cantidad de bultos, filiación de sospechosos..." className="bg-grisMedio border border-grisLinea p-3 text-white outline-none focus:border-azulClaro resize-none" />
              </div>

              <div className="md:col-span-2 border-t border-grisLinea/30 pt-4 flex justify-end gap-3 font-display">
                <button type="button" onClick={() => setModalOpen(false)} className="border border-grisLinea px-6 py-2.5 text-xs text-textoDim uppercase tracking-wider hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="bg-azulMedio border border-azulClaro text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-azulClaro transition-colors [clip-path:polygon(6px_0%,100%_0%,calc(100%-6px)_100%,0%_100%)]">Registrar Acta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}