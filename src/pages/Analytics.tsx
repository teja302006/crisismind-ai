import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { LoadingSkeleton } from '../components/UIElements';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Cell, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileEdit, 
  TrendingUp, 
  Sparkles, 
  AlertCircle, 
  BrainCircuit, 
  BarChart3 
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<number>(7);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalytics(timeframe);
      setAnalyticsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  // Color mappings matching EOC severity
  const COLORS = {
    critical: '#ef4444',
    high: '#f97316',
    moderate: '#f59e0b',
    low: '#10b981',
    accent: '#3b82f6',
    indigo: '#6366f1'
  };

  const getSeverityColor = (name: string) => {
    const n = name.toLowerCase();
    if (n === 'critical') return COLORS.critical;
    if (n === 'high') return COLORS.high;
    if (n === 'moderate') return COLORS.moderate;
    return COLORS.low;
  };

  if (loading || !analyticsData) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
        </div>
        <LoadingSkeleton className="h-[400px]" />
      </div>
    );
  }

  const { categories, severities, timeSeries, summary } = analyticsData;

  // Custom tooltips
  const customTooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '11px'
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full pb-20 lg:pb-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white">EOC Hazard Analytics</h1>
          <p className="text-xs text-slate-400">Statistical summaries and trends of emergency signals</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 shrink-0">
          {[
            { label: '24 HOURS', value: 1 },
            { label: '7 DAYS', value: 7 },
            { label: '30 DAYS', value: 30 },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                timeframe === opt.value 
                  ? 'bg-blue-600 text-white font-black' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC INSIGHT SUMMARY BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-4 flex gap-3.5 items-start">
          <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Incident Rate Spike</span>
            <span className="text-lg font-bold text-white">+{timeframe === 1 ? '12%' : timeframe === 7 ? '18%' : '24%'} increase</span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Spike is driven primarily by storm surge events flooding low elevation canals.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 flex gap-3.5 items-start">
          <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">AI Prediction Accuracy</span>
            <span className="text-lg font-bold text-white">{summary.aiConfidence}% Average</span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Confidence levels calculated across {summary.totalIncidents} active and resolved signals.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 flex gap-3.5 items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Highest Threat Density</span>
            <span className="text-lg font-bold text-white">Brickell Corridor</span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Focal zone represents {Math.round((summary.criticalIncidents / (summary.totalIncidents || 1)) * 100)}% of critical-rated hazards.
            </p>
          </div>
        </div>

      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* A. Time series comparison (Incidents vs Reports) */}
        <div className="glass-panel p-4.5 space-y-4">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block border-b border-slate-850 pb-2">
            Incoming Alarms over Time
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Incidents" stroke={COLORS.critical} strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Reports" stroke={COLORS.accent} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Incident categories bar chart */}
        <div className="glass-panel p-4.5 space-y-4">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block border-b border-slate-850 pb-2">
            Disaster Category Distribution
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} interval={0} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="value" name="Alarms" fill={COLORS.indigo} radius={[4, 4, 0, 0]}>
                  {categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.indigo : COLORS.accent} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* C. Severity ratios (Pie Chart) */}
        <div className="glass-panel p-4.5 space-y-4">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block border-b border-slate-850 pb-2">
            Threat Severity Distribution
          </span>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severities}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={9}
                >
                  {severities.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={getSeverityColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. Zone Risk Comparisons */}
        <div className="glass-panel p-4.5 space-y-4">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block border-b border-slate-850 pb-2">
            Zone Risk Score Index
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Brickell', Score: 91 },
                  { name: 'Downtown', Score: 85 },
                  { name: 'River Industrial', Score: 89 },
                  { name: 'Coconut Grove', Score: 82 },
                  { name: 'Little Havana', Score: 78 },
                ]}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={9} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="Score" fill={COLORS.accent} radius={[0, 4, 4, 0]}>
                  <Cell fill={COLORS.critical} />
                  <Cell fill={COLORS.high} />
                  <Cell fill={COLORS.critical} />
                  <Cell fill={COLORS.high} />
                  <Cell fill={COLORS.high} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Analytics;
