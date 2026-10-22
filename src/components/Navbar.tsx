import React from 'react';
import { Radio, Globe, Code2, Server, CheckCircle2, Database } from 'lucide-react';
import { AppRoute } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenFlaskInspector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenFlaskInspector }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Cluster Info */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Grainbox
                </span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                  VICIdial v2.14
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Enterprise VoIP & Call Center Gateway
              </p>
            </div>
          </button>

          {/* Quick Info & Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Cluster Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Asterisk 16.30 / Cluster Online</span>
            </div>

            {/* Lead Injector Gateway Link */}
            <button
              onClick={() => onNavigate('lead-injector')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                currentRoute === 'lead-injector'
                  ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Launch VICIdial Non-Agent API Bulk Lead Injector"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Lead Injector</span>
              <span className="sm:hidden">Leads</span>
            </button>

            {/* View Flask Template Source */}
            <button
              onClick={onOpenFlaskInspector}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Inspect generated Flask templates/welcome.html code"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Flask Template</span>
              <span className="sm:hidden">Flask</span>
            </button>

            {/* Host Node Link */}
            <a
              href="https://gntechnos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/70 border border-sky-800/50 text-sky-300 text-xs font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">dialer.gntechnos.com</span>
              <span className="md:hidden">Node</span>
            </a>

            {/* Home / Return button if not on home */}
            {currentRoute !== 'home' && (
              <button
                onClick={() => onNavigate('home')}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
              >
                ← Gateway Home
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
