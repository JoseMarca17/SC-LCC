import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import { authService } from '../../services/authService';

// IMPORTACIÓN CORRECTA PARA VITE/MODERN BUNDLERS
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix seguro de iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

function HeatLayerComponent({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;
    
    // Asegurarse de que Leaflet.heat esté disponible
    if (typeof L.heatLayer === 'undefined') {
        console.error("Leaflet.heat no se cargó correctamente.");
        return;
    }

    const heatData = points.map(p => [p.lat, p.lng, 1.0]); 
    const layer = L.heatLayer(heatData, { 
      radius: 30, 
      blur: 20, 
      maxZoom: 10,
      gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    }).addTo(map);
    
    return () => { map.removeLayer(layer); };
  }, [map, points]);
  return null;
}

export default function LienzoCartografico() {
  const [geoPoints, setGeoPoints] = useState([]);
  const token = authService.getToken();

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const res = await fetch('http://localhost:5183/api/InformesYReportes/puntos-georeferenciados', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Error en la respuesta de red");
        
        const data = await res.json();
        
        // Validación de seguridad para que Leaflet no explote si recibe datos basura
        if (Array.isArray(data)) {
           setGeoPoints(data);
        } else {
           console.error("Los datos de georreferenciación no son un array", data);
           setGeoPoints([]);
        }
      } catch (error) {
        console.error("Error al cargar datos cartográficos:", error);
      }
    };
    fetchGeoData();
  }, [token]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-[#0A192F] uppercase tracking-tighter">
            Mapa Táctico de Incidencias
          </h2>
          <p className="text-xs text-slate-500 font-mono">Georreferenciación de interceptaciones fronterizas.</p>
        </div>
        <div className="bg-red-50 text-red-700 px-3 py-1 border border-red-200 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          {geoPoints.length} Puntos Activos
        </div>
      </div>

      <div className="h-[600px] w-full border-4 border-[#060A12] rounded-sm overflow-hidden relative shadow-2xl">
        <MapContainer center={[-16.290154, -63.588653]} zoom={5.5} className="h-full w-full bg-[#060d19]">
          <TileLayer 
            attribution='&copy; <a href="https://carto.com/">CARTO</a>' 
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
          />
          <HeatLayerComponent points={geoPoints} />
          
          {geoPoints.map((point) => (
            // Validar que existan las coordenadas antes de pintar el marker
            point.lat && point.lng ? (
                <Marker key={point.id} position={[point.lat, point.lng]}>
                  <Popup className="font-ui">
                    <div className="text-xs">
                      <strong className="text-amber-600 font-mono text-sm block mb-1">{point.codigo}</strong>
                      <span className="block text-slate-600"><b>Lugar:</b> {point.lugar}</span>
                      <span className="block text-slate-600"><b>Zona:</b> {point.zona}</span>
                    </div>
                  </Popup>
                </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>
    </div>
  );
}