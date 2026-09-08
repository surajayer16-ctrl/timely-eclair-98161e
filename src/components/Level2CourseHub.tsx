import React, { useState } from 'react';
import {
  Cpu,
  BookOpen,
  MapPin,
  FileCheck,
  HelpCircle,
  Calculator,
  Wrench,
  CheckCircle2,
  Volume2,
  Search,
  Zap,
  Activity,
  Award,
  Shield,
  Clock,
  UserCheck,
  Eye,
  Sliders,
  Sparkles,
  Phone,
  Server,
  Layers,
  ChevronRight,
  Radio,
  Compass,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
  X,
  Download,
  Image,
  FileText
} from 'lucide-react';
import {
  level2CourseInfo,
  level2ManualChapters,
  level2ExamPaper2083,
  level2VivaBank,
  level2PoleSpecs,
  Level2Chapter,
  PoleStandardSpec,
  Level2ExamPaper
} from '../data/level2CourseData';
import { defaultSurveyMaps } from '../data/mapsData';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import { SurveyMap } from '../types';

interface Level2CourseHubProps {
  onOpenEnrollment: () => void;
  onOpenAiTutor: () => void;
}

export const Level2CourseHub: React.FC<Level2CourseHubProps> = ({
  onOpenEnrollment,
  onOpenAiTutor,
}) => {
  // Main Hub Sub-tabs
  const [activeSection, setActiveSection] = useState<
    'overview' | 'manual' | 'network-survey' | 'pole-fitting' | 'exam-2083' | 'viva' | 'calculators' | 'tools'
  >('overview');

  const [courseInfo, setCourseInfo] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_course_info');
      return saved ? JSON.parse(saved) : level2CourseInfo;
    } catch {
      return level2CourseInfo;
    }
  });

  const [poleSpecs, setPoleSpecs] = useState<PoleStandardSpec[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_pole_specs');
      return saved ? JSON.parse(saved) : level2PoleSpecs;
    } catch {
      return level2PoleSpecs;
    }
  });

  const [examPaper, setExamPaper] = useState<Level2ExamPaper>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_exam_paper');
      return saved ? JSON.parse(saved) : level2ExamPaper2083;
    } catch {
      return level2ExamPaper2083;
    }
  });

  const [vivaBank, setVivaBank] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_viva_bank');
      return saved ? JSON.parse(saved) : level2VivaBank;
    } catch {
      return level2VivaBank;
    }
  });

  const [level2Chapters, setLevel2Chapters] = useState<Level2Chapter[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_notes');
      return saved ? JSON.parse(saved) : level2ManualChapters;
    } catch {
      return level2ManualChapters;
    }
  });

  React.useEffect(() => {
    const handleLevel2Updated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level2_notes');
        setLevel2Chapters(saved ? JSON.parse(saved) : level2ManualChapters);
      } catch (err) {
        console.error('Failed to parse updated level2 notes:', err);
      }
    };
    const handleCourseInfoUpdated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level2_course_info');
        setCourseInfo(saved ? JSON.parse(saved) : level2CourseInfo);
      } catch (err) {
        console.error('Failed to parse updated level2 course info:', err);
      }
    };
    const handlePoleSpecsUpdated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level2_pole_specs');
        setPoleSpecs(saved ? JSON.parse(saved) : level2PoleSpecs);
      } catch (err) {
        console.error('Failed to parse updated level2 pole specs:', err);
      }
    };
    const handleExamPaperUpdated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level2_exam_paper');
        setExamPaper(saved ? JSON.parse(saved) : level2ExamPaper2083);
      } catch (err) {
        console.error('Failed to parse updated level2 exam paper:', err);
      }
    };
    const handleVivaBankUpdated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level2_viva_bank');
        setVivaBank(saved ? JSON.parse(saved) : level2VivaBank);
      } catch (err) {
        console.error('Failed to parse updated level2 viva bank:', err);
      }
    };

    window.addEventListener('nitvt_level2_notes_updated', handleLevel2Updated);
    window.addEventListener('nitvt_level2_course_info_updated', handleCourseInfoUpdated);
    window.addEventListener('nitvt_level2_pole_specs_updated', handlePoleSpecsUpdated);
    window.addEventListener('nitvt_level2_exam_paper_updated', handleExamPaperUpdated);
    window.addEventListener('nitvt_level2_viva_bank_updated', handleVivaBankUpdated);
    window.addEventListener('storage', handleLevel2Updated);
    window.addEventListener('storage', handleCourseInfoUpdated);
    window.addEventListener('storage', handlePoleSpecsUpdated);
    window.addEventListener('storage', handleExamPaperUpdated);
    window.addEventListener('storage', handleVivaBankUpdated);

    return () => {
      window.removeEventListener('nitvt_level2_notes_updated', handleLevel2Updated);
      window.removeEventListener('nitvt_level2_course_info_updated', handleCourseInfoUpdated);
      window.removeEventListener('nitvt_level2_pole_specs_updated', handlePoleSpecsUpdated);
      window.removeEventListener('nitvt_level2_exam_paper_updated', handleExamPaperUpdated);
      window.removeEventListener('nitvt_level2_viva_bank_updated', handleVivaBankUpdated);
      window.removeEventListener('storage', handleLevel2Updated);
      window.removeEventListener('storage', handleCourseInfoUpdated);
      window.removeEventListener('storage', handlePoleSpecsUpdated);
      window.removeEventListener('storage', handleExamPaperUpdated);
      window.removeEventListener('storage', handleVivaBankUpdated);
    };
  }, []);

  // Manual Chapter Selection
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    level2Chapters[0]?.id || level2ManualChapters[0].id
  );

  // VIVA Search & Filter
  const [vivaSearch, setVivaSearch] = useState<string>('');
  const [selectedVivaCat, setSelectedVivaCat] = useState<string>('ALL');
  const [speakingVivaId, setSpeakingVivaId] = useState<number | null>(null);

  // Exam Test Mode State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qNo: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [showExamResults, setShowExamResults] = useState<boolean>(false);
  const [activeExamTab, setActiveExamTab] = useState<'objective' | 'subjective' | 'matching' | 'spotting' | 'practical'>('objective');
  const [spottingSearch, setSpottingSearch] = useState<string>('');
  const [showMatchingAnswers, setShowMatchingAnswers] = useState<boolean>(true);

  // Network Survey Interactive Mode (Editable via Admin)
  const [surveyMaps, setSurveyMaps] = React.useState<SurveyMap[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_survey_maps');
      return saved ? JSON.parse(saved) : defaultSurveyMaps;
    } catch {
      return defaultSurveyMaps;
    }
  });
  const [activeSurveyMapId, setActiveSurveyMapId] = React.useState<string>(() => {
    return surveyMaps[0]?.id || 'gwarko';
  });
  const [copiedDiagram, setCopiedDiagram] = React.useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = React.useState<boolean>(false);
  const [mapViewTab, setMapViewTab] = React.useState<'ascii' | 'image'>('ascii');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  React.useEffect(() => {
    const handleMapsUpdated = () => {
      const saved = localStorage.getItem('nitvt_survey_maps');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSurveyMaps(parsed);
          if (!parsed.some((m: SurveyMap) => m.id === activeSurveyMapId) && parsed.length > 0) {
            setActiveSurveyMapId(parsed[0].id);
          }
        } catch (err) {
          console.error('Failed to parse updated survey maps:', err);
        }
      }
    };

    window.addEventListener('nitvt_maps_updated', handleMapsUpdated);
    window.addEventListener('storage', handleMapsUpdated);

    return () => {
      window.removeEventListener('nitvt_maps_updated', handleMapsUpdated);
      window.removeEventListener('storage', handleMapsUpdated);
    };
  }, [activeSurveyMapId]);

  const activeMap = surveyMaps.find(m => m.id === activeSurveyMapId) || surveyMaps[0] || defaultSurveyMaps[0];

  React.useEffect(() => {
    if (activeMap?.imageUrl) {
      setMapViewTab('image');
    } else {
      setMapViewTab('ascii');
    }
  }, [activeMap?.id, activeMap?.imageUrl]);

  // Calculators State
  const [calcType, setCalcType] = useState<'ohms' | 'loop' | 'snr' | 'earth' | 'battery'>('ohms');
  const [ohmVoltage, setOhmVoltage] = useState<number>(12);
  const [ohmResistance, setOhmResistance] = useState<number>(4);
  const [loopDiameter, setLoopDiameter] = useState<number>(0.4);
  const [loopLengthKm, setLoopLengthKm] = useState<number>(1.5);
  const [snrSignal, setSnrSignal] = useState<number>(100);
  const [snrNoise, setSnrNoise] = useState<number>(1);
  const [earthPitResistance, setEarthPitResistance] = useState<number>(3.5);
  const [batteryCells, setBatteryCells] = useState<number>(24);
  const [batteryCellVoltage, setBatteryCellVoltage] = useState<number>(2.0);
  const [batteryCellAh, setBatteryCellAh] = useState<number>(200);

  // Active Chapter Object
  const currentChapter =
    level2Chapters.find((c) => c.id === selectedChapterId) ||
    level2Chapters[0];

  // Filtered VIVA questions
  const filteredVivaQuestions = (vivaBank || []).filter((q) => {
    const matchesCat = selectedVivaCat === 'ALL' || q.cat === selectedVivaCat;
    const matchesSearch =
      q.q.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      q.a.toLowerCase().includes(vivaSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Handle Text to Speech
  const speakText = (text: string, id: number) => {
    if (speakingVivaId === id) {
      setSpeakingVivaId(null);
      return;
    }
    setSpeakingVivaId(id);
    speakNepaliText(text, 'तह-२ मौखिक प्रश्नोत्तर');
  };

  // Exam Scoring Calculation
  const calculateScore = () => {
    let score = 0;
    (examPaper?.objectiveSection?.questions || []).forEach((q) => {
      if (selectedAnswers[q.qNo] === q.correctOption) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* LEVEL-2 MASTER HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                CTEVT / NSTB तह-२ आधिकारिक पाठ्यक्रम
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                १० महिना (१६९६ घण्टा)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                NITVT ललितपुर (सुरेन्द्र ऐर)
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              टेलिकम टेक्निसियन तह–२ मास्टर हब
              <span className="block text-lg md:text-xl font-normal text-indigo-200 mt-1">
                Telecom Technician (CTEVT Level 2) Complete Professional Portal
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              २७१ पृष्ठको विस्तृत म्यानुअल, १२ वटा विषयगत अध्यायहरू, ग्वार्को चोक बेस म्याप र MFD सर्भे डायग्राम, २०८३ बैशाख परीक्षा सेट, १०० VIVA प्रश्नोत्तर तथा फिल्ड उपकरण गाइड।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenEnrollment}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>तह-२ भर्ना फारम</span>
            </button>
            <button
              onClick={onOpenAiTutor}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI टेलिकम ट्युटर सोध्नुहोस्</span>
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400">पाठ्यक्रम अध्याय</div>
            <div className="text-xl font-bold text-white">१२ वटा पूर्ण मोड्युल</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400">२०८३ बैशाख परीक्षा</div>
            <div className="text-xl font-bold text-emerald-400">१०० पूर्णाङ्क (Solved)</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400">VIVA प्रश्न बैंक</div>
            <div className="text-xl font-bold text-indigo-400">१०० प्रश्न (Voice AI)</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400">फिल्ड सर्भे नक्सा</div>
            <div className="text-xl font-bold text-cyan-400">Gwarko & MFD Maps</div>
          </div>
        </div>
      </div>

      {/* LEVEL-2 SUB-NAVIGATION TABS */}
      <style>{`
        .custom-tab-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-tab-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 9999px;
        }
        .custom-tab-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 9999px;
          border: 1px solid #1e293b;
        }
        .custom-tab-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
      `}</style>
      <div className="space-y-2">
        <div className="flex overflow-x-auto pb-3 gap-2 border-b border-slate-800 custom-tab-scrollbar">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span>तह-२ परिचय (Overview)</span>
          </button>

          <button
            onClick={() => setActiveSection('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'manual'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>१२ अध्याय म्यानुअल (Manual)</span>
          </button>

          <button
            onClick={() => setActiveSection('network-survey')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'network-survey'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-pink-400" />
            <span>फिल्ड सर्भे नक्सा (Gwarko Map)</span>
          </button>

          <button
            onClick={() => setActiveSection('pole-fitting')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'pole-fitting'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>पोल एक्ससेरिज मानक (Pole Standards)</span>
          </button>

          <button
            onClick={() => setActiveSection('exam-2083')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'exam-2083'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>२०८३ बैशाख परीक्षा सेट (100 Marks)</span>
          </button>

          <button
            onClick={() => setActiveSection('viva')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'viva'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>१०० VIVA प्रश्न बैंक (Voice)</span>
          </button>

          <button
            onClick={() => setActiveSection('calculators')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'calculators'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Calculator className="w-4 h-4 text-yellow-400" />
            <span>टेलिकम क्याल्कुलेटर (Math Tools)</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-850 px-2 py-1 rounded-lg border border-slate-800/40 select-none">
          <span className="animate-pulse">← बाँया स्क्रोल (Scroll Left)</span>
          <span className="text-indigo-300 font-semibold tracking-wide">सबै ७ वटा ट्याबहरू हेर्न दाँया-बाँया स्क्रोल गर्नुहोस्</span>
          <span className="animate-pulse">दाँया स्क्रोल (Scroll Right) →</span>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW TAB */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                पाठ्यक्रम उद्देश्य तथा तालिम लक्ष्य (Course Objectives)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {courseInfo.level} को यो आधिकारिक तालिम नेपाल सरकार, प्राविधिक शिक्षा तथा व्यावसायिक तालीम परिषद् (CTEVT) र राष्ट्रिय सीप परीक्षण समिति (NSTB) को व्यावसायिक इन्जिनियरिङ मानक अनुसार तयार गरिएको हो।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(courseInfo.objectives || []).map((obj: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveSection('manual')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>म्यानुअल अध्ययन गर्नुहोस्</span>
                </button>
                <button
                  onClick={() => setActiveSection('network-survey')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>फिल्ड सर्भे नक्सा हेर्नुहोस्</span>
                </button>
                <button
                  onClick={() => setActiveSection('exam-2083')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>२०८३ परीक्षा तयारी</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                प्रमाणपत्र तथा मान्यता (Accreditation)
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-emerald-300">CTEVT / NSTB Level-2 Certified</div>
                  <div className="text-slate-400">तालिम पश्चात राष्ट्रिय सीप परीक्षण समितिबाट परीक्षा लिई आधिकारिक प्रमाणपत्र प्रदान गरिनेछ।</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-indigo-300">नेपाल टेलिकम (NTC) पदोन्नति योग्य</div>
                  <div className="text-slate-400">नेपाल टेलिकम, एनसेल तथा आईएसपीहरूमा जुनियरबाट सिनियर प्राविधिक पदमा बढुवाका लागि पूर्ण मान्यता प्राप्त।</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-cyan-300">वैदेशिक रोजगारीका लागि प्रमाणीकरण</div>
                  <div className="text-slate-400">गल्फ, युरोप तथा मलेसियामा Telecom / Fiber Technician भिसाका लागि कन्सुलर प्रमाणीकरण हुने।</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 12 CHAPTERS MANUAL */}
      {activeSection === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              तह-२ पाठ्यपुस्तक अध्यायहरू (१२ Chapters)
            </div>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {level2Chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                    selectedChapterId === ch.id
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    selectedChapterId === ch.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ch.chapterNumber}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">{ch.titleNepali}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{ch.titleEnglish}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Content Main Area */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
                    <span>अध्याय {currentChapter.chapterNumber}</span>
                    <span>•</span>
                    <span>{currentChapter.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white">
                    {currentChapter.titleNepali}
                  </h2>
                  <div className="text-xs text-slate-400">{currentChapter.titleEnglish}</div>
                </div>

                <button
                  onClick={() => {
                    const fullText = `अध्याय ${currentChapter.chapterNumber}। ${currentChapter.titleNepali}। सारांश: ${currentChapter.summaryNepali}। मुख्य बुँदाहरू: ${currentChapter.keyPoints.join('। ')}। विस्तृत विवरण: ` +
                      currentChapter.contentSections.map(s => `${s.heading}। ${s.paragraphs.join('। ')}`).join('। ');
                    speakNepaliText(fullText, `अध्याय ${currentChapter.chapterNumber}: ${currentChapter.titleNepali}`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95"
                  title="सम्पूर्ण अध्याय आवाजमा सुन्नुहोस्"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>नेपाली आवाजमा सुन्नुहोस् (Listen Chapter)</span>
                </button>
              </div>

              <p className="text-sm text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800 mt-2">
                {currentChapter.summaryNepali}
              </p>

              {/* Chapter Technical Photo / Illustration (If Available) */}
              {currentChapter.imageUrl && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl overflow-hidden mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-indigo-400" />
                      <span>प्राविधिक तस्बिर / रेखाचित्र (Technical Illustration Photo)</span>
                    </span>
                    <button
                      onClick={() =>
                        setPreviewImage({
                          url: currentChapter.imageUrl!,
                          title: currentChapter.titleNepali,
                        })
                      }
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>ठूलो बनाएर हेर्नुहोस् (Zoom)</span>
                    </button>
                  </div>

                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/80"
                    onClick={() =>
                      setPreviewImage({
                        url: currentChapter.imageUrl!,
                        title: currentChapter.titleNepali,
                      })
                    }
                  >
                    <img
                      src={currentChapter.imageUrl}
                      alt={currentChapter.titleNepali}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-96 object-contain mx-auto group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                        <span>पूर्ण स्क्रिनमा हेर्नुहोस्</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Key Takeaways */}
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                मुख्य परीक्षामुखी बुँदाहरू (Key Exam Takeaways)
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {currentChapter.keyPoints.map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Content Sections */}
            <div className="space-y-6">
              {currentChapter.contentSections.map((sec, idx) => (
                <div key={idx} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <h3 className="text-base font-bold text-white text-indigo-200">
                    {sec.heading}
                  </h3>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* ASCII Diagram if available */}
                  {sec.diagramAscii && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto my-2">
                      <pre className="text-[11px] font-mono text-emerald-400 leading-tight">
                        {sec.diagramAscii}
                      </pre>
                    </div>
                  )}

                  {/* Formulas if available */}
                  {sec.formulas && sec.formulas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                      {sec.formulas.map((f, fIdx) => (
                        <div key={fIdx} className="bg-slate-900 p-3 rounded-lg border border-cyan-500/30 space-y-1">
                          <div className="text-xs font-bold text-cyan-300">{f.name}</div>
                          <div className="text-xs font-mono font-bold text-yellow-300 bg-slate-950 px-2 py-1 rounded">
                            {f.formula}
                          </div>
                          <div className="text-[11px] text-slate-400">{f.explanation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Table if available */}
                  {sec.tableData && (
                    <div className="overflow-x-auto rounded-lg border border-slate-800 my-2">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800 text-slate-300">
                          <tr>
                            {sec.tableData.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {sec.tableData.rows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/30">
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="p-2.5">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: NETWORK PLANNING & SURVEY (Gwarko Map, MFD, Secondary Poling & Admin Editable Maps) */}
      {activeSection === 'network-survey' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {surveyMaps.map((map, idx) => (
              <button
                key={map.id}
                onClick={() => setActiveSurveyMapId(map.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeSurveyMapId === map.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{idx + 1}. {map.category || map.titleNepali}</span>
              </button>
            ))}
          </div>

          {/* ACTIVE MAP DISPLAY */}
          {activeMap && (
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <MapPin className="w-4 h-4" />
                    <span>फिल्ड सर्भे अध्ययन (Field Network Survey Map) • [{activeMap.category}]</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {activeMap.titleNepali}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {activeMap.descriptionNepali}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 shadow-sm transition-transform active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>पपअपमा हेर्नुहोस् (Open Map Popup)</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeMap.asciiDiagram || '');
                      setCopiedDiagram(true);
                      setTimeout(() => setCopiedDiagram(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedDiagram ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDiagram ? 'कपी गरियो!' : 'रेखाचित्र कपी गर्नुहोस्'}</span>
                  </button>
                </div>
              </div>

              {/* View options & PDF file download */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-b border-slate-800/80 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMapViewTab('ascii')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      mapViewTab === 'ascii'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>ASCII रेखाचित्र (ASCII Diagram)</span>
                  </button>

                  {activeMap.imageUrl && (
                    <button
                      onClick={() => setMapViewTab('image')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        mapViewTab === 'image'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>फिल्ड नक्सा तस्बिर (JPG/PNG Map)</span>
                    </button>
                  )}
                </div>

                {activeMap.pdfUrl && (
                  <a
                    href={activeMap.pdfUrl}
                    download={`${activeMap.titleEnglish || 'map'}.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-500/30 shadow-sm transition-transform active:scale-95 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    <span>PDF नक्सा फाइल डाउनलोड (Download Map PDF)</span>
                  </a>
                )}
              </div>

              {/* Active map display content (ASCII vs IMAGE) */}
              {mapViewTab === 'image' && activeMap.imageUrl ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="relative max-w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                    <img
                      src={activeMap.imageUrl}
                      alt={activeMap.titleNepali}
                      className="max-h-[500px] w-auto object-contain transition-transform duration-300 hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">तपाईंले यो फिल्ड नक्साको JPG/PNG तस्बिर हेरिरहनु भएको छ।</p>
                </div>
              ) : (
                /* Interactive Map ASCII Diagram Box */
                <div className="bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-800 overflow-x-auto space-y-4">
                  {activeMap.legendItems && activeMap.legendItems.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300">
                      {activeMap.legendItems.map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color || '#38bdf8' }}></span>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <pre className="text-xs font-mono text-cyan-300 leading-tight bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre">
                    {activeMap.asciiDiagram}
                  </pre>
                </div>
              )}

              {/* Route Details & Technical Breakdown */}
              {activeMap.routeDetails && activeMap.routeDetails.length > 0 && (
                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(activeMap.routeDetails.length, 3)} gap-4`}>
                  {activeMap.routeDetails.map((route, rIdx) => (
                    <div key={rIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-sm font-bold text-cyan-300">{route.title}</h4>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {route.details?.map((detail, dIdx) => (
                          <li key={dIdx}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {activeMap.notesNepali && (
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs text-amber-300/90 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{activeMap.notesNepali}</span>
                </div>
              )}
            </div>
          )}

          {/* COMPACT MAP VIEWER POPUP MODAL */}
          {isMapModalOpen && activeMap && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
              onClick={() => setIsMapModalOpen(false)}
            >
              <div
                className="relative bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl space-y-3.5 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <MapPin className="w-4 h-4" />
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {activeMap.titleNepali} ({activeMap.category})
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeMap.descriptionNepali}
                </p>

                {/* Switcher in modal */}
                {activeMap.imageUrl && (
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs">
                    <button
                      onClick={() => setMapViewTab('ascii')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        mapViewTab === 'ascii' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ASCII रेखाचित्र
                    </button>
                    <button
                      onClick={() => setMapViewTab('image')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        mapViewTab === 'image' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      JPG/PNG नक्सा
                    </button>
                  </div>
                )}

                {mapViewTab === 'image' && activeMap.imageUrl ? (
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-center">
                    <img
                      src={activeMap.imageUrl}
                      alt={activeMap.titleNepali}
                      className="max-h-[380px] w-auto object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <>
                    {activeMap.legendItems && activeMap.legendItems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-slate-300">
                        {activeMap.legendItems.map((item, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color || '#38bdf8' }}></span>
                            {item.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto max-h-56 overflow-y-auto">
                      <pre className="text-[10px] font-mono text-cyan-300 leading-tight whitespace-pre">
                        {activeMap.asciiDiagram}
                      </pre>
                    </div>
                  </>
                )}

                {activeMap.pdfUrl && (
                  <div className="pt-1">
                    <a
                      href={activeMap.pdfUrl}
                      download={`${activeMap.titleEnglish || 'map'}.pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF डाउनलोड गर्नुहोस्</span>
                    </a>
                  </div>
                )}

                {activeMap.routeDetails && activeMap.routeDetails.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {activeMap.routeDetails.map((route, rIdx) => (
                      <div key={rIdx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                        <strong className="text-cyan-300 block font-bold">{route.title}</strong>
                        <ul className="text-slate-300 space-y-0.5">
                          {route.details?.map((detail, dIdx) => (
                            <li key={dIdx}>• {detail}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
                  >
                    बन्द गर्नुहोस् (Close)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: POLE ACCESSORIES FITTING SPECIFICATIONS */}
      {activeSection === 'pole-fitting' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  टेलिकम पोलमा एक्ससेरिज कस्ने स्थान र आधिकारिक उचाइ मापदण्ड
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  नेपाल टेलिकम फिल्ड इन्स्टलेसन गाइड र प्राविधिक म्यानुअल अनुसार पोलको टुप्पो (० cm) बाट तलको नाप:
                </p>
              </div>
            </div>

            {/* Visual Measurement Spec Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(poleSpecs || []).map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-amber-400 font-bold">नाप/दूरी</span>
                    <span className="text-xs font-extrabold text-white text-center leading-tight">
                      {spec.distanceFromTop}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white text-amber-200">
                      {spec.item}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {spec.descriptionNepali}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-400">
                      ✓ {spec.standardRule}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CTEVT 2083 BAISHAKH EXAM (100 MARKS SOLVED) */}
      {activeSection === 'exam-2083' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {examPaper.examDate} आधिकारिक मोडल सेट
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {examPaper.examTitleNepali}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  पूर्णाङ्क: ५०(Sub.) + ५०(Obj.) = १०० | उत्तीर्णाङ्क: ६० | समय: ३ घण्टा
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveExamTab('objective')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeExamTab === 'objective'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  वस्तुगत (MCQs - 50)
                </button>
                <button
                  onClick={() => setActiveExamTab('subjective')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeExamTab === 'subjective'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  विषयगत (Subj - 19)
                </button>
                <button
                  onClick={() => setActiveExamTab('matching')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeExamTab === 'matching'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  जोडा मिलाउने (Matching)
                </button>
                <button
                  onClick={() => setActiveExamTab('spotting')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeExamTab === 'spotting'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  स्पटिङ (Spotting - 16)
                </button>
                <button
                  onClick={() => setActiveExamTab('practical')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeExamTab === 'practical'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  प्रयोगात्मक कार्य (Practical)
                </button>
              </div>
            </div>

            {/* OBJECTIVE TAB */}
            {activeExamTab === 'objective' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-300">
                    उत्तर चयन गरी अन्त्यमा <strong>"नतिजा जाँच्नुहोस्"</strong> थिच्नुहोस्।
                  </span>
                  <button
                    onClick={() => setShowExamResults(!showExamResults)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                  >
                    {showExamResults ? 'नतिजा लुकाउनुहोस्' : 'नतिजा तथा उत्तर जाँच्नुहोस्'}
                  </button>
                </div>

                {showExamResults && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-300 font-bold">तपाईंको प्राप्ताङ्क</div>
                      <div className="text-2xl font-extrabold text-white">
                        {calculateScore()} / {examPaper.objectiveSection?.questions?.length || 0}
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 text-right">
                      {calculateScore() >= 12 ? (
                        <span className="text-emerald-400 font-bold">✓ उत्कृष्ट तयारी! तपाईं उत्तीर्ण हुनुभयो।</span>
                      ) : (
                        <span className="text-amber-400 font-bold">थप अध्ययन आवश्यक छ।</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {(examPaper.objectiveSection?.questions || []).map((q) => {
                    const isCorrect = selectedAnswers[q.qNo] === q.correctOption;
                    return (
                      <div
                        key={q.qNo}
                        className={`p-4 rounded-xl border transition-all ${
                          showExamResults
                            ? isCorrect
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="text-sm font-bold text-white mb-2">
                          {q.qNo}. {q.question}
                        </div>

                        {(q as any).imageUrl && (
                          <div
                            onClick={() => setPreviewImage({ url: (q as any).imageUrl!, title: `${q.qNo}. ${q.question}` })}
                            className="mb-3 cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-48 group/l2q"
                          >
                            <img
                              src={(q as any).imageUrl}
                              alt={q.question}
                              referrerPolicy="no-referrer"
                              className="max-h-44 object-contain rounded-lg group-hover/l2q:scale-102 transition-transform"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() =>
                                setSelectedAnswers({ ...selectedAnswers, [q.qNo]: opt })
                              }
                              className={`p-2.5 rounded-lg text-left transition-all flex items-center gap-2 border ${
                                selectedAnswers[q.qNo] === opt
                                  ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                                {opt}
                              </span>
                              <span>{q.options[opt]}</span>
                            </button>
                          ))}
                        </div>

                        {showExamResults && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1">
                            <div className="font-bold text-emerald-400">
                              सही उत्तर: विकल्प {q.correctOption}
                            </div>
                            <div className="text-slate-400">{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUBJECTIVE TAB */}
            {activeExamTab === 'subjective' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {examPaper.subjectiveSection?.instructions}
                </div>

                <div className="space-y-4">
                  {(examPaper.subjectiveSection?.questions || []).map((q) => (
                    <div key={q.qNo} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm md:text-base font-bold text-white">
                          प्रश्न नं. {q.qNo}: {q.question}
                        </h4>
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                          {q.marks} अंक
                        </span>
                      </div>

                      {(q as any).imageUrl && (
                        <div
                          onClick={() => setPreviewImage({ url: (q as any).imageUrl!, title: `प्रश्न नं. ${q.qNo}: ${q.question}` })}
                          className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-56 group/l2sq"
                        >
                          <img
                            src={(q as any).imageUrl}
                            alt={q.question}
                            referrerPolicy="no-referrer"
                            className="max-h-52 object-contain rounded-lg group-hover/l2sq:scale-102 transition-transform"
                          />
                        </div>
                      )}

                      <div className="text-xs md:text-sm text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                        <div className="font-bold text-emerald-300 mb-1">नमुना उत्तर (Model Answer):</div>
                        <p className="leading-relaxed">{q.modelAnswer}</p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="font-bold text-slate-400">मुख्य बुँदाहरू:</div>
                        {q.bulletPoints?.map((bp, bpIdx) => (
                          <div key={bpIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{bp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MATCHING TAB */}
            {activeExamTab === 'matching' && examPaper.matchingSection && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">CTEVT / NSTB जोडा मिलाउने परीक्षा (Matching Tests - ४ समूह)</h4>
                    <p className="text-slate-400 mt-0.5">स्तम्भ 'क' मा दिइएका प्रश्न वा सामानलाई स्तम्भ 'ख' का सही उत्तरसँग जोडा मिलाउनुहोस्।</p>
                  </div>
                  <button
                    onClick={() => setShowMatchingAnswers(!showMatchingAnswers)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shrink-0"
                  >
                    {showMatchingAnswers ? 'उत्तर कुंजी लुकाउनुहोस्' : 'सही उत्तर कुंजी हेर्नुहोस्'}
                  </button>
                </div>

                <div className="space-y-6">
                  {examPaper.matchingSection.map((group, gIdx) => (
                    <div key={gIdx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h5 className="font-bold text-emerald-400 text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                          {gIdx + 1}
                        </span>
                        <span>{group.groupTitle}</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Column A */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>स्तम्भ (क) - प्रश्न / उपकरण</span>
                            {showMatchingAnswers && <span className="text-emerald-400">सही जोडी (Ans)</span>}
                          </div>
                          {group.columnA.map((item) => {
                            const matchedResp = group.columnB.find((b) => b.code === item.correctAns);
                            return (
                              <div key={item.qNo} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-slate-950/80 border border-slate-800">
                                <span className="text-white font-medium">
                                  {item.qNo}. {item.premise}
                                </span>
                                {showMatchingAnswers && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0 text-[11px]">
                                    ➔ {item.correctAns} ({matchedResp?.response})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Column B */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                            स्तम्भ (ख) - उत्तर / प्राविधिक कार्य
                          </div>
                          {group.columnB.map((resp) => (
                            <div key={resp.code} className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-start gap-2">
                              <span className="font-bold text-indigo-400 shrink-0">{resp.code}.</span>
                              <span>{resp.response}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPOTTING TAB */}
            {activeExamTab === 'spotting' && examPaper.spottingSection && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">प्रयोगात्मक सामान पहिचान (Spotting Items - १६ वटा उपकरणहरू)</h4>
                    <p className="text-slate-400 mt-0.5">प्रत्येक सामानलाई चिन्न र त्यसको मुख्य काम/प्रयोग लेख्न २ मिनेट समय दिइन्छ।</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="सामान वा प्रयोग खोज्नुहोस्..."
                      value={spottingSearch}
                      onChange={(e) => setSpottingSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examPaper.spottingSection
                    .filter(s => s.item.toLowerCase().includes(spottingSearch.toLowerCase()) || s.usedFor.toLowerCase().includes(spottingSearch.toLowerCase()))
                    .map((s) => (
                      <div key={s.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-indigo-500/50 transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Spotting #{s.id}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              {s.time}
                            </span>
                          </div>

                          <h5 className="font-extrabold text-white text-sm flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{s.item}</span>
                          </h5>
                        </div>

                        {(s as any).imageUrl && (
                          <div
                            onClick={() => setPreviewImage({ url: (s as any).imageUrl!, title: s.item })}
                            className="cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-36 group/l2sp"
                          >
                            <img
                              src={(s as any).imageUrl}
                              alt={s.item}
                              referrerPolicy="no-referrer"
                              className="max-h-32 object-contain rounded group-hover/l2sp:scale-102 transition-transform"
                            />
                          </div>
                        )}

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
                          <div className="font-bold text-emerald-300 text-[11px]">मुख्य काम र प्रयोग:</div>
                          <p className="leading-relaxed">{s.usedFor}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PRACTICAL ASSIGNMENTS TAB */}
            {activeExamTab === 'practical' && examPaper.practicalAssignments && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <h4 className="font-bold text-white text-sm">प्रयोगात्मक परीक्षा कार्यहरू (Practical Examination Tasks)</h4>
                  <p>परीक्षा हल तथा वर्कशपमा दिइने वास्तविक प्रयोगात्मक कार्यहरू। सुरक्षा मापदण्ड (PPE) अपनाएर सम्पन्न गर्नुहोस्।</p>
                </div>

                <div className="space-y-6">
                  {examPaper.practicalAssignments.map((task) => (
                    <div key={task.qNo} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <h5 className="font-extrabold text-white text-base flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                          <span>{task.taskTitle}</span>
                        </h5>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          समय: {task.durationMinutes} मिनेट
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed">
                        <div className="font-bold text-emerald-400 mb-1">कार्य विवरण (Task Description & Instructions):</div>
                        <p>{task.description}</p>
                      </div>

                      {(task as any).imageUrl && (
                        <div
                          onClick={() => setPreviewImage({ url: (task as any).imageUrl!, title: task.taskTitle })}
                          className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-56 group/l2t"
                        >
                          <img
                            src={(task as any).imageUrl}
                            alt={task.taskTitle}
                            referrerPolicy="no-referrer"
                            className="max-h-52 object-contain rounded-lg group-hover/l2t:scale-102 transition-transform"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="font-bold text-indigo-300">आवश्यक औजार तथा सामग्री:</div>
                          <div className="text-slate-400">Stripper, Cleaver, Splicer, OJC, Punch Tool, Megger</div>
                        </div>

                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="font-bold text-purple-300">सुरक्षा मापदण्ड (Safety):</div>
                          <div className="text-slate-400">PPE प्रयोग, सुरक्षित कटिङ, चिस्यानमुक्त लेआउट</div>
                        </div>

                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="font-bold text-emerald-300">मूल्याङ्कन आधार (Rubric):</div>
                          <div className="text-slate-400">फाइबर लस &lt; 0.05dB, सफा क्रिम्पिङ र निरन्तरता</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 6: 100 VIVA VOCE AUDIO QUESTION BANK */}
      {activeSection === 'viva' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                १०० मौखिक परीक्षा (VIVA Voce) प्रश्नोत्तर बैंक
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                सीटीईभीटी तथा नेपाल टेलिकम इन्टरभ्युका लागि उच्च-सम्भावित प्रश्नहरू (नेपाली अडियो स्पिकर सहित)
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="प्रश्न वा उत्तर खोज्नुहोस्..."
                value={vivaSearch}
                onChange={(e) => setVivaSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'ALL', label: 'सबै (१००)' },
              { key: 'telecom', label: 'टेलिकम/एक्सचेन्ज' },
              { key: 'fiber', label: 'अप्टिकल फाइबर' },
              { key: 'copper', label: 'कपर/केबल' },
              { key: 'tools', label: 'परीक्षण उपकरण' },
              { key: 'electrical', label: 'विद्युतीय/इलेक्ट्रोनिक्स' },
              { key: 'wireless', label: 'वायरलेस/GSM' },
              { key: 'osp', label: 'बाहिरी प्लान्ट/पोल' },
              { key: 'safety', label: 'सुरक्षा/अर्थिङ' }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedVivaCat(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedVivaCat === cat.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredVivaQuestions.map((v) => (
              <div
                key={v.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-purple-300">
                      प्रश्न नं. {v.id}
                    </span>
                    <button
                      onClick={() => speakText(`${v.q}. उत्तर: ${v.a}`, v.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        speakingVivaId === v.id
                          ? 'bg-purple-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="सुन्नुहोस्"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {v.q}
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                    <span className="font-bold text-emerald-400">उत्तर: </span>
                    {v.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: TELECOM CALCULATORS & MATH SIMULATORS */}
      {activeSection === 'calculators' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setCalcType('ohms')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'ohms' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ओहम्स ल (V = IR & P = VI)
              </button>
              <button
                onClick={() => setCalcType('loop')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'loop' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                केबल लुप रेजिस्टेन्स (Loop Resistance)
              </button>
              <button
                onClick={() => setCalcType('snr')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'snr' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                सिग्नल टु नोइज (SNR in dB)
              </button>
              <button
                onClick={() => setCalcType('battery')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'battery' ? 'bg-yellow-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ब्याट्री बैंक भोल्टेज (48V DC Sizing)
              </button>
            </div>

            {/* OHMS LAW CALCULATOR */}
            {calcType === 'ohms' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-yellow-400">Ohm's Law Input Parameters</h4>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">भोल्टेज Voltage (V in Volts):</label>
                    <input
                      type="number"
                      value={ohmVoltage}
                      onChange={(e) => setOhmVoltage(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">प्रतिरोध Resistance (R in Ohms):</label>
                    <input
                      type="number"
                      value={ohmResistance}
                      onChange={(e) => setOhmResistance(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-center">
                  <div className="text-xs text-slate-400 font-bold">गणना नतिजा (Calculated Result)</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Current (I = V/R)</div>
                      <div className="text-xl font-mono font-bold text-emerald-400">
                        {ohmResistance > 0 ? (ohmVoltage / ohmResistance).toFixed(2) : 0} A
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Power (P = V * I)</div>
                      <div className="text-xl font-mono font-bold text-cyan-400">
                        {ohmResistance > 0 ? (ohmVoltage * (ohmVoltage / ohmResistance)).toFixed(2) : 0} W
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOOP RESISTANCE CALCULATOR */}
            {calcType === 'loop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-yellow-400">कपर केबल व्यास र लम्बाइ चयन</h4>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">कपर केबल व्यास (Wire Diameter):</label>
                    <select
                      value={loopDiameter}
                      onChange={(e) => setLoopDiameter(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    >
                      <option value={0.4}>०.४ mm (मानक: २८० Ω/km)</option>
                      <option value={0.5}>०.५ mm (मानक: १७५ Ω/km)</option>
                      <option value={0.9}>०.९ mm (मानक: ६३.२ Ω/km)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">केबल लम्बाइ (Length in Kilometers):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loopLengthKm}
                      onChange={(e) => setLoopLengthKm(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-center">
                  <div className="text-xs text-slate-400 font-bold">लुप रेजिस्टेन्स गणना (Loop Resistance)</div>
                  <div className="text-3xl font-mono font-bold text-yellow-400">
                    {(
                      (loopDiameter === 0.4 ? 280 : loopDiameter === 0.5 ? 175 : 63.2) *
                      loopLengthKm
                    ).toFixed(1)}{' '}
                    Ω
                  </div>
                  <div className="text-xs text-slate-300">
                    {(
                      (loopDiameter === 0.4 ? 280 : loopDiameter === 0.5 ? 175 : 63.2) *
                      loopLengthKm
                    ) <= 2000 ? (
                      <span className="text-emerald-400 font-bold">✓ NTC मानक (२००० Ω) भित्र पर्छ (स्वीकार्य)</span>
                    ) : (
                      <span className="text-rose-400 font-bold">⚠️ २००० Ω भन्दा बढी भयो (लाइन ड्रप हुने जोखिम)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SNR CALCULATOR */}
            {calcType === 'snr' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-yellow-400">Signal & Noise Power</h4>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">सिग्नल पावर Signal Power (mW):</label>
                    <input
                      type="number"
                      value={snrSignal}
                      onChange={(e) => setSnrSignal(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">नोइज पावर Noise Power (mW):</label>
                    <input
                      type="number"
                      value={snrNoise}
                      onChange={(e) => setSnrNoise(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3 text-center">
                  <div className="text-xs text-slate-400 font-bold">SNR in Decibels (10 * log10(S/N))</div>
                  <div className="text-3xl font-mono font-bold text-cyan-400">
                    {snrNoise > 0 ? (10 * Math.log10(snrSignal / snrNoise)).toFixed(2) : 0} dB
                  </div>
                  <div className="text-xs text-slate-300">
                    {snrNoise > 0 && 10 * Math.log10(snrSignal / snrNoise) >= 30 ? (
                      <span className="text-emerald-400 font-bold">उत्कृष्ट (Excellent Quality)</span>
                    ) : snrNoise > 0 && 10 * Math.log10(snrSignal / snrNoise) >= 10 ? (
                      <span className="text-amber-400 font-bold">सामान्य (Acceptable)</span>
                    ) : (
                      <span className="text-rose-400 font-bold">अति कमजोर (Poor Signal)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* BATTERY SIZING */}
            {calcType === 'battery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-yellow-400">पावर रुम ब्याट्री बैंक गणना</h4>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">सेल संख्या (Number of 2V Cells):</label>
                    <input
                      type="number"
                      value={batteryCells}
                      onChange={(e) => setBatteryCells(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">सेल क्षमता (Cell Capacity Ah):</label>
                    <input
                      type="number"
                      value={batteryCellAh}
                      onChange={(e) => setBatteryCellAh(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3 text-center">
                  <div className="text-xs text-slate-400 font-bold">कुल बैंक भोल्टेज र ऊर्जा क्षमता</div>
                  <div className="text-3xl font-mono font-bold text-emerald-400">
                    {(batteryCells * batteryCellVoltage).toFixed(1)} V DC
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Total Energy: {((batteryCells * batteryCellVoltage * batteryCellAh) / 1000).toFixed(2)} kWh
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold">
                    ✓ मानक २४ सेल = ४८V DC टेलिकम पावर बैंक
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-400" />
                <span>{previewImage.title}</span>
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black/80 rounded-2xl p-2 border border-slate-800 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow"
              >
                बन्द गर्नुहोस् (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
