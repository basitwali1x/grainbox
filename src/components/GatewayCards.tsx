import React from 'react';
import { Headset, Shield, Activity, ArrowRight, CheckCircle2, PhoneCall, Mic, Layers, Database, Lock, Sliders, Volume2 } from 'lucide-react';
import { AppRoute } from '../types';

interface GatewayCardsProps {
  onSelectGateway: (route: AppRoute) => void;
}

export const GatewayCards: React.FC<GatewayCardsProps> = ({ onSelectGateway }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      
      {/* 1. AGENT LOGIN CARD */}
      <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/60 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1.5 overflow-hidden">
        {/* Top Glowing Edge on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div>
          {/* Card Header & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-md">
              <Headset className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono tracking-wider text-sky-400 bg-sky-950/80 border border-sky-800/40 px-2.5 py-1 rounded-full uppercase">
              WebRTC Station
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-2.5">
            Agent Login
          </h3>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Dedicated workstation portal for predictive and blended dialer agents. Connect your softphone, manage live customer interactions, view lead scripts, and record call dispositions.
          </p>

          {/* Capabilities Checklist */}
          <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>WebRTC & SIP Softphone auto-registration</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Predictive, Blended & Manual outbound modes</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Dynamic lead scripts, 3-way transfers & IVRs</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href="/login?role=agent"
            onClick={(e) => {
              e.preventDefault();
              onSelectGateway('login-agent');
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-sky-600/30 group/btn"
          >
            <span>Launch Agent Console</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
          <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Direct Path: <code className="text-sky-300">/login?role=agent</code>
          </p>
        </div>
      </div>

      {/* 2. ADMIN LOGIN CARD */}
      <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 overflow-hidden">
        {/* Top Glowing Edge on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div>
          {/* Card Header & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/40 px-2.5 py-1 rounded-full uppercase">
              Management Suite
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2.5">
            Admin Login
          </h3>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Full enterprise telecommunications administration console. Orchestrate campaigns, configure user groups, manage carrier SIP trunks, audit agent performance, and monitor real-time dial screens.
          </p>

          {/* Capabilities Checklist */}
          <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real-Time Main Screen & Agent Barge-in</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Campaign pacing, list hopper & drop-rate tuning</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Carrier SIP trunks, DIDs, IVR call trees & security</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href="/login?role=admin"
            onClick={(e) => {
              e.preventDefault();
              onSelectGateway('login-admin');
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700/80 hover:bg-indigo-600 text-slate-100 hover:text-white font-semibold text-sm transition-all duration-200 border border-slate-600 hover:border-indigo-500 shadow-lg shadow-indigo-900/20 group/btn"
          >
            <span>Admin Management Portal</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
          <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Direct Path: <code className="text-indigo-300">/login?role=admin</code>
          </p>
        </div>
      </div>

      {/* 3. DASHBOARD RECORDINGS CARD */}
      <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1.5 overflow-hidden">
        {/* Top Glowing Edge on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div>
          {/* Card Header & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-md">
              <Activity className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono tracking-wider text-teal-400 bg-teal-950/80 border border-teal-800/40 px-2.5 py-1 rounded-full uppercase">
              Audio & Analytics
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors mb-2.5">
            Dashboard Recordings
          </h3>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Unified audio repository, QA monitoring, and compliance log analytics. Listen to high-fidelity call recordings, filter by campaigns or dispositions, score agent scripts, and export CDR logs.
          </p>

          {/* Capabilities Checklist */}
          <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Instant audio streaming with interactive player</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Multi-criteria filter: Agent, Phone, Lead, Campaign</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Batch WAV/MP3 downloads & QA compliance scores</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href="/recordings"
            onClick={(e) => {
              e.preventDefault();
              onSelectGateway('recordings');
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700/80 hover:bg-teal-600 text-slate-100 hover:text-white font-semibold text-sm transition-all duration-200 border border-slate-600 hover:border-teal-500 shadow-lg shadow-teal-900/20 group/btn"
          >
            <span>Access Dashboard Recordings</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
          <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Direct Path: <code className="text-teal-300">/recordings</code>
          </p>
        </div>
      </div>

      {/* 4. BULK LEAD INJECTOR CARD */}
      <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 overflow-hidden">
        {/* Top Glowing Edge on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div>
          {/* Card Header & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-md">
              <Database className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-2.5 py-1 rounded-full uppercase">
              Non-Agent API
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5">
            Bulk Lead Injector
          </h3>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Push 10,000+ customer records directly into VICIdial campaigns via Non-Agent API (<code className="text-cyan-300">add_lead</code>). Includes dynamic IP sentinel, Pakistan (+92) validation, and DUPCAMP deduplication.
          </p>

          {/* Capabilities Checklist */}
          <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Real-time Dynamic IP shift detection (Pakistan WAN)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Batch rate-limiting & list hopper protection</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Runnable standalone Python CLI script included</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => onSelectGateway('lead-injector')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700/80 hover:bg-cyan-600 text-slate-100 hover:text-white font-semibold text-sm transition-all duration-200 border border-slate-600 hover:border-cyan-500 shadow-lg shadow-cyan-900/20 group/btn cursor-pointer"
          >
            <span>Launch Lead Injector</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Direct Path: <code className="text-cyan-300">#lead-injector</code>
          </p>
        </div>
      </div>

    </div>
  );
};
