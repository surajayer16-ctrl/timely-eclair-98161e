import React, { useState, useEffect } from 'react';
import {
  Zap,
  BookOpen,
  Wrench,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  Volume2,
  Printer,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  Sliders,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  RotateCcw,
  Check,
  Edit,
  Maximize2,
  X,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import {
  electricianLessons as defaultElectricianLessons,
  electricalSymbolsList as defaultElectricalSymbolsList,
  wireCapacityTable as defaultWireCapacityTable,
  practicalCircuitsData as defaultPracticalCircuitsData,
  ElectricianLesson,
  PracticalCircuit,
  ElectricSymbolItem,
  WireCapacityRow
} from '../data/electricianNoteData';
import { LessonCardView } from './LessonCardView';

interface ElectricianNoteHubProps {
  onBack: () => void;
}

// User-specified curriculum topics mapping for Days 1–38
const curriculumOutlineMap: Record<number, { dayLabel: string; keyword: string; detail: string; catBadge: string }> = {
  1: { dayLabel: 'पहिलो दिन', keyword: 'परिचय', detail: 'परिचय तथा आशा अपेक्षा संकलन र मिलन', catBadge: 'FOUNDATION' },
  2: { dayLabel: 'दोस्रो दिन', keyword: 'विद्युतको', detail: 'विद्युतको परिचय, विद्युत र विद्युत धाराका प्रकार (DC र AC)', catBadge: 'THEORY' },
  3: { dayLabel: 'तेस्रो दिन', keyword: 'विद्युतको', detail: 'विद्युतको इतिहास, अणु र परमाणु संरचना (2N² नियम)', catBadge: 'ATOMIC' },
  4: { dayLabel: 'चौथो दिन', keyword: 'ओहमको', detail: 'ओहमको नियम (V=IR), भोल्टेज, करेन्ट र अवरोध हिसाब', catBadge: 'CALCULATION' },
  5: { dayLabel: 'पाँचौं र छैटौं दिन', keyword: 'ईलेक्ट्रीसियनले', detail: 'ईलेक्ट्रीसियनले प्रयोग गर्ने सम्पूर्ण औजारहरू (Tools & Safety)', catBadge: 'TOOLS' },
  7: { dayLabel: 'सातौं दिन', keyword: 'विद्युत', detail: 'विद्युत उत्पादन, प्रसारण र वितरण (Generation, Transmission & Distribution)', catBadge: 'GRID' },
  8: { dayLabel: 'आठौं दिन', keyword: 'विद्युत', detail: 'विद्युत परिपथ (Electric Circuit): Closed, Open, Short & Leakage', catBadge: 'CIRCUITS' },
  9: { dayLabel: 'नवौं दिन', keyword: 'विद्युतय', detail: 'विद्युतय झट्का, सुरक्षा नियम र कृत्रिम श्वासप्रश्वास (First Aid)', catBadge: 'SAFETY' },
  10: { dayLabel: 'दशौं दिन', keyword: 'Wire', detail: 'Wire Joint र यसका प्रकारहरू (Rat-tail, Western, Britannia, Tee Joint)', catBadge: 'JOINTS' },
  11: { dayLabel: 'एघारौं दिन', keyword: 'विद्युतिय', detail: 'विद्युतिय चिन्हहरू (६४ Electrical Lay-Out & Wiring Symbols)', catBadge: 'SYMBOLS' },
  12: { dayLabel: 'बाह्रौं दिन', keyword: 'Electric', detail: 'Electric Diagram: Lay-Out Diagram, Wiring Diagram र Single Line Diagram', catBadge: 'DIAGRAMS' },
  13: { dayLabel: 'तेह्रौं दिन', keyword: 'विद्युत', detail: 'विद्युत जडानमा प्रयोग हुने तार र केबुल क्षमता तालिका (PVC Insulated Wire Table)', catBadge: 'CABLES' },
  14: { dayLabel: 'चौधौं दिन', keyword: 'केसिङ्ग', detail: 'केसिङ्ग केपिङ्ग विद्युत जडान (Casing Capping Wiring System)', catBadge: 'WIRING' },
  15: { dayLabel: 'पन्ध्रौं र सोह्रौं दिन', keyword: 'कन्ड्युट', detail: 'कन्ड्युट वायरिङ्ग (Surface Conduit र Concealed / Underground Wiring)', catBadge: 'CONDUIT' },
  38: { dayLabel: 'अड्तीसौं दिन', keyword: 'पावर सकेट', detail: 'पावर सकेट जडान (Power Socket 16A Wiring, N-E-P र Wire Sizing)', catBadge: 'POWER' },
};

export const ElectricianNoteHub: React.FC<ElectricianNoteHubProps> = ({ onBack }) => {
  const [activeMainTab, setActiveMainTab] = useState<'lessons' | 'symbols' | 'practicals' | 'ohms-law' | 'wire-table' | 'safety'>('lessons');
  const [lessonViewMode, setLessonViewMode] = useState<'all' | 'single'>('all');
  const [selectedLessonDay, setSelectedLessonDay] = useState<number>(1);
  const [selectedPracticalId, setSelectedPracticalId] = useState<number>(1);
  const [searchSymbolQuery, setSearchSymbolQuery] = useState<string>('');
  const [lessonSearchQuery, setLessonSearchQuery] = useState<string>('');
  const [symbolFilterCategory, setSymbolFilterCategory] = useState<string>('all');
  const [isWhitePaperMode, setIsWhitePaperMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(true);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; caption?: string } | null>(null);

  // Dynamic state loaded from localStorage or default data
  const [lessons, setLessons] = useState<ElectricianLesson[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_lessons');
      return saved ? JSON.parse(saved) : defaultElectricianLessons;
    } catch {
      return defaultElectricianLessons;
    }
  });

  const [symbols, setSymbols] = useState<ElectricSymbolItem[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_symbols');
      return saved ? JSON.parse(saved) : defaultElectricalSymbolsList;
    } catch {
      return defaultElectricalSymbolsList;
    }
  });

  const [practicals, setPracticals] = useState<PracticalCircuit[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_practicals');
      return saved ? JSON.parse(saved) : defaultPracticalCircuitsData;
    } catch {
      return defaultPracticalCircuitsData;
    }
  });

  const [wireTable, setWireTable] = useState<WireCapacityRow[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_wire_table');
      return saved ? JSON.parse(saved) : defaultWireCapacityTable;
    } catch {
      return defaultWireCapacityTable;
    }
  });

  // Listen to Admin updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const savedL = localStorage.getItem('nitvt_electrician_lessons');
        if (savedL) setLessons(JSON.parse(savedL));
        const savedS = localStorage.getItem('nitvt_electrician_symbols');
        if (savedS) setSymbols(JSON.parse(savedS));
        const savedP = localStorage.getItem('nitvt_electrician_practicals');
        if (savedP) setPracticals(JSON.parse(savedP));
        const savedW = localStorage.getItem('nitvt_electrician_wire_table');
        if (savedW) setWireTable(JSON.parse(savedW));
      } catch (e) {
        console.error('Error loading electrician note update:', e);
      }
    };

    window.addEventListener('nitvt_electrician_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nitvt_electrician_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const scrollToDay = (dayNumber: number) => {
    setSelectedLessonDay(dayNumber);
    if (lessonViewMode === 'all') {
      setTimeout(() => {
        const element = document.getElementById(`lesson-day-${dayNumber}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  // Interactive Ohm's Law Calculator State
  const [calcVoltage, setCalcVoltage] = useState<number>(230);
  const [calcResistance, setCalcResistance] = useState<number>(46);
  const [calcCurrent, setCalcCurrent] = useState<number>(5);
  const [calcSolveFor, setCalcSolveFor] = useState<'V' | 'I' | 'R' | 'P'>('I');

  // Interactive Practical Switches State
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({
    S1: false,
    S2: false,
    S3: false,
    S4: false
  });

  const toggleSwitch = (switchName: string) => {
    setSwitchStates(prev => ({
      ...prev,
      [switchName]: !prev[switchName]
    }));
  };

  const resetSwitches = () => {
    setSwitchStates({ S1: false, S2: false, S3: false, S4: false });
  };

  // Text to speech helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ne-NP';
      utterance.rate = 0.92;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentLesson = lessons.find(l => l.dayNumber === selectedLessonDay) || lessons[0] || defaultElectricianLessons[0];
  const currentPractical = practicals.find(p => p.id === selectedPracticalId) || practicals[0] || defaultPracticalCircuitsData[0];

  // Filter symbols
  const filteredSymbols = symbols.filter(sym => {
    const matchesSearch =
      sym.nameNep.toLowerCase().includes(searchSymbolQuery.toLowerCase()) ||
      sym.nameEng.toLowerCase().includes(searchSymbolQuery.toLowerCase()) ||
      sym.description.toLowerCase().includes(searchSymbolQuery.toLowerCase()) ||
      sym.sn.toString() === searchSymbolQuery.trim();
    return matchesSearch;
  });

  // Calculate Ohm's Law
  const calculateResult = () => {
    if (calcSolveFor === 'V') {
      const v = calcCurrent * calcResistance;
      return { val: v.toFixed(2), unit: 'Volts (V)', formula: 'V = I × R' };
    }
    if (calcSolveFor === 'I') {
      if (calcResistance === 0) return { val: '∞', unit: 'Amperes (A)', formula: 'I = V / R' };
      const i = calcVoltage / calcResistance;
      return { val: i.toFixed(2), unit: 'Amperes (A)', formula: 'I = V / R' };
    }
    if (calcSolveFor === 'R') {
      if (calcCurrent === 0) return { val: '∞', unit: 'Ohms (Ω)', formula: 'R = V / I' };
      const r = calcVoltage / calcCurrent;
      return { val: r.toFixed(2), unit: 'Ohms (Ω)', formula: 'R = V / I' };
    }
    // Power
    const p = calcVoltage * calcCurrent;
    return { val: p.toFixed(2), unit: 'Watts (W)', formula: 'P = V × I' };
  };

  // Determine practical bulb status
  const getBulbStatus = (practicalId: number) => {
    const s1 = switchStates.S1;
    const s2 = switchStates.S2;
    const s3 = switchStates.S3;
    const s4 = switchStates.S4;

    switch (practicalId) {
      case 1: // 1 way -> 1 bulb
        return { L1: s1 };
      case 2: // 1 way -> 2 bulbs parallel (bright)
        return { L1: s1, L2: s1 };
      case 3: // 1 way -> 2 bulbs series (dim)
        return { L1: s1, L2: s1, isDim: true };
      case 4: // bell push -> bell, 1 way -> bulb
        return { Bell: s1, L1: s2 };
      case 5: // 3 switches -> 3 bulbs
        return { L1: s1, L2: s2, L3: s3 };
      case 6: // 2 switches -> 2 bulbs parallel, socket
        return { L1: s1, L2: s1, Socket: s2 };
      case 7: // 2-way staircase
        // If both up or both down -> ON, else OFF
        return { L1: (s1 && s2) || (!s1 && !s2) };
      case 8: // 2-way staircase + indicator + 2-pin
        return { L1: (s1 && s2) || (!s1 && !s2), Indicator: true, Socket: true };
      case 9: // 2-way + indicator + 2-pin + power socket
        return { L1: (s1 && s2) || (!s1 && !s2), Indicator: true, Socket: true, PowerSocket: true };
      case 10: // 3 places (2-way, intermediate, 2-way)
        // Intermediate flips logic
        {
          const count = (s1 ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0);
          return { L1: count % 2 === 0 };
        }
      case 11: // 4 places (2-way, inter 1, inter 2, 2-way)
        {
          const count = (s1 ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0) + (s4 ? 1 : 0);
          return { L1: count % 2 === 0 };
        }
      default:
        return { L1: s1 };
    }
  };

  const currentBulbStatus = getBulbStatus(currentPractical.id);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isWhitePaperMode ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Lightbox Preview Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-slate-950 border border-slate-700 rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {zoomedImage.caption || 'तस्विर अवलोकन (Photo Preview)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={zoomedImage.url}
                  download="electrician-image.png"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  title="डाउनलोड / नयाँ ट्याबमा खोल्नुहोस्"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setZoomedImage(null)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[250px] max-h-[70vh]">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.caption || 'Photo'}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>

            {zoomedImage.caption && (
              <div className="w-full p-2.5 bg-slate-900/90 text-center border-t border-slate-800">
                <p className="text-xs text-amber-300 font-semibold">{zoomedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Banner & Header */}
      <header className={`border-b ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'} backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-md`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                isWhitePaperMode
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>टेलिकम नोटमा फर्कनुहोस्</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-md">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-xl font-black tracking-tight leading-tight flex items-center gap-2">
                    <span className="text-amber-400">ELECTRICIAN</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      (बिल्डिङ इलेक्ट्रिसियन पूर्ण नोट)
                    </span>
                  </h1>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    CTEVT / NSTB आधिकारिक
                  </span>
                </div>
                <p className={`text-xs ${isWhitePaperMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  पहिलो दिन देखि अड्तीसौं दिन सम्मका सम्पूर्ण १५ पाठहरू, सिद्धान्त, औजारहरू, ६४ विद्युत चिन्हहरू र ११ प्रयोगात्मक रेखाचित्रहरू
                </p>
              </div>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('nitvt_open_admin', {
                    detail: { tab: 'electrician', editElectricianDay: selectedLessonDay }
                  })
                );
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black border transition-colors flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 shadow-sm"
              title="एडमिन प्यानलबाट इलेक्ट्रिसियन नोट सम्पादन गर्नुहोस्"
            >
              <Edit className="w-3.5 h-3.5 text-amber-400" />
              <span>एडमिनबाट सम्पादन</span>
            </button>

            <button
              onClick={() => setIsWhitePaperMode(!isWhitePaperMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isWhitePaperMode
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-white text-slate-900 border-slate-200 shadow-sm'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>{isWhitePaperMode ? 'डार्क मोड' : 'ह्वाइट पेपर मोड'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isWhitePaperMode
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">प्रिन्ट / PDF</span>
            </button>
          </div>
        </div>

        {/* Main Category Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveMainTab('lessons')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'lessons'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ELECTRICIAN नोट (Days 1–38 All-in-One)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('practicals')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'practicals'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>११ प्रयोगात्मक रेखाचित्रहरू (Practicals 1–11)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('symbols')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'symbols'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>६४ विद्युतिय चिन्हहरू (Symbols 1–64)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('ohms-law')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'ohms-law'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ओहमको नियम र हिसाब (Ohm's Law)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('wire-table')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'wire-table'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>तार करेन्ट क्षमता तालिका (PVC Wire)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('safety')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeMainTab === 'safety'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : isWhitePaperMode
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>सुरक्षा नियम र प्राथमिक उपचार</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ======================= TAB 1: DAILY LESSON PLANS (DAYS 1-38) ======================= */}
        {activeMainTab === 'lessons' && (
          <div className="space-y-6">
            {/* View Mode Toggle & Control Panel */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    पाठ्यक्रम अध्ययन मोड (Study Mode)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    पहिलो दिन देखि अड्तीसौं दिन सम्म (All-in-One)
                  </span>
                </div>
                <p className={`text-xs ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  {lessonViewMode === 'all'
                    ? 'सम्पूर्ण १५ वटा पाठहरू (पहिलो दिन देखि अड्तीसौं दिन सम्म) एकै साथ स्क्रोल गरी पढ्नुहोस्।'
                    : 'दिन अनुसार एउटा-एउटा पाठ छुट्टाछुट्टै अध्ययन गर्नुहोस्।'}
                </p>
              </div>

              {/* Search & Toggle Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="पाठ वा विषय खोज्नुहोस् (उदा: ओहम, wire, कन्ड्युट, चिन्ह)..."
                    value={lessonSearchQuery}
                    onChange={(e) => setLessonSearchQuery(e.target.value)}
                    className={`w-full text-xs rounded-xl pl-8 pr-7 py-2 border transition-colors focus:outline-none focus:border-amber-500 ${
                      isWhitePaperMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                    }`}
                  />
                  {lessonSearchQuery && (
                    <button
                      onClick={() => setLessonSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setLessonViewMode('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      lessonViewMode === 'all'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>सबै पाठ एकैसाथ (All-in-One)</span>
                  </button>
                  <button
                    onClick={() => setLessonViewMode('single')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      lessonViewMode === 'single'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>दिन अनुसार (Single Day)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comprehensive Curriculum Outline Index (All 15 Units Grid) */}
            <div className={`p-4 sm:p-5 rounded-3xl border shadow-lg transition-all ${
              isWhitePaperMode ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-3 border-b pb-3 mb-4 border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>पाठ्यक्रम विषय सूची (Curriculum Index: Days 1–38)</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                        १५ मुख्य भागहरू
                      </span>
                    </h3>
                    <p className={`text-xs ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-400'}`}>
                      सबै पाठहरू एउटै ELECTRICIAN मोड्युलमा एकीकृत गरिएका छन् — क्लिक गरी सिधै पाठमा जानुहोस्
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsIndexOpen(!isIndexOpen)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 transition-colors"
                >
                  {isIndexOpen ? 'सूची लुकाउनुहोस्' : 'सूची हेर्नुहोस्'}
                </button>
              </div>

              {isIndexOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {lessons.map((lesson, idx) => {
                    const outline = curriculumOutlineMap[lesson.dayNumber];
                    const isCurrent = selectedLessonDay === lesson.dayNumber;
                    return (
                      <button
                        key={lesson.dayNumber}
                        onClick={() => scrollToDay(lesson.dayNumber)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between group relative overflow-hidden ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500/60 shadow-md ring-1 ring-amber-400/40'
                            : isWhitePaperMode
                            ? 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide">
                            {lesson.day}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            भाग {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-1.5 py-0.5 rounded shrink-0 shadow-sm">
                            {outline?.keyword || lesson.title.split(' ')[0]}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {lesson.title.replace(outline?.keyword || '', '').trim().slice(0, 18)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                          {outline?.detail || lesson.nepaliTitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content Rendering based on Mode */}
            {lessonViewMode === 'all' ? (
              <div className="space-y-8">
                {lessons
                  .filter(lesson => {
                    if (!lessonSearchQuery.trim()) return true;
                    const q = lessonSearchQuery.toLowerCase();
                    const outline = curriculumOutlineMap[lesson.dayNumber];
                    return (
                      lesson.title.toLowerCase().includes(q) ||
                      lesson.nepaliTitle.toLowerCase().includes(q) ||
                      lesson.day.toLowerCase().includes(q) ||
                      (outline && (outline.keyword.toLowerCase().includes(q) || outline.detail.toLowerCase().includes(q))) ||
                      lesson.objective.toLowerCase().includes(q)
                    );
                  })
                  .map((lesson) => (
                  <React.Fragment key={lesson.dayNumber}>
                    <LessonCardView
                      lesson={lesson}
                      isWhitePaperMode={isWhitePaperMode}
                      isSpeaking={isSpeaking}
                      speakText={speakText}
                      onNavigateTab={setActiveMainTab}
                    />

                    {/* After Day 15-16, insert the bridge to 11 Practicals (Days 17-37) before Day 38 */}
                    {lesson.dayNumber === 15 && (
                      <div className={`p-6 rounded-3xl border text-center space-y-3 shadow-lg ${
                        isWhitePaperMode
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                          : 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/30'
                      }`}>
                        <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                          सत्रौं देखि सैंतीसौं दिन (Days 17–37)
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-amber-400">
                          ११ वटा प्रयोगात्मक वाइरिङ अभ्यासहरू (Practical Wiring 1–11)
                        </h3>
                        <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isWhitePaperMode ? 'text-slate-700' : 'text-slate-300'}`}>
                          पाठ्यक्रम अनुसार कन्ड्युट वाइरिङ (Day 15-16) पश्चात ११ वटा मुख्य घरायसी परिपथहरू (१-वे, २-वे सिँढी, इन्टरमिडिएट, ग्याङ, बेल र सकेट जडान) प्रयोगात्मक अभ्यास गरिन्छ।
                        </p>
                        <div className="pt-1">
                          <button
                            onClick={() => setActiveMainTab('practicals')}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
                          >
                            <Sliders className="w-4 h-4" />
                            <span>११ प्रयोगात्मक परिपथहरूको डिजिटल प्रयोगशाला खोल्नुहोस्</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <LessonCardView
                  lesson={currentLesson}
                  isWhitePaperMode={isWhitePaperMode}
                  isSpeaking={isSpeaking}
                  speakText={speakText}
                  onNavigateTab={setActiveMainTab}
                />

                {/* Single Day Navigation (Previous & Next Lesson) */}
                {(() => {
                  const currentIndex = lessons.findIndex(l => l.dayNumber === selectedLessonDay);
                  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
                  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
                      <button
                        disabled={!prevLesson}
                        onClick={() => prevLesson && setSelectedLessonDay(prevLesson.dayNumber)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          prevLesson
                            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-md'
                            : 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-850 text-slate-500'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>अघिल्लो पाठ ({prevLesson?.day || ''})</span>
                      </button>

                      <span className="text-xs font-semibold text-slate-400">
                        पाठ {currentIndex + 1} / {lessons.length}
                      </span>

                      <button
                        disabled={!nextLesson}
                        onClick={() => nextLesson && setSelectedLessonDay(nextLesson.dayNumber)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          nextLesson
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                            : 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-850 text-slate-500'
                        }`}
                      >
                        <span>पछिल्लो पाठ ({nextLesson?.day || ''})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 2: 11 PRACTICAL WIRING DIAGRAMS ======================= */}
        {activeMainTab === 'practicals' && (
          <div className="space-y-6">
            {/* Practical Selector Bar */}
            <div className={`p-3 rounded-2xl border ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  प्रयोगात्मक अभ्यास छनौट गर्नुहोस् (Select Practical 1–11)
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  कुल {practicals.length} वटा आधिकारिक परिपथहरू
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5">
                {practicals.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPracticalId(p.id);
                      resetSwitches();
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-bold transition-all ${
                      selectedPracticalId === p.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                        : isWhitePaperMode
                        ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div>No. {p.practicalNo}</div>
                    <div className="text-[10px] font-normal truncate opacity-80">{p.title.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Practical Showcase */}
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl ${isWhitePaperMode ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md">
                      Practical No. {currentPractical.practicalNo}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {currentPractical.day}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                    {currentPractical.title}
                  </h2>
                  <p className={`text-xs sm:text-sm ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-300'} mt-1`}>
                    {currentPractical.description}
                  </p>
                </div>

                {/* Switch Control Box */}
                <div className={`p-4 rounded-2xl border flex flex-col gap-2 shrink-0 ${isWhitePaperMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-700'}`}>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>स्विच नियन्त्रण (Toggle Switches):</span>
                    <button onClick={resetSwitches} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5">
                      <RotateCcw className="w-3 h-3" /> रिसेट
                    </button>
                  </span>
                  <div className="flex items-center gap-2">
                    {currentPractical.switches.map((sw, idx) => {
                      const swKey = `S${idx + 1}`;
                      const isOn = switchStates[swKey];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleSwitch(swKey)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-sm ${
                            isOn
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-600 hover:text-white'
                          }`}
                        >
                          {swKey}: {isOn ? 'ON (चालु)' : 'OFF (बन्द)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Conditions & Circuit Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                    अवस्था तथा नियन्त्रण (Condition & Control):
                  </h4>
                  <div className="text-xs space-y-1 font-mono">
                    <div><span className="text-slate-400">Condition:</span> <span className="text-amber-300 font-bold">{currentPractical.condition}</span></div>
                    <div><span className="text-slate-400">Control by:</span> <span className="text-cyan-300 font-bold">{currentPractical.controlBy}</span></div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                    आवश्यक मुख्य सामाग्रीहरू (Materials):
                  </h4>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {currentPractical.materials.map((m, mIdx) => (
                      <span key={mIdx} className="bg-slate-800/80 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Wiring Schematic Simulator (Lay-Out & Wiring Diagram) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Lay-Out Diagram */}
                <div className={`p-5 rounded-3xl border flex flex-col items-center justify-between ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-cyan-400">१. Lay-Out Diagram (लेआउट नक्सा)</span>
                    <span className="text-[11px] text-slate-400">स्थान तथा पाइपको नाप</span>
                  </div>

                  {/* SVG Lay-Out Representation */}
                  <svg className="w-full h-64 border border-slate-800/80 rounded-2xl bg-slate-900" viewBox="0 0 320 220">
                    {/* Measurement Guides */}
                    <line x1="40" y1="20" x2="160" y2="20" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="90" y="16" fill="#94a3b8" fontSize="9">40 cm</text>

                    {/* Main Trunk Pipe */}
                    <line x1="60" y1="30" x2="60" y2="190" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="60" y1="100" x2="260" y2="100" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="260" y1="100" x2="260" y2="45" stroke="#94a3b8" strokeWidth="2.5" />

                    {/* Junction Box in Center */}
                    <rect x="150" y="90" width="20" height="20" fill="#475569" rx="2" />

                    {/* Fuse F1 at Top Left */}
                    <rect x="52" y="35" width="16" height="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="60" y1="42" x2="60" y2="53" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="75" y="52" fill="#38bdf8" fontSize="10" fontWeight="bold">F1</text>

                    {/* Switch S1 at Bottom Left */}
                    <circle cx="60" cy="180" r="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="56" y="184" fill="#f59e0b" fontSize="9" fontWeight="bold">S1</text>

                    {/* Lamp L1 at Top Right */}
                    <circle cx="260" cy="40" r="14" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="250" y1="30" x2="270" y2="50" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="250" y1="50" x2="270" y2="30" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="280" y="44" fill="#e2e8f0" fontSize="10" fontWeight="bold">L1</text>

                    {/* Condition text */}
                    <text x="185" y="145" fill="#f59e0b" fontSize="9" fontWeight="bold">Condition:</text>
                    <text x="185" y="160" fill="#94a3b8" fontSize="8">{currentPractical.condition}</text>
                    <text x="185" y="175" fill="#38bdf8" fontSize="8">{currentPractical.controlBy}</text>
                    <text x="185" y="200" fill="#ef4444" fontSize="8" fontWeight="bold">M.B. Rai (Bikram)</text>
                  </svg>
                  <span className="text-[11px] text-slate-400 mt-2">कन्ड्युट पाइप, जक्सन बक्स र फिक्स्चरहरूको लेआउट स्थान</span>
                </div>

                {/* 2. Wiring Diagram (Interactive Simulation) */}
                <div className={`p-5 rounded-3xl border flex flex-col items-center justify-between ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-amber-400">२. Wiring Diagram (तार जडान तथा सिमुलेसन)</span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      Phase (रातो) & Neutral (कालो)
                    </span>
                  </div>

                  {/* SVG Wiring Simulator with Live Status */}
                  <svg className="w-full h-64 border border-slate-800/80 rounded-2xl bg-slate-900" viewBox="0 0 320 220">
                    {/* Supply Input P & N */}
                    <text x="45" y="18" fill="#ef4444" fontSize="10" fontWeight="bold">P</text>
                    <text x="70" y="18" fill="#94a3b8" fontSize="10" fontWeight="bold">N</text>

                    {/* Fuse F1 */}
                    <rect x="42" y="25" width="16" height="25" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="50" y1="30" x2="50" y2="45" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="62" y="42" fill="#ef4444" fontSize="9" fontWeight="bold">F1</text>

                    {/* Neutral Bus Line (Black/Grey) */}
                    <path d="M 72 20 L 72 80 L 260 80 L 260 55" fill="none" stroke="#64748b" strokeWidth="2.5" />

                    {/* Phase Wire (Red) entering S1 */}
                    <path d="M 50 50 L 50 170" fill="none" stroke="#ef4444" strokeWidth="2.5" />

                    {/* Switch S1 Contact */}
                    <circle cx="50" cy="170" r="3" fill="#ef4444" />
                    <circle cx="50" cy="190" r="3" fill="#ef4444" />
                    {switchStates.S1 ? (
                      <line x1="50" y1="170" x2="50" y2="190" stroke="#22c55e" strokeWidth="3" />
                    ) : (
                      <line x1="50" y1="170" x2="65" y2="185" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2,2" />
                    )}
                    <text x="25" y="183" fill="#f59e0b" fontSize="10" fontWeight="bold">S1</text>

                    {/* Switched Phase to Lamp (Red line when switch ON, dim if series) */}
                    <path
                      d="M 50 190 L 80 190 L 80 100 L 245 100 L 245 55"
                      fill="none"
                      stroke={currentBulbStatus.L1 ? '#ef4444' : '#475569'}
                      strokeWidth="2.5"
                    />

                    {/* Lamp L1 Indicator */}
                    <circle
                      cx="252"
                      cy="45"
                      r="16"
                      fill={
                        currentBulbStatus.L1
                          ? currentBulbStatus.isDim
                            ? '#ca8a04'
                            : '#facc15'
                          : '#1e293b'
                      }
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      className={currentBulbStatus.L1 ? 'animate-pulse' : ''}
                    />
                    <line x1="242" y1="35" x2="262" y2="55" stroke="#0f172a" strokeWidth="2" />
                    <line x1="242" y1="55" x2="262" y2="35" stroke="#0f172a" strokeWidth="2" />
                    <text x="275" y="48" fill="#e2e8f0" fontSize="10" fontWeight="bold">L1</text>

                    {/* Status Badge */}
                    <rect x="180" y="145" width="130" height="60" fill="#020617" rx="8" stroke="#334155" strokeWidth="1" />
                    <text x="190" y="165" fill="#f59e0b" fontSize="9" fontWeight="bold">बत्तीको अवस्था:</text>
                    <text
                      x="190"
                      y="185"
                      fill={currentBulbStatus.L1 ? '#22c55e' : '#ef4444'}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {currentBulbStatus.L1
                        ? currentBulbStatus.isDim
                          ? 'बत्ती बल्छ (Dim मधुरो)'
                          : 'बत्ती बल्छ (ON चर्को)'
                        : 'बत्ती निभ्छ (OFF)'}
                    </text>
                  </svg>
                  <span className="text-[11px] text-emerald-400 font-bold mt-2">
                    माथि दायाँको स्विच बटन थिचेर बत्ती अन/अफ परीक्षण गर्नुहोस्।
                  </span>
                </div>
              </div>

              {/* Custom Practical Photo / Real Diagram (if available) */}
              {currentPractical.imageUrl && (
                <div className={`p-4 rounded-2xl border space-y-2 ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                      प्रयोगात्मक परिपथको वास्तविक तस्विर / रेखाचित्र (Practical Photo / Circuit Diagram)
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomedImage({ url: currentPractical.imageUrl!, caption: currentPractical.imageCaption || currentPractical.title })}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>जुम</span>
                    </button>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden bg-slate-900 border border-slate-850 flex items-center justify-center max-h-72 cursor-pointer group"
                    onClick={() => setZoomedImage({ url: currentPractical.imageUrl!, caption: currentPractical.imageCaption || currentPractical.title })}
                  >
                    <img
                      src={currentPractical.imageUrl}
                      alt={currentPractical.imageCaption || currentPractical.title}
                      className="w-full max-h-72 object-contain group-hover:scale-[1.01] transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {currentPractical.imageCaption && (
                    <p className="text-xs text-center text-slate-400 italic font-medium">
                      📷 {currentPractical.imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Circuit Logic Explanation */}
              <div className={`p-4 rounded-2xl border ${isWhitePaperMode ? 'bg-amber-50 border-amber-200' : 'bg-amber-950/20 border-amber-500/30'}`}>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  सर्किट कार्यविधि तथा सिद्धान्त (Circuit Working Logic):
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isWhitePaperMode ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentPractical.circuitLogic}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: 64 ELECTRICAL SYMBOLS ======================= */}
        {activeMainTab === 'symbols' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="चिन्ह खोज्नुहोस् (उदा: Switch, Fuse, Meter, MCB)..."
                  value={searchSymbolQuery}
                  onChange={e => setSearchSymbolQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none ${
                    isWhitePaperMode
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                      : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-amber-500 font-bold">कुल चिन्ह: {filteredSymbols.length} / ६४</span>
              </div>
            </div>

            {/* Complete 64 Symbols Grid / Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSymbols.map(sym => (
                <div
                  key={sym.sn}
                  className={`p-4 rounded-2xl border transition-all hover:border-amber-500/60 shadow-sm flex flex-col justify-between ${
                    isWhitePaperMode ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono font-extrabold text-xs flex items-center justify-center">
                        {sym.sn}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Symbol #{sym.sn}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-amber-400">{sym.nameNep}</h4>
                      <p className={`text-xs ${isWhitePaperMode ? 'text-slate-500' : 'text-slate-400'}`}>{sym.nameEng}</p>
                    </div>

                    {/* Diagram Representations */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                      {/* Lay-Out Symbol Box */}
                      <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-h-[70px] ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">ले-आउट चिन्ह</span>
                        <div className="text-amber-300 font-bold text-xs flex items-center justify-center">
                          {sym.sn === 1 && <span className="text-xl font-bold font-mono">⦚ ⤡</span>}
                          {sym.sn === 2 && <span className="text-xl font-bold font-mono">5⤡</span>}
                          {sym.sn === 8 && <span className="text-base font-bold font-mono border px-1 border-amber-400">⧄</span>}
                          {sym.sn === 9 && <span className="text-base font-bold font-mono border rounded-full w-6 h-6 flex items-center justify-center border-amber-400">✕</span>}
                          {sym.sn === 15 && <span className="text-sm font-mono border px-1 border-amber-400">▭</span>}
                          {sym.sn === 16 && <span className="text-sm font-mono border rounded-full w-6 h-6 flex items-center justify-center border-amber-400 font-bold">V</span>}
                          {sym.sn === 14 && <span className="text-sm font-mono border rounded-full w-6 h-6 flex items-center justify-center border-amber-400 font-bold">A</span>}
                          {sym.sn === 33 && <span className="text-lg font-bold font-mono">~ AC</span>}
                          {sym.sn === 34 && <span className="text-lg font-bold font-mono">— DC</span>}
                          {sym.sn === 43 && <span className="text-lg font-bold font-mono">⏚</span>}
                          {![1, 2, 8, 9, 14, 15, 16, 33, 34, 43].includes(sym.sn) && (
                            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-cyan-300">
                              [{sym.layoutSymbolType}]
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Wiring Symbol Box */}
                      <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-h-[70px] ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">वायरिङ चिन्ह</span>
                        <div className="text-emerald-400 font-bold text-xs flex items-center justify-center">
                          {sym.sn === 1 && <span className="text-lg font-mono">⚲</span>}
                          {sym.sn === 2 && <span className="text-sm font-mono">⚲⚲⚲</span>}
                          {sym.sn === 8 && <span className="text-base font-mono border border-emerald-400 px-1">▯</span>}
                          {sym.sn === 9 && <span className="text-base font-mono border rounded-full w-6 h-6 flex items-center justify-center border-emerald-400">⊗</span>}
                          {sym.sn === 15 && <span className="text-xs font-mono">vvv-vvv</span>}
                          {sym.sn === 40 && <span className="text-lg font-mono font-bold">╂┤</span>}
                          {sym.sn === 43 && <span className="text-lg font-mono font-bold">⏚</span>}
                          {sym.sn === 44 && <span className="text-xl font-mono font-bold">●</span>}
                          {sym.sn === 45 && <span className="text-lg font-mono font-bold">⤹</span>}
                          {![1, 2, 8, 9, 15, 40, 43, 44, 45].includes(sym.sn) && (
                            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-emerald-300">
                              [{sym.wiringSymbolType}]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Custom Symbol Image if uploaded */}
                    {sym.imageUrl && (
                      <div
                        className="my-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center cursor-pointer group"
                        onClick={() => setZoomedImage({ url: sym.imageUrl!, caption: `${sym.nameNep} (${sym.nameEng})` })}
                      >
                        <img
                          src={sym.imageUrl}
                          alt={sym.nameNep}
                          className="h-20 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[9px] text-amber-400 mt-1 opacity-80 flex items-center gap-0.5">
                          <Maximize2 className="w-2.5 h-2.5" /> क्लिक गरी जुम गर्नुहोस्
                        </span>
                      </div>
                    )}

                    <p className={`text-xs leading-relaxed ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-300'}`}>
                      {sym.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => speakText(`${sym.nameNep}। अंग्रेजी: ${sym.nameEng}। ${sym.description}`)}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      सुन्नुहोस्
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {sym.sn <= 32 ? 'Part A' : 'Part B'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 4: OHM'S LAW CALCULATOR & EXAMPLES ======================= */}
        {activeMainTab === 'ohms-law' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl ${isWhitePaperMode ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  चौथो दिनको पाठ (Day 4 Formula & Math)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-400">
                  ओहमको नियम (Ohm's Law) र गणितीय हिसाब सिमुलेटर
                </h2>
                <p className={`text-xs sm:text-sm ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-300'}`}>
                  V = I × R सुत्र प्रयोग गरी भोल्टेज, करेन्ट, अवरोध र विद्युतिय शक्ति (Power) गणना गर्नुहोस्।
                </p>
              </div>

              {/* Triangle Formula + Interactive Calculator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Triangle Formula */}
                <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 mb-3">रेखा चित्र नं. ४: ओहमको नियमको जादुई त्रिभुज</span>
                  <svg className="w-64 h-52" viewBox="0 0 200 160">
                    {/* Outer Triangle */}
                    <polygon points="100,10 10,150 190,150" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                    {/* Horizontal Divider */}
                    <line x1="45" y1="90" x2="155" y2="90" stroke="#f59e0b" strokeWidth="2.5" />
                    {/* Vertical Divider */}
                    <line x1="100" y1="90" x2="100" y2="150" stroke="#f59e0b" strokeWidth="2.5" />
                    {/* Labels */}
                    <text x="100" y="65" textAnchor="middle" fill="#38bdf8" fontSize="26" fontWeight="bold">V</text>
                    <text x="65" y="130" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold">I</text>
                    <text x="135" y="130" textAnchor="middle" fill="#f59e0b" fontSize="24" fontWeight="bold">R</text>
                  </svg>
                  <div className="mt-4 space-y-1 text-xs text-center">
                    <div className="text-cyan-300 font-bold">• V छोपिदिए: <span className="text-white">I × R रहन्छ</span></div>
                    <div className="text-emerald-300 font-bold">• I छोपिदिए: <span className="text-white">V / R रहन्छ</span></div>
                    <div className="text-amber-300 font-bold">• R छोपिदिए: <span className="text-white">V / I रहन्छ</span></div>
                  </div>
                </div>

                {/* Calculator Controls */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">के पत्ता लगाउने?</span>
                    {(['I', 'V', 'R', 'P'] as const).map(term => (
                      <button
                        key={term}
                        onClick={() => setCalcSolveFor(term)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          calcSolveFor === term
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {term === 'V' && 'भोल्टेज (V)'}
                        {term === 'I' && 'करेन्ट (I)'}
                        {term === 'R' && 'प्रतिरोध (R)'}
                        {term === 'P' && 'शक्ति (P)'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {calcSolveFor !== 'V' && (
                      <div>
                        <label className="text-xs font-bold text-cyan-400 block mb-1">
                          भोल्टेज (V in Volts):
                        </label>
                        <input
                          type="number"
                          value={calcVoltage}
                          onChange={e => setCalcVoltage(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    {calcSolveFor !== 'I' && (
                      <div>
                        <label className="text-xs font-bold text-emerald-400 block mb-1">
                          करेन्ट (I in Amperes):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={calcCurrent}
                          onChange={e => setCalcCurrent(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    {calcSolveFor !== 'R' && calcSolveFor !== 'P' && (
                      <div>
                        <label className="text-xs font-bold text-amber-400 block mb-1">
                          प्रतिरोध (R in Ohms Ω):
                        </label>
                        <input
                          type="number"
                          value={calcResistance}
                          onChange={e => setCalcResistance(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-amber-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Calculated Output Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-amber-500/40 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      हिसाबको नतिजा ({calculateResult().formula}):
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                      {calculateResult().val} {calculateResult().unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Textbook Examples from Pages 14-15 */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                  म्यानुअलमा उल्लेखित ४ वटा आधिकारिक उदाहरणहरू (Textbook Examples)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-cyan-400">उदाहरण १ (Example 1)</span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      कुनै 10 Volts को Supply Line मा 0.5 Ampere Current वगिरहेको छ भने प्रयोग गरिएको Resistance कति होला?
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-amber-300">
                      R = V / I = 10 / 0.5 = <span className="font-bold text-emerald-400">20 Ω (Ans)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-cyan-400">उदाहरण २ (Example 2)</span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      कुनै 10 Volts को Supply Line मा प्रयोग गरिएको Resistance 20 Ω भए बगिरहेको Current (I) कति होला?
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-amber-300">
                      I = V / R = 10 / 20 = <span className="font-bold text-emerald-400">0.5 Amps (Ans)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-cyan-400">उदाहरण ३ (Example 3)</span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      कुनै Circuit मा 20 Ω को Resistance लगाउँदा 0.5 Ampere Current बगिरहेको छ भने Supply Voltage कति होला?
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-amber-300">
                      V = I × R = 0.5 × 20 = <span className="font-bold text-emerald-400">10 Volts (Ans)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-cyan-400">उदाहरण ४ (Example 4 - Power)</span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Supply Voltage = 20 V, Current = 2 A, Resistance = 10 Ω भए Resistance को Power (Watt) कति होला?
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-amber-300">
                      P = V × I = 20 × 2 = <span className="font-bold text-emerald-400">40 Watt (Ans)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: PVC WIRE RATING TABLE ======================= */}
        {activeMainTab === 'wire-table' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl ${isWhitePaperMode ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  तेह्रौं दिनको आधिकारिक तालिका (Page 42 Table)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-400">
                  Current Rating in Different PVC Insulated Wire Table
                </h2>
                <p className={`text-xs sm:text-sm ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-300'}`}>
                  विभिन्न साइजका तामा (Copper) र आल्मुनियम (Aluminum) तारहरूको सिंगल फेज र थ्री फेज करेन्ट क्षमता (Amps)।
                </p>
              </div>

              {/* Table Render */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700/60 shadow-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`${isWhitePaperMode ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-amber-300'} font-bold`}>
                    <tr>
                      <th colSpan={2} className="p-3 border border-slate-700/40 text-center bg-slate-950/40">Size</th>
                      <th colSpan={2} className="p-3 border border-slate-700/40 text-center bg-blue-950/40 text-cyan-300">Single Phase AC2 Cable</th>
                      <th colSpan={2} className="p-3 border border-slate-700/40 text-center bg-purple-950/40 text-purple-300">Three Phase AC3 or 4 Cable</th>
                    </tr>
                    <tr className="text-[11px]">
                      <th className="p-2 border border-slate-700/40">No. SWG</th>
                      <th className="p-2 border border-slate-700/40">Sq. mm</th>
                      <th className="p-2 border border-slate-700/40 text-center text-amber-400">Copper (A)</th>
                      <th className="p-2 border border-slate-700/40 text-center text-slate-400">Aluminum (A)</th>
                      <th className="p-2 border border-slate-700/40 text-center text-amber-400">Copper (A)</th>
                      <th className="p-2 border border-slate-700/40 text-center text-slate-400">Aluminum (A)</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${isWhitePaperMode ? 'divide-slate-200' : 'divide-slate-800'}`}>
                    {wireTable.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0
                            ? isWhitePaperMode ? 'bg-white' : 'bg-slate-900/40'
                            : isWhitePaperMode ? 'bg-slate-50' : 'bg-slate-800/30'
                        } hover:bg-amber-500/10 transition-colors`}
                      >
                        <td className="p-2.5 border border-slate-700/40 font-sans font-bold text-amber-400">{row.swg}</td>
                        <td className="p-2.5 border border-slate-700/40 text-cyan-300">{row.sqmm}</td>
                        <td className="p-2.5 border border-slate-700/40 text-center font-bold text-amber-300">{row.singlePhaseCu}</td>
                        <td className="p-2.5 border border-slate-700/40 text-center text-slate-400">{row.singlePhaseAl}</td>
                        <td className="p-2.5 border border-slate-700/40 text-center font-bold text-amber-300">{row.threePhaseCu}</td>
                        <td className="p-2.5 border border-slate-700/40 text-center text-slate-400">{row.threePhaseAl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Crucial Engineering Note from Book */}
              <div className={`p-4 rounded-2xl border ${isWhitePaperMode ? 'bg-amber-50 border-amber-300' : 'bg-amber-950/20 border-amber-500/30'} space-y-1`}>
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  म्यानुअलको महत्वपूर्ण नोट:
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isWhitePaperMode ? 'text-slate-800' : 'text-slate-200'}`}>
                  विद्युतिय तारको छनौट गर्दा करेन्ट निर्धारणलाई मात्र ध्यान दिएर हुदैन। त्यस परिपथको दुरी, तापक्रम र भोल्टेजलाई पनि ख्याल गर्नु पर्दछ। किनभने जति-जति तारको लम्बाई र तापक्रम बढ्दै जान्छ त्यतिनै भोल्टेज ड्रप (Voltage Drop) बढ्दै जान्छ।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 6: SAFETY & FIRST AID ======================= */}
        {activeMainTab === 'safety' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl ${isWhitePaperMode ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  नवौं दिनको पाठ (Day 9 Safety & First Aid)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-400">
                  विद्युतिय सुरक्षाका १४ नियमहरू र प्राथमिक उपचार
                </h2>
                <p className={`text-xs sm:text-sm ${isWhitePaperMode ? 'text-slate-600' : 'text-slate-300'}`}>
                  विद्युतिय झट्काबाट बच्ने उपायहरू र जीवन रक्षाका ३ वटा कृत्रिम श्वास दिने विधिहरू।
                </p>
              </div>

              {/* 14 Safety Rules */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  विद्युतिय सुरक्षाका १४ नियमहरू (Safety Precautions of Electricity)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    '१. कार्य स्थलमा सधैव सचेत हुने, पूर्ण अवलोकन गरी Main Supply Shut Down गरेर मात्र कार्य गर्ने।',
                    '२. खाली तार युक्त परिपथमा कार्य गर्दा Safety Tools जस्तो Hand Glove, Safety Belt, बुट, एप्रोन, चस्मा आदि लगाउने।',
                    '३. Cable हरु राम्रोसंग Insulated भए नभएको जाँच गर्ने, यदि बिग्रेको भए मर्मत गरेपछि मात्र प्रयोग गर्ने।',
                    '४. केबलहरू भुईँमा जथाभावी पल्टिरहेको, धारिलो वस्तु वा उच्च तापक्रम नजिक भए टाढा राख्ने।',
                    '५. जमिन मुनि गाडिएको केबल कम्तिमा ४५० मि.मि. (१८ ईन्च) मुनि र टायल्सले ढाकिएको हुनुपर्दछ।',
                    '६. झुण्डिएका केबलहरू जमिन देखि कम्तिमा ५.२ मिटर (१७ फिट) माथि र राम्रोसंग अड्याइएको हुनुपर्दछ।',
                    '७. काम गर्ने ठाउँमा आवश्यक प्रकाश (Lighting) हुनुपर्दछ।',
                    '८. पावर परिपथमा प्रयोग भएका केबलहरू दोब्बर इन्सुलेसन (Double Insulation) गरिएको हुनुपर्दछ।',
                    '९. Portable विद्युतिय औजारहरू केबलमा समातेर यताउता नसार्ने।',
                    '१०. मेसिनमा लोड भएको अवस्थामा सिधै बन्द नगर्ने।',
                    '११. फ्युज बदल्नु अघि मेन स्वीच बन्द गरेर मात्र गर्ने।',
                    '१२. कार्य गर्नु अघि Line Tester ले विद्युत प्रवाह भए नभएको अध्ययन गर्ने र Line Short गरेर मात्र काम गर्ने।',
                    '१३. कार्य पूरा भएपछि औजारहरू जहाँबाट झिकिएको हो त्यहि ठाउँमा राख्नुपर्दछ।',
                    '१४. कार्य प्रारम्भ गर्नु अघि दिईएको निर्देशन राम्ररी अध्ययन गर्नुपर्दछ।'
                  ].map((rule, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-start gap-2.5 ${isWhitePaperMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-xs leading-relaxed font-medium">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Methods of Resuscitation */}
              <div className={`p-5 rounded-2xl border ${isWhitePaperMode ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/20 border-rose-500/30'} space-y-4`}>
                <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  कृत्रिम श्वास दिने ३ तरिकाहरू (Methods of Resuscitation):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-extrabold text-amber-400">१. काँधमा थिचेर (Prone Resuscitation)</span>
                    <p className="text-slate-300 leading-relaxed">
                      घाइतेलाई पेटको भरमा सुताएर काँध र ढाडमा नियमित दबाब दिएर फोक्सोमा हावा प्रवाह गराउने परम्परागत विधि।
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-extrabold text-emerald-400">२. मुखमा मुख जोडेर (Mouth to Mouth)</span>
                    <p className="text-slate-300 leading-relaxed">
                      घाइतेको नाक बन्द गरी सिधै मुखबाट मुखमा प्रति मिनेट १२ देखि १६ पटक गहिरो कृत्रिम श्वास फुक्ने सबैभन्दा प्रभावकारी विधि।
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-extrabold text-cyan-400">३. नाकमा मुख जोडेर (Mouth to Nose)</span>
                    <p className="text-slate-300 leading-relaxed">
                      यदि घाइतेको मुखमा चोट छ वा मुख खोल्न नसकिएमा मुख बन्द गरी नाकबाट कृत्रिम अक्सिजन दिने विधि।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
