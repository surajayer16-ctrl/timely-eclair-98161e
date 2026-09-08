import React, { useState } from 'react';
import {
  Network,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Shield,
  HelpCircle,
  Calculator,
  Compass,
  Zap,
  Phone,
  Server,
  Wifi,
  Radio,
  Share2,
  Palette,
  Ruler,
  FileText
} from 'lucide-react';
import { OutsideNetworkSymbolSvg } from './OutsideNetworkSymbolSvg';
import { outsideNetworkSymbolsList } from '../data/telecomOutsideSymbolsData';

export const InteractiveExamDiagrams: React.FC = () => {
  const [selectedDiagram, setSelectedDiagram] = useState<
    'pickup-joint' | 'primary-survey' | 'secondary-network' | 'lan-network' | 'ftth-survey' | 'color-codes' | 'clearance-standards' | 'symbols-catalog' | 'math-formulas'
  >('secondary-network');

  const [symbolCategory, setSymbolCategory] = useState<'all' | 'copper' | 'ftth'>('all');
  const [symbolSearch, setSymbolSearch] = useState('');

  // Math calculator states
  const [loopResCableLen, setLoopResCableLen] = useState<number>(1.5);
  const [loopResWireSize, setLoopResWireSize] = useState<number>(120); // 120 ohm/km for 0.4mm
  const [capTotal, setCapTotal] = useState<number>(50); // nF
  const [capPerKm, setCapPerKm] = useState<number>(50); // nF/km
  const [attenLen, setAttenLen] = useState<number>(5); // km
  const [attenRate, setAttenRate] = useState<number>(2); // 2 dB/km
  const [dropRes, setDropRes] = useState<number>(29); // ohm
  const [dropResPerM, setDropResPerM] = useState<number>(0.058); // ohm/m

  // Filtered symbols
  const filteredSymbols = outsideNetworkSymbolsList.filter((item) => {
    const matchesCat = symbolCategory === 'all' || 
      (symbolCategory === 'copper' && (item.category === 'joint' || item.category === 'dp' || item.category === 'pole')) ||
      (symbolCategory === 'ftth' && (item.category === 'outside-plant' || item.category === 'exchange' || item.category === 'underground'));
    const matchesSearch =
      symbolSearch === '' ||
      item.nameNepali.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      item.nameEnglish.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      item.descriptionNepali.toLowerCase().includes(symbolSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-950 text-blue-400 border border-blue-800/80 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                <span>CTEVT / NSTB आधिकारिक रेखाचित्र संग्रह</span>
              </span>
              <span className="bg-amber-950 text-amber-300 border border-amber-800/80 text-xs font-bold px-2.5 py-0.5 rounded-full">
                सचित्र परीक्षा तयारी
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              टेलिकम नेटवर्क डायग्राम, कलर कोड तथा प्राविधिक नक्सा
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              लिखित परीक्षा (विषयगत), प्रयोगात्मक (Practical) तथा मौखिक (Viva) मा सोधिने सबै ९ प्रकारका मुख्य रेखाचित्र र मापदण्डहरू
            </p>
          </div>
        </div>

        {/* Diagram Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'secondary-network', label: '१. सेकेन्डरी नेटवर्क डायग्राम', icon: '🏢' },
            { id: 'primary-survey', label: '२. प्राइमरी सर्भे नक्सा', icon: '🗺️' },
            { id: 'pickup-joint', label: '३. पिक-अप ज्वाइन्ट', icon: '🔌' },
            { id: 'lan-network', label: '४. कम्प्युटर LAN नेटवर्क', icon: '💻' },
            { id: 'ftth-survey', label: '५. FTTH सर्भे तथा ग्वार्को नक्सा', icon: '⚡' },
            { id: 'color-codes', label: '६. फाइबर/कपर कलर कोड', icon: '🎨' },
            { id: 'clearance-standards', label: '७. सुरक्षित दूरी व उचाइ', icon: '📏' },
            { id: 'math-formulas', label: '८. प्राविधिक हिसाब/सूत्र', icon: '🧮' },
            { id: 'symbols-catalog', label: '९. टेलिकम बाह्य संकेतहरू', icon: '📐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDiagram(tab.id as any)}
              className={`p-3 rounded-xl border text-left transition-all text-xs font-bold flex items-center gap-2 ${
                selectedDiagram === tab.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg ring-2 ring-blue-400/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          1. SECONDARY NETWORK DIAGRAM (EXCHANGE TO CUSTOMER)
          ========================================================================= */}
      {selectedDiagram === 'secondary-network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                लिखित परीक्षा सेट २ (Q9) तथा सेट ४ (Q4)
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                Exchange देखि ग्राहकको घरसम्मको Secondary Network Diagram
              </h4>
              <p className="text-xs text-slate-400">
                Primary Network (Underground) → Cabinet → Secondary Network (Aerial) → Subscriber Distribution
              </p>
            </div>
          </div>

          {/* Detailed SVG Diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg viewBox="0 0 1050 480" className="w-full min-w-[850px] h-auto font-sans">
              <defs>
                <linearGradient id="primaryNetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="secondaryNetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="subscriberNetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Background section bands */}
              <rect x="20" y="20" width="300" height="430" rx="12" fill="url(#primaryNetGrad)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
              <rect x="330" y="20" width="410" height="430" rx="12" fill="url(#secondaryNetGrad)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4,4" />
              <rect x="750" y="20" width="280" height="430" rx="12" fill="url(#subscriberNetGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />

              {/* Section Labels */}
              <text x="170" y="45" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">PRIMARY NETWORK (प्राइमरी नेटवर्क)</text>
              <text x="535" y="45" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">SECONDARY NETWORK (सेकेन्डरी नेटवर्क)</text>
              <text x="890" y="45" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="bold">SUBSCRIBER NETWORK (ग्राहक वितरण)</text>

              {/* NODE 1: Exchange / MDF */}
              <g transform="translate(40, 80)">
                <rect x="0" y="0" width="90" height="150" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <rect x="10" y="15" width="70" height="40" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="45" y="32" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">EXCHANGE</text>
                <text x="45" y="46" textAnchor="middle" fill="#94a3b8" fontSize="8">(एक्सचेन्ज)</text>
                {/* MDF Section */}
                <rect x="10" y="65" width="70" height="70" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="20" y1="80" x2="70" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="20" y1="95" x2="70" y2="95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="20" y1="110" x2="70" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                <text x="45" y="125" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="bold">MDF</text>
                <text x="45" y="165" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">Telephone Exchange</text>
              </g>

              {/* Cable Underground Path */}
              <path d="M 130 200 L 160 200 L 160 360 L 370 360 L 370 200" fill="none" stroke="#f43f5e" strokeWidth="3.5" />
              <text x="210" y="350" fill="#fda4af" fontSize="10" fontWeight="bold">Underground Cable (Primary)</text>

              {/* NODE 2: Manhole / Handhole */}
              <g transform="translate(180, 315)">
                <rect x="0" y="0" width="55" height="75" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="8" y="10" width="39" height="55" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
                <text x="27" y="38" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">MANHOLE</text>
                <text x="27" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8">म्यान्होल</text>
              </g>

              <g transform="translate(265, 325)">
                <rect x="0" y="0" width="45" height="55" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="6" y="8" width="33" height="39" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
                <text x="22" y="27" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">HANDHOLE</text>
                <text x="22" y="40" textAnchor="middle" fill="#94a3b8" fontSize="7">ह्यान्डहोल</text>
              </g>

              {/* NODE 3: Cabinet (FDC / Cross Connection Point) */}
              <g transform="translate(345, 120)">
                <rect x="0" y="0" width="50" height="95" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                <rect x="8" y="10" width="34" height="75" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
                <line x1="25" y1="10" x2="25" y2="85" stroke="#34d399" strokeWidth="1" />
                <text x="25" y="45" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">CABINET</text>
                <text x="25" y="58" textAnchor="middle" fill="#ffffff" fontSize="8">FDC</text>
                <text x="25" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">क्याबिनेट (FDC)</text>
              </g>

              {/* Aerial Cable to Riser Pole */}
              <path d="M 395 160 L 440 160 L 440 100 L 710 100" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <text x="500" y="90" fill="#38bdf8" fontSize="10" fontWeight="bold">Aerial Cable (सेकेन्डरी केबल)</text>

              {/* NODE 4: Riser Pole */}
              <g transform="translate(425, 95)">
                <line x1="15" y1="5" x2="15" y2="280" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="15" cy="5" r="5" fill="#f59e0b" />
                <text x="15" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Riser Pole</text>
                <text x="15" y="307" textAnchor="middle" fill="#94a3b8" fontSize="7">(राइजर् पोल)</text>
              </g>

              {/* NODE 5: Intermediate Pole */}
              <g transform="translate(540, 95)">
                <line x1="15" y1="5" x2="15" y2="280" stroke="#94a3b8" strokeWidth="3.5" />
                <circle cx="15" cy="5" r="5" fill="#38bdf8" />
                <text x="15" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Intermediate</text>
                <text x="15" y="307" textAnchor="middle" fill="#94a3b8" fontSize="7">(मध्यम पोल)</text>
              </g>

              {/* NODE 6: Terminal / End Pole with DP */}
              <g transform="translate(680, 95)">
                <line x1="15" y1="5" x2="15" y2="280" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="15" cy="5" r="5" fill="#10b981" />
                {/* DP Box on Pole */}
                <rect x="2" y="35" width="26" height="35" rx="3" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.5" />
                <text x="15" y="52" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">DP</text>
                <text x="15" y="63" textAnchor="middle" fill="#bae6fd" fontSize="7">10-20P</text>
                <text x="15" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Terminal/DP Pole</text>
                <text x="15" y="307" textAnchor="middle" fill="#94a3b8" fontSize="7">(अन्तिम पोल)</text>
              </g>

              {/* Drop Wire from DP to Customer House */}
              <path d="M 708 140 Q 750 170 800 170" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3,2" />
              <text x="755" y="155" fill="#4ade80" fontSize="9" fontWeight="bold">Drop Wire (ड्रप वायर)</text>

              {/* NODE 7: Customer House / Premise */}
              <g transform="translate(790, 110)">
                {/* House Outline */}
                <polygon points="40,10 10,40 70,40" fill="#b91c1c" stroke="#f87171" strokeWidth="1" />
                <rect x="15" y="40" width="50" height="50" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                <rect x="32" y="60" width="16" height="30" fill="#0f172a" />
                <text x="40" y="105" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">Customer House</text>
                <text x="40" y="117" textAnchor="middle" fill="#94a3b8" fontSize="8">(ग्राहकको घर)</text>

                {/* Rosette Box */}
                <rect x="85" y="30" width="40" height="30" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="105" y="46" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">ROSETTE</text>
                <text x="105" y="55" textAnchor="middle" fill="#cbd5e1" fontSize="7">(रोजेट बक्स)</text>

                {/* ADSL Splitter */}
                <rect x="140" y="30" width="45" height="30" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="162" y="46" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">SPLITTER</text>
                <text x="162" y="55" textAnchor="middle" fill="#fde68a" fontSize="7">(स्प्लिटर)</text>

                {/* Wiring inside */}
                <path d="M 65 45 L 85 45" stroke="#10b981" strokeWidth="2" />
                <path d="M 125 45 L 140 45" stroke="#10b981" strokeWidth="2" />

                {/* Telephone Device */}
                <g transform="translate(200, 15)">
                  <rect x="0" y="0" width="38" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="19" y="15" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">PHONE</text>
                  <text x="19" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="6">टेलिफोन</text>
                  <path d="M -15 22 L 0 14" stroke="#38bdf8" strokeWidth="1.5" />
                </g>

                {/* Wi-Fi Router / ONT */}
                <g transform="translate(200, 55)">
                  <rect x="0" y="0" width="38" height="28" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="8" y1="0" x2="2" y2="-8" stroke="#10b981" strokeWidth="2" />
                  <line x1="30" y1="0" x2="36" y2="-8" stroke="#10b981" strokeWidth="2" />
                  <text x="19" y="15" textAnchor="middle" fill="#4ade80" fontSize="7" fontWeight="bold">ROUTER</text>
                  <text x="19" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="6">राउटर/WiFi</text>
                  <path d="M -15 -10 L 0 14" stroke="#10b981" strokeWidth="1.5" />
                </g>
              </g>

              {/* Bottom Flow Summary Arrow */}
              <g transform="translate(50, 435)">
                <rect x="0" y="0" width="950" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="475" y="18" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                  प्रवाह क्रम: Exchange (MDF) ➔ Manhole/Handhole ➔ Cabinet ➔ Riser Pole ➔ Intermediate Pole ➔ DP Box ➔ Drop Wire ➔ Rosette ➔ Splitter ➔ Phone / Router
                </text>
              </g>
            </svg>
          </div>

          {/* Key Flow and Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block border-b border-slate-800 pb-1">
                १. प्राइमरी नेटवर्क (Primary Side):
              </span>
              <p className="text-slate-300 leading-relaxed">
                एक्सचेन्जको MDF (Number Side) बाट Jumper गरी Primary Cable मार्फत जमिनमुनि (Underground) Manhole र Handhole हुँदै क्याबिनेट (Cabinet/FDC) सम्म पुर्‍याइन्छ।
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block border-b border-slate-800 pb-1">
                २. सेकेन्डरी नेटवर्क (Secondary Side):
              </span>
              <p className="text-slate-300 leading-relaxed">
                क्याबिनेटमा Primary बाट Secondary तर्फ Jumper गरी Riser Pole बाट हावामा (Aerial) लगिन्छ र Intermediate पोलहरू हुँदै अन्तिम DP पोलमा पुग्छ।
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1">
                ३. ग्राहक वितरण (Subscriber Network):
              </span>
              <p className="text-slate-300 leading-relaxed">
                DP बक्सबाट २-कोर ड्रप वायर (Drop Wire) द्वारा ग्राहकको घरको रोजेट बक्समा जोडिन्छ र स्प्लिटर मार्फत भ्वाइस (फोन) र डाटा (राउटर) मा विभाजन गरिन्छ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. PRIMARY NETWORK PLANNING SURVEY DIAGRAM (PAGES 10, 11)
          ========================================================================= */}
      {selectedDiagram === 'primary-survey' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
                लिखित परीक्षा सेट २ (Q1)
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                Primary Network Planning Survey Diagram (MDF to 2 Cabinets)
              </h4>
              <p className="text-xs text-slate-400">
                Main Distribution Frame (MDF) र दुईवटा क्याबिनेट (Cabinet A & B) प्रयोग गरी नेटवर्क योजना तथा सर्भे नक्सा
              </p>
            </div>
          </div>

          {/* SVG Survey Layout */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg viewBox="0 0 950 420" className="w-full min-w-[780px] h-auto font-sans">
              {/* MDF Root */}
              <g transform="translate(375, 20)">
                <rect x="0" y="0" width="200" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="100" y="26" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">MAIN DISTRIBUTION FRAME</text>
                <text x="100" y="46" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="bold">( MDF )</text>
              </g>

              {/* Feeder Lines Left and Right */}
              <path d="M 425 80 L 425 120 L 220 120 L 220 160" fill="none" stroke="#f43f5e" strokeWidth="3" />
              <path d="M 525 80 L 525 120 L 730 120 L 730 160" fill="none" stroke="#f43f5e" strokeWidth="3" />

              <text x="290" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">100 PAIR Primary Cable</text>
              <text x="590" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">100 PAIR Primary Cable</text>

              {/* Cabinet 1 (Left) */}
              <g transform="translate(130, 160)">
                <rect x="0" y="0" width="180" height="65" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                <text x="90" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">CABINET - 1 (क्याबिनेट-A)</text>
                <text x="90" y="42" textAnchor="middle" fill="#a7f3d0" fontSize="10">100 PAIR DISTRIBUTION</text>
                <text x="90" y="56" textAnchor="middle" fill="#6ee7b7" fontSize="9">FRAME ( DP )</text>
              </g>

              {/* Cabinet 2 (Right) */}
              <g transform="translate(640, 160)">
                <rect x="0" y="0" width="180" height="65" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                <text x="90" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">CABINET - 2 (क्याबिनेट-B)</text>
                <text x="90" y="42" textAnchor="middle" fill="#a7f3d0" fontSize="10">100 PAIR DISTRIBUTION</text>
                <text x="90" y="56" textAnchor="middle" fill="#6ee7b7" fontSize="9">FRAME ( DP )</text>
              </g>

              {/* Secondary Cables from Cabinet 1 */}
              <path d="M 160 225 L 80 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 200 225 L 170 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 240 225 L 260 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 280 225 L 340 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />

              {/* Secondary Cables from Cabinet 2 */}
              <path d="M 670 225 L 610 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 710 225 L 700 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 750 225 L 790 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 790 225 L 880 320" fill="none" stroke="#0284c7" strokeWidth="2.5" />

              <text x="100" y="270" fill="#38bdf8" fontSize="9" fontWeight="bold">20 PAIR Distribution</text>
              <text x="810" y="270" fill="#38bdf8" fontSize="9" fontWeight="bold">20 PAIR Distribution</text>

              {/* Subscriber Houses Row Left */}
              {[60, 150, 240, 320].map((xPos, idx) => (
                <g key={idx} transform={`translate(${xPos}, 320)`}>
                  <polygon points="20,0 0,15 40,15" fill="#e11d48" />
                  <rect x="5" y="15" width="30" height="25" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
                  <rect x="15" y="25" width="10" height="15" fill="#0f172a" />
                  <text x="20" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8">Sub-{idx + 1}</text>
                </g>
              ))}

              {/* Subscriber Houses Row Right */}
              {[590, 680, 770, 860].map((xPos, idx) => (
                <g key={idx} transform={`translate(${xPos}, 320)`}>
                  <polygon points="20,0 0,15 40,15" fill="#e11d48" />
                  <rect x="5" y="15" width="30" height="25" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
                  <rect x="15" y="25" width="10" height="15" fill="#0f172a" />
                  <text x="20" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8">Sub-{idx + 5}</text>
                </g>
              ))}

              {/* Legend Box in Center Bottom */}
              <g transform="translate(380, 260)">
                <rect x="0" y="0" width="190" height="110" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="15" y="20" fill="#f59e0b" fontSize="10" fontWeight="bold">संकेत सूची (Legend):</text>
                <line x1="15" y1="35" x2="45" y2="35" stroke="#f43f5e" strokeWidth="2.5" />
                <text x="55" y="38" fill="#cbd5e1" fontSize="8.5">Primary Cable (100 Pair)</text>
                <line x1="15" y1="55" x2="45" y2="55" stroke="#0284c7" strokeWidth="2.5" />
                <text x="55" y="58" fill="#cbd5e1" fontSize="8.5">Distribution Cable (20 Pair)</text>
                <line x1="15" y1="75" x2="45" y2="75" stroke="#10b981" strokeWidth="2" strokeDasharray="3,2" />
                <text x="55" y="78" fill="#cbd5e1" fontSize="8.5">Drop Wire (To Home)</text>
                <text x="15" y="98" fill="#94a3b8" fontSize="7.5">MFD = Main Distribution Frame</text>
              </g>
            </svg>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-amber-400 block">सर्भे गर्दा लेख्ने मुख्य विवरण तालिका (Survey Key Specifications):</span>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-800 text-left">
                <thead>
                  <tr className="bg-slate-900 text-slate-300">
                    <th className="border border-slate-800 p-2">विवरण (Field Parameter)</th>
                    <th className="border border-slate-800 p-2">नमुना मान (Sample Value)</th>
                    <th className="border border-slate-800 p-2">प्राविधिक टिप्पणी</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold text-white">Cabinet No.</td>
                    <td className="border border-slate-800 p-2 font-mono text-emerald-400">DP-01 (Cabinet-08 / Cabinet-09)</td>
                    <td className="border border-slate-800 p-2">मुख्य सडक चोकमा राखिने फिडर क्याबिनेट</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold text-white">स्थान (Location)</td>
                    <td className="border border-slate-800 p-2">Lagankhel, Imadol, Gwarko Chok</td>
                    <td className="border border-slate-800 p-2">जनघनत्व र सडक पहुँच भएको क्षेत्र</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold text-white">Secondary Cable</td>
                    <td className="border border-slate-800 p-2">20 Pair / 30 Pair (0.4mm)</td>
                    <td className="border border-slate-800 p-2">पोलमा टाङ्गिने वितरण केबल</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold text-white">Serving DP Poles</td>
                    <td className="border border-slate-800 p-2">६ वटा पोलहरू (DP-1, DP-2, DP-3)</td>
                    <td className="border border-slate-800 p-2">प्रत्येक पोलबाट ४-८ ग्राहकमा सेवा प्रवाह</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. PICK-UP JOINT DIAGRAM (PAGE 2)
          ========================================================================= */}
      {selectedDiagram === 'pickup-joint' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                लिखित परीक्षा सेट १ (Q3)
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                पिक-अप ज्वाइन्ट (Pick-up Joint) सचित्र रेखाचित्र
              </h4>
              <p className="text-xs text-slate-400">
                मुख्य कपर केबल (१५०x०.४मिमी) बाट आवश्यक ३०x०.४मिमी जोडी छुट्ट्याएर अर्को लाइनतर्फ जोड्ने विधि
              </p>
            </div>
          </div>

          {/* SVG Visualization */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg viewBox="0 0 900 320" className="w-full min-w-[700px] h-auto font-sans">
              {/* Main Cable In */}
              <g transform="translate(40, 130)">
                <rect x="0" y="0" width="280" height="24" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="140" y="-15" textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="bold">
                  मुख्य Copper Cable (१५० × ०.४ मिमी)
                </text>
                <text x="140" y="16" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  150X0.4mm (Main Inflow)
                </text>
              </g>

              {/* Pick-up Joint Node in Center */}
              <g transform="translate(320, 110)">
                <polygon points="0,32 50,0 120,0 170,32 120,64 50,64" fill="#047857" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="85" cy="32" r="14" fill="#0f172a" stroke="#fcd34d" strokeWidth="2" />
                <text x="85" y="37" textAnchor="middle" fill="#fcd34d" fontSize="14" fontWeight="bold">✂️</text>
                <text x="85" y="-15" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">
                  Pick-up Joint (पिक-अप जोड)
                </text>
              </g>

              {/* Main Cable Continuation Out */}
              <g transform="translate(490, 130)">
                <rect x="0" y="0" width="280" height="24" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="140" y="16" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  150X0.4mm (Main Throughflow)
                </text>
                <text x="140" y="45" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  बाँकी चालू लाइन (Through Cable)
                </text>
              </g>

              {/* Tapped Branch Cable Going Upward */}
              <path d="M 405 110 L 520 40 L 760 40" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
              <g transform="translate(520, 20)">
                <rect x="0" y="0" width="240" height="20" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="120" y="14" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  ग्राहक / अर्को लाइन (३० × ०.४ मिमी)
                </text>
                <text x="120" y="-10" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
                  30X0.4mm Branch Line
                </text>
              </g>

              {/* Callout box */}
              <g transform="translate(100, 220)">
                <rect x="0" y="0" width="700" height="65" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="20" y="24" fill="#34d399" fontSize="11" fontWeight="bold">
                  पिक-अप जोइन्ट परिभाषा: Pick-up Joint = मुख्य केबलबाट आवश्यक Pair निकालेर अर्को लाइनमा जोड्ने।
                </text>
                <text x="20" y="45" fill="#cbd5e1" fontSize="10">
                  उदाहरण: मुख्य Telephone Cable बाट कुनै ग्राहकलाई नयाँ Telephone Line दिनुपर्दा आवश्यक Pair Pick-up Joint गरेर ग्राहकको लाइनमा जोडिन्छ।
                </text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-400 block">पिक-अप जोइन्टका फाइदाहरू:</span>
              <ul className="list-disc pl-5 text-slate-300 space-y-1">
                <li>मुख्य केबल पूरै काट्नु नपर्ने हुनाले अरु चालू ग्राहकको सेवा अवरुद्ध हुँदैन।</li>
                <li>एक्सचेन्जबाट नयाँ लामो केबल तानिरहनु पर्दैन; बीचबाटै लाइन वितरण गर्न सकिन्छ।</li>
                <li>सामग्री र श्रम लागतमा भारी बचत हुन्छ।</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-400 block">सावधानीहरू (Precaution):</span>
              <ul className="list-disc pl-5 text-slate-300 space-y-1">
                <li>केबलको सिथ खोल्दा भित्रका चालू तार काटिनबाट जोगाउन Sheath Cutter सतर्कतापूर्वक चलाउने।</li>
                <li>जोडेका तारहरूलाई UY Connector द्वारा क्रिम्प गरी जोइन्ट स्लिभले पूर्ण वाटरप्रुफ बनाउने।</li>
                <li>कुन पेयर निकालिएको हो सो विवरण क्याबिनेट लगबुकमा दुरुस्त अभिलेख राख्ने।</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. COMPUTER LOCAL AREA NETWORK (LAN) DIAGRAM (PAGES 19, 20)
          ========================================================================= */}
      {selectedDiagram === 'lan-network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-sky-400 bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800">
                लिखित परीक्षा सेट ३ (Q2)
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                Computer Network - Local Area Network (LAN) रेखाचित्र
              </h4>
              <p className="text-xs text-slate-400">
                सिमित भौगोलिक क्षेत्र (घर, कार्यालय वा विद्यालय) भित्र स्विच/राउटरद्वारा कम्प्युटर, प्रिन्टर र वायरलेस डिभाइस जोड्ने संरचना
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg viewBox="0 0 900 420" className="w-full min-w-[700px] h-auto font-sans">
              {/* Internet Cloud */}
              <g transform="translate(380, 20)">
                <rect x="0" y="0" width="140" height="40" rx="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="70" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">🌐 INTERNET</text>
              </g>

              {/* Modem / ONT */}
              <g transform="translate(390, 85)">
                <rect x="0" y="0" width="120" height="40" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="20" y1="10" x2="20" y2="3" stroke="#f59e0b" strokeWidth="2" />
                <line x1="100" y1="10" x2="100" y2="3" stroke="#f59e0b" strokeWidth="2" />
                <text x="60" y="24" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="bold">Modem / ONT</text>
              </g>

              <path d="M 450 60 L 450 85" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
              <path d="M 450 125 L 450 160" stroke="#f59e0b" strokeWidth="2.5" />

              {/* Central Switch / Hub */}
              <g transform="translate(350, 160)">
                <rect x="0" y="0" width="200" height="55" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                {/* Ports */}
                {[20, 45, 70, 95, 120, 145, 170].map((pX, idx) => (
                  <rect key={idx} x={pX} y="32" width="14" height="12" fill="#022c22" stroke="#34d399" strokeWidth="1" />
                ))}
                <text x="100" y="22" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  SWITCH / HUB (स्विच)
                </text>
              </g>

              {/* LAN Cabling Branches */}
              <path d="M 370 215 L 140 300" stroke="#3b82f6" strokeWidth="2.5" />
              <path d="M 420 215 L 300 300" stroke="#3b82f6" strokeWidth="2.5" />
              <path d="M 480 215 L 480 300" stroke="#3b82f6" strokeWidth="2.5" />
              <path d="M 530 215 L 660 300" stroke="#3b82f6" strokeWidth="2.5" />

              {/* Wireless Links */}
              <path d="M 540 175 Q 650 140 760 180" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
              <path d="M 540 195 Q 680 200 780 280" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />

              {/* Node 1: PC 1 */}
              <g transform="translate(90, 300)">
                <rect x="0" y="0" width="90" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="15" y="10" width="60" height="35" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <text x="45" y="32" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">PC 1</text>
                <text x="45" y="75" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Computer 1</text>
              </g>

              {/* Node 2: PC 2 */}
              <g transform="translate(250, 300)">
                <rect x="0" y="0" width="90" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="15" y="10" width="60" height="35" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <text x="45" y="32" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">PC 2</text>
                <text x="45" y="75" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Computer 2</text>
              </g>

              {/* Node 3: Network Printer */}
              <g transform="translate(435, 300)">
                <rect x="0" y="0" width="90" height="60" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="20" y="12" width="50" height="20" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                <rect x="25" y="35" width="40" height="15" fill="#0f172a" />
                <text x="45" y="75" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Network Printer</text>
                <text x="45" y="87" textAnchor="middle" fill="#94a3b8" fontSize="8">(साझा प्रिन्टर)</text>
              </g>

              {/* Node 4: PC 3 */}
              <g transform="translate(615, 300)">
                <rect x="0" y="0" width="90" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="15" y="10" width="60" height="35" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <text x="45" y="32" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">PC 3</text>
                <text x="45" y="75" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">Computer 3</text>
              </g>

              {/* Wireless Devices Right */}
              <g transform="translate(740, 150)">
                <rect x="0" y="0" width="80" height="50" rx="4" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5" />
                <text x="40" y="25" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="bold">💻 Laptop</text>
                <text x="40" y="40" textAnchor="middle" fill="#c084fc" fontSize="8">(Wi-Fi)</text>
              </g>

              <g transform="translate(760, 260)">
                <rect x="0" y="0" width="55" height="75" rx="6" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5" />
                <text x="27" y="35" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="bold">📱 Mobile</text>
                <text x="27" y="50" textAnchor="middle" fill="#c084fc" fontSize="7">(Wi-Fi)</text>
              </g>
            </svg>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-sky-400 block mb-1">LAN को छोटो परिभाषा र मुख्य उद्देश्य:</span>
            सानो भौगोलिक क्षेत्र (जस्तै घर, कार्यालय, ल्याब वा भवन) भित्र रहेका कम्प्युटर, ल्यापटप, प्रिन्टर र मोबाइलहरूलाई तार (RJ-45 / CAT-6) वा वाइफाइ (Wi-Fi) मार्फत एकआपसमा जोडेर डेटा, फाइल तथा इन्टरनेट साझा (Resource Sharing) गर्न बनाइएको नेटवर्कलाई <strong>Local Area Network (LAN)</strong> भनिन्छ।
          </div>
        </div>
      )}

      {/* =========================================================================
          5. FTTH SURVEY DIAGRAM & GWARKO AREA MAP (PAGES 23, 24)
          ========================================================================= */}
      {selectedDiagram === 'ftth-survey' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800">
                लिखित परीक्षा सेट ३ (Q9) तथा फिल्ड सर्भे नक्सा (Page 24)
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                FTTH Survey Planning Diagram & Gwarko Area Route Map
              </h4>
              <p className="text-xs text-slate-400">
                Exchange (OLT) ➔ ODF ➔ Feeder Fiber ➔ FDC (001-512) ➔ Distribution ➔ FAP (012/01 - 012/15) ➔ Customer ONT
              </p>
            </div>
          </div>

          {/* FTTH Block Diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg viewBox="0 0 950 260" className="w-full min-w-[750px] h-auto font-sans">
              {/* Stages connected with arrows */}
              {[
                { title: 'EXCHANGE', sub: 'OLT (Optical Line Terminal)', color: '#38bdf8', x: 20 },
                { title: 'ODF', sub: 'Optical Dist. Frame (1-12)', color: '#818cf8', x: 180 },
                { title: 'FEEDER FIBER', sub: '01-08/144 Core', color: '#f43f5e', x: 340 },
                { title: 'FDC', sub: 'Cabinet 001-512', color: '#10b981', x: 500 },
                { title: 'FAP (FAT)', sub: 'Fiber Access Point (1:8)', color: '#f59e0b', x: 660 },
                { title: 'ONT / CPE', sub: 'ग्राहकको घर (Wi-Fi राउटर)', color: '#ec4899', x: 820 }
              ].map((node, i) => (
                <g key={i} transform={`translate(${node.x}, 60)`}>
                  <rect x="0" y="0" width="110" height="90" rx="8" fill="#1e293b" stroke={node.color} strokeWidth="2" />
                  <text x="55" y="32" textAnchor="middle" fill={node.color} fontSize="11" fontWeight="bold">{node.title}</text>
                  <text x="55" y="55" textAnchor="middle" fill="#cbd5e1" fontSize="7.5" className="font-semibold">{node.sub.split(' ')[0]}</text>
                  <text x="55" y="68" textAnchor="middle" fill="#94a3b8" fontSize="7">{node.sub.split(' ').slice(1).join(' ')}</text>
                  {i < 5 && (
                    <path d="M 115 45 L 155 45" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow)" />
                  )}
                </g>
              ))}

              {/* Bottom Checklist for FTTH Survey */}
              <g transform="translate(40, 180)">
                <rect x="0" y="0" width="870" height="60" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="20" y="24" fill="#fcd34d" fontSize="10" fontWeight="bold">सर्भे गर्दा आवश्यक प्राविधिक सूची (FTTH Survey Checklist):</text>
                <text x="20" y="44" fill="#94a3b8" fontSize="9">
                  १. Cable/Fiber प्रकार र कोर साइज | २. केबल लम्बाइ (Length) | ३. पोल तथा Accessories (Eri-band, Bracket) | ४. FDC / FAP क्षमता | ५. कुल ग्राहक संख्या
                </text>
              </g>
            </svg>
          </div>

          {/* Gwarko - Lamatar Real Survey Layout Description */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-amber-400 text-xs block">
              ग्वाkey नक्सा विश्लेषण (Gwarko - Lamatar Optical Route Layout - Page 24):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="space-y-1">
                <span className="font-semibold text-sky-400">फिडर लाइन:</span>
                <p>Telecom Gwarko ODF (1-12 / 6144) बाट 01/144F (560m) केबल निस्की FDC 001-512 र FDC 002-512 क्याबिनेटमा जोडिन्छ।</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-emerald-400">वितरण क्लस्टरहरू (Distribution FAPs):</span>
                <p>FDC बाट 24F र 12F केबलहरू शाखामा बाँडिन्छन्: 012/01 देखि 012/15 सम्मका FAP पोलहरूमा 1:8 स्प्लिटर जडान गरी घरघरमा FTTH बाँडिन्छ।</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. COLOR CODES REFERENCE TABLES (PAGES 34, 35, 36, 37)
          ========================================================================= */}
      {selectedDiagram === 'color-codes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-8 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-2xs uppercase tracking-wider font-extrabold text-pink-400 bg-pink-950 px-2.5 py-1 rounded-full border border-pink-800">
              लिखित परीक्षा सेट ५ (Q6) तथा प्रयोगात्मक परीक्षा
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
              दूरसञ्चार कलर कोड मापदण्ड (OFC & Copper Color Coding Standards)
            </h4>
            <p className="text-xs text-slate-400">
              नेपाल टेलिकम तथा अन्तर्राष्ट्रिय (TIA/EIA-598) १२-कलर अप्टिकल फाइबर, १०-पेयर कपर केबल र युनिट बाइन्डर तालिका
            </p>
          </div>

          {/* 1. 12 Optical Fiber Colors Table */}
          <div className="space-y-3">
            <h5 className="text-sm font-extrabold text-sky-400 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>१. अप्टिकल फाइबर १२-कलर कोड (12 Optical Fiber Color Codes):</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-300">
                    <th className="border border-slate-800 p-2 text-center w-16">कोर नं.</th>
                    <th className="border border-slate-800 p-2 text-left">रङ (Color)</th>
                    <th className="border border-slate-800 p-2 text-left">नेपाल टेलिकम (NTC Standard)</th>
                    <th className="border border-slate-800 p-2 text-left">International (TIA/EIA-598)</th>
                    <th className="border border-slate-800 p-2 text-center">कलर स्याम्पल</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { num: 1, nep: 'नीलो', eng: 'Blue', intNep: 'नीलो', intEng: 'Blue', hex: '#2563eb' },
                    { num: 2, nep: 'सेतो', eng: 'White', intNep: 'सुन्तला', intEng: 'Orange', hex: '#f97316' },
                    { num: 3, nep: 'पहेंलो', eng: 'Yellow', intNep: 'हरियो', intEng: 'Green', hex: '#16a34a' },
                    { num: 4, nep: 'हरियो', eng: 'Green', intNep: 'खैरो', intEng: 'Brown', hex: '#854d0e' },
                    { num: 5, nep: 'खरानी', eng: 'Slate / Grey', intNep: 'खरानी', intEng: 'Slate (Grey)', hex: '#64748b' },
                    { num: 6, nep: 'रातो', eng: 'Red', intNep: 'सेतो', intEng: 'White', hex: '#f8fafc' },
                    { num: 7, nep: 'सुन्तला', eng: 'Orange', intNep: 'रातो', intEng: 'Red', hex: '#dc2626' },
                    { num: 8, nep: 'कालो', eng: 'Black', intNep: 'कालो', intEng: 'Black', hex: '#0f172a' },
                    { num: 9, nep: 'गुलाबी', eng: 'Pink', intNep: 'पहेंलो', intEng: 'Yellow', hex: '#eab308' },
                    { num: 10, nep: 'बैजनी', eng: 'Violet / Purple', intNep: 'बैजनी', intEng: 'Violet (Purple)', hex: '#9333ea' },
                    { num: 11, nep: 'खैरो', eng: 'Brown', intNep: 'गुलाबी (Rose)', intEng: 'Rose (Pink)', hex: '#f472b6' },
                    { num: 12, nep: 'आकाशी नीलो', eng: 'Aqua / Turquoise', intNep: 'आकाशी (Aqua)', intEng: 'Aqua (Cyan)', hex: '#06b6d4' },
                  ].map((row) => (
                    <tr key={row.num} className="hover:bg-slate-950/60">
                      <td className="border border-slate-800 p-2 text-center font-bold text-slate-300 font-mono">#{row.num}</td>
                      <td className="border border-slate-800 p-2 font-bold text-white">{row.nep} ({row.eng})</td>
                      <td className="border border-slate-800 p-2 text-slate-300">{row.nep} ({row.eng})</td>
                      <td className="border border-slate-800 p-2 text-slate-300">{row.intNep} ({row.intEng})</td>
                      <td className="border border-slate-800 p-2 text-center">
                        <span className="inline-block w-6 h-6 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: row.hex }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Copper 10-Pair Table & Unit Binder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>२. कपर केबल १०-पेयर कलर कोड (10-Pair Copper Cable):</span>
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300">
                      <th className="border border-slate-800 p-2 text-center">Pair No.</th>
                      <th className="border border-slate-800 p-2 text-left">Cable Pair Color</th>
                      <th className="border border-slate-800 p-2 text-left">नेपाली नाम</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { pair: 1, eng: 'Blue + White', nep: 'नीलो + सेतो' },
                      { pair: 2, eng: 'Orange + White', nep: 'सुन्तला + सेतो' },
                      { pair: 3, eng: 'Green + White', nep: 'हरियो + सेतो' },
                      { pair: 4, eng: 'Brown + White', nep: 'खैरो + सेतो' },
                      { pair: 5, eng: 'Slate + White', nep: 'खरानी + सेतो' },
                      { pair: 6, eng: 'Blue + Red', nep: 'नीलो + रातो' },
                      { pair: 7, eng: 'Orange + Red', nep: 'सुन्तला + रातो' },
                      { pair: 8, eng: 'Green + Red', nep: 'हरियो + रातो' },
                      { pair: 9, eng: 'Brown + Red', nep: 'खैरो + रातो' },
                      { pair: 10, eng: 'Slate + Red', nep: 'खरानी + रातो' },
                    ].map((row) => (
                      <tr key={row.pair} className="hover:bg-slate-950/60">
                        <td className="border border-slate-800 p-2 text-center font-bold text-amber-400 font-mono">{row.pair}</td>
                        <td className="border border-slate-800 p-2 font-medium text-white">{row.eng}</td>
                        <td className="border border-slate-800 p-2 text-slate-300">{row.nep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>३. युनिट बाइन्डर र सिथ खोल्ने लम्बाइ (Unit Binder & Sheath):</span>
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300">
                      <th className="border border-slate-800 p-2 text-left">केबल साइज (Pair)</th>
                      <th className="border border-slate-800 p-2 text-left">बाइन्डर कलर</th>
                      <th className="border border-slate-800 p-2 text-left">सिथ खोल्ने लम्बाइ (Sheath Open)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">१० देखि ३० पेयर</td>
                      <td className="border border-slate-800 p-2 text-slate-300">नीलो, सुन्तला, हरियो</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono font-bold">२० देखि ३० से.मी.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">५०, ७०, १००, १५० पेयर</td>
                      <td className="border border-slate-800 p-2 text-slate-300">५/५ युनिट बाइन्डर</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono font-bold">४३ से.मी.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">१५० देखि ९०० पेयर</td>
                      <td className="border border-slate-800 p-2 text-slate-300">ग्रुप बाइन्डर (नीलो, सुन्तला, हरियो)</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono font-bold">४७ से.मी.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">१२०० देखि १८०० पेयर</td>
                      <td className="border border-slate-800 p-2 text-slate-300">सुपर ग्रुप बाइन्डर (६ ग्रुप)</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono font-bold">५० से.मी.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. CLEARANCES & SAFETY STANDARDS (PAGES 5, 6, 63, 64)
          ========================================================================= */}
      {selectedDiagram === 'clearance-standards' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-2xs uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
              लिखित तथा प्रयोगात्मक सुरक्षा निर्देशिका
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
              केबल सुरक्षित दूरी तथा जमिनदेखि उचाइ मापदण्ड (Clearance Distances)
            </h4>
            <p className="text-xs text-slate-400">
              नेपाल टेलिकम, NTA र विद्युत प्राधिकरण (NEA) को संयुक्त इन्फ्रास्ट्रक्चर सेयरिङ मापदण्ड
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Underground Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-extrabold text-amber-400 text-sm">क) जमिनमुनि गाड्दा (Underground Cabling):</h5>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300">
                      <th className="border border-slate-800 p-2 text-left">केबलको प्रकार</th>
                      <th className="border border-slate-800 p-2 text-left">समान्तर (Parallel)</th>
                      <th className="border border-slate-800 p-2 text-left">क्रसिङ गर्दा (९०°)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">कम भोल्टेज (LV: 230V/400V)</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono">३० से.मी. (०.३ मि.)</td>
                      <td className="border border-slate-800 p-2 text-sky-400 font-mono">१५ से.मी. (०.१५ मि.)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-bold text-white">उच्च भोल्टेज (HV: 11kV/33kV)</td>
                      <td className="border border-slate-800 p-2 text-emerald-400 font-mono">५० से.मी. (०.५ मि.)</td>
                      <td className="border border-slate-800 p-2 text-sky-400 font-mono">३० से.मी. (०.३ मि.)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overhead Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-extrabold text-sky-400 text-sm">ख) पोलमा टाङ्दा (Overhead Cabling Clearance):</h5>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>कम भोल्टेज नाङ्गो तार (Bare LV 400V):</strong> कम्तीमा <strong>८० से.मी. (०.८ मिटर)</strong> तल</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>कम भोल्टेज कभर तार (Insulated LV 400V):</strong> कम्तीमा <strong>३० से.मी. (०.३ मिटर)</strong> तल</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>उच्च भोल्टेज लाइन (HV 11kV / 33kV):</strong> कम्तीमा <strong>१.२ मिटर देखि २ मिटर</strong> तल</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>क्रसिङ गर्दा:</strong> विद्युत लाइनको सधैँ तल्लो भागबाट मात्र टेलिकम केबल लैजानुपर्छ।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vertical Height Clearances */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h5 className="font-extrabold text-emerald-400 text-sm">ग) जमिनदेखि केबलको उचाइ मापदण्ड (Vertical Clearance from Ground):</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block font-medium">सडक पार गर्दा (Road Crossing)</span>
                <span className="text-xl font-black text-emerald-400 font-mono">५.५ मिटर</span>
                <span className="text-slate-500 text-3xs block">(लगभग १८ फिट उचाइ)</span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block font-medium">पैदल मार्ग (Footpath)</span>
                <span className="text-xl font-black text-sky-400 font-mono">२.४ मिटर</span>
                <span className="text-slate-500 text-3xs block">(लगभग ८ फिट उचाइ)</span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block font-medium">खुला क्षेत्र / खेतबारी (Open Area)</span>
                <span className="text-xl font-black text-amber-400 font-mono">४.५ मिटर</span>
                <span className="text-slate-500 text-3xs block">(कम्तीमा ४.५ मि. कायम गर्ने)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. STEP-BY-STEP MATH CALCULATIONS & NUMERICAL SOLVER (PAGES 45, 46)
          ========================================================================= */}
      {selectedDiagram === 'math-formulas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-8 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-2xs uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              लिखित तथा अब्जेक्टिभ परीक्षा हिसाब (Numerical Problems)
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
              टेलिकम प्राविधिक हिसाब, सूत्र तथा इन्टरएक्टिभ क्याल्कुलेटर
            </h4>
            <p className="text-xs text-slate-400">
              लूप रेजिस्टेन्स, क्यापासिटेन्सबाट फल्ट दूरी, एटेन्युएसन लस र ड्रप वायर फल्ट दूरी पत्ता लगाउने आधिकारिक सूत्रहरू
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calculation 1: Loop Resistance */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-amber-400 text-sm">१. लूप रेजिस्टेन्स (Loop Resistance) हिसाब</span>
                <span className="text-3xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-900/60 font-mono">Q27</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">सूत्र (Formula):</p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-emerald-400">
                  Loop Resistance = प्रति km Resistance × दूरी (km) × २
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">दूरी (km):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loopResCableLen}
                    onChange={(e) => setLoopResCableLen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">प्रति km तार Ω:</label>
                  <input
                    type="number"
                    value={loopResWireSize}
                    onChange={(e) => setLoopResWireSize(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">कुल लूप रेजिस्टेन्स:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {(loopResWireSize * loopResCableLen * 2).toFixed(1)} Ω (Ohms)
                </span>
              </div>
            </div>

            {/* Calculation 2: Fault Distance from Capacitance */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-sky-400 text-sm">२. क्यापासिटेन्सबाट फल्ट दूरी (Fault Distance)</span>
                <span className="text-3xs bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-900/60 font-mono">Q28</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">सूत्र (Formula):</p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-sky-400">
                  Distance = Total Measured Capacitance (nF) / Standard Cap per km (50 nF/km)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">नापेको क्यापासिटेन्स (nF):</label>
                  <input
                    type="number"
                    value={capTotal}
                    onChange={(e) => setCapTotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">स्ट्यान्डर्ड nF/km:</label>
                  <input
                    type="number"
                    value={capPerKm}
                    onChange={(e) => setCapPerKm(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-sky-950/40 border border-sky-800/60 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">फल्ट भएको दूरी:</span>
                <span className="text-lg font-black text-sky-400 font-mono">
                  {((capTotal / capPerKm) * 1000).toFixed(0)} मिटर ({((capTotal / capPerKm)).toFixed(2)} km)
                </span>
              </div>
            </div>

            {/* Calculation 3: Attenuation Loss */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-purple-400 text-sm">३. एटेन्युएसन लस हिसाब (Total Loss dB)</span>
                <span className="text-3xs bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-900/60 font-mono">Q29</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">सूत्र (Formula):</p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-purple-400">
                  Total Loss (dB) = केबलको लम्बाइ (km) × प्रति किमी लस (dB/km)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">केबल लम्बाइ (km):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={attenLen}
                    onChange={(e) => setAttenLen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">लस दर (dB/km):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={attenRate}
                    onChange={(e) => setAttenRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-purple-950/40 border border-purple-800/60 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">जम्मा सिग्नल लस:</span>
                <span className="text-lg font-black text-purple-400 font-mono">
                  {(attenLen * attenRate).toFixed(1)} dB
                </span>
              </div>
            </div>

            {/* Calculation 4: Drop Wire Fault Distance */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-rose-400 text-sm">४. ड्रप वायर सर्ट फल्ट दूरी (Drop Wire Fault)</span>
                <span className="text-3xs bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-900/60 font-mono">Q30</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">सूत्र (Formula):</p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-rose-400">
                  Fault Distance = Measured Resistance (Ω) / Resistance per meter (0.058 Ω/m)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">नापेको प्रतिरोध (Ω):</label>
                  <input
                    type="number"
                    value={dropRes}
                    onChange={(e) => setDropRes(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">प्रति मिटर Ω (0.058):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={dropResPerM}
                    onChange={(e) => setDropResPerM(parseFloat(e.target.value) || 0.058)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">फल्ट भएको दूरी:</span>
                <span className="text-lg font-black text-rose-400 font-mono">
                  {(dropRes / dropResPerM).toFixed(0)} मिटर
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. OUTSIDE NETWORK TELECOM SYMBOLS (PAGES 112 TO 117)
          ========================================================================= */}
      {selectedDiagram === 'symbols-catalog' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-2xs uppercase tracking-wider font-extrabold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                PDF Pages 112 - 117
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                टेलिकम बाह्य नेटवर्क प्राविधिक संकेतहरू (Outside Plant Symbols)
              </h4>
              <p className="text-xs text-slate-400">
                Existing (हाल रहेको), To be installed (जडान गरिने), र Dismantled (हटाइने) तीनवटै अवस्थाका प्रतीकहरू
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'copper', 'ftth'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSymbolCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    symbolCategory === cat
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'सबै संकेतहरू' : cat === 'copper' ? 'कपर नेटवर्क' : 'FTTH नेटवर्क'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={symbolSearch}
              onChange={(e) => setSymbolSearch(e.target.value)}
              placeholder="संकेत खोज्नुहोस् (उदा. Pole, Cabinet, Manhole, FAP)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSymbols.map((sym) => (
              <div key={sym.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs sm:text-sm truncate">{sym.nameNepali}</span>
                  <span className="text-3xs font-mono uppercase bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    {sym.category}
                  </span>
                </div>
                <div className="text-2xs text-slate-400 italic truncate">{sym.nameEnglish}</div>

                {/* 3 Variants rendering */}
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2 rounded-lg border border-slate-850 text-center">
                  <div className="space-y-1">
                    <span className="text-3xs text-emerald-400 font-medium block">Existing</span>
                    <div className="flex items-center justify-center h-12 bg-slate-950 rounded border border-slate-800">
                      <OutsideNetworkSymbolSvg svgKey={sym.svgKey} variant="existing" className="w-16 h-10" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xs text-sky-400 font-medium block">To Install</span>
                    <div className="flex items-center justify-center h-12 bg-slate-950 rounded border border-slate-800">
                      <OutsideNetworkSymbolSvg svgKey={sym.svgKey} variant="toInstall" className="w-16 h-10" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xs text-rose-400 font-medium block">Dismantled</span>
                    <div className="flex items-center justify-center h-12 bg-slate-950 rounded border border-slate-800">
                      <OutsideNetworkSymbolSvg svgKey={sym.svgKey} variant="dismantled" className="w-16 h-10" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
