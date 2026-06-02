import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { authService } from '../../services/authService';

export default function MediosTransporteHub() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subModulo, setSubModulo] = useState('hub'); // hub, evaluacion, despliegue, cierre
  const [flota, setFlota] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(false);
  
  // Estados para formularios dinámicos de simulación de fases
  const [idOperativoSeleccionado, setIdOperativoSeleccionado] = useState('');
  const [kmForm, setKmForm] = useState({});

  const token = authService.getToken();

  const cargarFlotaLogistica = async () => {
    try {
      setLoading(true);
      setErrorApi(false);
      const res = await fetch('http://localhost:5183/api/MediosTransporte/flota', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Error de red");
      const data = await res.json();
      setFlota(data);
    } catch (error) {
      console.error("Fallo al recuperar parque automotor:", error);
      setErrorApi(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFlotaLogistica();
  }, []);

  const ejecutarEvaluacion = async (idVehiculo, esApto, kilometraje) => {
    try {
      const res = await fetch('http://localhost:5183/api/MediosTransporte/evaluar-ficha', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idVehiculo: idVehiculo,
          esApto: esApto,
          kilometrajeActual: parseInt(kilometraje)
        })
      });
      if (res.ok) cargarFlotaLogistica();
    } catch (error) {
      console.error(error);
    }
  };

  const ejecutarDespliegue = async (idVehiculo) => {
    if (!idOperativoSeleccionado) {
      alert("DEBE ESPECIFICAR UN CÓDIGO DE OPERATIVO MILITAR VÁLIDO.");
      return;
    }
    try {
      const res = await fetch('http://localhost:5183/api/MediosTransporte/asignar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idVehiculo: idVehiculo,
          idOperativo: parseInt(idOperativoSeleccionado)
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Fallo en la asignación");
        return;
      }
      cargarFlotaLogistica();
    } catch (error) {
      console.error(error);
    }
  };

  const ejecutarCierreParte = async (idVehiculo, requiereMantenimiento) => {
    const kmFinal = kmForm[idVehiculo];
    if (!kmFinal) {
      alert("REQUIERE REGISTRAR EL KILOMETRAJE FINAL DE LLEGADA.");
      return;
    }
    try {
      const res = await fetch('http://localhost:5183/api/MediosTransporte/cerrar-parte', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idVehiculo: idVehiculo,
          kilometrajeFinal: parseInt(kmFinal),
          requiereMantenimiento: requiereMantenimiento
        })
      });
      if (res.ok) {
        cargarFlotaLogistica();
      } else {
        alert("Fallo al cerrar el parte operativo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-ui text-slate-800">
      <Sidebar currentPath="medios" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className={`flex-1 transition-all duration-500 ease-in-out flex flex-col ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* BANNER INSTITUCIONAL LOGÍSTICO */}
        <header className="bg-[#060A12] pt-12 pb-16 px-10 relative overflow-hidden shrink-0 border-b border-[#1E3050]">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-amber-500" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-amber-500 font-black uppercase">
                  Módulo 10 // Control de Parque Automotor
                </span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Medios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Transporte</span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-2xl text-sm font-medium leading-relaxed border-l-2 border-[#003087] pl-6 uppercase tracking-widest opacity-80">
                Planificación estratégica, Ficha vehicular de aptitud y control de misiones del Comando de Control.
              </p>
            </div>

            {subModulo !== 'hub' && (
              <button 
                onClick={() => setSubModulo('hub')}
                className="group flex items-center gap-3 bg-white text-[#060A12] font-black text-[10px] px-8 py-4 uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all shadow-2xl [clip-path:polygon(10px_0%,100%_0%,calc(100%-10px)_100%,0%_100%)] cursor-pointer"
              >
                <span>← Volver a Logística General</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTENEDOR DE SUB-MÓDULOS */}
        <div className="flex-1 px-10 py-12 flex flex-col justify-start relative z-20">
          
          {errorApi && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 font-mono text-xs uppercase">
              ⚠️ ERR_CONNECTION: El Mando Central no responde o el token JWT ha expirado.
            </div>
          )}

          {subModulo === 'hub' ? (
            <div className="mt-8 max-w-screen-xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <ActionCard 
                title="1 y 2. Ficha y Evaluación" 
                desc="Inspección vehicular y estado operacional: Control de documentación legal (SOAT, Revisión Técnica) y niveles de combustible."
                icon="📋"
                onClick={() => setSubModulo('evaluacion')}
                accent="border-blue-500"
              />

              <ActionCard 
                title="3. Control de Despliegue" 
                desc="Planificación previa y asignación táctica de material rodante apto a rutas, tramos y asignación estricta de roles de tripulación."
                icon="🚛"
                onClick={() => setSubModulo('despliegue')}
                accent="border-amber-500"
              />

              <ActionCard 
                title="4. Cierre y Partes" 
                desc="Finalización del registro del operativo. Recepción de unidades físicas, control de kilometraje final y derivación a mantenimiento."
                icon="🔒"
                onClick={() => setSubModulo('cierre')}
                accent="border-red-500"
              />

            </div>
          ) : (
            <div className="mt-4 max-w-screen-xl mx-auto w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 animate-in fade-in duration-300">
              
              {/* VISTA 1: FICHA DE REGISTRO VEHICULAR Y EVALUACIÓN */}
              {subModulo === 'evaluacion' && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-black text-[#060A12] uppercase tracking-tight">Ficha Técnica e Inspección de Aptitud</h2>
                    <p className="text-xs text-slate-500 font-mono">// Rol Evaluador: Jefe de Operaciones / Logística</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flota.filter(v => v.idEstado === 1 || v.idEstado === 3).map(v => (
                      <div key={v.id} className="border border-slate-200 p-6 rounded shadow-sm space-y-4 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">PLACA: {v.placa}</span>
                            <h3 className="text-base font-black text-slate-800 uppercase mt-2">{v.marca} {v.modelo}</h3>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-1 tracking-widest ${v.idEstado === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {v.idEstado === 1 ? 'Disponible' : 'En Reserva'}
                          </span>
                        </div>

                        {/* Campos obligatorios del Caso de Uso */}
                        <div className="grid grid-cols-3 gap-2 bg-white p-3 border text-[10px] font-mono text-slate-600">
                          <div><strong>SOAT:</strong> <span className="text-emerald-600">VIGENTE</span></div>
                          <div><strong>REV. TÉCNICA:</strong> <span className="text-emerald-600">APROBADO</span></div>
                          <div><strong>COMBUSTIBLE:</strong> 100%</div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Kilometraje de Control</label>
                            <input 
                              type="number" 
                              id={`km-eval-${v.id}`}
                              defaultValue={v.kilometraje} 
                              className="border p-2 text-xs font-mono w-full bg-white" 
                            />
                          </div>
                          <div className="flex gap-1 pt-4">
                            <button 
                              onClick={() => ejecutarEvaluacion(v.id, false, document.getElementById(`km-eval-${v.id}`).value)} 
                              className="px-3 py-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-sm hover:bg-red-700"
                            >
                              No Apto (Reserva)
                            </button>
                            <button 
                              onClick={() => ejecutarEvaluacion(v.id, true, document.getElementById(`km-eval-${v.id}`).value)} 
                              className="px-3 py-2 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider rounded-sm hover:bg-emerald-700"
                            >
                              Aprobar Vehículo
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VISTA 2: PLANIFICACIÓN PREVIA Y DESPLIEGUE */}
              {subModulo === 'despliegue' && (
                <div className="space-y-6">
                  <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-black text-[#060A12] uppercase tracking-tight">Planificación y Asignación de Rutas</h2>
                      <p className="text-xs text-slate-500 font-mono">// Requisito: Solo material rodante con Ficha Favorable (Apto)</p>
                    </div>
                    <div className="flex flex-col gap-1 w-64 bg-slate-50 p-2 border">
                      <label className="text-[9px] font-black text-slate-500 uppercase">ID Operativo Militar Activo</label>
                      <input 
                        type="number" 
                        placeholder="Ej: 1" 
                        value={idOperativoSeleccionado}
                        onChange={e => setIdOperativoSeleccionado(e.target.value)}
                        className="border p-1.5 text-xs font-mono bg-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flota.filter(v => v.idEstado === 1).map(v => (
                      <div key={v.id} className="border-t-4 border-[#003087] bg-slate-50/40 p-6 shadow-sm rounded-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-slate-700">PATRULLA: {v.placa}</span>
                          <span className="text-[9px] font-mono bg-slate-200 px-2 py-0.5 uppercase">KM: {v.kilometraje}</span>
                        </div>

                        {/* Inputs tácticos exigidos por el diseño del caso de uso */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <input type="text" placeholder="Comandante de Unidad" className="border p-2 bg-white font-ui" />
                          <input type="text" placeholder="Conductor Militar" className="border p-2 bg-white font-ui" />
                          <input type="text" placeholder="Tramo / Ruta Fronteriza" className="border p-2 bg-white md:col-span-2 font-ui" />
                        </div>

                        <button 
                          onClick={() => ejecutarDespliegue(v.id)}
                          className="w-full py-3 bg-[#060A12] text-amber-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                        >
                          Confirmar Inicio del Operativo →
                        </button>
                      </div>
                    ))}
                    {flota.filter(v => v.idEstado === 1).length === 0 && (
                      <p className="text-sm text-slate-400 italic">No existen medios de transporte en estado APTO. Registre inspecciones en la Ficha Técnica.</p>
                    )}
                  </div>
                </div>
              )}

              {/* VISTA 3: CIERRE DEL OPERATIVO Y PARTE VEHICULAR */}
              {subModulo === 'cierre' && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-black text-[#060A12] uppercase tracking-tight">Cierre de Registro Logístico y Parte de Retorno</h2>
                    <p className="text-xs text-slate-500 font-mono">// Rol Auditor: Jefe de Personal / Logística</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flota.filter(v => v.idEstado === 2).map(v => (
                      <div key={v.id} className="border border-amber-300 bg-amber-50/10 p-6 rounded shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">EN MISIÓN: {v.placa}</span>
                            <h3 className="text-sm font-bold text-slate-700 mt-1">{v.marca} {v.modelo}</h3>
                          </div>
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">Kilometraje de Llegada (Parte de Cierre)</label>
                          <input 
                            type="number" 
                            placeholder={`Debe ser mayor a ${v.kilometraje}`}
                            onChange={e => setKmForm({ ...kmForm, [v.id]: e.target.value })}
                            className="border p-2 text-xs font-mono w-full bg-white" 
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => ejecutarCierreParte(v.id, false)}
                            className="flex-1 py-2.5 bg-slate-800 hover:bg-[#003087] text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            Retorno Sin Novedad
                          </button>
                          <button 
                            onClick={() => ejecutarCierreParte(v.id, true)}
                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            Enviar a Mantenimiento
                          </button>
                        </div>
                      </div>
                    ))}
                    {flota.filter(v => v.idEstado === 2).length === 0 && (
                      <p className="text-sm text-slate-400 italic">No se registran medios de transporte actualmente desplegados en operaciones.</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// COMPONENTE AUXILIAR INTERNO: TARJETAS DE ACCIÓN DEL CENTRO DE MANDO
function ActionCard({ title, desc, icon, onClick, accent }) {
  return (
    <button 
      onClick={onClick}
      className={`relative bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/30 flex flex-col items-start text-left group transition-all duration-500 hover:-translate-y-2 border-t-4 ${accent} overflow-hidden h-72 w-full cursor-pointer`}
    >
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 rotate-12 group-hover:rotate-0 select-none">
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