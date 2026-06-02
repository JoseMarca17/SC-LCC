import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function RegistrarUsuario() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    idRol: 5 // Valor por defecto: PersonalOperaciones (ID 5 según tu CatRol)[cite: 1]
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idRol' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = authService.getToken();

      // Petición al backend .NET
      const res = await fetch('http://localhost:5183/api/Usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Necesario para el atributo [Authorize(Roles = "1")][cite: 1]
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error en el alta del usuario.');

      setMensaje({ texto: "Usuario registrado e impactado en Bitácora exitosamente.", tipo: 'exito' });
      setFormData({ nombres: '', apellidos: '', email: '', password: '', idRol: 5 });
      
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-sm shadow-xl animate-in fade-in duration-500 font-ui">
      {/* Cabecera del Formulario Táctico */}
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono font-black text-[#003087] uppercase tracking-[0.3em]">// Formulario Oficial</span>
          <h2 className="text-xl font-black uppercase text-slate-900 mt-1">Alta de Personal Operativo</h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID Proceso</p>
          <p className="text-xs font-mono font-bold text-[#003087]">UC-01-01</p>
        </div>
      </div>

      <div className="p-8">
        {mensaje.texto && (
          <div className={`p-4 mb-8 border font-mono text-[11px] font-bold uppercase rounded-sm ${
            mensaje.tipo === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {mensaje.tipo === 'exito' ? '[✓] ' : '[!] '} {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fila 1: Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombres Completos</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required 
                className="border-b-2 border-slate-200 p-2 text-sm focus:border-[#003087] outline-none bg-transparent font-bold transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Apellidos</label>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required 
                className="border-b-2 border-slate-200 p-2 text-sm focus:border-[#003087] outline-none bg-transparent font-bold transition-all" />
            </div>
          </div>

          {/* Fila 2: Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Correo Institucional (Login)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
              className="border-b-2 border-slate-200 p-2 text-sm font-mono focus:border-[#003087] outline-none bg-transparent transition-all" />
          </div>

          {/* Fila 3: Password y Rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contraseña Temporal</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                className="border-b-2 border-slate-200 p-2 text-sm focus:border-[#003087] outline-none bg-transparent transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rol de Mando Asignado</label>
              <select name="idRol" value={formData.idRol} onChange={handleChange} 
                className="border-b-2 border-slate-200 p-2 text-sm font-bold focus:border-[#003087] outline-none bg-slate-50 cursor-pointer">
                <option value={1}>Administrador (Control Total)</option>
                <option value={2}>Jefe de Operaciones (Planificación)</option>
                <option value={3}>Jefe de Personal (Efectivos)</option>
                <option value={4}>Jefe de Logística (Vehículos)</option>
                <option value={5}>Personal de Operaciones (Comisos)</option>
                <option value={6}>Observador (Solo Lectura)</option>
              </select>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#003087] text-white px-10 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-blue-900 disabled:bg-slate-300 transition-all cursor-pointer"
            >
              {loading ? 'Transmitiendo Datos...' : 'Confirmar Registro en BD'}
            </button>
          </div>
        </form>
      </div>

      {/* Pie de Formulario */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Nota: Toda acción es registrada bajo la IP del administrador actual para fines de auditoría.
        </p>
      </div>
    </div>
  );
}