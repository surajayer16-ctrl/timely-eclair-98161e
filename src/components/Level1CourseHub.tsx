import React, { useState, useEffect } from 'react';
import {
  Radio,
  BookOpen,
  Wrench,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  ChevronRight,
  Layers,
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
  Share2,
  Download,
  ListOrdered,
  Maximize2,
  X,
  Image,
  Compass
} from 'lucide-react';
import {
  level1CourseInfo,
  level1ManualChapters,
  telecomKnotsData,
  level1PracticalSets,
  level1VivaQuestions,
  Level1Chapter
} from '../data/level1CourseData';
import { PracticalTask, VivaQuestion, TelecomKnot } from '../types';
import { TelecomNetworkSchematic } from './TelecomNetworkSchematic';
import { Level1FieldSurveyMap } from './Level1FieldSurveyMap';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import {
  nepalTelecom12CoreOFC,
  copper10PairColorCode,
  groupBinder300Pair,
  groupBinder600Pair,
  underground1800PairGroupBinders,
  cableSheathStrippingLengths,
  copperSpliceRulesNotice,
  binderRibbonColorCode
} from '../data/colorCodesData';

interface Level1CourseHubProps {
  onOpenEnrollment: () => void;
  onOpenAiTutor: () => void;
}

export const Level1CourseHub: React.FC<Level1CourseHubProps> = ({
  onOpenEnrollment,
  onOpenAiTutor,
}) => {
  // Tabs within Level 1 Hub
  const [activeSection, setActiveSection] = useState<
    'overview' | 'network-diagram' | 'field-survey' | 'manual' | 'practicals' | 'viva' | 'knots' | 'color-codes' | 'epabx'
  >('overview');

  const [level1Chapters, setLevel1Chapters] = useState<Level1Chapter[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_notes_v3');
      return saved ? JSON.parse(saved) : level1ManualChapters;
    } catch {
      return level1ManualChapters;
    }
  });

  const [level1CourseInfoState, setLevel1CourseInfoState] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_course_info');
      return saved ? JSON.parse(saved) : level1CourseInfo;
    } catch {
      return level1CourseInfo;
    }
  });

  const [level1PracticalSetsState, setLevel1PracticalSetsState] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_practicals_v3');
      return saved ? JSON.parse(saved) : level1PracticalSets;
    } catch {
      return level1PracticalSets;
    }
  });

  const [level1VivaQuestionsState, setLevel1VivaQuestionsState] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_viva_v3');
      return saved ? JSON.parse(saved) : level1VivaQuestions;
    } catch {
      return level1VivaQuestions;
    }
  });

  const [telecomKnotsState, setTelecomKnotsState] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_knots');
      return saved ? JSON.parse(saved) : telecomKnotsData;
    } catch {
      return telecomKnotsData;
    }
  });

  useEffect(() => {
    const handleLevel1Updated = () => {
      try {
        const saved = localStorage.getItem('nitvt_level1_notes');
        if (saved) {
          setLevel1Chapters(JSON.parse(saved));
        } else {
          setLevel1Chapters(level1ManualChapters);
        }
      } catch (err) {
        console.error('Failed to parse updated level1 notes:', err);
      }
    };

    const handleAllUpdated = () => {
      try {
        const infoSaved = localStorage.getItem('nitvt_level1_course_info');
        if (infoSaved) setLevel1CourseInfoState(JSON.parse(infoSaved));

        const pracSaved = localStorage.getItem('nitvt_level1_practicals');
        if (pracSaved) setLevel1PracticalSetsState(JSON.parse(pracSaved));

        const vivaSaved = localStorage.getItem('nitvt_level1_viva');
        if (vivaSaved) setLevel1VivaQuestionsState(JSON.parse(vivaSaved));

        const knotsSaved = localStorage.getItem('nitvt_level1_knots');
        if (knotsSaved) setTelecomKnotsState(JSON.parse(knotsSaved));
      } catch (err) {
        console.error('Failed to parse updated level1 data:', err);
      }
    };

    window.addEventListener('nitvt_level1_notes_updated', handleLevel1Updated);
    window.addEventListener('nitvt_level1_course_info_updated', handleAllUpdated);
    window.addEventListener('nitvt_level1_practicals_updated', handleAllUpdated);
    window.addEventListener('nitvt_level1_viva_updated', handleAllUpdated);
    window.addEventListener('nitvt_level1_knots_updated', handleAllUpdated);
    window.addEventListener('storage', handleLevel1Updated);
    window.addEventListener('storage', handleAllUpdated);
    return () => {
      window.removeEventListener('nitvt_level1_notes_updated', handleLevel1Updated);
      window.removeEventListener('nitvt_level1_course_info_updated', handleAllUpdated);
      window.removeEventListener('nitvt_level1_practicals_updated', handleAllUpdated);
      window.removeEventListener('nitvt_level1_viva_updated', handleAllUpdated);
      window.removeEventListener('nitvt_level1_knots_updated', handleAllUpdated);
      window.removeEventListener('storage', handleLevel1Updated);
    };
  }, []);

  // Manual Chapter Selection
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    level1Chapters[0]?.id || level1ManualChapters[0].id
  );
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Practical Set Selection
  const [selectedPracticalSetId, setSelectedPracticalSetId] = useState<string>(
    level1PracticalSetsState[0]?.id || level1PracticalSets[0].id
  );
  const [selectedTask, setSelectedTask] = useState<PracticalTask | null>(
    level1PracticalSetsState[0]?.tasks[0] || level1PracticalSets[0].tasks[0]
  );
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  // VIVA Search & Filter
  const [vivaSearch, setVivaSearch] = useState<string>('');
  const [selectedVivaSet, setSelectedVivaSet] = useState<string>('ALL');
  const [speakingVivaId, setSpeakingVivaId] = useState<number | null>(null);

  // Knot Selection
  const [selectedKnotId, setSelectedKnotId] = useState<string>(
    telecomKnotsState[0]?.id || telecomKnotsData[0].id
  );

  // Active Chapter Object
  const currentChapter =
    level1Chapters.find((c) => c.id === selectedChapterId) ||
    level1Chapters[0];

  // Active Practical Set Object
  const currentPracticalSet =
    level1PracticalSetsState.find((s: any) => s.id === selectedPracticalSetId) ||
    level1PracticalSetsState[0];

  // Active Knot Object
  const currentKnot =
    telecomKnotsState.find((k: any) => k.id === selectedKnotId) ||
    telecomKnotsState[0];

  // Filtered VIVA questions
  const filteredVivaQuestions = level1VivaQuestionsState.filter((q: any) => {
    const matchesSet =
      selectedVivaSet === 'ALL' || q.setNumber === selectedVivaSet;
    const matchesSearch =
      q.questionNepali.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      q.answerNepali.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      q.englishKey.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(vivaSearch.toLowerCase());
    return matchesSet && matchesSearch;
  });

  // Toggle Task Completion
  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Text-to-Speech for Nepali VIVA
  const handleSpeakNepali = (q: VivaQuestion) => {
    const textToRead = `प्रश्न: ${q.questionNepali}। उत्तर: ${q.answerNepali}`;
    setSpeakingVivaId(q.id);
    speakNepaliText(textToRead, `मौखिक प्रश्न: ${q.questionNepali}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Award className="w-3.5 h-3.5" /> CTEVT & NSTB Level-1
            </span>
            <span className="bg-indigo-900/80 border border-indigo-700 text-indigo-200 text-xs px-3 py-1 rounded-full">
              {level1CourseInfoState.code}
            </span>
            <span className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {level1CourseInfoState.duration}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {level1CourseInfoState.titleNepali}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
              {level1CourseInfoState.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
              <p className="text-xs text-slate-400">प्रयोगात्मक अनुपात</p>
              <p className="text-lg font-bold text-amber-400">{level1CourseInfoState.practicalRatio}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
              <p className="text-xs text-slate-400">योग्यता मापदण्ड</p>
              <p className="text-sm font-semibold text-white line-clamp-1">{level1CourseInfoState.entryRequirement}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
              <p className="text-xs text-slate-400">मान्यता तथा प्रमाणपत्र</p>
              <p className="text-sm font-semibold text-emerald-400">CTEVT / NSTB Approved</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between">
              <button
                onClick={onOpenEnrollment}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-all shadow-md active:scale-95"
              >
                भर्ना फारम भर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Level-1 Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>पाठ्यक्रम परिचय (Syllabus)</span>
        </button>

        <button
          onClick={() => setActiveSection('network-diagram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'network-diagram'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>नेटवर्क रेखाचित्र (OSP Diagram)</span>
        </button>

        <button
          onClick={() => setActiveSection('field-survey')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'field-survey'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>फिल्ड सर्भे नक्सा (Field Survey Map)</span>
        </button>

        <button
          onClick={() => setActiveSection('manual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'manual'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>प्राविधिक म्यानुअल (९ च्याप्टर)</span>
        </button>

        <button
          onClick={() => setActiveSection('practicals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'practicals'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4 text-orange-400" />
          <span>प्रयोगात्मक परीक्षा (Practical Sets १-३)</span>
        </button>

        <button
          onClick={() => setActiveSection('viva')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'viva'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>मौखिक प्रश्नोत्तर (VIVA Voce ७०+)</span>
        </button>

        <button
          onClick={() => setActiveSection('knots')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'knots'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-400" />
          <span>टेलिकम गाँठो (५ Knots)</span>
        </button>

        <button
          onClick={() => setActiveSection('color-codes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'color-codes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>कलर कोडिङ (Color Codes)</span>
        </button>

        <button
          onClick={() => setActiveSection('epabx')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSection === 'epabx'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4 text-teal-400" />
          <span>EPABX प्रोग्रामिङ</span>
        </button>
      </div>

      {/* SECTION 1: OVERVIEW & MODULES */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  तह–१ विस्तृत पाठ्यक्रम मोड्युलहरू (390 Hours CTEVT Syllabus)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  ९ वटा मुख्य विषयगत मोड्युलहरू, प्रयोगात्मक कार्यघण्टा र कार्यशाला अभ्यास विवरण
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAiTutor}
                  className="inline-flex items-center gap-1.5 bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:bg-indigo-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  AI गुरुसँग सोध्नुहोस्
                </button>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(level1CourseInfoState.modules || []).map((m: any) => (
                <div
                  key={m.no}
                  className="bg-slate-950/80 border border-slate-800 hover:border-indigo-700/60 rounded-xl p-4 transition-all hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-900/80 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        मोड्युल {m.no}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {m.hours} घण्टा
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {m.titleNepali}
                    </h3>
                    <ul className="space-y-1 pt-1">
                      {m.topics.map((t, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERACTIVE NETWORK DIAGRAM */}
      {activeSection === 'network-diagram' && (
        <TelecomNetworkSchematic />
      )}

      {/* SECTION 2.5: FIELD SURVEY MAP (GWARKO / UDAYA BASTI / NITVT) */}
      {activeSection === 'field-survey' && (
        <Level1FieldSurveyMap onOpenAiTutor={onOpenAiTutor} />
      )}

      {/* SECTION 3: TECHNICAL MANUAL (9 CHAPTERS) */}
      {activeSection === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chapter Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              म्यानुअल च्याप्टरहरू (९ वटा)
            </h3>
            <div className="space-y-1">
              {level1Chapters.map((ch) => {
                const isSelected = ch.id === selectedChapterId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={isSelected ? 'text-blue-100 font-bold' : 'text-amber-400 font-bold'}>
                        पाठ {ch.chapterNumber}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-2">{ch.titleNepali}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Content View */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-amber-400 font-bold">
                  पाठ {currentChapter.chapterNumber} • {currentChapter.titleEnglish}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{currentChapter.titleNepali}</h2>
                <p className="text-xs sm:text-sm text-slate-300">{currentChapter.subtitle}</p>
              </div>

              <button
                onClick={() => {
                  const fullText = `पाठ ${currentChapter.chapterNumber}। ${currentChapter.titleNepali}। सारांश: ${currentChapter.summaryNepali}। विस्तृत पाठ विवरण: ` +
                    currentChapter.sections.map(s => `${s.heading}। ${s.contentNepali} ${s.bulletPoints && s.bulletPoints.length > 0 ? '। बुँदाहरू: ' + s.bulletPoints.join('। ') : ''}`).join('। ');
                  speakNepaliText(fullText, `पाठ ${currentChapter.chapterNumber}: ${currentChapter.titleNepali}`);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95"
                title="सम्पूर्ण पाठ नेपाली आवाजमा सुन्नुहोस्"
              >
                <Volume2 className="w-4 h-4 text-slate-950" />
                <span>नेपाली आवाजमा सुन्नुहोस् (Listen Chapter)</span>
              </button>
            </div>

            {/* Summary Box */}
            <div className="bg-indigo-950/40 border border-indigo-800/40 p-4 rounded-xl text-xs sm:text-sm text-indigo-200 leading-relaxed">
              <span className="font-bold text-amber-300">सारांश: </span>
              {currentChapter.summaryNepali}
            </div>

            {/* Chapter Technical Photo / Illustration (If Available) */}
            {currentChapter.imageUrl && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-amber-400" />
                    <span>प्राविधिक तस्बिर / रेखाचित्र (Technical Illustration Photo)</span>
                  </span>
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: currentChapter.imageUrl!,
                        title: currentChapter.titleNepali,
                      })
                    }
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg transition-colors"
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
                    <span className="bg-amber-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                      <span>पूर्ण स्क्रिनमा हेर्नुहोस्</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-6">
              {currentChapter.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
                  <h3 className="text-base font-bold text-amber-300">{sec.heading}</h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{sec.contentNepali}</p>

                  {/* Bullet points if any */}
                  {sec.bulletPoints && (
                    <ul className="space-y-1.5 pt-2">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Table if any */}
                  {sec.tableData && (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left text-slate-200 border border-slate-800 rounded-lg overflow-hidden">
                        <thead className="bg-slate-800 text-amber-300 uppercase text-[11px] font-bold">
                          <tr>
                            {sec.tableData.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-3 py-2 border-b border-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                          {sec.tableData.rows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/50">
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 font-medium">
                                  {c}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Note box if any */}
                  {sec.noteBox && (
                    <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-lg text-xs text-amber-200 flex items-start gap-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{sec.noteBox}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Exam Points */}
            <div className="bg-slate-950 border border-emerald-900/40 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> परीक्षामा प्रायः सोधिने मुख्य बुँदाहरू (Key Exam Points)
              </h4>
              <ul className="space-y-1">
                {currentChapter.keyExamPoints.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PRACTICAL SKILL TEST SETS (SET 1, 2, 3) */}
      {activeSection === 'practicals' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-950/70 border border-orange-800/60 px-3 py-0.5 rounded-full mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>CTEVT / NSTB Level-1 Official Practical Sets</span>
                </div>
                <h2 className="text-xl font-bold text-white">प्रयोगात्मक परीक्षा अभ्यास सिमुलेटर (Practical Skill Test)</h2>
              </div>
              
              {/* Set Switcher */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {level1PracticalSets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedPracticalSetId(s.id);
                      setSelectedTask(s.tasks[0]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedPracticalSetId === s.id
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.setNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Browser */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  {currentPracticalSet.titleNepali} (कार्यहरू)
                </h3>
                <div className="space-y-1.5">
                  {currentPracticalSet.tasks.map((t) => {
                    const isSelected = selectedTask?.id === t.id;
                    const isCompleted = completedTaskIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-400 shadow-md'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-white text-orange-600' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {t.taskNumber}
                          </span>
                          <span className="text-xs font-semibold line-clamp-1">{t.titleNepali}</span>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Task Detail & Step-by-Step Procedure */}
              {selectedTask && (
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs text-orange-400 font-bold">
                        कार्य नं. {selectedTask.taskNumber} • {selectedTask.titleEnglish}
                      </span>
                      <h3 className="text-lg font-bold text-white">{selectedTask.titleNepali}</h3>
                    </div>
                    <button
                      onClick={() => toggleTaskCompletion(selectedTask.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        completedTaskIds.includes(selectedTask.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {completedTaskIds.includes(selectedTask.id) ? 'सम्पन्न भयो' : 'सम्पन्न भयो भनी चिन्ह लगाउनुहोस्'}
                    </button>
                  </div>

                  {/* Objective */}
                  <div className="bg-slate-900 p-3.5 rounded-xl text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-300">उद्देश्य (Objective): </span>
                    <span>{selectedTask.objectiveNepali}</span>
                  </div>

                  {/* Required Materials */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      आवश्यक सामग्रीहरू (Materials Needed)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTask.materialsNeeded.map((mat, mIdx) => (
                        <span key={mIdx} className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step by step procedure */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4" /> कार्यविधि (Step-by-Step Procedure)
                    </h4>
                    <div className="space-y-2">
                      {selectedTask.stepsNepali.map((st, sIdx) => (
                        <div key={sIdx} className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-200 leading-relaxed">
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marking Scheme */}
                  <div className="bg-slate-900 border border-indigo-900/40 p-3.5 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> प्रयोगात्मक अंकभार (Marking Scheme)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTask.markingCriteria.map((c, cIdx) => (
                        <div key={cIdx} className="bg-slate-950 p-2 rounded-lg text-xs flex items-center justify-between border border-slate-800">
                          <span className="text-slate-300">{c.criterion}</span>
                          <span className="font-bold text-amber-400">{c.marks} अंक</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: OFFICIAL VIVA VOCE (SET 1, 2, 3, 4) */}
      {activeSection === 'viva' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950/70 border border-purple-800/60 px-3 py-0.5 rounded-full mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Official CTEVT / NSTB Oral Exam Questions</span>
                </div>
                <h2 className="text-xl font-bold text-white">मौखिक परीक्षा प्रश्नोत्तर (VIVA Voce Bank - ७०+ Questions)</h2>
              </div>

              {/* Set filter buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', 'SET 1', 'SET 2', 'SET 3', 'SET 4'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedVivaSet(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedVivaSet === s
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="प्रश्न, उत्तर वा मुख्य शब्द खोज्नुहोस् (जस्तै: MDF, Earthing, Stay, 110cm, Voltage)..."
                value={vivaSearch}
                onChange={(e) => setVivaSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Viva Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVivaQuestions.map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-950 border border-slate-800/90 hover:border-purple-700/60 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-purple-950 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-800/60">
                        {q.setNumber}
                      </span>
                      <span className="text-slate-400">{q.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-amber-300 leading-snug">
                      {q.questionNepali}
                    </h3>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs text-slate-200 leading-relaxed">
                      <span className="font-semibold text-emerald-400">उत्तर: </span>
                      {q.answerNepali}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <span className="text-slate-400 italic text-[11px]">{q.englishKey}</span>
                    <button
                      onClick={() => handleSpeakNepali(q)}
                      className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                        speakingVivaId === q.id
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Listen in Nepali"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">सुन्नुहोस्</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: TELECOM KNOTS (५ प्रमुख गाँठोहरू) */}
      {activeSection === 'knots' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/70 border border-rose-800/60 px-3 py-0.5 rounded-full mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>सुरक्षित धागो तथा डोरी प्रविधि (Rigging & Knots)</span>
              </div>
              <h2 className="text-xl font-bold text-white">टेलिकम क्षेत्रमा प्रयोग हुने ५ मुख्य गाँठोहरू (Telecom Knots)</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                डोरी जोड्ने, भर्‍याङ बाँध्ने, पोल उठाउने र सामान माथि-तल गर्ने आधिकारिक प्राविधिक गाँठोहरू
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Knots Selector */}
              <div className="space-y-2">
                {telecomKnotsState.map((knot) => {
                  const isSelected = knot.id === selectedKnotId;
                  return (
                    <button
                      key={knot.id}
                      onClick={() => setSelectedKnotId(knot.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <h4 className="text-sm font-bold">{knot.nameNepali}</h4>
                      <p className="text-xs opacity-80 mt-1 line-clamp-1">{knot.purposeNepali}</p>
                    </button>
                  );
                })}
              </div>

              {/* Knot Details Card */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="border-b border-slate-800 pb-3 space-y-1">
                  <span className="text-xs text-rose-400 font-bold">{currentKnot.nameEnglish}</span>
                  <h3 className="text-xl font-bold text-white">{currentKnot.nameNepali}</h3>
                </div>

                {/* Knot Photo if available */}
                {currentKnot.imageUrl && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Image className="w-4 h-4 text-amber-400" />
                        <span>गाँठोको तस्बिर / रेखाचित्र (Knot Illustration)</span>
                      </span>
                      <button
                        onClick={() =>
                          setPreviewImage({
                            url: currentKnot.imageUrl!,
                            title: currentKnot.nameNepali,
                          })
                        }
                        className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-lg transition-colors"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Zoom</span>
                      </button>
                    </div>
                    <div
                      className="cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-black/60 max-h-64 flex items-center justify-center"
                      onClick={() =>
                        setPreviewImage({
                          url: currentKnot.imageUrl!,
                          title: currentKnot.nameNepali,
                        })
                      }
                    >
                      <img
                        src={currentKnot.imageUrl}
                        alt={currentKnot.nameNepali}
                        className="w-full max-h-64 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">उद्देश्य र प्रयोग</h4>
                  <p className="text-xs sm:text-sm text-slate-200">{currentKnot.purposeNepali}</p>
                  <p className="text-xs text-slate-400 italic">प्रयोग हुने ठाउँ: {currentKnot.usageContext}</p>
                </div>

                {/* Step Guide */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">गाँठो पार्ने तरिका (Step Guide)</h4>
                  <div className="space-y-2">
                    {currentKnot.stepGuide.map((step, sIdx) => (
                      <div key={sIdx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs text-slate-200">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caution */}
                <div className="bg-amber-950/40 border border-amber-800/40 p-3.5 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">सावधानी: </span>
                    <span>{currentKnot.caution}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: COLOR CODES (फाइबर NTC vs International, १० पेयर कपर, बाइन्डर, ३००/६००/१८०० पेयर, शिथ नाप) */}
      {activeSection === 'color-codes' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-3 py-0.5 rounded-full mb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>NTC vs International Fiber Standards & Copper Cable Codes</span>
                </div>
                <h2 className="text-xl font-bold text-white">फाइबर तथा कपर केबल सम्पूर्ण कलर कोड तालिका (Nepal Telecom vs International Standard)</h2>
              </div>
            </div>

            {/* Fiber Color Code Table (Nepal Telecom Standard vs International Standard) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  १. अप्टिकल फाइबर १२-कोर रङ तालिका (Nepal Telecom vs International Standard Fiber Color Code)
                </h3>
                <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  NTC Standard vs TIA/EIA-598
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-800 text-white uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-3 py-2.5 text-amber-300 w-24">फाइबर नं. (Fiber No.)</th>
                      <th className="px-3 py-2.5 bg-blue-950/80 border-l border-r border-slate-700 text-blue-300" colSpan={2}>
                        Nepal Telecom Standard Fiber Color
                      </th>
                      <th className="px-3 py-2.5 bg-indigo-950/80 text-indigo-300" colSpan={2}>
                        International Standard Fiber Color
                      </th>
                    </tr>
                    <tr className="bg-slate-850 text-slate-300 text-[10px]">
                      <th className="px-3 py-1.5">No.</th>
                      <th className="px-3 py-1.5 bg-blue-950/40 border-l border-slate-700">रङ (Nepali)</th>
                      <th className="px-3 py-1.5 bg-blue-950/40 border-r border-slate-700">Color (English)</th>
                      <th className="px-3 py-1.5 bg-indigo-950/40">रङ (Nepali)</th>
                      <th className="px-3 py-1.5 bg-indigo-950/40">Color (English)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                    {nepalTelecom12CoreOFC.map((row) => (
                      <tr key={row.number} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-amber-400 text-center">{row.number}</td>
                        {/* NTC */}
                        <td className="px-3 py-2.5 border-l border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm shrink-0" style={{ backgroundColor: row.hexColor }}></span>
                            <span className="font-semibold text-white">{row.nepaliName}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-bold border-r border-slate-800 text-blue-300">{row.englishName}</td>
                        {/* International */}
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm shrink-0" style={{ backgroundColor: row.internationalHex }}></span>
                            <span className="font-semibold text-white">{row.internationalNepali}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-bold text-indigo-300">{row.internationalColor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cross Talk Warning Notice */}
            <div className="bg-amber-950/60 border border-amber-700/80 p-4 rounded-xl text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5">महत्वपूर्ण प्राविधिक नियम (Cross Talk Warning):</strong>
                <p>{copperSpliceRulesNotice}</p>
              </div>
            </div>

            {/* 10 Pair Copper Cable Table */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                २. कपर केबल १०-पेयर स्प्लाइस कलर कोड (10-Pair Cable Splice Color Code)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-200 border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-800 text-amber-300 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-3 py-2.5">क्र.सं. (S.N.)</th>
                      <th className="px-3 py-2.5">केबल पेयर रङ (Cable Pair Color)</th>
                      <th className="px-3 py-2.5">पेयर नम्बर (Pair Number)</th>
                      <th className="px-3 py-2.5">रङ भिजुअल (Visual)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                    {copper10PairColorCode.map((row) => (
                      <tr key={row.pairNo} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-3 py-2 font-bold text-amber-400">{row.pairNo}</td>
                        <td className="px-3 py-2 font-semibold text-white">{row.colorEnglish} ({row.colorNepali})</td>
                        <td className="px-3 py-2 font-bold text-cyan-300">पेयर नं. {row.pairNo}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: row.primaryHex }}></span>
                            <span className="text-slate-500 font-bold text-xs">+</span>
                            <span className="w-4 h-4 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: row.secondaryHex }}></span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 50/100 Pair Cable Unit Binder */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                २. ५० पेयर र १०० पेयर केबल युनिट बाइन्डर (Unit Binder Color Code)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                {binderRibbonColorCode.map((b, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs hover:border-emerald-500/50 transition-colors">
                    <span className="font-bold text-amber-400 text-[11px]">बाइन्डर {idx + 1}</span>
                    <p className="text-white font-bold text-xs mt-0.5">{b.colorNepali}</p>
                    <p className="text-emerald-400 text-[11px] font-medium mt-1">{b.pairRange}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 300 & 600 Pair Group Binders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* 300 Pair */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  ३. ३०० पेयर केबल ग्रुप बाइन्डर (300-Pair Group Binders)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-200 border border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-800 text-cyan-300 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="px-3 py-2">ग्रुप नं.</th>
                        <th className="px-3 py-2">ग्रुप रङ</th>
                        <th className="px-3 py-2">पेयर रेन्ज</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      {groupBinder300Pair.map((g) => (
                        <tr key={g.groupNo} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2 font-bold text-cyan-400">{g.groupNo}</td>
                          <td className="px-3 py-2 font-semibold text-white">{g.groupColor}</td>
                          <td className="px-3 py-2 text-slate-300">{g.pairRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 600 Pair */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  ४. ६०० पेयर केबल ग्रुप बाइन्डर (600-Pair Group Binders)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-200 border border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-800 text-purple-300 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="px-3 py-2">ग्रुप नं.</th>
                        <th className="px-3 py-2">ग्रुप रङ</th>
                        <th className="px-3 py-2">पेयर रेन्ज</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      {groupBinder600Pair.map((g) => (
                        <tr key={g.groupNo} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2 font-bold text-purple-400">{g.groupNo}</td>
                          <td className="px-3 py-2 font-semibold text-white">{g.groupColor}</td>
                          <td className="px-3 py-2 text-slate-300">{g.pairRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Underground 1800 Pair Group Binder Complete Table */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                ५. अन्डरग्राउण्ड केबल १८०० पेयर ग्रुप बाइन्डर (Underground Cable Color Code 1-1800 Pairs)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-200 border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-800 text-amber-300 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-3 py-2.5">क्र.सं. (S.N.)</th>
                      <th className="px-3 py-2.5">ग्रुप बाइन्डर (Group Binder)</th>
                      <th className="px-3 py-2.5">युनिट नम्बर (Unit No.)</th>
                      <th className="px-3 py-2.5">पेयर नम्बर (Pair No.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                    {underground1800PairGroupBinders.map((row) => (
                      <tr key={row.sn} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 font-bold text-amber-400">{row.sn}</td>
                        <td className="px-3 py-2 font-bold text-white">{row.groupBinder}</td>
                        <td className="px-3 py-2 text-slate-300">युनिट {row.unitNumber}</td>
                        <td className="px-3 py-2 font-semibold text-emerald-300">{row.pairNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sheath Stripping Length Standards */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-teal-300 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-teal-400" />
                ६. केबल स्प्लाईस गर्दा केबलको शिथ निकाल्ने नाप (Cable Sheath Stripping Length Standards)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {cableSheathStrippingLengths.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">{item.pairRange}</span>
                    <p className="text-lg font-extrabold text-teal-300">{item.strippingLength}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 8: EPABX & NTC SERVICES */}
      {activeSection === 'epabx' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-950/70 border border-teal-800/60 px-3 py-0.5 rounded-full mb-1">
                <Server className="w-3.5 h-3.5" />
                <span>EPABX Intercom Programming & Nepal Telecom Codes</span>
              </div>
              <h2 className="text-xl font-bold text-white">EPABX Hi-Tech Model कमाण्ड प्रोग्रामिङ</h2>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">डिफल्ट पासवर्ड (Default Password):</span>
                <p className="text-lg font-bold text-amber-400">101234</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">हार्ड रिसेट कमाण्ड (Hard Reset):</span>
                <p className="text-sm font-bold text-rose-400">Psw + 6919 6919 6919</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">सुरुवाती नम्बरहरू:</span>
                <p className="text-sm font-bold text-teal-400">Trunk-71 / Ext-20</p>
              </div>
            </div>

            {/* NTC Toll Free Services */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                नेपाल टेलिकमका महत्वपूर्ण सेवा तथा सोधपुछ नम्बरहरू
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xl font-extrabold text-amber-400">१९८</span>
                  <p className="text-xs text-slate-300 mt-1">टेलिफोन मर्मत</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xl font-extrabold text-blue-400">१९७</span>
                  <p className="text-xs text-slate-300 mt-1">टेलिफोन सोधपुछ</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xl font-extrabold text-emerald-400">१८०</span>
                  <p className="text-xs text-slate-300 mt-1">STD ट्रंक बुकिङ</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xl font-extrabold text-purple-400">१८७</span>
                  <p className="text-xs text-slate-300 mt-1">भारत ट्रंक बुकिङ</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xl font-extrabold text-rose-400">१८६</span>
                  <p className="text-xs text-slate-300 mt-1">ISD ट्रंक बुकिङ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
