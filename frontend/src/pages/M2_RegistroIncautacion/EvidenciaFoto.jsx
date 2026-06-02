import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function EvidenciaFoto() {
  const [comisos, setComisos] = useState([]);
  const [comisoSeleccionado, setComisoSeleccionado] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const token = authService.getToken();

  // Cargar comisos para vincular la evidencia (UC-02-04)
  useEffect(() => {
    fetch('http://localhost:5183/api/Incautacion/listar', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setComisos(data));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file)); // Vista previa local
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comisoSeleccionado || !imagen) return alert("Complete los campos.");

    setSubiendo(true);
    const formData = new FormData();
    formData.append('archivo', imagen);
    formData.append('comisoId', comisoSeleccionado);

    try {
      const res = await fetch('http://localhost:5183/api/Incautacion/subir-foto', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // El navegador gestiona el Content-Type automáticamente
      });

      if (res.ok) {
        alert("✓ Evidencia vinculada correctamente en SC-LCC.");
        setImagen(null);
        setPreview(null);
        setComisoSeleccionado('');
      }
    } catch (err) {
      console.error("Error al subir:", err);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-l-4 border-blue-600 pl-6">
        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">
          Módulo 2 // Gestión de Evidencias
        </span>
        <h2 className="text-2xl font-black uppercase text-slate-900 mt-1">
          Adjuntar Registro Fotográfico
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/50 p-8 border border-slate-100 rounded-sm shadow-inner">
        
        {/* LADO IZQUIERDO: SELECCIÓN */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Acta de Comiso Destino</label>
            <select 
              value={comisoSeleccionado} 
              onChange={e => setComisoSeleccionado(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 p-4 text-xs font-bold outline-none focus:border-blue-600 transition-all rounded-sm shadow-sm"
              required
            >
              <option value="">-- SELECCIONE UN CÓDIGO DE ACTA --</option>
              {comisos.map(c => (
                <option key={c.idComiso} value={c.idComiso}>
                  [{c.codigoComiso}] - {c.lugar}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cargar Archivo (JPG/PNG)</label>
            <div className="relative group h-40 border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center bg-white hover:border-blue-600 transition-all cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Seleccionar Imagen</p>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: PREVIEW */}
        <div className="flex flex-col items-center justify-center border-2 border-slate-100 bg-white p-4 rounded-sm min-h-[250px]">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-60 rounded shadow-lg animate-in zoom-in-95 duration-300" />
          ) : (
            <div className="text-center italic text-slate-300 text-xs font-medium">
              Vista previa de evidencia...
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={subiendo}
          className="lg:col-span-2 w-full bg-[#060A12] text-white py-4 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl disabled:bg-slate-300 cursor-pointer"
        >
          {subiendo ? 'Transmitiendo a Servidor...' : 'Inyectar Evidencia al Sistema'}
        </button>
      </form>
    </div>
  );
}