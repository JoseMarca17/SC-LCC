import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function RegistrarVehiculo() {
  const [seccionActiva, setSeccionActiva] = useState(null); // null, 'fotos', 'propietario'
  const [catalogos, setCatalogos] = useState({ tipos: [], estados: [] });
  const [loading, setLoading] = useState(false);
  
  // Estado unificado con TODOS los campos de la Ficha Técnica y del Catálogo
  const [form, setForm] = useState({
    placa: '',
    vin: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    idTipo: '',
    // Datos Propietario (Civil)
    nombresProp: '',
    apellidosProp: '',
    nroDocProp: '',
    idTipoDocumento: 1 // 1 = CI (CatTipoDocumento)
  });

  const token = authService.getToken();

  useEffect(() => {
    // Carga de catálogos oficiales desde el backend
    fetch('http://localhost:5183/api/Transporte/catalogos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCatalogos(data))
    .catch(err => console.error("Error cargando catálogos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.placa || !form.idTipo) {
      alert("Por favor, complete los campos obligatorios (Placa y Tipo de Vehículo).");
      return;
    }

    setLoading(false);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5183/api/Transporte/registrar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✓ Vehículo e infracción registrados con éxito en el sistema central.");
        // Limpiar formulario
        setForm({
          placa: '', vin: '', marca: '', modelo: '', anio: '', color: '', idTipo: '',
          nombresProp: '', apellidosProp: '', nroDocProp: '', idTipoDocumento: 1
        });
        setSeccionActiva(null);
      } else {
        alert(data.message || "Error al registrar la unidad.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor logístico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-ui animate-in fade-in duration-500">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Ficha Técnica de Vehículo</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Complete los datos para la verificación de VIN y Placa
        </p>
      </div>

      {/* ── 1. FICHA TÉCNICA PRINCIPAL (Siempre visible y editable) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Número de Placa *</label>
          <input 
            type="text" 
            placeholder="1234-ABC"
            value={form.placa} 
            onChange={e => setForm({...form, placa: e.target.value})} 
            className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none transition-colors" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">VIN (Nro. Chasis)</label>
          <input 
            type="text" 
            placeholder="Nro de Serie..."
            value={form.vin} 
            onChange={e => setForm({...form, vin: e.target.value})} 
            className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none transition-colors" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Tipo de Vehículo *</label>
          <select 
            value={form.idTipo} 
            onChange={e => setForm({...form, idTipo: e.target.value})} 
            className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold outline-none focus:border-blue-600 transition-colors"
          >
            <option value="">Seleccione tipo...</option>
            {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Marca</label>
          <input 
            type="text" 
            value={form.marca} 
            onChange={e => setForm({...form, marca: e.target.value})} 
            className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500">Modelo</label>
          <input 
            type="text" 
            value={form.modelo} 
            onChange={e => setForm({...form, modelo: e.target.value})} 
            className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500">Año</label>
            <input 
              type="number" 
              value={form.anio} 
              onChange={e => setForm({...form, anio: e.target.value})} 
              className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500">Color</label>
            <input 
              type="text" 
              value={form.color} 
              onChange={e => setForm({...form, color: e.target.value})} 
              className="bg-slate-50/50 border-b-2 border-slate-200 p-3 text-xs font-bold focus:border-blue-600 outline-none" 
            />
          </div>
        </div>
      </div>

      {/* ── 2. AGREGADOS DINÁMICOS DESPLEGABLES ── */}
      {seccionActiva === 'fotos' && (
        <div className="p-8 border border-blue-200 bg-blue-50/30 rounded-sm animate-in zoom-in-95 duration-200 relative">
          <div className="flex justify-between items-center mb-4 border-b border-blue-100 pb-2">
            <h3 className="text-[11px] font-black uppercase text-blue-700 tracking-wider">// Cargar Fotografías de Inspección (Tarea 4.10)</h3>
            <button type="button" onClick={() => setSeccionActiva(null)} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase cursor-pointer">✖ Cerrar Sección</button>
          </div>
          <div className="border-2 border-dashed border-slate-300 bg-white p-6 text-center rounded-sm">
            <input type="file" multiple className="text-xs font-mono" />
            <p className="text-[10px] text-slate-400 uppercase font-bold mt-2">Arrastre los archivos JPG de la unidad incautada</p>
          </div>
        </div>
      )}

      {seccionActiva === 'propietario' && (
        <div className="p-8 border border-slate-200 bg-slate-50 rounded-sm animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">// Datos del Propietario / Conductor (Sección 7)</h3>
            <button type="button" onClick={() => setSeccionActiva(null)} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase cursor-pointer">✖ Cerrar Sección</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Nombres" 
              value={form.nombresProp} 
              onChange={e => setForm({...form, nombresProp: e.target.value})} 
              className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" 
            />
            <input 
              type="text" 
              placeholder="Apellidos" 
              value={form.apellidosProp} 
              onChange={e => setForm({...form, apellidosProp: e.target.value})} 
              className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" 
            />
            <select 
              value={form.idTipoDocumento} 
              onChange={e => setForm({...form, idTipoDocumento: e.target.value})}
              className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
            >
              <option value="1">C.I.</option>
              <option value="2">Pasaporte</option>
              <option value="3">Carnet Extranjero</option>
            </select>
            <input 
              type="text" 
              placeholder="Nro Documento" 
              value={form.nroDocProp} 
              onChange={e => setForm({...form, nroDocProp: e.target.value})} 
              className="bg-white border p-3 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" 
            />
          </div>
        </div>
      )}

      {/* ── 3. BOTONERA DE COMANDO RECONSTRUIDA (image_aa5dff.png) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <button 
          type="button" 
          onClick={() => setSeccionActiva('fotos')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${seccionActiva === 'fotos' ? 'bg-blue-800 text-white' : 'bg-[#2563EB] text-white hover:bg-blue-700'}`}
        >
          📸 Adjuntar Fotos
        </button>
        
        <button 
          type="button" 
          onClick={() => setSeccionActiva('propietario')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${seccionActiva === 'propietario' ? 'bg-slate-900 text-white' : 'bg-[#1E293B] text-white hover:bg-slate-800'}`}
        >
          👤 Datos Propietario
        </button>
        
        <button 
          type="submit" 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#059669] text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg disabled:bg-slate-300 cursor-pointer"
        >
          {loading ? 'Transmitiendo...' : 'Finalizar Registro'}
        </button>
      </div>
    </div>
  );
}