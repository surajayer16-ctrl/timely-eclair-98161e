import React, { useState, useEffect } from 'react';
import {
  Zap,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  Search,
  Upload,
  Download,
  Sliders,
  Copy,
  Layers,
  Clock,
  Wrench,
  FileText,
  HelpCircle,
  X,
  Sparkles,
  Code,
  Image as ImageIcon
} from 'lucide-react';
import {
  ElectricianLesson,
  ElectricSymbolItem,
  PracticalCircuit,
  WireCapacityRow,
  electricianLessons as defaultLessons,
  electricalSymbolsList as defaultSymbols,
  practicalCircuitsData as defaultPracticals,
  wireCapacityTable as defaultWireTable
} from '../data/electricianNoteData';
import { ElectricianPhotoUploader } from './ElectricianPhotoUploader';
import { safeLocalStorageSet } from '../lib/imageCompressor';
import { saveToCloud } from '../lib/cloudSyncService';


interface ElectricianAdminSectionProps {
  lessons: ElectricianLesson[];
  setLessons: React.Dispatch<React.SetStateAction<ElectricianLesson[]>>;
  symbols: ElectricSymbolItem[];
  setSymbols: React.Dispatch<React.SetStateAction<ElectricSymbolItem[]>>;
  practicals: PracticalCircuit[];
  setPracticals: React.Dispatch<React.SetStateAction<PracticalCircuit[]>>;
  wireTable: WireCapacityRow[];
  setWireTable: React.Dispatch<React.SetStateAction<WireCapacityRow[]>>;
  onNotify: (message: string) => void;
  initialEditDay?: number | null;
}

export const ElectricianAdminSection: React.FC<ElectricianAdminSectionProps> = ({
  lessons,
  setLessons,
  symbols,
  setSymbols,
  practicals,
  setPracticals,
  wireTable,
  setWireTable,
  onNotify,
  initialEditDay
}) => {
  const [subTab, setSubTab] = useState<'lessons' | 'practicals' | 'symbols' | 'wireTable'>('lessons');
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonCategoryFilter, setLessonCategoryFilter] = useState('all');
  const [symbolSearch, setSymbolSearch] = useState('');
  const [practicalSearch, setPracticalSearch] = useState('');

  // Editing Modals State
  const [editingLesson, setEditingLesson] = useState<ElectricianLesson | null>(null);
  const [lessonJsonMode, setLessonJsonMode] = useState(false);
  const [lessonJsonText, setLessonJsonText] = useState('');

  const [editingPractical, setEditingPractical] = useState<PracticalCircuit | null>(null);
  const [editingSymbol, setEditingSymbol] = useState<ElectricSymbolItem | null>(null);
  const [editingWireRow, setEditingWireRow] = useState<{ index: number; row: WireCapacityRow } | null>(null);

  // If passed initialEditDay, open it automatically
  useEffect(() => {
    if (initialEditDay !== undefined && initialEditDay !== null) {
      const target = lessons.find((l) => l.dayNumber === initialEditDay);
      if (target) {
        setSubTab('lessons');
        handleOpenEditLesson(target);
      }
    }
  }, [initialEditDay]);

  const saveLessonsToStorage = (updated: ElectricianLesson[]) => {
    setLessons(updated);
    saveToCloud('nitvt_electrician_lessons', updated);
  };

  const saveSymbolsToStorage = (updated: ElectricSymbolItem[]) => {
    setSymbols(updated);
    saveToCloud('nitvt_electrician_symbols', updated);
  };

  const savePracticalsToStorage = (updated: PracticalCircuit[]) => {
    setPracticals(updated);
    saveToCloud('nitvt_electrician_practicals', updated);
  };

  const saveWireTableToStorage = (updated: WireCapacityRow[]) => {
    setWireTable(updated);
    saveToCloud('nitvt_electrician_wire_table', updated);
  };



  // --- Lesson Handlers ---
  const handleOpenEditLesson = (lesson: ElectricianLesson) => {
    // Deep clone
    const cloned = JSON.parse(JSON.stringify(lesson));
    setEditingLesson(cloned);
    setLessonJsonText(JSON.stringify(cloned, null, 2));
    setLessonJsonMode(false);
  };

  const handleAddNewLesson = () => {
    const nextDay = lessons.length > 0 ? Math.max(...lessons.map((l) => l.dayNumber)) + 1 : 1;
    const newLesson: ElectricianLesson = {
      day: `दिन ${nextDay}`,
      dayNumber: nextDay,
      title: '',
      nepaliTitle: '',
      duration: '५:०० घण्टा',
      objective: '',
      category: 'foundation',
      tableRows: [
        {
          sn: '१',
          activity: 'सैद्धान्तिक छलफल तथा प्रस्तुतीकरण',
          method: 'व्याख्या र अभ्यास',
          materials: 'ह्वाइटबोर्ड, मार्कर, म्यानुअल',
          duration: '२ घण्टा'
        }
      ],
      contentSections: [
        {
          heading: '१. मुख्य विषयवस्तु तथा परिभाषा',
          text: 'यहाँ पाठको पूर्ण सैद्धान्तिक र प्रयोगात्मक विवरण लेख्नुहोस्...',
          bullets: ['महत्वपूर्ण नियम १', 'महत्वपूर्ण नियम २']
        }
      ],
      homework: ['आज सिकेका बुँदाहरू अभ्यास गर्नुहोस्।']
    };
    setEditingLesson(newLesson);
    setLessonJsonText(JSON.stringify(newLesson, null, 2));
    setLessonJsonMode(false);
  };

  const handleDuplicateLesson = (lesson: ElectricianLesson) => {
    const nextDay = Math.max(...lessons.map((l) => l.dayNumber)) + 1;
    const cloned: ElectricianLesson = JSON.parse(JSON.stringify(lesson));
    cloned.dayNumber = nextDay;
    cloned.day = `दिन ${nextDay} (प्रतिलिपि)`;
    cloned.nepaliTitle = `${cloned.nepaliTitle} (Copy)`;
    const updated = [...lessons, cloned];
    saveLessonsToStorage(updated);
    onNotify(`पाठ ${cloned.dayNumber} प्रतिलिपि गरियो!`);
  };

  const handleDeleteLesson = (dayNumber: number) => {
    if (confirm(`के तपाईं दिन ${dayNumber} को पाठ निश्चित हटाउन चाहनुहुन्छ?`)) {
      const updated = lessons.filter((l) => l.dayNumber !== dayNumber);
      saveLessonsToStorage(updated);
      onNotify(`दिन ${dayNumber} को पाठ हटाइयो।`);
    }
  };

  const handleSaveLessonModal = () => {
    if (!editingLesson) return;
    let finalLesson: ElectricianLesson = editingLesson;
    if (lessonJsonMode) {
      try {
        finalLesson = JSON.parse(lessonJsonText);
      } catch {
        alert('अमान्य JSON ढाँचा! कृपया त्रुटि सच्याउनुहोस्।');
        return;
      }
    }

    if (!finalLesson.nepaliTitle && !finalLesson.title) {
      alert('कृपया पाठको शीर्षक लेख्नुहोस्।');
      return;
    }

    const exists = lessons.some((l) => l.dayNumber === finalLesson.dayNumber);
    let updated: ElectricianLesson[];
    if (exists) {
      updated = lessons.map((l) => (l.dayNumber === finalLesson.dayNumber ? finalLesson : l));
    } else {
      updated = [...lessons, finalLesson].sort((a, b) => a.dayNumber - b.dayNumber);
    }

    saveLessonsToStorage(updated);
    setEditingLesson(null);
    onNotify(`पाठ "${finalLesson.nepaliTitle || finalLesson.title}" सफलतापूर्वक सेभ गरियो!`);
  };

  // --- Export / Import / Reset ---
  const handleExportLessons = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lessons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `electrician_lessons_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportLessons = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].dayNumber) {
          if (confirm(`के तपाईं आयात गरिएका ${parsed.length} वटा पाठहरू लोड गर्न चाहनुहुन्छ?`)) {
            saveLessonsToStorage(parsed);
            onNotify(`${parsed.length} वटा पाठहरू सफलतापूर्वक आयात गरियो!`);
          }
        } else {
          alert('अमान्य फाइल ढाँचा! कृपया वैध इलेक्ट्रिसियन पाठहरूको JSON फाइल चयन गर्नुहोस्।');
        }
      } catch {
        alert('JSON फाइल पढ्न सकिएन।');
      }
    };
    reader.readAsText(file);
  };

  const handleResetLessons = () => {
    if (confirm('के तपाईं सबै ३८ दिनका इलेक्ट्रिसियन पाठहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्न चाहनुहुन्छ? तपाईंले गरेका परिवर्तनहरू मेटिनेछन्।')) {
      saveLessonsToStorage(defaultLessons);
      onNotify('इलेक्ट्रिसियन पाठहरू पूर्वनिर्धारित ३८ दिनमा रिसेट गरियो!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('lessons')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'lessons'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>पाठहरू (Days 1–38) [{lessons.length}]</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('practicals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'practicals'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>प्रयोगात्मक परिपथहरू (१–११) [{practicals.length}]</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('symbols')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'symbols'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>६४ विद्युतिय चिन्हहरू [{symbols.length}]</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('wireTable')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'wireTable'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>तार क्षमता तालिका [{wireTable.length}]</span>
          </button>
        </div>

        <div className="text-right text-[11px] text-slate-400 flex items-center gap-2 justify-end">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>इलेक्ट्रिसियन नोट एडमिन व्यवस्थापन</span>
        </div>
      </div>

      {/* ===================== TAB 1: LESSONS (1–38) ===================== */}
      {subTab === 'lessons' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Category Filter */}
              <select
                value={lessonCategoryFilter}
                onChange={(e) => setLessonCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">सबै विधा ({lessons.length})</option>
                <option value="foundation">आधारभूत (Foundation)</option>
                <option value="tools">औजारहरू (Tools)</option>
                <option value="circuits">परिपथहरू (Circuits)</option>
                <option value="safety">सुरक्षा (Safety)</option>
                <option value="symbols">चिन्हहरू (Symbols)</option>
                <option value="cables">तार/केबल (Cables)</option>
                <option value="practicals">प्रयोगात्मक (Practicals)</option>
              </select>

              {/* Search input */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="पाठ शीर्षक, दिन वा उद्देश्य खोज्नुहोस्..."
                  value={lessonSearch}
                  onChange={(e) => setLessonSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Buttons: Add, Import, Export, Reset */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddNewLesson}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ पाठ थप्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={handleExportLessons}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-1 border border-slate-700"
                title="सबै पाठहरू JSON फाइलमा डाउनलोड गर्नुहोस्"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export</span>
              </button>

              <label
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-1 border border-slate-700 cursor-pointer"
                title="JSON फाइलबाट पाठहरू आयात गर्नुहोस्"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImportLessons} />
              </label>

              <button
                type="button"
                onClick={handleResetLessons}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-1 border border-rose-500/30"
                title="पूर्वनिर्धारित ३८ दिनका पाठहरूमा रिसेट गर्नुहोस्"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रिसेट</span>
              </button>
            </div>
          </div>

          {/* Lessons Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {lessons
              .filter((l) => {
                if (lessonCategoryFilter !== 'all' && l.category !== lessonCategoryFilter) return false;
                if (!lessonSearch) return true;
                const q = lessonSearch.toLowerCase().trim();
                return (
                  l.day.toLowerCase().includes(q) ||
                  String(l.dayNumber).includes(q) ||
                  (l.nepaliTitle || '').toLowerCase().includes(q) ||
                  (l.title || '').toLowerCase().includes(q) ||
                  (l.objective || '').toLowerCase().includes(q)
                );
              })
              .map((lesson) => (
                <div
                  key={lesson.dayNumber}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all"
                >
                  <div className="space-y-2">
                    {/* Top Row: Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-lg font-black">
                          {lesson.day}
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {lesson.duration}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {lesson.category}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">
                        {lesson.nepaliTitle || lesson.title}
                      </h4>
                      {lesson.nepaliTitle && lesson.title && (
                        <p className="text-[11px] text-slate-400 mt-0.5 font-sans">{lesson.title}</p>
                      )}
                    </div>

                    {/* Objective */}
                    {lesson.objective && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        <span className="text-amber-400 font-bold">उद्देश्य: </span>
                        {lesson.objective}
                      </p>
                    )}

                    {/* Metric Badges */}
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 flex-wrap">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        कार्यतालिका: <strong className="text-amber-300">{lesson.tableRows?.length || 0}</strong>
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        खण्डहरू: <strong className="text-cyan-300">{lesson.contentSections?.length || 0}</strong>
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        गृहकार्य: <strong className="text-emerald-300">{lesson.homework?.length || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleDuplicateLesson(lesson)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="प्रतिलिपि गर्नुहोस्"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>कपी</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditLesson(lesson)}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>सम्पादन</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.dayNumber)}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs transition-colors"
                      title="पाठ हटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: PRACTICAL CIRCUITS (1–11) ===================== */}
      {subTab === 'practicals' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="प्रयोगात्मक परिपथ खोज्नुहोस्..."
                value={practicalSearch}
                onChange={(e) => setPracticalSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextNo = practicals.length > 0 ? Math.max(...practicals.map((p) => p.practicalNo)) + 1 : 1;
                  const newPrac: PracticalCircuit = {
                    id: nextNo,
                    practicalNo: nextNo,
                    day: `दिन ${nextNo + 15}`,
                    title: `प्रयोगात्मक अभ्यास ${nextNo}`,
                    condition: 'लोड नियन्त्रण अभ्यास',
                    controlBy: '१-वे स्विच',
                    description: 'परिपथ जडान अभ्यास तथा परीक्षण',
                    components: ['१x बत्ती', '१x १-वे स्विच'],
                    materials: ['तार २/२२', 'कन्ड्युट पाइप', 'राउन्ड ब्लक'],
                    fuses: ['फ्युज / MCB ६ एम्पियर'],
                    switches: ['१-वे स्विच'],
                    loads: ['१०० वाट चिम'],
                    circuitLogic: 'स्विच अन हुँदा फेज बत्तीमा पुग्छ र बत्ती बल्छ।'
                  };
                  setEditingPractical(newPrac);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ प्रयोगात्मक थप्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('सबै प्रयोगात्मक परिपथहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्नुहुन्छ?')) {
                    savePracticalsToStorage(defaultPracticals);
                    onNotify('प्रयोगात्मक परिपथहरू रिसेट गरियो!');
                  }
                }}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-1 border border-rose-500/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रिसेट</span>
              </button>
            </div>
          </div>

          {/* Practicals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {practicals
              .filter((p) => {
                if (!practicalSearch) return true;
                const q = practicalSearch.toLowerCase().trim();
                return (
                  p.title.toLowerCase().includes(q) ||
                  p.condition.toLowerCase().includes(q) ||
                  p.controlBy.toLowerCase().includes(q) ||
                  String(p.practicalNo).includes(q)
                );
              })
              .map((p) => (
                <div
                  key={p.practicalNo}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg font-bold">
                        अभ्यास #{p.practicalNo} ({p.day})
                      </span>
                      <span className="text-[11px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-md font-semibold">
                        {p.controlBy}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-emerald-400 font-bold">सर्त: </span>
                      {p.condition}
                    </p>

                    <div className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-850 space-y-1">
                      <p className="text-[11px] text-slate-400 font-mono line-clamp-2">
                        <strong className="text-amber-400">तर्क: </strong>
                        {p.circuitLogic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingPractical(JSON.parse(JSON.stringify(p)))}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-amber-500/40"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>सम्पादन</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`अभ्यास #${p.practicalNo} हटाउनुहुन्छ?`)) {
                          const updated = practicals.filter((item) => item.practicalNo !== p.practicalNo);
                          savePracticalsToStorage(updated);
                          onNotify(`अभ्यास #${p.practicalNo} हटाइयो।`);
                        }
                      }}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: 64 SYMBOLS ===================== */}
      {subTab === 'symbols' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="चिन्हको नेपाली वा अंग्रेजी नाम खोज्नुहोस्..."
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextSn = symbols.length > 0 ? Math.max(...symbols.map((s) => s.sn)) + 1 : 1;
                  const newSym: ElectricSymbolItem = {
                    sn: nextSn,
                    nameNep: '',
                    nameEng: '',
                    layoutSymbolType: 'custom',
                    wiringSymbolType: 'custom',
                    description: ''
                  };
                  setEditingSymbol(newSym);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ चिन्ह थप्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('सबै ६४ विद्युतिय चिन्हहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्नुहुन्छ?')) {
                    saveSymbolsToStorage(defaultSymbols);
                    onNotify('६४ चिन्हहरू रिसेट गरियो!');
                  }
                }}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-1 border border-rose-500/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रिसेट</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {symbols
              .filter((s) => {
                if (!symbolSearch) return true;
                const q = symbolSearch.toLowerCase().trim();
                return (
                  s.nameNep.toLowerCase().includes(q) ||
                  s.nameEng.toLowerCase().includes(q) ||
                  s.description.toLowerCase().includes(q) ||
                  String(s.sn).includes(q)
                );
              })
              .map((s) => (
                <div
                  key={s.sn}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
                      <span>चिन्ह #{s.sn}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{s.layoutSymbolType}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white">{s.nameNep}</h5>
                    <p className="text-[11px] text-slate-400">{s.nameEng}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 bg-slate-950 p-1.5 rounded border border-slate-850">
                      {s.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingSymbol(JSON.parse(JSON.stringify(s)))}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> सम्पादन
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`चिन्ह #${s.sn} (${s.nameNep}) हटाउनुहुन्छ?`)) {
                          const updated = symbols.filter((item) => item.sn !== s.sn);
                          saveSymbolsToStorage(updated);
                          onNotify(`चिन्ह #${s.sn} हटाइयो।`);
                        }
                      }}
                      className="p-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: WIRE CAPACITY TABLE ===================== */}
      {subTab === 'wireTable' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>विद्युत जडानमा प्रयोग हुने तार र केबुल क्षमता तालिका व्यवस्थापन</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                SWG, साइज (sq. mm.), १-फेज तथा ३-फेज तामा र आल्मुनियमको करेन्ट क्षमता
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newRow: WireCapacityRow = {
                    swg: '1/18',
                    sqmm: '1.0 sq mm',
                    singlePhaseCu: '11 Amp',
                    singlePhaseAl: '7 Amp',
                    threePhaseCu: '10 Amp',
                    threePhaseAl: '6 Amp'
                  };
                  setEditingWireRow({ index: wireTable.length, row: newRow });
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ साइज थप्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('तार क्षमता तालिका पूर्वनिर्धारित मानमा रिसेट गर्नुहुन्छ?')) {
                    saveWireTableToStorage(defaultWireTable);
                    onNotify('तार क्षमता तालिका रिसेट गरियो!');
                  }
                }}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-1 border border-rose-500/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रिसेट</span>
              </button>
            </div>
          </div>

          {/* Wire Table View */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-bold">
                  <th className="p-3">SWG साइज</th>
                  <th className="p-3">वर्ग मि.मि. (sq. mm)</th>
                  <th className="p-3">१-फेज तामा (Cu)</th>
                  <th className="p-3">१-फेज आल्मुनियम (Al)</th>
                  <th className="p-3">३-फेज तामा (Cu)</th>
                  <th className="p-3">३-फेज आल्मुनियम (Al)</th>
                  <th className="p-3 text-right">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {wireTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-bold text-amber-300">{row.swg}</td>
                    <td className="p-3 font-semibold text-white">{row.sqmm}</td>
                    <td className="p-3 text-emerald-400">{row.singlePhaseCu}</td>
                    <td className="p-3 text-slate-400">{row.singlePhaseAl}</td>
                    <td className="p-3 text-cyan-400">{row.threePhaseCu}</td>
                    <td className="p-3 text-slate-400">{row.threePhaseAl}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingWireRow({ index: idx, row: { ...row } })}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded"
                          title="सम्पादन"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`साइज ${row.swg} हटाउनुहुन्छ?`)) {
                              const updated = wireTable.filter((_, i) => i !== idx);
                              saveWireTableToStorage(updated);
                              onNotify(`साइज ${row.swg} हटाइयो।`);
                            }
                          }}
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded"
                          title="हटाउनुहोस्"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT ELECTRICIAN LESSON ===================== */}
      {editingLesson && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                    <span>इलेक्ट्रिसियन पाठ सम्पादक</span>
                    <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-black">
                      {editingLesson.day}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    पाठको शीर्षक, तालिका, विषयवस्तु खण्डहरू, डायग्राम तथा गृहकार्य सम्पादन गर्नुहोस्
                  </p>
                </div>
              </div>

              {/* Mode toggle and close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!lessonJsonMode) {
                      setLessonJsonText(JSON.stringify(editingLesson, null, 2));
                    } else {
                      try {
                        const parsed = JSON.parse(lessonJsonText);
                        setEditingLesson(parsed);
                      } catch {
                        alert('अमान्य JSON ढाँचा!');
                        return;
                      }
                    }
                    setLessonJsonMode(!lessonJsonMode);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    lessonJsonMode
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{lessonJsonMode ? 'दृश्य फारम (Visual Form)' : 'JSON मोड'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-left">
              {lessonJsonMode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>सम्पूर्ण पाठको JSON सिधै सम्पादन वा पेस्ट गर्नुहोस्:</span>
                    <span className="text-purple-400 font-mono">JSON Mode Active</span>
                  </div>
                  <textarea
                    rows={22}
                    value={lessonJsonText}
                    onChange={(e) => setLessonJsonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 font-mono text-[11px] text-emerald-300 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>
              ) : (
                /* Visual Interactive Form */
                <div className="space-y-5">
                  {/* Basic Day Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-amber-400 font-bold block mb-1">दिनको नाम (Day Label)</label>
                      <input
                        type="text"
                        value={editingLesson.day}
                        onChange={(e) => setEditingLesson({ ...editingLesson, day: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                        placeholder="उदा: पहिलो दिन"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">दिन नम्बर (Day No.)</label>
                      <input
                        type="number"
                        value={editingLesson.dayNumber}
                        onChange={(e) => setEditingLesson({ ...editingLesson, dayNumber: Number(e.target.value) || 1 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">अवधि (Duration)</label>
                      <input
                        type="text"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        placeholder="५:०० घण्टा"
                      />
                    </div>
                    <div>
                      <label className="text-cyan-400 font-bold block mb-1">विधा (Category)</label>
                      <select
                        value={editingLesson.category}
                        onChange={(e) => setEditingLesson({ ...editingLesson, category: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        <option value="foundation">आधारभूत (Foundation)</option>
                        <option value="tools">औजारहरू (Tools)</option>
                        <option value="circuits">परिपथहरू (Circuits)</option>
                        <option value="safety">सुरक्षा (Safety)</option>
                        <option value="symbols">चिन्हहरू (Symbols)</option>
                        <option value="cables">तार/केबल (Cables)</option>
                        <option value="practicals">प्रयोगात्मक (Practicals)</option>
                      </select>
                    </div>
                  </div>

                  {/* Lesson Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white font-bold block mb-1">नेपाली शीर्षक (Nepali Title)</label>
                      <input
                        type="text"
                        required
                        value={editingLesson.nepaliTitle || ''}
                        onChange={(e) => setEditingLesson({ ...editingLesson, nepaliTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                        placeholder="उदा: परिचय तथा आशा अपेक्षा संकलन र मिलन"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">अंग्रेजी शीर्षक (English Title)</label>
                      <input
                        type="text"
                        value={editingLesson.title || ''}
                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                        placeholder="e.g. Orientation & Expectation Collection"
                      />
                    </div>
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="text-amber-400 font-bold block mb-1">पाठको उद्देश्य (Lesson Objective)</label>
                    <textarea
                      rows={2}
                      value={editingLesson.objective || ''}
                      onChange={(e) => setEditingLesson({ ...editingLesson, objective: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
                      placeholder="यस पाठको समाप्ति पछि प्रशिक्षार्थीहरू के गर्न सक्षम हुनेछन्..."
                    />
                  </div>

                  {/* Main Lesson Photo / Diagram Uploader */}
                  <ElectricianPhotoUploader
                    label="पाठको मुख्य तस्विर / ब्यानर फोटो (Main Lesson Photo/Cover)"
                    imageUrl={editingLesson.imageUrl}
                    imageCaption={editingLesson.imageCaption}
                    onImageChange={(url) => setEditingLesson({ ...editingLesson, imageUrl: url })}
                    onCaptionChange={(cap) => setEditingLesson({ ...editingLesson, imageCaption: cap })}
                    onRemove={() => setEditingLesson({ ...editingLesson, imageUrl: undefined, imageCaption: undefined })}
                    suggestedPresets={[
                      { label: 'मल्टिमिटर तथा परीक्षण उपकरण', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
                      { label: 'घरको मुख्य स्विच र MCB प्यानल', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80' },
                      { label: 'विद्युत सुरक्षा तथा ज्याकेट/पन्जा', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80' },
                      { label: 'विद्युतिय तार तथा कन्ड्युट पाइप', url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=80' }
                    ]}
                  />

                  {/* Curriculum Activity Table Rows */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold flex items-center gap-2 text-xs">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>पाठको कार्यतालिका (Curriculum Activities - {editingLesson.tableRows?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(editingLesson.tableRows || []),
                            {
                              sn: `${(editingLesson.tableRows?.length || 0) + 1}`,
                              activity: '',
                              method: 'प्रयोगात्मक तथा छलफल',
                              materials: 'औजार तथा उपकरण',
                              duration: '१ घण्टा'
                            }
                          ];
                          setEditingLesson({ ...editingLesson, tableRows: updated });
                        }}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> क्रियाकलाप थप्नुहोस्
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {(editingLesson.tableRows || []).map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                        >
                          <div className="sm:col-span-1">
                            <label className="text-[10px] text-slate-500 block sm:hidden">क्र.सं.</label>
                            <input
                              type="text"
                              value={row.sn}
                              onChange={(e) => {
                                const copy = [...editingLesson.tableRows];
                                copy[rIdx].sn = e.target.value;
                                setEditingLesson({ ...editingLesson, tableRows: copy });
                              }}
                              className="w-full bg-slate-950 border border-slate-750 rounded px-2 py-1 text-center text-amber-400 font-bold"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="text-[10px] text-slate-400 block mb-0.5">क्रियाकलाप / Activity</label>
                            <input
                              type="text"
                              value={row.activity}
                              onChange={(e) => {
                                const copy = [...editingLesson.tableRows];
                                copy[rIdx].activity = e.target.value;
                                setEditingLesson({ ...editingLesson, tableRows: copy });
                              }}
                              className="w-full bg-slate-950 border border-slate-750 rounded px-2 py-1 text-white text-xs"
                              placeholder="क्रियाकलापको विवरण..."
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-slate-400 block mb-0.5">तरिका / Method</label>
                            <input
                              type="text"
                              value={row.method}
                              onChange={(e) => {
                                const copy = [...editingLesson.tableRows];
                                copy[rIdx].method = e.target.value;
                                setEditingLesson({ ...editingLesson, tableRows: copy });
                              }}
                              className="w-full bg-slate-950 border border-slate-750 rounded px-2 py-1 text-slate-300 text-xs"
                              placeholder="विधि..."
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-400 block mb-0.5">समय / Duration</label>
                            <input
                              type="text"
                              value={row.duration}
                              onChange={(e) => {
                                const copy = [...editingLesson.tableRows];
                                copy[rIdx].duration = e.target.value;
                                setEditingLesson({ ...editingLesson, tableRows: copy });
                              }}
                              className="w-full bg-slate-950 border border-slate-750 rounded px-2 py-1 text-slate-300 text-xs"
                              placeholder="१ घण्टा"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center justify-end pt-3 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingLesson.tableRows.filter((_, i) => i !== rIdx);
                                setEditingLesson({ ...editingLesson, tableRows: copy });
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded"
                              title="हटाउनुहोस्"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Content Sections */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>विस्तृत विषयवस्तु खण्डहरू (Content Sections - {editingLesson.contentSections?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(editingLesson.contentSections || []),
                            {
                              heading: `खण्ड ${(editingLesson.contentSections?.length || 0) + 1}`,
                              text: '',
                              bullets: []
                            }
                          ];
                          setEditingLesson({ ...editingLesson, contentSections: updated });
                        }}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> नयाँ खण्ड थप्नुहोस्
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {(editingLesson.contentSections || []).map((sec, sIdx) => (
                        <div key={sIdx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingLesson.contentSections.filter((_, i) => i !== sIdx);
                              setEditingLesson({ ...editingLesson, contentSections: copy });
                            }}
                            className="absolute right-3 top-3 text-rose-400 hover:text-rose-300 p-1 bg-slate-950/80 rounded-lg"
                            title="यो खण्ड हटाउनुहोस्"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Section Heading & Diagram Type */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                            <div className="sm:col-span-2">
                              <label className="text-[11px] text-cyan-400 font-bold block mb-1">
                                खण्ड #{sIdx + 1} को मुख्य शीर्षक
                              </label>
                              <input
                                type="text"
                                value={sec.heading}
                                onChange={(e) => {
                                  const copy = [...editingLesson.contentSections];
                                  copy[sIdx].heading = e.target.value;
                                  setEditingLesson({ ...editingLesson, contentSections: copy });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                                placeholder="खण्डको शीर्षक..."
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-amber-400 font-bold block mb-1">डायग्राम मोडेल</label>
                              <select
                                value={sec.diagramType || 'none'}
                                onChange={(e) => {
                                  const copy = [...editingLesson.contentSections];
                                  copy[sIdx].diagramType = e.target.value === 'none' ? undefined : (e.target.value as any);
                                  setEditingLesson({ ...editingLesson, contentSections: copy });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                              >
                                <option value="none">कुनै डायग्राम छैन</option>
                                <option value="ohms-law-triangle">ओहमको नियम त्रिकोण (V=IR)</option>
                                <option value="dc-waveform">DC तरंग (DC Waveform)</option>
                                <option value="ac-waveform">AC तरंग (AC Waveform)</option>
                                <option value="atom-structure">परमाणु संरचना (2N²)</option>
                                <option value="circuit-types">परिपथ प्रकारहरू (Circuits)</option>
                                <option value="wire-joints">तार जोर्नीहरू (Wire Joints)</option>
                                <option value="symbols-table">६४ चिन्ह तालिका</option>
                                <option value="wire-table">तार क्षमता तालिका</option>
                                <option value="practical-circuit">प्रयोगात्मक परिपथ</option>
                                <option value="power-socket">पावर सकेट (Power Socket 16A)</option>
                              </select>
                            </div>
                          </div>

                          {/* Section Text */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                              विस्तृत व्याख्या / नोट विवरण
                            </label>
                            <textarea
                              rows={3}
                              value={sec.text}
                              onChange={(e) => {
                                const copy = [...editingLesson.contentSections];
                                copy[sIdx].text = e.target.value;
                                setEditingLesson({ ...editingLesson, contentSections: copy });
                              }}
                              className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2.5 text-white text-xs leading-relaxed"
                              placeholder="यहाँ यस खण्डको मुख्य सैद्धान्तिक वा व्यावहारिक नोट लेख्नुहोस्..."
                            />
                          </div>

                          {/* Section Photo / Diagram Uploader */}
                          <ElectricianPhotoUploader
                            label={`खण्ड #${sIdx + 1} को तस्विर / डायग्राम (Section Photo/Diagram)`}
                            imageUrl={sec.imageUrl}
                            imageCaption={sec.imageCaption}
                            onImageChange={(url) => {
                              const copy = [...editingLesson.contentSections];
                              copy[sIdx].imageUrl = url;
                              setEditingLesson({ ...editingLesson, contentSections: copy });
                            }}
                            onCaptionChange={(cap) => {
                              const copy = [...editingLesson.contentSections];
                              copy[sIdx].imageCaption = cap;
                              setEditingLesson({ ...editingLesson, contentSections: copy });
                            }}
                            onRemove={() => {
                              const copy = [...editingLesson.contentSections];
                              copy[sIdx].imageUrl = undefined;
                              copy[sIdx].imageCaption = undefined;
                              setEditingLesson({ ...editingLesson, contentSections: copy });
                            }}
                          />

                          {/* Section Bullets */}
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-emerald-400 font-bold">
                                मुख्य बुँदाहरू (Bullets - {sec.bullets?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...editingLesson.contentSections];
                                  copy[sIdx].bullets = [...(copy[sIdx].bullets || []), ''];
                                  setEditingLesson({ ...editingLesson, contentSections: copy });
                                }}
                                className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold"
                              >
                                + बुँदा थप्नुहोस्
                              </button>
                            </div>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {(sec.bullets || []).map((bText, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2">
                                  <span className="text-[10px] text-emerald-500">•</span>
                                  <input
                                    type="text"
                                    value={bText}
                                    onChange={(e) => {
                                      const copy = [...editingLesson.contentSections];
                                      const bCopy = [...(copy[sIdx].bullets || [])];
                                      bCopy[bIdx] = e.target.value;
                                      copy[sIdx].bullets = bCopy;
                                      setEditingLesson({ ...editingLesson, contentSections: copy });
                                    }}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                                    placeholder="बुँदा लेख्नुहोस्..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const copy = [...editingLesson.contentSections];
                                      copy[sIdx].bullets = (copy[sIdx].bullets || []).filter((_, i) => i !== bIdx);
                                      setEditingLesson({ ...editingLesson, contentSections: copy });
                                    }}
                                    className="text-rose-400 hover:text-rose-300 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Homework Items */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold flex items-center gap-2 text-xs">
                        <HelpCircle className="w-4 h-4 text-emerald-400" />
                        <span>गृहकार्य तथा अभ्यास प्रश्नहरू (Homework - {editingLesson.homework?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingLesson.homework || []), ''];
                          setEditingLesson({ ...editingLesson, homework: updated });
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> प्रश्न थप्नुहोस्
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {(editingLesson.homework || []).map((hw, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 font-bold w-4 text-center">{hIdx + 1}.</span>
                          <input
                            type="text"
                            value={hw}
                            onChange={(e) => {
                              const updated = [...editingLesson.homework];
                              updated[hIdx] = e.target.value;
                              setEditingLesson({ ...editingLesson, homework: updated });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-white text-xs"
                            placeholder="गृहकार्यको प्रश्न वा कार्य..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingLesson.homework.filter((_, i) => i !== hIdx);
                              setEditingLesson({ ...editingLesson, homework: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/90">
              <span className="text-[11px] text-slate-400">
                परिवर्तनहरू सेभ गरेपछि विद्यार्थी तथा प्रशिक्षक दुवैका लागि तत्काल उपलब्ध हुनेछ।
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="button"
                  onClick={handleSaveLessonModal}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>सेभ गर्नुहोस् (Save Lesson)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT PRACTICAL ===================== */}
      {editingPractical && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>प्रयोगात्मक परिपथ #{editingPractical.practicalNo} सम्पादन</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPractical(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">अभ्यास नं (Practical No)</label>
                  <input
                    type="number"
                    value={editingPractical.practicalNo}
                    onChange={(e) => setEditingPractical({ ...editingPractical, practicalNo: Number(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">दिन (Day)</label>
                  <input
                    type="text"
                    value={editingPractical.day}
                    onChange={(e) => setEditingPractical({ ...editingPractical, day: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-bold block mb-1">शीर्षक (Title)</label>
                <input
                  type="text"
                  value={editingPractical.title}
                  onChange={(e) => setEditingPractical({ ...editingPractical, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amber-400 font-bold block mb-1">नियन्त्रण (Control By)</label>
                  <input
                    type="text"
                    value={editingPractical.controlBy}
                    onChange={(e) => setEditingPractical({ ...editingPractical, controlBy: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-emerald-400 font-bold block mb-1">सर्त (Condition)</label>
                  <input
                    type="text"
                    value={editingPractical.condition}
                    onChange={(e) => setEditingPractical({ ...editingPractical, condition: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">परिपथको तर्क (Circuit Logic)</label>
                <textarea
                  rows={3}
                  value={editingPractical.circuitLogic}
                  onChange={(e) => setEditingPractical({ ...editingPractical, circuitLogic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              {/* Practical Circuit Photo / Wiring Diagram Uploader */}
              <ElectricianPhotoUploader
                label="प्रयोगात्मक परिपथको रेखाचित्र / फोटो (Circuit Diagram / Photo)"
                imageUrl={editingPractical.imageUrl}
                imageCaption={editingPractical.imageCaption}
                onImageChange={(url) => setEditingPractical({ ...editingPractical, imageUrl: url })}
                onCaptionChange={(cap) => setEditingPractical({ ...editingPractical, imageCaption: cap })}
                onRemove={() => setEditingPractical({ ...editingPractical, imageUrl: undefined, imageCaption: undefined })}
                suggestedPresets={[
                  { label: '२-वे सिँढी वाइरिङ रेखाचित्र', url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80' },
                  { label: 'कलिङ बेल र इन्डिकेटर परिपथ', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80' },
                  { label: 'पावर सकेट (16A) जडान', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80' }
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPractical(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                रद्द
              </button>
              <button
                type="button"
                onClick={() => {
                  const exists = practicals.some((p) => p.practicalNo === editingPractical.practicalNo);
                  const updated = exists
                    ? practicals.map((p) => (p.practicalNo === editingPractical.practicalNo ? editingPractical : p))
                    : [...practicals, editingPractical];
                  savePracticalsToStorage(updated);
                  setEditingPractical(null);
                  onNotify(`प्रयोगात्मक परिपथ #${editingPractical.practicalNo} सेभ गरियो!`);
                }}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                सेभ गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT SYMBOL ===================== */}
      {editingSymbol && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>विद्युतिय चिन्ह #{editingSymbol.sn} सम्पादन</span>
              </h3>
              <button type="button" onClick={() => setEditingSymbol(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">चिन्ह नम्बर (SN)</label>
                  <input
                    type="number"
                    value={editingSymbol.sn}
                    onChange={(e) => setEditingSymbol({ ...editingSymbol, sn: Number(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">प्रकार (Symbol Type ID)</label>
                  <input
                    type="text"
                    value={editingSymbol.layoutSymbolType}
                    onChange={(e) => setEditingSymbol({ ...editingSymbol, layoutSymbolType: e.target.value, wiringSymbolType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-bold block mb-1">नेपाली नाम (Nepali Name)</label>
                <input
                  type="text"
                  value={editingSymbol.nameNep}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, nameNep: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">अंग्रेजी नाम (English Name)</label>
                <input
                  type="text"
                  value={editingSymbol.nameEng}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, nameEng: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">विवरण तथा प्रयोग (Description)</label>
                <textarea
                  rows={3}
                  value={editingSymbol.description}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              {/* Symbol Custom Image / Photo */}
              <ElectricianPhotoUploader
                label="विद्युतिय चिन्हको तस्विर / फोटो (Symbol Image / Photo)"
                imageUrl={editingSymbol.imageUrl}
                onImageChange={(url) => setEditingSymbol({ ...editingSymbol, imageUrl: url })}
                onRemove={() => setEditingSymbol({ ...editingSymbol, imageUrl: undefined })}
                aspectRatio="square"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSymbol(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                रद्द
              </button>
              <button
                type="button"
                onClick={() => {
                  const exists = symbols.some((s) => s.sn === editingSymbol.sn);
                  const updated = exists
                    ? symbols.map((s) => (s.sn === editingSymbol.sn ? editingSymbol : s))
                    : [...symbols, editingSymbol];
                  saveSymbolsToStorage(updated);
                  setEditingSymbol(null);
                  onNotify(`चिन्ह #${editingSymbol.sn} सेभ गरियो!`);
                }}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                सेभ गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT WIRE ROW ===================== */}
      {editingWireRow && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>तार साइज क्षमता सम्पादन</span>
              </h3>
              <button type="button" onClick={() => setEditingWireRow(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amber-300 font-bold block mb-1">SWG साइज</label>
                  <input
                    type="text"
                    value={editingWireRow.row.swg}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, swg: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="उदा: 3/22"
                  />
                </div>
                <div>
                  <label className="text-white font-bold block mb-1">वर्ग मि.मि. (sq. mm)</label>
                  <input
                    type="text"
                    value={editingWireRow.row.sqmm}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, sqmm: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="उदा: 1.5 sq mm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-emerald-400 font-bold block mb-1">१-फेज तामा (Cu)</label>
                  <input
                    type="text"
                    value={editingWireRow.row.singlePhaseCu}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, singlePhaseCu: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono"
                    placeholder="उदा: 15 Amp"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">१-फेज आल्मुनियम (Al)</label>
                  <input
                    type="text"
                    value={editingWireRow.row.singlePhaseAl}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, singlePhaseAl: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono"
                    placeholder="उदा: 10 Amp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cyan-400 font-bold block mb-1">३-फेज तामा (Cu)</label>
                  <input
                    type="text"
                    value={editingWireRow.row.threePhaseCu}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, threePhaseCu: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono"
                    placeholder="उदा: 13 Amp"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">३-फेज आल्मुनियम (Al)</label>
                  <input
                    type="text"
                    value={editingWireRow.row.threePhaseAl}
                    onChange={(e) =>
                      setEditingWireRow({
                        ...editingWireRow,
                        row: { ...editingWireRow.row, threePhaseAl: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono"
                    placeholder="उदा: 9 Amp"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingWireRow(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                रद्द
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = [...wireTable];
                  if (editingWireRow.index < updated.length) {
                    updated[editingWireRow.index] = editingWireRow.row;
                  } else {
                    updated.push(editingWireRow.row);
                  }
                  saveWireTableToStorage(updated);
                  setEditingWireRow(null);
                  onNotify(`तार साइज ${editingWireRow.row.swg} सेभ गरियो!`);
                }}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                सेभ गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
