import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Incident, EmergencyResource } from '../../api/types';
import { SeverityBadge, StatusBadge, LoadingSkeleton, EmptyState } from '../components/UIElements';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Compass, 
  AlertOctagon, 
  BrainCircuit, 
  Clock, 
  HeartHandshake, 
  Info,
  Calendar,
  X
} from 'lucide-react';

export const Incidents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Detail Drawer State
  const [drawerIncident, setDrawerIncident] = useState<Incident | null>(null);

  const loadData = async () => {
    try {
      const [incData, resData] = await Promise.all([
        apiService.getIncidents(),
        apiService.getResources()
      ]);
      setIncidents(incData);
      setResources(resData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let results = [...incidents];

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      results = results.filter(i => 
        i.code.toLowerCase().includes(q) || 
        i.location.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'ALL') {
      results = results.filter(i => i.type.toUpperCase() === typeFilter.toUpperCase());
    }

    if (severityFilter !== 'ALL') {
      results = results.filter(i => i.severity.toLowerCase() === severityFilter.toLowerCase());
    }

    if (statusFilter !== 'ALL') {
      results = results.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredIncidents(results);
  }, [incidents, search, typeFilter, severityFilter, statusFilter]);

  const hazardTypes = [
    'ALL', 'Flood', 'Fire', 'Road Accident', 'Cyclone', 'Landslide', 'Industrial Accident', 'Extreme Heat', 'Infrastructure Failure'
  ];

  // Helper to find closest resources to the selected incident
  const getClosestResources = (inc: Incident) => {
    return resources
      .map(res => {
        // Simple distance estimate
        const dist = Math.sqrt(Math.pow(res.latitude - inc.latitude, 2) + Math.pow(res.longitude - inc.longitude, 2)) * 111;
        return { ...res, calculatedDist: Math.round(dist * 10) / 10 };
      })
      .sort((a, b) => a.calculatedDist - b.calculatedDist)
      .slice(0, 3);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 relative min-h-full pb-20 lg:pb-6 flex flex-col">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 shrink-0">
        <div className="text-left">
          <h1 className="text-xl font-extrabold text-white">Incident Explorer</h1>
          <p className="text-xs text-slate-400">Search and filter incoming emergency dispatch signals</p>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-1 border border-slate-800 rounded font-mono text-slate-400">
          DATA_TOTAL: {incidents.length} logs
        </span>
      </div>

      {/* FILTER PANEL */}
      <div className="glass-panel p-4 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Code, Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Hazard Type filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono shrink-0">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none"
          >
            {hazardTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono shrink-0">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">ALL</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">ALL</option>
            <option value="active">Active</option>
            <option value="monitored">Monitored</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

      </div>

      {/* LIST GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState message="No incident matches found. Try widening your search filters." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {filteredIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => setDrawerIncident(inc)}
              className="glass-panel p-4 text-left hover:border-slate-700/80 cursor-pointer flex flex-col justify-between min-h-[170px] transition-all hover:bg-slate-900/30 group"
            >
              <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">{inc.code}</span>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{inc.type}</h3>
                </div>
                <SeverityBadge severity={inc.severity} />
              </div>

              <p className="text-[11px] text-slate-400 leading-normal my-3.5 line-clamp-2">
                {inc.description}
              </p>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-auto pt-2 border-t border-slate-900">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span className="truncate max-w-[120px]">{inc.location}</span>
                </span>
                <span className="font-mono">
                  {new Date(inc.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL SLIDE-OUT DRAWER OVERLAY */}
      {drawerIncident && (
        <>
          {/* Backdrop blur clickoff */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[100] transition-opacity duration-300"
            onClick={() => setDrawerIncident(null)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl z-[101] flex flex-col justify-between overflow-hidden transition-transform duration-300 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">{drawerIncident.code} • DETECTED LOG</span>
                <h2 className="text-base font-bold text-white">{drawerIncident.type}</h2>
              </div>
              <button
                onClick={() => setDrawerIncident(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="p-5 flex-1 overflow-y-auto space-y-6 text-left">
              
              {/* Severity & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block mb-1">Threat Level</span>
                  <SeverityBadge severity={drawerIncident.severity} />
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block mb-1">EOC status</span>
                  <StatusBadge status={drawerIncident.status} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">Incident Summary</span>
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs leading-relaxed text-slate-300">
                  <span className="font-semibold text-white block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {drawerIncident.location}
                  </span>
                  {drawerIncident.description}
                </div>
              </div>

              {/* Spatial proximity metrics */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">Spatial Intelligence</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 border border-slate-800 bg-slate-950/20 rounded-lg flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500">Incident Lat/Lng</span>
                    <span className="font-mono text-slate-300 font-semibold">{drawerIncident.latitude.toFixed(5)}, {drawerIncident.longitude.toFixed(5)}</span>
                  </div>
                  <div className="p-2.5 border border-slate-800 bg-slate-950/20 rounded-lg flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500">Affected Buffer Radius</span>
                    <span className="text-slate-300 font-semibold">
                      {drawerIncident.severity === 'critical' ? '1,200m' : drawerIncident.severity === 'high' ? '800m' : '400m'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI confidence gauge */}
              <div className="p-3 border border-slate-800 bg-slate-950/30 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">AI Fusion Confidence</span>
                    <span className="text-[9px] text-slate-500">Aggregated signal accuracy</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-blue-400 font-mono">{drawerIncident.confidence}%</span>
                </div>
              </div>

              {/* Nearby resources list */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">Closest Emergency Resources</span>
                <div className="space-y-2">
                  {getClosestResources(drawerIncident).map(res => (
                    <div key={res.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-slate-200 truncate">{res.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{res.type}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold text-slate-400">{res.calculatedDist} km</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                          res.availability === 'available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {res.availability.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline simulation */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">Event Timeline</span>
                <div className="border-l border-slate-800 pl-4 space-y-3.5 text-xs text-left">
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(new Date(drawerIncident.created_at).getTime() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="font-semibold text-slate-300">Initial telemetry report logged</p>
                    <p className="text-[10px] text-slate-500 leading-normal">Citizen phone signal triangulation complete.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(drawerIncident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="font-semibold text-slate-300">AI triage confirmation</p>
                    <p className="text-[10px] text-slate-500 leading-normal">Assigned severity: {drawerIncident.severity.toUpperCase()}. Confirmed code {drawerIncident.code}.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[10px] text-slate-500 italic text-center">
              All details above are simulated for demonstration.
            </div>

          </div>
        </>
      )}

    </div>
  );
};
export default Incidents;
