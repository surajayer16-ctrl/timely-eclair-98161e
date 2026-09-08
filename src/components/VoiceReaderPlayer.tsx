import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Gauge,
  Radio,
  SkipForward,
  SkipBack,
  Sparkles,
  Mic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  subscribeVoiceState,
  SpeechState,
  pauseNepaliVoice,
  resumeNepaliVoice,
  stopNepaliVoice,
  nextNepaliSentence,
  prevNepaliSentence,
  setNepaliVoiceSpeed,
  setNepaliVoice,
} from '../lib/nepaliVoiceReader';

export const VoiceReaderPlayer: React.FC = () => {
  const [state, setState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    currentTitle: '',
    currentText: '',
    currentSentence: '',
    currentSentenceIndex: 0,
    totalSentences: 0,
    progressPercent: 0,
    rate: 0.88,
    selectedVoiceURI: null,
    availableVoices: [],
  });

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeVoiceState((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!state.isPlaying && !state.isPaused && !state.error && state.totalSentences === 0) {
    return null;
  }

  const speeds = [
    { label: '०.७५x (धीमो / Slow)', value: 0.75 },
    { label: '०.८८x (प्रस्ट / Clear ⭐)', value: 0.88 },
    { label: '१.०x (सामान्य / Normal)', value: 1.0 },
    { label: '१.१५x (छिटो / Fast)', value: 1.15 },
    { label: '१.३x (अति छिटो / 1.3x)', value: 1.3 },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-3 sm:p-4 shadow-2xl text-white flex flex-col gap-2.5 ring-1 ring-amber-500/20">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2.5">
          {/* Left Info with Audio Equalizer Animation */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/30 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-inner">
              <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-300 ${state.isPlaying ? 'animate-bounce' : 'animate-pulse'}`} />
              {state.isPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Radio className="w-3 h-3 animate-pulse text-amber-300" />
                <span>नेपाली प्रस्ट अडियो वाचक (Studio TTS Engine)</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white truncate">
                {state.currentTitle || 'टेलिकम पाठ सुन्दै...'}
              </h4>
            </div>
          </div>

          {/* Quick Collapse / Expand & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1"
              title={isExpanded ? 'सानो बनाउनुहोस्' : 'विस्तृत हेर्नुहोस्'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={stopNepaliVoice}
              className="p-1.5 bg-slate-800 hover:bg-rose-900/80 text-rose-300 hover:text-white rounded-lg transition-colors border border-rose-800/40"
              title="वाचन बन्द गर्नुहोस् (Stop)"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Current Active Sentence karaoke View (Expanded mode) */}
        {isExpanded && state.currentSentence && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-amber-100 font-medium leading-relaxed shadow-inner animate-fade-in flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="line-clamp-3 text-slate-100 font-semibold tracking-wide">
              {state.currentSentence}
            </p>
          </div>
        )}

        {/* Progress Bar & Sentence Counter */}
        {state.totalSentences > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
              <span className="text-amber-300">
                वाक्य {state.currentSentenceIndex + 1} / {state.totalSentences}
              </span>
              <span>{state.progressPercent}% पूरा भयो</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${state.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Playback Controls & Voice Settings Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          
          {/* Main Controls: Previous / Play-Pause / Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevNepaliSentence}
              disabled={state.currentSentenceIndex <= 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl transition-colors"
              title="अघिल्लो वाक्य (Previous Sentence)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {state.isPlaying ? (
              <button
                onClick={pauseNepaliVoice}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                title="रोक्नुहोस् (Pause)"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>रोक्नुहोस्</span>
              </button>
            ) : (
              <button
                onClick={resumeNepaliVoice}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                title="पुनः सुन्नुहोस् (Resume)"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>सुन्नुहोस्</span>
              </button>
            )}

            <button
              onClick={nextNepaliSentence}
              disabled={state.currentSentenceIndex >= state.totalSentences - 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl transition-colors"
              title="अर्को वाक्य (Next Sentence)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right Tuning: Speed Selector & Voice Selector */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-950 rounded-xl px-2 py-1 border border-slate-800">
              <Gauge className="w-3 h-3 text-amber-400 mr-1" />
              <select
                value={state.rate}
                onChange={(e) => setNepaliVoiceSpeed(parseFloat(e.target.value))}
                className="bg-transparent text-[11px] font-bold text-amber-300 focus:outline-none cursor-pointer"
                title="वाचन गति (Playback Speed)"
              >
                {speeds.map((s) => (
                  <option key={s.value} value={s.value} className="bg-slate-900 text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Model Selector (if available) */}
            {state.availableVoices.length > 1 && (
              <div className="hidden sm:flex items-center bg-slate-950 rounded-xl px-2 py-1 border border-slate-800">
                <Mic className="w-3 h-3 text-cyan-400 mr-1" />
                <select
                  value={state.selectedVoiceURI || ''}
                  onChange={(e) => setNepaliVoice(e.target.value)}
                  className="bg-transparent text-[10px] font-semibold text-slate-300 focus:outline-none cursor-pointer max-w-[120px] truncate"
                  title="आवाजको मोडेल (Voice Model)"
                >
                  {state.availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white">
                      {v.name.length > 20 ? v.name.slice(0, 20) + '...' : v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Sandboxed Iframe/Browser Warning Box if applicable */}
        {state.error && (
          <div className="bg-rose-950/80 border border-rose-800/60 rounded-xl p-2.5 text-[11px] text-rose-200 leading-relaxed font-semibold flex flex-col gap-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase">
              <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>सुरक्षा सङ्केत (Iframe Sandbox Notice)</span>
            </div>
            <p>{state.error}</p>
            <div className="text-[10px] text-amber-300 font-medium bg-amber-950/30 px-2 py-1 rounded border border-amber-900/20 mt-1">
              💡 सुझाव: नयाँ ट्याबमा खोलेपछि आवाज रोक्ने/सुरु गर्ने नियन्त्रणहरू पूर्ण रूपमा काम गर्दछन्।
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

