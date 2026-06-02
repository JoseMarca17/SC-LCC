import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export default function InventarioMaterial() {
  const [materiales, setMateriales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const token = authService.getToken();

  const cargarDatos = async () => {
    try {
      const resMat = await fetch(`http://localhost:5183/api/MaterialIncautado/listar?buscar=${buscar}&idCategoria=${catSeleccionada}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMat.ok) setMateriales(await resMat.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetch('http://localhost:5183/api/MaterialIncautado/categorias', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setCategorias(data));
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [buscar, catSeleccionada]);

  return (
    <div className="space-y-8 font-ui">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-black uppercase text-slate-900">Inventario Técnico de Mercaderías</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Búsqueda y control de bienes decomisados</p>
        </div>
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-amber-500 text-white font-mono text-[10px] font-black uppercase px-6 py-3 tracking-widest hover:bg-slate-900 transition-colors cursor-pointer"
        >
          {mostrarForm ? '✖ Cerrar Registro' : '➕ Añadir Material a Acta'}
        </button>
      </div>

      {/* SUB-FORMULARIO DINÁMICO */}
      {mostrarForm && (
        <div className="bg-slate-50 p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
          <h3 className="text-xs font-black uppercase text-amber-600 mb-4">// Registrar Ítem Adicional</h3>
          {/* Aquí mapeas los inputs hacia el endpoint 'registrar' */}
          <p className="text-xs text-slate-400 italic">Formulario de inserción indexado a ID de Comiso...</p>
        </div>
      )}

      {/* FILTROS DE BÚSQUEDA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Buscar por descripción o código de acta..." 
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          className="border p-3 text-xs bg-slate-50 font-bold outline-none focus:bg-white focus:border-amber-500 rounded-sm shadow-sm"
        />
        <select 
          value={catSeleccionada}
          onChange={e => setCatSeleccionada(e.target.value)}
          className="border p-3 text-xs bg-slate-50 font-bold outline-none focus:bg-white focus:border-amber-500 rounded-sm shadow-sm"
        >
          <option value="">-- Filtrar por Categoría --</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
        </select>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-black">
              <th className="p-3">Código Acta</th>
              <th className="p-3">Descripción Bien</th>
              <th className="p-3">Categoría</th>
              <th className="p-3 text-right">Cantidad</th>
              <th className="p-3 text-right">Valor Total (Bs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {materiales.map(m => (
              <tr key={m.idMaterial} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 text-amber-600">{m.codigoComiso}</td>
                <td className="p-3 text-slate-900 uppercase">{m.tipoBien}</td>
                <td className="p-3 uppercase text-[10px] text-slate-400">{m.categoria}</td>
                <td className="p-3 text-right">{m.cantidad} {m.unidadMedida}</td>
                <td className="p-3 text-right text-slate-900 font-black">{m.valorTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}