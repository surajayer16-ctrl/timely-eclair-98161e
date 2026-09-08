import React, { useState } from 'react';
import { Activity, AlertOctagon, HelpCircle, CheckCircle2, ChevronRight, Zap, RefreshCw } from 'lucide-react';

interface OtdrEvent {
  id: number;
  distanceMeter: number;
  lossDb: number;
  reflectanceDb: number;
  type: 'initial-pulse' | 'connector' | 'fusion-splice' | 'macro-bend' | 'fiber-break';
  nameNepali: string;
  nameEnglish: string;
  descriptionNepali: string;
  fieldRemedyNepali: string;
  xPercent: number;
  yPercent: number; // trace position
}

export const OtdrSimulator: React.FC = () => {
  const [wavelength, setWavelength] = useState<'1310' | '1550'>('1550');
  const [pulseWidth, setPulseWidth] = useState<string>('30ns');
  const [selectedEventId, setSelectedEventId] = useState<number>(2);

  const events: OtdrEvent[] = [
    {
      id: 1,
      distanceMeter: 0,
      lossDb: 0.35,
      reflectanceDb: -42.0,
      type: 'initial-pulse',
      nameNepali: 'प्रारम्भिक पल्स / लञ्च केबल (Initial Pulse & Launch Connector)',
      nameEnglish: 'Launch Cable Connector',
      descriptionNepali: 'OTDR पोर्टबाट फाइबरमा लेजर पल्स प्रवेश गर्दा हुने रिफ्लेक्सन पिक। यस लगत्तै एटेनुएसन डेड जोन सुरु हुन्छ।',
      fieldRemedyNepali: 'लञ्च केबलको फेरुल सफा राख्ने, ९९% IPA ले वाइप गर्ने।',
      xPercent: 5,
      yPercent: 20,
    },
    {
      id: 2,
      distanceMeter: 350,
      lossDb: 0.02,
      reflectanceDb: 0,
      type: 'fusion-splice',
      nameNepali: 'फ्युजन स्प्लाइस जोर्नी (Fusion Splice Point 1)',
      nameEnglish: 'Non-Reflective Splice Loss',
      descriptionNepali: 'दुई फाइबर कोर पगालेर जोडिएको विन्दु। यसमा रिफ्लेक्सन बिनाको सानो स्टेप ड्रप (Step Drop 0.02 dB) देखिन्छ।',
      fieldRemedyNepali: '०.०२ dB नेपाल टेलिकम मानक अनुसार अत्यन्त उत्कृष्ट छ (Pass)।',
      xPercent: 28,
      yPercent: 32,
    },
    {
      id: 3,
      distanceMeter: 820,
      lossDb: 0.45,
      reflectanceDb: 0,
      type: 'macro-bend',
      nameNepali: 'म्याक्रो बेन्डिङ / बढी मोडिएको (Macro-Bend Fault)',
      nameEnglish: 'Bending Loss (Macro-Bend)',
      descriptionNepali: 'फाइबरलाई तोकिएको न्यूनतम रेडियस (R < 30mm) भन्दा बढी मोडिँदा प्रकाश चुहिएर अचानक लस बढेको अवस्था।',
      fieldRemedyNepali: 'स्प्लाइस ट्रे वा ओजेसीमा फाइबरलाई खुकुलो पार्ने र ३०mm भन्दा ठूलो घेरामा लुपिङ गर्ने।',
      xPercent: 52,
      yPercent: 50,
    },
    {
      id: 4,
      distanceMeter: 1400,
      lossDb: 0.28,
      reflectanceDb: -38.5,
      type: 'connector',
      nameNepali: 'FDC / प्याच प्यानल कनेक्टर (Patch Panel Connector)',
      nameEnglish: 'Reflective Connector Event',
      descriptionNepali: 'क्याबिनेट वा ODF मा रहेको SC/APC वा FC कनेक्टर। यसमा उचाइ भएको रिफ्लेक्टिभ पिक र त्यसपछि लस देखिन्छ।',
      fieldRemedyNepali: 'यदि रिफ्लेक्ट्यान्स बढी भएमा कनेक्टरमा धूलो हुनसक्छ; क्लिनिङ स्वाबले सफा गर्ने।',
      xPercent: 74,
      yPercent: 62,
    },
    {
      id: 5,
      distanceMeter: 1850,
      lossDb: 99.9,
      reflectanceDb: -22.0,
      type: 'fiber-break',
      nameNepali: 'फाइबर टुटेको / अन्त्य (Fiber Break / End of Fiber)',
      nameEnglish: 'Fiber Break / Fresnel Cliff Drop',
      descriptionNepali: 'केबल काटिएको वा लाइन समाप्त भएको ठाउँ। ठूलो रिफ्लेक्सन पिक पछि सिधै न्वाइज फ्लोरमा ठाडो झर्छ (Total Cliff Drop)।',
      fieldRemedyNepali: 'ठ्याक्कै १८५० मिटरको दूरीमा सडक वा पोलमा पुगेर नयाँ ओजेसी स्प्लाइसिङ गर्नुपर्छ।',
      xPercent: 92,
      yPercent: 88,
    },
  ];

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 rounded-full mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>OTDR Optical Trace Analyzer</span>
          </div>
          <h3 className="text-xl font-bold text-white">ओटीडीआर ट्रेस सिमुलेटर (OTDR Trace Simulator)</h3>
          <p className="text-xs text-slate-400">
            रिफ्लेक्टिभ पिक (Connector), स्टेप ड्रप (Splice Loss), म्याक्रो-बेन्ड र केबल ब्रेक (Fiber Cut) प्रत्यक्ष विश्लेषण।
          </p>
        </div>

        {/* Wavelength & Pulse Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 px-1">तरङ्ग (λ):</span>
            <button
              onClick={() => setWavelength('1310')}
              className={`px-2 py-1 rounded-lg font-mono font-bold ${
                wavelength === '1310' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1310 nm
            </button>
            <button
              onClick={() => setWavelength('1550')}
              className={`px-2 py-1 rounded-lg font-mono font-bold ${
                wavelength === '1550' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1550 nm
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 px-1">पल्स:</span>
            <select
              value={pulseWidth}
              onChange={(e) => setPulseWidth(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-mono font-bold"
            >
              <option value="10ns">10 ns</option>
              <option value="30ns">30 ns</option>
              <option value="100ns">100 ns</option>
              <option value="1µs">1 µs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Screen Frame of the OTDR with Interactive SVG Waveform */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner space-y-4">
        
        {/* Top Digital Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-cyan-300 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <div>कुल लम्बाइ: <strong className="text-white">१.८५० km (1850 m)</strong></div>
          <div>तरङ्ग लम्बाइ: <strong className="text-amber-400">{wavelength} nm</strong></div>
          <div>पल्स चौडाइ: <strong className="text-white">{pulseWidth}</strong></div>
          <div>औसत लस (Attenuation): <strong className="text-emerald-400">०.२२ dB/km</strong></div>
        </div>

        {/* Interactive SVG Trace Area */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 rounded-xl border border-cyan-900/40 p-2 overflow-hidden">
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* SVG Waveform Curve */}
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Axis gridlines */}
            <line x1="50" y1="20" x2="50" y2="280" stroke="#334155" strokeDasharray="2,2" />
            <line x1="50" y1="280" x2="950" y2="280" stroke="#334155" />

            {/* Trace Waveform Line */}
            {/* Event 1: Initial Peak at (50, 40) -> slopes down to (280, 90) */}
            {/* Event 2: Splice step at (280, 100) -> slopes to (520, 140) */}
            {/* Event 3: Macro-bend drop at (520, 175) -> slopes to (740, 205) */}
            {/* Event 4: Connector Peak at (740, 150) -> drop to (750, 220) -> slope to (920, 245) */}
            {/* Event 5: Fiber End Peak at (920, 130) -> cliff drop to (930, 280) */}
            <path
              d="M 50 120 L 55 30 L 65 65 L 280 95 L 282 105 L 520 135 L 535 175 L 740 200 L 745 130 L 755 220 L 920 240 L 925 100 L 935 280 L 950 280"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_#38bdf8]"
            />
          </svg>

          {/* Clickable Event Markers on the Trace */}
          {events.map((evt) => {
            const isSelected = evt.id === selectedEventId;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                style={{
                  left: `${evt.xPercent}%`,
                  top: `${evt.yPercent}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'w-8 h-8 bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_#f59e0b] scale-110 z-20'
                    : 'w-6 h-6 bg-slate-800 text-cyan-300 border border-cyan-500/60 hover:scale-110 z-10'
                }`}
              >
                <span className="text-[10px]">{evt.id}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Event Details Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md">
                इभेन्ट #{activeEvent.id}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-white">{activeEvent.nameNepali}</h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">दूरी: <strong className="text-cyan-300">{activeEvent.distanceMeter} मिटर</strong></span>
              <span className="text-slate-400">लस: <strong className="text-amber-400">{activeEvent.lossDb} dB</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <strong className="text-slate-300 block mb-1">ट्रेस विश्लेषण (Waveform Analysis):</strong>
              <p className="text-slate-300 leading-relaxed">{activeEvent.descriptionNepali}</p>
            </div>
            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/50">
              <strong className="text-amber-300 block mb-1">फिल्ड मर्मत तथा समाधान (Field Remedy):</strong>
              <p className="text-amber-200/90 leading-relaxed">{activeEvent.fieldRemedyNepali}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
