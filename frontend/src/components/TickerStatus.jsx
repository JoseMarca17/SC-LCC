import React, { useEffect, useState } from 'react';

export default function TickerStatus() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-BO', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('es-BO', { hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: 'SISTEMA ACTIVO', val: '■', color: 'text-emerald-400' },
    { label: 'OPERATIVOS HOY', val: '12' },
    { label: 'VEHÍCULOS INCAUTADOS MES', val: '47' },
    { label: 'ACTAS PENDIENTES', val: '3', color: 'text-red-400' },
    { label: 'PERSONAL DESPLEGADO', val: '128 EFECTIVOS' },
    { label: 'ZONA NORTE', val: 'ACTIVA' },
    { label: 'ÚLTIMA SINCRONIZACIÓN', val: time }
  ];

  return (
    <div className="relative z-20 border-t border-b border-grisLinea bg-grisOscuro/95 overflow-hidden h-10 flex items-center">
      <div className="flex-shrink-0 bg-amarilloFAB px-4 h-full flex items-center font-mono text-[9px] font-bold text-negroTactico tracking-widest z-10">
        // ESTADO OPERATIVO
      </div>
      
      <div className="flex whitespace-nowrap animate-ticker group">
        {[1, 2].map((loop) => (
          <div key={loop} className="flex items-center">
            {items.map((item, idx) => (
              <span key={idx} className="font-mono text-[10px] tracking-wider text-textoDim px-8">
                {item.label}: <span className={item.color || 'text-amarilloFAB'}>{item.val}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}} />
    </div>
  );
}