import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Cable,
  Building,
  Home,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Volume2,
  Layers,
  FileText,
  Info,
  ArrowRight,
  Shield,
  Eye,
  Sliders,
  ZoomIn,
  Sparkles,
  BookOpen,
  Flame,
  Scissors,
  Wrench,
  Activity,
  Gauge,
  Zap,
  Search,
  Radio,
  Check,
  Workflow,
  Cpu,
  Network
} from 'lucide-react';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import {
  Level1FieldSurveyData,
  getLevel1FieldSurveyData,
  defaultLevel1FieldSurveyData,
} from '../data/level1FieldSurveyData';

interface Level1FieldSurveyMapProps {
  onOpenAiTutor?: () => void;
}

export const Level1FieldSurveyMap: React.FC<Level1FieldSurveyMapProps> = ({ onOpenAiTutor }) => {
  const [activeTab, setActiveTab] = useState<
    'interactive' | 'photo' | 'procedure' | 'viva' | 'nitvt_manual' | 'copper_to_fiber' | 'tools_safety'
  >('interactive');
  const [selectedNode, setSelectedNode] = useState<string>('dp31');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [colorCodeSearch, setColorCodeSearch] = useState<string>('');
  const [selectedSafetySection, setSelectedSafetySection] = useState<'laser' | 'glass' | 'aerial' | 'manhole'>('laser');

  const [mapData, setMapData] = useState<Level1FieldSurveyData>(() => getLevel1FieldSurveyData());

  useEffect(() => {
    const handleUpdate = () => {
      setMapData(getLevel1FieldSurveyData());
    };
    window.addEventListener('nitvt_level1_field_survey_map_updated', handleUpdate);
    return () => {
      window.removeEventListener('nitvt_level1_field_survey_map_updated', handleUpdate);
    };
  }, []);

  const nodeDetails = mapData.nodes || defaultLevel1FieldSurveyData.nodes;

  const handleSpeak = (text: string, label: string) => {
    setSpeakingText(label);
    speakNepaliText(text, label);
  };

  const currentNode = nodeDetails[selectedNode] || nodeDetails.dp31;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Compass className="w-3.5 h-3.5" /> OSP Field Base Map
              </span>
              <span className="bg-indigo-900/80 border border-indigo-700 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {mapData.quickSpecs.cabinetNo} • {mapData.quickSpecs.dpNo}
              </span>
              <span className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {mapData.quickSpecs.dropWireLength} • {mapData.quickSpecs.customerAddress}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {mapData.titleNepali}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {mapData.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                handleSpeak(
                  mapData.audioNarrationText || mapData.descriptionNepali,
                  'फिल्ड सर्भे नक्सा परिचय'
                )
              }
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>नेपालीमा सुन्नुहोस्</span>
            </button>
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 font-semibold px-3 py-2 rounded-xl text-xs transition-all"
            >
              <Maximize2 className="w-4 h-4 text-amber-400" />
              <span>मूल कागजात फोटो हेर्नुहोस् (Zoom)</span>
            </button>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-indigo-900/60">
          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-slate-400">क्याबिनेट नम्बर</span>
            <p className="text-sm font-bold text-amber-400">{mapData.quickSpecs.cabinetNo}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-slate-400">डीपी नम्बर / लठ्ठा</span>
            <p className="text-sm font-bold text-emerald-400">{mapData.quickSpecs.dpNo}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-slate-400">ड्रप वायर लम्बाइ (D/W)</span>
            <p className="text-sm font-bold text-cyan-400">{mapData.quickSpecs.dropWireLength}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-slate-400">ग्राहक ठेगाना</span>
            <p className="text-sm font-bold text-purple-300 line-clamp-1">{mapData.quickSpecs.customerAddress}</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('interactive')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'interactive'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>इन्टर्‍याक्टिभ सर्भे नक्सा (Interactive Vector Map)</span>
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'photo'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>मूल फिल्ड तस्बिर (Field Document Photo)</span>
        </button>
        <button
          onClick={() => setActiveTab('nitvt_manual')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'nitvt_manual'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span>NITVT फाइबर म्यानुअल (४ परिच्छेद)</span>
        </button>
        <button
          onClick={() => setActiveTab('copper_to_fiber')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'copper_to_fiber'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Network className="w-4 h-4 text-amber-400" />
          <span>कापर ➔ FTTH रूपान्तरण र १२-रङ कोड</span>
        </button>
        <button
          onClick={() => setActiveTab('tools_safety')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'tools_safety'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>फाइबर औजार, सुरक्षा र फल्ट मर्मत</span>
        </button>
        <button
          onClick={() => setActiveTab('procedure')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'procedure'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>ड्रप वायर जडान कार्यविधि (Practical Steps)</span>
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'viva'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>नक्सा सम्बन्धी VIVA प्रश्नोत्तर</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE VECTOR MAP */}
      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Vector SVG Map Card */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  फिल्ड रेखाचित्र (Clickable Field Diagram)
                </span>
                <h3 className="text-base font-bold text-white">
                  ग्वार्को चोक – उदय बस्ती – NITVT अफिस रुट नक्सा
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                नक्साका पोल र बिन्दुहरूमा क्लिक गरी विस्तृत विवरण हेर्नुहोस्
              </span>
            </div>

            {/* SVG Engineering Drawing Canvas */}
            <div className="relative w-full aspect-[16/10] bg-[#0c1322] border-2 border-slate-700/80 rounded-xl overflow-hidden shadow-inner select-none">
              {/* Grid Background Pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="survey-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#survey-grid)" />
              </svg>

              {/* Main SVG Vector Network Rendering */}
              <svg
                viewBox="0 0 1000 650"
                className="w-full h-full relative z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* --- 1. ROADS AND GEOGRAPHY --- */}
                {/* Ring Road (North) running diagonally top-left */}
                <path
                  d="M 220 540 L 40 80"
                  stroke="#334155"
                  strokeWidth="50"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 220 540 L 40 80"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="10,10"
                  fill="none"
                />
                {/* Ring Road Arrow & Label */}
                <text
                  x="80"
                  y="120"
                  fill="#94a3b8"
                  fontSize="15"
                  fontWeight="bold"
                  transform="rotate(-68 80 120)"
                >
                  रिङ्ग रोड (उत्तर) ↑
                </text>

                {/* Lubu Road along bottom */}
                <path
                  d="M 120 540 L 850 540"
                  stroke="#334155"
                  strokeWidth="45"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 120 540 L 850 540"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="12,12"
                  fill="none"
                />
                <text x="580" y="558" fill="#94a3b8" fontSize="16" fontWeight="bold">
                  Lubu road ➔
                </text>

                {/* Gwarko Chowk (Intersection) */}
                <circle cx="220" cy="540" r="34" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                <text x="220" y="538" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">
                  ग्वार्को
                </text>
                <text x="220" y="556" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                  चोक
                </text>

                {/* Institute Road branching north */}
                <path
                  d="M 380 540 L 380 430"
                  stroke="#334155"
                  strokeWidth="32"
                  strokeLinecap="round"
                  fill="none"
                />
                <text x="360" y="490" fill="#94a3b8" fontSize="13" fontWeight="bold" transform="rotate(-90 360 490)">
                  Institute road
                </text>

                {/* Udaya Basti Main Street */}
                <path
                  d="M 380 430 Q 420 340 500 280 T 720 180"
                  stroke="#1e293b"
                  strokeWidth="42"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 380 430 Q 420 340 500 280 T 720 180"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="8,8"
                  fill="none"
                />
                <text x="440" y="340" fill="#cbd5e1" fontSize="15" fontWeight="bold">
                  Udaya Basti (उदय बस्ती)
                </text>

                {/* Haritkolani branch */}
                <path
                  d="M 520 270 Q 560 170 650 110"
                  stroke="#1e293b"
                  strokeWidth="30"
                  strokeLinecap="round"
                  fill="none"
                />
                <text x="590" y="150" fill="#94a3b8" fontSize="13" fontWeight="bold" transform="rotate(-30 590 150)">
                  Haritkolani (हरितकोलोनी)
                </text>

                {/* --- 2. SUBSCRIBER HOUSES (Square Buildings from Original Map) --- */}
                {/* Cluster of houses on west side (between Ring Road and Udaya Basti) */}
                {[
                  { x: 120, y: 220, label: 'घर' },
                  { x: 170, y: 180, label: 'घर' },
                  { x: 150, y: 280, label: 'घर' },
                  { x: 210, y: 260, label: 'घर' },
                  { x: 250, y: 200, label: 'घर' },
                  { x: 260, y: 320, label: 'घर' },
                  { x: 300, y: 390, label: 'घर' },
                  { x: 440, y: 470, label: 'घर' },
                  { x: 670, y: 90, label: 'घर' },
                  { x: 740, y: 130, label: 'घर' },
                  { x: 600, y: 290, label: 'घर' },
                ].map((house, idx) => (
                  <g key={idx} opacity="0.7">
                    <rect
                      x={house.x}
                      y={house.y}
                      width="32"
                      height="26"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="1.5"
                      rx="3"
                    />
                    <line x1={house.x + 16} y1={house.y} x2={house.x + 16} y2={house.y + 26} stroke="#334155" />
                    <line x1={house.x} y1={house.y + 13} x2={house.x + 32} y2={house.y + 13} stroke="#334155" />
                  </g>
                ))}

                {/* --- 3. TARGET SUBSCRIBER: HOUSE NO. 16 - NITVT OFFICE --- */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedNode('house16')}
                >
                  <rect
                    x="710"
                    y="250"
                    width="120"
                    height="85"
                    fill={selectedNode === 'house16' ? '#083344' : '#0f172a'}
                    stroke={selectedNode === 'house16' ? '#22d3ee' : '#06b6d4'}
                    strokeWidth={selectedNode === 'house16' ? '3' : '2'}
                    rx="6"
                  />
                  {/* Roof line / windows */}
                  <rect x="725" y="265" width="24" height="20" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
                  <rect x="760" y="265" width="24" height="20" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
                  <rect x="795" y="275" width="18" height="40" fill="#0e7490" stroke="#22d3ee" strokeWidth="1" />

                  <text x="770" y="305" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">
                    NITVT Offce
                  </text>
                  <text x="770" y="322" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    House No. - 16
                  </text>
                  <text x="770" y="348" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Ground Floor
                  </text>
                </g>

                {/* --- 4. TELECOM OUTSIDE PLANT (OSP) INFRASTRUCTURE --- */}
                {/* Cabinet 09 Marker (Near Gwarko) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('cabinet09')}
                >
                  <rect
                    x="290"
                    y="515"
                    width="55"
                    height="50"
                    fill={selectedNode === 'cabinet09' ? '#78350f' : '#451a03'}
                    stroke="#f59e0b"
                    strokeWidth={selectedNode === 'cabinet09' ? '3' : '2'}
                    rx="4"
                  />
                  <text x="317" y="535" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                    CABINET
                  </text>
                  <text x="317" y="555" fill="#fcd34d" fontSize="14" fontWeight="extrabold" textAnchor="middle">
                    09
                  </text>
                </g>

                {/* Aerial Secondary Cable Line (Connecting Poles) */}
                <path
                  d="M 317 515 L 420 420 L 490 350 L 560 270 L 630 200 L 700 150"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  fill="none"
                />

                {/* POLE 09/28 (With Stay/Strut) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('pole28')}
                >
                  {/* Pole with circle / stay representation */}
                  <circle cx="420" cy="420" r="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="420" cy="420" r="5" fill="#38bdf8" />
                  {/* Strut / Stay Symbol Line */}
                  <line x1="420" y1="420" x2="390" y2="440" stroke="#f43f5e" strokeWidth="2.5" />
                  <circle cx="390" cy="440" r="6" fill="#f43f5e" />
                  <text x="440" y="425" fill="#93c5fd" fontSize="13" fontWeight="bold">
                    09/28 (Stay)
                  </text>
                </g>

                {/* POLE 09/29 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('pole29_30')}
                >
                  <circle cx="490" cy="350" r="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="490" cy="350" r="4" fill="#38bdf8" />
                  <text x="510" y="355" fill="#93c5fd" fontSize="13" fontWeight="bold">
                    09/29
                  </text>
                </g>

                {/* POLE 09/30 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('pole29_30')}
                >
                  <circle cx="560" cy="270" r="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="560" cy="270" r="4" fill="#38bdf8" />
                  <text x="580" y="275" fill="#93c5fd" fontSize="13" fontWeight="bold">
                    09/30
                  </text>
                </g>

                {/* POLE 09/31 WITH DP (DP NO. 31) - HIGHLIGHTED */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('dp31')}
                >
                  {/* Outer pulse circle */}
                  <circle
                    cx="630"
                    cy="200"
                    r="24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin"
                    style={{ transformOrigin: '630px 200px', animationDuration: '8s' }}
                  />
                  <circle
                    cx="630"
                    cy="200"
                    r="16"
                    fill={selectedNode === 'dp31' ? '#065f46' : '#022c22'}
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  {/* DP Box Badge */}
                  <rect x="620" y="160" width="60" height="24" fill="#047857" stroke="#34d399" strokeWidth="1.5" rx="4" />
                  <text x="650" y="177" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    DP 31
                  </text>
                  <text x="650" y="215" fill="#6ee7b7" fontSize="13" fontWeight="bold">
                    09/31
                  </text>
                </g>

                {/* POLE 09/32 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('pole32')}
                >
                  <circle cx="700" cy="150" r="13" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="700" cy="150" r="4" fill="#38bdf8" />
                  <text x="720" y="155" fill="#93c5fd" fontSize="12" fontWeight="bold">
                    09/32
                  </text>
                </g>

                {/* --- 5. DROP WIRE (D/W) 70m PATH (DP 31 -> HOOK -> HOUSE 16) --- */}
                {/* Span 1: DP 31 to Intermediate Hook/Bracket (30m) */}
                <path
                  d="M 630 200 L 675 235"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  fill="none"
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('dropwire')}
                />
                {/* Intermediate Hook / Support Circle */}
                <circle
                  cx="675"
                  cy="235"
                  r="7"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('dropwire')}
                />
                <text x="635" y="235" fill="#fbbf24" fontSize="12" fontWeight="bold">
                  ३०m
                </text>

                {/* Span 2: Intermediate Hook to House 16 (40m) */}
                <path
                  d="M 675 235 L 715 285"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  fill="none"
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('dropwire')}
                />
                <text x="695" y="270" fill="#fbbf24" fontSize="12" fontWeight="bold">
                  ४०m
                </text>

                {/* Total Drop Wire Label Banner */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNode('dropwire')}
                >
                  <rect x="630" y="280" width="70" height="26" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" rx="5" />
                  <text x="665" y="297" fill="#fef3c7" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    D/W- 70m
                  </text>
                </g>

                {/* Map Legend Box inside drawing */}
                <g transform="translate(40, 390)">
                  <rect width="210" height="135" fill="#0f172a" stroke="#334155" strokeWidth="1.5" rx="8" opacity="0.95" />
                  <text x="12" y="22" fill="#f59e0b" fontSize="12" fontWeight="bold">
                    संकेत चिह्नहरू (Survey Legend):
                  </text>
                  {/* Legend item 1 */}
                  <circle cx="20" cy="42" r="5" fill="#3b82f6" />
                  <text x="32" y="46" fill="#cbd5e1" fontSize="11">
                    टेलिकम लठ्ठा (Pole 09/xx)
                  </text>
                  {/* Legend item 2 */}
                  <circle cx="20" cy="64" r="5" fill="#10b981" />
                  <rect x="15" y="58" width="10" height="10" fill="#047857" rx="1" />
                  <text x="32" y="68" fill="#cbd5e1" fontSize="11">
                    डीपी बक्स (DP 31)
                  </text>
                  {/* Legend item 3 */}
                  <line x1="12" y1="88" x2="26" y2="88" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4,2" />
                  <text x="32" y="91" fill="#fbbf24" fontSize="11">
                    ड्रप वायर (D/W 70m: 30m+40m)
                  </text>
                  {/* Legend item 4 */}
                  <rect x="14" y="104" width="12" height="12" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
                  <text x="32" y="114" fill="#22d3ee" fontSize="11">
                    NITVT अफिस (House No. 16)
                  </text>
                </g>
              </svg>
            </div>

            {/* Quick Interactive Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 font-semibold pr-1">छिटो चयन:</span>
              {[
                { id: 'cabinet09', label: 'क्याबिनेट ०९' },
                { id: 'pole28', label: 'पोल ०९/२८ (Stay)' },
                { id: 'pole29_30', label: 'पोल ०९/२९ & ३०' },
                { id: 'dp31', label: 'डीपी ३१ (DP 31)' },
                { id: 'dropwire', label: 'D/W ७०m' },
                { id: 'house16', label: 'हाउस १६ (NITVT)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedNode(btn.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedNode === btn.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Node Details Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                  {currentNode.tag}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{currentNode.titleNepali}</h3>
                <p className="text-xs text-slate-400">{currentNode.titleEnglish}</p>
              </div>
              <button
                onClick={() =>
                  handleSpeak(
                    `${currentNode.titleNepali}। ${currentNode.descNepali}`,
                    currentNode.titleNepali
                  )
                }
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                title="नेपालीमा सुन्नुहोस्"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {currentNode.descNepali}
            </p>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>प्राविधिक विशेषताहरू (Technical Specs)</span>
              </h4>
              <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden text-xs">
                {Object.entries(currentNode.specs).map(([key, value], idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5">
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-white font-bold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Field Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>फिल्डमा ध्यान दिनुपर्ने नियमहरू</span>
              </h4>
              <ul className="space-y-1.5">
                {currentNode.keyNotes.map((note, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Action Button */}
            <button
              onClick={() => setActiveTab('procedure')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>यस रुटको ड्रप वायर जडान कार्यविधि हेर्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ORIGINAL FIELD DOCUMENT PHOTO */}
      {activeTab === 'photo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  मूल फिल्ड कागजात
                </span>
                <span className="text-xs text-slate-400">CTEVT / NSTB Level-1 Field Examination Map</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                नेपाल टेलिकम ग्वार्को चोक OSP फिल्ड नक्सा (Original Photo Document)
              </h3>
            </div>
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md"
            >
              <ZoomIn className="w-4 h-4" />
              <span>पूरा स्क्रिनमा ठूलो बनाएर हेर्नुहोस्</span>
            </button>
          </div>

          <div
            className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-slate-700 bg-black/90 p-2"
            onClick={() => setPreviewModalOpen(true)}
          >
            <img
              src={mapData.imageUrl || '/osp_level1_survey_map.jpg'}
              alt={mapData.titleNepali}
              referrerPolicy="no-referrer"
              className="w-full max-h-[550px] object-contain mx-auto rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
                <Maximize2 className="w-4 h-4" />
                <span>क्लिक गरेर पूर्ण आकारमा हेर्नुहोस् (Full Zoom)</span>
              </span>
            </div>
          </div>

          {/* Analysis of Document */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-amber-400 uppercase">कागजातमा उल्लिखित शीर्षक</h4>
              <p className="text-xs text-slate-300">
                {mapData.quickSpecs.cabinetNo} • {mapData.quickSpecs.dpNo} • D/W- {mapData.quickSpecs.dropWireLength} • {mapData.quickSpecs.customerAddress}
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-emerald-400 uppercase">मुख्य मार्गहरू</h4>
              <p className="text-xs text-slate-300">
                ग्वार्को चोक (Gwarko Chok), रिङ्ग रोड (उत्तर), Lubu road, Institute road, Udaya Basti, Haritkolani
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">लठ्ठा तथा स्प्यान</h4>
              <p className="text-xs text-slate-300">
                Pole 09/28 (Stay सहित), 09/29, 09/30, 09/31 (DP 31), 09/32, D/W {mapData.quickSpecs.dropWireLength} स्प्यान
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP DROP WIRE INSTALLATION PROCEDURE */}
      {activeTab === 'procedure' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 rounded-full mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CTEVT / NSTB तह–१ प्रयोगात्मक कार्यविधि</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              नक्सा अनुसार DP 31 बाट NITVT अफिस (House 16) सम्म ड्रप वायर ({mapData.quickSpecs.dropWireLength}) जडान विधि
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              उदय बस्ती फिल्ड नक्सामा आधारित ५ वटा क्रमिक प्रयोगात्मक चरणहरू
            </p>
          </div>

          <div className="space-y-4">
            {(mapData.procedures || defaultLevel1FieldSurveyData.procedures).map((s) => (
              <div key={s.step} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                    {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-9">{s.desc}</p>
                <div className="ml-9 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>सावधानी:</strong> {s.safety}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAP SPECIFIC VIVA QUESTIONS */}
      {activeTab === 'viva' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/70 border border-purple-800/60 px-3 py-0.5 rounded-full">
              मौखिक परीक्षा तयारी (VIVA Voce)
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              फिल्ड सर्भे नक्सा ({mapData.titleNepali}) सम्बन्धी सम्भावित प्रश्नोत्तरहरू
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              CTEVT तथा NSTB को लेभल–१ स्किल टेस्टमा नक्सा देखाएर सोधिने मुख्य प्रश्नहरू
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(mapData.vivaQuestions || defaultLevel1FieldSurveyData.vivaQuestions).map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                    प्र. {idx + 1}: {item.q}
                  </h4>
                  <button
                    onClick={() => handleSpeak(`प्रश्न: ${item.q}। उत्तर: ${item.a}`, `प्रश्न ${idx + 1}`)}
                    className="text-slate-400 hover:text-amber-400 p-1"
                    title="सुन्नुहोस्"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400">उत्तर: </strong>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NITVT FIBER OPTIC TECHNICAL MANUAL (4 CHAPTERS) */}
      {activeTab === 'nitvt_manual' && (
        <div className="space-y-6">
          {/* Manual Cover Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 border border-rose-500/30 rounded-2xl p-5 shadow-xl text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-rose-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Official Technical Manual
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {mapData.nitvtManual?.organization || 'नेपाल इन्स्टिच्युट अफ टेक्निकल एण्ड भोकेशनल ट्रेनिङ प्रा. लि. (NITVT)'}
                  </span>
                  <span className="bg-slate-800/80 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                    {mapData.nitvtManual?.location || 'ललितपुर, नेपाल'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {mapData.nitvtManual?.title || 'फाइबर अप्टिक नेटवर्क प्राविधिक म्यानुअल'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {mapData.nitvtManual?.targetRole || 'जूनियर टेलिकम टेक्निसियन (Junior Telecom Technician) को लागि उपयोगी'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ch = (mapData.nitvtManual?.chapters || defaultLevel1FieldSurveyData.nitvtManual!.chapters)[selectedChapterIndex];
                    if (ch) {
                      handleSpeak(`${ch.titleNepali}। ${ch.contentNepali}। मुख्य बुँदाहरू: ${ch.bulletPoints.join('। ')}`, ch.titleNepali);
                    }
                  }}
                  className="px-3.5 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>यो परिच्छेद नेपालीमा सुन्नुहोस्</span>
                </button>
              </div>
            </div>

            {/* Chapter Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-800">
              {(mapData.nitvtManual?.chapters || defaultLevel1FieldSurveyData.nitvtManual!.chapters).map((ch, idx) => {
                const isSelected = selectedChapterIndex === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        परिच्छेद {ch.chapterNo}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                      {ch.titleNepali.replace(/^परिच्छेद \d+:\s*/, '')}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {ch.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Details Card */}
          {(() => {
            const currentChapter = (mapData.nitvtManual?.chapters || defaultLevel1FieldSurveyData.nitvtManual!.chapters)[selectedChapterIndex];
            if (!currentChapter) return null;
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Chapter {currentChapter.chapterNo} • {currentChapter.titleEnglish}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                      {currentChapter.titleNepali}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleSpeak(currentChapter.contentNepali, currentChapter.titleNepali)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>वाचन सुन्नुहोस्</span>
                  </button>
                </div>

                {/* Chapter Main Content Text */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                    {currentChapter.contentNepali}
                  </p>
                </div>

                {/* Telecom Network Diagram (if Chapter 2 or when illustrating architecture) */}
                {currentChapter.chapterNo === 2 && (
                  <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-bold text-white">
                          टेलिकम नेटवर्क डायग्राम (Telecom Network Schematic Diagram - OSP Architecture)
                        </h4>
                      </div>
                      <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                        Page 4 Diagram
                      </span>
                    </div>

                    {/* Visual schematic representation */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {/* Stage 1: Central Office */}
                      <div className="bg-slate-900/90 border border-indigo-800/60 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                          १. टेलिकम कार्यालय
                        </span>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800">
                            <span className="font-bold text-white">O-LT</span>
                            <span className="text-[10px] text-slate-400">अप्टिकल लाइन टर्मिनल</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800">
                            <span className="font-bold text-white">O-DF</span>
                            <span className="text-[10px] text-slate-400">अप्टिकल फ्रेम</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800">
                            <span className="font-bold text-slate-300">केबल भल्ट</span>
                            <span className="text-[10px] text-slate-400">Cable Vault</span>
                          </div>
                        </div>
                      </div>

                      {/* Stage 2: Primary Underground */}
                      <div className="bg-slate-900/90 border border-blue-800/60 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                          २. प्राइमरी केबल (भूमिगत)
                        </span>
                        <div className="space-y-1 text-xs">
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>म्यानहोल (Manhole):</strong> लुप रूम र ठूला जोइन्ट क्लोजर
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>डक्ट (PLB HDPE):</strong> सिलिकन लेयर, केबल ब्लोइङ (Blowing)
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>ह्याण्डहोल:</strong> सानो जोइन्ट र स्प्लिटर
                          </div>
                        </div>
                      </div>

                      {/* Stage 3: Secondary Aerial */}
                      <div className="bg-slate-900/90 border border-amber-800/60 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                          ३. सेकेण्डरी केबल (लठ्ठा)
                        </span>
                        <div className="space-y-1 text-xs">
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>राइजर पोल:</strong> भूमिगतबाट लठ्ठामा केबल चढ्ने ठाउँ
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>FDC / क्याबिनेट:</strong> Fiber Distribution Cabinet
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>FAP / ODB बक्स:</strong> १:८ / १:१६ स्प्लिटर सहितको बक्स
                          </div>
                        </div>
                      </div>

                      {/* Stage 4: Subscriber Customer Line */}
                      <div className="bg-slate-900/90 border border-emerald-800/60 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                          ४. ग्राहकको लाइन
                        </span>
                        <div className="space-y-1 text-xs">
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-emerald-300">
                            <strong>Fiber Drop Cable:</strong> १/२ कोर Bow-Type (७०m)
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>ONT / Wi-Fi Router:</strong> ग्राहकको कोठा भित्रको डिभाइस
                          </div>
                          <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                            <strong>IP Phone / टेलिफोन:</strong> भ्वाइस तथा हाई-स्पीड इन्टरनेट
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bullet points section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    यस परिच्छेदका मुख्य प्राविधिक बुँदाहरू:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentChapter.bulletPoints.map((bp, bpIdx) => (
                      <div
                        key={bpIdx}
                        className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-2.5 hover:border-slate-700 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {bp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Alert Box */}
                {currentChapter.safetyOrAlert && (
                  <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-rose-300 uppercase">
                        महत्वपूर्ण सुरक्षा तथा प्राविधिक निर्देशन:
                      </h5>
                      <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">
                        {currentChapter.safetyOrAlert}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 6: COPPER TO FIBER MODERNIZATION & 12 COLOR CODES */}
      {activeTab === 'copper_to_fiber' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 shadow-xl text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Gwarko Chowk OSP Modernization
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    Cabinet 09 ➔ FDC-09 • DP 31 ➔ ODB-31
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  कापर नेटवर्क देखि आधुनिक FTTH फाइबर OSP रूपान्तरण सारणी
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  परम्परागत तामाको केबल प्रणालीलाई फाइबर अप्टिक प्रविधिमा स्तरोन्नति गर्दा सामग्री र प्रविधिमा आउने परिवर्तन (PDF Page 2)
                </p>
              </div>

              <button
                onClick={() =>
                  handleSpeak(
                    'कापर नेटवर्कमा MDF को सट्टा ODF वा OLT, प्राइमरी केबलको सट्टा फिडर फाइबर, क्याबिनेट ०९ को सट्टा FDC, डीपी ३१ को सट्टा १:८ स्प्लिटर सहित ODB, र तामाको ड्रपवायरको सट्टा १ वा २ कोर Bow-Type फाइबर केबल प्रयोग गरिन्छ।',
                    'कापर फाइबर रूपान्तरण'
                  )
                }
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all shrink-0 active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>नेपालीमा सुन्नुहोस्</span>
              </button>
            </div>
          </div>

          {/* Copper vs Fiber Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-amber-400" />
                <span>महत्वपूर्ण परिवर्तन सारणी (Copper vs FTTH OFC Comparison Matrix)</span>
              </h4>
              <span className="text-xs text-slate-400">५ मुख्य चरणहरू</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="p-3 font-semibold text-center w-12">क्र.सं.</th>
                    <th className="p-3 font-bold text-amber-400 w-1/3">परम्परागत कापर नेटवर्क (Copper)</th>
                    <th className="p-3 font-bold text-cyan-400 w-1/3">आधुनिक फाइबर नेटवर्क (FTTH OFC)</th>
                    <th className="p-3 font-bold text-emerald-400">ग्वार्को चोक OSP फिल्ड नक्सामा भूमिका</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(mapData.nitvtManual?.copperVsFiber || defaultLevel1FieldSurveyData.nitvtManual!.copperVsFiber).map((row) => (
                    <tr key={row.sn} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-400">{row.sn}</td>
                      <td className="p-3">
                        <div className="font-bold text-amber-300">{row.copper}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{row.copperDetails}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-cyan-300">{row.fiber}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{row.fiberDetails}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-emerald-300 font-medium">{row.roleInGwarko}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12-Core OFC Color Coding Table (Matching Page 5 of PDF) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
                  TIA/EIA-598 & Nepal Telecom Standards (PDF Page 5)
                </span>
                <h4 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>फाइबर कलर कोडिङ व्यवस्था (१२ वटा रङहरूको तुलनात्मक तालिका)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  नेपाल टेलिकमको आफ्नै मापदण्ड (NT Standard) र अन्तर्राष्ट्रिय मापदण्ड (International Standard) बीचको फरक
                </p>
              </div>

              {/* Search filter for colors */}
              <div className="flex items-center gap-2 w-full sm:w-64">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={colorCodeSearch}
                    onChange={(e) => setColorCodeSearch(e.target.value)}
                    placeholder="रङ वा नम्बर खोज्नुहोस्..."
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Color comparison note banner */}
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-200">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">विशेष ध्यान दिनुपर्ने भिन्नता: </strong>
                नेपाल टेलिकममा नम्बर २ <strong>सेतो (White)</strong> र नम्बर ७ <strong>सुन्तला (Orange)</strong> हुन्छ भने, अन्तर्राष्ट्रिय मापदण्डमा नम्बर २ <strong>सुन्तला (Orange)</strong> र नम्बर ६ <strong>सेतो (White)</strong> हुन्छ। त्यस्तै नेपाल टेलिकममा नम्बर ६ <strong>रातो (Red)</strong> र नम्बर ११ <strong>खैरो (Brown)</strong> हुन्छ।
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="p-3 font-semibold text-center w-14">कोर नं.</th>
                    <th className="p-3 font-semibold text-center w-16">कलर रङ</th>
                    <th className="p-3 font-bold text-amber-400">नेपाल टेलिकम मापदण्ड (NT Standard)</th>
                    <th className="p-3 font-bold text-cyan-400">अन्तर्राष्ट्रिय मापदण्ड (TIA/EIA-598)</th>
                    <th className="p-3 font-semibold text-right">सुन्नुहोस्</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(mapData.nitvtManual?.colorCodes || defaultLevel1FieldSurveyData.nitvtManual!.colorCodes)
                    .filter((c) => {
                      if (!colorCodeSearch) return true;
                      const q = colorCodeSearch.toLowerCase();
                      return (
                        c.no.toString().includes(q) ||
                        c.ntColorNepali.toLowerCase().includes(q) ||
                        c.ntColorEnglish.toLowerCase().includes(q) ||
                        c.intlColorNepali.toLowerCase().includes(q) ||
                        c.intlColorEnglish.toLowerCase().includes(q)
                      );
                    })
                    .map((c) => {
                      const isWhite = c.hex === '#f8fafc';
                      const isSame = c.ntColorEnglish.toLowerCase() === c.intlColorEnglish.toLowerCase();
                      return (
                        <tr key={c.no} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-center font-bold text-slate-300">{c.no}</td>
                          <td className="p-3 text-center">
                            <div
                              className="w-5 h-5 rounded-full mx-auto shadow border border-slate-700"
                              style={{ backgroundColor: c.hex }}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{c.ntColorNepali}</span>
                              <span className="text-[11px] text-slate-400 font-mono">({c.ntColorEnglish})</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-cyan-300">{c.intlColorNepali}</span>
                              <span className="text-[11px] text-slate-400 font-mono">({c.intlColorEnglish})</span>
                              {isSame ? (
                                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">समान</span>
                              ) : (
                                <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded">फरक</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() =>
                                handleSpeak(
                                  `फाइबर नम्बर ${c.no}। नेपाल टेलिकममा ${c.ntColorNepali}, र अन्तर्राष्ट्रिय मापदण्डमा ${c.intlColorNepali}।`,
                                  `कलर ${c.no}`
                                )
                              }
                              className="text-slate-400 hover:text-amber-400 p-1 transition-colors"
                              title="सुन्नुहोस्"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SPECIALIZED OFC TOOLS, SAFETY & TROUBLESHOOTING */}
      {activeTab === 'tools_safety' && (
        <div className="space-y-6">
          {/* 7 Specialized OFC Tools Grid (Matching Page 8 of PDF) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  Specialized OFC Tools & Equipment (PDF Page 8)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  फाइबर आउटसाइड नेटवर्कमा प्रयोग हुने ७ आधुनिक औजारहरू
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  कापरका परम्परागत औजारहरू (क्रोने, क्रिम्पिङ) नचल्ने हुँदा फाइबर प्रविधिमा यी यन्त्रहरू अनिवार्य हुन्छन्
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(mapData.nitvtManual?.tools || defaultLevel1FieldSurveyData.nitvtManual!.tools).map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-2 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                        यन्त्र #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleSpeak(`${t.nameNepali} (${t.nameEnglish})। ${t.descNepali}। प्रयोग सल्लाह: ${t.usageTip}`, t.nameNepali)}
                        className="text-slate-400 hover:text-amber-400 p-1"
                        title="सुन्नुहोस्"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{t.nameNepali}</h4>
                      <p className="text-[11px] text-cyan-400 font-mono">{t.nameEnglish}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.descNepali}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 text-[11px] text-emerald-300 mt-2">
                    <strong>सल्लाह: </strong>{t.usageTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Regulations (Matching Page 6-7 of PDF) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800">
                Safety Regulations (PDF Page 6-7)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                सुरक्षा सम्बन्धि नियमहरू र फाइबर प्रविधिको विशेष सावधानी
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                लेजर विकिरण, सिसाका टुक्रा, पोलमा काम गर्दा र म्यानहोल विषाक्त ग्यास सम्बन्धी कडा सुरक्षा नियमहरू
              </p>
            </div>

            {/* Safety category selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'laser', label: '१. लेजर विकिरण सुरक्षा', desc: 'Invisible Light & Retina Risk' },
                { id: 'glass', label: '२. सिसाका टुक्रा सुरक्षा', desc: 'Fiber Shards & Trash Can' },
                { id: 'aerial', label: '३. एरियल पोल सुरक्षा', desc: 'Current Leakage & Safety Belt' },
                { id: 'manhole', label: '४. म्यानहोल विषाक्त ग्यास', desc: 'Toxic Gases & Explosion Ban' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSafetySection(s.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedSafetySection === s.id
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Active safety points */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              {(() => {
                const guidelines = mapData.nitvtManual?.safetyGuidelines || defaultLevel1FieldSurveyData.nitvtManual!.safetyGuidelines;
                const activeList =
                  selectedSafetySection === 'laser'
                    ? guidelines.laser
                    : selectedSafetySection === 'glass'
                    ? guidelines.glassShards
                    : selectedSafetySection === 'aerial'
                    ? guidelines.aerial
                    : guidelines.manhole;

                return (
                  <div className="space-y-2">
                    {activeList.map((rule, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rule}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Faults & Preventive Maintenance (Matching Page 8-9 of PDF) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                Troubleshooting & Maintenance (PDF Page 8-9)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                फाइबर नेटवर्कमा फल्ट (Fault) आउने कारणहरू र रोकथामका उपायहरू
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                म्याक्रोबेन्डिङ, धुलो, केबल काटिनु र खराब स्प्लाइसिङको निवारण
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(mapData.nitvtManual?.faults || defaultLevel1FieldSurveyData.nitvtManual!.faults).map((f, fIdx) => (
                <div key={fIdx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                      {fIdx + 1}. {f.faultNepali}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">({f.faultEnglish})</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-rose-400">कारण: </strong>
                    {f.causeNepali}
                  </div>
                  <div className="text-xs text-emerald-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <strong>रोकथाम तथा मर्मत: </strong>
                    {f.preventionNepali}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN IMAGE PREVIEW MODAL */}
      {previewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {mapData.titleNepali}
                </h3>
                <p className="text-xs text-amber-400">
                  {mapData.quickSpecs.cabinetNo} • {mapData.quickSpecs.dpNo} • D/W- {mapData.quickSpecs.dropWireLength} • {mapData.quickSpecs.customerAddress}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                बन्द गर्नुहोस् (Close ✕)
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/70 rounded-xl p-2">
              <img
                src={mapData.imageUrl || '/osp_level1_survey_map.jpg'}
                alt={mapData.titleNepali}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
