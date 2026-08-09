import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { NotificationCenter } from './NotificationCenter';
import { 
  ShieldAlert, 
  Map, 
  AlertOctagon, 
  BrainCircuit, 
  TrendingUp, 
  Navigation, 
  HeartHandshake, 
  FileEdit, 
  Info, 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  Menu, 
  Home
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSimulationActive, setSimulationActive, triggerTick, simulationTime } = useSimulation();
  const location = useLocation();

  // If on landing page, don't show the dashboard shell layout
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  const navItems = [
    { name: 'EOC Home', path: '/dashboard', icon: Map },
    { name: 'Incident Explorer', path: '/incidents', icon: AlertOctagon },
    { name: 'Copilot Assistant', path: '/copilot', icon: BrainCircuit },
    { name: 'AI Risk Engine', path: '/risk', icon: TrendingUp },
    { name: 'Safe Routes', path: '/routes', icon: Navigation },
    { name: 'EOC Resources', path: '/resources', icon: HeartHandshake },
    { name: 'Hazard Analytics', path: '/analytics', icon: FileEdit },
    { name: 'Report Incident', path: '/report', icon: Zap },
    { name: 'About & Limits', path: '/about', icon: Info },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      
      {/* 1. LEFT SIDEBAR - DESKTOP ONLY (>= 1024px) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900 bg-opacity-40 shrink-0">
        {/* Logo Shield Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2.5">
          <div className="p-2 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-400 glow-blue">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm uppercase tracking-wider text-slate-100 font-sans">CrisisMind AI</span>
            <span className="text-[9px] text-blue-400 font-mono tracking-wider">COMMAND CENTER v2.0</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-all mb-4"
          >
            <Home className="w-4 h-4 text-slate-500" /> Landing Portal
          </Link>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 glow-blue' 
                      : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/35'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* legal disclaimer footer in sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 bg-opacity-20 text-[10px] text-slate-500 leading-relaxed leading-normal">
          Decision-support dashboard. Information is simulated for hackathon evaluation.
        </div>
      </aside>

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 bg-opacity-30 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
          {/* Left panel: Hamburger menu icon & Mobile Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden p-1.5 bg-blue-900/20 border border-blue-500/40 rounded-lg text-blue-400 glow-blue">
              <ShieldAlert className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm uppercase tracking-wider text-slate-100 lg:hidden">CrisisMind</span>
                <span className="hidden sm:inline-block font-extrabold text-[11px] tracking-wider uppercase bg-blue-950 text-blue-400 px-2 py-0.5 border border-blue-800/60 rounded">
                  LIVE EMERGENCY INTELLIGENCE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="font-mono text-slate-300">{simulationTime || '00:00:00'}</span>
                <span className="hidden sm:inline">• Miami EOC Active</span>
              </div>
            </div>
          </div>

          {/* Right panel: Simulation Controls + Notifications */}
          <div className="flex items-center gap-3.5">
            {/* Simulation controls */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800/80 rounded-lg p-1">
              <div className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono shrink-0">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSimulationActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                <span className="text-slate-400 hidden md:inline">SIM:</span>
                <span className={isSimulationActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isSimulationActive ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
              <button
                onClick={() => setSimulationActive(!isSimulationActive)}
                className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${isSimulationActive ? 'text-amber-400' : 'text-emerald-400'}`}
                title={isSimulationActive ? 'Pause Event Simulation' : 'Resume Event Simulation'}
              >
                {isSimulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={triggerTick}
                className="p-1.5 rounded hover:bg-slate-800 text-blue-400 transition-colors"
                title="Force Next Simulation Tick"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Center alerts bell */}
            <NotificationCenter />
          </div>
        </header>

        {/* WORKSPACE PAGES (SCROLLABLE VIEWPORT) */}
        <main className="flex-1 overflow-y-auto min-w-0 pb-16 lg:pb-0 bg-slate-950 relative">
          {children}
        </main>

        {/* 3. MOBILE BOTTOM NAVIGATION (<= 1024px) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/90 flex items-center justify-around px-2 z-[40]">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            // Short names for tabs
            let tabName = item.name.split(' ')[0];
            if (item.name === 'EOC Home') tabName = 'Map';
            if (item.name === 'Copilot Assistant') tabName = 'Copilot';
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 gap-1 text-[10px] font-medium transition-all ${
                    isActive 
                      ? 'text-blue-400 font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{tabName}</span>
              </NavLink>
            );
          })}
          {/* More option link routing to reports */}
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 gap-1 text-[10px] font-medium transition-all ${
                isActive ? 'text-blue-400 font-bold' : 'text-slate-400'
              }`
            }
          >
            <Zap className="w-5 h-5" />
            <span>Report</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
export default Layout;
