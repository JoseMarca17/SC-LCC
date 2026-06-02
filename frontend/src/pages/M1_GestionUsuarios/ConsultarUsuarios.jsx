import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function ConsultarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', idRol: 5 });

  const token = authService.getToken();

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`http://localhost:5183/api/Usuarios?buscar=${buscar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsuarios(await res.json());
    } catch (err) { console.error("Error en persistencia", err); }
  };

  useEffect(() => { cargarUsuarios(); }, [buscar]);

  const handleCambiarEstado = async (id, idEstadoActual) => {
    const nuevoEstado = idEstadoActual === 1 ? 2 : 1; // Intercambia entre Activo (1) e Inactivo (2)
    try {
      const res = await fetch(`http://localhost:5183/api/Usuarios/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ idEstado: nuevoEstado })
      });
      if (res.ok) cargarUsuarios();
    } catch (err) { console.error(err); }
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5183/api/Usuarios/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditando(null);
        cargarUsuarios();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 p-6 rounded-sm shadow-sm font-ui animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-[9px] font-mono font-bold text-[#003087] uppercase tracking-widest">// Cuentas en Sistema</span>
          <h2 className="text-lg font-black uppercase text-slate-900 mt-0.5">Padrón de Personal Autorizado</h2>
        </div>
        <input 
          type="text" 
          placeholder="Buscar por correo, nombre o apellido..." 
          value={buscar} 
          onChange={e => setBuscar(e.target.value)} 
          className="border border-slate-200 p-2.5 text-xs bg-slate-50 w-full md:w-80 outline-none focus:bg-white focus:border-[#003087]" 
        />
      </div>

      {editando ? (
        <form onSubmit={handleGuardarCambios} className="bg-slate-50 p-6 border border-slate-200 mb-6 space-y-4">
          <h4 className="text-xs font-black uppercase text-[#003087]">// Modificar Datos del Usuario (UC-01-02)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} className="border bg-white p-2.5 text-xs font-bold" required />
            <input type="text" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} className="border bg-white p-2.5 text-xs font-bold" required />
            <select value={formData.idRol} onChange={e => setFormData({...formData, idRol: parseInt(e.target.value)})} className="border bg-white p-2.5 text-xs font-bold">
              <option value={1}>Administrador</option>
              <option value={2}>Jefe de Operaciones</option>
              <option value={3}>Jefe de Personal</option>
              <option value={4}>Jefe de Logística</option>
              <option value={5}>Personal de Operaciones</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setEditando(null)} className="bg-slate-300 text-slate-700 px-4 py-2 text-xs font-mono font-bold uppercase">Cancelar</button>
            <button type="submit" className="bg-[#003087] text-white px-4 py-2 text-xs font-mono font-bold uppercase">Guardar Cambios</button>
          </div>
        </form>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase">
              <th className="p-3">Grado y Apellidos</th>
              <th className="p-3">Correo Institucional</th>
              <th className="p-3">Rol Asignado</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
            {usuarios.map(u => (
              <tr key={u.idUsuario} className="hover:bg-slate-50/50">
                <td className="p-3 text-slate-900 uppercase">{u.nombres} {u.apellidos}</td>
                <td className="p-3 text-slate-500">{u.email}</td>
                <td className="p-3 text-[#003087] uppercase text-[10px]">{u.rolNombre}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm ${u.estadoId === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {u.estadoDescripcion}
                  </span>
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button onClick={() => { setEditando(u.idUsuario); setFormData({ nombres: u.nombres, apellidos: u.apellidos, idRol: u.rolId }); }} className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 text-[10px] uppercase font-black cursor-pointer">Editar</button>
                  <button onClick={() => handleCambiarEstado(u.idUsuario, u.estadoId)} className={`px-2 py-1 text-[10px] uppercase font-black cursor-pointer ${u.estadoId === 1 ? 'text-red-600 bg-red-50 border border-red-200' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'}`}>
                    {u.estadoId === 1 ? 'Inactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}