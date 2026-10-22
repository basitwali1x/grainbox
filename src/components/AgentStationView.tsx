import React, { useState, useEffect } from 'react';
import { Headset, PhoneCall, PhoneOff, Mic, MicOff, Volume2, Clock, CheckCircle2, AlertCircle, ArrowLeft, Send, Sparkles, User, Tag, HelpCircle } from 'lucide-react';

interface AgentStationViewProps {
  onBack: () => void;
}

export const AgentStationView: React.FC<AgentStationViewProps> = ({ onBack }) => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneLogin, setPhoneLogin] = useState('1004');
  const [phonePass, setPhonePass] = useState('password123');
  const [agentUser, setAgentUser] = useState('agent_1004');
  const [agentPass, setAgentPass] = useState('agentpass123');
  const [campaign, setCampaign] = useState('SOLAR_OUT_Q4');
  const [isConnecting, setIsConnecting] = useState(false);

  // Active Call State
  const [callState, setCallState] = useState<'IDLE' | 'RINGING' | 'INCALL' | 'DISPO'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'info' | 'history'>('script');
  const [selectedDispo, setSelectedDispo] = useState<string>('');
  const [callNotes, setCallNotes] = useState('');
  const [salesCount, setSalesCount] = useState(4);
  const [callsToday, setCallsToday] = useState(42);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (callState === 'INCALL') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsLoggedIn(true);
      // Simulate incoming call after 3 seconds
      setTimeout(() => {
        setCallState('RINGING');
      }, 2500);
    }, 1200);
  };

  const handleAnswerCall = () => {
    setCallState('INCALL');
  };

  const handleHangupCall = () => {
    setCallState('DISPO');
  };

  const handleFinishDispo = (dispo: string) => {
    if (dispo === 'SALE') {
      setSalesCount((prev) => prev + 1);
    }
    setCallsToday((prev) => prev + 1);
    setSelectedDispo('');
    setCallNotes('');
    setCallState('IDLE');

    // Simulate next call after 4 seconds
    setTimeout(() => {
      setCallState('RINGING');
    }, 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gateway Portal</span>
          </button>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <Headset className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">VICIdial Agent Web Station</h2>
              <p className="text-xs text-slate-400 font-mono">
                Asterisk WebRTC SIP Station · Server: dialer.gntechnos.com
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Login
                </label>
                <input
                  type="text"
                  value={phoneLogin}
                  onChange={(e) => setPhoneLogin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Password
                </label>
                <input
                  type="password"
                  value={phonePass}
                  onChange={(e) => setPhonePass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  User Login (Agent ID)
                </label>
                <input
                  type="text"
                  value={agentUser}
                  onChange={(e) => setAgentUser(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  User Password
                </label>
                <input
                  type="password"
                  value={agentPass}
                  onChange={(e) => setAgentPass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Campaign Queue
              </label>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="SOLAR_OUT_Q4">SOLAR_OUT_Q4 - Residential Clean Energy (Ratio 2.8x)</option>
                <option value="INBOUND_CARE">INBOUND_CARE - Global Nexus Customer Service</option>
                <option value="HEALTH_MED_A">HEALTH_MED_A - Telesales Advantage Campaign</option>
                <option value="B2B_LEADS_US">B2B_LEADS_US - Enterprise Telecom Solutions</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering WebRTC SIP Station...</span>
                  </>
                ) : (
                  <>
                    <Headset className="w-4 h-4" />
                    <span>Authenticate & Launch Agent Station</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
            <span className="text-xs text-slate-400">
              Grainbox · Powered By Global Nexus Technos
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Agent Station Simulator
  return (
    <div className="max-w-6xl mx-auto py-4 space-y-4">
      {/* Top Station Bar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
            <Headset className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Sarah Jenkins</span>
              <span className="text-[11px] font-mono text-slate-400">(Ext: {phoneLogin})</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                WebRTC Registered
              </span>
            </div>
            <p className="text-xs text-slate-400">Campaign: <strong className="text-sky-300">{campaign}</strong></p>
          </div>
        </div>

        {/* Real-time counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Calls Today: </span>
            <span className="text-white font-bold">{callsToday}</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Sales/Verified: </span>
            <span className="text-emerald-400 font-bold">{salesCount}</span>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Call Controls & Customer Data (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Call Status Ribbon */}
          <div className={`p-4 rounded-xl border transition-all ${
            callState === 'INCALL' ? 'bg-emerald-950/40 border-emerald-500/50' :
            callState === 'RINGING' ? 'bg-amber-950/40 border-amber-500/50 animate-pulse' :
            callState === 'DISPO' ? 'bg-sky-950/40 border-sky-500/50' :
            'bg-slate-800/60 border-slate-700'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  callState === 'INCALL' ? 'bg-emerald-500 text-white animate-pulse' :
                  callState === 'RINGING' ? 'bg-amber-500 text-slate-950 font-bold' :
                  callState === 'DISPO' ? 'bg-sky-500 text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {callState === 'INCALL' ? <PhoneCall className="w-5 h-5" /> :
                   callState === 'RINGING' ? <PhoneCall className="w-5 h-5 animate-bounce" /> :
                   <Headset className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {callState === 'INCALL' ? 'LIVE CALL IN PROGRESS' :
                       callState === 'RINGING' ? 'INCOMING CALL ROUTED TO STATION...' :
                       callState === 'DISPO' ? 'CALL CONCLUDED - SELECT DISPOSITION' :
                       'STATION READY (WAITING FOR HOPPER CALL)'}
                    </span>
                    {callState === 'INCALL' && (
                      <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                        {formatSeconds(callDuration)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Lead: <span className="font-mono text-slate-300">#1049281</span> · Customer: <strong className="text-white">Robert Vance Jr.</strong> · Phone: <span className="font-mono text-cyan-300">+1 (555) 382-9011</span>
                  </p>
                </div>
              </div>

              {/* Call Action Buttons */}
              <div className="flex items-center gap-2">
                {callState === 'RINGING' && (
                  <button
                    onClick={handleAnswerCall}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Answer Call</span>
                  </button>
                )}

                {callState === 'INCALL' && (
                  <>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        isMuted ? 'bg-amber-900 border-amber-600 text-white' : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>
                    <button
                      onClick={handleHangupCall}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>Hangup Call</span>
                    </button>
                  </>
                )}

                {callState === 'IDLE' && (
                  <button
                    onClick={() => setCallState('RINGING')}
                    className="px-3 py-1.5 bg-sky-950 border border-sky-700 text-sky-300 hover:bg-sky-900 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Next Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Script Tabs */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 mb-4">
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'script' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Campaign Script
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'info' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lead Information
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'history' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Prior Touchpoints (3)
              </button>
            </div>

            {activeTab === 'script' && (
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-700/50">
                <div className="text-xs font-mono uppercase text-sky-400 font-bold mb-1">
                  Solar Savings Q4 Verification Script:
                </div>
                <p>
                  "Hello, may I speak with <strong>Robert Vance</strong>? This is <strong>Sarah</strong> calling from Grainbox Clean Energy on behalf of the Solar Transition Initiative. How are you doing today?"
                </p>
                <div className="p-3 bg-slate-800 rounded border-l-2 border-sky-500 text-xs text-slate-300">
                  <strong className="text-white">Qualifying Question:</strong> "I see your utility provider is Pacific Power and your average monthly electric bill is around $180. Did you receive the state clean energy upgrade notice regarding 0% upfront installations?"
                </div>
                <p className="text-xs text-slate-400">
                  *If yes: Advance to Tier 1 credit verification and schedule engineering site assessment.*
                </p>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded border border-slate-700/50">
                  <span className="text-slate-400">Full Name</span>
                  <p className="font-semibold text-white">Robert Vance Jr.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700/50">
                  <span className="text-slate-400">Address</span>
                  <p className="font-semibold text-white">742 Evergreen Terrace, Springfield</p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700/50">
                  <span className="text-slate-400">Utility Provider</span>
                  <p className="font-semibold text-white">Pacific Power & Gas</p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700/50">
                  <span className="text-slate-400">Estimated Monthly Bill</span>
                  <p className="font-semibold text-white">$195.00 / month</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-700/50 flex justify-between">
                  <span>2026-10-18 14:10</span>
                  <span className="text-amber-400">NO ANSWER - Dialed again</span>
                  <span className="text-slate-400">Agent: AutoDial</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-700/50 flex justify-between">
                  <span>2026-10-19 11:22</span>
                  <span className="text-sky-400">CALLBK - Requested morning call</span>
                  <span className="text-slate-400">Agent: 1012</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Disposition Panel & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              <span>Call Disposition Codes</span>
            </h4>

            <p className="text-xs text-slate-400 mb-3">
              Select disposition upon call conclusion to push data into VICIdial CRM:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { code: 'SALE', label: 'Sale - Verified', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
                { code: 'CALLBK', label: 'Call Back', color: 'bg-sky-600 hover:bg-sky-500 text-white' },
                { code: 'NI', label: 'Not Interested', color: 'bg-slate-700 hover:bg-slate-600 text-slate-200' },
                { code: 'DNC', label: 'Do Not Call', color: 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900' },
                { code: 'BUSY', label: 'Line Busy', color: 'bg-slate-700 hover:bg-slate-600 text-slate-200' },
                { code: 'DROP', label: 'Customer Dropped', color: 'bg-slate-700 hover:bg-slate-600 text-slate-200' }
              ].map((dispo) => (
                <button
                  key={dispo.code}
                  disabled={callState !== 'DISPO'}
                  onClick={() => setSelectedDispo(dispo.code)}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    selectedDispo === dispo.code ? 'ring-2 ring-white scale-102' : ''
                  } ${dispo.color} ${callState !== 'DISPO' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="font-bold">{dispo.code}</div>
                  <div className="text-[10px] opacity-80">{dispo.label}</div>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1 font-medium">Disposition Notes</label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Enter customer agreement notes, installation schedule, or call details..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              disabled={callState !== 'DISPO' || !selectedDispo}
              onClick={() => handleFinishDispo(selectedDispo)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Disposition & Ready Next Lead</span>
            </button>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-300">Station Diagnostics</div>
            <div className="flex justify-between">
              <span>RTP Audio Jitter</span>
              <span className="font-mono text-emerald-400">1.2ms (Excellent)</span>
            </div>
            <div className="flex justify-between">
              <span>SIP Registration</span>
              <span className="font-mono text-slate-200">UDP / TLS 5060</span>
            </div>
            <div className="flex justify-between">
              <span>Codec In Use</span>
              <span className="font-mono text-cyan-300">Opus 48kHz Stereo</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
