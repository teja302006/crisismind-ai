import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { MapPanel } from '../components/MapPanel';
import { useNotifications } from '../context/NotificationContext';
import { 
  Navigation, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Route, 
  Clock, 
  Zap,
  Info
} from 'lucide-react';

const presetTrips = [
  {
    name: 'Little Havana Substation ➔ Mercy Hospital',
    startLoc: 'Little Havana Substation', startLat: 25.7751, startLng: -80.2225,
    endLoc: 'Mercy Hospital', endLat: 25.7423, endLng: -80.2178
  },
  {
    name: 'Miami High School Shelter ➔ Jackson Memorial',
    startLoc: 'Miami High School Shelter', startLat: 25.7745, startLng: -80.2295,
    endLoc: 'Jackson Memorial Hospital', endLat: 25.7904, endLng: -80.2096
  },
  {
    name: 'Brickell Substation ➔ Mount Sinai Clinic',
    startLoc: 'MPD Brickell Substation', startLat: 25.7601, startLng: -80.1931,
    endLoc: 'Mount Sinai Medical Center', endLat: 25.8142, endLng: -80.1415
  }
];

export const Routes: React.FC = () => {
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  
  // Trip Selection States
  const [selectedTripIdx, setSelectedTripIdx] = useState<number>(0);
  const [routes, setRoutes] = useState<any[]>([]);
  const [activeRouteIdx, setActiveRouteIdx] = useState<number>(0);

  const handleCalculateRoutes = async (tripIdx: number) => {
    setLoading(true);
    setSelectedTripIdx(tripIdx);
    
    const trip = presetTrips[tripIdx];
    try {
      const data = await apiService.getRoutes(trip.startLat, trip.startLng, trip.endLat, trip.endLng);
      setRoutes(data);
      setActiveRouteIdx(0);
      showToast('ROUTING COMPUTED', `Analyzed 3 route options for: ${trip.name}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('ROUTING ERROR', 'Failed to fetch safety route coordinates.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Run default calculation
    handleCalculateRoutes(0);
  }, []);

  const activeTrip = presetTrips[selectedTripIdx];
  const activeRoute = routes[activeRouteIdx] || null;

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full pb-20 lg:pb-6 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white">Safe Route Intelligence</h1>
          <p className="text-xs text-slate-400">Risk-avoidance navigation comparing flood levels and closures</p>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-1 border border-slate-800 rounded font-mono text-emerald-400">
          DEMO ROUTING MODE
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Inputs & Route list (1/3 Width) */}
        <div className="space-y-5">
          
          {/* Trip Selectors */}
          <div className="glass-panel p-4 space-y-3.5">
            <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block">Select Corridor Mission</span>
            
            <div className="flex flex-col gap-2">
              {presetTrips.map((trip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCalculateRoutes(idx)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex justify-between items-center ${
                    selectedTripIdx === idx 
                      ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold' 
                      : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                  disabled={loading}
                >
                  <span className="truncate">{trip.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-1.5" />
                </button>
              ))}
            </div>

            {/* Faux coordinates display */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-[10px] font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" /> START: {activeTrip.startLoc} ({activeTrip.startLat.toFixed(4)}, {activeTrip.startLng.toFixed(4)})
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" /> END: {activeTrip.endLoc} ({activeTrip.endLat.toFixed(4)}, {activeTrip.endLng.toFixed(4)})
              </div>
            </div>
          </div>

          {/* Route Option List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block px-1">Route Selections</span>
            
            {loading ? (
              <div className="space-y-2">
                <div className="h-20 bg-slate-900 animate-pulse rounded-lg" />
                <div className="h-20 bg-slate-900 animate-pulse rounded-lg" />
              </div>
            ) : (
              routes.map((route, idx) => {
                const isSelected = activeRouteIdx === idx;
                const strokeColor = 
                  route.type === 'lowest_risk' ? 'border-l-emerald-500' : 
                  route.type === 'emergency' ? 'border-l-blue-500' : 'border-l-red-500';

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveRouteIdx(idx)}
                    className={`w-full glass-panel p-3.5 text-left border-l-4 ${strokeColor} hover:bg-slate-900/35 transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected ? 'border-slate-700 bg-slate-900/40 glow-blue' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white leading-tight">{route.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                        route.safetyRating === 'clear' ? 'bg-emerald-950 text-emerald-400' :
                        route.safetyRating === 'monitored' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {route.safetyRating}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                      {route.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-950/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {route.durationMinutes} min
                      </span>
                      <span>{route.distanceKm} km</span>
                      <span className={route.riskScore >= 75 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                        Risk: {route.riskScore}/100
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Map Right Column (2/3 Width) */}
        <div className="xl:col-span-2 h-[450px] sm:h-[550px] xl:h-[620px] flex flex-col gap-2">
          <div className="flex justify-between items-center px-1 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-blue-500" /> Geographic Path Overlay
            </span>
            <span className="text-[10px] text-slate-500 italic">Route coordinates are simulated</span>
          </div>
          <MapPanel
            incidents={[]}
            riskZones={[]}
            resources={[]}
            userRoute={activeRoute}
          />
        </div>

      </div>

      <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-500 leading-relaxed max-w-4xl">
        <strong>SAFETY NOTICE:</strong> Safe routing calculations are running under demonstration modes. These simulation calculations are mapped using structural elevation indices and active hazard reports inside the local database context. Always cross-check with local traffic authorities before attempting passage during real floods.
      </div>

    </div>
  );
};
export default Routes;
