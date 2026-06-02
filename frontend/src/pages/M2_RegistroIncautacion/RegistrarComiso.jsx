import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function RegistrarComiso() {
  const [catalogos, setCatalogos] = useState({ categorias: [], zonas: [], operativos: [] });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lugar: '', idZona: '', latitud: '', longitud: '', idOperativo: '',
    tipoBien: '', idCategoria: '', cantidad: '', unidadMedida: '',
    descripcionDetallada: '', valorUnitario: '', idEstadoFisico: 1
  });

  const token = authService.getToken();

  useEffect(() => {
    // Carga inicial de tablas Cat de la Sección 1 de tu SQL
    fetch('http://localhost:5183/api/Incautacion/catalogos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCatalogos(data));
  }, []);

  const capturarGPS = () => {
    navigator.geolocation.getCurrentPosition((p) => {
      setForm({ ...form, latitud: p.coords.latitude, longitud: p.coords.longitude });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5183/api/Incautacion/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) alert("Comiso y Material registrados en Base de Datos");
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-ui">
      {/* SECCIÓN A: CABECERA DEL COMISO (Tabla Comiso)[cite: 1] */}
      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-xs font-black uppercase text-[#003087] mb-6 tracking-[0.2em]">// Datos del Acta de Comiso</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Lugar del Operativo</label>
            <input type="text" onChange={e => setForm({...form, lugar: e.target.value})} required className="border-b-2 p-2 text-xs font-bold focus:border-[#003087] outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Zona Fronteriza (Sección 1)</label>
            <select onChange={e => setForm({...form, idZona: e.target.value})} className="border-b-2 p-2 text-xs font-bold outline-none">
              <option value="">Seleccione Zona...</option>
              {catalogos.zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Operativo Relacionado</label>
            <select onChange={e => setForm({...form, idOperativo: e.target.value})} className="border-b-2 p-2 text-xs font-bold outline-none">
              <option value="">Seleccione Operativo...</option>
              {catalogos.operativos.map(o => <option key={o.idOperativo} value={o.idOperativo}>{o.codigoOperativo}</option>)}
            </select>
          </div>
        </div>
        <button type="button" onClick={capturarGPS} className="mt-6 text-[10px] font-black text-emerald-600 uppercase border border-emerald-600 px-4 py-2 hover:bg-emerald-600 hover:text-white transition-all">
          📍 Capturar Coordenadas GPS (Tarea 2.4)
        </button>
      </div>

      {/* SECCIÓN B: DETALLE DE MERCADERÍA (Tabla MaterialIncautado)[cite: 1] */}
      <div>
        <h3 className="text-xs font-black uppercase text-[#003087] mb-6 tracking-[0.2em]">// Detalle de Material Incautado</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Tipo de Bien / Mercadería</label>
            <input type="text" onChange={e => setForm({...form, tipoBien: e.target.value})} placeholder="Ej: Harina de Trigo" className="border-b-2 p-2 text-xs font-bold outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Categoría (CatCategoriaBien)</label>
            <select onChange={e => setForm({...form, idCategoria: e.target.value})} className="border-b-2 p-2 text-xs font-bold outline-none">
              <option value="">Seleccione...</option>
              {catalogos.categorias.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Estado Físico</label>
            <select onChange={e => setForm({...form, idEstadoFisico: e.target.value})} className="border-b-2 p-2 text-xs font-bold outline-none">
              <option value={1}>Bueno</option>
              <option value={4}>Destruido</option>
              <option value={5}>Incinerado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <input type="number" placeholder="Cantidad" onChange={e => setForm({...form, cantidad: e.target.value})} className="border-b-2 p-2 text-xs font-bold" />
          <input type="text" placeholder="Unidad (Kg, Litros, Unid)" onChange={e => setForm({...form, unidadMedida: e.target.value})} className="border-b-2 p-2 text-xs font-bold" />
          <input type="number" placeholder="Valor Unitario (Bs)" onChange={e => setForm({...form, valorUnitario: e.target.value})} className="border-b-2 p-2 text-xs font-bold" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#003087] text-white py-4 font-mono text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all">
        {loading ? 'Transmitiendo a Base de Datos...' : 'Confirmar e Inyectar Registro de Incautación'}
      </button>
    </form>
  );
}