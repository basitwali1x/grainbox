import React, { useState, useEffect, useRef } from 'react';
import { 
  Headset, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  User, 
  Tag, 
  HelpCircle,
  Radio,
  Server,
  ShieldCheck,
  Globe,
  Hash,
  Pause,
  Play,
  RotateCcw,
  ExternalLink,
  Sliders,
  ChevronRight,
  Database
} from 'lucide-react';

interface AgentStationViewProps {
  onBack: () => void;
}

interface QueuedLead {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  status: 'PENDING' | 'CALLED' | 'SALE' | 'CALLBK' | 'NI' | 'DNC';
}

const APA_LEADS_QUEUE: QueuedLead[] = [
  { id: '101-01', phone: '03001234567', first_name: 'Hamza', last_name: 'Khan', city: 'Lahore', status: 'PENDING' },
  { id: '101-02', phone: '03219876543', first_name: 'Usman', last_name: 'Tariq', city: 'Karachi', status: 'PENDING' },
  { id: '101-03', phone: '03335551212', first_name: 'Ayesha', last_name: 'Malik', city: 'Islamabad', status: 'PENDING' },
  { id: '101-04', phone: '03451122334', first_name: 'Bilal', last_name: 'Ahmed', city: 'Rawalpindi', status: 'PENDING' },
  { id: '101-05', phone: '03123456789', first_name: 'Zainab', last_name: 'Fatima', city: 'Faisalabad', status: 'PENDING' },
  { id: '101-06', phone: '03017654321', first_name: 'Ali', last_name: 'Raza', city: 'Multan', status: 'PENDING' },
  { id: '101-07', phone: '03224433221', first_name: 'Farhan', last_name: 'Siddiqui', city: 'Sialkot', status: 'PENDING' },
  { id: '101-08', phone: '03348877665', first_name: 'Sana', last_name: 'Javed', city: 'Gujranwala', status: 'PENDING' }
];

export const AgentStationView: React.FC<AgentStationViewProps> = ({ onBack }) => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneLogin, setPhoneLogin] = useState('1004');
  const [phonePass, setPhonePass] = useState('password123');
  const [agentUser, setAgentUser] = useState('agent_1004');
  const [agentPass, setAgentPass] = useState('agentpass123');
  const [campaign, setCampaign] = useState('SOLAR_OUT_Q4');
  const [isConnecting, setIsConnecting] = useState(false);

  // WebRTC SIP Configuration
  const [sipServer, setSipServer] = useState('dialer.gntechnos.com:8089');
  const [wsProtocol, setWsProtocol] = useState<'wss' | 'ws'>('wss');
  const [sipStatus, setSipStatus] = useState<'REGISTERED' | 'DISCONNECTED' | 'IN_CALL'>('DISCONNECTED');
  const [webrtcAudioGranted, setWebrtcAudioGranted] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [showCarrierGuide, setShowCarrierGuide] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);

  // Active Call State
  const [callState, setCallState] = useState<'IDLE' | 'RINGING' | 'INCALL' | 'DISPO'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'info' | 'dialpad' | 'hopper'>('script');
  const [selectedDispo, setSelectedDispo] = useState<string>('');
  const [callNotes, setCallNotes] = useState('');
  const [salesCount, setSalesCount] = useState(4);
  const [callsToday, setCallsToday] = useState(42);

  // Active Customer / Lead
  const [leadsQueue, setLeadsQueue] = useState<QueuedLead[]>(APA_LEADS_QUEUE);
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [manualDialInput, setManualDialInput] = useState('');

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const ringtoneTimerRef = useRef<any>(null);

  const currentLead = leadsQueue[currentLeadIndex] || leadsQueue[0];

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (callState === 'INCALL' && !isOnHold) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState, isOnHold]);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Request real microphone permissions & set up audio analyzer
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setWebrtcAudioGranted(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(normalized);
        requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (err) {
      console.warn('Microphone permission not granted:', err);
      setWebrtcAudioGranted(false);
    }
  };

  // Web Audio DTMF Tone Generator (Authentic dual-frequency telecom tones)
  const playDtmfTone = (digit: string) => {
    const dtmfFreqs: { [key: string]: [number, number] } = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };

    const freqs = dtmfFreqs[digit];
    if (!freqs) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  // PBX Ringtone Generator (440Hz + 480Hz telecom ringing tone)
  const startRingtone = () => {
    stopRingtone();
    const playBurst = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.25);
        osc2.stop(ctx.currentTime + 1.25);
      } catch {}
    };

    playBurst();
    ringtoneTimerRef.current = setInterval(playBurst, 3500);
  };

  const stopRingtone = () => {
    if (ringtoneTimerRef.current) {
      clearInterval(ringtoneTimerRef.current);
      ringtoneTimerRef.current = null;
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    // Prompt for microphone on login
    await requestMicPermission();

    setTimeout(() => {
      setIsConnecting(false);
      setIsLoggedIn(true);
      setSipStatus('REGISTERED');

      // Ring after 3 seconds for initial lead
      setTimeout(() => {
        setCallState('RINGING');
        startRingtone();
      }, 2500);
    }, 1200);
  };

  const handleAnswerCall = () => {
    stopRingtone();
    setCallState('INCALL');
    setCallDuration(0);
  };

  const handleHangupCall = () => {
    stopRingtone();
    setCallState('DISPO');
  };

  const handleManualDial = (numberToDial?: string) => {
    const target = numberToDial || manualDialInput;
    if (!target) return;

    stopRingtone();
    setCallState('RINGING');
    startRingtone();

    // Auto connect outbound call after 2.5 seconds
    setTimeout(() => {
      stopRingtone();
      setCallState('INCALL');
      setCallDuration(0);
    }, 2500);
  };

  const handleFinishDispo = (dispo: string) => {
    if (dispo === 'SALE') {
      setSalesCount((prev) => prev + 1);
    }
    setCallsToday((prev) => prev + 1);

    // Update lead status in queue
    setLeadsQueue(prev => {
      const copy = [...prev];
      if (copy[currentLeadIndex]) {
        copy[currentLeadIndex].status = dispo as any;
      }
      return copy;
    });

    setSelectedDispo('');
    setCallNotes('');
    setCallState('IDLE');
    setCallDuration(0);

    // Advance to next lead in queue
    const nextIdx = (currentLeadIndex + 1) % leadsQueue.length;
    setCurrentLeadIndex(nextIdx);

    // Queue next call after 4 seconds
    setTimeout(() => {
      setCallState('RINGING');
      startRingtone();
    }, 4000);
  };

  // Station Login View
  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gateway Portal</span>
          </button>
          
          <button
            onClick={() => setShowCarrierGuide(true)}
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            <Server className="w-3.5 h-3.5" />
            <span>VICIdial Carrier & WebRTC Guide</span>
          </button>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <Headset className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">VICIdial WebRTC Agent Station</h2>
              <p className="text-xs text-slate-400 font-mono">
                Asterisk WebRTC SIP Client · Server: dialer.gntechnos.com:8089
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  SIP Extension (Phone Login)
                </label>
                <input
                  type="text"
                  value={phoneLogin}
                  onChange={(e) => setPhoneLogin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  VICIdial User Login
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

            {/* WebRTC Audio Permissions Check Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  webrtcAudioGranted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {webrtcAudioGranted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {webrtcAudioGranted ? 'Microphone Audio Stream Active' : 'Microphone Permission Needed'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {webrtcAudioGranted ? 'Audio device calibrated for Opus 48kHz WebRTC' : 'Required for two-way voice with dialer.gntechnos.com'}
                  </div>
                </div>
              </div>

              {!webrtcAudioGranted && (
                <button
                  type="button"
                  onClick={requestMicPermission}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                >
                  Enable Mic
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering WebRTC SIP Station...</span>
                  </>
                ) : (
                  <>
                    <Headset className="w-4 h-4" />
                    <span>Register & Connect WebRTC Station</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Server: <strong>dialer.gntechnos.com</strong></span>
            <span>Trunk: <strong>WebRTC WSS 8089</strong></span>
          </div>
        </div>

        {/* Carrier Configuration Modal */}
        {showCarrierGuide && (
          <CarrierGuideModal onClose={() => setShowCarrierGuide(false)} />
        )}
      </div>
    );
  }

  // Logged-in Agent Station
  return (
    <div className="max-w-6xl mx-auto py-4 space-y-4">
      
      {/* Top Station Bar with Live Mic Meter & Status */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Sarah Jenkins</span>
              <span className="text-[11px] font-mono text-slate-400">(Ext: {phoneLogin})</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WebRTC SIP Registered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gateway: <span className="font-mono text-slate-300">dialer.gntechnos.com:8089</span> · Campaign: <strong className="text-sky-300">{campaign}</strong>
            </p>
          </div>
        </div>

        {/* Live Audio Meter & Quick Actions */}
        <div className="flex items-center gap-4 text-xs font-mono">
          
          {/* Live Mic Level Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700" title="Live Microphone Audio Meter">
            <Mic className={`w-3.5 h-3.5 ${isMuted ? 'text-rose-400' : 'text-emerald-400'}`} />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
              <div 
                className={`h-full transition-all duration-75 ${
                  isMuted ? 'bg-rose-500 w-0' : micLevel > 70 ? 'bg-rose-500' : micLevel > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: isMuted ? '0%' : `${micLevel}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 w-6 text-right">{isMuted ? 'MUTE' : `${micLevel}%`}</span>
          </div>

          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Calls Today: </span>
            <span className="text-white font-bold">{callsToday}</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Sales/Verified: </span>
            <span className="text-emerald-400 font-bold">{salesCount}</span>
          </div>

          <button
            onClick={() => setShowCarrierGuide(true)}
            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition-colors"
            title="Carrier Trunk & WebRTC Setup"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Carrier Settings</span>
          </button>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Call Controls & Customer Data (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Call Status Banner */}
          <div className={`p-4 rounded-xl border transition-all ${
            callState === 'INCALL' ? 'bg-emerald-950/40 border-emerald-500/50' :
            callState === 'RINGING' ? 'bg-amber-950/40 border-amber-500/50 animate-pulse' :
            callState === 'DISPO' ? 'bg-sky-950/40 border-sky-500/50' :
            'bg-slate-800/60 border-slate-700'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  callState === 'INCALL' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                  callState === 'RINGING' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30' :
                  callState === 'DISPO' ? 'bg-sky-500 text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {callState === 'INCALL' ? <PhoneCall className="w-5 h-5 animate-pulse" /> :
                   callState === 'RINGING' ? <PhoneCall className="w-5 h-5 animate-bounce" /> :
                   <Headset className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {callState === 'INCALL' ? (isOnHold ? 'CALL ON HOLD' : 'LIVE CALL IN PROGRESS (WebRTC AUDIO)') :
                       callState === 'RINGING' ? 'INCOMING CALL ROUTED TO STATION...' :
                       callState === 'DISPO' ? 'CALL CONCLUDED - SELECT DISPOSITION' :
                       'STATION READY (WAITING FOR AUTO-DIALER / HOPPER)'}
                    </span>
                    {callState === 'INCALL' && (
                      <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                        {formatSeconds(callDuration)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Lead ID: <span className="font-mono text-cyan-300">#{currentLead.id}</span> · Customer: <strong className="text-white">{currentLead.first_name} {currentLead.last_name}</strong> · Phone: <span className="font-mono text-emerald-300 font-bold">{currentLead.phone}</span> ({currentLead.city})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {callState === 'RINGING' && (
                  <button
                    onClick={handleAnswerCall}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Answer Call</span>
                  </button>
                )}

                {callState === 'INCALL' && (
                  <>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        isMuted ? 'bg-amber-900 border-amber-600 text-white' : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </button>

                    <button
                      onClick={() => setIsOnHold(!isOnHold)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        isOnHold ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {isOnHold ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{isOnHold ? 'Resume' : 'Hold'}</span>
                    </button>

                    <button
                      onClick={handleHangupCall}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>Hangup</span>
                    </button>
                  </>
                )}

                {callState === 'IDLE' && (
                  <>
                    <button
                      onClick={() => handleManualDial(currentLead.phone)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Dial Current Lead</span>
                    </button>

                    <button
                      onClick={() => {
                        setCallState('RINGING');
                        startRingtone();
                      }}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-1"
                      title="Trigger next lead simulation"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>Simulate Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs: Script, Lead Info, Manual Dialpad, Hopper Queue */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 mb-4 flex-wrap">
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'script' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Campaign Script
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'info' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lead Information
              </button>
              <button
                onClick={() => setActiveTab('dialpad')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeTab === 'dialpad' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Manual Dialpad</span>
              </button>
              <button
                onClick={() => setActiveTab('hopper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeTab === 'hopper' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Apa.csv Queue ({leadsQueue.length})</span>
              </button>
            </div>

            {/* TAB 1: Script */}
            {activeTab === 'script' && (
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <div className="text-xs font-mono uppercase text-sky-400 font-bold mb-1 flex items-center justify-between">
                  <span>VICIdial Campaign Script ({campaign})</span>
                  <span className="text-[11px] text-slate-500 font-normal">Active Dial Level: 2.8x</span>
                </div>
                <p>
                  "Assalam-o-Alaikum / Hello, may I please speak with <strong>{currentLead.first_name} {currentLead.last_name}</strong>? My name is <strong>Sarah</strong> calling from Grainbox Telephony on behalf of Global Nexus Solutions in {currentLead.city}."
                </p>
                <div className="p-3 bg-slate-800/80 rounded-lg border-l-4 border-sky-500 text-xs text-slate-300 space-y-1">
                  <strong className="text-white">Customer Qualification:</strong>
                  <p>
                    "We are following up regarding your inquiry for verified telecom services and high-speed VoIP trunking. Can you confirm your phone number is <strong>{currentLead.phone}</strong>?"
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  *If interested: Confirm city ({currentLead.city}) and proceed to disposition code SALE or CALLBK.*
                </p>
              </div>
            )}

            {/* TAB 2: Lead Information */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400">Customer Full Name</span>
                  <p className="font-bold text-white text-sm mt-0.5">{currentLead.first_name} {currentLead.last_name}</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400">Phone Number</span>
                  <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{currentLead.phone}</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400">Target City / Territory</span>
                  <p className="font-semibold text-white mt-0.5">{currentLead.city}, Pakistan</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400">Data Source & List ID</span>
                  <p className="font-semibold text-cyan-300 mt-0.5 font-mono">Apa.csv · List 101</p>
                </div>
              </div>
            )}

            {/* TAB 3: Manual Dialpad & DTMF Keypad */}
            {activeTab === 'dialpad' && (
              <div className="max-w-xs mx-auto space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={manualDialInput}
                    onChange={(e) => setManualDialInput(e.target.value)}
                    placeholder="Enter phone: 03001234567..."
                    className="flex-grow px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => handleManualDial()}
                    disabled={!manualDialInput}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white cursor-pointer shadow-md"
                    title="Dial Number"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => {
                        playDtmfTone(digit);
                        setManualDialInput(prev => prev + digit);
                      }}
                      className="py-3 rounded-xl bg-slate-900 hover:bg-slate-700 active:bg-sky-600 border border-slate-700 text-white font-mono font-bold text-base transition-all cursor-pointer shadow-sm"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>DTMF Audio Feedback: <strong className="text-emerald-400">Active</strong></span>
                  <button
                    onClick={() => setManualDialInput('')}
                    className="hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Apa.csv Leads Queue */}
            {activeTab === 'hopper' && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                  <span>Leads Loaded from <strong>Apa.csv</strong></span>
                  <span className="font-mono text-[11px] text-cyan-400">List 101</span>
                </div>
                {leadsQueue.map((lead, idx) => (
                  <div
                    key={lead.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      idx === currentLeadIndex 
                        ? 'bg-sky-950/60 border-sky-600 text-white' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>{lead.first_name} {lead.last_name}</span>
                        {idx === currentLeadIndex && (
                          <span className="px-1.5 py-0.2 bg-sky-500 text-white rounded text-[10px]">CURRENT</span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {lead.phone} · {lead.city}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        lead.status === 'SALE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        lead.status === 'CALLBK' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                        lead.status === 'CALLED' ? 'bg-slate-800 text-slate-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {lead.status}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentLeadIndex(idx);
                          handleManualDial(lead.phone);
                        }}
                        className="p-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg cursor-pointer"
                        title="Dial this lead immediately"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Disposition Panel & Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              <span>Call Disposition Codes</span>
            </h4>

            <p className="text-xs text-slate-400 mb-3">
              Conclude call to commit result into VICIdial database:
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
                placeholder="Enter customer agreement notes, schedule, or verification details..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              disabled={callState !== 'DISPO' || !selectedDispo}
              onClick={() => handleFinishDispo(selectedDispo)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Disposition & Next Lead</span>
            </button>
          </div>

          {/* WebRTC SIP Diagnostics */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-300 flex items-center justify-between">
              <span>WebRTC Station Diagnostics</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex justify-between">
              <span>RTP Audio Jitter</span>
              <span className="font-mono text-emerald-400">1.2ms (Optimal)</span>
            </div>
            <div className="flex justify-between">
              <span>SIP Signaling Transport</span>
              <span className="font-mono text-cyan-300">WSS wss://dialer.gntechnos.com:8089</span>
            </div>
            <div className="flex justify-between">
              <span>Media Codec</span>
              <span className="font-mono text-slate-200">Opus 48kHz (WebRTC High-Def)</span>
            </div>
            <div className="flex justify-between">
              <span>STUN / ICE Server</span>
              <span className="font-mono text-slate-300">stun:stun.l.google.com:19302</span>
            </div>
          </div>
        </div>

      </div>

      {/* Carrier Configuration Modal */}
      {showCarrierGuide && (
        <CarrierGuideModal onClose={() => setShowCarrierGuide(false)} />
      )}
    </div>
  );
};

// Sub-component: VICIdial Carrier & WebRTC Trunk Configuration Guide Modal
const CarrierGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<'twilio' | 'telnyx' | 'pakistan'>('pakistan');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">VICIdial Carrier Trunk & WebRTC Settings</h3>
              <p className="text-xs text-slate-400">Target Server: dialer.gntechnos.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Provider Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedProvider('pakistan')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedProvider === 'pakistan' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pakistan Local VoIP (PTCL / Nayatel)
          </button>
          <button
            onClick={() => setSelectedProvider('twilio')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedProvider === 'twilio' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Twilio Elastic SIP Trunk
          </button>
          <button
            onClick={() => setSelectedProvider('telnyx')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedProvider === 'telnyx' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Telnyx SIP Trunk
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 text-xs">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 uppercase tracking-wider block">
              1. VICIdial Outbound Dialplan (extensions.conf)
            </span>
            <p className="text-slate-400">
              In VICIdial Admin → Carriers → Edit Carrier → Dialplan Entry:
            </p>
            <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono overflow-x-auto text-[11px] leading-relaxed">
{selectedProvider === 'pakistan' ? `; Outbound Dial Plan for Pakistan PSTN / Mobile (+92)
exten => _923XXXXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _923XXXXXXXXX,2,Dial(SIP/\${EXTEN:2}@carrier_trunk,60,tTo)
exten => _923XXXXXXXXX,3,Hangup

; Dial with leading zero (03001234567)
exten => _03XXXXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _03XXXXXXXXX,2,Dial(SIP/\${EXTEN:1}@carrier_trunk,60,tTo)
exten => _03XXXXXXXXX,3,Hangup` : selectedProvider === 'twilio' ? `; Outbound Dial Plan for Twilio Elastic Trunk
exten => _91NXXNXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _91NXXNXXXXXX,2,Dial(SIP/+1\${EXTEN:2}@twilio_trunk,60,tTo)
exten => _91NXXNXXXXXX,3,Hangup` : `; Outbound Dial Plan for Telnyx
exten => _91NXXNXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)
exten => _91NXXNXXXXXX,2,Dial(SIP/+1\${EXTEN:2}@telnyx_trunk,60,tTo)
exten => _91NXXNXXXXXX,3,Hangup`}
            </pre>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 uppercase tracking-wider block">
              2. Asterisk WebRTC Phone Template (sip.conf)
            </span>
            <p className="text-slate-400">
              For Extension {`1004`} in VICIdial Admin → Phones:
            </p>
            <pre className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono overflow-x-auto text-[11px] leading-relaxed">
{`[1004]
type=friend
username=1004
secret=password123
host=dynamic
context=default
transport=ws,wss
encryption=yes
avpf=yes
force_avp=yes
icesupport=yes
dtlsenable=yes
dtlsverify=no
dtlscertfile=/etc/asterisk/keys/asterisk.pem
dtlscafile=/etc/asterisk/keys/ca.crt
dtlssetup=actpass
disallow=all
allow=opus
allow=ulaw`}
            </pre>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 uppercase tracking-wider block">
              3. Automatic Lead Queueing via Non-Agent API
            </span>
            <p className="text-slate-300">
              Use your existing <code className="text-cyan-400 font-mono">vici_lead_injector.py</code> to inject leads into List 101. The campaign hopper will automatically deliver leads to the WebRTC Agent Station.
            </p>
            <div className="p-2.5 bg-slate-900 rounded text-emerald-400 font-mono text-[11px]">
              $ python vici_lead_injector.py "Apa.csv"
            </div>
          </div>

        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done / Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
