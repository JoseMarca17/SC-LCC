import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Verificar2FA from './pages/Verificar2FA';
import Dashboard from './pages/Dashboard';
import Noticias from './pages/Noticias';
import Contacto from './pages/Contacto';
import Actas from './pages/Actas';

import UsuariosHub from './pages/M1_GestionUsuarios/UsuariosHub';
import IncautacionHub from './pages/M2_RegistroIncautacion/IncautacionHub';
import TransporteHub from './pages/M4_Transporte/TransporteHub';
import MaterialHub from './pages/M5_MaterialIncautado/MaterialHub';
import CivilHub from './pages/M6_RegistroCiviles/CivilHub';
import NovedadesHub from './pages/M7_Novedades/NovedadesHub';
import OperacionesHub from './pages/M8_RegistroOperaciones/OperacionesHub';
import PersonalHub from './pages/M9_RegistroPersonal/PersonalHub';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Rutas Públicas: Portal de cara al ciudadano */}
        <Route path="/" element={<Inicio />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verificar-2fa" element={<Verificar2FA />} />

        {/* 🎖️ Rutas Privadas / Operativas: Centro de Mando */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/actas" element={<Actas />} />

        {/* 🛡️ Rutas del Módulo 1: Gestión de Usuarios (Proceso 01 - Admin Only) */}
        <Route path="/usuarios" element={<UsuariosHub />} />
        <Route path="/incautacion" element={<IncautacionHub />} />
        <Route path="/transporte" element={<TransporteHub />} />
        <Route path="/material" element={<MaterialHub />} />
        <Route path="/civiles" element={<CivilHub />} />
        <Route path="/novedades" element={<NovedadesHub />} />
        <Route path="/operaciones" element={<OperacionesHub />} />
        <Route path="/personal" element={<PersonalHub />} />



        {/* 🔄 Redirección por defecto ante rutas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}