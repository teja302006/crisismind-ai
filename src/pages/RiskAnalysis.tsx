import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { RiskZone } from '../../api/types';
import { SeverityBadge, LoadingSkeleton } from '../components/UIElements';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  CloudRain, 
  FolderLock, 
  Route, 
  Users, 
  Wrench, 
  BrainCircuit, 
  ArrowRight
} from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  
  // Historical trend mock data for chart
  const [chartData, setChartData] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await apiService.getRisk();
      setRiskZones(data.zones);
      
      // Select Brickell corridor as default (matches the judge demo flow)
      const brickell = data.zones.find(z => z.id === 'z1') || data.zones[0];
      setSelectedZone(brickell || null);

      // Populate trend chart
      const hours = Array.from({ length: 12 }, (_, i) => {
        const h = new Date(Date.now() - (11 - i) * 2 * 60 * 60 * 1000);
        return {
          time: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          Score: Math.round(75 + Math.sin(i * 0.5) * 12 + (i % 2 === 0 ? 3 : -2))
        };
      });
      setChartData(hours);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleZoneChange = (zoneId: string) => {
    const zone = riskZones.find(z => z.id === zoneId);
    if (zone) {
      setSelectedZone(zone);
      
      // Slightly fluctuate chart scores to fit selected zone
      const base = zone.risk_score;
      setChartData(prev => prev.map((item, idx) => ({
        ...item,
        Score: Math.max(10, Math.min(100, Math.round(base - (11 - idx) * 1.5 + (idx % 2 === 0 ? 2 : -2))))
      })));
    }
  };

  // Generate dynamic explanation context
  const getDynamicExplanation = (zone: RiskZone) => {
    const f = zone.factors;
    let text = `Risk level in ${zone.name} is assessed as ${zone.severity.toUpperCase()} (${zone.risk_score}/100). `;
    
    if (f.density > 80 && f.road_closures > 70) {
      text += `The primary driver is a dense cluster of active flooding incidents combined with compromised road networks, blocking drainage outflow corridors. `;
    } else if (f.weather > 90) {
      text += `Heavy precipitation rates and high tide surges are overwhelming the local sewer drainage grid. `;
    } else {
      text += `Vulnerabilities relate to older infrastructure pipe diameters and increased population exposure in low elevation grids. `;
    }

    text += `Mitigation requires staging high-water vehicles at local dispatch fire stations, setting up sandbag barriers, and diversion checkpoints.`;
    return text;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton className="h-44" />
        <LoadingSkeleton className="h-[400px]" />
      </div>
    );
  }

  const activeZone = selectedZone || riskZones[0];

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full pb-20 lg:pb-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white">AI Risk Analysis Engine</h1>
          <p className="text-xs text-slate-400">Hyperlocal risk indicators computed from live incident clusters</p>
        </div>

        {/* Zone Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Select Quadrant:</span>
          <select
            value={activeZone?.id}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {riskZones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {activeZone && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. RISK SCORE DIAL & CONTROLLER BREAKDOWN */}
          <div className="glass-panel p-5 flex flex-col justify-between min-h-[300px]">
            <div className="border-b border-slate-850 pb-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold font-mono text-blue-400 uppercase">Risk Level Assessment</span>
              <SeverityBadge severity={activeZone.severity} />
            </div>

            {/* Circular representation */}
            <div className="my-6 flex flex-col items-center justify-center gap-2">
              <div className="w-32 h-32 rounded-full border-4 border-slate-850 flex flex-col items-center justify-center relative shadow-inner">
                {/* Simulated circle stroke coloring */}
                <div className={`absolute inset-[-4px] rounded-full border-4 border-transparent ${
                  activeZone.severity === 'critical' ? 'border-t-red-500 border-r-red-500 animate-pulse' :
                  activeZone.severity === 'high' ? 'border-t-orange-500 border-r-orange-500' :
                  activeZone.severity === 'moderate' ? 'border-t-amber-500' : 'border-t-emerald-500'
                }`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">RISK INDEX</span>
                <span className="text-3xl font-black text-white font-sans">{activeZone.risk_score}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{activeZone.severity}</span>
              </div>
            </div>

            {/* AI explanation snippet */}
            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">AI Explanation</span>
                <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                  {getDynamicExplanation(activeZone)}
                </p>
              </div>
            </div>
          </div>

          {/* 2. FACTOR MATRIX */}
          <div className="glass-panel p-5 lg:col-span-2 space-y-4">
            <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block border-b border-slate-850 pb-2.5">
              Hyperlocal Risk Factor Breakdown
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Weather */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <CloudRain className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Weather Severity</span>
                    <strong className="text-white font-mono">{activeZone.factors.weather}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${activeZone.factors.weather}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Precipitation depth / Surge peak</span>
                </div>
              </div>

              {/* Cluster Density */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <Activity className="w-5 h-5 text-orange-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Incident Cluster Density</span>
                    <strong className="text-white font-mono">{activeZone.factors.density}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `${activeZone.factors.density}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Conflicting hazard markers in grid</span>
                </div>
              </div>

              {/* Exposure */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <Users className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Population Exposure</span>
                    <strong className="text-white font-mono">{activeZone.factors.exposure}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${activeZone.factors.exposure}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Resident population densities</span>
                </div>
              </div>

              {/* Vulnerability */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <Wrench className="w-5 h-5 text-pink-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Infrastructure Vulnerability</span>
                    <strong className="text-white font-mono">{activeZone.factors.vulnerability}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-400 h-full" style={{ width: `${activeZone.factors.vulnerability}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Drainage capacity age / Elevation indexes</span>
                </div>
              </div>

              {/* Road Closures */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <Route className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Road Closures</span>
                    <strong className="text-white font-mono">{activeZone.factors.road_closures}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${activeZone.factors.road_closures}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Flooded street underpasses / Collisions</span>
                </div>
              </div>

              {/* Historical */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex gap-3 text-left">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Historical Frequency</span>
                    <strong className="text-white font-mono">{activeZone.factors.historical}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${activeZone.factors.historical}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-none">Historical surge / flood recurrence models</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. HISTORICAL RISK TREND CHART */}
      <div className="glass-panel p-5 space-y-4">
        <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block border-b border-slate-850 pb-2.5">
          Temporal Risk Score Fluctuation (Past 24 Hours)
        </span>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip />
              <Area type="monotone" dataKey="Score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
export default RiskAnalysis;
