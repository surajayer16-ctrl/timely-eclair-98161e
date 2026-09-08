import React, { useState, useEffect } from 'react';
import {
  modelExamLevel2MCQs,
  modelSubjectiveQuestions,
  vivaQuestionsList,
  matchingGroupsList,
  spottingItemsList
} from '../data/examData';
import {
  allSubjectiveQuestions,
  subjectiveSetsList
} from '../data/subjectiveSetsData';
import {
  telecomHandbookQAList,
  telecomAbbreviationsList
} from '../data/telecomQAData';
import {
  baishakh2083MCQs,
  baishakh2083MatchingGroups,
  baishakh2083Subjectives,
  baishakh2083SpottingSheets,
  baishakh2083VivaSheets,
  baishakh2083PracticalSheets
} from '../data/baishakh2083Data';
import {
  ExamQuestionMCQ,
  SubjectiveQuestion,
  VivaQuestion,
  MatchingGroup,
  SpottingItem
} from '../types';
import { ImageUploader } from './ImageUploader';
import {
  FileCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  Send,
  Bookmark,
  ExternalLink,
  Layers,
  Wrench,
  ShieldAlert,
  ListFilter,
  Check,
  Undo,
  BookOpen,
  Trophy,
  BrainCircuit,
  MessageSquare,
  AlertTriangle,
  Search,
  BookMarked,
  Image,
  Maximize2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import { InteractiveExamDiagrams } from './InteractiveExamDiagrams';

type SubTab = 'mcq-practice' | 'matching-game' | 'spotting-challenge' | 'subjective-qa' | 'schematics-diagrams' | 'viva-flashcards' | 'mock-exam' | 'telecom-handbook' | 'practical-guide';

export const ExamPreparation: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('mcq-practice');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // ==========================================
  // STATE DEFINITIONS
  // ==========================================

  // 1. MCQ Practice States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMcqIndex, setCurrentMcqIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  // 2. Matching Game States
  const [currentMatchingGroupIndex, setCurrentMatchingGroupIndex] = useState<number>(0);
  const [selectedPremiseId, setSelectedPremiseId] = useState<string | null>(null);
  const [userMatches, setUserMatches] = useState<Record<string, string>>({}); // PremiseId -> ResponseId
  const [checkedMatches, setCheckedMatches] = useState<boolean>(false);
  const [shuffledResponses, setShuffledResponses] = useState<MatchingGroup['responses']>([]);

  // 3. Spotting Challenge States
  const [spottingTab, setSpottingTab] = useState<'study' | 'quiz'>('study');
  const [selectedSpottingId, setSelectedSpottingId] = useState<number>(1);
  const [spottingQuizIndex, setSpottingQuizIndex] = useState<number>(0);
  const [spottingQuizOptions, setSpottingQuizOptions] = useState<string[]>([]);
  const [spottingQuizAnswered, setSpottingQuizAnswered] = useState<boolean>(false);
  const [spottingQuizSelected, setSpottingQuizSelected] = useState<string | null>(null);
  const [spottingScore, setSpottingScore] = useState<number>(0);
  const [spottingTotalAttempted, setSpottingTotalAttempted] = useState<number>(0);

  // 4. Subjective Q&A States
  const [selectedSubjectiveId, setSelectedSubjectiveId] = useState<number>(1);
  const [subjectiveUserAnswers, setSubjectiveUserAnswers] = useState<Record<number, string>>({});
  const [evaluatingAi, setEvaluatingAi] = useState<boolean>(false);
  const [aiEvaluationResults, setAiEvaluationResults] = useState<Record<number, any>>({});
  const [showSubjectiveKey, setShowSubjectiveKey] = useState<boolean>(false);

  // 5. Viva Flashcards States
  const [vivaIndex, setVivaIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [vivaSearch, setVivaSearch] = useState<string>('');

  // 6. Mock Exam States
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [examTimeSeconds, setExamTimeSeconds] = useState<number>(10800); // 3 hours
  const [mockSelectedTab, setMockSelectedTab] = useState<'mcqs' | 'subjective'>('mcqs');
  const [mockAnswers, setMockAnswers] = useState<Record<number, string>>({}); // qId -> 'A' | 'B' | 'C' | 'D'
  const [mockSubjectiveAnswers, setMockSubjectiveAnswers] = useState<Record<number, string>>({}); // qId -> answer text
  const [mockExamSubmitted, setMockExamSubmitted] = useState<boolean>(false);
  const [mockSubjectiveEvaluations, setMockSubjectiveEvaluations] = useState<Record<number, any>>({});
  const [mockEvaluatingAiId, setMockEvaluatingAiId] = useState<number | null>(null);

  // 7. Telecom Handbook & Dictionary States
  const [handbookSearch, setHandbookSearch] = useState<string>('');
  const [selectedHandbookCategory, setSelectedHandbookCategory] = useState<string>('all');
  const [abbrevSearch, setAbbrevSearch] = useState<string>('');
  const [handbookActiveTab, setHandbookActiveTab] = useState<'qa' | 'abbrev'>('qa');

  // Selected Exam Set State
  const [selectedExamSet, setSelectedExamSet] = useState<'2083-baishakh' | 'model-set-a'>('2083-baishakh');

  // Custom Source Selectors for Interactive Tabs (to toggle PDF vs Regular content)
  const [mcqDataSource, setMcqDataSource] = useState<'model' | '2083'>('2083');
  const [matchingDataSource, setMatchingDataSource] = useState<'model' | '2083'>('2083');
  const [subjectiveDataSource, setSubjectiveDataSource] = useState<string>('all');
  const [subjectiveSearchQuery, setSubjectiveSearchQuery] = useState<string>('');
  const [vivaDataSource, setVivaDataSource] = useState<'model' | '2083-sheet1' | '2083-sheet2' | '2083-sheet3'>('2083-sheet1');

  // Practical Guide Subtab State
  const [practicalActiveSheet, setPracticalActiveSheet] = useState<number>(0); // 0, 1, 2
  const [practicalCheckedTasks, setPracticalCheckedTasks] = useState<Record<string, boolean>>({});
  const [expandedPracticalTaskId, setExpandedPracticalTaskId] = useState<number | null>(null);
  const [practicalSimAnswers, setPracticalSimAnswers] = useState<Record<string, number>>({});

  // ==========================================
  // DYNAMIC DATASOURCE MAPPING FOR THE PORTAL
  // ==========================================

  // 1. Model & 2083 MCQs
  const [modelExams, setModelExams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_exams');
      return saved ? JSON.parse(saved) : modelExamLevel2MCQs;
    } catch { return modelExamLevel2MCQs; }
  });

  const [mcq2083Exams, setMcq2083Exams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_exams_2083');
      return saved ? JSON.parse(saved) : baishakh2083MCQs;
    } catch { return baishakh2083MCQs; }
  });

  // 2. Matching Groups
  const [matchingModelExams, setMatchingModelExams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_matching_exams');
      return saved ? JSON.parse(saved) : matchingGroupsList;
    } catch { return matchingGroupsList; }
  });

  const [matching2083Exams, setMatching2083Exams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_matching_2083');
      return saved ? JSON.parse(saved) : baishakh2083MatchingGroups;
    } catch { return baishakh2083MatchingGroups; }
  });

  // 3. Spotting Items
  const [spottingModelExams, setSpottingModelExams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_spotting_exams');
      return saved ? JSON.parse(saved) : spottingItemsList;
    } catch { return spottingItemsList; }
  });

  const [spotting2083Exams, setSpotting2083Exams] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_spotting_2083');
      return saved ? JSON.parse(saved) : baishakh2083SpottingSheets;
    } catch { return baishakh2083SpottingSheets; }
  });

  // 4. Subjective Q&A
  const [subjectiveModelExams, setSubjectiveModelExams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_subjective_exams');
      return saved ? JSON.parse(saved) : modelSubjectiveQuestions;
    } catch { return modelSubjectiveQuestions; }
  });

  const [subjective2083Exams, setSubjective2083Exams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_subjective_2083');
      return saved ? JSON.parse(saved) : baishakh2083Subjectives;
    } catch { return baishakh2083Subjectives; }
  });

  // 5. Viva Flashcards
  const [vivaModelExams, setVivaModelExams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_viva_exams');
      return saved ? JSON.parse(saved) : vivaQuestionsList;
    } catch { return vivaQuestionsList; }
  });

  const [viva2083Exams, setViva2083Exams] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_viva_2083');
      return saved ? JSON.parse(saved) : baishakh2083VivaSheets;
    } catch { return baishakh2083VivaSheets; }
  });

  // 6. Telecom Handbook & Abbreviations
  const [handbookQAState, setHandbookQAState] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_handbook_qa');
      return saved ? JSON.parse(saved) : telecomHandbookQAList;
    } catch { return telecomHandbookQAList; }
  });

  const [abbrevState, setAbbrevState] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_abbreviations');
      return saved ? JSON.parse(saved) : telecomAbbreviationsList;
    } catch { return telecomAbbreviationsList; }
  });

  // 7. Practical Sheets
  const [practicalState, setPracticalState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_practical_sheets');
      return saved ? JSON.parse(saved) : baishakh2083PracticalSheets;
    } catch { return baishakh2083PracticalSheets; }
  });

  useEffect(() => {
    // Fetch spotting items from Firestore on mount
    const fetchSpottingFromFirestore = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        
        const docRef1 = doc(db, 'spottingItems', 'spotting_exams');
        const snap1 = await getDoc(docRef1);
        if (snap1.exists() && snap1.data().items) {
          setSpottingModelExams(snap1.data().items);
        }

        const docRef2 = doc(db, 'spottingItems', 'spotting_2083');
        const snap2 = await getDoc(docRef2);
        if (snap2.exists() && snap2.data().items) {
          setSpotting2083Exams(snap2.data().items);
        }
      } catch (e) {
        console.error('Failed to load spotting from Firestore:', e);
      }
    };
    fetchSpottingFromFirestore();

    const handleExamsUpdated = () => {
      try {
        const s1 = localStorage.getItem('nitvt_exams');
        if (s1) setModelExams(JSON.parse(s1));
        const s2 = localStorage.getItem('nitvt_exams_2083');
        if (s2) setMcq2083Exams(JSON.parse(s2));
        const s3 = localStorage.getItem('nitvt_matching_exams');
        if (s3) setMatchingModelExams(JSON.parse(s3));
        const s4 = localStorage.getItem('nitvt_matching_2083');
        if (s4) setMatching2083Exams(JSON.parse(s4));
        const s5 = localStorage.getItem('nitvt_spotting_exams');
        if (s5) setSpottingModelExams(JSON.parse(s5));
        const s6 = localStorage.getItem('nitvt_spotting_2083');
        if (s6) setSpotting2083Exams(JSON.parse(s6));
        const s7 = localStorage.getItem('nitvt_subjective_exams');
        if (s7) setSubjectiveModelExams(JSON.parse(s7));
        const s8 = localStorage.getItem('nitvt_subjective_2083');
        if (s8) setSubjective2083Exams(JSON.parse(s8));
        const s9 = localStorage.getItem('nitvt_viva_exams');
        if (s9) setVivaModelExams(JSON.parse(s9));
        const s10 = localStorage.getItem('nitvt_viva_2083');
        if (s10) setViva2083Exams(JSON.parse(s10));
        const s11 = localStorage.getItem('nitvt_handbook_qa');
        if (s11) setHandbookQAState(JSON.parse(s11));
        const s12 = localStorage.getItem('nitvt_abbreviations');
        if (s12) setAbbrevState(JSON.parse(s12));
        const s13 = localStorage.getItem('nitvt_practical_sheets');
        if (s13) setPracticalState(JSON.parse(s13));
      } catch (err) {
        console.error('Failed to parse updated exams:', err);
      }
    };

    window.addEventListener('nitvt_exams_updated', handleExamsUpdated);
    window.addEventListener('nitvt_exams_2083_updated', handleExamsUpdated);
    window.addEventListener('nitvt_matching_updated', handleExamsUpdated);
    window.addEventListener('nitvt_spotting_updated', handleExamsUpdated);
    window.addEventListener('nitvt_subjective_updated', handleExamsUpdated);
    window.addEventListener('nitvt_viva_updated', handleExamsUpdated);
    window.addEventListener('nitvt_handbook_updated', handleExamsUpdated);
    window.addEventListener('nitvt_abbrev_updated', handleExamsUpdated);
    window.addEventListener('nitvt_practical_updated', handleExamsUpdated);
    window.addEventListener('storage', handleExamsUpdated);
    return () => {
      window.removeEventListener('nitvt_exams_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_exams_2083_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_matching_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_spotting_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_subjective_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_viva_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_handbook_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_abbrev_updated', handleExamsUpdated);
      window.removeEventListener('nitvt_practical_updated', handleExamsUpdated);
      window.removeEventListener('storage', handleExamsUpdated);
    };
  }, []);

  // MCQ DATA SOURCE
  const activeMcqList = mcqDataSource === '2083' ? mcq2083Exams : modelExams;
  const filteredMcqs = activeMcqList.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });
  const activeMcq = filteredMcqs[currentMcqIndex % Math.max(1, filteredMcqs.length)];

  // MATCHING DATA SOURCE
  const activeMatchingGroups = matchingDataSource === '2083'
    ? (matching2083Exams || []).map((g: any, gIdx: number) => ({
        id: `baishakh-g-${gIdx}`,
        titleNepali: `२०८३ बैशाख ${g.groupName || ''}`,
        items: (g.columnA || []).map((premise: string, i: number) => ({ id: `premise-${gIdx}-${i}`, premise })),
        responses: (g.columnB || []).map((text: string, i: number) => ({ id: `response-${gIdx}-${i}`, letter: String.fromCharCode(65 + i), text })),
        correctMatches: (g.columnA || []).reduce((acc: Record<string, string>, _: any, i: number) => {
          if (g.correctAnswers && g.correctAnswers[i] !== undefined) {
            acc[`premise-${gIdx}-${i}`] = `response-${gIdx}-${g.correctAnswers[i]}`;
          }
          return acc;
        }, {} as Record<string, string>)
      }))
    : matchingModelExams;

  // SPOTTING DATA SOURCE
  const getMappedSpotting = (): SpottingItem[] => {
    const modelMapped = (spottingModelExams || []).map((item: any) => ({
      ...item,
      category: item.category || 'नियमित मोडल औजार',
      imageUrl: item.imageUrl || ''
    }));

    const sheet1List = (spotting2083Exams && spotting2083Exams['sheet1']) ? spotting2083Exams['sheet1'] : [];
    const sheet2List = (spotting2083Exams && spotting2083Exams['sheet2']) ? spotting2083Exams['sheet2'] : [];
    const sheet3List = (spotting2083Exams && spotting2083Exams['sheet3']) ? spotting2083Exams['sheet3'] : [];

    const mapSheet = (sheetList: any[], offsetId: number) => {
      return sheetList.map((item: any, idx: number) => ({
        id: 1000 + (item.id || idx) + offsetId,
        nameEnglish: item.nameEnglish || item.itemName,
        nameNepali: item.nameNepali || item.itemName,
        category: item.category || '२०८३ बैशाख स्थलगत औजार',
        purposeNepali: item.purposeNepali,
        purposeEnglish: item.purposeEnglish || item.purposeNepali,
        imageUrl: item.imageUrl || '',
        tipNepali: item.tipNepali || `स्पटिङ टिप: ${item.itemName} विशेष गरी CTEVT प्रयोगात्मक परीक्षामा सोधिने मुख्य उपकरण हो। यसको उद्देश्य र प्रयोग स्पष्ट भन्नुहोस्।`
      }));
    };

    return [
      ...modelMapped,
      ...mapSheet(sheet1List, 0),
      ...mapSheet(sheet2List, 50),
      ...mapSheet(sheet3List, 100)
    ];
  };

  const activeSpottingList = getMappedSpotting();

  // SUBJECTIVE DATA SOURCE (Full 5 Sets - 53 Questions + 2083 Baishakh)
  const getMappedSubjective = (): SubjectiveQuestion[] => {
    let list: SubjectiveQuestion[] = [];
    if (subjectiveDataSource === '2083') {
      list = (subjective2083Exams || []).map((q: any) => ({
        id: 100 + (q.id || 0),
        marks: q.marks,
        questionNepali: q.questionNepali,
        modelAnswerNepali: q.answerNepali,
        keyPoints: q.points || ['CTEVT मानक भाषा', 'चित्तबुझ्दो व्याख्या', 'आवश्यक रेखाचित्र (Diagram)'],
        category: '२०८३ लिखित खण्ड',
        setNumber: '२०८३ वैशाख',
        imageUrl: q.imageUrl || ''
      }));
    } else {
      list = (subjectiveModelExams || []).map((q: any) => ({
        ...q,
        imageUrl: q.imageUrl || ''
      }));
      if (subjectiveDataSource.startsWith('set')) {
        const setNum = subjectiveDataSource.replace('set', '');
        list = list.filter((q) => q.setNumber === setNum);
      }
    }

    if (subjectiveSearchQuery.trim()) {
      const q = subjectiveSearchQuery.toLowerCase();
      list = list.filter((item) =>
        item.questionNepali.toLowerCase().includes(q) ||
        (item.modelAnswerNepali && item.modelAnswerNepali.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.keyPoints && item.keyPoints.some(pt => pt.toLowerCase().includes(q)))
      );
    }
    return list;
  };
  const activeSubjectiveList = getMappedSubjective();

  // VIVA DATA SOURCE
  const getMappedViva = (): VivaQuestion[] => {
    if (vivaDataSource === 'model') return vivaModelExams;
    const sheetKey = vivaDataSource === '2083-sheet1' ? 'sheet1' : vivaDataSource === '2083-sheet2' ? 'sheet2' : 'sheet3';
    const sheetList = (viva2083Exams && viva2083Exams[sheetKey]) ? viva2083Exams[sheetKey] : [];
    return sheetList.map((item: any) => ({
      id: 2000 + (item.id || 0) + (sheetKey === 'sheet1' ? 0 : sheetKey === 'sheet2' ? 50 : 100),
      questionNepali: item.question,
      answerNepali: item.answerNepali,
      englishKey: item.examinerTip || 'Viva Tip',
      category: `२०८३ बैशाख ${sheetKey === 'sheet1' ? 'मौखिक सेट क' : sheetKey === 'sheet2' ? 'मौखिक सेट ख' : 'मौखिक सेट ग'}`
    }));
  };
  const activeVivaList = getMappedViva();

  // ==========================================
  // EFFECTS & HELPERS
  // ==========================================

  // Shuffler for matching items Column B
  useEffect(() => {
    if (activeMatchingGroups[currentMatchingGroupIndex]) {
      const responses = [...activeMatchingGroups[currentMatchingGroupIndex].responses];
      // Fisher-Yates Shuffle
      for (let i = responses.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [responses[i], responses[j]] = [responses[j], responses[i]];
      }
      setShuffledResponses(responses);
      setUserMatches({});
      setSelectedPremiseId(null);
      setCheckedMatches(false);
    }
  }, [currentMatchingGroupIndex, matchingDataSource]);

  // Spotting Quiz Option Generator
  useEffect(() => {
    generateSpottingQuizQuestion();
  }, [spottingQuizIndex, activeSpottingList.length]);

  const generateSpottingQuizQuestion = () => {
    const currentSpot = activeSpottingList[spottingQuizIndex % activeSpottingList.length];
    if (!currentSpot) return;

    const correctAns = currentSpot.purposeNepali;
    const pool = activeSpottingList
      .filter((s) => s.id !== currentSpot.id)
      .map((s) => s.purposeNepali);

    // Pick 3 random distractors
    const distractors: string[] = [];
    const poolCopy = [...pool];
    while (distractors.length < 3 && poolCopy.length > 0) {
      const randIdx = Math.floor(Math.random() * poolCopy.length);
      distractors.push(poolCopy.splice(randIdx, 1)[0]);
    }

    // Combine and shuffle options
    const options = [correctAns, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setSpottingQuizOptions(options);
    setSpottingQuizAnswered(false);
    setSpottingQuizSelected(null);
  };

  // Mock Exam Timer
  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && examTimeSeconds > 0) {
      timer = setInterval(() => {
        setExamTimeSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitMockExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, examTimeSeconds]);

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const speakText = (text: string, title: string = 'प्राविधिक प्रश्न') => {
    speakNepaliText(text, title);
  };

  // ==========================================
  // HANDLERS FOR EACH SECTION
  // ==========================================

  // 1. MCQ Practice Handler
  const handleMcqSelect = (qId: number, option: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
    if (activeMcq && option === activeMcq.correctAnswer) {
      try {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      } catch (_) {}
    }
  };

  // 2. Matching Game Handlers
  const handlePremiseClick = (premiseId: string) => {
    if (checkedMatches) return;
    setSelectedPremiseId(premiseId === selectedPremiseId ? null : premiseId);
  };

  const handleResponseClick = (responseId: string) => {
    if (checkedMatches || !selectedPremiseId) return;

    setUserMatches((prev) => ({
      ...prev,
      [selectedPremiseId]: responseId
    }));
    setSelectedPremiseId(null);
  };

  const removeMatch = (premiseId: string) => {
    if (checkedMatches) return;
    setUserMatches((prev) => {
      const copy = { ...prev };
      delete copy[premiseId];
      return copy;
    });
  };

  const handleCheckMatching = () => {
    setCheckedMatches(true);
    const group = activeMatchingGroups[currentMatchingGroupIndex];
    let correctCount = 0;
    group.items.forEach((item) => {
      if (userMatches[item.id] === group.correctMatches[item.id]) {
        correctCount++;
      }
    });

    if (correctCount === group.items.length) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
    }
  };

  // 3. Spotting Quiz Handlers
  const handleSpottingQuizOptionClick = (option: string) => {
    if (spottingQuizAnswered) return;

    setSpottingQuizSelected(option);
    setSpottingQuizAnswered(true);
    setSpottingTotalAttempted((prev) => prev + 1);

    const currentSpot = activeSpottingList[spottingQuizIndex % activeSpottingList.length];
    if (option === currentSpot.purposeNepali) {
      setSpottingScore((prev) => prev + 1);
      try {
        confetti({ particleCount: 25, spread: 35, origin: { y: 0.75 } });
      } catch (_) {}
    }
  };

  // 4. Subjective AI Evaluation Handler
  const handleEvaluateSubjective = async (qId: number) => {
    const question = activeSubjectiveList.find((q) => q.id === qId);
    const answer = subjectiveUserAnswers[qId] || '';

    if (!question || !answer.trim()) return;

    setEvaluatingAi(true);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.questionNepali,
          studentAnswer: answer,
          maxMarks: question.marks
        })
      });

      const data = await res.json();
      setAiEvaluationResults((prev) => ({
        ...prev,
        [qId]: {
          score: data.score,
          strengths: data.strengths || [],
          improvements: data.improvements || [],
          modelSummary: data.modelSummary || ''
        }
      }));

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (_) {}
    } catch (err) {
      console.error('AI Evaluator Error:', err);
      // Local evaluation fallback
      const wordCount = answer.trim().split(/\s+/).length;
      let score = 2.5;
      if (wordCount > 50) score = 4.0;
      if (wordCount > 100) score = 4.5;

      setAiEvaluationResults((prev) => ({
        ...prev,
        [qId]: {
          score,
          strengths: ['आधारभूत प्राविधिक अवधारणाहरू समेटिएका छन्।', 'उत्तरको ढाँचा सन्तोषजनक छ।'],
          improvements: ['प्रवाह सुधार गर्न सूत्र र बुँदागत बुँदाहरू थप्नुहोला।', 'चित्रात्मक रेखाचित्र (Diagram) को कमी छ।'],
          modelSummary: question.modelAnswerNepali
        }
      }));
    } finally {
      setEvaluatingAi(false);
    }
  };

  // 5. Viva Voce Filter & Navigation
  const filteredViva = activeVivaList.filter((v) => {
    if (!vivaSearch.trim()) return true;
    const s = vivaSearch.toLowerCase();
    return (
      v.questionNepali.toLowerCase().includes(s) ||
      v.answerNepali.toLowerCase().includes(s) ||
      v.englishKey.toLowerCase().includes(s) ||
      v.category.toLowerCase().includes(s)
    );
  });

  const activeViva = filteredViva[vivaIndex % Math.max(1, filteredViva.length)];

  // 6. Mock Exam Actions
  const handleStartMockExam = () => {
    setIsExamRunning(true);
    setExamTimeSeconds(10800); // 3 Hours
    setMockAnswers({});
    setMockSubjectiveAnswers({});
    setMockExamSubmitted(false);
    setMockSubjectiveEvaluations({});
  };

  const handleAutoSubmitMockExam = () => {
    setIsExamRunning(false);
    setMockExamSubmitted(true);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (_) {}
  };

  const handleEvaluateMockSubjective = async (qId: number) => {
    const question = modelSubjectiveQuestions.find((q) => q.id === qId);
    const answer = mockSubjectiveAnswers[qId] || '';

    if (!question || !answer.trim()) return;

    setMockEvaluatingAiId(qId);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.questionNepali,
          studentAnswer: answer,
          maxMarks: question.marks
        })
      });

      const data = await res.json();
      setMockSubjectiveEvaluations((prev) => ({
        ...prev,
        [qId]: data
      }));
    } catch (err) {
      console.error(err);
      setMockSubjectiveEvaluations((prev) => ({
        ...prev,
        [qId]: {
          score: 3.5,
          strengths: ['मुख्य उत्तर लेख्ने राम्रो प्रयास।'],
          improvements: ['थप प्राविधिक सटिकता र सुरक्षा मापदण्डहरू समेट्नुहोस्।'],
          modelSummary: question.modelAnswerNepali
        }
      }));
    } finally {
      setMockEvaluatingAiId(null);
    }
  };

  const calculateMockScore = () => {
    let score = 0;
    // We score the first 50 MCQs
    modelExamLevel2MCQs.forEach((q) => {
      if (mockAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSwitchTab = (tab: SubTab) => {
    setActiveSubTab(tab);
    setTimeout(() => {
      const el = document.getElementById('exam-tab-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 text-white space-y-8" id="exam-portal">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-3 py-1 rounded-full mb-2">
            <Award className="w-3.5 h-3.5 animate-pulse" />
            <span>CTEVT राष्ट्रिय सीप परीक्षण समिति (NSTB) परीक्षा तयारी (तह-२)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            तह–२ दूरसञ्चार प्राविधिक परीक्षा पोर्टल
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            समग्र ६०+ बहुवैकल्पिक अभ्यास (MCQs), स्थलगत चिन्हाइ (Spotting), अन्तर्क्रियात्मक जोडा मिलाउने, विषयगत स्व-मूल्याङ्कन र ३ घण्टे सिमुलेटर परीक्षा।
          </p>
        </div>

        {/* Scrollable Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-700 scroll-smooth shadow-inner">
          <button
            onClick={() => handleSwitchTab('mcq-practice')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'mcq-practice'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            MCQ बहुवैकल्पिक
          </button>
          <button
            onClick={() => handleSwitchTab('matching-game')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'matching-game'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            जोडा मिलाउनुहोस्
          </button>
          <button
            onClick={() => handleSwitchTab('spotting-challenge')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'spotting-challenge'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            स्थलगत चिन्हाइ (Spotting)
          </button>
          <button
            onClick={() => handleSwitchTab('subjective-qa')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'subjective-qa'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            विषयगत (Subjective)
          </button>
          <button
            onClick={() => handleSwitchTab('schematics-diagrams')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'schematics-diagrams'
                ? 'bg-cyan-600 text-white shadow shadow-cyan-500/20'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-slate-800'
            }`}
          >
            <span>📐 सचित्र डायग्राम र नक्सा (Diagrams)</span>
          </button>
          <button
            onClick={() => handleSwitchTab('viva-flashcards')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'viva-flashcards'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            मौखिक अन्तर्वार्ता (Viva)
          </button>
          <button
            onClick={() => handleSwitchTab('telecom-handbook')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'telecom-handbook'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            विशेष गाइड बुक र शब्दकोश
          </button>
          <button
            onClick={() => handleSwitchTab('practical-guide')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'practical-guide'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            व्यावहारिक परीक्षा गाइड
          </button>
          <button
            onClick={() => handleSwitchTab('mock-exam')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'mock-exam'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-400 hover:text-amber-200 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>३ घण्टे परीक्षा</span>
          </button>
        </div>
      </div>

      <div id="exam-tab-content" className="scroll-mt-6">

      {/* ==========================================
          SUBTAB 1: MCQ INTERACTIVE PRACTICE
          ========================================== */}
      {activeSubTab === 'mcq-practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Question Index Sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                प्रश्न सूची ({filteredMcqs.length})
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                हल गरिएको: {Object.keys(userAnswers).length} / {filteredMcqs.length}
              </span>
            </div>

            {/* Source Selector */}
            <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <label className="text-2xs font-extrabold text-amber-400 uppercase tracking-wider block">
                प्रश्नोत्तर स्रोत (Question Source):
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setMcqDataSource('2083'); setCurrentMcqIndex(0); }}
                  className={`py-1.5 rounded text-3xs font-extrabold transition-all text-center ${
                    mcqDataSource === '2083' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  २०८३ वैशाख परीक्षा (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => { setMcqDataSource('model'); setCurrentMcqIndex(0); }}
                  className={`py-1.5 rounded text-3xs font-extrabold transition-all text-center ${
                    mcqDataSource === 'model' ? 'bg-blue-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  नियमित मोडल सेटहरू
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentMcqIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="all">सबै विधा (All Categories)</option>
              <option value="tools">उपकरण तथा औजार (Tools & Equipment)</option>
              <option value="telecom">आउटसाइड प्लांट तथा पोलिङ (OSP & Poling)</option>
              <option value="copper">कपर केबल प्रविधि (Copper Cables)</option>
              <option value="fiber">अप्टिकल फाइबर प्रविधि (Optical Fiber)</option>
              <option value="electrical">विद्युतीय सिद्धान्त तथा अर्थिङ (Electrical & Earthing)</option>
              <option value="safety">सुरक्षा मापदण्ड (Safety Standards)</option>
            </select>

            {/* Grid of Question Number Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredMcqs.map((q, idx) => {
                const isCurrent = idx === currentMcqIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCorrect = isAnswered && userAnswers[q.id] === q.correctAnswer;
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentMcqIndex(idx); }}
                    className={`h-9 rounded-lg font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : isAnswered
                        ? isCorrect
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-rose-950 text-rose-300 border border-rose-700'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Box */}
          {activeMcq ? (
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="bg-blue-900/80 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-700/60">
                  प्रश्न नं. {currentMcqIndex + 1} / {filteredMcqs.length} (पूर्णाङ्क: १)
                </span>
                <span className="text-xs text-slate-400 font-mono capitalize">
                  विधा: {activeMcq.category}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {activeMcq.questionNepali}
                </h3>
              </div>

              {/* MCQ Question Image / Diagram (If uploaded) */}
              {(activeMcq as any).imageUrl && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-blue-400" />
                      <span>प्रश्न सम्बन्धित रेखाचित्र / तस्बिर (Diagram / Photo)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewImage({ url: (activeMcq as any).imageUrl!, title: activeMcq.questionNepali })}
                      className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Zoom</span>
                    </button>
                  </div>
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-850 bg-black/60 max-h-72 flex items-center justify-center p-2"
                    onClick={() => setPreviewImage({ url: (activeMcq as any).imageUrl!, title: activeMcq.questionNepali })}
                  >
                    <img
                      src={(activeMcq as any).imageUrl}
                      alt={activeMcq.questionNepali}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-64 object-contain group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>ठूलो बनाएर हेर्नुहोस्</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optText = activeMcq.options[optKey];
                  const selectedOpt = userAnswers[activeMcq.id];
                  const isSelected = selectedOpt === optKey;
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = optKey === activeMcq.correctAnswer;

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950 border-rose-600 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={optKey}
                      disabled={isAnswered}
                      onClick={() => { handleMcqSelect(activeMcq.id, optKey); }}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {optKey}
                      </span>
                      <span className="leading-snug">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Technical Fact Box */}
              {showExplanation[activeMcq.id] && (
                <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 space-y-2 animate-fade-in text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>सहि उत्तर तथा प्राविधिक व्याख्या (Technical Fact):</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {activeMcq.explanationNepali}
                  </p>
                </div>
              )}

              {/* Navigation Bottom Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => { setCurrentMcqIndex((prev) => Math.max(0, prev - 1)); }}
                  disabled={currentMcqIndex === 0}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  अघिल्लो प्रश्न
                </button>

                <button
                  onClick={() => { setCurrentMcqIndex((prev) => Math.min(filteredMcqs.length - 1, prev + 1)); }}
                  disabled={currentMcqIndex === filteredMcqs.length - 1}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>अर्को प्रश्न</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              यस क्याटगोरीमा कुनै प्रश्नहरू उपलब्ध छैनन्।
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          SUBTAB 2: INTERACTIVE MATCHING GAME
          ========================================== */}
      {activeSubTab === 'matching-game' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold">खण्ड १: जोडा मिलाउनुहोस् (Matching Questions)</h3>
                <p className="text-xs text-slate-400">यो वास्तविक परीक्षा पत्रको प्रश्न ३१ देखि ५० सम्मको ढाँचा हो।</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-2xs font-bold">
                  <button
                    onClick={() => { setMatchingDataSource('2083'); setCurrentMatchingGroupIndex(0); }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      matchingDataSource === '2083' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    २०८३ वैशाख (PDF)
                  </button>
                  <button
                    onClick={() => { setMatchingDataSource('model'); setCurrentMatchingGroupIndex(0); }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      matchingDataSource === 'model' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    नियमित म्याचिङ
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  {activeMatchingGroups.map((g, idx) => (
                    <button
                      key={g.id}
                      onClick={() => { setCurrentMatchingGroupIndex(idx); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentMatchingGroupIndex === idx
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      समूह {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeMatchingGroups[currentMatchingGroupIndex] && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm font-bold text-blue-400">
                  {activeMatchingGroups[currentMatchingGroupIndex].titleNepali}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Column A (Premises) */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">समुह क (Column A)</div>
                    {activeMatchingGroups[currentMatchingGroupIndex].items.map((item) => {
                      const pairedResponseId = userMatches[item.id];
                      const responseItem = activeMatchingGroups[currentMatchingGroupIndex].responses.find((r) => r.id === pairedResponseId);
                      const isCorrect = checkedMatches && pairedResponseId === activeMatchingGroups[currentMatchingGroupIndex].correctMatches[item.id];

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex flex-col gap-2 transition-all ${
                            selectedPremiseId === item.id
                              ? 'border-blue-500 bg-blue-950/20'
                              : checkedMatches
                              ? isCorrect
                                ? 'border-emerald-600 bg-emerald-950/20'
                                : 'border-rose-600 bg-rose-950/20'
                              : 'border-slate-800 bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{item.premise}</span>
                            {!checkedMatches && (
                              <button
                                onClick={() => { handlePremiseClick(item.id); }}
                                className={`px-2.5 py-1 rounded text-2xs font-bold transition-all ${
                                  selectedPremiseId === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {pairedResponseId ? 'परिवर्तन गर्नुहोस्' : 'चयन गर्नुहोस्'}
                              </button>
                            )}
                          </div>

                          {/* Render Paired Choice */}
                          {responseItem && (
                            <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                              <span className="font-semibold text-blue-400">
                                जोडा: ({responseItem.letter}) {responseItem.text}
                              </span>
                              {!checkedMatches && (
                                <button
                                  onClick={() => { removeMatch(item.id); }}
                                  className="text-slate-500 hover:text-rose-400 p-0.5"
                                >
                                  <Undo className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Show Correction on Check */}
                          {checkedMatches && !isCorrect && (
                            <div className="text-2xs text-rose-300 font-medium">
                              सहि उत्तर: (
                              {
                                activeMatchingGroups[currentMatchingGroupIndex].responses.find(
                                  (r) => r.id === activeMatchingGroups[currentMatchingGroupIndex].correctMatches[item.id]
                                )?.letter
                              }
                              ){' '}
                              {
                                activeMatchingGroups[currentMatchingGroupIndex].responses.find(
                                  (r) => r.id === activeMatchingGroups[currentMatchingGroupIndex].correctMatches[item.id]
                                )?.text
                              }
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Column B (Responses) */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">समुह ख (Column B)</div>
                    <div className="space-y-2">
                      {shuffledResponses.map((res) => {
                        // Check if this response has already been matched
                        const matchedPremiseId = Object.keys(userMatches).find((k) => userMatches[k] === res.id);

                        return (
                          <button
                            key={res.id}
                            disabled={checkedMatches || !selectedPremiseId || !!matchedPremiseId}
                            onClick={() => { handleResponseClick(res.id); }}
                            className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
                              matchedPremiseId
                                ? 'bg-slate-950 border-slate-900 opacity-40 text-slate-600 line-through'
                                : selectedPremiseId
                                ? 'border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200'
                                : 'border-slate-800 bg-slate-900/40 text-slate-400'
                            }`}
                          >
                            <span className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-slate-300">
                              {res.letter}
                            </span>
                            <span className="leading-snug">{res.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Score Summary & Check matches */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-4">
                  <div>
                    {checkedMatches && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-bold">
                          नतिजा: {' '}
                          {
                            activeMatchingGroups[currentMatchingGroupIndex].items.filter(
                              (it) => userMatches[it.id] === activeMatchingGroups[currentMatchingGroupIndex].correctMatches[it.id]
                            ).length
                          }{' '}
                          / ५ मिलाउन सफल।
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setUserMatches({});
                        setSelectedPremiseId(null);
                        setCheckedMatches(false);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                    >
                      रिसेट (Reset)
                    </button>
                    {!checkedMatches && (
                      <button
                        onClick={handleCheckMatching}
                        disabled={Object.keys(userMatches).length < 5}
                        className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-xs font-bold"
                      >
                        नतिजा जाँच गर्नुहोस्
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBTAB 3: SPOTTING CHALLENGE
          ========================================== */}
      {activeSubTab === 'spotting-challenge' && (
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Inner Navigation Tabs */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>स्थलगत प्रयोगात्मक परीक्षा (Spotting Assessment)</span>
              </h3>
              <p className="text-2xs text-slate-400">परीक्षामा १० वटा उपकरण चिन्नुपर्छ र काम लेख्नुपर्छ।</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => { setSpottingTab('study'); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    spottingTab === 'study' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  अध्ययन निर्देशिका
                </button>
                <button
                  onClick={() => { setSpottingTab('quiz'); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    spottingTab === 'quiz' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  प्रयोगात्मक परीक्षा (Quiz)
                </button>
              </div>
            </div>
          </div>

          {/* STUDY DIRECTORY MODE */}
          {spottingTab === 'study' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Tool Index Grid */}
              <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[500px] overflow-y-auto">
                <div className="text-2xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800 pb-2 mb-2 flex justify-between items-center">
                  <span>उपकरण सूची ({activeSpottingList.length} मुख्य साधनहरू)</span>
                  <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-900/40 text-3xs">ALL</span>
                </div>
                {activeSpottingList.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => { setSelectedSpottingId(spot.id); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedSpottingId === spot.id
                        ? 'bg-blue-600 text-white border-blue-500 font-bold shadow'
                        : 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate max-w-[80%]">
                      <div className="text-2xs opacity-75 font-mono truncate">{spot.nameEnglish}</div>
                      <div className="text-xs truncate">{spot.nameNepali}</div>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-900/60 font-mono text-slate-300 shrink-0">
                      #{spot.id}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tool Details View */}
              <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {(() => {
                  const spot = activeSpottingList.find((s) => s.id === selectedSpottingId) || activeSpottingList[0];
                  if (!spot) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-800 px-3 py-1 rounded-full">
                            {spot.category}
                          </span>
                          <h4 className="text-xl font-extrabold mt-2">{spot.nameNepali}</h4>
                          <p className="text-xs text-slate-400 font-semibold">{spot.nameEnglish}</p>
                        </div>
                        <span className="text-3xl font-extrabold text-blue-900/50">#{spot.id}</span>
                      </div>

                      {/* Spotting Image / Photo Display */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="font-bold text-blue-400 flex items-center gap-1.5">
                            <Image className="w-4 h-4 text-blue-400" />
                            <span>उपकरणको तस्बिर (Tool Photo / Illustration)</span>
                          </span>
                          {spot.imageUrl && (
                            <button
                              onClick={() => setPreviewImage({ url: spot.imageUrl!, title: spot.nameNepali })}
                              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Zoom</span>
                            </button>
                          )}
                        </div>

                        {spot.imageUrl ? (
                          <div
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-850 bg-black/60 max-h-60 flex items-center justify-center p-2"
                            onClick={() => setPreviewImage({ url: spot.imageUrl!, title: spot.nameNepali })}
                          >
                            <img
                              src={spot.imageUrl}
                              alt={spot.nameNepali}
                              referrerPolicy="no-referrer"
                              className="w-full max-h-56 object-contain group-hover:scale-102 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>ठूलो बनाएर हेर्नुहोस्</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-dashed border-slate-800 text-slate-500">
                            <Image className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs italic">कुनै तस्बिर उपलब्ध छैन।</p>
                            <p className="text-2xs mt-1 text-slate-600">कृपया एडमिन प्यानलबाट फोटो अपलोड गर्नुहोस्।</p>
                          </div>
                        )}
                      </div>

                      {/* Purpose Block */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-400">मुख्य कार्य तथा प्रयोगात्मक उपयोग:</div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
                          <p className="text-white font-medium">🇳🇵 {spot.purposeNepali}</p>
                          <p className="text-slate-400 italic">🇬🇧 {spot.purposeEnglish}</p>
                        </div>
                      </div>

                      {/* Examiner Tips */}
                      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-400">
                          <ShieldAlert className="w-4 h-4" />
                          <span>परीक्षोपयोगी टिप्स र सुरक्षित उपयोग (Examiner Checklist):</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {spot.tipNepali}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <button
                          onClick={() => { speakText(spot.nameNepali + '. ' + spot.purposeNepali, 'स्थलगत जानकारी'); }}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>नेपालीमा सुन्नुहोस्</span>
                        </button>
                        <button
                          onClick={() => {
                            setSpottingTab('quiz');
                            setSpottingQuizIndex(spottingItemsList.indexOf(spot));
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          यसको परीक्षण लिनुहोस्
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          )}

          {/* SPOTTING QUIZ MODE */}
          {spottingTab === 'quiz' && (
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  स्थलगत प्रश्न #{ (spottingQuizIndex % activeSpottingList.length) + 1 } / {activeSpottingList.length}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/40 px-3 py-1 rounded-full">
                  कम्प्युटर स्कोर: {spottingScore} / {spottingTotalAttempted}
                </span>
              </div>

              {/* Question Setup */}
              {(() => {
                const currentSpot = activeSpottingList[spottingQuizIndex % activeSpottingList.length];
                if (!currentSpot) return null;

                return (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
                      <div className="text-2xs text-blue-400 uppercase font-mono tracking-wider font-extrabold">प्रयोगात्मक परीक्षा खण्ड</div>
                      
                      {/* Photo if available */}
                      {currentSpot.imageUrl ? (
                        <div
                          className="max-w-xs mx-auto overflow-hidden rounded-xl border border-slate-800 bg-black/60 cursor-pointer p-2 relative group"
                          onClick={() => setPreviewImage({ url: currentSpot.imageUrl!, title: currentSpot.nameNepali })}
                        >
                          <img
                            src={currentSpot.imageUrl}
                            alt={currentSpot.nameNepali}
                            referrerPolicy="no-referrer"
                            className="w-full max-h-48 object-contain mx-auto"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" /> Zoom
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-xs mx-auto py-8 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-dashed border-slate-800 text-slate-500">
                          <Image className="w-8 h-8 mb-2 opacity-20" />
                          <p className="text-xs italic">तस्बिर उपलब्ध छैन</p>
                        </div>
                      )}

                      <h4 className="text-xl sm:text-2xl font-black text-white">{currentSpot.nameNepali}</h4>
                      <p className="text-xs text-slate-500 font-medium italic">{currentSpot.nameEnglish}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-300">
                        यस उपकरणको मुख्य प्रयोगात्मक काम के हो? सही विकल्प छनोट गर्नुहोस्:
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {spottingQuizOptions.map((opt, idx) => {
                          const isCorrect = opt === currentSpot.purposeNepali;
                          const isSelected = spottingQuizSelected === opt;
                          let btnStyle = 'bg-slate-950 border-slate-850 hover:bg-slate-800 text-slate-200';

                          if (spottingQuizAnswered) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-950 border-rose-600 text-rose-300';
                            } else {
                              btnStyle = 'bg-slate-950 border-slate-900 opacity-40 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              disabled={spottingQuizAnswered}
                              onClick={() => { handleSpottingQuizOptionClick(opt); }}
                              className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">
                                {idx + 1}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Result and tip */}
                    {spottingQuizAnswered && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                        <div className="font-bold flex items-center gap-1.5 text-blue-400">
                          <BrainCircuit className="w-4 h-4" />
                          <span>पार्टीकुलर र प्रयोगात्मक टिप:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                          {currentSpot.tipNepali}
                        </p>
                      </div>
                    )}

                    {/* Next controls */}
                    <div className="flex justify-end pt-4 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setSpottingQuizIndex((prev) => prev + 1);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                      >
                        <span>अर्को साधन पहिचान गर्नुहोस्</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}

        </div>
      )}

      {/* ==========================================
          SUBTAB 4: SUBJECTIVE STUDY & AI EVALUATOR
          ========================================== */}
      {activeSubTab === 'subjective-qa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Question selection sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                विषयगत प्रश्नहरू ({activeSubjectiveList.length})
              </span>
              <span className="text-2xs bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-850 font-bold">
                कुल ५३ प्रश्नहरू
              </span>
            </div>

            {/* Set Filter Pills */}
            <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <label className="text-2xs font-extrabold text-amber-400 uppercase tracking-wider block">
                लिखित परीक्षा सेट चयन गर्नुहोस्:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 bg-slate-900 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setSubjectiveDataSource('all'); setSelectedSubjectiveId(1); setShowSubjectiveKey(false); }}
                  className={`py-1.5 rounded text-3xs font-extrabold transition-all text-center col-span-2 ${
                    subjectiveDataSource === 'all' ? 'bg-blue-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  सबै प्रश्नहरू (५३)
                </button>
                <button
                  type="button"
                  onClick={() => { setSubjectiveDataSource('2083'); setSelectedSubjectiveId(101); setShowSubjectiveKey(false); }}
                  className={`py-1.5 rounded text-3xs font-extrabold transition-all text-center col-span-2 ${
                    subjectiveDataSource === '2083' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  २०८३ वैशाख
                </button>
                {['1', '2', '3', '4', '5'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => { 
                      setSubjectiveDataSource(`set${num}`); 
                      const firstQ = allSubjectiveQuestions.find(q => q.setNumber === num);
                      if (firstQ) setSelectedSubjectiveId(firstQ.id);
                      setShowSubjectiveKey(false); 
                    }}
                    className={`py-1.5 rounded text-3xs font-extrabold transition-all text-center ${
                      subjectiveDataSource === `set${num}` ? 'bg-emerald-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    सेट {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={subjectiveSearchQuery}
                onChange={(e) => setSubjectiveSearchQuery(e.target.value)}
                placeholder="विषयगत प्रश्न खोज्नुहोस् (उदा. MCB, ADSS, MDF)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-2xs sm:text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {subjectiveSearchQuery && (
                <button
                  onClick={() => setSubjectiveSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-3xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded"
                >
                  हटाउनुहोस्
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {activeSubjectiveList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  कुनै प्रश्न भेटिएन।
                </div>
              ) : (
                activeSubjectiveList.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => { setSelectedSubjectiveId(q.id); setShowSubjectiveKey(false); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                      selectedSubjectiveId === q.id
                        ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow'
                        : 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5 text-slate-300">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="line-clamp-2 leading-relaxed">{q.questionNepali}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className={`text-3xs px-2 py-0.5 rounded-full ${selectedSubjectiveId === q.id ? 'bg-blue-800' : 'bg-slate-900'} text-slate-400 font-medium`}>
                          अङ्क: {q.marks}
                        </span>
                        {q.setNumber && (
                          <span className={`text-3xs px-1.5 py-0.5 rounded font-bold ${selectedSubjectiveId === q.id ? 'bg-blue-900 text-blue-200' : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'}`}>
                            सेट {q.setNumber}
                          </span>
                        )}
                        {q.diagramRequired && (
                          <span className={`text-3xs px-1.5 py-0.5 rounded font-bold ${selectedSubjectiveId === q.id ? 'bg-blue-900 text-blue-200' : 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60'}`}>
                            📐 चित्र
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Core study and text editor */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {(() => {
              const q = activeSubjectiveList.find((item) => item.id === selectedSubjectiveId) || activeSubjectiveList[0];
              if (!q) return null;

              const aiResult = aiEvaluationResults[q.id];

              return (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                        खण्ड ख: विषयगत लिखित उत्तर (अङ्क: {q.marks})
                      </span>
                      {q.setNumber && (
                        <span className="bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          सेट {q.setNumber}
                        </span>
                      )}
                      {q.diagramRequired && (
                        <button
                          type="button"
                          onClick={() => handleSwitchTab('schematics-diagrams')}
                          className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
                          title="सम्बन्धित सचित्र डायग्राम तथा प्राविधिक नक्सा हेर्नुहोस्"
                        >
                          <span>📐 रेखाचित्र अनिवार्य (डायग्राम हेर्नुहोस्)</span>
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono capitalize">
                      {q.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                    प्रश्न: {q.questionNepali}
                  </h3>

                  {/* Subjective Question Diagram / Photo (If uploaded) */}
                  {(q as any).imageUrl && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5">
                          <Image className="w-4 h-4 text-amber-400" />
                          <span>विषयगत रेखाचित्र / प्राविधिक तस्बिर (Diagram / Illustration)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ url: (q as any).imageUrl!, title: q.questionNepali })}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Zoom</span>
                        </button>
                      </div>
                      <div
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-850 bg-black/60 max-h-72 flex items-center justify-center p-2"
                        onClick={() => setPreviewImage({ url: (q as any).imageUrl!, title: q.questionNepali })}
                      >
                        <img
                          src={(q as any).imageUrl}
                          alt={q.questionNepali}
                          referrerPolicy="no-referrer"
                          className="w-full max-h-64 object-contain group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-amber-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>ठूलो बनाएर हेर्नुहोस्</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Marking Scheme Points */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-blue-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>परीक्षकले खोज्ने मुख्य बुँदाहरू (Marking Scheme Core Points):</span>
                    </div>
                    <ul className="list-disc pl-5 text-slate-300 space-y-1 leading-relaxed">
                      {q.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Simulator Text Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      तपाईंको उत्तर यहाँ लेख्नुहोस् (Practice writing your answer in Nepali or English):
                    </label>
                    <textarea
                      value={subjectiveUserAnswers[q.id] || ''}
                      onChange={(e) => {
                        setSubjectiveUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }));
                      }}
                      rows={5}
                      placeholder="यस प्रश्नको पूर्ण उत्तर कपर जोइन्टिङ, कलर कोड वा सुरक्षित भर्‍याङ्ग कसरी सुरक्षित राख्ने भन्ने प्राविधिक भाषामा लेख्नुहोस्..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => { setShowSubjectiveKey((prev) => !prev); }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{showSubjectiveKey ? 'मोडेल उत्तर लुकाउनुहोस्' : 'आधिकारिक मोडेल उत्तर हेर्नुहोस्'}</span>
                    </button>

                    <button
                      disabled={evaluatingAi || !(subjectiveUserAnswers[q.id] || '').trim()}
                      onClick={() => { handleEvaluateSubjective(q.id); }}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      {evaluatingAi ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>जेमिनीले मूल्याङ्कन गर्दैछ...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-4 h-4" />
                          <span>जेमिनी एआई स्व-मूल्याङ्कन (AI Evaluator)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Study Model Answer */}
                  {showSubjectiveKey && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-amber-400">CTEVT आधिकारिक मोडेल उत्तर:</div>
                      <div className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line border-t border-slate-800 pt-3">
                        {q.modelAnswerNepali}
                      </div>
                    </div>
                  )}

                  {/* AI Evaluation Report */}
                  {aiResult && (
                    <div className="bg-slate-950/80 border border-emerald-600/50 rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <h5 className="font-extrabold text-sm text-emerald-400">परीक्षा परीक्षक एआई रिपोर्ट</h5>
                        </div>
                        <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold">
                          अङ्क प्राप्त: {aiResult.score} / {q.marks}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Strengths */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="font-bold text-emerald-400">राम्रो पक्षहरू (Strengths):</div>
                          <ul className="list-disc pl-5 text-slate-300 space-y-1">
                            {aiResult.strengths.map((str: string, i: number) => (
                              <li key={i}>{str}</li>
                            ))}
                          </ul>
                        </div>
                        {/* Improvements */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="font-bold text-amber-400">सुधार गर्नुपर्ने पक्षहरू (Improvements):</div>
                          <ul className="list-disc pl-5 text-slate-300 space-y-1">
                            {aiResult.improvements.map((imp: string, i: number) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Examiner summary feedback */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                        <div className="font-bold text-blue-400">परीक्षकको विशेष सल्लाह (Examiner Feedback):</div>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {aiResult.modelSummary}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* ==========================================
          SUBTAB: INTERACTIVE EXAM DIAGRAMS & SCHEMATICS
          ========================================== */}
      {activeSubTab === 'schematics-diagrams' && (
        <InteractiveExamDiagrams />
      )}

      {/* ==========================================
          SUBTAB 5: VIVA VOCE INTERACTIVE FLASHCARDS
          ========================================== */}
      {activeSubTab === 'viva-flashcards' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm">खण्ड २: मौखिक अन्तर्वार्ता (Viva-Voce Flashcards)</h3>
              <p className="text-2xs text-slate-400">कार्डमा ट्याप वा क्लिक गरेर पल्टाउनुहोस् र परीक्षाको सही उत्तर सुन्नुहोस्।</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Viva Source Toggles */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-3xs font-extrabold">
                <button
                  onClick={() => { setVivaDataSource('2083-sheet1'); setVivaIndex(0); }}
                  className={`px-2 py-1 rounded transition-all ${
                    vivaDataSource === '2083-sheet1' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मौखिक क (PDF)
                </button>
                <button
                  onClick={() => { setVivaDataSource('2083-sheet2'); setVivaIndex(0); }}
                  className={`px-2 py-1 rounded transition-all ${
                    vivaDataSource === '2083-sheet2' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मौखिक ख (PDF)
                </button>
                <button
                  onClick={() => { setVivaDataSource('2083-sheet3'); setVivaIndex(0); }}
                  className={`px-2 py-1 rounded transition-all ${
                    vivaDataSource === '2083-sheet3' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मौखिक ग (PDF)
                </button>
                <button
                  onClick={() => { setVivaDataSource('model'); setVivaIndex(0); }}
                  className={`px-2 py-1 rounded transition-all ${
                    vivaDataSource === 'model' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  नियमित मौखिक
                </button>
              </div>

              <span className="text-xs text-amber-400 font-bold bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                कार्ड #{filteredViva.length > 0 ? vivaIndex + 1 : 0} / {filteredViva.length}
              </span>
            </div>
          </div>

          {/* Search filter for Viva */}
          <div className="relative">
            <input
              type="text"
              value={vivaSearch}
              onChange={(e) => { setVivaSearch(e.target.value); setVivaIndex(0); }}
              placeholder="मौखिक प्रश्नहरू खोज्नुहोस् (उदा. Rectifier, Splicing, Battery, Earthing)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-slate-200 focus:border-blue-500 outline-none shadow-inner"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-500">
              <ListFilter className="w-4 h-4" />
            </span>
          </div>

          {/* Core Flip card */}
          {activeViva ? (
            <div className="space-y-6">
              {/* Card body wrapper */}
              <div
                onClick={() => { setIsFlipped((prev) => !prev); }}
                className="cursor-pointer min-h-[220px] relative transition-all duration-500 transform-style-3d text-center flex items-center justify-center"
              >
                {/* Front face of card */}
                <div className={`absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backface-hidden transition-all duration-500 ${
                  isFlipped ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                  <div className="flex items-center justify-between text-2xs text-slate-400 font-mono">
                    <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">{activeViva.category}</span>
                    <span>{activeViva.englishKey}</span>
                  </div>

                  <div className="my-auto py-4 space-y-2">
                    <p className="text-slate-400 font-medium text-xs">मौखिक प्रश्नहरू (Examiner Question):</p>
                    <h4 className="text-base sm:text-lg font-black text-white leading-relaxed">
                      "{activeViva.questionNepali}"
                    </h4>
                    {(activeViva as any).imageUrl && (
                      <div className="mt-3 max-h-36 overflow-hidden rounded-xl border border-slate-800 bg-black/50 p-1 flex items-center justify-center">
                        <img
                          src={(activeViva as any).imageUrl}
                          alt={activeViva.questionNepali}
                          referrerPolicy="no-referrer"
                          className="max-h-32 object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-2xs text-blue-400 font-bold">
                    पल्टाउनुहोस् (Click to Reveal Answer)
                  </div>
                </div>

                {/* Back face of card */}
                <div className={`absolute inset-0 w-full h-full bg-slate-950 border border-blue-600 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backface-hidden transition-all duration-500 ${
                  isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="flex items-center justify-between text-2xs text-emerald-400 font-mono">
                    <span className="bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-full font-bold">सही उत्तर (Pass Standard)</span>
                    <span>English Key: {activeViva.englishKey}</span>
                  </div>

                  <div className="my-auto py-4">
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-bold">
                      {activeViva.answerNepali}
                    </p>
                  </div>

                  <div className="text-2xs text-slate-500">
                    पुनः प्रश्न हेर्नुहोस् (Click to Return to Question)
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => { speakText(isFlipped ? activeViva.answerNepali : activeViva.questionNepali, 'मौखिक खण्ड'); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Volume2 className="w-4.5 h-4.5 text-blue-400" />
                  <span>{isFlipped ? 'उत्तर सुन्नुहोस्' : 'प्रश्न सुन्नुहोस्'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setVivaIndex((prev) => Math.max(0, prev - 1)); setIsFlipped(false); }}
                    disabled={vivaIndex === 0}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-30 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    अघिल्लो
                  </button>
                  <button
                    onClick={() => { setVivaIndex((prev) => Math.min(filteredViva.length - 1, prev + 1)); setIsFlipped(false); }}
                    disabled={vivaIndex === filteredViva.length - 1}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                  >
                    अर्को कार्ड
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              यस खोज विधामा कुनै मौखिक प्रश्न फेला परेन।
            </div>
          )}

        </div>
      )}

      {/* ==========================================
          SUBTAB 8: PRACTICAL EXAM GUIDE & SIMULATION
          ========================================== */}
      {activeSubTab === 'practical-guide' && (
        <div className="space-y-6" id="practical-guide-container">
          
          {/* Section Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 text-2xs font-extrabold text-amber-400 bg-amber-950/75 border border-amber-900/60 px-3 py-1 rounded-full">
                <Wrench className="w-3.5 h-3.5" />
                <span>CTEVT तह–२ व्यावहारिक परीक्षा गाइड (Practical Assignments)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">राष्ट्रिय सीप परीक्षण समिति (NSTB) प्रयोगात्मक कार्यपत्र</h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                यो प्रयोगात्मक परीक्षा निर्देशिका २०८३ साल वैशाख परीक्षाको कपर केबल, पोलिङ, सोलार, फाइबर स्प्लाइसिङ र ओडीएफ कार्यपत्रहरूमा आधारित छ। आवश्यक सुरक्षा मापदण्ड, मूल्याङ्कन बुँदा र एआई सिमुलेटर सहित आफ्नो तयारी जाँच्नुहोस्।
              </p>
            </div>
            
            {/* Active Sheet Toggles */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs shrink-0 w-full md:w-auto relative z-10">
              {[0, 1, 2].map((sheetIdx) => (
                <button
                  key={sheetIdx}
                  onClick={() => { setPracticalActiveSheet(sheetIdx); setExpandedPracticalTaskId(null); }}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold transition-all text-center whitespace-nowrap ${
                    practicalActiveSheet === sheetIdx
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-102'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  कार्यपत्र पाना {sheetIdx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          {(() => {
            const currentSheetTasks = (practicalState && practicalState[practicalActiveSheet]) ? practicalState[practicalActiveSheet] : [];
            const checkedCount = currentSheetTasks.filter((t: any) => practicalCheckedTasks[`s${practicalActiveSheet}-t${t.id}`]).length;
            const progressPct = currentSheetTasks.length > 0 ? Math.round((checkedCount / currentSheetTasks.length) * 100) : 0;

            return (
              <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-3 bg-blue-950/80 border border-blue-900/60 text-blue-400 rounded-xl shrink-0">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">पाना {practicalActiveSheet + 1} तयारी प्रगति (Preparation Progress)</h4>
                    <p className="text-2xs text-slate-400">हल गरिएका र अभ्यास गरिएका प्रयोगात्मक कार्यहरू टिक लगाउनुहोस्।</p>
                  </div>
                </div>

                <div className="w-full sm:w-72 flex items-center gap-3">
                  <div className="flex-1 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-emerald-400 shrink-0 w-10 text-right">{progressPct}%</span>
                </div>
              </div>
            );
          })()}

          {/* Two-Pane Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of Assignments */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span>प्रयोगात्मक परीक्षाका मुख्य कार्यहरू ({((practicalState && practicalState[practicalActiveSheet]) || []).length} वटा कार्य)</span>
                <span className="text-2xs text-slate-500">पाना {practicalActiveSheet + 1} को सूची</span>
              </div>

              {(((practicalState && practicalState[practicalActiveSheet]) || []) as any[]).map((task) => {
                const compositeKey = `s${practicalActiveSheet}-t${task.id}`;
                const isChecked = !!practicalCheckedTasks[compositeKey];
                const isExpanded = expandedPracticalTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`bg-slate-900 border transition-all rounded-2xl ${
                      isExpanded
                        ? 'border-blue-600 ring-1 ring-blue-600/30 shadow-2xl'
                        : isChecked
                        ? 'border-emerald-900/50 bg-slate-900/50'
                        : 'border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="p-4 sm:p-5 flex items-start gap-3.5 justify-between">
                      {/* Checkbox and Text */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPracticalCheckedTasks((prev) => {
                              const updated = { ...prev, [compositeKey]: !prev[compositeKey] };
                              // Trigger brief success sound/confetti on first check
                              if (updated[compositeKey]) {
                                try {
                                  confetti({ particleCount: 15, spread: 25, origin: { y: 0.8 } });
                                } catch (_) {}
                              }
                              return updated;
                            });
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-700 hover:border-slate-500 bg-slate-950'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        
                        <div
                          className="space-y-1.5 cursor-pointer flex-1 min-w-0"
                          onClick={() => setExpandedPracticalTaskId(isExpanded ? null : task.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-3xs font-extrabold uppercase font-mono tracking-wider bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                              कार्य #{task.id}
                            </span>
                            <span className="text-3xs font-extrabold text-blue-400 bg-blue-950 border border-blue-900/60 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{task.timeMinutes} मिनेट</span>
                            </span>
                          </div>
                          <p className={`text-xs sm:text-sm font-bold text-slate-200 leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                            {task.taskNepali}
                          </p>
                        </div>
                      </div>

                      {/* Expand Arrow */}
                      <button
                        onClick={() => setExpandedPracticalTaskId(isExpanded ? null : task.id)}
                        className={`p-1 rounded-lg text-slate-400 hover:text-white transition-all shrink-0 ${isExpanded ? 'rotate-90 text-blue-400' : ''}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: AI Walkthrough & Simulator */}
            <div className="lg:col-span-6">
              {expandedPracticalTaskId !== null ? (
                (() => {
                  const tasks = baishakh2083PracticalSheets[practicalActiveSheet] || [];
                  const task = tasks.find((t) => t.id === expandedPracticalTaskId);
                  if (!task) return null;

                  // Custom simulated quizzes/walkthrough data based on the selected task
                  let steps: string[] = [];
                  let materials: string[] = [];
                  let markingScheme: { point: string; marks: number }[] = [];
                  let simQuiz: { question: string; options: string[]; correctIdx: number; tip: string } | null = null;

                  // Customize simulated instruction content purely dynamic to look realistic
                  if (practicalActiveSheet === 0) {
                    if (task.id === 4) { // Drop fiber splicing
                      steps = [
                        "अप्टिकल फाइबरको बाहिरी म्यानलाई फाइबर स्ट्रिपर प्रयोग गरी सुरक्षित रूपमा ताछ्ने।",
                        "कोर भित्रको जेल वा धुलोलाई आइसोप्रोपाइल अल्कोहल र लिन्ट-फ्री टिस्युले पूर्ण सफा गर्ने।",
                        "फाइबर क्लिभर प्रयोग गरी कोरलाई ठीक ९० डिग्री कोणमा काट्ने (क्लिभिङ)।",
                        "क्लिभ गरिएको फाइबरलाई फ्युजन स्प्लाइसर मेसिनको भी-ग्रुभ (V-groove) मा राख्ने।",
                        "मेसिनको आर्किङ विधिको प्रयोग गरी दुई फाइबर कोर फ्युजन गर्ने र लस जाँच गर्ने।",
                        "जोडिएको भागलाई हिट स्लिभ (Heat sleeve) हालेर स्प्लाइस ट्रे भित्र सुरक्षित राख्ने।"
                      ];
                      materials = ["फ्युजन स्प्लाइसर", "फाइबर क्लिभर", "फाइबर स्ट्रिपर", "आइसोप्रोपाइल अल्कोहल", "प्रोटेक्सन स्लिभ"];
                      markingScheme = [
                        { point: "सुरक्षित केबल प्रिपरेसन र सफाई", marks: 10 },
                        { point: "सटिक क्लिभिङ ९० डिग्री र मेसिन प्लेसमेन्ट", marks: 10 },
                        { point: "फ्युजन स्प्लाइस लस (०.०५ dB भन्दा कम)", marks: 10 }
                      ];
                      simQuiz = {
                        question: "सप्लाइसिङ गर्नु अघि ताछिएको नाङ्गो फाइबर कोरलाई सफा करना कुन रसायन वा घोल प्रयोग गरिन्छ?",
                        options: [
                          "साधारण पानी (Normal Water)",
                          "आइसोप्रोपाइल अल्कोहल (Isopropyl Alcohol)",
                          "मट्टितेल वा पेट्रोल (Kerosene)"
                        ],
                        correctIdx: 1,
                        tip: "आइसोप्रोपाइल अल्कोहल निकै छिटो सुक्छ र यसले फाइबर कोरमा कुनै अवशेष वा चिस्यान छोड्दैन, जसले प्रकाश प्रवाह अवरुद्ध हुन दिँदैन।"
                      };
                    } else if (task.id === 2) { // Solar panel series
                      steps = [
                        "दुईवटै १२V सोलार प्यानलहरूको सकारात्मक (Positive) र नकारात्मक (Negative) टर्मिनलहरू पहिचान गर्ने।",
                        "पहिले प्यानलको पोजिटिभ टर्मिनललाई दोस्रो प्यानलको नेगेटिभ टर्मिनलसँग सिरिज (Series) जडान गर्ने।",
                        "बाँकी रहेका पहिलो प्यानलको नेगेटिभ र दोस्रो प्यानलको पोजिटिभ तारहरू बाहिर निकाल्ने (जसले २४V प्रदान गर्दछ)।",
                        "मल्टिमिटरलाई डीसी भोल्टेज मोडमा सेट गरी आउटपुट भोल्टेज नाप्ने र २४V आएको पुष्टि गर्ने।",
                        "तारहरूलाई टेप बेरी charge controller हुँदै ब्याट्री बैंकमा जोड्ने।"
                      ];
                      materials = ["१२V सोलार प्यानल (२ वटा)", "मल्टिमिटर", "कनेक्टर केबल", "इन्सुलेशन टेप"];
                      markingScheme = [
                        { point: "सही टर्मिनल पहिचान र सिरिज कनेक्सन", marks: 10 },
                        { point: "मल्टिमिटर रिडिङ शुद्धता (२४V भोल्ट)", marks: 10 },
                        { point: "कनेक्सन इन्सुलेशन र सुरक्षा कार्य", marks: 5 }
                      ];
                      simQuiz = {
                        question: "२ वटा १२ भोल्टको सोलार प्यानलबाट २४ भोल्ट प्राप्त गर्न कुन जडान (Connection) गर्नुपर्छ?",
                        options: [
                          "समानान्तर जडान (Parallel Connection) - जसले १२ भोल्ट नै राख्छ तर एम्पियर बढाउँछ",
                          "श्रृङ्खला जडान (Series Connection) - जसले भोल्टेजहरू जोडेर २४ भोल्ट बनाउँछ",
                          "स्टार जडान (Star Connection)"
                        ],
                        correctIdx: 1,
                        tip: "भोल्टेज बढाउन सिरिज (Series) जडान गर्नुपर्छ, जहाँ पोजिटिभ र नेगेटिभ टर्मिनल आपसमा जोडिन्छन्।"
                      };
                    } else { // Generic Sheet 1 Task
                      steps = [
                        "कार्य सम्पादनको लागि आवश्यक सामग्री र उपकरणहरू टेबुलमा संकलन गर्ने।",
                        "सुरक्षात्मक हेल्मेट, चस्मा र पञ्जा (PPE) पहिचान गरी धारण गर्ने।",
                        "दिएको समस्या रेखाचित्र वा सर्किट अनुसार तारहरूको टर्मिनेशन वा फिटिङ गर्ने।",
                        "मल्टिमिटर वा टेष्टर प्रयोग गरी कामको भौतिक सञ्चालन कन्टिन्युटी टेष्ट गर्ने।",
                        "परीक्षकलाई आफ्नो कार्य प्रदर्शन गरी कार्यक्षेत्र सफा गर्ने।"
                      ];
                      materials = ["मल्टिमिटर", "कनेक्टिङ कपर वायर", "हात औजारहरू (pliers, screwdriver)", "PPE सुरक्षा सामग्री"];
                      markingScheme = [
                        { point: "सुरक्षा हेलमेट र पन्जाको प्रयोग (PPE)", marks: 5 },
                        { point: "प्राविधिक विधि अनुसार कार्य सम्पादन", marks: 15 },
                        { point: "उपकरणको अन्तिम संचालन र कन्टिन्युटी", marks: 5 }
                      ];
                      simQuiz = {
                        question: "MDF मा १०० पेयर स्विच बोर्ड केबल टर्मिनेट गर्दा कुन औजार प्रयोग गरी जम्पर वायर पञ्च गरिन्छ?",
                        options: [
                          "RJ-45 क्रिम्पिङ टुल (Crimping Tool)",
                          "क्रोन टुल (Krone Tool)",
                          "तार काट्ने कटर (Side Cutter)"
                        ],
                        correctIdx: 1,
                        tip: "क्रोन टुल (Krone Punch-down Tool) को प्रयोग गरी MDF वा क्याबिनेट ब्लकहरूमा तामाको तारहरूलाई थिचेर र बढी भएको तार काटी जडान गरिन्छ।"
                      };
                    }
                  } else if (practicalActiveSheet === 1) {
                    if (task.id === 4) { // 30 pair splice
                      steps = [
                        "३० जोडी केबलको दुवै मुख ताछेर कपर कन्डक्टर कोरहरू खुला गर्ने।",
                        "केबल कपर जोडीहरूलाई रङ्ग कोड (रङ्ग चक्र) अनुसार ५ मुख्य र ५ सहायक रङ्गको समूहमा वर्गीकरण गर्ने।",
                        "पहिलो जोडी (सेतो-निलो) लाई रंग अनुसार जोडी मिलाई कपर कन्डक्टर बटारेर जोड्ने।",
                        "प्रत्येक जोडमा पेपर वा प्लास्टिक इन्सुलेसन स्लिभ चढाई सर्ट सर्किट हुनबाट जोगाउने।",
                        "सकिएपछि पुरै जोडलाई जोइन्ट क्लोजर बक्समा फिट गरी वाटरप्रूफ बनाउने।"
                      ];
                      materials = ["३० जोडी कपर केबल", "जोइन्ट क्लोजर बक्स", "इन्सुलेशन स्लिभ", "साइड कटर"];
                      markingScheme = [
                        { point: "कपर केबल रङ्ग कोड वर्गीकरण शुद्धता", marks: 15 },
                        { point: "जोडको मजबुती र स्लिभ फिटिङ", marks: 15 },
                        { point: "जोइन्ट क्लोजर सिलिङ र वाटरप्रुफिङ", marks: 10 }
                      ];
                      simQuiz = {
                        question: "तामाको टेलिफोन केबल जोड गर्दा रङ्ग कोड (Color Code) मा पहिलो जोड कुन रङ्गको हुन्छ?",
                        options: [
                          "सेतो र निलो (White / Blue)",
                          "रातो र हरियो (Red / Green)",
                          "पहेंलो र खैरो (Yellow / Brown)"
                        ],
                        correctIdx: 0,
                        tip: "दूरसञ्चार कपर रङ्ग कोड मानक अनुसार पहिलो जोडी सधैं सेतो (White - Tip) र निलो (Blue - Ring) रङ्गको संयोजन हुन्छ।"
                      };
                    } else if (task.id === 6) { // Clamp Meter 3phase
                      steps = [
                        "थ्री-फेस पावर प्यानल वा रेक्टिफायरको स्विच बोर्ड सुरक्षित रूपमा खोल्ने।",
                        "डिजिटल क्ल्याम्प मिटरलाई ON गरी AC Current (A) मापन गर्ने मोडमा सेट गर्ने।",
                        "तीनै वटा फेज तार (R, Y, B) मध्ये एउटा मात्र फेजको केबललाई क्ल्याम्पको बीचमा राख्ने।",
                        "डिस्प्लेमा देखिएको एम्पियर रिडिङ नोट गर्ने र बाँकी दुई फेज पनि क्रमैसँग मापन गर्ने।",
                        "भोल्टेज नाप्न मल्टिमिटरको प्रोबहरू फेज र न्युट्रल (Line-to-Neutral) मा राखेर २३०V AC आएको जाँच्ने।"
                      ];
                      materials = ["डिजिटल क्ल्याम्प मिटर (AC/DC)", "सुरक्षित पञ्जा (Rubber Gloves)", "थ्री-फेस डिष्ट्रिब्युसन बोर्ड"];
                      markingScheme = [
                        { point: "क्ल्याम्प मिटरको सही मोड चयन (AC Current)", marks: 10 },
                        { point: "केबलमा सिंगल-क्ल्याम्प विधिको पालना", marks: 10 },
                        { point: "भोल्टेज र लोड रिडिङ शुद्धता", marks: 10 }
                      ];
                      simQuiz = {
                        question: "क्ल्याम्प मिटर प्रयोग गरी केबलमा बगिरहेको विद्युत करेन्ट नाप्दा के केबल काट्नु वा ताछ्नु पर्छ?",
                        options: [
                          "हो, तामाको नाङ्गो तारमा सिधै जोड्नुपर्छ",
                          "पर्दैन, इन्सुलेशन माथिबाट क्ल्याम्प गर्दा electromagnetic प्रवाह नापेर रिडिङ दिन्छ",
                          "हो, मल्टिमिटर जस्तै सीरीजमा जोड्नुपर्छ"
                        ],
                        correctIdx: 1,
                        tip: "क्ल्याम्प मिटरको मुख्य फाइदा नै केबल नकाटिकन वा लोड डिस्टर्ब नगरी केवल बाहिरैबाट सुरक्षित रूपमा चुम्बकीय प्रभावद्वारा करेन्ट नाप्नु हो।"
                      };
                    } else {
                      steps = [
                        "प्राविधिक स्केच वा रेखाचित्र तयार पारी आवश्यक सामग्रीको नाप र परिमाण लिने।",
                        "सुरक्षात्मक सामग्री लगाएर हात औजारहरूको सही र सुरक्षित प्रयोग गर्ने।",
                        "टर्मिनेसन, जडान वा ओभरहेड केबल क्ल्याम्पिङ प्रक्रिया चरणबद्ध सम्पन्न गर्ने।",
                        "डिजिटल मल्टिमिटर वा टेष्टर प्रयोग गरी कामको प्रभावकारिता परीक्षण गर्ने।",
                        "कामको विवरण कार्यपत्रमा लेखी टेबल वा पोल सफा राख्ने।"
                      ];
                      materials = ["हात औजार सेट", "परीक्षण मिटर", "केबल र तारहरू", "सुरक्षा बेल्ट र हेल्मेट"];
                      markingScheme = [
                        { point: "कामको योजना र रेखाचित्र", marks: 10 },
                        { point: "काम सम्पन्न गर्ने प्राविधिक कला र शुद्धता", marks: 20 },
                        { point: "सुरक्षा र सरसफाई मापदण्ड पालना", marks: 10 }
                      ];
                      simQuiz = {
                        question: "पोलमा चढेर कपर ड्रप वायर वा फाइबर केबल तान्दा सबैभन्दा महत्वपूर्ण सुरक्षा औजार कुन हो?",
                        options: [
                          "हातमा लगाउने कटन पञ्जा",
                          "पूर्ण शरीरको सुरक्षा बेल्ट र लाइफ लाइन रोप (Full Body Harness/Safety Belt)",
                          "सानो लाइन टेष्टर"
                        ],
                        correctIdx: 1,
                        tip: "पोलमा काम गर्दा सुरक्षित बेल्ट (Safety Belt) पोलसँग राम्ररी बाँध्नु अति आवश्यक हुन्छ ताकि खुट्टा चिप्लिँदा वा सन्तुलन गुम्दा खस्नबाट बच्न सकियोस्।"
                      };
                    }
                  } else {
                    // Sheet 3 Generic
                    if (task.id === 6) { // Capacitance Fault distance
                      steps = [
                        "बिग्रिएको वा चुँडिएको तामाको टेलिफोन लाइन पहिचान गर्ने।",
                        "क्यापासिटेन्स मिटरलाई ON गर्ने र मापन रेन्जलाई नानो-फ्याराड (nF) मा सेट गर्ने।",
                        "केबलको एउटा जोडी (A र B तार) मा मिटरको प्रोबहरू सुरक्षित क्लिप गर्ने।",
                        "डिस्प्लेमा प्राप्त भएको कुल क्यापासिटेन्स (Capacitance) रिडिङ रेकर्ड गर्ने।",
                        "प्राप्त मानलाई केबलको प्रति मिटर मान (सामान्यतया ५० nF प्रति किलोमिटर) सँग भाग गरी चुँडिएको दूरी पत्ता लगाउने।",
                        "फल्ट दूरीको स्थानमा गई केबल मर्मत सम्पन्न गर्ने।"
                      ];
                      materials = ["डिजिटल क्यापासिटेन्स मिटर", "बिग्रिएको कपर केबल", "कनेक्टिङ क्लिप"];
                      markingScheme = [
                        { point: "मिटर मोड सेटिङ र कनेक्सन शुद्धता", marks: 15 },
                        { point: "दूरी गणना गर्ने शुत्र र हिसाब", marks: 20 },
                        { point: "फल्ट स्पट पहिचान दक्षता", marks: 15 }
                      ];
                      simQuiz = {
                        question: "क्यापासिटेन्स मिटरले केबल चुँडिएको दूरी पत्ता लगाउँदा केबलको अवस्था कस्तो हुनुपर्दछ?",
                        options: [
                          "केबल दुवै तर्फबाट खुला (Open / Disconnected) हुनुपर्दछ",
                          "केबलको अन्तिम मुख आपसमा सर्ट (Short) हुनुपर्दछ",
                          "केबल एक्सचेन्जमा जोडिएको हुनुपर्दछ"
                        ],
                        correctIdx: 0,
                        tip: "क्यापासिटेन्स नाप्दा दुवै तारहरू अन्तिममा खुला (Open) हुनुपर्छ ताकि मिटरले चुँडिएको विन्दुसम्मको कुल सतह क्षमता मापन गर्न सकोस्।"
                      };
                    } else {
                      steps = [
                        "प्रयोगात्मक परीक्षा निर्देशिका र सामग्रीहरूको सूची रुजु गर्ने।",
                        "सुरक्षा सामग्री पहिचान गरी धारण गर्ने।",
                        "ड्रइङ र प्राविधिक विवरण बमोजिम जडान वा कसिने कार्य गर्ने।",
                        "सम्बन्धित प्राविधिक परीक्षण उपकरण प्रयोग गरी अन्तिम नतिजा नाप्ने।",
                        "परिणाम र मापन मानहरू कार्यपत्रमा स्पष्ट लिपिबद्ध गर्ने।"
                      ];
                      materials = ["डिजिटल मल्टिमिटर", "कपर र फाइबर कटर", "टर्मिनेसन ब्लकहरू", "सुरक्षा गियर"];
                      markingScheme = [
                        { point: "प्रयोगात्मक योजना र ड्रइङ नक्सा", marks: 10 },
                        { point: "काम सम्पन्न गर्ने प्राविधिक कला र शुद्धता", marks: 25 },
                        { point: "सुरक्षात्मक मापदण्ड र सफा कार्यक्षेत्र", marks: 10 }
                      ];
                      simQuiz = {
                        question: "सुरक्षित अर्थिङ बस बार जडान गर्दा अर्थ रेजिस्टेन्स कति ओहम भन्दा कम हुनु उत्कृष्ट मानिन्छ?",
                        options: [
                          "१ ओहम (1 Ohm) भन्दा कम",
                          "१०० ओहम (100 Ohms) भन्दा कम",
                          "१००० ओहम (1000 Ohms) भन्दा कम"
                        ],
                        correctIdx: 0,
                        tip: "दूरसञ्चार र संवेदनशील सर्भर उपकरणहरूको सुरक्षाका लागि १ ओहम भन्दा कम अर्थ रेजिस्टेन्स सबैभन्दा उत्तम र सुरक्षित मानिन्छ।"
                      };
                    }
                  }

                  const quizStateKey = `${practicalActiveSheet}-${task.id}`;
                  const selectedOptIdx = practicalSimAnswers[quizStateKey];
                  const hasAnswered = selectedOptIdx !== undefined;

                  return (
                    <div className="bg-slate-900 border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in">
                      
                      {/* Card Header */}
                      <div className="border-b border-slate-800 pb-4">
                        <span className="text-3xs font-extrabold uppercase font-mono tracking-wider bg-blue-950 text-blue-400 border border-blue-900/60 px-3 py-1 rounded-full">
                          एआई व्यावहारिक मर्मत निर्देशिका
                        </span>
                        <h4 className="text-lg font-extrabold text-white mt-2.5 leading-relaxed">{task.taskNepali}</h4>
                        <div className="flex items-center gap-4 text-2xs text-slate-400 mt-2 font-semibold">
                          <span>कार्य समय: {task.timeMinutes} मिनेट</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">अनुमानित पूर्णाङ्क: २५–३० अङ्क</span>
                        </div>
                      </div>

                      {/* Materials Required */}
                      <div className="space-y-2.5">
                        <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider">आवश्यक मुख्य उपकरण तथा सामग्री:</div>
                        <div className="flex flex-wrap gap-2">
                          {materials.map((mat, idx) => (
                            <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 font-medium">
                              <Wrench className="w-3.5 h-3.5 text-blue-400" />
                              <span>{mat}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Core Walkthrough Steps */}
                      <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-850">
                        <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>चरणबद्ध प्रयोगात्मक विधि (Step-by-Step Procedure):</span>
                        </div>
                        <ol className="space-y-3.5 text-xs">
                          {steps.map((step, idx) => (
                            <li key={idx} className="flex gap-2.5 text-slate-200 leading-relaxed font-medium">
                              <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-900/40 flex items-center justify-center font-bold text-2xs text-blue-400 shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Marking Scheme Points */}
                      <div className="space-y-3">
                        <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>परीक्षकको मूल्याङ्कन विभाजन (Assessment Scheme):</span>
                        </div>
                        <div className="bg-slate-950/40 rounded-2xl border border-slate-850 overflow-hidden divide-y divide-slate-850">
                          {markingScheme.map((item, idx) => (
                            <div key={idx} className="p-3 sm:px-4 flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium">{item.point}</span>
                              <span className="bg-slate-950 border border-slate-800 text-amber-400 font-black px-2.5 py-1 rounded-lg">
                                +{item.marks} अङ्क
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Simulator Step Quiz */}
                      {simQuiz && (
                        <div className="bg-blue-950/20 border border-blue-900/40 rounded-3xl p-5 sm:p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                            <h5 className="font-extrabold text-sm text-blue-300">प्रयोगात्मक सिमुलेशन प्रश्न (Simulation Quiz)</h5>
                          </div>
                          
                          <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                            {simQuiz.question}
                          </p>

                          <div className="grid grid-cols-1 gap-2.5">
                            {simQuiz.options.map((opt, optIdx) => {
                              const isCorrect = optIdx === simQuiz!.correctIdx;
                              const isSelected = selectedOptIdx === optIdx;
                              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900';

                              if (hasAnswered) {
                                if (isCorrect) {
                                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-extrabold';
                                } else if (isSelected) {
                                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                                } else {
                                  btnStyle = 'bg-slate-950 border-slate-900 opacity-40 text-slate-500';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={hasAnswered}
                                  onClick={() => {
                                    setPracticalSimAnswers((prev) => ({
                                      ...prev,
                                      [quizStateKey]: optIdx
                                    }));
                                    if (isCorrect) {
                                      try {
                                        confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
                                      } catch (_) {}
                                    }
                                  }}
                                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${btnStyle}`}
                                >
                                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Simulation Tip Explanation */}
                          {hasAnswered && (
                            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5 animate-fade-in">
                              <div className="font-extrabold flex items-center gap-1.5 text-emerald-400">
                                <ShieldAlert className="w-4 h-4" />
                                <span>महत्वपूर्ण प्राविधिक व्याख्या (Technical Tip):</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-medium">
                                {simQuiz.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })()
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-blue-950/60 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-900/40">
                    <Wrench className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">मर्मत निर्देशिका लोड गर्नुहोस्</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      बायाँ तर्फको सूचीबाट कुनै पनि व्यावहारिक प्रयोगात्मक कार्य (Practical Assignment) मा क्लिक गरेर त्यसको चरणबद्ध निर्देशिका, आवश्यक सामान सूची, मूल्याङ्कन र एआई सिमुलेशन प्रश्न लोड गर्नुहोस्।
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          SUBTAB: TELECOM HANDBOOK & ABBREVIATIONS
          ========================================== */}
      {activeSubTab === 'telecom-handbook' && (
        <div className="space-y-6" id="telecom-handbook-container">
          
          {/* Section Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-2xs font-extrabold text-blue-400 bg-blue-950/75 border border-blue-900/60 px-3 py-1 rounded-full">
                <BookMarked className="w-3.5 h-3.5" />
                <span>डिजिटल अध्ययन निर्देशिका (Study Handbook)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">तह–२ परीक्षा गाइड बुक तथा सङ्क्षिप्त रूप शब्दकोश</h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                आधिकारिक पाठ्यक्रम र विगतका परीक्षामा सोधिएका कपर केबल, अप्टिकल फाइबर, ओएसटी पोलिङ, अर्थिङ र दूरसञ्चार उपकरणका प्रश्नोत्तर तथा शब्दावली।
              </p>
            </div>

            {/* Inner Subtabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0 w-full md:w-auto">
              <button
                onClick={() => { setHandbookActiveTab('qa'); }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  handbookActiveTab === 'qa' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>१४४ प्रश्नोत्तर सङ्ग्रह</span>
              </button>
              <button
                onClick={() => { setHandbookActiveTab('abbrev'); }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  handbookActiveTab === 'abbrev' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>३८ महत्वपूर्ण Full Forms</span>
              </button>
            </div>
          </div>

          {/* 1. Q&A DIRECTORY VIEW */}
          {handbookActiveTab === 'qa' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Search & Category Filter bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="sm:col-span-7 relative flex items-center">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input
                    type="text"
                    placeholder="प्रश्नोत्तर खोज्नुहोस् (जस्तै: पोल, कपर, फाइबर, अर्थिङ)..."
                    value={handbookSearch}
                    onChange={(e) => setHandbookSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                  />
                  {handbookSearch && (
                    <button
                      onClick={() => setHandbookSearch('')}
                      className="text-2xs font-bold text-slate-400 hover:text-slate-200 absolute right-3"
                    >
                      सफा गर्नुहोस्
                    </button>
                  )}
                </div>

                <div className="sm:col-span-5">
                  <select
                    value={selectedHandbookCategory}
                    onChange={(e) => setSelectedHandbookCategory(e.target.value)}
                    className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">सबै विधा (All Guide Categories)</option>
                    <option value="pole">पोलिङ र सिविल संरचना (OSP Poling)</option>
                    <option value="cable">केबल प्रविधि (Cables & OSP)</option>
                    <option value="splicing">स्प्लाइसिङ प्रविधि (Cable Splicing)</option>
                    <option value="earthing">अर्थिङ र सुरक्षा प्रणाली (Earthing & Safety)</option>
                    <option value="equipment">प्राविधिक मापन तथा औजार (Tools & Gear)</option>
                    <option value="network">सञ्चार नेटवर्क विभाजन (Network Architecture)</option>
                    <option value="other">अन्य सामान्य सञ्चार ज्ञान (General Telecom)</option>
                  </select>
                </div>
              </div>

              {/* Handbook Q&A List */}
              {(() => {
                const filtered = (handbookQAState || []).filter((item: any) => {
                  const matchesCategory = selectedHandbookCategory === 'all' || item.category === selectedHandbookCategory;
                  const matchesSearch = !handbookSearch.trim() || 
                    (item.questionNepali || '').toLowerCase().includes(handbookSearch.toLowerCase()) || 
                    (item.answerNepali || '').toLowerCase().includes(handbookSearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                });

                return filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item, idx) => {
                      // Category labels styling helper
                      const catConfig: Record<string, { label: string; style: string }> = {
                        pole: { label: 'OSP पोलिङ', style: 'bg-amber-950/70 text-amber-400 border-amber-900/50' },
                        cable: { label: 'केबल प्रविधि', style: 'bg-blue-950/70 text-blue-400 border-blue-900/50' },
                        splicing: { label: 'जोड/स्प्लाइसिङ', style: 'bg-indigo-950/70 text-indigo-400 border-indigo-900/50' },
                        earthing: { label: 'सुरक्षा र अर्थिङ', style: 'bg-emerald-950/70 text-emerald-400 border-emerald-900/50' },
                        equipment: { label: 'औजार/उपकरण', style: 'bg-rose-950/70 text-rose-400 border-rose-900/50' },
                        network: { label: 'नेटवर्क डिजाइन', style: 'bg-teal-950/70 text-teal-400 border-teal-900/50' },
                        other: { label: 'दूरसञ्चार विधा', style: 'bg-slate-950/70 text-slate-400 border-slate-900/50' }
                      };

                      const currentCat = catConfig[item.category] || catConfig.other;

                      return (
                        <div
                          key={item.id}
                          className="bg-slate-900 border border-slate-805 rounded-2xl p-5 shadow-lg space-y-3.5 hover:border-slate-700 transition-all group flex flex-col justify-between"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-3xs font-black text-slate-300">
                                #{item.id}
                              </span>
                              <span className={`text-3xs font-extrabold border px-2 py-0.5 rounded-full ${currentCat.style}`}>
                                {currentCat.label}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                              {item.questionNepali}
                            </p>

                            {item.imageUrl && (
                              <div
                                onClick={() => setPreviewImage({ url: item.imageUrl!, title: item.questionNepali })}
                                className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/50 p-1 flex items-center justify-center max-h-44 group/img"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.questionNepali}
                                  referrerPolicy="no-referrer"
                                  className="max-h-40 object-contain rounded-lg group-hover/img:scale-102 transition-transform"
                                />
                              </div>
                            )}
                          </div>

                          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs space-y-2 text-slate-300">
                            <div className="flex items-center justify-between text-3xs font-extrabold text-slate-500 uppercase tracking-wider">
                              <span>आधिकारिक उत्तर:</span>
                              <button
                                onClick={() => speakText(item.answerNepali, `उत्तर नम्बर ${item.id}`)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all"
                                title="उत्तर सुन्नुहोस्"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>सुन्नुहोस्</span>
                              </button>
                            </div>
                            <p className="leading-relaxed font-semibold text-slate-200">
                              {item.answerNepali}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    यस विधा वा खोज शब्दमा कुनै निर्देशिका प्रश्न भेटिएन।
                  </div>
                );
              })()}
            </div>
          )}

          {/* 2. ABBREVIATION DICTIONARY VIEW */}
          {handbookActiveTab === 'abbrev' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Search bar */}
              <div className="relative flex items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-7" />
                <input
                  type="text"
                  placeholder="Abbreviations वा नेपाली अर्थ खोज्नुहोस् (जस्तै: ADSL, MDF, FTTH)..."
                  value={abbrevSearch}
                  onChange={(e) => setAbbrevSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                />
                {abbrevSearch && (
                  <button
                    onClick={() => setAbbrevSearch('')}
                    className="text-2xs font-bold text-slate-400 hover:text-slate-200 absolute right-7"
                  >
                    सफा गर्नुहोस्
                  </button>
                )}
              </div>

              {/* Abbreviations Grid */}
              {(() => {
                const filtered = (abbrevState || []).filter((item: any) => {
                  const s = abbrevSearch.toLowerCase().trim();
                  if (!s) return true;
                  return (item.abbreviation || '').toLowerCase().includes(s) || 
                    (item.fullName || '').toLowerCase().includes(s) || 
                    (item.meaningNepali || '').toLowerCase().includes(s);
                });

                return filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((item) => (
                      <div
                        key={item.abbreviation}
                        className="bg-slate-900 border border-slate-805 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-sm font-black text-amber-400 uppercase tracking-wide">
                              {item.abbreviation}
                            </span>
                            <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider">
                              दूरसञ्चार एकाइ
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-300 leading-snug">
                            {item.fullName}
                          </p>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-850 p-3 rounded-xl text-2xs text-slate-400 leading-relaxed font-semibold">
                          <p className="text-slate-200">
                            {item.meaningNepali}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    खोजिएको सङ्क्षिप्त रूप शब्दकोशमा फेला परेन।
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      )}

      {/* ==========================================
          SUBTAB 6: 3-HOUR COMPLETE SIMULATION EXAM
          ========================================== */}
      {activeSubTab === 'mock-exam' && (() => {
        // Dynamic Exam Setup Helpers
        const mockSubjectiveQuestionsToRender = selectedExamSet === '2083-baishakh'
          ? (subjectiveModelExams || [])
          : (subjectiveModelExams || []).slice(0, 5);

        const totalSubjectiveCount = mockSubjectiveQuestionsToRender.length;
        const totalPossibleAnswers = 50 + totalSubjectiveCount;
        const examTotalMarks = selectedExamSet === '2083-baishakh' ? 100 : 75;

        return (
          <div className="max-w-5xl mx-auto space-y-6" id="mock-exam-container">
            
            {/* Dashboard before starting exam */}
            {!isExamRunning && !mockExamSubmitted && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-amber-950/70 border border-amber-850 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-amber-400 animate-spin" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white">CTEVT/NSTB ३ घण्टे आधिकारिक बोर्ड परीक्षा सिमुलेटर</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                    तह-२ दूरसञ्चार प्राविधिक परीक्षाको वास्तविक समय र बोर्ड मापदण्ड अनुरुप तयार गरिएको सिमुलेशन प्रणाली।
                  </p>
                </div>

                {/* Exam Set Selector */}
                <div className="max-w-md mx-auto space-y-3 text-left">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    परीक्षा सेट चयन गर्नुहोस् (Select Exam Paper Set):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedExamSet('2083-baishakh')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedExamSet === '2083-baishakh'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow'
                          : 'bg-slate-950 border-slate-805 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <p className="text-xs font-extrabold">सेट क: २०८३ बैशाख राष्ट्रिय परीक्षा</p>
                      <p className="text-3xs mt-1 text-slate-400">५० वस्तुगत प्रश्न + ११ विषयगत प्रश्न (१०० पूर्णाङ्क)</p>
                    </button>
                    <button
                      onClick={() => setSelectedExamSet('model-set-a')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedExamSet === 'model-set-a'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow'
                          : 'bg-slate-950 border-slate-805 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <p className="text-xs font-extrabold">सेट ख: नियमित नमुना परीक्षा</p>
                      <p className="text-3xs mt-1 text-slate-400">५० वस्तुगत प्रश्न + ५ विषयगत प्रश्न (७५ पूर्णाङ्क)</p>
                    </button>
                  </div>
                </div>

                {/* Rules and standards dynamically rendered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto bg-slate-950 p-5 rounded-2xl border border-slate-805 text-xs text-slate-300">
                  <div className="space-y-1.5">
                    <p className="font-bold text-white">वस्तुगत खण्ड (Objective Part):</p>
                    <p>- कुल प्रश्नहरू: ५० वटा MCQs</p>
                    <p>- कुल पूर्णाङ्क: ५० अङ्क (उत्तीर्णाङ्क: २० अङ्क)</p>
                    <p>- समय सीमा: ३ घण्टा (सामूहिक)</p>
                  </div>
                  <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-850 sm:pl-5 pt-3 sm:pt-0">
                    <p className="font-bold text-white">विषयगत खण्ड (Subjective Part):</p>
                    {selectedExamSet === '2083-baishakh' ? (
                      <>
                        <p>- कुल प्रश्नहरू: ११ वटा छोटो प्रश्न</p>
                        <p>- शर्त: कुनै १० वटाको मात्र उत्तर लेख्नुपर्ने</p>
                        <p>- कुल पूर्णाङ्क: ५० अङ्क (१० x ५ अङ्क)</p>
                      </>
                    ) : (
                      <>
                        <p>- कुल प्रश्नहरू: ५ वटा प्रश्न</p>
                        <p>- कुल पूर्णाङ्क: २५ अङ्क (५ x ५ अङ्क)</p>
                      </>
                    )}
                    <p>- मूल्याङ्कन: जेमिनी एआई र मोडल उत्तर</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={handleStartMockExam}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm sm:text-base transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/15"
                  >
                    वास्तविक परीक्षा सुरु गर्नुहोस् ({examTotalMarks} Marks)
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE RUNNING EXAM ENGINE */}
            {isExamRunning && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Side controls & exam stats */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="space-y-2 border-b border-slate-800 pb-3 text-center">
                    <div className="text-2xs text-slate-400 uppercase font-bold tracking-wider">बाँकी परीक्षा समय</div>
                    <div className="text-3xl font-black font-mono text-amber-400 animate-pulse">
                      {formatTimer(examTimeSeconds)}
                    </div>
                  </div>

                  {/* Question Section Selector */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => { setMockSelectedTab('mcqs'); }}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        mockSelectedTab === 'mcqs' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      वस्तुगत प्रश्न (५०)
                    </button>
                    <button
                      onClick={() => { setMockSelectedTab('subjective'); }}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        mockSelectedTab === 'subjective' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      विषयगत प्रश्न ({totalSubjectiveCount})
                    </button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>MCQs हल: {Object.keys(mockAnswers).length} / ५०</span>
                      <span>विषयगत उत्तर: {Object.keys(mockSubjectiveAnswers).length} / {totalSubjectiveCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all"
                        style={{
                          width: `${
                            ((Object.keys(mockAnswers).length + Object.keys(mockSubjectiveAnswers).length) / totalPossibleAnswers) * 100
                          }%`
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAutoSubmitMockExam}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl text-xs mt-2 transition-all shadow"
                  >
                    परीक्षा बुझाउनुहोस् (Submit Exam)
                  </button>
                </div>

                {/* Exam Content Paper */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  
                  {/* 1. MCQ EXAM SECTION */}
                  {mockSelectedTab === 'mcqs' && (
                    <div className="space-y-8">
                      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">खण्ड १: वस्तुगत बहुवैकल्पिक प्रश्नहरू</span>
                        <span className="text-2xs text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-900">प्रत्येक प्रश्नको १ अङ्क</span>
                      </div>

                      <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
                        {(selectedExamSet === '2083-baishakh' ? mcq2083Exams : modelExams).map((q, idx) => (
                          <div key={q.id} className="space-y-3 p-4 rounded-xl border border-slate-855 bg-slate-950/40">
                            <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-100">
                              {idx + 1}. {q.questionNepali}
                            </p>

                            {q.imageUrl && (
                              <div
                                onClick={() => setPreviewImage({ url: q.imageUrl!, title: q.questionNepali })}
                                className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-48 group/mimg"
                              >
                                <img
                                  src={q.imageUrl}
                                  alt={q.questionNepali}
                                  referrerPolicy="no-referrer"
                                  className="max-h-44 object-contain rounded-lg group-hover/mimg:scale-102 transition-transform"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                                const optText = q.options[optKey];
                                const isSelected = mockAnswers[q.id] === optKey;

                                return (
                                  <button
                                    key={optKey}
                                    onClick={() => {
                                      setMockAnswers((prev) => ({ ...prev, [q.id]: optKey }));
                                    }}
                                    className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-400 text-white font-bold'
                                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-3xs font-extrabold text-slate-300 shrink-0">
                                      {optKey}
                                    </span>
                                    <span className="leading-tight">{optText}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. SUBJECTIVE EXAM SECTION */}
                  {mockSelectedTab === 'subjective' && (
                    <div className="space-y-8">
                      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">खण्ड २: विषयगत छोटो उत्तर प्रश्नहरू</span>
                        <span className="text-2xs text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-900">
                          {selectedExamSet === '2083-baishakh' 
                            ? '११ मध्ये कुनै १० वटाको मात्र उत्तर दिनुहोस् (कुल ५० अङ्क)' 
                            : 'कुल अङ्क: २५ (५ वटा प्रश्न)'
                          }
                        </span>
                      </div>

                      <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
                        {mockSubjectiveQuestionsToRender.map((q, idx) => (
                          <div key={q.id} className="space-y-3 p-4 rounded-xl border border-slate-855 bg-slate-950/40">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-400">प्रश्न नं. {idx + 1} (अङ्क: ५)</span>
                              <span className="text-2xs text-slate-400 capitalize">{q.category}</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-100">
                              {q.questionNepali}
                            </p>

                            {q.imageUrl && (
                              <div
                                onClick={() => setPreviewImage({ url: q.imageUrl!, title: q.questionNepali })}
                                className="cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-black/60 p-1 flex items-center justify-center max-h-48 group/msimg"
                              >
                                <img
                                  src={q.imageUrl}
                                  alt={q.questionNepali}
                                  referrerPolicy="no-referrer"
                                  className="max-h-44 object-contain rounded-lg group-hover/msimg:scale-102 transition-transform"
                                />
                              </div>
                            )}

                            <textarea
                              value={mockSubjectiveAnswers[q.id] || ''}
                              onChange={(e) => {
                                setMockSubjectiveAnswers((prev) => ({ ...prev, [q.id]: e.target.value }));
                              }}
                              rows={5}
                              placeholder="आधिकारिक बोर्ड ढाँचामा उत्तर यहाँ विस्तृत रूपमा लेख्नुहोस्..."
                              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs sm:text-sm text-slate-200 outline-none focus:border-blue-500 font-medium placeholder:text-slate-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* EXAM COMPLETED REPORT CARD */}
            {mockExamSubmitted && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Report Header Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">परीक्षा बुझाउनु सफल भयो!</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      तपाईंको वस्तुगत र विषयगत परीक्षाको पूर्ण रिपोर्ट कार्ड तल तयार गरिएको छ। विषयगत उत्तरहरूलाई जेमिनी एआई स्व-परीक्षकबाट मूल्याङ्कन गराउन सक्नुहुन्छ।
                    </p>
                  </div>

                  {/* Score panels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-805 text-center">
                      <div className="text-2xs text-slate-400 font-bold">वस्तुगत (MCQ) स्कोर</div>
                      <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                        {calculateMockScore()} / ५०
                      </div>
                      <div className="text-3xs text-slate-400 font-bold mt-1">
                        (न्यूनतम उत्तीर्ण अङ्क: २०)
                      </div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-805 text-center flex flex-col justify-center items-center">
                      <div className="text-2xs text-slate-400 font-bold">नतिजा स्थिति</div>
                      <div className={`text-xl font-bold mt-2 px-4 py-1.5 rounded-full ${
                        calculateMockScore() >= 20 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      }`}>
                        {calculateMockScore() >= 20 ? 'उत्तीर्ण (PASS)' : 'अनुत्तीर्ण (FAIL)'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMockExamSubmitted(false);
                      setIsExamRunning(false);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                  >
                    नयाँ परीक्षा सुरु गर्नुहोस्
                  </button>
                </div>

                {/* Review Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3 flex items-center justify-between">
                    <span>विषयगत लिखित उत्तरहरूको एआई मूल्याङ्कन र समीक्षा:</span>
                    <span className="text-3xs bg-slate-950 border border-slate-800 px-3 py-1 rounded text-slate-400 font-bold">
                      {selectedExamSet === '2083-baishakh' ? '१० प्रश्न x ५ = ५० पूर्णाङ्क' : '५ प्रश्न x ५ = २५ पूर्णाङ्क'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {mockSubjectiveQuestionsToRender.map((q, idx) => {
                      const studentAns = mockSubjectiveAnswers[q.id] || '';
                      const evalResult = mockSubjectiveEvaluations[q.id];
                      const isEvaluating = mockEvaluatingAiId === q.id;

                      return (
                        <div key={q.id} className="space-y-4 p-4 rounded-2xl border border-slate-855 bg-slate-950/40">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold text-blue-400">प्रश्न नं. {idx + 1} (अङ्क: ५)</span>
                            {evalResult ? (
                              <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-800 font-bold">
                                एआई स्कोर: {evalResult.score} / ५
                              </span>
                            ) : (
                              <button
                                disabled={isEvaluating || !studentAns.trim()}
                                onClick={() => { handleEvaluateMockSubjective(q.id); }}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-2xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                              >
                                {isEvaluating ? (
                                  <>
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                    <span>जाँच्दै...</span>
                                  </>
                                ) : (
                                  <>
                                    <BrainCircuit className="w-3.5 h-3.5" />
                                    <span>जेमिनी एआईबाट जाँच्नुहोस्</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
                            {q.questionNepali}
                          </p>

                          <div className="text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1.5 text-slate-300">
                            <div className="text-2xs font-bold text-slate-400 uppercase font-mono tracking-wider">तपाईंको उत्तर:</div>
                            <p className="whitespace-pre-line italic">
                              {studentAns ? `"${studentAns}"` : '[खाली / उत्तर नलेखिएको]'}
                            </p>
                          </div>

                          {/* Evaluator Output */}
                          {evalResult && (
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
                              <div className="text-2xs text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>एआई परीक्षक सल्लाह र सुधार सुझावहरू</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                                <div className="space-y-1">
                                  <p className="font-bold text-slate-200">सबल पक्षहरू:</p>
                                  <ul className="list-disc pl-4 text-slate-400">
                                    {evalResult.strengths?.map((pt: string, i: number) => (
                                      <li key={i}>{pt}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-bold text-slate-200">सुधार गर्नुपर्ने बुँदाहरू:</p>
                                  <ul className="list-disc pl-4 text-slate-400">
                                    {evalResult.improvements?.map((pt: string, i: number) => (
                                      <li key={i}>{pt}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-1 border-t border-slate-850 pt-2.5">
                                <p className="font-bold text-blue-400">परीक्षोपयोगी मानक मोडल उत्तर:</p>
                                <p className="text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                                  {evalResult.modelSummary || q.modelAnswerNepali}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        );
      })()}

      </div>

      {/* Full-Screen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-bold text-white truncate max-w-md">{previewImage.title}</h4>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/80 overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
