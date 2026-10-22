import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, Download, Volume2, Search, Filter, ArrowLeft, CheckCircle2, FileText, Sparkles, ShieldCheck } from 'lucide-react';
import { MOCK_RECORDINGS } from '../data/mockData';
import { CallRecording } from '../types';

interface RecordingsViewProps {
  onBack: () => void;
}

export const RecordingsView: React.FC<RecordingsViewProps> = ({ onBack }) => {
  const [recordings, setRecordings] = useState<CallRecording[]>(MOCK_RECORDINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [dispoFilter, setDispoFilter] = useState('');
  const [selectedRec, setSelectedRec] = useState<CallRecording>(MOCK_RECORDINGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [detailsModalRec, setDetailsModalRec] = useState<CallRecording | null>(null);

  // Web Audio Context for generating natural call simulation audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Audio Playback Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedRec.durationSec) {
            setIsPlaying(false);
            stopAudio();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      stopAudio();
    }
    return () => {
      clearInterval(interval);
      stopAudio();
    };
  }, [isPlaying, selectedRec]);

  const startAudioTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Create a soft human vocal frequency envelope (synthesized telephone audio)
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
      
      // Telephone bandpass characteristic simulation
      gain.gain.setValueAtTime(volume * 0.1, audioCtxRef.current.currentTime);
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  const togglePlay = (rec: CallRecording) => {
    if (selectedRec.id === rec.id && isPlaying) {
      setIsPlaying(false);
      stopAudio();
    } else {
      setSelectedRec(rec);
      setCurrentTime(0);
      setIsPlaying(true);
      startAudioTone();
    }
  };

  // Filter recordings
  const filteredRecordings = recordings.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.callerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCampaign = !campaignFilter || r.campaign === campaignFilter;
    const matchesDispo = !dispoFilter || r.disposition === dispoFilter;

    return matchesSearch && matchesCampaign && matchesDispo;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Recording_ID', 'Timestamp', 'Agent', 'Campaign', 'Phone', 'Duration', 'Disposition', 'QA_Score', 'Caller_Name'];
    const rows = filteredRecordings.map(r => [
      r.id,
      r.timestamp,
      `"${r.agent}"`,
      r.campaign,
      r.phone,
      r.duration,
      r.disposition,
      r.qaScore || 0,
      `"${r.callerName}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Grainbox_VICIdial_Recordings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Simulated Audio WAV
  const handleDownloadWav = (rec: CallRecording) => {
    // Generate a simple synthetic WAV header and buffer
    const sampleRate = 8000;
    const numSamples = sampleRate * 3; // 3 seconds sample
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Audio frequency sine modulation
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin((i / sampleRate) * 440 * 2 * Math.PI) * 0.3 * 32767;
      view.setInt16(44 + i * 2, sample, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rec.id}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Return to Gateway"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Call Recordings & QA Dashboard</h2>
              <span className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded font-mono">
                Storage: 4.8 TB
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grainbox · Host: <span className="text-sky-300 font-mono">dialer.gntechnos.com</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CDR (CSV)</span>
          </button>
        </div>
      </div>

      {/* Featured Audio Player Bar */}
      <div className="bg-slate-800/95 border border-teal-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Track Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/50">
                {selectedRec.id}
              </span>
              <span className="text-xs font-bold text-white">{selectedRec.callerName}</span>
              <span className="text-xs text-slate-400 font-mono">({selectedRec.phone})</span>
            </div>
            <p className="text-xs text-slate-300">
              Agent: <strong className="text-white">{selectedRec.agent}</strong> · Campaign: <span className="text-sky-300">{selectedRec.campaign}</span> · Dispo: <strong className="text-emerald-400">{selectedRec.status}</strong>
            </p>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="flex-1 max-w-xl flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => togglePlay(selectedRec)}
                className="w-11 h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Progress Slider */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{selectedRec.duration}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedRec.durationSec}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                  className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 accent-teal-400 h-1 bg-slate-700 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="flex items-center justify-between gap-1 h-6 pt-1">
              {Array.from({ length: 48 }).map((_, i) => {
                const heightPercent = isPlaying
                  ? Math.sin(i * 0.4 + currentTime) * 35 + 50
                  : (i % 5) * 12 + 20;
                return (
                  <div
                    key={i}
                    style={{ height: `${heightPercent}%` }}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      (currentTime / selectedRec.durationSec) * 48 > i
                        ? 'bg-teal-400'
                        : 'bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Action */}
          <div>
            <button
              onClick={() => handleDownloadWav(selectedRec)}
              className="px-3.5 py-2 bg-slate-700/80 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Download WAV</span>
            </button>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Agent name, Phone number, or Lead ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Campaigns</option>
              <option value="SOLAR_OUT_Q4">SOLAR_OUT_Q4</option>
              <option value="INBOUND_CARE">INBOUND_CARE</option>
              <option value="HEALTH_MED_A">HEALTH_MED_A</option>
              <option value="B2B_LEADS_US">B2B_LEADS_US</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={dispoFilter}
              onChange={(e) => setDispoFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Dispositions</option>
              <option value="SALE">SALE (Sale Verified)</option>
              <option value="CALLBK">CALLBK (Call Back)</option>
              <option value="NI">NI (Not Interested)</option>
              <option value="RES">RES (Resolved)</option>
            </select>
          </div>

          <div className="lg:col-span-2 text-right">
            <span className="text-xs font-mono text-slate-400">
              Showing <strong className="text-white">{filteredRecordings.length}</strong> calls
            </span>
          </div>

        </div>
      </div>

      {/* Recordings Table */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Listen</th>
                <th className="py-3.5 px-4">Recording ID</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Agent</th>
                <th className="py-3.5 px-4">Campaign</th>
                <th className="py-3.5 px-4">Customer Phone</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Disposition</th>
                <th className="py-3.5 px-4">QA Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-mono">
              {filteredRecordings.map((rec) => {
                const isCurrent = selectedRec.id === rec.id;
                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-teal-950/30' : 'hover:bg-slate-700/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePlay(rec)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isCurrent && isPlaying
                            ? 'bg-teal-500 text-slate-950'
                            : 'bg-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                        }`}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-teal-300 font-semibold">{rec.id}</td>
                    <td className="py-3 px-4 text-slate-400">{rec.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">{rec.agent}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-700">
                        {rec.campaign}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{rec.phone}</td>
                    <td className="py-3 px-4 text-slate-200">{rec.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.disposition === 'SALE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        rec.disposition === 'CALLBK' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                        'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-400">{rec.qaScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setDetailsModalRec(rec)}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-sans"
                      >
                        QA Notes
                      </button>
                      <button
                        onClick={() => handleDownloadWav(rec)}
                        className="p-1 text-slate-400 hover:text-teal-400 rounded transition-colors"
                        title="Download audio recording WAV"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QA & Call Notes Modal */}
      {detailsModalRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Call Quality & Audit Record</h3>
                <span className="text-xs font-mono text-teal-400">{detailsModalRec.id}</span>
              </div>
              <button
                onClick={() => setDetailsModalRec(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="text-white font-semibold">{detailsModalRec.callerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-white font-mono">{detailsModalRec.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Agent Handling:</span>
                  <span className="text-sky-300">{detailsModalRec.agent} ({detailsModalRec.agentId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-slate-200 font-mono">{detailsModalRec.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QA Score:</span>
                  <span className="text-emerald-400 font-bold font-mono">{detailsModalRec.qaScore}/100 (Pass)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Agent & Verification Notes</label>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/60 text-slate-200 leading-relaxed">
                  {detailsModalRec.notes}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDetailsModalRec(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
