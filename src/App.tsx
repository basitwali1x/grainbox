/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GatewayCards } from './components/GatewayCards';
import { MetricsBar } from './components/MetricsBar';
import { Footer } from './components/Footer';
import { AgentStationView } from './components/AgentStationView';
import { AdminManagementView } from './components/AdminManagementView';
import { RecordingsView } from './components/RecordingsView';
import { LeadInjectorView } from './components/LeadInjectorView';
import { FlaskInspectorModal } from './components/FlaskInspectorModal';
import { AppRoute } from './types';
import { PhoneCall, ShieldAlert, Zap, Globe, Sparkles } from 'lucide-react';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [isFlaskModalOpen, setIsFlaskModalOpen] = useState(false);

  // Sync route with URL query parameters and pathname
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const role = searchParams.get('role');

      if (path === '/lead-injector' || hash === '#lead-injector') {
        setRoute('lead-injector');
      } else if (path === '/recordings' || hash === '#recordings') {
        setRoute('recordings');
      } else if (path === '/login' || searchParams.has('role')) {
        if (role === 'admin') {
          setRoute('login-admin');
        } else {
          setRoute('login-agent');
        }
      } else {
        setRoute('home');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = (newRoute: AppRoute) => {
    setRoute(newRoute);
    if (newRoute === 'home') {
      window.history.pushState({}, '', '/');
    } else if (newRoute === 'login-agent') {
      window.history.pushState({}, '', '/login?role=agent');
    } else if (newRoute === 'login-admin') {
      window.history.pushState({}, '', '/login?role=admin');
    } else if (newRoute === 'recordings') {
      window.history.pushState({}, '', '/recordings');
    } else if (newRoute === 'lead-injector') {
      window.history.pushState({}, '', '#lead-injector');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Background radial ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <Navbar 
        currentRoute={route}
        onNavigate={navigateTo}
        onOpenFlaskInspector={() => setIsFlaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* VIEW: HOME LANDING GATEWAY */}
          {route === 'home' && (
            <div className="space-y-12">
              
              {/* Hero Banner */}
              <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/50 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Client Telephony Gateway</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  Grainbox
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Select your operational gateway below to authenticate into the predictive dialer station, administer campaigns and carrier trunks, or audit customer call recordings.
                </p>
              </div>

              {/* The Three Distinct Interactive Gateway Cards */}
              <GatewayCards onSelectGateway={navigateTo} />

              {/* Telephony Cluster System Metrics Bar */}
              <MetricsBar />

            </div>
          )}

          {/* VIEW: AGENT LOGIN & WORKSTATION */}
          {route === 'login-agent' && (
            <AgentStationView onBack={() => navigateTo('home')} />
          )}

          {/* VIEW: ADMIN LOGIN & CONSOLE */}
          {route === 'login-admin' && (
            <AdminManagementView onBack={() => navigateTo('home')} />
          )}

          {/* VIEW: DASHBOARD RECORDINGS & QA */}
          {route === 'recordings' && (
            <RecordingsView onBack={() => navigateTo('home')} />
          )}

          {/* VIEW: BULK LEAD INJECTOR & DYNAMIC IP SENTINEL */}
          {route === 'lead-injector' && (
            <LeadInjectorView onBack={() => navigateTo('home')} />
          )}

        </div>
      </main>

      {/* Structured Branding Footer */}
      <Footer />

      {/* Flask Template & Code Modal */}
      <FlaskInspectorModal 
        isOpen={isFlaskModalOpen}
        onClose={() => setIsFlaskModalOpen(false)}
      />

    </div>
  );
}
