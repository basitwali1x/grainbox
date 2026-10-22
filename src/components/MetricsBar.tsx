import React from 'react';
import { Server, Zap, ShieldCheck, Cpu } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 my-12 shadow-lg backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
        
        <div className="text-center pt-2 md:pt-0">
          <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="font-mono text-2xl font-bold tracking-tight text-white">99.99%</span>
          </div>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Carrier Uptime SLA
          </p>
        </div>

        <div className="text-center pt-4 md:pt-0">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
            <Server className="w-4 h-4" />
            <span className="font-mono text-2xl font-bold tracking-tight text-white">&lt; 14ms</span>
          </div>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            SIP / WebRTC Latency
          </p>
        </div>

        <div className="text-center pt-4 md:pt-0">
          <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-mono text-xl font-bold tracking-tight text-white">TLS 1.3 / SRTP</span>
          </div>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Voice Encryption
          </p>
        </div>

        <div className="text-center pt-4 md:pt-0">
          <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span className="font-mono text-base font-bold text-white truncate px-2">dialer.gntechnos.com</span>
          </div>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Production Cluster Node
          </p>
        </div>

      </div>
    </div>
  );
};
