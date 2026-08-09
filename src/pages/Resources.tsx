import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { EmergencyResource } from '../../api/types';
import { MapPanel } from '../components/MapPanel';
import { LoadingSkeleton, EmptyState } from '../components/UIElements';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Resources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<EmergencyResource[]>([]);
  
  // Category Filter
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const loadData = async () => {
    try {
      const data = await apiService.getResources();
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Categories
  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(r => r.type.toUpperCase() === activeCategory.toUpperCase()));
    }
  }, [resources, activeCategory]);

  const categories = ['ALL', 'hospital', 'fire station', 'police station', 'shelter', 'collection point'];

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hospital': return 'text-blue-400 border-blue-900/30 bg-blue-950/20';
      case 'fire station': return 'text-pink-400 border-pink-900/30 bg-pink-950/20';
      case 'police station': return 'text-purple-400 border-purple-900/30 bg-purple-950/20';
      case 'shelter': return 'text-cyan-400 border-cyan-900/30 bg-cyan-950/20';
      default: return 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full pb-20 lg:pb-6 text-left flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white">Emergency Resources</h1>
          <p className="text-xs text-slate-400">Locate and monitor capacities of critical rescue assets</p>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-1 border border-slate-800 rounded font-mono text-slate-400">
          RESOURCES_TOTAL: {resources.length} active
        </span>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              activeCategory === cat 
                ? 'bg-blue-600 border-blue-500 text-white glow-blue' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'ALL ASSETS' : cat}
          </button>
        ))}
      </div>

      {/* MAP & LIST GRID SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
        
        {/* LIST PANEL (1/3 Width) */}
        <div className="xl:col-span-1 flex flex-col gap-3 overflow-y-auto max-h-[350px] xl:max-h-[600px] pr-1">
          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton className="h-24" />
              <LoadingSkeleton className="h-24" />
            </div>
          ) : filteredResources.length === 0 ? (
            <EmptyState message="No resources matching category." />
          ) : (
            filteredResources.map(res => (
              <div
                key={res.id}
                className="glass-panel p-3.5 flex flex-col justify-between gap-2 text-left"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{res.name}</h3>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase border w-fit mt-1 ${getTypeColor(res.type)}`}>
                      {res.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    res.availability === 'available' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                    res.availability === 'limited' ? 'bg-amber-950/20 text-amber-400 border-amber-900/30' :
                    'bg-red-950/20 text-red-400 border-red-900/30 animate-pulse'
                  }`}>
                    {res.availability}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono space-y-1 mt-1 border-t border-slate-950/60 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacitance:</span>
                    <span className="text-slate-200">{res.capacity || 'N/A'}</span>
                  </div>
                  {res.contact_phone && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Dispatch Phone:</span>
                      <a href={`tel:${res.contact_phone}`} className="text-blue-400 hover:underline">{res.contact_phone}</a>
                    </div>
                  )}
                  {res.distance && (
                    <div className="flex justify-between text-slate-500">
                      <span>Est. Proximity:</span>
                      <span className="text-slate-300">{res.distance} km</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MAP PANEL (2/3 Width) */}
        <div className="xl:col-span-2 h-[350px] sm:h-[450px] xl:h-[600px] flex flex-col gap-2">
          <div className="flex justify-between items-center px-1 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" /> Resource Deployment Locations
            </span>
            <span className="text-[10px] text-slate-500 italic">Availability metrics update live</span>
          </div>
          <MapPanel
            incidents={[]}
            riskZones={[]}
            resources={filteredResources}
          />
        </div>

      </div>

    </div>
  );
};
export default Resources;
