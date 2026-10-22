import React, { useState, useEffect } from 'react';
import { Cpu, Globe, Phone, FileText, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [serverTime, setServerTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setServerTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-800/80">
          
          {/* Brand & Powered By Column */}
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-800/60 text-sky-300 font-bold text-sm tracking-wide shadow-sm">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Powered By Global Nexus Technos</span>
            </div>
            
            <h4 className="text-base font-bold text-slate-100 tracking-tight">
              Grainbox
            </h4>
            
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              High-availability enterprise VICIdial® distribution engineered and maintained by Global Nexus Technos. Purpose-built for multi-tenant predictive dialing, campaign routing, WebRTC voice stations, and compliant call recording archives.
            </p>
          </div>

          {/* Quick Support & NOC Column */}
          <div className="lg:col-span-3 space-y-2">
            <h5 className="text-xs uppercase font-bold tracking-wider text-slate-200">
              Technical Resources
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a 
                  href="https://gntechnos.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-sky-300 transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Global Nexus Technos Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="#noc" onClick={(e) => { e.preventDefault(); alert('24/7 VoIP NOC Support: support@gntechnos.com'); }} className="hover:text-sky-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>24/7 VoIP NOC Support</span>
                </a>
              </li>
              <li>
                <a href="#compliance" onClick={(e) => { e.preventDefault(); alert('STIR/SHAKEN Level A Attestation & TCPA Compliant Dialing Gateway.'); }} className="hover:text-sky-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>STIR/SHAKEN & TCPA Compliance</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure Node Telemetry */}
          <div className="lg:col-span-3 space-y-2 text-right md:text-left lg:text-right">
            <h5 className="text-xs uppercase font-bold tracking-wider text-slate-200">
              Gateway Telemetry
            </h5>
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>
                Server Node: <span className="text-sky-400 font-semibold">dialer.gntechnos.com</span>
              </div>
              <div>
                Cluster ID: <span className="text-slate-200">NEXUS-WEST-01</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                UTC: <span className="text-cyan-300">{serverTime || '2026-10-21 09:40:07 UTC'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-slate-200 font-semibold">Global Nexus Technos</strong>. All rights reserved. Grainbox.
          </div>
          <div className="text-slate-400 text-[11px]">
            VICIdial® is a registered trademark of the VICIdial Group.
          </div>
        </div>

      </div>
    </footer>
  );
};
