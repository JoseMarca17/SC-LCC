import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function FormularioOperativo() {
  const [operativo, setOperativo] = useState({
    codigoOperativo: '',
    idTipo: '1',
    idZona: '',
    descripcion: '',
    idGrupo: ''
  });

  const [ordenDia, setOrdenDia] = useState({
    descripcionOrden: ''
  });

  const handleRegistrarTodo = async (e) => {
    e.preventDefault();

    if (!operativo.codigoOperativo || !operativo.descripcion || !ordenDia.descripcionOrden) {
      alert("Por favor, complete todos los campos obligatorios para el despliegue.");
      return;
    }

    try {
      const token = authService.getToken();

      // 1. Registrar la Orden de Operación (Operativo Militar)
      const resOp = await fetch('http://localhost:5183/api/Operacion/registrar-operativo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          codigoOperativo: operativo.codigoOperativo,
          idTipo: parseInt(operativo.idTipo),
          idZona: operativo.idZona ? parseInt(operativo.idZona) : null,
          descripcion: operativo.descripcion,
          idGrupo: operativo.idGrupo ? parseInt(operativo.idGrupo) : null
        })
      });

      const dataOp = await resOp.json();

      if (!resOp.ok) {
        alert(dataOp.message || "Error al registrar la orden de operación.");
        return;
      }

      // 2. Registrar la Orden del Día vinculada al ID del operativo recién creado
      const resOrden = await fetch('http://localhost:5183/api/Operacion/registrar-orden-dia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idOperativo: dataOp.idOperativo,
          descripcion: ordenDia.descripcionOrden
        })
      });

      if (resOrden.ok) {
        alert(`Operación militar asentada en la Base de Datos.\nCódigo: ${operativo.codigoOperativo}\nID Operativo: ${dataOp.idOperativo}`);
        // Limpiar formularios
        setOperativo({ codigoOperativo: '', idTipo: '1', idZona: '', descripcion: '', idGrupo: '' });
        setOrdenDia({ descripcionOrden: '' });
      } else {
        alert("El operativo se creó, pero falló el registro de la orden del día.");
      }

    } catch (err) {
      console.error(err);
      alert("Error de red con el centro de mando.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#0A192F]">Apertura de Orden de Operación</h2>
        <p className="text-xs text-slate-400 mt-1">Formulario oficial para el registro e inicio de misiones de interdicción.</p>
      </div>

      <form onSubmit={handleRegistrarTodo} className="space-y-6">
        {/* Datos del Operativo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Código Operativo (Único)</label>
            <input type="text" placeholder="Ej: OP-FRONTERA-2026" value={operativo.codigoOperativo} onChange={e => setOperativo({...operativo, codigoOperativo: e.target.value})} className="border p-2.5 text-xs font-mono uppercase rounded-sm" required />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Tipo de Misión</label>
            <select value={operativo.idTipo} onChange={e => setOperativo({...operativo, idTipo: e.target.value})} className="border p-2.5 text-xs bg-white rounded-sm">
              <option value="1">Interdicción Fronteriza</option>
              <option value="2">Patrullaje de Rutina</option>
              <option value="3">Control Vehicular Estático</option>
              <option value="6">Respuesta Rápida / Asalto</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ID Zona Geográfica</label>
            <input type="number" placeholder="Ej: 5 (Desaguadero)" value={operativo.idZona} onChange={e => setOperativo({...operativo, idZona: e.target.value})} className="border p-2.5 text-xs rounded-sm" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ID Grupo / Patrulla Asignada (Opcional)</label>
            <input type="number" placeholder="Ej: 2" value={operativo.idGrupo} onChange={e => setOperativo({...operativo, idGrupo: e.target.value})} className="border p-2.5 text-xs rounded-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Descripción Breve del Despliegue</label>
            <input type="text" placeholder="Ej: Control de rutas ilegales sector norte." value={operativo.descripcion} onChange={e => setOperativo({...operativo, descripcion: e.target.value})} className="border p-2.5 text-xs rounded-sm" required />
          </div>
        </div>

        {/* Datos de la Orden del Día */}
        <div className="flex flex-col border-t border-slate-100 pt-4">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Cuerpo de la Orden del Día (Consigna de Comando)</label>
          <textarea placeholder="Redacte la Orden del Día completa: Disposiciones de seguridad, santo y seña, horarios de rancho y armamento reglamentario..." value={ordenDia.descripcionOrden} onChange={e => setOrdenDia({descripcionOrden: e.target.value})} className="border p-3 text-xs h-32 rounded-sm resize-none" required />
        </div>

        <button type="submit" className="w-full bg-[#0A192F] hover:bg-amber-500 text-white font-black text-xs py-3.5 px-6 uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer">
          Publicar y Registrar en Base de Datos
        </button>
      </form>
    </div>
  );
}