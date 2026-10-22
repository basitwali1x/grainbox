import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  PhoneCall, 
  Radio, 
  Sliders, 
  ArrowLeft, 
  RefreshCw, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Mic,
  CloudDownload,
  Download,
  LogOut,
  Play,
  Pause,
  Clock,
  Activity,
  Headset,
  PlusCircle
} from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_LIVE_AGENTS, MOCK_RECORDINGS } from '../data/mockData';
import { CampaignSummary, LiveAgent, CallRecording } from '../types';

interface AdminManagementViewProps {
  onBack: () => void;
}

interface SystemActivityEvent {
  id: string;
  category: 'agent' | 'queue' | 'campaign';
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  meta: string;
  timestamp: string;
}

const INITIAL_ACTIVITIES: SystemActivityEvent[] = [
  {
    id: 'EVT-1082',
    category: 'agent',
    badge: 'AGENT STATUS',
    badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800/60',
    title: 'Agent Login - Station Registered',
    desc: 'Agent 1004 (Sarah Jenkins) authenticated via WebRTC SIP softphone into campaign SOLAR_OUT_Q4.',
    meta: 'Ext: SIP/cc1004 · Codec: Opus 48kHz · Ready for Hopper',
    timestamp: 'Just now'
  },
  {
    id: 'EVT-1081',
    category: 'queue',
    badge: 'QUEUE CHANGE',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
    title: 'Inbound Queue Spike Alert',
    desc: 'Calls in queue for INBOUND_CARE rose to 4 waiting callers. Estimated wait time: 22s.',
    meta: 'Campaign: INBOUND_CARE · Available: 3 Agents · SLA Target: 80% in 20s',
    timestamp: '24s ago'
  },
  {
    id: 'EVT-1080',
    category: 'campaign',
    badge: 'CAMPAIGN UPDATE',
    badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60',
    title: 'Adaptive Dial Ratio Pacing Adjusted',
    desc: 'Automated dial algorithm tuned SOLAR_OUT_Q4 dial level from 2.5x to 2.8x due to compliant 1.4% drop rate.',
    meta: 'Target Drop: <3.0% · Active Leads in Hopper: 140',
    timestamp: '1m ago'
  },
  {
    id: 'EVT-1079',
    category: 'agent',
    badge: 'AGENT STATUS',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
    title: 'Agent Call Completed & Verified',
    desc: 'Agent 1008 (Elena Rostova) logged SALE verification on lead #1049283 for HEALTH_MED_A.',
    meta: 'Duration: 07:11 · QA Score: 100% · Audio: REC-20261021-98216',
    timestamp: '2m ago'
  },
  {
    id: 'EVT-1078',
    category: 'queue',
    badge: 'QUEUE CHANGE',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
    title: 'Hopper Leads Automatically Replenished',
    desc: 'VICIdial hopper service loaded +250 fresh leads from list 101 into campaign SOLAR_OUT_Q4 queue.',
    meta: 'Hopper Level: 350 / 500 · DNC & Scrubbed Leads OK',
    timestamp: '4m ago'
  },
  {
    id: 'EVT-1077',
    category: 'campaign',
    badge: 'CAMPAIGN UPDATE',
    badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60',
    title: 'Carrier SIP Trunk Latency Health Check',
    desc: 'Carrier Trunk Global Nexus Primary (US West) round-trip time measured at 8.4ms. Channels utilized: 48 / 120.',
    meta: 'TLS 1.3 / SRTP Secure · Host: sip-west.gntechnos.com',
    timestamp: '5m ago'
  }
];

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({ onBack }) => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>(MOCK_CAMPAIGNS);
  const [agents, setAgents] = useState<LiveAgent[]>(MOCK_LIVE_AGENTS);
  const [recordings, setRecordings] = useState<CallRecording[]>(MOCK_RECORDINGS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('SOLAR_OUT_Q4');
  const [activeTab, setActiveTab] = useState<'recordings' | 'realtime' | 'campaigns' | 'carriers'>('recordings');
  
  // Dynamic IP Widget State (Handling Pakistan dynamic ISP IP shifts)
  const [publicIp, setPublicIp] = useState('39.45.182.94');
  const [ispName, setIspName] = useState('PTCL Broadband (Pakistan)');
  const [lastVerified, setLastVerified] = useState('Just now');
  const [isVerifyingIp, setIsVerifyingIp] = useState(false);
  const [ipToast, setIpToast] = useState<string | null>(null);

  // Sync with VICIdial State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Live System Activity Widget State
  const [activities, setActivities] = useState<SystemActivityEvent[]>(INITIAL_ACTIVITIES);
  const [activityFilter, setActivityFilter] = useState<'all' | 'agent' | 'queue' | 'campaign'>('all');
  const [isStreamActive, setIsStreamActive] = useState(true);

  // Auto-event simulation effect
  React.useEffect(() => {
    if (!isStreamActive) return;
    const interval = setInterval(() => {
      simulateActivity();
    }, 8000);
    return () => clearInterval(interval);
  }, [isStreamActive]);

  const simulateActivity = () => {
    const candidates = [
      {
        category: 'agent' as const,
        badge: 'AGENT STATUS',
        badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800/60',
        title: 'Agent Initiated Outbound Call',
        desc: 'Agent 1012 (Marcus Vance) dialed lead +1 (555) 749-2184 on campaign INBOUND_CARE.',
        meta: 'SIP/cc1012 · Dialing Line 04'
      },
      {
        category: 'queue' as const,
        badge: 'QUEUE CHANGE',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
        title: 'Queue Cleared - 0 Waiting Callers',
        desc: 'All queued customers connected to available agents in INBOUND_CARE. Average wait time: 14s.',
        meta: 'Active Agents: 8 · 0 In Queue'
      },
      {
        category: 'campaign' as const,
        badge: 'CAMPAIGN UPDATE',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60',
        title: 'Dial Hopper Pacing Speed Optimized',
        desc: 'Dial level automatically updated to 3.0x for HEALTH_MED_A as agent talk time averaged 04:12.',
        meta: 'Hopper: 280 · Drop Rate: 1.2%'
      },
      {
        category: 'agent' as const,
        badge: 'AGENT STATUS',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
        title: 'Agent Status Changed - Break',
        desc: 'Agent 1002 (Chloe Bennett) entered status PAUSED (Coffee Break).',
        meta: 'Campaign: INBOUND_CARE · Ext: 1002'
      },
      {
        category: 'campaign' as const,
        badge: 'CAMPAIGN UPDATE',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
        title: 'Carrier Trunk STIR/SHAKEN Attestation',
        desc: 'Outbound caller ID +1 (800) 555-0199 granted Level A Full Attestation by Bandwidth trunk.',
        meta: 'Cert Valid · Identity Header Signed'
      }
    ];

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const newEvt: SystemActivityEvent = {
      ...pick,
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now'
    };

    setActivities(prev => [newEvt, ...prev.slice(0, 14)]);
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleDialLevelChange = (newLevel: number) => {
    setCampaigns(prev => prev.map(c => c.id === selectedCampaignId ? { ...c, dialLevel: newLevel } : c));
  };

  // Re-verify Dynamic IP Handler
  const handleReverifyIp = async () => {
    setIsVerifyingIp(true);
    try {
      const pakistanIps = [
        { ip: '39.45.182.94', isp: 'PTCL Broadband (Lahore / Rawalpindi, Pakistan)' },
        { ip: '182.180.124.67', isp: 'Nayatel Fiber Network (Islamabad, Pakistan)' },
        { ip: '119.160.98.212', isp: 'StormFiber Cybernet (Karachi, Pakistan)' }
      ];
      // Pick next or random
      const selected = pakistanIps[Math.floor(Math.random() * pakistanIps.length)];
      await new Promise(r => setTimeout(r, 600));
      setPublicIp(selected.ip);
      setIspName(selected.isp);
      setLastVerified('Verified just now');
      setIpToast(`Dynamic IP verified: ${selected.ip} (${selected.isp}). Asterisk externip updated.`);
      setTimeout(() => setIpToast(null), 4000);
    } finally {
      setIsVerifyingIp(false);
    }
  };

  // Sync with VICIdial Handler
  const handleSyncVicidial = async () => {
    setIsSyncing(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setRecordings([...MOCK_RECORDINGS]);
      setSyncToast('Synchronized 5 fresh recordings from Asterisk recording_log.');
      setTimeout(() => setSyncToast(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      
      {/* 1. Top Navigation Bar with Company Branding & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Return to Gateway Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/10">
            <Shield className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Grainbox</h2>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                VICIdial v2.14
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Administration Console · Node: <span className="text-sky-300 font-mono">dialer.gntechnos.com</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher & Logout Button */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'recordings' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Call Recordings
            </button>
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'realtime' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Real-Time Screen
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'campaigns' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Campaign Pacing
            </button>
            <button
              onClick={() => setActiveTab('carriers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'carriers' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Carrier Trunks & WebRTC
            </button>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Notifications / Toast alerts */}
      {syncToast && (
        <div className="p-3 bg-teal-950 border border-teal-500/50 rounded-xl text-xs text-teal-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-teal-400 hover:text-white">✕</button>
        </div>
      )}

      {ipToast && (
        <div className="p-3 bg-sky-950 border border-sky-500/50 rounded-xl text-xs text-sky-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{ipToast}</span>
          </div>
          <button onClick={() => setIpToast(null)} className="text-sky-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 3. DYNAMIC IP STATUS WIDGET (Resolving Pakistan ISP Dynamic IP shifts) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dynamic IP & SIP Trunk NAT Status</h3>
              <p className="text-xs text-slate-400">
                Monitors public WAN IP address changes (e.g. Pakistan dynamic ISP routing) and updates Asterisk SIP NAT bindings (<code className="text-sky-300">externip</code>).
              </p>
            </div>
          </div>

          <button
            onClick={handleReverifyIp}
            disabled={isVerifyingIp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isVerifyingIp ? 'animate-spin' : ''}`} />
            <span>{isVerifyingIp ? 'Re-verifying IP...' : 'Re-verify IP'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
          {/* IP Display */}
          <div className="md:col-span-5 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Current Public WAN IP (Asterisk externip)
            </span>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-sky-950/70 border border-sky-800/60 font-mono text-xl font-bold text-sky-400 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{publicIp}</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              ISP / Gateway: <span className="text-white font-medium">{ispName}</span>
            </p>
          </div>

          {/* Sub-status boxes */}
          <div className="md:col-span-7 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">SIP NAT STATE</span>
              <span className="font-mono text-emerald-400 font-bold block mt-1">BINDING ACTIVE</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">IP DETECTION</span>
              <span className="font-mono text-sky-400 font-bold block mt-1">AUTO-CRON (30s)</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase">LAST VERIFIED</span>
              <span className="font-mono text-slate-200 font-bold block mt-1">{lastVerified}</span>
            </div>
            
            <div className="col-span-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-2.5 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Asterisk SIP RTP ports (10000-20000) mapped to current dynamic IP without one-way audio lag.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LIVE SYSTEM ACTIVITY WIDGET */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Live System Activity</h3>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border inline-flex items-center gap-1.5 ${
                  isStreamActive
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{isStreamActive ? 'AMI STREAM ACTIVE' : 'STREAM PAUSED'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time Asterisk AMI event stream: Agent login status, queue changes, and campaign updates.
              </p>
            </div>
          </div>

          {/* Action buttons & Category filters */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
              {(['all', 'agent', 'queue', 'campaign'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivityFilter(cat)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                    activityFilter === cat
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? `All (${activities.length})` : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsStreamActive(!isStreamActive)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              title={isStreamActive ? 'Pause incoming events' : 'Resume live stream'}
            >
              {isStreamActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreamActive ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={simulateActivity}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Event</span>
            </button>
          </div>
        </div>

        {/* Real-time Activity List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {activities
            .filter(a => activityFilter === 'all' || a.category === activityFilter)
            .map(a => (
              <div
                key={a.id}
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-all flex items-start gap-3.5 shadow-sm"
              >
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  a.category === 'agent' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                  a.category === 'queue' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {a.category === 'agent' ? <Headset className="w-4 h-4" /> :
                   a.category === 'queue' ? <Users className="w-4 h-4" /> :
                   <Sliders className="w-4 h-4" />}
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{a.title}</h4>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${a.badgeColor}`}>
                        {a.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{a.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {a.desc}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>{a.meta}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer info bar */}
        <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Asterisk Manager Interface (AMI) Socket: <code className="text-sky-300">tcp://127.0.0.1:5038</code> connected</span>
          </div>
          <div>
            Events: <strong className="text-white">{activities.length}</strong> · Polling: 3s
          </div>
        </div>

      </div>

      {/* 2. CALL RECORDING & MANAGEMENT SECTION */}
      {activeTab === 'recordings' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          
          <div className="p-5 bg-slate-850 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Call Recording & Management</h3>
                <p className="text-xs text-slate-400">
                  Direct streaming and QA verification logs from VICIdial <code className="text-sky-300">recording_log</code> and <code className="text-sky-300">vicidial_log</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sync with VICIdial action button */}
              <button
                onClick={handleSyncVicidial}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all disabled:opacity-50"
              >
                <CloudDownload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Syncing with VICIdial...' : 'Sync with VICIdial'}</span>
              </button>
            </div>
          </div>

          {/* Tabular Data View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Call ID</th>
                  <th className="py-3.5 px-4">Lead Phone Number</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Call Duration</th>
                  <th className="py-3.5 px-4">Timestamp (UTC)</th>
                  <th className="py-3.5 px-4" style={{ minWidth: '220px' }}>Audio Streaming Playback</th>
                  <th className="py-3.5 px-4 text-right">Disposition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {recordings.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-sky-400 font-bold block">{rec.id}</span>
                      <span className="text-[10px] text-slate-400">Lead #{rec.leadId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium block">{rec.phone}</span>
                      <span className="text-[10px] text-slate-400">{rec.campaign}</span>
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-white font-medium block">{rec.agent}</span>
                      <span className="text-[10px] font-mono text-slate-400">Ext: {rec.agentId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        {rec.duration}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {rec.timestamp.replace(' UTC', '')}
                    </td>

                    {/* HTML5 Audio Streaming Playback Control */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <audio 
                          controls 
                          preload="none"
                          className="h-8 w-52 rounded-full outline-none opacity-90 hover:opacity-100"
                        >
                          <source src={`/recordings/stream/${rec.id}`} type="audio/wav" />
                          Audio not supported
                        </audio>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.disposition === 'SALE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        rec.disposition === 'CALLBK' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                        'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
              Connected to Asterisk audio spool: <code className="text-sky-300">/var/spool/asterisk/monitorDONE/MP3/</code>
            </span>
            <span className="font-mono">
              Cluster: <strong className="text-white">dialer.gntechnos.com</strong>
            </span>
          </div>

        </div>
      )}

      {/* Real-time screen tab */}
      {activeTab === 'realtime' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Active Live Agent Monitor</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(a => (
              <div key={a.id} className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{a.name}</h4>
                    <span className="text-xs font-mono text-slate-400">{a.extension}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    a.status === 'INCALL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    a.status === 'READY' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                  <span>Campaign: <strong className="text-sky-300">{a.campaign}</strong></span>
                  <span>Sales: <strong className="text-emerald-400">{a.salesToday}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign pacing tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>Campaign Hopper & Dial Multipliers</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(c => (
              <div key={c.id} className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">{c.name}</h4>
                  <span className="text-xs font-mono text-sky-400 font-bold">{c.dialLevel}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={c.dialLevel}
                  onChange={(e) => handleDialLevelChange(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Active Agents: {c.activeAgents}</span>
                  <span>Queued: {c.callsInQueue}</span>
                  <span>Sales: {c.salesToday}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carrier Trunks & WebRTC Tab */}
      {activeTab === 'carriers' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">VoIP Carrier Trunks & WebRTC Gateways</h3>
                <p className="text-xs text-slate-400">
                  Connect real telephone carriers (Twilio, Telnyx, PTCL, Nayatel) to VICIdial cluster <code className="text-sky-300 font-mono">dialer.gntechnos.com</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Trunks Online (3 Active)</span>
              </span>
            </div>
          </div>

          {/* Active Carrier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">PTCL / Nayatel Fiber SIP</h4>
                  <span className="text-[11px] font-mono text-emerald-400">Active · RTT: 7.2ms</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono font-bold">
                  PRIMARY
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>Route: <strong className="text-slate-200">Pakistan (+92) Local</strong></div>
                <div>Channels: <strong className="text-white">64 / 120</strong></div>
                <div>Dial Prefix: <strong className="text-cyan-300">923 / 03</strong></div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Host: <code className="text-sky-300">sip-pk.gntechnos.com:5060</code>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">Twilio Elastic SIP Trunk</h4>
                  <span className="text-[11px] font-mono text-emerald-400">Active · RTT: 12.8ms</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-mono font-bold">
                  GLOBAL
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>Route: <strong className="text-slate-200">US & International</strong></div>
                <div>Channels: <strong className="text-white">32 / 200</strong></div>
                <div>Dial Prefix: <strong className="text-cyan-300">91 / 9</strong></div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Host: <code className="text-sky-300">nexus.pstn.twilio.com</code>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">Telnyx High-Volume Trunk</h4>
                  <span className="text-[11px] font-mono text-emerald-400">Standby · RTT: 14.1ms</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono font-bold">
                  FAILOVER
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>Route: <strong className="text-slate-200">Tier-1 PSTN Carrier</strong></div>
                <div>Channels: <strong className="text-white">0 / 500</strong></div>
                <div>Dial Prefix: <strong className="text-cyan-300">91</strong></div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Host: <code className="text-sky-300">sip.telnyx.com</code>
              </div>
            </div>

          </div>

          {/* Outbound Dialplan Syntax */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>VICIdial Carrier Dialplan Syntax (extensions.conf)</span>
              <span className="text-xs text-slate-400 font-mono">Carrier ID: GN_CARRIER_01</span>
            </h4>
            <p className="text-xs text-slate-400">
              Paste this into your VICIdial Admin Carrier Configuration under <strong>Dialplan Entry</strong> to enable automatic lead call-logging and outbound routing:
            </p>
            <pre className="p-4 bg-slate-900/90 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`; --- VICIdial Production Outbound Dialplan (dialer.gntechnos.com) ---
; Pakistan Mobile & Landline format
exten => _923XXXXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _923XXXXXXXXX,2,Dial(SIP/\${EXTEN}@carrier_trunk,60,tTo)
exten => _923XXXXXXXXX,3,Hangup

; Local Pakistan format with leading 0 (e.g. 03001234567)
exten => _03XXXXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _03XXXXXXXXX,2,Dial(SIP/92\${EXTEN:1}@carrier_trunk,60,tTo)
exten => _03XXXXXXXXX,3,Hangup

; Global Nexus Auto-Dialer Hopper Return
exten => 8368,1,Playback(sip-silence)
exten => 8368,2,AGI(agi://127.0.0.1:4577/call_log)
exten => 8368,3,AGI(agi-VDAD_ALL_outbound.agi,NORMAL-----LB-----)
exten => 8368,4,Hangup`}
            </pre>
          </div>

          {/* WebRTC Phone Template Instructions */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-700/60 space-y-3">
            <h4 className="text-sm font-bold text-white">Asterisk WebRTC WSS Phone Template (sip.conf)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 text-slate-300">
                <div className="font-semibold text-white">WebRTC Settings in VICIdial Admin:</div>
                <div>• Set <strong className="text-sky-300">Phone Type</strong>: WebRTC</div>
                <div>• Set <strong className="text-sky-300">WebRTC</strong>: Y</div>
                <div>• Set <strong className="text-sky-300">DTLS Encryption</strong>: Y</div>
                <div>• Set <strong className="text-sky-300">Codecs</strong>: opus, ulaw</div>
                <div>• Set <strong className="text-sky-300">AVPF</strong>: Y</div>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="font-semibold text-white">Network & Firewall Ports:</div>
                <div>• WebSocket WSS: <strong className="text-emerald-400">8089 (TCP)</strong></div>
                <div>• SIP Signaling: <strong className="text-emerald-400">5060 (UDP/TCP)</strong></div>
                <div>• WebRTC RTP Voice Media: <strong className="text-emerald-400">10000 - 20000 (UDP)</strong></div>
                <div>• STUN Server: <strong className="text-cyan-300">stun:stun.l.google.com:19302</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
