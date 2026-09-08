import React, { useState, useEffect } from 'react';
import {
  telecomManualChapters,
  telecomSymbolsList,
  ntcImportantNumbers,
  manualCategories,
  ManualChapter,
} from '../data/telecomManualNotes';
import { TelecomOutsideNetworkSymbols } from './TelecomOutsideNetworkSymbols';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  ArrowRight,
  Wrench,
  FileCheck,
  Layers,
  Sparkles,
  Copy,
  Check,
  Send,
  HelpCircle,
  Hash,
  ShieldCheck,
  Info,
  PhoneCall,
  Terminal,
  Zap,
  Radio,
  Share2,
  Image as ImageIcon,
  Maximize2,
  X,
  Award,
  Edit3,
  Plus,
} from 'lucide-react';

interface CurriculumViewerProps {
  initialChapterId?: number;
  onOpenTool?: (toolId: number) => void;
  onOpenExamPrep?: () => void;
  onOpenAiTutorWithPrompt?: (prompt: string) => void;
}

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({
  initialChapterId,
  onOpenTool,
  onOpenExamPrep,
  onOpenAiTutorWithPrompt,
}) => {
  const [chapters, setChapters] = useState<ManualChapter[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_notes');
      return saved ? JSON.parse(saved) : telecomManualChapters;
    } catch {
      return telecomManualChapters;
    }
  });

  const [symbols, setSymbols] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_symbols');
      return saved ? JSON.parse(saved) : telecomSymbolsList;
    } catch {
      return telecomSymbolsList;
    }
  });

  const [ntcNumbers, setNtcNumbers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_ntc_numbers');
      return saved ? JSON.parse(saved) : ntcImportantNumbers;
    } catch {
      return ntcImportantNumbers;
    }
  });

  useEffect(() => {
    const handleNotesUpdated = () => {
      try {
        const savedNotes = localStorage.getItem('nitvt_notes');
        if (savedNotes) {
          setChapters(JSON.parse(savedNotes));
        } else {
          setChapters(telecomManualChapters);
        }

        const savedSymbols = localStorage.getItem('nitvt_symbols');
        if (savedSymbols) {
          setSymbols(JSON.parse(savedSymbols));
        } else {
          setSymbols(telecomSymbolsList);
        }

        const savedNtc = localStorage.getItem('nitvt_ntc_numbers');
        if (savedNtc) {
          setNtcNumbers(JSON.parse(savedNtc));
        } else {
          setNtcNumbers(ntcImportantNumbers);
        }
      } catch (err) {
        console.error('Failed to parse updated notes/symbols/numbers:', err);
      }
    };

    window.addEventListener('nitvt_notes_updated', handleNotesUpdated);
    window.addEventListener('nitvt_symbols_updated', handleNotesUpdated);
    window.addEventListener('nitvt_ntc_numbers_updated', handleNotesUpdated);
    window.addEventListener('storage', handleNotesUpdated);
    return () => {
      window.removeEventListener('nitvt_notes_updated', handleNotesUpdated);
      window.removeEventListener('nitvt_symbols_updated', handleNotesUpdated);
      window.removeEventListener('nitvt_ntc_numbers_updated', handleNotesUpdated);
      window.removeEventListener('storage', handleNotesUpdated);
    };
  }, []);

  const openAdminEdit = (item: any, modalType: 'note' | 'symbol' | 'ntc_number', notesSubTab: 'chapters' | 'symbols' | 'numbers' = 'chapters') => {
    window.dispatchEvent(
      new CustomEvent('open_admin_modal', {
        detail: {
          tab: 'notes',
          notesSubTab,
          item,
          modalType,
        },
      })
    );
  };

  const [activeChapterId, setActiveChapterId] = useState<number>(
    initialChapterId || (chapters[0]?.id ?? telecomManualChapters[0].id)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showSymbolsDirectory, setShowSymbolsDirectory] = useState(false);
  const [symbolsSubTab, setSymbolsSubTab] = useState<'outside' | 'other' | 'numbers'>('outside');
  const [mobileShowList, setMobileShowList] = useState(!initialChapterId);

  // In-chapter interactive AI Question Ask state
  const [inlineQuestion, setInlineQuestion] = useState('');
  const [inlineAnswer, setInlineAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Modal lightbox preview for chapter images
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const activeChapter: ManualChapter =
    chapters.find((ch) => ch.id === activeChapterId) ||
    chapters[0] ||
    telecomManualChapters[0];

  const filteredChapters = chapters.filter((ch) => {
    const matchesCategory =
      selectedCategory === 'all' || ch.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.chapterNumber.toLowerCase().includes(q) ||
      ch.titleNepali.toLowerCase().includes(q) ||
      ch.titleEnglish.toLowerCase().includes(q) ||
      ch.summaryNepali.toLowerCase().includes(q) ||
      ch.contentNepali.toLowerCase().includes(q) ||
      ch.pageRef.toLowerCase().includes(q) ||
      ch.keyPoints.some((kp) => kp.toLowerCase().includes(q)) ||
      ch.examHighlights.some((eh) => eh.toLowerCase().includes(q))
    );
  });

  const handleCopyChapter = (ch: ManualChapter) => {
    const text = `सुरेन्द्र ऐर (Surendra Air) Telecom Training Manual - ${ch.chapterNumber}: ${ch.titleNepali} (${ch.titleEnglish})\n\n[सारांश]:\n${ch.summaryNepali}\n\n[मुख्य बुँदाहरू]:\n${ch.keyPoints.join('\n')}\n\n[विस्तृत नोट]:\n${ch.contentNepali}\n\n[परीक्षा हाइलाइटहरू]:\n${ch.examHighlights.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ch.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAskInlineAi = async () => {
    if (!inlineQuestion.trim() || isAskingAi) return;
    setIsAskingAi(true);
    setInlineAnswer(null);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${activeChapter.chapterNumber}: ${activeChapter.titleNepali} (${activeChapter.titleEnglish})`,
          message: inlineQuestion,
        }),
      });
      const data = await res.json();
      setInlineAnswer(
        data.reply ||
          'प्राविधिक उत्तर प्राप्त भयो। थप विवरणका लागि म्यानुअल र ल्याब अभ्यास हेर्नुहोस्।'
      );
    } catch (e) {
      setInlineAnswer(
        `नेपाल टेलिकम तथा CTEVT मापदण्ड अनुसार "${activeChapter.titleNepali}" को प्रयोगात्मक अभ्यास सुरेन्द्र ऐर ल्याबमा उपलब्ध छ। सम्पर्क: ०१-५२०३५२२।`
      );
    } finally {
      setIsAskingAi(false);
    }
  };

  const currentChapterIndex = chapters.findIndex(
    (ch) => ch.id === activeChapter.id
  );
  const prevChapter =
    currentChapterIndex > 0
      ? chapters[currentChapterIndex - 1]
      : null;
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 text-white space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-3 py-1 rounded-full mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              सुरेन्द्र ऐर (Surendra Air) CTEVT तह-१ र तह-२ सम्पूर्ण ३८ खण्डको आधिकारिक डिजिटल म्यानुअल
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            टेलिकम, अप्टिकल फाइबर तथा इलेक्ट्रिकल इन्जिनियरिङ म्यानुअल
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            नेपाल टेलिकम, एनसेल, आईएसपी तथा CTEVT/NSTB राष्ट्रिय सीप परीक्षण
            मापदण्ड अनुरूप तयार पारिएका सम्पूर्ण ३८ वटै खण्डहरूको सचित्र नोट,
            सूत्र, रेखाचित्र, सर्टफर्म र परीक्षोपयोगी सारांश।
          </p>
          
          {/* CTEVT & NSTB Official Quick Links */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">आधिकारिक लिङ्कहरू:</span>
            <a
              href="https://ctevt.org.np/curriculum/short-term"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
              referrerPolicy="no-referrer"
            >
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>CTEVT Telecom Curriculum (Short-Term)</span>
            </a>
            <a
              href="https://www.nstb.org.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
              referrerPolicy="no-referrer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NSTB Official Website (nstb.org.np)</span>
            </a>
          </div>
        </div>

        {/* Action Toggle for Symbols Directory */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSymbolsDirectory(!showSymbolsDirectory)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              showSymbolsDirectory
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-900/60'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>
              {showSymbolsDirectory ? 'म्यानुअल फर्किनुहोस्' : 'टेलिकम प्रतीक तथा NTC कोडहरू'}
            </span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter & Search Bar */}
      <div className={`space-y-4 ${!mobileShowList ? 'hidden lg:block' : 'block'}`}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="३८ खण्डहरू मध्ये खोज्नुहोस् (उदा. 12 Core, Splicing, OTDR, 33kV Clearance, Ohm's Law, HLR, VLR, GSM, Star Topology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md"
            >
              हटाउनुहोस्
            </button>
          )}
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
          {manualCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-semibold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.labelNepali}
              </button>
            );
          })}
        </div>
      </div>

      {/* SYMBOLS & NTC CODES DIRECTORY VIEW (If toggled) */}
      {showSymbolsDirectory ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                प्राविधिक संकेत निर्देशिका (NITVT / CTEVT २६ संकेतहरू)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                नेपाल टेलिकम OSP इन्जिनियरिङ नक्सा प्रतीकहरू (Standard Telecom Symbols)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                फिल्ड म्यापिङ, OSP रुट डिजाइन र क्याबिनेट-DP वितरणमा प्रयोग हुने आधिकारिक संकेतहरू (जस्ताको तेस्तै)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSymbolsDirectory(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow"
              >
                म्यानुअल पढ्न बन्द गर्नुहोस् &times;
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setSymbolsSubTab('outside')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                symbolsSubTab === 'outside'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>आउटसाइड नेटवर्क प्रतीकहरू (NITVT २६ वटा आधिकारिक)</span>
            </button>

            <button
              onClick={() => setSymbolsSubTab('other')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                symbolsSubTab === 'other'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>अन्य उपकरण तथा कम्पोनेन्ट संकेतहरू ({symbols.length})</span>
            </button>

            <button
              onClick={() => setSymbolsSubTab('numbers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                symbolsSubTab === 'numbers'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>NTC सोधपुछ सर्टकोडहरू ({ntcNumbers.length})</span>
            </button>
          </div>

          {/* Sub-tab 1: 26 Outside Network Symbols (Exact document reproduction) */}
          {symbolsSubTab === 'outside' && (
            <div className="space-y-4">
              <TelecomOutsideNetworkSymbols />
            </div>
          )}

          {/* Sub-tab 2: Other Components */}
          {symbolsSubTab === 'other' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  इन्डोर, स्विच, पावर र टेस्टिङ सम्बन्धी संकेतहरू
                </span>
                <button
                  onClick={() => openAdminEdit({ symbol: '', nameNepali: '', description: '' }, 'symbol', 'symbols')}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नयाँ संकेत थप्नुहोस्</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {symbols.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 hover:border-slate-700 transition-colors relative group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl font-bold text-amber-400 shrink-0 shadow-inner overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.nameNepali}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        item.symbol
                      )}
                    </div>
                    <div className="flex-1 pr-6">
                      <strong className="text-white text-sm block font-bold">
                        {item.nameNepali}
                      </strong>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => openAdminEdit(item, 'symbol', 'symbols')}
                      className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-400 hover:text-white transition-colors opacity-80 group-hover:opacity-100"
                      title="सम्पादन गर्नुहोस् (Edit Symbol)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: NTC Short Codes Table */}
          {symbolsSubTab === 'numbers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  <span>नेपाल टेलिकम सोधपुछ तथा आपतकालीन सर्टकोडहरू ({ntcNumbers.length})</span>
                </h4>
                <button
                  onClick={() => openAdminEdit({ number: '', service: '' }, 'ntc_number', 'numbers')}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नयाँ नम्बर थप्नुहोस्</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ntcNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 relative group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-extrabold text-base px-3 py-1 rounded-xl">
                        {num.number}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        {num.service}
                      </span>
                    </div>
                    <button
                      onClick={() => openAdminEdit(num, 'ntc_number', 'numbers')}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors opacity-80 group-hover:opacity-100"
                      title="सम्पादन गर्नुहोस् (Edit Number)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN 38-CHAPTER READER DUAL COLUMN LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Chapters Navigation List */}
          <div className={`lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto ${!mobileShowList ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>खण्ड सूची ({filteredChapters.length} / 38)</span>
              </span>
              <span className="text-[11px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-bold">
                CTEVT Prep
              </span>
            </div>

            {/* Direct Quick Link to Outside Network Symbols */}
            <div
              onClick={() => {
                setShowSymbolsDirectory(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/40 hover:border-amber-400 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">NITVT / CTEVT</span>
                    <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded font-mono">२६ संकेतहरू</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    आउटसाइड नेटवर्क प्रतीकहरू (OSP Symbols)
                  </h4>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>

            {filteredChapters.map((chapter) => {
              const isActive = chapter.id === activeChapter.id;
              return (
                <div
                  key={chapter.id}
                  onClick={() => {
                    setActiveChapterId(chapter.id);
                    setInlineAnswer(null);
                    setInlineQuestion('');
                    setMobileShowList(false); // Hide the list to show the content immediately on mobile
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top to read comfortably
                  }}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {chapter.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {chapter.chapterNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {chapter.pageRef}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5">
                      {chapter.titleNepali}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                      {chapter.titleEnglish}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 self-center" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Chapter Full Content Display */}
          <div className={`lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 ${mobileShowList ? 'hidden lg:block' : 'block'}`}>
            
            {/* Mobile Back Button */}
            <button
              onClick={() => {
                setMobileShowList(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="lg:hidden flex items-center justify-center gap-2 mb-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all border border-blue-500/50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>३८ वटा खण्डहरूको सूचीमा फर्किनुहोस् (Back to Chapters)</span>
            </button>

            {/* Chapter Header */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-xl">
                    {activeChapter.chapterNumber}
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-xl border border-slate-700 font-mono">
                    {activeChapter.pageRef}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAdminEdit(activeChapter, 'note', 'chapters')}
                    className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:border-blue-400"
                    title="यो अध्यायका सबै विवरण सम्पादन गर्नुहोस्"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>अध्याय सम्पादन (Edit)</span>
                  </button>

                  <button
                    onClick={() => handleCopyChapter(activeChapter)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                    title="यो अध्यायको नोट कपी गर्नुहोस्"
                  >
                    {copiedId === activeChapter.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">कपी भयो!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>नोट कपी</span>
                      </>
                    )}
                  </button>

                  {onOpenExamPrep && (
                    <button
                      onClick={onOpenExamPrep}
                      className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>CTEVT परीक्षा सेट</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activeChapter.titleNepali}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                  {activeChapter.titleEnglish}
                </p>
              </div>
            </div>

            {/* Section 1: Executive Summary Box */}
            <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-900/60 rounded-2xl p-4 sm:p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>अध्याय सारसंक्षेप (Chapter Executive Summary)</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeChapter.summaryNepali}
              </p>
            </div>

            {/* Section 1B: Chapter Technical Photo / Illustration (If Available) */}
            {activeChapter.imageUrl && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>आधिकारिक प्राविधिक ब्लुप्रिन्छ / नक्सा (Technical Illustration Photo)</span>
                  </span>
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: activeChapter.imageUrl!,
                        title: activeChapter.imageCaption || activeChapter.titleNepali,
                      })
                    }
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>ठूलो बनाएर हेर्नुहोस् (Zoom)</span>
                  </button>
                </div>

                <div
                  className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/80"
                  onClick={() =>
                    setPreviewImage({
                      url: activeChapter.imageUrl!,
                      title: activeChapter.imageCaption || activeChapter.titleNepali,
                    })
                  }
                >
                  <img
                    src={activeChapter.imageUrl}
                    alt={activeChapter.imageCaption || activeChapter.titleNepali}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-96 object-contain mx-auto group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                      <span>पूर्ण स्क्रिनमा हेर्नुहोस्</span>
                    </span>
                  </div>
                </div>

                {activeChapter.imageCaption && (
                  <p className="text-xs text-slate-300 text-center font-medium italic bg-slate-900/60 py-2 px-3 rounded-lg border border-slate-800/60">
                    📸 {activeChapter.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Section 2: Key Takeaways Points */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>मुख्य बुँदाहरू तथा मापदण्डहरू (Key Engineering Standards)</span>
              </h4>
              <div className="space-y-2">
                {activeChapter.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs sm:text-sm text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Technical Diagrams Viewer */}
            {activeChapter.diagrams && activeChapter.diagrams.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>प्राविधिक रेखाचित्र तथा सञ्जाल संरचना (Technical Diagrams)</span>
                </h4>
                {activeChapter.diagrams.map((diag, dIdx) => (
                  <div
                    key={dIdx}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                      <span className="font-bold text-cyan-300">{diag.title}</span>
                      <span className="font-mono text-[11px]">Surendra Air Technical Layout</span>
                    </div>
                    <pre className="text-[11px] sm:text-xs text-emerald-300 font-mono overflow-x-auto p-3 bg-black/60 rounded-xl leading-relaxed whitespace-pre">
                      {diag.data}
                    </pre>
                    <p className="text-[11px] text-slate-400 italic pt-1">
                      {diag.caption}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Section 4: Formula List (If available) */}
            {activeChapter.formulaList && activeChapter.formulaList.length > 0 && (
              <div className="bg-purple-950/40 border border-purple-900/60 rounded-2xl p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>मुख्य गणितीय सूत्र तथा मानक मानहरू (Formulas & Constants)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeChapter.formulaList.map((f: any, i: number) => {
                    const isObj = typeof f === 'object' && f !== null;
                    return (
                      <div
                        key={i}
                        className="bg-black/50 border border-purple-800/40 p-2.5 rounded-xl text-xs space-y-1"
                      >
                        {isObj ? (
                          <>
                            {f.name && <div className="text-purple-300 font-bold text-[11px]">{f.name}</div>}
                            <div className="font-mono text-amber-300 font-bold">{f.formula}</div>
                            {f.explanation && <div className="text-[10px] text-slate-400 leading-tight">{f.explanation}</div>}
                          </>
                        ) : (
                          <div className="font-mono text-purple-200 font-semibold">{f}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 5: Detailed Chapter Notes Content */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-400" />
                <span>विस्तृत पाठ्यक्रम नोट (Full Comprehensive Notes)</span>
              </h4>
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
                {activeChapter.contentNepali}
              </div>
            </div>

            {/* Section 6: Exam Highlights & CTEVT Most Likely Questions */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider">
                  CTEVT परीक्षा हाइलाइटहरू तथा सम्भावित प्रश्नहरू (Exam Must-Knows)
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                {activeChapter.examHighlights.map((eh, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{eh}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6B: Viva Questions & Interview Preparation (If available) */}
            {activeChapter.vivaQuestions && activeChapter.vivaQuestions.length > 0 && (
              <div className="bg-slate-950 border border-blue-900/60 rounded-2xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-2">
                  <HelpCircle className="w-4 h-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">
                    मौखिक तथा अन्तर्वार्ता सम्भावित प्रश्नोत्तर (Viva & Interview Q&A)
                  </h4>
                </div>
                <div className="space-y-2.5 pt-1">
                  {activeChapter.vivaQuestions.map((v: any, vIdx: number) => (
                    <div key={vIdx} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <div className="text-xs font-bold text-blue-300 flex items-start gap-1.5">
                        <span className="text-blue-400 font-mono">Q{vIdx + 1}:</span>
                        <span>{typeof v === 'object' ? v.question : v}</span>
                      </div>
                      {typeof v === 'object' && v.answer && (
                        <div className="text-xs text-emerald-300/90 pl-5 leading-relaxed bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
                          <span className="font-bold text-emerald-400">उत्तर: </span>
                          <span>{v.answer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 7: In-chapter Interactive AI Technical Instructor (Ask anything about this chapter) */}
            <div className="bg-slate-950 border border-cyan-900/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      AI प्राविधिक गुरुलाई यो अध्यायबारे सोध्नुहोस्
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      "{activeChapter.titleNepali}" बारे कुनै पनि द्विविधा छ भने तत्काल सोध्नुहोस्
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                  24/7 Live
                </span>
              </div>

              {/* Prompt Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`उदा. "${activeChapter.titleNepali}" मा सबैभन्दा महत्त्वपूर्ण मापदण्ड के के हुन् ?`}
                  value={inlineQuestion}
                  onChange={(e) => setInlineQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskInlineAi()}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                <button
                  onClick={handleAskInlineAi}
                  disabled={isAskingAi || !inlineQuestion.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
                >
                  {isAskingAi ? (
                    <span>सोच्दै...</span>
                  ) : (
                    <>
                      <span>सोध्नुहोस्</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* AI Live Reply Display */}
              {inlineAnswer && (
                <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-4 space-y-2 text-xs sm:text-sm text-slate-100 leading-relaxed shadow-inner">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>सुरेन्द्र ऐर (Surendra Air) प्राविधिक गुरुको जवाफ:</span>
                  </div>
                  <p className="whitespace-pre-line">{inlineAnswer}</p>
                </div>
              )}
            </div>

            {/* Pagination Controls (Previous / Next Chapter) */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              {prevChapter ? (
                <button
                  onClick={() => {
                    setActiveChapterId(prevChapter.id);
                    setInlineAnswer(null);
                    setInlineQuestion('');
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    अघिल्लो: {prevChapter.chapterNumber}
                  </span>
                  <span className="sm:hidden">अघिल्लो</span>
                </button>
              ) : (
                <div />
              )}

              <span className="text-xs text-slate-400 font-mono">
                अध्याय {activeChapter.id} / ३८
              </span>

              {nextChapter ? (
                <button
                  onClick={() => {
                    setActiveChapterId(nextChapter.id);
                    setInlineAnswer(null);
                    setInlineQuestion('');
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-md"
                >
                  <span className="hidden sm:inline">
                    पछिल्लो: {nextChapter.chapterNumber}
                  </span>
                  <span className="sm:hidden">पछिल्लो</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>

          </div>
        </div>
      )}

      {/* Compact Technical Illustration & Blueprint Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex flex-col items-center justify-center animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-col max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {previewImage.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="बन्द गर्नुहोस् (Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-2 flex items-center justify-center my-1.5">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>नेपाल टेलिकम / CTEVT आधिकारिक रेखाचित्र</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
