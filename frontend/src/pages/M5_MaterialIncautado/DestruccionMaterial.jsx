import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function DestruccionMaterial() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    idMaterial: '',
    idEstadoFisico: '', // 4 = Destruido, 5 = Incinerado (CatEstadoFisico)
    actaDestruccion: ''
  });

  const token = authService.getToken();

  // Carga inicial de materiales aptos para destrucción (que estén en estado Bueno o Regular)
  const cargarMateriales = async () => {
    try {
      const res = await fetch('http://localhost:5183/api/MaterialIncautado/listar', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filtramos para mostrar solo los que no han sido destruidos o incinerados aún (idEstadoFisico 1, 2, 3)
        setMateriales(data.filter(m => m.estadoFisico !== 4 && m.estadoFisico !== 5));
      }
    } catch (err) {
      console.error("Error cargando inventario:", err);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.idMaterial || !form.idEstadoFisico || !form.actaDestruccion) {
      alert("Por favor, complete todos los campos de la orden de destrucción.");
      return;
    }

    if (!window.confirm("¿Está seguro de registrar la destrucción/incineración de esta mercadería? Esta acción es irreversible y quedará auditada.")) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5183/api/MaterialIncautado/registrar-destruccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("✓ Acta de destrucción e incineración registrada correctamente en la base de datos SC_LCC.");
        setForm({ idMaterial: '', idEstadoFisico: '', actaDestruccion: '' });
        cargarMateriales(); // Recargar la tabla para remover el ítem destruido
      } else {
        alert("Error al procesar la baja física del material.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de comunicación con el servidor de operaciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b-2 border-red-600 pb-4">
        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">
          Tarea 5.8 // Acta de Disposición Final
        </span>
        <h2 className="text-2xl font-black uppercase text-slate-900 mt-1">
          Registro de Material Incinerado / Destruido
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 border border-slate-200 rounded-sm shadow-inner">
        
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Seleccionar Lote de Mercadería</label>
          <select
            value={form.idMaterial}
            onChange={e => setForm({ ...form, idMaterial: e.target.value })}
            className="w-full bg-white border p-3.5 text-xs font-bold outline-none focus:border-red-600 transition-colors shadow-sm"
            required
          >
            <option value="">-- SELECCIONE UN ÍTEM DEL INVENTARIO ACTIVO --</option>
            {materiales.map(m => (
              <option key={m.idMaterial} value={m.idMaterial}>
                [{m.codigoComiso}] - {m.tipoBien} ({m.cantidad} {m.unidadMedida})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tipo de Disposición (Estado Físico)</label>
            <select
              value={form.idEstadoFisico}
              onChange={e => setForm({ ...form, idEstadoFisico: e.target.value })}
              className="w-full bg-white border p-3.5 text-xs font-bold outline-none focus:border-red-600 transition-colors shadow-sm"
              required
            >
              <option value="">-- Seleccione el método --</option>
              <option value="4">Destruido</option>
              <option value="5">Incinerado</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Código / Nro. de Acta de Destrucción</label>
            <input
              type="text"
              placeholder="Ej: ACTA-DEST-2026-009"
              value={form.actaDestruccion}
              onChange={e => setForm({ ...form, actaDestruccion: e.target.value })}
              className="w-full bg-white border p-3.5 text-xs font-bold outline-none focus:border-red-600 transition-colors shadow-sm"
              required
            />
          </div>
        </div>

        <div className="p-4 bg-red-50 border-l-4 border-red-600 text-[11px] font-bold text-red-900 italic">
          Aviso: Confirmar este formulario inyectará automáticamente el estado de destrucción en los registros de auditoría y generará un evento de bitácora inmutable.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0F172A] hover:bg-red-700 text-white py-4 font-mono text-xs font-black uppercase tracking-widest shadow-xl transition-all disabled:bg-slate-400 cursor-pointer"
        >
          {loading ? 'Procesando Destrucción...' : 'Legalizar Baja y Destrucción de Mercadería'}
        </button>
      </form>
    </div>
  );
}