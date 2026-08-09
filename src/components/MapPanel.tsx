import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident, RiskZone, EmergencyResource } from '../../api/types';

interface MapPanelProps {
  incidents: Incident[];
  riskZones: RiskZone[];
  resources: EmergencyResource[];
  selectedIncidentId?: string | null;
  selectedZoneId?: string | null;
  onSelectIncident?: (incident: Incident) => void;
  onSelectZone?: (zone: RiskZone) => void;
  userRoute?: any | null; // Drawn route
}

// OpenStreetMap dark theme tiles (looks extremely professional)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const MapPanel: React.FC<MapPanelProps> = ({
  incidents,
  riskZones,
  resources,
  selectedIncidentId,
  selectedZoneId,
  onSelectIncident,
  onSelectZone,
  userRoute
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Miami EOC coordinates
    const map = L.map(mapContainerRef.current, {
      center: [25.7617, -80.1918],
      zoom: 13,
      zoomControl: false, // will position manually
      minZoom: 10,
      maxZoom: 18
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    zonesLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Render Risk Zones and Markers
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    const zonesLayer = zonesLayerRef.current;

    if (!map || !markersLayer || !zonesLayer) return;

    // Clear previous layers
    markersLayer.clearLayers();
    zonesLayer.clearLayers();

    // -- A. Draw Risk Zones (vector circles) --
    riskZones.forEach(zone => {
      const isSelected = selectedZoneId === zone.id;
      const color = 
        zone.severity === 'critical' ? '#ef4444' : 
        zone.severity === 'high' ? '#f97316' : 
        zone.severity === 'moderate' ? '#f59e0b' : '#10b981';

      const circle = L.circle([zone.latitude, zone.longitude], {
        radius: zone.radius,
        color: color,
        weight: isSelected ? 3 : 1.5,
        fillColor: color,
        fillOpacity: isSelected ? 0.35 : 0.15,
        dashArray: isSelected ? '5, 5' : undefined
      });

      // Bind click selection
      circle.on('click', () => {
        if (onSelectZone) onSelectZone(zone);
      });

      // Popup
      circle.bindPopup(`
        <div style="min-width: 160px;">
          <h4 style="margin:0 0 4px; font-weight:700; font-size:13px; color:#fff;">${zone.name}</h4>
          <div style="font-size:11px; margin-bottom:8px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${color}; margin-right:4px;"></span>
            <span style="font-weight:600; text-transform:uppercase; color:${color};">${zone.severity} risk</span>
          </div>
          <div style="font-size:12px; display:flex; justify-content:space-between; margin-bottom:4px; border-bottom:1px solid #334155; padding-bottom:4px;">
            <span style="color:#94a3b8;">Risk Score:</span>
            <strong style="color:#fff;">${zone.risk_score}/100</strong>
          </div>
          <div style="font-size:10px; color:#64748b;">Click zone to view breakdown</div>
        </div>
      `);

      circle.addTo(zonesLayer);

      // If selected, open popup automatically after a short delay
      if (isSelected) {
        setTimeout(() => {
          circle.openPopup();
          // map.setView([zone.latitude, zone.longitude], map.getZoom());
        }, 100);
      }
    });

    // -- B. Draw Incident Markers --
    incidents.forEach(inc => {
      const isSelected = selectedIncidentId === inc.id;
      const colorClass = 
        inc.severity === 'critical' ? 'text-red-500' : 
        inc.severity === 'high' ? 'text-orange-500' : 
        inc.severity === 'moderate' ? 'text-amber-500' : 'text-emerald-500';

      const colorCode = 
        inc.severity === 'critical' ? '#ef4444' : 
        inc.severity === 'high' ? '#f97316' : 
        inc.severity === 'moderate' ? '#f59e0b' : '#10b981';

      // SVG DivIcon for premium visual pulse
      const iconHtml = `
        <div class="marker-pin-outer ${isSelected ? 'scale-125' : ''}" style="color: ${colorCode}">
          <div class="marker-pin-inner"></div>
          <div class="absolute -inset-1 rounded-full animate-ping opacity-25 border border-current" style="animation-duration: 2s"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

      marker.on('click', () => {
        if (onSelectIncident) onSelectIncident(inc);
      });

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-family:monospace; font-size:10px; color:#94a3b8;">${inc.code}</span>
            <span style="font-size:10px; font-weight:600; text-transform:uppercase; color:${colorCode};">${inc.severity}</span>
          </div>
          <h4 style="margin:0 0 6px; font-weight:700; font-size:12px; color:#fff;">${inc.type}</h4>
          <p style="margin:0 0 8px; font-size:11px; color:#cbd5e1; line-height:1.3;">${inc.description.length > 80 ? inc.description.substring(0, 80) + '...' : inc.description}</p>
          <div style="font-size:10px; color:#64748b;">Confidence: ${inc.confidence}% | Status: ${inc.status.toUpperCase()}</div>
        </div>
      `);

      marker.addTo(markersLayer);

      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
          map.setView([inc.latitude, inc.longitude], 14);
        }, 150);
      }
    });

    // -- C. Draw Emergency Resources --
    resources.forEach(res => {
      const typeColor = 
        res.type === 'hospital' ? '#3b82f6' :     // blue
        res.type === 'fire station' ? '#ec4899' : // pink
        res.type === 'police station' ? '#8b5cf6' : // purple
        res.type === 'shelter' ? '#06b6d4' :      // cyan
        '#10b981';                                // green

      const iconHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-950/90 hover:scale-110 transition-transform shadow-md" style="color: ${typeColor}">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${typeColor}; box-shadow: 0 0 6px ${typeColor}"></span>
        </div>
      `;

      const resourceIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([res.latitude, res.longitude], { icon: resourceIcon });
      
      marker.bindPopup(`
        <div style="min-width: 160px; font-size: 11px;">
          <h4 style="margin:0 0 4px; font-weight:700; color:#fff; font-size:12px;">${res.name}</h4>
          <div style="color:${typeColor}; text-transform:uppercase; font-weight:600; font-size:10px; margin-bottom:4px;">${res.type}</div>
          <div style="color:#cbd5e1; margin-bottom:4px;">Capacity: ${res.capacity || 'N/A'}</div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#64748b;">Availability:</span>
            <strong style="color:${res.availability === 'available' ? '#10b981' : res.availability === 'limited' ? '#f59e0b' : '#ef4444'}">${res.availability.toUpperCase()}</strong>
          </div>
        </div>
      `);
      marker.addTo(markersLayer);
    });

  }, [incidents, riskZones, resources, selectedIncidentId, selectedZoneId, onSelectIncident, onSelectZone]);

  // 3. Render Route overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old polyline
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (userRoute && userRoute.coordinates && userRoute.coordinates.length > 0) {
      const color = 
        userRoute.type === 'lowest_risk' ? '#10b981' : 
        userRoute.type === 'emergency' ? '#3b82f6' : '#ef4444';

      const polyline = L.polyline(userRoute.coordinates, {
        color: color,
        weight: 5,
        opacity: 0.85,
        lineJoin: 'round',
        dashArray: userRoute.type === 'emergency' ? '10, 10' : undefined
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Fit bounds
      try {
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } catch (e) {}
    }
  }, [userRoute]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 10 }} />
      
      {/* Map Control overlay legend */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 z-[1000] text-[10px] space-y-1.5 max-w-[180px] shadow-lg">
        <span className="font-semibold text-slate-300 block border-b border-slate-800 pb-1 text-[11px]">Map Legend</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-glow-red inline-block" />
          <span>Critical Hazard / Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
          <span>High Hazard / Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span>Moderate Hazard / Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span>Low Hazard / Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-blue-500/70 inline-block bg-blue-900/30" />
          <span>Emergency Resource</span>
        </div>
      </div>
    </div>
  );
};
export default MapPanel;
