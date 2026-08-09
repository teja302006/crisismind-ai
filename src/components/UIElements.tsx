import React from 'react';
import { LucideIcon, RefreshCw, AlertCircle } from 'lucide-react';

// --- SEVERITY BADGE ---
export const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const sev = severity.toLowerCase();
  const classes = 
    sev === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 
    sev === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
    sev === 'moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border inline-block ${classes}`}>
      {severity}
    </span>
  );
};

// --- STATUS BADGE ---
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const stat = status.toLowerCase();
  const classes = 
    stat === 'active' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
    stat === 'monitored' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
    stat === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
    'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border inline-block ${classes}`}>
      {status}
    </span>
  );
};

// --- METRIC CARD ---
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  description?: string;
  glow?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  description,
  glow = false
}) => {
  const trendColor = 
    trendDirection === 'up' ? 'text-red-400' : 
    trendDirection === 'down' ? 'text-emerald-400' : 'text-slate-400';

  return (
    <div className={`glass-panel p-4.5 flex flex-col justify-between h-full hover:border-slate-700/80 transition-all duration-300 ${glow ? 'border-red-900/30 bg-red-950/5' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <Icon className={`w-5 h-5 ${glow ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
      </div>
      <div className="mt-3.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-sans tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      {(description || glow) && (
        <span className="text-[10px] text-slate-500 mt-2 block line-clamp-1">
          {glow ? '⚠️ Action Required' : description}
        </span>
      )}
    </div>
  );
};

// --- LOADING SKELETON ---
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-32' }) => {
  return (
    <div className={`w-full bg-slate-900/40 border border-slate-800 rounded-xl animate-pulse flex flex-col p-4 gap-3 ${className}`}>
      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
      <div className="h-8 bg-slate-800 rounded w-2/3"></div>
      <div className="h-4 bg-slate-800 rounded w-full"></div>
    </div>
  );
};

// --- EMPTY STATE ---
export const EmptyState: React.FC<{ message?: string }> = ({ message = 'No data available.' }) => {
  return (
    <div className="glass-panel p-8 text-center flex flex-col items-center justify-center border-dashed">
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  );
};

// --- ERROR STATE ---
export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'An unexpected error occurred.',
  onRetry
}) => {
  return (
    <div className="glass-panel p-8 text-center flex flex-col items-center justify-center border-red-900/35 bg-red-950/5">
      <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
      <p className="text-xs text-slate-300 font-semibold mb-1">EOC Link Offline</p>
      <p className="text-[11px] text-slate-500 mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconnect
        </button>
      )}
    </div>
  );
};
