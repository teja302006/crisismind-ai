import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Map, 
  BrainCircuit, 
  Navigation, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* Decorative Glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-indigo-950/15 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-400 glow-blue">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg uppercase tracking-wider text-white">CrisisMind AI</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#limitations" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Safety Position</a>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg glow-blue transition-all"
          >
            Enter Command Center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10 flex-1">
        <div className="flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-950 bg-blue-950/30 text-blue-400 text-xs font-semibold tracking-wide w-fit">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> 2026 Emergency AI Hackathon Entry
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight">
            See the crisis <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              before it becomes a catastrophe.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed leading-normal max-w-lg">
            An AI-powered hyperlocal emergency intelligence platform that transforms fragmented citizen signals, hazard reports, and infrastructure data into actionable decision-support insights.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg glow-blue transition-all"
            >
              Enter Command Center <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <a
              href="#solution"
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Hero Visualizer */}
        <div className="w-full aspect-[4/3] max-w-lg mx-auto relative rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md p-3.5 shadow-2xl flex flex-col justify-between overflow-hidden group">
          <div className="absolute inset-0 bg-slate-950/40 rounded-xl pointer-events-none border border-slate-800" />
          
          {/* Header */}
          <div className="flex justify-between items-center z-10 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-mono tracking-wider text-red-500 uppercase font-bold">SIMULATION ACTIVE</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">CORRIDOR_GRID: 25.7617, -80.1918</span>
          </div>

          {/* Map mockup preview lines and coordinates */}
          <div className="flex-1 flex flex-col justify-center items-center gap-3 relative py-6">
            <div className="w-28 h-28 border border-red-500/25 bg-red-500/5 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 border border-red-500/40 bg-red-500/10 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-bounce" />
              </div>
            </div>
            
            {/* Visual alert text logs */}
            <div className="text-center z-10">
              <span className="text-[11px] font-mono font-bold text-slate-300 block">Brickell Flood Corridor</span>
              <span className="text-xs text-red-400 font-bold font-mono">RISK SCORE: 91/100 (CRITICAL)</span>
            </div>

            {/* Faux nodes overlay */}
            <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-blue-500 glow-blue animate-pulse" />
            <div className="absolute bottom-10 right-16 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <div className="absolute top-1/2 right-12 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Faux analytics snippet */}
          <div className="z-10 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono">
            <div className="text-slate-400">
              Active Alarms: <span className="text-red-400 font-bold">18</span>
            </div>
            <div className="text-slate-400">
              AI Confidence: <span className="text-blue-400 font-bold">95%</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PROBLEM & THE SOLUTION */}
      <section id="solution" className="w-full border-t border-slate-900 bg-slate-900/20 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          
          {/* Problem */}
          <div className="flex flex-col gap-5 text-left">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">The Problem</h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Fragmented, Delayed Signals Cost Lives</h2>
            <p className="text-slate-400 text-sm leading-relaxed leading-normal">
              During floods, extreme weather, and major traffic accidents, information is scattered across phone reports, social media, spatial telemetry, and environmental sensors. Emergency personnel and citizens suffer from information gaps, leading to congested escape paths, compromised resources, and delayed reactions.
            </p>
            <div className="space-y-3 mt-2 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Isolated reports fail to map the structural boundaries of a crisis.</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Standard route navigation redirects motorists directly into flooded zones.</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>First responders lack context on WHY an area's risk score is spiking.</span>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="flex flex-col gap-5 text-left">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">The Solution</h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Unified Telemetry & AI Risk Analysis</h2>
            <p className="text-slate-400 text-sm leading-relaxed leading-normal">
              CrisisMind AI acts as a smart operations layer. It pulls together citizen reports, geo-coordinates, and infrastructure metrics, calculating a live risk profile. Emergency workers can ask the **CrisisMind Copilot** questions to extract reasoning, locate resources, and map safe escape paths.
            </p>
            <div className="space-y-3 mt-2 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>**Reactive Mapping**: Leaflet-driven visual coordinates of incidents and shelters.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>**Risk Engine**: 0-100 score driven by weather, density, and vulnerability.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>**CrisisMind Copilot**: Generative AI (Gemini) explaining why zones are critical.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW CRISISMIND WORKS (AI PIPELINE) */}
      <section className="w-full border-t border-slate-900 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI Intelligence Pipeline</span>
            <h2 className="text-3xl font-extrabold text-white">From Fragmented Signals to Life-Saving Decisions</h2>
          </div>

          {/* Pipeline flow steps cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass-panel p-5 text-left flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Signal Capture</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                Citizen incident reports, coordinates, and weather metrics are logged directly into the system database.
              </p>
            </div>

            <div className="glass-panel p-5 text-left flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Data Fusion</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                The platform groups nearby incidents into geographical risk corridors, resolving coordinates.
              </p>
            </div>

            <div className="glass-panel p-5 text-left flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Risk Scoring</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                The Risk Engine applies weight matrices evaluating weather, density, infrastructure age, and blockages.
              </p>
            </div>

            <div className="glass-panel p-5 text-left flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
                04
              </div>
              <h4 className="text-sm font-bold text-white">AI Copilot Explanation</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                Gemini translates math metrics into human-readable situation reports and recommends response paths.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* KEY CAPABILITIES */}
      <section className="w-full border-t border-slate-900 bg-slate-900/10 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Platform Features</span>
            <h2 className="text-3xl font-extrabold text-white">Full-Stack Command Capabilities</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <Map className="w-6 h-6 text-blue-400" />
              <h4 className="font-bold text-white">Interactive EOC Map</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                Render interactive risk zones, hospitals, fire rescue stations, and citizen reports on a Leaflet map tailored for EOC monitors.
              </p>
            </div>

            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
              <h4 className="font-bold text-white">CrisisMind Copilot</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                A server-side secure Gemini chatbot loaded with system coordinates and data contexts to answer emergency reasoning queries.
              </p>
            </div>

            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <h4 className="font-bold text-white">Hyperlocal Risk Matrix</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                A 0–100 risk score breakdown for weather, densities, exposures, closures, and structural weaknesses in real-time.
              </p>
            </div>

            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <Navigation className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-white">Safe Route Planner</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                Simulate path calculations comparing fastest highways, lowest flood risk pathways, and rescue access corridors.
              </p>
            </div>

            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <HeartHandshake className="w-6 h-6 text-pink-400" />
              <h4 className="font-bold text-white">Resource Allocation</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                Monitor hospitals, local shelters, fire stations, and supply points for occupancy, capacity limits, and statuses.
              </p>
            </div>

            <div className="glass-panel p-6 text-left flex flex-col gap-3.5">
              <Activity className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-white">Real-Time Simulation</h4>
              <p className="text-slate-400 text-xs leading-relaxed leading-normal">
                A simulated urban flood engine that ticks in the background to periodically update incidents, add mock reports, and change flags.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* LIMITATIONS & SAFETY WARNING */}
      <section id="limitations" className="w-full border-t border-slate-900 py-16 bg-red-950/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
          <h2 className="text-xl font-bold text-red-200">Mandatory Safety Positioning</h2>
          <p className="text-slate-400 text-xs leading-relaxed leading-normal max-w-2xl">
            CrisisMind AI is a **hackathon prototype** and decision-support modeling platform. It does NOT claim to replace, duplicate, or override official emergency services, government evacuation bulletins, local law enforcement, civil defense authorities, or professional medical care. 
          </p>
          <p className="text-[11px] text-slate-500 italic max-w-xl">
            All data shown in default viewports represents a simulated urban flood emergency. Never make real safety decisions based on dashboard metrics or simulated routes.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-900/80 py-8 bg-slate-950 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; 2026 CrisisMind AI. Built for the International Emergency AI Hackathon.</span>
          <div className="flex gap-4">
            <Link to="/dashboard" className="hover:text-slate-400">Launch Dashboard</Link>
            <span>•</span>
            <a href="#limitations" className="hover:text-slate-400">Safety Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
