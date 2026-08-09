import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Database, Map, AlertOctagon } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto min-h-full pb-20 lg:pb-6 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">System Architecture & Methodologies</h1>
          <p className="text-xs text-slate-400">Documentation of data pipelines, technology stack, and safety disclaimers</p>
        </div>
      </div>

      {/* 1. SAFETY POSITIONING BLOCK */}
      <div className="p-4 bg-red-950/20 border border-red-900/35 rounded-xl flex gap-3.5 items-start">
        <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-red-300 font-mono tracking-wider uppercase">SAFETY NOTICE & DISCLAIMER</span>
          <p className="text-[11px] text-slate-400 leading-relaxed leading-normal">
            CrisisMind AI is designed strictly as a hackathon prototype and tactical decision-support dashboard. 
            **This system is not an official public safety communication network and must not be used to direct citizens during actual disasters.** 
            The routing engines, evacuation zones, and risk indicators display simulated parameters representing a coastal Miami storm surge scenario. 
            Always comply with official directions from civil defense, local municipal alerts, and police dispatch.
          </p>
        </div>
      </div>

      {/* 2. ARCHITECTURE PIPELINE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">AI Layer Fail-safes</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed leading-normal">
            CrisisMind AI implements a strict server-side AI provider design. If the preferred generative AI backend (**Google Gemini 1.5 Flash**) is offline or a private api key is absent, the system instantly hot-swaps to the local **Demo AI Reasoning Engine**. 
            This ensures critical EOC triage logic remains 100% functional, parsing coordinates and densities locally without generating application failures or blank screens.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Dual Database Engine</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed leading-normal">
            To accommodate Vercel deployment environments and rapid local hackathon evaluations, our database layer automatically connects to a **Supabase PostgreSQL** cluster when credentials are configured. In their absence, a persistent memory-based service initializes, tracking citizen report submissions, compiling coordinates, and dynamically adjusting grid indices.
          </p>
        </div>

      </div>

      {/* 3. CAPABILITIES INDEX */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-bold font-mono text-blue-400 uppercase tracking-widest block border-b border-slate-850 pb-2.5">
          EOC Technical Stack Specifications
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-1 p-2 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="font-semibold text-slate-200 block">Frontend Framework</span>
            <span className="text-slate-400 block leading-normal">React, TypeScript, Vite compilation, Tailwind CSS EOC dark theme</span>
          </div>

          <div className="space-y-1 p-2 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="font-semibold text-slate-200 block">Geospatial Overlay</span>
            <span className="text-slate-400 block leading-normal">Leaflet 1.9.4 integration with custom SVG DivIcon markers and vector zones</span>
          </div>

          <div className="space-y-1 p-2 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="font-semibold text-slate-200 block">Express Backend</span>
            <span className="text-slate-400 block leading-normal">Node API, cors, express body parsers, type-safe router schemas</span>
          </div>

          <div className="space-y-1 p-2 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="font-semibold text-slate-200 block">Vercel Serverless Ready</span>
            <span className="text-slate-400 block leading-normal">Single-router file bundling matching Vercel serverless functions specs</span>
          </div>

        </div>
      </div>

    </div>
  );
};
export default About;
