import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, X, Plus, Edit, Trash2, Save, RefreshCw, CheckCircle2, AlertCircle, Database, BookOpen, Wrench, FileCheck, Radio, Code, MapPin, Sparkles, Eye, EyeOff, Key, RotateCcw, UserCheck, Download, Upload, Printer, Camera, HelpCircle, Volume2, Layers, Zap, Clock, Search, Award, ListOrdered, Newspaper, ArrowDownToLine, Cloud, CloudOff, UploadCloud } from 'lucide-react';
import { coursesList, instituteInfo } from '../data/coursesData';
import { allToolsList } from '../data/toolsData';
import { telecomManualChapters, telecomSymbolsList, ntcImportantNumbers, manualCategories, ManualChapter } from '../data/telecomManualNotes';
import { modelExamLevel2MCQs, modelSubjectiveQuestions, vivaQuestionsList, matchingGroupsList, spottingItemsList } from '../data/examData';
import { level1ManualChapters, level1CourseInfo, telecomKnotsData, level1PracticalSets, level1VivaQuestions } from '../data/level1CourseData';
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
import { defaultInstructorProfile } from '../data/instructorData';
import { baishakh2083MCQs, baishakh2083MatchingGroups, baishakh2083SpottingSheets, baishakh2083Subjectives, baishakh2083VivaSheets, baishakh2083PracticalSheets } from '../data/baishakh2083Data';
import { telecomHandbookQAList, telecomAbbreviationsList } from '../data/telecomQAData';
import { SurveyMap, InstructorProfile } from '../types';
import { GalleryItem, GALLERY_ITEMS } from './MediaGallery';
import { BlogPost, initialBlogPosts } from '../data/blogData';
import { compressAndProcessImage, safeLocalStorageSet } from '../lib/imageCompressor';
import { saveToCloud, syncAllFromCloud, pushAllLocalToCloud } from '../lib/cloudSyncService';
import { ImageUploader } from './ImageUploader';

import { exportAllEnrollmentsPDF, generateEnrollmentPDF, EnrollmentData } from '../lib/pdfGenerator';
import { sha256 } from '../utils/crypto';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import {
  electricianLessons as defaultElectricianLessons,
  electricalSymbolsList as defaultElectricianSymbols,
  practicalCircuitsData as defaultElectricianPracticals,
  wireCapacityTable as defaultElectricianWireTable,
  ElectricianLesson,
  ElectricSymbolItem,
  PracticalCircuit,
  WireCapacityRow
} from '../data/electricianNoteData';
import { ElectricianAdminSection } from './ElectricianAdminSection';
import { Level1FieldSurveyAdmin } from './Level1FieldSurveyAdmin';
import { AdminDownloadableNotesManager } from './AdminDownloadableNotesManager';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Credentials stored in localStorage or default (as SHA-256 hashes for security)
  const [adminUsername, setAdminUsername] = useState(() => localStorage.getItem('nitvt_admin_user') || 'admin');
  const [adminPasswordHash, setAdminPasswordHash] = useState(() => {
    const oldPass = localStorage.getItem('nitvt_admin_pass');
    if (oldPass) {
      const hashed = sha256(oldPass);
      localStorage.setItem('nitvt_admin_pass_hash', hashed);
      localStorage.removeItem('nitvt_admin_pass');
      return hashed;
    }
    return localStorage.getItem('nitvt_admin_pass_hash') || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // Hash of admin123
  });

  // Telecom Note Password state (stored as hash for security)
  const [telecomNotePassHash, setTelecomNotePassHash] = useState(() => {
    const oldPass = localStorage.getItem('nitvt_telecom_note_pass');
    if (oldPass) {
      const hashed = sha256(oldPass);
      localStorage.setItem('nitvt_telecom_note_pass_hash', hashed);
      localStorage.removeItem('nitvt_telecom_note_pass');
      return hashed;
    }
    return localStorage.getItem('nitvt_telecom_note_pass_hash') || '790aa7c7e6c06c3246db24b64dba15e3ec432c124940b8626d4f102d897c421e'; // Hash of telecom123
  });
  const [newTelecomNotePass, setNewTelecomNotePass] = useState('');
  const [showTelecomPass, setShowTelecomPass] = useState(false);
  const [telecomPassSuccess, setTelecomPassSuccess] = useState('');
  const [telecomPassError, setTelecomPassError] = useState('');

  const [activeTab, setActiveTab] = useState<'enrollments' | 'courses' | 'tools' | 'notes' | 'electrician' | 'level1' | 'level2' | 'exams' | 'maps' | 'instructor' | 'institute' | 'gallery' | 'blog' | 'settings'>('enrollments');
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);

  // Electrician Note Editable States
  const [electricianLessonsState, setElectricianLessonsState] = useState<ElectricianLesson[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_lessons');
      return saved ? JSON.parse(saved) : defaultElectricianLessons;
    } catch {
      return defaultElectricianLessons;
    }
  });

  const [electricianSymbolsState, setElectricianSymbolsState] = useState<ElectricSymbolItem[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_symbols');
      return saved ? JSON.parse(saved) : defaultElectricianSymbols;
    } catch {
      return defaultElectricianSymbols;
    }
  });

  const [electricianPracticalsState, setElectricianPracticalsState] = useState<PracticalCircuit[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_practicals');
      return saved ? JSON.parse(saved) : defaultElectricianPracticals;
    } catch {
      return defaultElectricianPracticals;
    }
  });

  const [electricianWireTableState, setElectricianWireTableState] = useState<WireCapacityRow[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_electrician_wire_table');
      return saved ? JSON.parse(saved) : defaultElectricianWireTable;
    } catch {
      return defaultElectricianWireTable;
    }
  });

  const [initialElectricianEditDay, setInitialElectricianEditDay] = useState<number | null>(null);

  // Editable states loaded from localStorage or default data
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_gallery');
      return saved ? JSON.parse(saved) : GALLERY_ITEMS;
    } catch {
      return GALLERY_ITEMS;
    }
  });

  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState<string | null>(null);

  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.some((c: any) => c.id === 'building-vocational-trades')) {
          const vocCourse = coursesList.find((c: any) => c.id === 'building-vocational-trades');
          if (vocCourse) parsed.push(vocCourse);
        }
        return parsed;
      }
      return coursesList;
    } catch {
      return coursesList;
    }
  });

  const [tools, setTools] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_tools');
      return saved ? JSON.parse(saved) : allToolsList;
    } catch {
      return allToolsList;
    }
  });

  const [notes, setNotes] = useState(() => {
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

  const [notesSubTab, setNotesSubTab] = useState<'chapters' | 'downloads' | 'symbols' | 'numbers'>('chapters');
  const [notesCategoryFilter, setNotesCategoryFilter] = useState<string>('all');
  const [notesSearchQuery, setNotesSearchQuery] = useState<string>('');

  const [level1Notes, setLevel1Notes] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_notes');
      return saved ? JSON.parse(saved) : level1ManualChapters;
    } catch {
      return level1ManualChapters;
    }
  });

  const [level1SubTab, setLevel1SubTab] = useState<'manual' | 'info' | 'practicals' | 'viva' | 'knots' | 'field_survey'>('manual');

  const [level1CourseInfoState, setLevel1CourseInfoState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_course_info');
      return saved ? JSON.parse(saved) : level1CourseInfo;
    } catch {
      return level1CourseInfo;
    }
  });

  const [level1PracticalSetsState, setLevel1PracticalSetsState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_practicals');
      return saved ? JSON.parse(saved) : level1PracticalSets;
    } catch {
      return level1PracticalSets;
    }
  });

  const [level1VivaState, setLevel1VivaState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_viva');
      return saved ? JSON.parse(saved) : level1VivaQuestions;
    } catch {
      return level1VivaQuestions;
    }
  });

  const [level1KnotsState, setLevel1KnotsState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level1_knots');
      return saved ? JSON.parse(saved) : telecomKnotsData;
    } catch {
      return telecomKnotsData;
    }
  });

  const [level2Notes, setLevel2Notes] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_notes');
      return saved ? JSON.parse(saved) : level2ManualChapters;
    } catch {
      return level2ManualChapters;
    }
  });

  const [level2SubTab, setLevel2SubTab] = useState<'manual' | 'info' | 'exam' | 'viva' | 'poles' | 'maps'>('manual');
  const [level2ExamSubTab, setLevel2ExamSubTab] = useState<'objective' | 'subjective' | 'matching' | 'spotting' | 'practical'>('objective');
  const [level2VivaFilterCat, setLevel2VivaFilterCat] = useState<string>('ALL');
  const [level2VivaSearch, setLevel2VivaSearch] = useState<string>('');
  const [speakingVivaAdminId, setSpeakingVivaAdminId] = useState<number | null>(null);

  const [level2CourseInfoState, setLevel2CourseInfoState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_course_info');
      return saved ? JSON.parse(saved) : level2CourseInfo;
    } catch {
      return level2CourseInfo;
    }
  });

  const [level2PoleSpecsState, setLevel2PoleSpecsState] = useState<PoleStandardSpec[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_pole_specs');
      return saved ? JSON.parse(saved) : level2PoleSpecs;
    } catch {
      return level2PoleSpecs;
    }
  });

  const [level2ExamPaperState, setLevel2ExamPaperState] = useState<Level2ExamPaper>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_exam_paper');
      return saved ? JSON.parse(saved) : level2ExamPaper2083;
    } catch {
      return level2ExamPaper2083;
    }
  });

  const [level2VivaBankState, setLevel2VivaBankState] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_level2_viva_bank');
      return saved ? JSON.parse(saved) : level2VivaBank;
    } catch {
      return level2VivaBank;
    }
  });

  const [activeExamSubCategory, setActiveExamSubCategory] = useState<'model-mcq' | '2083-mcq' | 'matching' | 'matching-2083' | 'spotting' | 'spotting-2083' | 'subjective' | 'subjective-2083' | 'viva' | 'viva-2083' | 'handbook' | 'abbreviation' | 'practical'>('model-mcq');

  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_exams');
      return saved ? JSON.parse(saved) : modelExamLevel2MCQs;
    } catch {
      return modelExamLevel2MCQs;
    }
  });

  const [exams2083, setExams2083] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_exams_2083');
      return saved ? JSON.parse(saved) : baishakh2083MCQs;
    } catch { return baishakh2083MCQs; }
  });

  const [matchingExams, setMatchingExams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_matching_exams');
      return saved ? JSON.parse(saved) : matchingGroupsList;
    } catch { return matchingGroupsList; }
  });

  const [matching2083Exams, setMatching2083Exams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_matching_2083');
      return saved ? JSON.parse(saved) : baishakh2083MatchingGroups;
    } catch { return baishakh2083MatchingGroups; }
  });

  const [spottingExams, setSpottingExams] = useState(() => {
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

  const [subjectiveExams, setSubjectiveExams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_subjective_exams');
      return saved ? JSON.parse(saved) : modelSubjectiveQuestions;
    } catch { return modelSubjectiveQuestions; }
  });

  const [subjective2083Exams, setSubjective2083Exams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_subjective_2083');
      return saved ? JSON.parse(saved) : baishakh2083Subjectives;
    } catch { return baishakh2083Subjectives; }
  });

  const [vivaExams, setVivaExams] = useState(() => {
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

  const [handbookExams, setHandbookExams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_handbook_qa');
      return saved ? JSON.parse(saved) : telecomHandbookQAList;
    } catch { return telecomHandbookQAList; }
  });

  const [abbrevExams, setAbbrevExams] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_abbreviations');
      return saved ? JSON.parse(saved) : telecomAbbreviationsList;
    } catch { return telecomAbbreviationsList; }
  });

  const [practicalExams, setPracticalExams] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nitvt_practical_sheets');
      return saved ? JSON.parse(saved) : baishakh2083PracticalSheets;
    } catch { return baishakh2083PracticalSheets; }
  });

  const [surveyMaps, setSurveyMaps] = useState<SurveyMap[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_survey_maps');
      return saved ? JSON.parse(saved) : defaultSurveyMaps;
    } catch {
      return defaultSurveyMaps;
    }
  });

  const [instInfo, setInstInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('nitvt_institute_info');
      return saved ? JSON.parse(saved) : instituteInfo;
    } catch {
      return instituteInfo;
    }
  });

  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile>(() => {
    try {
      const saved = localStorage.getItem('nitvt_instructor_profile');
      return saved ? JSON.parse(saved) : defaultInstructorProfile;
    } catch {
      return defaultInstructorProfile;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_blog_posts');
      return saved ? JSON.parse(saved) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  });

  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleConfirmDeleteBlog = (id: string, title: string) => {
    const updated = blogPosts.filter((b: any) => String(b.id) !== String(id));
    setBlogPosts(updated);
    localStorage.setItem('nitvt_blog_posts', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nitvt_blog_posts_updated'));
    window.dispatchEvent(new Event('storage'));
    setBlogToDelete(null);
    if (editModalOpen && editingItem && String(editingItem.id) === String(id)) {
      setEditModalOpen(false);
    }
    setSuccessMessage(`ब्लग लेख "${title}" सफलतापूर्वक हटाइयो!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Keep blogPosts state updated with LocalStorage
  useEffect(() => {
    const syncBlogPosts = () => {
      try {
        const saved = localStorage.getItem('nitvt_blog_posts');
        if (saved !== null) {
          setBlogPosts(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing blog posts in AdminModal:', err);
      }
    };

    if (isOpen) {
      syncBlogPosts();
    }

    window.addEventListener('nitvt_blog_posts_updated', syncBlogPosts);
    window.addEventListener('storage', syncBlogPosts);
    return () => {
      window.removeEventListener('nitvt_blog_posts_updated', syncBlogPosts);
      window.removeEventListener('storage', syncBlogPosts);
    };
  }, [isOpen]);

  const [successMessage, setSuccessMessage] = useState('');

  // Fetch database enrollments from backend API
  const fetchEnrollments = async () => {
    setIsLoadingEnrollments(true);
    try {
      const res = await fetch('/api/enrollments');
      const data = await res.json();
      if (data.success && Array.isArray(data.enrollments)) {
        setEnrollments(data.enrollments);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn || isOpen) {
      fetchEnrollments();
    }
  }, [isAdminLoggedIn, isOpen]);

  const handleDeleteEnrollment = async (id: string) => {
    try {
      const res = await fetch(`/api/enrollments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`आवेदन (${id}) डाटाबेसबाट हटाइयो!`);
        fetchEnrollments();
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit / Add modal states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editingJsonText, setEditingJsonText] = useState('');
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  // Password change state
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentialSuccess, setCredentialSuccess] = useState('');
  const [credentialError, setCredentialError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === adminUsername && sha256(passwordInput) === adminPasswordHash) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setNewUsername(adminUsername);
    } else {
      setLoginError('गलत प्रयोगकर्ता नाम वा पासवर्ड! (Invalid Username or Password)');
    }
  };

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncStatusText, setCloudSyncStatusText] = useState('');

  const handleSaveAll = async () => {
    setIsCloudSyncing(true);
    setCloudSyncStatusText('क्लाउडमा सेभ हुँदैछ...');
    try {
      // Save all local states and push to Firestore Cloud Database simultaneously
      await Promise.all([
        saveToCloud('nitvt_courses', courses),
        saveToCloud('nitvt_tools', tools),
        saveToCloud('nitvt_notes', notes),
        saveToCloud('nitvt_symbols', symbols),
        saveToCloud('nitvt_ntc_numbers', ntcNumbers),
        saveToCloud('nitvt_level1_notes', level1Notes),
        saveToCloud('nitvt_level1_course_info', level1CourseInfoState),
        saveToCloud('nitvt_level1_practicals', level1PracticalSetsState),
        saveToCloud('nitvt_level1_viva', level1VivaState),
        saveToCloud('nitvt_level1_knots', level1KnotsState),
        saveToCloud('nitvt_level2_notes', level2Notes),
        saveToCloud('nitvt_level2_course_info', level2CourseInfoState),
        saveToCloud('nitvt_level2_pole_specs', level2PoleSpecsState),
        saveToCloud('nitvt_level2_exam_paper', level2ExamPaperState),
        saveToCloud('nitvt_level2_viva_bank', level2VivaBankState),
        saveToCloud('nitvt_exams', exams),
        saveToCloud('nitvt_exams_2083', exams2083),
        saveToCloud('nitvt_matching_exams', matchingExams),
        saveToCloud('nitvt_matching_2083', matching2083Exams),
        saveToCloud('nitvt_subjective_exams', subjectiveExams),
        saveToCloud('nitvt_subjective_2083', subjective2083Exams),
        saveToCloud('nitvt_viva_exams', vivaExams),
        saveToCloud('nitvt_viva_2083', viva2083Exams),
        saveToCloud('nitvt_handbook_qa', handbookExams),
        saveToCloud('nitvt_abbreviations', abbrevExams),
        saveToCloud('nitvt_practical_sheets', practicalExams),
        saveToCloud('nitvt_survey_maps', surveyMaps),
        saveToCloud('nitvt_institute_info', instInfo),
        saveToCloud('nitvt_instructor_profile', instructorProfile),
        saveToCloud('nitvt_gallery', gallery),
        saveToCloud('nitvt_blog_posts', blogPosts),
        saveToCloud('nitvt_electrician_lessons', electricianLessonsState),
        saveToCloud('nitvt_electrician_symbols', electricianSymbolsState),
        saveToCloud('nitvt_electrician_practicals', electricianPracticalsState),
        saveToCloud('nitvt_electrician_wire_table', electricianWireTableState),
      ]);

      setSuccessMessage('सबै कोर्स, नोट, इलेक्ट्रिसियन पाठ, ग्यालरी, परीक्षा प्रश्न र डाटा क्लाउड (Cloud Database) मा सफलतापूर्वक सेभ गरियो! अब जुनसुकै मोबाइल वा कम्प्युटरमा तुरुन्तै देखिनेछ।');
      setCloudSyncStatusText('क्लाउडमा सुरक्षित!');
      setTimeout(() => {
        setSuccessMessage('');
        setCloudSyncStatusText('');
      }, 5000);
    } catch (err: any) {
      console.error('Error saving data to cloud/local:', err);
      alert('डेटा सेभ गर्दा समस्या आयो: ' + (err.message || 'Unknown error'));
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleManualCloudPull = async () => {
    setIsCloudSyncing(true);
    setCloudSyncStatusText('क्लाउडबाट नयाँ डेटा ल्याउँदैछ...');
    try {
      const res = await syncAllFromCloud();
      setSuccessMessage(`क्लाउडबाट डाटा सफलतापूर्वक सिङ्क भयो (${res.count} वस्तुहरू अद्यावधिक भए)।`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e: any) {
      alert('क्लाउड सिङ्क असफल: ' + e.message);
    } finally {
      setIsCloudSyncing(false);
      setCloudSyncStatusText('');
    }
  };


  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialError('');
    setCredentialSuccess('');

    if (!newUsername.trim()) {
      setCredentialError('कृपया प्रयोगकर्ता नाम (Username) प्रविष्ट गर्नुहोस्।');
      return;
    }
    if (!newPassword) {
      setCredentialError('कृपया नयाँ पासवर्ड (New Password) राख्नुहोस्।');
      return;
    }
    if (newPassword.length < 4) {
      setCredentialError('पासवर्ड कम्तिमा ४ अक्षरको हुनुपर्छ।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredentialError('नयाँ पासवर्ड र पुष्टि गरिएको पासवर्ड मिलेन! ध्यानपूर्वक पुनः टाइप गर्नुहोस्।');
      return;
    }

    localStorage.setItem('nitvt_admin_user', newUsername.trim());
    localStorage.setItem('nitvt_admin_pass_hash', sha256(newPassword));
    localStorage.removeItem('nitvt_admin_pass');
    setAdminUsername(newUsername.trim());
    setAdminPasswordHash(sha256(newPassword));

    setCredentialSuccess('पासवर्ड र युजरनेम सफलतापूर्वक परिवर्तन भयो!');
    setSuccessMessage('एडमिन लगइन क्रेडिसियल (Username & Password) सफलतापूर्वक अद्यावधिक गरियो!');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setCredentialSuccess('');
      setSuccessMessage('');
    }, 5000);
  };

  const handleResetDefaultCredentials = () => {
    if (window.confirm('के तपाईं लगइन क्रेडिसियल पूर्वनिर्धारित (admin / admin123) मा रिसेट गर्न चाहनुहुन्छ?')) {
      localStorage.setItem('nitvt_admin_user', 'admin');
      localStorage.setItem('nitvt_admin_pass_hash', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
      localStorage.removeItem('nitvt_admin_pass');
      setAdminUsername('admin');
      setAdminPasswordHash('240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
      setNewUsername('admin');
      setNewPassword('');
      setConfirmPassword('');
      setCredentialSuccess('क्रेडिसियल रिसेट भयो!');
      setTimeout(() => setCredentialSuccess(''), 5000);
    }
  };

  const handleUpdateTelecomNotePass = (e: React.FormEvent) => {
    e.preventDefault();
    setTelecomPassError('');
    setTelecomPassSuccess('');

    if (!newTelecomNotePass.trim()) {
      setTelecomPassError('कृपया नयाँ टेलीकम नोट पासवर्ड प्रविष्ट गर्नुहोस्।');
      return;
    }
    if (newTelecomNotePass.trim().length < 3) {
      setTelecomPassError('पासवर्ड कम्तिमा ३ अक्षरको हुनुपर्छ।');
      return;
    }

    localStorage.setItem('nitvt_telecom_note_pass_hash', sha256(newTelecomNotePass.trim()));
    localStorage.removeItem('nitvt_telecom_note_pass');
    setTelecomNotePassHash(sha256(newTelecomNotePass.trim()));
    setTelecomPassSuccess('टेलीकम नोट (Telecom Note) को पासवर्ड सफलतापूर्वक परिवर्तन गरियो!');
    setNewTelecomNotePass('');
    window.dispatchEvent(new Event('telecom_note_pass_changed'));

    setTimeout(() => {
      setTelecomPassSuccess('');
    }, 5000);
  };

  // Handle custom external event to open admin modal directly to specific tab or note item
  useEffect(() => {
    const handleOpenAdminEvent = (e: any) => {
      const detail = e.detail;
      if (detail) {
        setIsAdminLoggedIn(true);
        if (detail.tab) {
          setActiveTab(detail.tab);
        }
        if (detail.tab === 'electrician' || detail.targetTab === 'electrician') {
          setActiveTab('electrician');
          if (detail.editElectricianDay !== undefined) {
            setInitialElectricianEditDay(detail.editElectricianDay);
          }
        }
        if (detail.subTab) {
          if (detail.tab === 'notes') {
            setNotesSubTab(detail.subTab);
          } else if (detail.tab === 'level2') {
            setLevel2SubTab(detail.subTab);
          }
        }
        if (detail.editNoteId) {
          const target = notes.find((n: any) => n.id === detail.editNoteId);
          if (target) {
            setEditingItem({ ...target });
            setEditingJsonText(JSON.stringify(target, null, 2));
            setIsJsonMode(false);
            setModalType('note');
            setEditModalOpen(true);
          }
        } else if (detail.isNewNote) {
          const newItem = {
            id: Date.now(),
            chapterNumber: `खण्ड ${notes.length + 1}`,
            titleNepali: '',
            titleEnglish: '',
            category: 'osp_telecom',
            pageRef: `म्यानुअल पृष्ठ: ${notes.length + 1}`,
            summaryNepali: '',
            keyPoints: [''],
            contentNepali: '',
            examHighlights: [''],
            formulaList: [],
            vivaQuestions: [],
            diagrams: []
          };
          setEditingItem(newItem);
          setEditingJsonText(JSON.stringify(newItem, null, 2));
          setIsJsonMode(false);
          setModalType('note');
          setEditModalOpen(true);
        } else if (detail.editBlogId) {
          const target = blogPosts.find((b: any) => b.id === detail.editBlogId);
          if (target) {
            setEditingItem({ ...target });
            setEditingJsonText(JSON.stringify(target, null, 2));
            setIsJsonMode(false);
            setModalType('blog');
            setEditModalOpen(true);
          }
        } else if (detail.isNewBlog) {
          const newBlog: BlogPost = {
            id: `blog-${Date.now()}`,
            titleNepali: '',
            titleEnglish: '',
            category: 'optical_fiber',
            categoryLabel: 'अप्टिकल फाइबर (Optical Fiber)',
            author: 'सुरेन्द्र ऐर (Surendra Air)',
            authorRole: 'मुख्य प्रशिक्षक तथा टेलिकम विज्ञ',
            date: new Date().toLocaleDateString('ne-NP'),
            readTime: '५ मिनेट',
            imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
            summaryNepali: '',
            contentNepali: '',
            tags: ['Telecom', 'NITVT'],
            views: 1,
            likes: 0
          };
          setEditingItem(newBlog);
          setEditingJsonText(JSON.stringify(newBlog, null, 2));
          setIsJsonMode(false);
          setModalType('blog');
          setEditModalOpen(true);
        }
      }
    };
    window.addEventListener('open_admin_modal', handleOpenAdminEvent);
    return () => window.removeEventListener('open_admin_modal', handleOpenAdminEvent);
  }, [notes, blogPosts]);

  // Close modals on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editModalOpen) {
          setEditModalOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editModalOpen, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={() => {
        if (!editModalOpen) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                एनआईटीभीटि एडमिन तथा डाटाबेस म्यानेजर (Full Database Editor)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                सबै डेटा जस्ताको तस्तै (Raw JSON वा Form मार्फत) सम्पादन तथा व्यवस्थापन
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-300 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60 shadow-sm"
              title="एडमिन बन्द गर्नुहोस् (Close - ESC)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">बन्द गर्नुहोस् (Close)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto">

        {/* Not Logged In View */}
        {!isAdminLoggedIn ? (
          <div className="p-6 sm:p-8 max-w-md mx-auto my-8 bg-slate-950/60 border border-slate-800 rounded-2xl shadow-xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">एडमिन लगइन (Admin Login)</h3>
              <p className="text-xs text-slate-400">
                डेटाबेस सम्पादन गर्न प्रयोगकर्ता नाम र पासवर्ड प्रविष्ट गर्नुहोस्।
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">प्रयोगकर्ता नाम (Username)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">पासवर्ड (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showLoginPassword ? "पासवर्ड लुकाउनुहोस्" : "पासवर्ड हेर्नुहोस्"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>रद्द (Close)</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>लगइन गर्नुहोस् (Login)</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Logged In Admin Dashboard */
          <div className="p-4 sm:p-6 space-y-5">
            {successMessage && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'enrollments' ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>भर्ना डेटाबेस ({enrollments.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'courses' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>कोर्सहरू ({courses.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'tools' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>औजारहरू ({tools.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'notes' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>म्यानुअल नोट ({notes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('electrician')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'electrician' ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50 font-extrabold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>इलेक्ट्रिसियन नोट ({electricianLessonsState.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('level1')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'level1' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>तह-१ नोट ({level1Notes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('level2')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'level2' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>तह-२ नोट ({level2Notes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('exams')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'exams' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>परीक्षा प्रश्नहरू ({exams.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('maps')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'maps' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>नक्सा तथा रेखाचित्र ({surveyMaps.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'instructor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>मेरो बारेमा (Instructor)</span>
                </button>
                 <button
                  onClick={() => setActiveTab('institute')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'institute' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>संस्था विवरण (Institute Info)</span>
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'gallery' ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>ग्यालरी ({gallery.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'blog' ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-amber-400" />
                  <span>ब्लग तथा समाचार ({blogPosts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>लगइन सेटिङ्स</span>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={async () => {
                    setIsCloudSyncing(true);
                    try {
                      await syncAllFromCloud();
                      setSuccessMessage('क्लाउडबाट सबै नयाँ डाटा सफलतापूर्वक सिङ्क भयो!');
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsCloudSyncing(false);
                    }
                  }}
                  disabled={isCloudSyncing}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-cyan-500/30 active:scale-95 disabled:opacity-50"
                  title="क्लाउडबाट नयाँ डाटा तान्नुहोस् (Sync from Cloud)"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isCloudSyncing ? 'सिङ्क हुँदैछ...' : 'क्लाउड सिङ्क'}</span>
                </button>

                <button
                  onClick={handleSaveAll}
                  disabled={isCloudSyncing}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCloudSyncing ? 'क्लाउडमा सेभ हुँदैछ...' : 'सबै सेभ गर्नुहोस्'}</span>
                </button>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2 rounded-xl text-xs"
                >
                  लगआउट
                </button>
              </div>

            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              {/* ENROLLMENTS DATABASE TAB */}
              {activeTab === 'enrollments' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-amber-400" />
                          <span>अनलाइन सिट बुकिङ तथा भर्ना डाटाबेस (Real-time Enrollments DB)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          वेबसाइट मार्फत दर्ता भएका सम्पूर्ण विद्यार्थीहरूको विवरण यहाँ सुरक्षित भई सेभ भएको छ।
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => exportAllEnrollmentsPDF(enrollments)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                          title="सबै भर्ना रेकर्डहरू PDF फाइलमा डाउनलोड गर्नुहोस्"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>सम्पूर्ण भर्ना डेटाबेस PDF डाउनलोड (Export All PDF)</span>
                        </button>

                        <button
                          onClick={fetchEnrollments}
                          disabled={isLoadingEnrollments}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingEnrollments ? 'animate-spin' : ''}`} />
                          <span>रिप्रेश (Refresh)</span>
                        </button>
                      </div>
                    </div>

                    {/* Stats summary banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400">कुल दर्ता आवेदनहरू</span>
                          <div className="text-lg font-bold text-white font-mono">{enrollments.length} जना</div>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          DB
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400">कुल बुक भएका सिटहरू</span>
                          <div className="text-lg font-bold text-amber-400 font-mono">{Math.min(45, enrollments.length + 25)} / ४५</div>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          SEATS
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400">बाँकी उपलब्ध सिट</span>
                          <div className="text-lg font-bold text-emerald-400 font-mono">{Math.max(0, 45 - (enrollments.length + 25))} सिट</div>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          FREE
                        </div>
                      </div>
                    </div>

                    {/* Enrollments Data Table */}
                    {enrollments.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        हालसम्म कुनै भर्ना फारम भरिएको छैन।
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-900/90 text-slate-200 border-b border-slate-800 uppercase font-bold text-[11px]">
                            <tr>
                              <th className="p-3 text-center">S.N.</th>
                              <th className="p-3">दर्ता कोड (Token)</th>
                              <th className="p-3">सिट नं</th>
                              <th className="p-3">प्रशिक्षार्थीको नाम</th>
                              <th className="p-3">सम्पर्क / इमेल</th>
                              <th className="p-3">छनोट गरिएको कोर्स</th>
                              <th className="p-3">ब्याज / समय</th>
                              <th className="p-3">मिति</th>
                              <th className="p-3 text-center">PDF र कार्यहरू</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-sans">
                            {enrollments.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                                <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">{item.id}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                                    {item.seatNumber || `SEAT-${idx + 1}`}
                                  </span>
                                </td>
                                <td className="p-3 font-bold text-white whitespace-nowrap">{item.fullName}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="font-semibold text-emerald-400">{item.phone}</div>
                                  <div className="text-[11px] text-slate-400">{item.email}</div>
                                </td>
                                <td className="p-3 max-w-[200px] truncate text-slate-200">{item.course}</td>
                                <td className="p-3 whitespace-nowrap text-slate-300 text-[11px]">{item.batch}</td>
                                <td className="p-3 whitespace-nowrap text-slate-400 text-[11px] font-mono">{item.createdAt}</td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => generateEnrollmentPDF(item)}
                                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                                      title="यो विद्यार्थीको व्यक्तिगत PDF रसिद डाउनलोड गर्नुहोस्"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>PDF रसिद</span>
                                    </button>

                                    {deletingEnrollmentId === item.id ? (
                                      <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-lg">
                                        <span className="text-[10px] text-rose-300 font-bold">मेटाउने?</span>
                                        <button
                                          onClick={() => {
                                            handleDeleteEnrollment(item.id);
                                            setDeletingEnrollmentId(null);
                                          }}
                                          className="bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded"
                                        >
                                          हो
                                        </button>
                                        <button
                                          onClick={() => setDeletingEnrollmentId(null)}
                                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded"
                                        >
                                          नाई
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setDeletingEnrollmentId(item.id)}
                                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 p-1.5 rounded-lg transition-colors"
                                        title="रेकर्ड मेटाउनुहोस्"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COURSES TAB */}
              {activeTab === 'courses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">तालिम कोर्सहरू व्यवस्थापन (Courses Management)</h3>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: 'course-' + Date.now(),
                          titleNepali: 'नयाँ कोर्स',
                          titleEnglish: 'New Course',
                          level: 'CTEVT तह-१',
                          duration: '३ महिना',
                          practicalPercentage: 80,
                          badge: 'नयाँ',
                          description: 'कोर्स विवरण यहाँ लेख्नुहोस्...',
                          features: ['फ्युजन स्प्लाइसिङ', 'ओटिडिआर टेस्टिङ'],
                          targetAudience: ['विद्यार्थी'],
                          jobProspects: ['प्रविधिक']
                        };
                        setEditingItem(newItem);
                        setEditingJsonText(JSON.stringify(newItem, null, 2));
                        setIsJsonMode(false);
                        setModalType('course');
                        setEditModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ कोर्स थप्नुहोस्</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {courses.map((course: any, idx: number) => (
                      <div key={course.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                              {course.level}
                            </span>
                            <span className="text-[10px] text-slate-400">{course.duration}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{course.titleNepali}</h4>
                          <p className="text-xs text-slate-300 line-clamp-2">{course.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[11px] text-emerald-400 font-medium">प्रयोगात्मक: {course.practicalPercentage}%</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingItem({ ...course });
                                setEditingJsonText(JSON.stringify(course, null, 2));
                                setIsJsonMode(false);
                                setModalType('course');
                                setEditModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> सम्पादन (Edit)
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('के तपाईं यो कोर्स हटाउन चाहनुहुन्छ?')) {
                                  const updated = courses.filter((c: any, i: number) => c.id ? c.id !== course.id : i !== idx);
                                  setCourses(updated);
                                  localStorage.setItem('nitvt_courses', JSON.stringify(updated));
                                  window.dispatchEvent(new CustomEvent('nitvt_courses_updated'));
                                  window.dispatchEvent(new Event('storage'));
                                  setSuccessMessage('कोर्स सफलतापुर्वक हटाइयो!');
                                  setTimeout(() => setSuccessMessage(''), 3000);
                                }
                              }}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                              title="कोर्स हटाउनुहोस्"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOLS TAB */}
              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-emerald-400" />
                      <span>९०+ टेलिकम औजारहरू व्यवस्थापन (Tools Catalog)</span>
                    </h3>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: 'tool-' + Date.now(),
                          nepaliName: 'नयाँ औजार',
                          englishName: 'New Technical Tool',
                          name: 'नयाँ औजार',
                          category: 'optical-fiber',
                          description: 'औजारको विस्तृत विवरण...',
                          usagePlace: 'प्रयोग हुने ठाउँ...',
                          keyExamFact: 'परीक्षाका लागि मुख्य जानकारी...',
                          imageUrl: ''
                        };
                        setEditingItem(newItem);
                        setEditingJsonText(JSON.stringify(newItem, null, 2));
                        setIsJsonMode(false);
                        setModalType('tool');
                        setEditModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ औजार थप्नुहोस्</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {tools.map((tool: any, idx: number) => {
                      const nepName = tool.nepaliName || tool.nameNepali || tool.name || `औजार #${idx + 1}`;
                      const engName = tool.englishName || tool.nameEnglish || '';
                      const imgUrl = tool.imageUrl || tool.image || tool.photoUrl || tool.photo || '';
                      const descText = tool.description || tool.nepaliDesc || tool.keyExamFact || '';

                      return (
                        <div key={tool.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between">
                          <div className="space-y-2">
                            {/* Tool Photo / Image */}
                            {imgUrl ? (
                              <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative group p-1 flex items-center justify-center">
                                <img
                                  src={imgUrl}
                                  alt={engName || nepName}
                                  className="max-h-full max-w-full object-contain rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-1.5 left-1.5">
                                  <span className="bg-slate-950/80 text-emerald-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                                    #{tool.id || idx + 1}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-20 bg-slate-900/80 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center p-2 text-slate-500 relative">
                                <Wrench className="w-6 h-6 text-slate-600 mb-1" />
                                <span className="text-[9px] text-slate-500 font-medium">तस्बिर राखिएको छैन (No Image)</span>
                                <div className="absolute top-1.5 left-1.5">
                                  <span className="bg-slate-950/80 text-emerald-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                                    #{tool.id || idx + 1}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Category & Name */}
                            <div className="space-y-1">
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase inline-block">
                                {tool.category || 'Tool'}
                              </span>
                              <h4 className="text-xs font-bold text-white leading-snug">{nepName}</h4>
                              {engName && (
                                <p className="text-[10px] text-slate-400 font-sans">{engName}</p>
                              )}
                              {descText && (
                                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{descText}</p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingItem({ ...tool });
                                setEditingJsonText(JSON.stringify(tool, null, 2));
                                setIsJsonMode(false);
                                setModalType('tool');
                                setEditModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> सम्पादन
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('के तपाईं यो औजार हटाउन चाहनुहुन्छ?')) {
                                  const updated = tools.filter((t: any, i: number) => t.id ? t.id !== tool.id : i !== idx);
                                  setTools(updated);
                                  localStorage.setItem('nitvt_tools', JSON.stringify(updated));
                                  window.dispatchEvent(new CustomEvent('nitvt_tools_updated'));
                                  window.dispatchEvent(new Event('storage'));
                                  setSuccessMessage('औजार सफलतापुर्वक हटाइयो!');
                                  setTimeout(() => setSuccessMessage(''), 3000);
                                }
                              }}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                              title="औजार हटाउनुहोस्"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Notes Header & Sub-tabs */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-amber-400" />
                        <span>टेलिकम, अप्टिकल फाइबर तथा इलेक्ट्रिकल इन्जिनियरिङ म्यानुअल</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        म्यानुअलका सबै अध्याय, प्राविधिक संकेत र NTC सर्टकोडहरू सिधै सम्पादन र व्यवस्थापन गर्नुहोस्
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setNotesSubTab('chapters')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesSubTab === 'chapters'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>म्यानुअल खण्डहरू ({notes.length})</span>
                      </button>
                      <button
                        onClick={() => setNotesSubTab('downloads')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesSubTab === 'downloads'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow font-black'
                            : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
                        }`}
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>डाउनलोड योग्य नोटहरू (PDF/JPG)</span>
                      </button>
                      <button
                        onClick={() => setNotesSubTab('symbols')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesSubTab === 'symbols'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>संकेतहरू ({symbols.length})</span>
                      </button>
                      <button
                        onClick={() => setNotesSubTab('numbers')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          notesSubTab === 'numbers'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>NTC सर्टकोड ({ntcNumbers.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* SUBTAB 1: CHAPTERS */}
                  {notesSubTab === 'chapters' && (
                    <div className="space-y-3">
                      {/* Chapter Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        {/* Search and Category Filter */}
                        <div className="flex flex-wrap items-center gap-2 flex-1">
                          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="खण्ड, शीर्षक वा पृष्ठ खोज्नुहोस्..."
                              value={notesSearchQuery}
                              onChange={(e) => setNotesSearchQuery(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                            {notesSearchQuery && (
                              <button
                                onClick={() => setNotesSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <select
                            value={notesCategoryFilter}
                            onChange={(e) => setNotesCategoryFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-medium focus:outline-none"
                          >
                            <option value="all">सबै विषयगत श्रेणीहरू (All Categories)</option>
                            <option value="osp_telecom">OSP तथा टेलिफोन नेटवर्क</option>
                            <option value="optical_fiber">अप्टिकल फाइबर र FTTH</option>
                            <option value="wireless_satellite">मोबाइल, रेडियो र स्याटेलाइट</option>
                            <option value="networking">कम्प्युटर नेटवर्किङ र IP</option>
                            <option value="electrical">विद्युत, ब्याट्री र अर्थिङ</option>
                            <option value="electronics">इलेक्ट्रोनिक्स र लजिक गेट्स</option>
                            <option value="safety_tools">सुरक्षा, औजार र A/C</option>
                            <option value="ntc_standards">NTC मापदण्ड र प्रयोगात्मक</option>
                          </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => {
                              const newItem: ManualChapter = {
                                id: Date.now(),
                                chapterNumber: `खण्ड ${notes.length + 1}`,
                                titleNepali: 'नयाँ म्यानुअल खण्ड शीर्षक',
                                titleEnglish: 'New Manual Chapter Title',
                                category: (notesCategoryFilter !== 'all' ? notesCategoryFilter : 'osp_telecom') as any,
                                pageRef: `म्यानुअल पृष्ठ: ${notes.length + 1}`,
                                summaryNepali: 'यो खण्डको संक्षिप्त प्राविधिक सारसंक्षेप यहाँ लेख्नुहोस्...',
                                keyPoints: ['महत्वपूर्ण प्राविधिक बुँदा १', 'महत्वपूर्ण प्राविधिक बुँदा २'],
                                contentNepali: '### १. नयाँ खण्डको विस्तृत विवरण\nयहाँ प्राविधिक नोट लेख्नुहोस्...',
                                examHighlights: ['परीक्षा सम्भावित प्रश्न वा उत्तर १'],
                                formulaList: [],
                                vivaQuestions: [],
                                diagrams: []
                              };
                              setEditingItem(newItem);
                              setEditingJsonText(JSON.stringify(newItem, null, 2));
                              setIsJsonMode(false);
                              setModalType('note');
                              setEditModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>नयाँ खण्ड थप्नुहोस्</span>
                          </button>

                          {/* Export JSON */}
                          <button
                            onClick={() => {
                              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
                              const downloadAnchor = document.createElement('a');
                              downloadAnchor.setAttribute("href", dataStr);
                              downloadAnchor.setAttribute("download", `nitvt_telecom_manual_chapters_${Date.now()}.json`);
                              document.body.appendChild(downloadAnchor);
                              downloadAnchor.click();
                              downloadAnchor.remove();
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-slate-700"
                            title="सबै खण्डहरू JSON ब्याकअपको रूपमा डाउनलोड गर्नुहोस्"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>JSON Export</span>
                          </button>

                          {/* Import JSON */}
                          <label
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-slate-700 cursor-pointer"
                            title="JSON फाइलबाट खण्डहरू आयात गर्नुहोस्"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>JSON Import</span>
                            <input
                              type="file"
                              accept=".json"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    try {
                                      const parsed = JSON.parse(event.target?.result as string);
                                      if (Array.isArray(parsed) && parsed.length > 0) {
                                        if (confirm(`के तपाईं आयात गरिएका ${parsed.length} वटा खण्डहरू लोड गर्न चाहनुहुन्छ?`)) {
                                          setNotes(parsed);
                                          localStorage.setItem('nitvt_notes', JSON.stringify(parsed));
                                          window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                          window.dispatchEvent(new Event('storage'));
                                          setSuccessMessage(`${parsed.length} खण्डहरू सफलतापुर्वक आयात गरियो!`);
                                          setTimeout(() => setSuccessMessage(''), 3000);
                                        }
                                      } else {
                                        alert('अमान्य JSON ढाँचा। कृपया वैध म्यानुअल खण्डहरूको एरे भएको JSON फाइल प्रयोग गर्नुहोस्।');
                                      }
                                    } catch (err) {
                                      alert('JSON फाइल पढ्न सकिएन।');
                                    }
                                  };
                                  reader.readAsText(file);
                                }
                              }}
                            />
                          </label>

                          {/* Factory Reset */}
                          <button
                            onClick={() => {
                              if (confirm('के तपाईं सबै म्यानुअल खण्डहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्न चाहनुहुन्छ? तपाईंले गरेका सबै परिवर्तनहरू मेटिनेछन्।')) {
                                setNotes(telecomManualChapters);
                                localStorage.setItem('nitvt_notes', JSON.stringify(telecomManualChapters));
                                window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                window.dispatchEvent(new Event('storage'));
                                setSuccessMessage('म्यानुअल खण्डहरू पूर्वनिर्धारित अवस्थामा रिसेट गरियो!');
                                setTimeout(() => setSuccessMessage(''), 3000);
                              }
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-rose-500/30"
                            title="पूर्वनिर्धारित म्यानुअल खण्डहरू रिसेट गर्नुहोस्"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>रिसेट</span>
                          </button>
                        </div>
                      </div>

                      {/* Chapters Grid List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[540px] overflow-y-auto pr-1.5">
                        {notes
                          .filter((note: any) => {
                            const matchCategory = notesCategoryFilter === 'all' || note.category === notesCategoryFilter;
                            const query = notesSearchQuery.toLowerCase().trim();
                            if (!query) return matchCategory;
                            const matchTitle = (note.titleNepali || '').toLowerCase().includes(query) ||
                              (note.titleEnglish || '').toLowerCase().includes(query) ||
                              (note.chapterNumber || '').toLowerCase().includes(query) ||
                              (note.pageRef || '').toLowerCase().includes(query) ||
                              (note.summaryNepali || '').toLowerCase().includes(query);
                            return matchCategory && matchTitle;
                          })
                          .map((note: any, idx: number) => {
                            const titleText = note.titleNepali || note.title || note.titleEnglish || (note.chapterNumber ? `${note.chapterNumber}` : `नोट #${idx + 1}`);
                            const subTitleText = (note.titleNepali || note.title) && note.titleEnglish ? note.titleEnglish : null;
                            const summaryText = note.summaryNepali || note.summary || note.contentNepali || note.content || '';
                            const keyPointsCount = Array.isArray(note.keyPoints) ? note.keyPoints.length : 0;
                            const examHighlightsCount = Array.isArray(note.examHighlights) ? note.examHighlights.length : 0;
                            const vivaCount = Array.isArray(note.vivaQuestions) ? note.vivaQuestions.length : 0;
                            const formulasCount = Array.isArray(note.formulaList) ? note.formulaList.length : 0;
                            const diagramsCount = Array.isArray(note.diagrams) ? note.diagrams.length : 0;

                            return (
                              <div
                                key={note.id || idx}
                                className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between transition-all"
                              >
                                <div className="space-y-2">
                                  {/* Top Badges */}
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                                        {note.chapterNumber || `खण्ड ${idx + 1}`}
                                      </span>
                                      <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-md font-medium">
                                        {note.category || 'osp_telecom'}
                                      </span>
                                    </div>
                                    {note.pageRef && (
                                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                        {note.pageRef}
                                      </span>
                                    )}
                                  </div>

                                  {/* Titles */}
                                  <div>
                                    <h4 className="text-xs font-bold text-white leading-snug">{titleText}</h4>
                                    {subTitleText && (
                                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">{subTitleText}</p>
                                    )}
                                  </div>

                                  {/* Summary */}
                                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                                    {summaryText}
                                  </p>

                                  {/* Meta metrics badges */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                                    {keyPointsCount > 0 && (
                                      <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                                        ✓ {keyPointsCount} बुँदाहरू
                                      </span>
                                    )}
                                    {examHighlightsCount > 0 && (
                                      <span className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded">
                                        ★ {examHighlightsCount} परीक्षा हाइलाइट
                                      </span>
                                    )}
                                    {formulasCount > 0 && (
                                      <span className="bg-purple-950/60 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded">
                                        ∑ {formulasCount} सूत्र
                                      </span>
                                    )}
                                    {vivaCount > 0 && (
                                      <span className="bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded">
                                        ? {vivaCount} Viva
                                      </span>
                                    )}
                                    {diagramsCount > 0 && (
                                      <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                                        ⬡ {diagramsCount} रेखाचित्र
                                      </span>
                                    )}
                                    {note.imageUrl && (
                                      <span className="bg-pink-950/60 text-pink-300 border border-pink-800/60 px-1.5 py-0.5 rounded">
                                        📷 तस्बिर
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                                  {/* Reorder Buttons */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => {
                                        if (idx > 0) {
                                          const updated = [...notes];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx - 1];
                                          updated[idx - 1] = temp;
                                          setNotes(updated);
                                          localStorage.setItem('nitvt_notes', JSON.stringify(updated));
                                          window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                        }
                                      }}
                                      className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 text-[10px]"
                                      title="माथि सार्नुहोस्"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      disabled={idx === notes.length - 1}
                                      onClick={() => {
                                        if (idx < notes.length - 1) {
                                          const updated = [...notes];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx + 1];
                                          updated[idx + 1] = temp;
                                          setNotes(updated);
                                          localStorage.setItem('nitvt_notes', JSON.stringify(updated));
                                          window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                        }
                                      }}
                                      className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 text-[10px]"
                                      title="तल सार्नुहोस्"
                                    >
                                      ▼
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {/* Duplicate */}
                                    <button
                                      onClick={() => {
                                        const clone = {
                                          ...note,
                                          id: Date.now(),
                                          chapterNumber: `${note.chapterNumber || 'खण्ड'} (प्रतिलिपि)`,
                                          titleNepali: `${note.titleNepali || note.title || ''} (प्रतिलिपि)`
                                        };
                                        const updated = [clone, ...notes];
                                        setNotes(updated);
                                        localStorage.setItem('nitvt_notes', JSON.stringify(updated));
                                        window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                        window.dispatchEvent(new Event('storage'));
                                        setSuccessMessage('खण्डको प्रतिलिपि सफलतापूर्वक थपियो!');
                                        setTimeout(() => setSuccessMessage(''), 2500);
                                      }}
                                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                                      title="यो खण्डको प्रतिलिपि बनाउनुहोस्"
                                    >
                                      <span>प्रतिलिपि</span>
                                    </button>

                                    {/* Edit */}
                                    <button
                                      onClick={() => {
                                        setEditingItem({ ...note });
                                        setEditingJsonText(JSON.stringify(note, null, 2));
                                        setIsJsonMode(false);
                                        setModalType('note');
                                        setEditModalOpen(true);
                                      }}
                                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-500/30"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>सम्पादन</span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                      onClick={() => {
                                        if (confirm(`के तपाईं "${titleText}" खण्ड हटाउन चाहनुहुन्छ?`)) {
                                          const updated = notes.filter((n: any, i: number) => n.id ? n.id !== note.id : i !== idx);
                                          setNotes(updated);
                                          localStorage.setItem('nitvt_notes', JSON.stringify(updated));
                                          window.dispatchEvent(new CustomEvent('nitvt_notes_updated'));
                                          window.dispatchEvent(new Event('storage'));
                                          setSuccessMessage('म्यानुअल खण्ड सफलतापुर्वक हटाइयो!');
                                          setTimeout(() => setSuccessMessage(''), 3000);
                                        }
                                      }}
                                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                                      title="यो खण्ड हटाउनुहोस्"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: TECHNICAL & ELECTRICAL SYMBOLS */}
                  {notesSubTab === 'symbols' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        <p className="text-xs text-slate-300">
                          म्यानुअलमा प्रयोग हुने प्राविधिक संकेत, पोल, केबल, अर्थिङ र स्प्लाइसिङ चिन्हहरू
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newSym = {
                                id: 'sym-' + Date.now(),
                                symbol: '○',
                                nameNepali: 'नयाँ संकेत नाम',
                                description: 'संकेतको विस्तृत विवरण र मापदण्ड...'
                              };
                              setEditingItem(newSym);
                              setEditingJsonText(JSON.stringify(newSym, null, 2));
                              setIsJsonMode(false);
                              setModalType('symbol');
                              setEditModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>नयाँ संकेत थप्नुहोस्</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('के तपाईं सबै संकेतहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्न चाहनुहुन्छ?')) {
                                setSymbols(telecomSymbolsList);
                                localStorage.setItem('nitvt_symbols', JSON.stringify(telecomSymbolsList));
                                window.dispatchEvent(new CustomEvent('nitvt_symbols_updated'));
                                window.dispatchEvent(new Event('storage'));
                                setSuccessMessage('संकेतहरू पूर्वनिर्धारित अवस्थामा रिसेट गरियो!');
                                setTimeout(() => setSuccessMessage(''), 2500);
                              }
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl border border-rose-500/30"
                          >
                            रिसेट
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[540px] overflow-y-auto pr-1">
                        {symbols.map((sym: any, sIdx: number) => (
                          <div
                            key={sym.id || sIdx}
                            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg shrink-0">
                                {sym.symbol}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white leading-snug">{sym.nameNepali}</h4>
                                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                                  {sym.description}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...sym });
                                  setEditingJsonText(JSON.stringify(sym, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('symbol');
                                  setEditModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                              >
                                <Edit className="w-3 h-3" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`के तपाईं "${sym.nameNepali}" संकेत हटाउन चाहनुहुन्छ?`)) {
                                    const updated = symbols.filter((_: any, i: number) => i !== sIdx);
                                    setSymbols(updated);
                                    localStorage.setItem('nitvt_symbols', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_symbols_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: NTC SHORTCODES & IMPORTANT NUMBERS */}
                  {notesSubTab === 'numbers' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        <p className="text-xs text-slate-300">
                          नेपाल टेलिकमका मर्मत, कम्प्लेन, बिल सोधपुछ तथा आपतकालीन आधिकारिक सर्टकोडहरू
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newNum = {
                                number: '199',
                                service: 'नयाँ टेलिकम सेवा विवरण...'
                              };
                              setEditingItem(newNum);
                              setEditingJsonText(JSON.stringify(newNum, null, 2));
                              setIsJsonMode(false);
                              setModalType('ntc_number');
                              setEditModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>नयाँ सर्टकोड थप्नुहोस्</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('के तपाईं सबै NTC सर्टकोडहरू पूर्वनिर्धारित अवस्थामा रिसेट गर्न चाहनुहुन्छ?')) {
                                setNtcNumbers(ntcImportantNumbers);
                                localStorage.setItem('nitvt_ntc_numbers', JSON.stringify(ntcImportantNumbers));
                                window.dispatchEvent(new CustomEvent('nitvt_ntc_numbers_updated'));
                                window.dispatchEvent(new Event('storage'));
                                setSuccessMessage('सर्टकोडहरू पूर्वनिर्धारित अवस्थामा रिसेट गरियो!');
                                setTimeout(() => setSuccessMessage(''), 2500);
                              }
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl border border-rose-500/30"
                          >
                            रिसेट
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
                        {ntcNumbers.map((numItem: any, nIdx: number) => (
                          <div
                            key={numItem.number || nIdx}
                            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-start gap-3">
                              <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-extrabold text-sm shrink-0 flex items-center justify-center">
                                {numItem.number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white leading-relaxed">{numItem.service}</h4>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...numItem });
                                  setEditingJsonText(JSON.stringify(numItem, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('ntc_number');
                                  setEditModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                              >
                                <Edit className="w-3 h-3" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`के तपाईं "${numItem.number}" सर्टकोड हटाउन चाहनुहुन्छ?`)) {
                                    const updated = ntcNumbers.filter((_: any, i: number) => i !== nIdx);
                                    setNtcNumbers(updated);
                                    localStorage.setItem('nitvt_ntc_numbers', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_ntc_numbers_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: DOWNLOADABLE NOTES (PDF / JPG) */}
                  {notesSubTab === 'downloads' && (
                    <AdminDownloadableNotesManager />
                  )}
                </div>
              )}

              {/* ELECTRICIAN COURSE NOTE ADMIN MANAGEMENT TAB */}
              {activeTab === 'electrician' && (
                <ElectricianAdminSection
                  lessons={electricianLessonsState}
                  setLessons={setElectricianLessonsState}
                  symbols={electricianSymbolsState}
                  setSymbols={setElectricianSymbolsState}
                  practicals={electricianPracticalsState}
                  setPracticals={setElectricianPracticalsState}
                  wireTable={electricianWireTableState}
                  setWireTable={setElectricianWireTableState}
                  onNotify={(msg) => setSuccessMessage(msg)}
                  initialEditDay={initialElectricianEditDay}
                />
              )}

              {/* LEVEL 1 MASTER HUB ADMIN MANAGEMENT TAB */}
              {activeTab === 'level1' && (
                <div className="space-y-5">
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-400" />
                          <span>जुनियर टेलिकम टेक्निसियन तह–१ मास्टर हब व्यवस्थापन (Level-1 Admin)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          म्यानुअल अध्यायहरू, पाठ्यक्रम विवरण, प्रयोगात्मक सेटहरू, VIVA प्रश्नहरू र टेलिकम गाँठोहरू सम्पादन गर्नुहोस्।
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Full Level-1 Suite Active</span>
                        </span>
                      </div>
                    </div>

                    {/* Level 1 Sub-Tab Navigation Bar */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {[
                        { id: 'manual', label: '१. म्यानुअल अध्यायहरू', count: level1Notes.length, color: 'text-cyan-400' },
                        { id: 'info', label: '२. पाठ्यक्रम विवरण र मोड्युल', count: 'CTEVT', color: 'text-amber-400' },
                        { id: 'practicals', label: '३. प्रयोगात्मक सेटहरू', count: level1PracticalSetsState.length, color: 'text-orange-400' },
                        { id: 'viva', label: '४. VIVA प्रश्न बैंक', count: level1VivaState.length, color: 'text-purple-400' },
                        { id: 'knots', label: '५. टेलिकम गाँठो (Knots)', count: level1KnotsState.length, color: 'text-rose-400' },
                        { id: 'field_survey', label: '६. फिल्ड सर्भे नक्सा (Gwarko OSP)', count: 'नक्सा', color: 'text-emerald-400' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setLevel1SubTab(st.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                            level1SubTab === st.id
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span>{st.label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${level1SubTab === st.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-950/80 ' + st.color}`}>
                            {st.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. MANUAL CHAPTERS */}
                  {level1SubTab === 'manual' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">तह–१ प्राविधिक म्यानुअल अध्यायहरू (Level-1 Manual Chapters)</h4>
                          <p className="text-xs text-slate-400">अध्यायहरू थप्नुहोस्, सम्पादन गर्नुहोस् वा हटाउनुहोस्।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: 'level1-' + Date.now(),
                              chapterNumber: level1Notes.length + 1,
                              titleNepali: 'नयाँ अध्याय तह-१',
                              titleEnglish: 'New Level 1 Chapter',
                              subtitle: 'उपशीर्षक',
                              summaryNepali: 'सारांश...',
                              sections: []
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(false);
                            setModalType('level1');
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>तह-१ अध्याय थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {level1Notes.map((ch: any, idx: number) => (
                          <div key={ch.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                                अध्याय {ch.chapterNumber}
                              </span>
                              <h4 className="text-xs font-bold text-white">{ch.titleNepali}</h4>
                              <p className="text-[11px] text-slate-300 line-clamp-2">{ch.summaryNepali}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...ch });
                                  setEditingJsonText(JSON.stringify(ch, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('level1');
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो अध्याय हटाउन चाहनुहुन्छ?')) {
                                    const updated = level1Notes.filter((n: any, i: number) => n.id ? n.id !== ch.id : i !== idx);
                                    setLevel1Notes(updated);
                                    localStorage.setItem('nitvt_level1_notes', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level1_notes_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                    setSuccessMessage('तह-१ नोट सफलतापुर्वक हटाइयो!');
                                    setTimeout(() => setSuccessMessage(''), 3000);
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                                title="अध्याय हटाउनुहोस्"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. COURSE INFO & MODULES */}
                  {level1SubTab === 'info' && (
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>तह–१ पाठ्यक्रम विवरण र मोड्युलहरू (Course Info & Modules)</span>
                          </h4>
                          <p className="text-xs text-slate-400">तालिमको शीर्षक, अवधि, प्रयोगात्मक अनुपात र ९ वटा मोड्युलहरू सम्पादन गर्नुहोस्।</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.setItem('nitvt_level1_course_info', JSON.stringify(level1CourseInfoState));
                            window.dispatchEvent(new CustomEvent('nitvt_level1_course_info_updated'));
                            window.dispatchEvent(new Event('storage'));
                            setSuccessMessage('तह-१ पाठ्यक्रम विवरण सफलतापूर्वक सेभ गरियो!');
                            setTimeout(() => setSuccessMessage(''), 3000);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <Save className="w-4 h-4" />
                          <span>विवरण सुरक्षित गर्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">शीर्षक (नेपाली)</label>
                          <input
                            type="text"
                            value={level1CourseInfoState.titleNepali || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, titleNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">कोर्स कोड (Code)</label>
                          <input
                            type="text"
                            value={level1CourseInfoState.code || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, code: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">तालिम अवधि (Duration)</label>
                          <input
                            type="text"
                            value={level1CourseInfoState.duration || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, duration: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">प्रयोगात्मक अनुपात (Practical Ratio)</label>
                          <input
                            type="text"
                            value={level1CourseInfoState.practicalRatio || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, practicalRatio: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-slate-300 font-bold block mb-1">विवरण (Description)</label>
                          <textarea
                            rows={3}
                            value={level1CourseInfoState.description || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">योग्यता मापदण्ड (Entry Requirement)</label>
                          <input
                            type="text"
                            value={level1CourseInfoState.entryRequirement || ''}
                            onChange={(e) => setLevel1CourseInfoState({ ...level1CourseInfoState, entryRequirement: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      {/* Modules Editor */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-amber-300">पाठ्यक्रम मोड्युलहरू (Modules)</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newMod = {
                                no: (level1CourseInfoState.modules || []).length + 1,
                                titleNepali: 'नयाँ मोड्युल',
                                hours: 40,
                                topics: ['विषय १']
                              };
                              const updated = [...(level1CourseInfoState.modules || []), newMod];
                              setLevel1CourseInfoState({ ...level1CourseInfoState, modules: updated });
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> मोड्युल थप्नुहोस्
                          </button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {(level1CourseInfoState.modules || []).map((m: any, mIdx: number) => (
                            <div key={mIdx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-400">मोड्युल {m.no || mIdx + 1}</span>
                                <input
                                  type="text"
                                  value={m.titleNepali || ''}
                                  onChange={(e) => {
                                    const updated = [...level1CourseInfoState.modules];
                                    updated[mIdx] = { ...updated[mIdx], titleNepali: e.target.value };
                                    setLevel1CourseInfoState({ ...level1CourseInfoState, modules: updated });
                                  }}
                                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white font-bold"
                                  placeholder="मोड्युल शीर्षक"
                                />
                                <input
                                  type="number"
                                  value={m.hours || 0}
                                  onChange={(e) => {
                                    const updated = [...level1CourseInfoState.modules];
                                    updated[mIdx] = { ...updated[mIdx], hours: Number(e.target.value) };
                                    setLevel1CourseInfoState({ ...level1CourseInfoState, modules: updated });
                                  }}
                                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center"
                                  placeholder="घण्टा"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = level1CourseInfoState.modules.filter((_: any, i: number) => i !== mIdx);
                                    setLevel1CourseInfoState({ ...level1CourseInfoState, modules: updated });
                                  }}
                                  className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. PRACTICAL SETS */}
                  {level1SubTab === 'practicals' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">तह–१ प्रयोगात्मक परीक्षा सेटहरू (Practical Exam Sets)</h4>
                          <p className="text-xs text-slate-400">प्रयोगात्मक कार्यहरू र सेटहरू JSON मोड वा सम्पादक मार्फत व्यवस्थापन गर्नुहोस्।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: 'l1-prac-' + Date.now(),
                              setNumber: 'Set ' + (level1PracticalSetsState.length + 1),
                              titleNepali: 'नयाँ प्रयोगात्मक सेट',
                              tasks: []
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(true);
                            setModalType('level1-practical' as any);
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>प्रयोगात्मक सेट थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {level1PracticalSetsState.map((set: any, sIdx: number) => (
                          <div key={set.id || sIdx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full font-bold">
                                {set.setNumber}
                              </span>
                              <h4 className="text-xs font-bold text-white">{set.titleNepali}</h4>
                              <p className="text-[11px] text-slate-400">जम्मा कार्यहरू: {set.tasks?.length || 0} वटा</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...set, _targetIndex: sIdx });
                                  setEditingJsonText(JSON.stringify(set, null, 2));
                                  setIsJsonMode(true);
                                  setModalType('level1-practical' as any);
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो सेट हटाउन चाहनुहुन्छ?')) {
                                    const updated = level1PracticalSetsState.filter((_: any, i: number) => i !== sIdx);
                                    setLevel1PracticalSetsState(updated);
                                    localStorage.setItem('nitvt_level1_practicals', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level1_practicals_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                    setSuccessMessage('प्रयोगात्मक सेट हटाइयो!');
                                    setTimeout(() => setSuccessMessage(''), 3000);
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

                  {/* 4. VIVA QUESTIONS */}
                  {level1SubTab === 'viva' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">तह–१ VIVA मौखिक प्रश्न बैंक (Oral Exam Q&A)</h4>
                          <p className="text-xs text-slate-400">मौखिक परीक्षाका प्रश्न र उत्तरहरू व्यवस्थापन गर्नुहोस्।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: Date.now(),
                              setNumber: 'SET-1',
                              questionNepali: 'नयाँ प्रश्न?',
                              answerNepali: 'उत्तर...',
                              englishKey: 'New Question',
                              category: 'General'
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(true);
                            setModalType('level1-viva' as any);
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>VIVA प्रश्न थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {level1VivaState.map((v: any, vIdx: number) => (
                          <div key={v.id || vIdx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                                  {v.setNumber} • {v.category}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-white">{v.questionNepali}</h5>
                              <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg">{v.answerNepali}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...v });
                                  setEditingJsonText(JSON.stringify(v, null, 2));
                                  setIsJsonMode(true);
                                  setModalType('level1-viva' as any);
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो प्रश्न हटाउन चाहनुहुन्छ?')) {
                                    const updated = level1VivaState.filter((item: any, i: number) => item.id ? item.id !== v.id : i !== vIdx);
                                    setLevel1VivaState(updated);
                                    localStorage.setItem('nitvt_level1_viva', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level1_viva_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                    setSuccessMessage('VIVA प्रश्न हटाइयो!');
                                    setTimeout(() => setSuccessMessage(''), 3000);
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

                  {/* 5. KNOTS */}
                  {level1SubTab === 'knots' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">तह–१ टेलिकम गाँठो तथा रग्गिंग (Telecom Knots)</h4>
                          <p className="text-xs text-slate-400">गाँठोका विधि र विवरणहरू व्यवस्थापन गर्नुहोस्।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: 'knot-' + Date.now(),
                              nameNepali: 'नयाँ गाँठो',
                              nameEnglish: 'New Knot',
                              purposeNepali: 'उद्देश्य...',
                              steps: []
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(true);
                            setModalType('level1-knot' as any);
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>गाँठो थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {level1KnotsState.map((knot: any, kIdx: number) => (
                          <div key={knot.id || kIdx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                                {knot.nameEnglish}
                              </span>
                              <h4 className="text-xs font-bold text-white">{knot.nameNepali}</h4>
                              <p className="text-[11px] text-slate-300">{knot.purposeNepali}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...knot, _targetIndex: kIdx });
                                  setEditingJsonText(JSON.stringify(knot, null, 2));
                                  setIsJsonMode(true);
                                  setModalType('level1-knot' as any);
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो गाँठो हटाउन चाहनुहुन्छ?')) {
                                    const updated = level1KnotsState.filter((_: any, i: number) => i !== kIdx);
                                    setLevel1KnotsState(updated);
                                    localStorage.setItem('nitvt_level1_knots', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level1_knots_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                    setSuccessMessage('गाँठो हटाइयो!');
                                    setTimeout(() => setSuccessMessage(''), 3000);
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

                  {/* 6. LEVEL 1 OSP FIELD SURVEY MAP */}
                  {level1SubTab === 'field_survey' && (
                    <Level1FieldSurveyAdmin />
                  )}
                </div>
              )}

              {/* LEVEL 2 MASTER HUB ADMIN MANAGEMENT TAB */}
              {activeTab === 'level2' && (
                <div className="space-y-5">
                  {/* Master Sub-Navigation Header */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-400" />
                          <span>टेलिकम टेक्निसियन तह–२ मास्टर हब व्यवस्थापन (Level-2 Master Hub Admin)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          म्यानुअलका १२ अध्यायहरू, पाठ्यक्रम उद्देश्य, २०८३ परीक्षा हल सेट, १०० VIVA प्रश्नोत्तर, पोल मापदण्ड र नक्सा सम्पादन गर्नुहोस्।
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Full Level-2 Suite Active</span>
                        </span>
                      </div>
                    </div>

                    {/* Sub-Tab Navigation Bar */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {[
                        { id: 'manual', label: '१. म्यानुअल अध्यायहरू', count: level2Notes.length, color: 'text-cyan-400' },
                        { id: 'info', label: '२. पाठ्यक्रम विवरण र लक्ष्य', count: 'CTEVT', color: 'text-amber-400' },
                        {
                          id: 'exam',
                          label: '३. २०८३ परीक्षा मोडल सेट',
                          count: `${level2ExamPaperState.objectiveSection?.questions?.length || 0} MCQ`,
                          color: 'text-emerald-400'
                        },
                        { id: 'viva', label: '४. १०० VIVA प्रश्न बैंक', count: level2VivaBankState.length, color: 'text-purple-400' },
                        { id: 'poles', label: '५. पोल एक्ससेरिज मापदण्ड', count: level2PoleSpecsState.length, color: 'text-rose-400' },
                        { id: 'maps', label: '६. फिल्ड सर्भे नक्सा', count: surveyMaps.length, color: 'text-blue-400' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setLevel2SubTab(st.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                            level2SubTab === st.id
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span>{st.label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${level2SubTab === st.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-950/80 ' + st.color}`}>
                            {st.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. MANUAL CHAPTERS */}
                  {level2SubTab === 'manual' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">तह–२ प्राविधिक म्यानुअल अध्यायहरू (12 Manual Chapters)</h4>
                          <p className="text-xs text-slate-400">प्रत्येक अध्यायमा सिद्धान्त, बुँदाहरू र विस्तृत प्राविधिक सामग्री समावेश छ।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: 'level2-' + Date.now(),
                              chapterNumber: level2Notes.length + 1,
                              titleNepali: 'नयाँ अध्याय तह-२',
                              titleEnglish: 'New Level 2 Chapter',
                              category: 'core-telecom',
                              readTime: '१५ मिनेट',
                              summaryNepali: 'अध्यायको मुख्य सारांश...',
                              keyPoints: ['मुख्य बुँदा १', 'मुख्य बुँदा २']
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(false);
                            setModalType('level2');
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>नयाँ अध्याय थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
                        {level2Notes.map((ch: any, idx: number) => (
                          <div key={`l2-ch-${ch.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/30">
                                  अध्याय {ch.chapterNumber} • {ch.category}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  {ch.readTime || '१५ मिनेट'}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{ch.titleNepali}</h4>
                              <p className="text-[11px] text-slate-400 italic">{ch.titleEnglish}</p>
                              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                                {ch.summaryNepali}
                              </p>
                              {ch.keyPoints && ch.keyPoints.length > 0 && (
                                <div className="space-y-1 text-[11px] text-slate-400">
                                  <span className="font-bold text-slate-300 text-[10px]">मुख्य बुँदाहरू:</span>
                                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 line-clamp-2">
                                    {ch.keyPoints.slice(0, 2).map((kp: string, kIdx: number) => (
                                      <li key={kIdx} className="truncate">{kp}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...ch });
                                  setEditingJsonText(JSON.stringify(ch, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('level2');
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-medium"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो अध्याय हटाउन चाहनुहुन्छ?')) {
                                    const updated = level2Notes.filter((n: any, i: number) => n.id ? n.id !== ch.id : i !== idx);
                                    setLevel2Notes(updated);
                                    localStorage.setItem('nitvt_level2_notes', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level2_notes_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                    setSuccessMessage('तह-२ नोट सफलतापुर्वक हटाइयो!');
                                    setTimeout(() => setSuccessMessage(''), 3000);
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs"
                                title="अध्याय हटाउनुहोस्"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. COURSE INFO & SYLLABUS DETAILS */}
                  {level2SubTab === 'info' && (
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>पाठ्यक्रम विवरण, उद्देश्य र कार्यक्षेत्र (Course Info & Scope)</span>
                          </h4>
                          <p className="text-xs text-slate-400">तह–२ को प्रमाणीकरण, तालिम घण्टा, प्रयोगात्मक भार र योग्यता विवरण।</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.setItem('nitvt_level2_course_info', JSON.stringify(level2CourseInfoState));
                            window.dispatchEvent(new CustomEvent('nitvt_level2_course_info_updated'));
                            window.dispatchEvent(new Event('storage'));
                            setSuccessMessage('पाठ्यक्रम विवरण सफलतापुर्वक सेभ गरियो!');
                            setTimeout(() => setSuccessMessage(''), 3000);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <Save className="w-4 h-4" />
                          <span>पाठ्यक्रम विवरण सुरक्षित गर्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">पाठ्यक्रम शीर्षक (नेपाली)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.titleNepali || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, titleNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">Course Title (English)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.titleEnglish || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, titleEnglish: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">तह र कोड (Level & Code)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.level || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, level: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">कुल तालिम अवधि (Duration)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.durationHours || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, durationHours: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">प्रयोगात्मक भार (Practical %)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.practicalPercentage || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, practicalPercentage: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">सैद्धान्तिक भार (Theory %)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.theoryPercentage || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, theoryPercentage: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">प्रमाणीकरण निकाय (Certification)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.certification || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, certification: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">प्रवेश योग्यता (Prerequisites)</label>
                          <input
                            type="text"
                            value={level2CourseInfoState.prerequisites || ''}
                            onChange={(e) => setLevel2CourseInfoState({ ...level2CourseInfoState, prerequisites: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      {/* Objectives List */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-amber-300">पाठ्यक्रमका मुख्य उद्देश्यहरू (Course Objectives)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(level2CourseInfoState.objectives || []), 'नयाँ उद्देश्य'];
                              setLevel2CourseInfoState({ ...level2CourseInfoState, objectives: updated });
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> उद्देश्य थप्नुहोस्
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(level2CourseInfoState.objectives || []).map((obj: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <span className="text-xs text-amber-400 font-bold">{oIdx + 1}.</span>
                              <input
                                type="text"
                                value={obj}
                                onChange={(e) => {
                                  const updated = [...level2CourseInfoState.objectives];
                                  updated[oIdx] = e.target.value;
                                  setLevel2CourseInfoState({ ...level2CourseInfoState, objectives: updated });
                                }}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = level2CourseInfoState.objectives.filter((_: any, i: number) => i !== oIdx);
                                  setLevel2CourseInfoState({ ...level2CourseInfoState, objectives: updated });
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Career Scope List */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-emerald-300">रोजगारी तथा कार्यक्षेत्रका सम्भावनाहरू (Career Opportunities)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(level2CourseInfoState.careerScope || []), 'नयाँ कार्यक्षेत्र'];
                              setLevel2CourseInfoState({ ...level2CourseInfoState, careerScope: updated });
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> कार्यक्षेत्र थप्नुहोस्
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(level2CourseInfoState.careerScope || []).map((scope: string, sIdx: number) => (
                            <div key={sIdx} className="flex items-center gap-2">
                              <span className="text-xs text-emerald-400 font-bold">✓</span>
                              <input
                                type="text"
                                value={scope}
                                onChange={(e) => {
                                  const updated = [...level2CourseInfoState.careerScope];
                                  updated[sIdx] = e.target.value;
                                  setLevel2CourseInfoState({ ...level2CourseInfoState, careerScope: updated });
                                }}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = level2CourseInfoState.careerScope.filter((_: any, i: number) => i !== sIdx);
                                  setLevel2CourseInfoState({ ...level2CourseInfoState, careerScope: updated });
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. EXAM PAPER 2083 (SOLVED 100 MARKS) */}
                  {level2SubTab === 'exam' && (
                    <div className="space-y-4">
                      {/* Exam Section Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                        {[
                          { id: 'objective', label: 'क) ५० MCQ प्रश्नहरू', count: level2ExamPaperState.objectiveSection?.questions?.length || 0, color: 'text-amber-400' },
                          { id: 'subjective', label: 'ख) १९ विषयगत प्रश्नोत्तर', count: level2ExamPaperState.subjectiveSection?.questions?.length || 0, color: 'text-blue-400' },
                          { id: 'matching', label: 'ग) जोडा मिलाउने परीक्षा', count: level2ExamPaperState.matchingSection?.length || 0, color: 'text-purple-400' },
                          { id: 'spotting', label: 'घ) स्थलगत चिन्हाइ (Spotting)', count: level2ExamPaperState.spottingSection?.length || 0, color: 'text-emerald-400' },
                          { id: 'practical', label: 'ङ) प्रयोगात्मक कार्यहरू', count: level2ExamPaperState.practicalAssignments?.length || 0, color: 'text-cyan-400' }
                        ].map((et) => (
                          <button
                            key={et.id}
                            type="button"
                            onClick={() => setLevel2ExamSubTab(et.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                              level2ExamSubTab === et.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                          >
                            <span>{et.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 bg-slate-950/80 rounded-full font-mono font-bold ${et.color}`}>
                              {et.count}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* 3A. Objective MCQs */}
                      {level2ExamSubTab === 'objective' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-bold">
                              २०८३ वैशाख परीक्षा: ५० वस्तुगत प्रश्नोत्तरहरू ({level2ExamPaperState.objectiveSection?.questions?.length || 0} वटा)
                            </span>
                            <button
                              onClick={() => {
                                const currentQs = level2ExamPaperState.objectiveSection?.questions || [];
                                const newItem = {
                                  qNo: currentQs.length + 1,
                                  question: 'नयाँ वस्तुगत प्रश्न?',
                                  options: { A: 'विकल्प A', B: 'विकल्प B', C: 'विकल्प C', D: 'विकल्प D' },
                                  correctOption: 'A',
                                  explanation: 'सही उत्तरको प्राविधिक व्याख्या...'
                                };
                                setEditingItem(newItem);
                                setEditingJsonText(JSON.stringify(newItem, null, 2));
                                setIsJsonMode(false);
                                setModalType('level2-mcq');
                                setEditModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" /> MCQ थप्नुहोस्
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {(level2ExamPaperState.objectiveSection?.questions || []).map((q: any, idx: number) => (
                              <div key={`mcq-2083-${q.qNo || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                                      प्रश्न नं. {q.qNo}
                                    </span>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                      सही उत्तर: विकल्प {q.correctOption}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white leading-relaxed">{q.question}</h4>
                                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 pt-1">
                                    <span>A: {q.options?.A}</span>
                                    <span>B: {q.options?.B}</span>
                                    <span>C: {q.options?.C}</span>
                                    <span>D: {q.options?.D}</span>
                                  </div>
                                  {q.explanation && (
                                    <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                                      व्याख्या: {q.explanation}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingItem({ ...q });
                                      setEditingJsonText(JSON.stringify(q, null, 2));
                                      setIsJsonMode(false);
                                      setModalType('level2-mcq');
                                      setEditModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                  >
                                    <Edit className="w-3.5 h-3.5" /> सम्पादन
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('के तपाईं यो MCQ प्रश्न हटाउन चाहनुहुन्छ?')) {
                                        const updatedQuestions = (level2ExamPaperState.objectiveSection?.questions || []).filter((_: any, i: number) => i !== idx);
                                        const updatedPaper = {
                                          ...level2ExamPaperState,
                                          objectiveSection: {
                                            ...level2ExamPaperState.objectiveSection,
                                            questions: updatedQuestions
                                          }
                                        };
                                        setLevel2ExamPaperState(updatedPaper);
                                        localStorage.setItem('nitvt_level2_exam_paper', JSON.stringify(updatedPaper));
                                        window.dispatchEvent(new CustomEvent('nitvt_level2_exam_paper_updated'));
                                        window.dispatchEvent(new Event('storage'));
                                      }
                                    }}
                                    className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3B. Subjective Questions */}
                      {level2ExamSubTab === 'subjective' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-bold">
                              विषयगत लिखित प्रश्नहरू ({level2ExamPaperState.subjectiveSection?.questions?.length || 0} वटा)
                            </span>
                            <button
                              onClick={() => {
                                const currentQs = level2ExamPaperState.subjectiveSection?.questions || [];
                                const newItem = {
                                  qNo: currentQs.length + 1,
                                  marks: 5,
                                  question: 'नयाँ विषयगत प्रश्न?',
                                  modelAnswer: 'मोडेल उत्तर विवरण...',
                                  bulletPoints: ['मुख्य बुँदा १', 'मुख्य बुँदा २']
                                };
                                setEditingItem(newItem);
                                setEditingJsonText(JSON.stringify(newItem, null, 2));
                                setIsJsonMode(false);
                                setModalType('level2-subjective');
                                setEditModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" /> विषयगत प्रश्न थप्नुहोस्
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {(level2ExamPaperState.subjectiveSection?.questions || []).map((q: any, idx: number) => (
                              <div key={`subj-2083-${q.qNo || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                                      प्रश्न नं. {q.qNo} • {q.marks} अंक
                                    </span>
                                    <h4 className="text-xs font-bold text-white leading-relaxed">{q.question}</h4>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingItem({ ...q });
                                        setEditingJsonText(JSON.stringify(q, null, 2));
                                        setIsJsonMode(false);
                                        setModalType('level2-subjective');
                                        setEditModalOpen(true);
                                      }}
                                      className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                    >
                                      <Edit className="w-3.5 h-3.5" /> सम्पादन
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('के तपाईं यो विषयगत प्रश्न हटाउन चाहनुहुन्छ?')) {
                                          const updatedQuestions = (level2ExamPaperState.subjectiveSection?.questions || []).filter((_: any, i: number) => i !== idx);
                                          const updatedPaper = {
                                            ...level2ExamPaperState,
                                            subjectiveSection: {
                                              ...level2ExamPaperState.subjectiveSection,
                                              questions: updatedQuestions
                                            }
                                          };
                                          setLevel2ExamPaperState(updatedPaper);
                                          localStorage.setItem('nitvt_level2_exam_paper', JSON.stringify(updatedPaper));
                                          window.dispatchEvent(new CustomEvent('nitvt_level2_exam_paper_updated'));
                                          window.dispatchEvent(new Event('storage'));
                                        }
                                      }}
                                      className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                  <span className="font-bold text-emerald-400">नमुना उत्तर: </span>
                                  <span>{q.modelAnswer}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3C. Matching Section */}
                      {level2ExamSubTab === 'matching' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-bold">
                              जोडा मिलाउने समूहहरू ({level2ExamPaperState.matchingSection?.length || 0} समूह)
                            </span>
                            <button
                              onClick={() => {
                                const currentGroups = level2ExamPaperState.matchingSection || [];
                                const newItem = {
                                  _targetIndex: currentGroups.length,
                                  groupId: currentGroups.length + 1,
                                  groupTitle: `समूह ${currentGroups.length + 1}: नयाँ प्राविधिक जोडा`,
                                  columnA: [
                                    { qNo: 1, premise: 'उपकरण / कार्य १', correctAns: 'A' },
                                    { qNo: 2, premise: 'उपकरण / कार्य २', correctAns: 'B' }
                                  ],
                                  columnB: [
                                    { code: 'A', response: 'परिभाषा वा प्रयोग A' },
                                    { code: 'B', response: 'परिभाषा वा प्रयोग B' }
                                  ]
                                };
                                setEditingItem(newItem);
                                setEditingJsonText(JSON.stringify(newItem, null, 2));
                                setIsJsonMode(false);
                                setModalType('level2-matching');
                                setEditModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" /> जोडा समूह थप्नुहोस्
                            </button>
                          </div>

                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {(level2ExamPaperState.matchingSection || []).map((grp: any, gIdx: number) => (
                              <div key={`matching-grp-${gIdx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                                  <h4 className="text-xs font-bold text-purple-300">{grp.groupTitle}</h4>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingItem({ ...grp, _targetIndex: gIdx });
                                        setEditingJsonText(JSON.stringify(grp, null, 2));
                                        setIsJsonMode(false);
                                        setModalType('level2-matching');
                                        setEditModalOpen(true);
                                      }}
                                      className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                    >
                                      <Edit className="w-3.5 h-3.5" /> सम्पादन
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('के तपाईं यो जोडा समूह हटाउन चाहनुहुन्छ?')) {
                                          const updatedGroups = (level2ExamPaperState.matchingSection || []).filter((_: any, i: number) => i !== gIdx);
                                          const updatedPaper = {
                                            ...level2ExamPaperState,
                                            matchingSection: updatedGroups
                                          };
                                          setLevel2ExamPaperState(updatedPaper);
                                          localStorage.setItem('nitvt_level2_exam_paper', JSON.stringify(updatedPaper));
                                          window.dispatchEvent(new CustomEvent('nitvt_level2_exam_paper_updated'));
                                          window.dispatchEvent(new Event('storage'));
                                        }
                                      }}
                                      className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-[11px]">
                                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                    <span className="font-bold text-slate-300 block mb-1">स्तम्भ (क) - प्रश्न:</span>
                                    {grp.columnA?.map((ca: any, caIdx: number) => (
                                      <div key={caIdx} className="text-slate-300 py-0.5">
                                        {ca.qNo}. {ca.premise} ➔ <span className="text-emerald-400 font-bold">{ca.correctAns}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                    <span className="font-bold text-slate-300 block mb-1">स्तम्भ (ख) - उत्तर:</span>
                                    {grp.columnB?.map((cb: any, cbIdx: number) => (
                                      <div key={cbIdx} className="text-slate-400 py-0.5">
                                        <span className="text-purple-400 font-bold">{cb.code}.</span> {cb.response}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3D. Spotting Items */}
                      {level2ExamSubTab === 'spotting' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-bold">
                              स्थलगत औजार चिन्हाइ (Spotting Items - {level2ExamPaperState.spottingSection?.length || 0} वटा)
                            </span>
                            <button
                              onClick={() => {
                                const currentItems = level2ExamPaperState.spottingSection || [];
                                const newItem = {
                                  id: currentItems.length + 1,
                                  item: 'नयाँ औजार / सामान',
                                  usedFor: 'यसको प्राविधिक प्रयोग र कार्य विवरण...',
                                  time: '२ मिनेट'
                                };
                                setEditingItem(newItem);
                                setEditingJsonText(JSON.stringify(newItem, null, 2));
                                setIsJsonMode(false);
                                setModalType('level2-spotting');
                                setEditModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" /> Spotting आइटम थप्नुहोस्
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                            {(level2ExamPaperState.spottingSection || []).map((sp: any, idx: number) => (
                              <div key={`spotting-l2-${sp.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                                      Spotting #{sp.id}
                                    </span>
                                    <span className="text-[10px] text-amber-400 font-bold">{sp.time || '२ मिनेट'}</span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{sp.item}</span>
                                  </h4>
                                  <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                                    {sp.usedFor}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem({ ...sp });
                                      setEditingJsonText(JSON.stringify(sp, null, 2));
                                      setIsJsonMode(false);
                                      setModalType('level2-spotting');
                                      setEditModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                  >
                                    <Edit className="w-3.5 h-3.5" /> सम्पादन
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('के तपाईं यो Spotting आइटम हटाउन चाहनुहुन्छ?')) {
                                        const updatedItems = (level2ExamPaperState.spottingSection || []).filter((_: any, i: number) => i !== idx);
                                        const updatedPaper = {
                                          ...level2ExamPaperState,
                                          spottingSection: updatedItems
                                        };
                                        setLevel2ExamPaperState(updatedPaper);
                                        localStorage.setItem('nitvt_level2_exam_paper', JSON.stringify(updatedPaper));
                                        window.dispatchEvent(new CustomEvent('nitvt_level2_exam_paper_updated'));
                                        window.dispatchEvent(new Event('storage'));
                                      }
                                    }}
                                    className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3E. Practical Assignments */}
                      {level2ExamSubTab === 'practical' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-bold">
                              प्रयोगात्मक परीक्षा कार्यपत्रहरू ({level2ExamPaperState.practicalAssignments?.length || 0} वटा)
                            </span>
                            <button
                              onClick={() => {
                                const currentTasks = level2ExamPaperState.practicalAssignments || [];
                                const newItem = {
                                  qNo: currentTasks.length + 1,
                                  taskTitle: 'नयाँ प्रयोगात्मक कार्य',
                                  durationMinutes: 90,
                                  description: 'प्रयोगात्मक कार्यको विस्तृत विवरण, उपकरण र मापदण्ड...'
                                };
                                setEditingItem(newItem);
                                setEditingJsonText(JSON.stringify(newItem, null, 2));
                                setIsJsonMode(false);
                                setModalType('level2-practical');
                                setEditModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" /> प्रयोगात्मक कार्य थप्नुहोस्
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {(level2ExamPaperState.practicalAssignments || []).map((tsk: any, idx: number) => (
                              <div key={`pract-l2-${tsk.qNo || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold">
                                      कार्य #{tsk.qNo}
                                    </span>
                                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {tsk.durationMinutes} मिनेट
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingItem({ ...tsk });
                                        setEditingJsonText(JSON.stringify(tsk, null, 2));
                                        setIsJsonMode(false);
                                        setModalType('level2-practical');
                                        setEditModalOpen(true);
                                      }}
                                      className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                    >
                                      <Edit className="w-3.5 h-3.5" /> सम्पादन
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('के तपाईं यो प्रयोगात्मक कार्य हटाउन चाहनुहुन्छ?')) {
                                          const updatedTasks = (level2ExamPaperState.practicalAssignments || []).filter((_: any, i: number) => i !== idx);
                                          const updatedPaper = {
                                            ...level2ExamPaperState,
                                            practicalAssignments: updatedTasks
                                          };
                                          setLevel2ExamPaperState(updatedPaper);
                                          localStorage.setItem('nitvt_level2_exam_paper', JSON.stringify(updatedPaper));
                                          window.dispatchEvent(new CustomEvent('nitvt_level2_exam_paper_updated'));
                                          window.dispatchEvent(new Event('storage'));
                                        }
                                      }}
                                      className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-white">{tsk.taskTitle}</h4>
                                <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                                  {tsk.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. 100 VIVA QUESTION BANK */}
                  {level2SubTab === 'viva' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Radio className="w-4 h-4 text-purple-400" />
                            <span>१०० VIVA मौखिक प्रश्नोत्तर बैंक व्यवस्थापन ({level2VivaBankState.length} प्रश्नहरू)</span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">परीक्षकले सोध्ने सम्भावित मौखिक प्रश्न र सटीक प्राविधिक उत्तरहरू।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem = {
                              id: level2VivaBankState.length + 1,
                              cat: 'telecom',
                              q: 'नयाँ मौखिक प्रश्न?',
                              a: 'छोटो र सटीक उत्तर विवरण...',
                              tip: 'परीक्षक टिप: आत्मविश्वासका साथ स्पष्ट बोल्नुहोस्।'
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(false);
                            setModalType('level2-viva');
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>VIVA प्रश्न थप्नुहोस्</span>
                        </button>
                      </div>

                      {/* Filter & Search Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 scrollbar-thin">
                          {[
                            { id: 'ALL', label: 'सबै' },
                            { id: 'telecom', label: 'टेलिकम' },
                            { id: 'fiber', label: 'फाइबर' },
                            { id: 'copper', label: 'कपर' },
                            { id: 'tools', label: 'औजार' },
                            { id: 'electrical', label: 'विद्युत' },
                            { id: 'wireless', label: 'वायरलेस' },
                            { id: 'osp', label: 'OSP' },
                            { id: 'safety', label: 'सुरक्षा' }
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setLevel2VivaFilterCat(cat.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                level2VivaFilterCat === cat.id
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="VIVA प्रश्न वा उत्तर खोज्नुहोस्..."
                            value={level2VivaSearch}
                            onChange={(e) => setLevel2VivaSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Viva Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {level2VivaBankState
                          .filter(v => {
                            const matchCat = level2VivaFilterCat === 'ALL' || v.cat === level2VivaFilterCat;
                            const matchSearch = !level2VivaSearch.trim() ||
                              v.q.toLowerCase().includes(level2VivaSearch.toLowerCase()) ||
                              v.a.toLowerCase().includes(level2VivaSearch.toLowerCase());
                            return matchCat && matchSearch;
                          })
                          .map((v: any) => (
                            <div key={`viva-adm-${v.id}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                                    प्रश्न #{v.id} • {v.cat}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSpeakingVivaAdminId(v.id);
                                      speakNepaliText(`${v.q}। उत्तर: ${v.a}`, 'VIVA पूर्वावलोकन');
                                      setTimeout(() => setSpeakingVivaAdminId(null), 4000);
                                    }}
                                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                                      speakingVivaAdminId === v.id
                                        ? 'bg-purple-500 text-white animate-pulse'
                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                    }`}
                                    title="आवाज सुन्नुहोस्"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <h4 className="text-xs font-bold text-white leading-snug">{v.q}</h4>
                                <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                                  <span className="font-bold text-emerald-400">उत्तर: </span>
                                  <span>{v.a}</span>
                                </div>
                                {v.tip && (
                                  <p className="text-[10px] text-amber-400 italic">टिप: {v.tip}</p>
                                )}
                              </div>
                              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingItem({ ...v });
                                    setEditingJsonText(JSON.stringify(v, null, 2));
                                    setIsJsonMode(false);
                                    setModalType('level2-viva');
                                    setEditModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                                >
                                  <Edit className="w-3.5 h-3.5" /> सम्पादन
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('के तपाईं यो VIVA प्रश्न हटाउन चाहनुहुन्छ?')) {
                                      const updated = level2VivaBankState.filter((item: any) => item.id !== v.id);
                                      setLevel2VivaBankState(updated);
                                      localStorage.setItem('nitvt_level2_viva_bank', JSON.stringify(updated));
                                      window.dispatchEvent(new CustomEvent('nitvt_level2_viva_bank_updated'));
                                      window.dispatchEvent(new Event('storage'));
                                    }
                                  }}
                                  className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 5. POLE STANDARDS & ACCESSORIES */}
                  {level2SubTab === 'poles' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-rose-400" />
                            <span>टेलिकम पोल एक्ससेरिज तथा उचाइ मापदण्ड व्यवस्थापन ({level2PoleSpecsState.length} मापदण्डहरू)</span>
                          </h4>
                          <p className="text-xs text-slate-400">८ मिटर स्टिल ट्युबुलर पोलमा सामान जडानको उचाइ र सुरक्षा मापदण्ड।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newItem: any = {
                              _targetIndex: level2PoleSpecsState.length,
                              distanceFromTop: '० देखि ३० cm',
                              item: 'नयाँ पोल एक्ससेरिज',
                              category: 'pole-fitting',
                              descriptionNepali: 'जडान प्रक्रिया र विधि विवरण...',
                              standardRule: 'प्राविधिक नियम तथा क्लियरेन्स मापदण्ड...'
                            };
                            setEditingItem(newItem);
                            setEditingJsonText(JSON.stringify(newItem, null, 2));
                            setIsJsonMode(false);
                            setModalType('level2-pole');
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>मापदण्ड थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {level2PoleSpecsState.map((ps: any, idx: number) => (
                          <div key={`pole-spec-${idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between hover:border-rose-500/40 transition-colors">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                                  उचाइ: {ps.distanceFromTop}
                                </span>
                                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                                  {ps.category}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white">{ps.item}</h4>
                              <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                                {ps.descriptionNepali}
                              </p>
                              {ps.standardRule && (
                                <p className="text-[10px] text-amber-400 font-medium">
                                  नियम: {ps.standardRule}
                                </p>
                              )}
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...ps, _targetIndex: idx });
                                  setEditingJsonText(JSON.stringify(ps, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('level2-pole');
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो पोल मापदण्ड हटाउन चाहनुहुन्छ?')) {
                                    const updated = level2PoleSpecsState.filter((_: any, i: number) => i !== idx);
                                    setLevel2PoleSpecsState(updated);
                                    localStorage.setItem('nitvt_level2_pole_specs', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_level2_pole_specs_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. FIELD SURVEY MAPS */}
                  {level2SubTab === 'maps' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>फिल्ड सर्भे नक्सा तथा रेखाचित्रहरू ({surveyMaps.length} नक्साहरू)</span>
                          </h4>
                          <p className="text-xs text-slate-400">फाइबर तथा OSP फिल्ड सर्भे नक्सा, पोल कोडिङ र फिडर लेआउट व्यवस्थापन।</p>
                        </div>
                        <button
                          onClick={() => {
                            const newMap: SurveyMap = {
                              id: 'map-' + Date.now(),
                              titleNepali: 'नयाँ OSP सर्भे नक्सा',
                              titleEnglish: 'New OSP Survey Map',
                              category: 'osp-survey',
                              descriptionNepali: 'सर्भे विवरण तथा फिडर लेआउट...',
                              asciiDiagram: '+----[CO/Exchange]====(FJC-1)----[FDB-1]----+',
                              legendItems: [
                                { label: 'Feeder 48F Cable', color: 'text-amber-400' },
                                { label: 'Distribution 24F Cable', color: 'text-cyan-400' }
                              ],
                              routeDetails: [
                                { title: 'रुट विवरण १', details: ['पोल संख्या: २५', 'लम्बाइ: १.८ कि.मी.'] }
                              ]
                            };
                            setEditingItem(newMap);
                            setEditingJsonText(JSON.stringify(newMap, null, 2));
                            setIsJsonMode(false);
                            setModalType('map');
                            setEditModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>नयाँ नक्सा थप्नुहोस्</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {surveyMaps.map((m: any, idx: number) => (
                          <div key={m.id || idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                                  {m.category || 'फिल्ड सर्भे'}
                                </span>
                                {m.legendItems && (
                                  <span className="text-[10px] text-slate-400 font-mono">{m.legendItems.length} संकेतहरू</span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white">{m.titleNepali}</h4>
                              <p className="text-[11px] text-slate-400 italic">{m.titleEnglish}</p>
                              <p className="text-[11px] text-slate-300 line-clamp-2">{m.descriptionNepali}</p>
                              {m.routeDetails && m.routeDetails.length > 0 && (
                                <div className="text-[10px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-300">
                                  <span className="text-amber-400 font-bold">{m.routeDetails[0]?.title}: </span>
                                  <span>{m.routeDetails[0]?.details?.join(' • ')}</span>
                                </div>
                              )}
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...m });
                                  setEditingJsonText(JSON.stringify(m, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('map');
                                  setEditModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1 font-bold"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('के तपाईं यो नक्सा हटाउन चाहनुहुन्छ?')) {
                                    const updated = surveyMaps.filter((item: any, i: number) => item.id ? item.id !== m.id : i !== idx);
                                    setSurveyMaps(updated);
                                    localStorage.setItem('nitvt_survey_maps', JSON.stringify(updated));
                                    window.dispatchEvent(new CustomEvent('nitvt_maps_updated'));
                                    window.dispatchEvent(new Event('storage'));
                                  }
                                }}
                                className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EXAMS TAB WITH ALL CTEVT PREP SECTIONS */}
              {activeTab === 'exams' && (
                <div className="space-y-4">
                  
                  {/* Exam Prep Sub-Category Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                    {[
                      { id: 'model-mcq', label: 'MCQ (तह–२)', count: exams.length, color: 'text-purple-400' },
                      { id: '2083-mcq', label: 'MCQ (२०८३ वैशाख)', count: exams2083.length, color: 'text-amber-400' },
                      { id: 'matching', label: 'जोडा मिलाउनुहोस्', count: (matchingExams.length + matching2083Exams.length), color: 'text-blue-400' },
                      { id: 'spotting', label: 'स्थलगत चिन्हाइ (Spotting)', count: (spottingExams.length + (Object.values(spotting2083Exams || {}).flat() as any[]).length), color: 'text-emerald-400' },
                      { id: 'subjective', label: 'विषयगत प्रश्न उत्तर', count: (subjectiveExams.length + subjective2083Exams.length), color: 'text-rose-400' },
                      { id: 'viva', label: 'मौखिक परीक्षा (Viva)', count: (vivaExams.length + (Object.values(viva2083Exams || {}).flat() as any[]).length), color: 'text-cyan-400' },
                      { id: 'handbook', label: 'गाइड बुक र Full Forms', count: (handbookExams.length + abbrevExams.length), color: 'text-indigo-400' },
                      { id: 'practical', label: 'प्रयोगात्मक गाइड', count: ((practicalExams || []).flat() as any[]).length, color: 'text-amber-400' },
                    ].map((subCat) => (
                      <button
                        key={subCat.id}
                        type="button"
                        onClick={() => setActiveExamSubCategory(subCat.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          activeExamSubCategory === subCat.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <span>{subCat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 bg-slate-950/80 rounded-full font-mono font-bold ${subCat.color}`}>
                          {subCat.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Header & Add Button per Active Sub Category */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        {activeExamSubCategory === 'model-mcq' && 'तह–२ नमुना MCQ प्रश्नहरू व्यवस्थापन'}
                        {activeExamSubCategory === '2083-mcq' && '२०८३ वैशाख परीक्षा MCQ प्रश्नहरू व्यवस्थापन'}
                        {activeExamSubCategory === 'matching' && 'जोडा मिलाउने प्रश्न समूह व्यवस्थापन'}
                        {activeExamSubCategory === 'spotting' && 'स्थलगत औजार चिन्हाइ (Spotting Items) व्यवस्थापन'}
                        {activeExamSubCategory === 'subjective' && 'विषयगत लिखित प्रश्नोत्तर व्यवस्थापन'}
                        {activeExamSubCategory === 'viva' && 'मौखिक अन्तर्वार्ता (Viva Flashcards) व्यवस्थापन'}
                        {activeExamSubCategory === 'handbook' && 'गाइड बुक प्रश्नोत्तर तथा Full Forms व्यवस्थापन'}
                        {activeExamSubCategory === 'practical' && 'प्रयोगात्मक परीक्षा कार्यपत्र (Practical Sheets) व्यवस्थापन'}
                      </span>
                    </h3>

                    <button
                      onClick={() => {
                        let newItem: any = {};
                        let type: string = 'exam';

                        if (activeExamSubCategory === 'model-mcq') {
                          newItem = { id: 'mcq-' + Date.now(), questionNepali: 'नयाँ प्रश्न?', questionEnglish: 'New Question?', options: ['क', 'ख', 'ग', 'घ'], correctAnswer: 0, explanationNepali: 'व्याख्या...', category: 'OSP Cables', level: 'Level-2' };
                          type = 'exam';
                        } else if (activeExamSubCategory === '2083-mcq') {
                          newItem = { id: Date.now(), questionNepali: '२०८३ बैशाख नयाँ प्रश्न?', options: { A: 'विकल्प A', B: 'विकल्प B', C: 'विकल्प C', D: 'विकल्प D' }, correctAnswer: 'A', explanationNepali: 'व्याख्या...', category: '२०८३ परीक्षा' };
                          type = 'exam2083';
                        } else if (activeExamSubCategory === 'matching') {
                          newItem = { id: 'match-' + Date.now(), titleNepali: 'नयाँ जोडा मिलाउनुहोस्', items: [{ id: 'p1', premise: 'वस्तु १' }], responses: [{ id: 'r1', letter: 'A', text: 'उत्तर A' }], correctMatches: { 'p1': 'r1' } };
                          type = 'matching';
                        } else if (activeExamSubCategory === 'spotting') {
                          newItem = { id: Date.now(), itemName: 'नयाँ औजार / उपकरण', purposeNepali: 'प्रयोग र उद्देश्य...', category: 'General', imageUrl: '' };
                          type = 'spotting';
                        } else if (activeExamSubCategory === 'subjective') {
                          newItem = { id: Date.now(), questionNepali: 'नयाँ विषयगत प्रश्न?', marks: 5, answerNepali: 'मोडेल उत्तर...', points: ['मुख्य बुँदा १', 'मुख्य बुँदा २'], category: 'लिखित खण्ड' };
                          type = 'subjective';
                        } else if (activeExamSubCategory === 'viva') {
                          newItem = { id: Date.now(), questionNepali: 'नयाँ मौखिक प्रश्न?', answerNepali: 'उत्तर...', examinerTip: 'परीक्षक टिप: स्पष्ट र छोटो भन्नुहोस्।', category: 'General Viva' };
                          type = 'viva';
                        } else if (activeExamSubCategory === 'handbook') {
                          newItem = { id: Date.now(), questionNepali: 'नयाँ गाइड प्रश्न?', answerNepali: 'उत्तर...', category: 'pole' };
                          type = 'handbook';
                        } else if (activeExamSubCategory === 'practical') {
                          newItem = { id: Date.now(), sheetIdx: 1, taskName: 'नयाँ प्रयोगात्मक कार्य', equipmentList: ['फाइबर स्प्लाइसर', 'स्ट्रिपर'], steps: ['चरण १: तयारी गर्ने'], precautions: ['सुरक्षा चश्मा लगाउने'] };
                          type = 'practical';
                        }

                        setEditingItem(newItem);
                        setEditingJsonText(JSON.stringify(newItem, null, 2));
                        setIsJsonMode(false);
                        setModalType(type);
                        setEditModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ आइटम थप्नुहोस्</span>
                    </button>
                  </div>

                  {/* List Container for Active Sub Category */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    
                    {/* 1. Model MCQs */}
                    {activeExamSubCategory === 'model-mcq' && exams.map((ex: any, idx: number) => (
                      <div key={`model-mcq-${ex.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                            {ex.level || ex.category || 'CTEVT MCQ'}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-relaxed">{idx + 1}. {ex.questionNepali || ex.question}</h4>
                          <p className="text-[11px] text-emerald-400">✓ उत्तर: {Array.isArray(ex.options) ? ex.options[ex.correctAnswer] : JSON.stringify(ex.correctAnswer)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...ex }); setEditingJsonText(JSON.stringify(ex, null, 2)); setIsJsonMode(false); setModalType('exam'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                          <button onClick={() => { if (confirm('के तपाईं हटाउन चाहनुहुन्छ?')) { const u = exams.filter((_: any, i: number) => i !== idx); setExams(u); localStorage.setItem('nitvt_exams', JSON.stringify(u)); window.dispatchEvent(new CustomEvent('nitvt_exams_updated')); } }} className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}

                    {/* 2. 2083 MCQs */}
                    {activeExamSubCategory === '2083-mcq' && exams2083.map((ex: any, idx: number) => (
                      <div key={`2083-mcq-${ex.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">२०८३ बैशाख • {ex.category || 'MCQ'}</span>
                          <h4 className="text-xs font-bold text-white leading-relaxed">{idx + 1}. {ex.questionNepali}</h4>
                          <p className="text-[11px] text-emerald-400">✓ उत्तर ({ex.correctAnswer}): {ex.options ? ex.options[ex.correctAnswer] : ''}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...ex }); setEditingJsonText(JSON.stringify(ex, null, 2)); setIsJsonMode(false); setModalType('exam2083'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                          <button onClick={() => { if (confirm('के तपाईं हटाउन चाहनुहुन्छ?')) { const u = exams2083.filter((_: any, i: number) => i !== idx); setExams2083(u); localStorage.setItem('nitvt_exams_2083', JSON.stringify(u)); window.dispatchEvent(new CustomEvent('nitvt_exams_2083_updated')); } }} className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}

                    {/* 3. Matching Groups */}
                    {activeExamSubCategory === 'matching' && [...matchingExams.map((g: any) => ({ ...g, _src: 'model' })), ...matching2083Exams.map((g: any) => ({ ...g, _src: '2083' }))].map((g: any, idx: number) => (
                      <div key={`match-group-${g._src}-${g.id || g.groupName || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-bold">जोडा मिलाउने समूह #{idx + 1}</span>
                          <h4 className="text-xs font-bold text-white">{g.titleNepali || g.groupName}</h4>
                          <p className="text-[11px] text-slate-400">स्तम्भ क: {(g.items ? g.items.map((i: any) => i.premise) : g.columnA || []).join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...g }); setEditingJsonText(JSON.stringify(g, null, 2)); setIsJsonMode(false); setModalType(g.columnA ? 'matching2083' : 'matching'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                        </div>
                      </div>
                    ))}

                    {/* 4. Spotting Items */}
                    {activeExamSubCategory === 'spotting' && [
                      ...spottingExams.map((s: any) => ({ ...s, _src: 'model' })),
                      ...(Object.entries(spotting2083Exams || {}).flatMap(([key, items]: any) => (items || []).map((it: any) => ({ ...it, sheetKey: key, _src: '2083' }))))
                    ].map((sp: any, idx: number) => (
                      <div key={`spotting-${sp._src}-${sp.sheetKey || 'default'}-${sp.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {sp.imageUrl ? (
                            <img src={sp.imageUrl} alt={sp.nameNepali || sp.itemName} className="w-12 h-12 object-contain bg-slate-900 rounded-lg border border-slate-800 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-3xs shrink-0">नो फोटो</div>
                          )}
                          <div>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">{sp.sheetKey ? `२०८३ ${sp.sheetKey}` : sp.category || 'स्थलगत औजार'}</span>
                            <h4 className="text-xs font-bold text-white">{sp.nameNepali || sp.itemName}</h4>
                            <p className="text-[11px] text-slate-300 line-clamp-1">{sp.purposeNepali}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...sp }); setEditingJsonText(JSON.stringify(sp, null, 2)); setIsJsonMode(false); setModalType(sp.sheetKey ? 'spotting2083' : 'spotting'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                        </div>
                      </div>
                    ))}

                    {/* 5. Subjective Questions */}
                    {activeExamSubCategory === 'subjective' && [
                      ...subjectiveExams.map((s: any) => ({ ...s, _src: 'model' })),
                      ...subjective2083Exams.map((s: any) => ({ ...s, _src: '2083' }))
                    ].map((sub: any, idx: number) => (
                      <div key={`subj-${sub._src}-${sub.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">अङ्क: {sub.marks || 5} • {sub.category || 'लिखित खण्ड'}</span>
                          <h4 className="text-xs font-bold text-white">{sub.questionNepali}</h4>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{sub.answerNepali || sub.modelAnswerNepali}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...sub }); setEditingJsonText(JSON.stringify(sub, null, 2)); setIsJsonMode(false); setModalType(sub.modelAnswerNepali ? 'subjective' : 'subjective2083'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                        </div>
                      </div>
                    ))}

                    {/* 6. Viva Questions */}
                    {activeExamSubCategory === 'viva' && [
                      ...vivaExams.map((v: any) => ({ ...v, _src: 'model' })),
                      ...(Object.entries(viva2083Exams || {}).flatMap(([key, items]: any) => (items || []).map((it: any) => ({ ...it, sheetKey: key, _src: '2083' }))))
                    ].map((v: any, idx: number) => (
                      <div key={`viva-${v._src}-${v.sheetKey || 'default'}-${v.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold">{v.sheetKey ? `Viva ${v.sheetKey}` : v.category || 'मौखिक'}</span>
                          <h4 className="text-xs font-bold text-white">{v.questionNepali || v.question}</h4>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{v.answerNepali}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingItem({ ...v }); setEditingJsonText(JSON.stringify(v, null, 2)); setIsJsonMode(false); setModalType(v.sheetKey ? 'viva2083' : 'viva'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                        </div>
                      </div>
                    ))}

                    {/* 7. Handbook & Abbreviations */}
                    {activeExamSubCategory === 'handbook' && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-indigo-400">१. टेलिकम शब्दकोश प्रश्नोत्तर ({handbookExams.length} वटा)</div>
                        {handbookExams.map((h: any, idx: number) => (
                          <div key={`hb-qa-${h.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs font-bold text-white">{h.questionNepali}</div>
                              <div className="text-[11px] text-slate-300 line-clamp-1">{h.answerNepali}</div>
                            </div>
                            <button onClick={() => { setEditingItem({ ...h }); setEditingJsonText(JSON.stringify(h, null, 2)); setIsJsonMode(false); setModalType('handbook'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs shrink-0"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                          </div>
                        ))}
                        <div className="text-xs font-bold text-amber-400 pt-2">२. Full Forms / Abbreviations ({abbrevExams.length} वटा)</div>
                        {abbrevExams.map((a: any, idx: number) => (
                          <div key={`abbrev-${a.abbreviation || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs font-bold text-amber-300">{a.abbreviation} - {a.fullName}</div>
                              <div className="text-[11px] text-slate-300 line-clamp-1">{a.meaningNepali}</div>
                            </div>
                            <button onClick={() => { setEditingItem({ ...a }); setEditingJsonText(JSON.stringify(a, null, 2)); setIsJsonMode(false); setModalType('abbrev'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs shrink-0"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 8. Practical Sheets */}
                    {activeExamSubCategory === 'practical' && (
                      (Array.isArray(practicalExams) ? practicalExams : []).flatMap((sheetTasks: any[], sheetIdx: number) =>
                        (sheetTasks || []).map((t: any) => ({ ...t, sheetIdx: sheetIdx + 1 }))
                      ).map((pr: any, idx: number) => (
                        <div key={`practical-${pr.sheetIdx}-${pr.id || idx}`} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">पाना {pr.sheetIdx} • कार्यपत्र #{pr.id}</span>
                            <h4 className="text-xs font-bold text-white">{pr.taskName || pr.sheetTitle}</h4>
                            <p className="text-[11px] text-slate-300">उपकरणहरू: {(pr.equipmentList || []).join(', ')}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => { setEditingItem({ ...pr }); setEditingJsonText(JSON.stringify(pr, null, 2)); setIsJsonMode(false); setModalType('practical'); setEditModalOpen(true); }} className="p-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> सम्पादन</button>
                          </div>
                        </div>
                      ))
                    )}

                  </div>
                </div>
              )}

              {/* MAPS & DIAGRAMS TAB */}
              {activeTab === 'maps' && (
                <div className="space-y-4">
                  {/* Dedicated Level-1 OSP Field Survey Map Shortcut Card */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Level-1 OSP Base Map
                          </span>
                          <span className="text-xs text-amber-300 font-bold">Cabinet 09 • DP 31 • NITVT Office</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white mt-0.5">
                          नेपाल टेलिकम – ग्वार्को चोक, उदय बस्ती OSP फिल्ड सर्भे नक्सा सम्पादक
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('level1');
                        setLevel1SubTab('field_survey');
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95"
                    >
                      <span>नक्सा सम्पादन गर्नुहोस् (Edit Survey Map)</span>
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                        <span>नक्सा तथा सेकेन्डरी पोलिङ रेखाचित्र म्यानेजर (Maps & Diagrams Editor)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        ग्वार्को चोक बेस म्याप (Gwarko Map), MFD र २ क्याबिनेट योजना, र सेकेन्डरी पोलिङ डायग्राम सम्पादन गर्नुहोस् वा नयाँ नक्सा थप्नुहोस्।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newMap: SurveyMap = {
                          id: `custom-map-${Date.now()}`,
                          titleNepali: 'नयाँ नेटवर्क नक्सा / सर्भे डायग्राम',
                          titleEnglish: 'New Custom Survey Map',
                          category: 'Custom Map',
                          descriptionNepali: 'यो Admin द्वारा थपिएको नयाँ नक्सा / सर्भे रेखाचित्र हो।',
                          asciiDiagram: `====================================================================================================
                                      नयाँ नेटवर्क नक्सा / सर्भे रेखाचित्र (New Survey Map)
====================================================================================================

      [EXCHANGE / SUBSTATION] ──── Trunk Cable ────> [NEW CABINET 01]
                                                          │
                                                    Secondary Cable
                                                          │
                                                          ▼
                                                    [DP - 01] ─── Drop Wire ───> [SUBSCRIBER 01]
====================================================================================================`,
                          legendItems: [
                            { label: 'मुख्य एक्सचेन्ज', color: '#a855f7' },
                            { label: 'नयाँ क्याबिनेट', color: '#06b6d4' },
                            { label: 'डीपी बक्स', color: '#10b981' }
                          ],
                          routeDetails: [
                            {
                              title: 'नयाँ नक्सा विवरण',
                              details: [
                                'प्राथमिक फिडर केबल: १०० पेयर / ४८F फाइबर',
                                'सेकेन्डरी केबल: ५० पेयर / २४F फाइबर',
                                'स्थान: नयाँ सर्भे क्षेत्र'
                              ]
                            }
                          ],
                          notesNepali: 'Admin Panel बाट सहजै सम्पादन गर्न सकिने नयाँ सर्भे म्याप।'
                        };
                        setEditingItem(newMap);
                        setEditingJsonText(JSON.stringify(newMap, null, 2));
                        setIsJsonMode(false);
                        setModalType('map');
                        setEditModalOpen(true);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ नक्सा थप्नुहोस् (Add New Map)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {surveyMaps.map((map) => (
                      <div
                        key={map.id}
                        className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {map.category}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white">{map.titleNepali}</h4>
                            <p className="text-xs text-slate-400 italic">{map.titleEnglish}</p>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2">{map.descriptionNepali}</p>

                          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 overflow-hidden">
                            <pre className="text-[10px] font-mono text-cyan-300/80 max-h-24 overflow-y-auto no-scrollbar whitespace-pre">
                              {map.asciiDiagram}
                            </pre>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                          <button
                            onClick={() => {
                              setEditingItem(map);
                              setEditingJsonText(JSON.stringify(map, null, 2));
                              setIsJsonMode(false);
                              setModalType('map');
                              setEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" /> सम्पादन गर्नुहोस्
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`के तपाईं "${map.titleNepali}" नक्सा हटाउन चाहनुहुन्छ?`)) {
                                const updated = surveyMaps.filter((m) => m.id !== map.id);
                                setSurveyMaps(updated);
                                localStorage.setItem('nitvt_survey_maps', JSON.stringify(updated));
                                window.dispatchEvent(new CustomEvent('nitvt_maps_updated'));
                              }
                            }}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs"
                            title="नक्सा हटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INSTRUCTOR / ABOUT ME PROFILE TAB */}
              {activeTab === 'instructor' && (
                <div className="max-w-xl mx-auto bg-slate-950/70 p-6 rounded-3xl border border-slate-800 space-y-6 text-center shadow-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>मेरो बारेमा (Instructor Profile Preview)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      यहाँबाट तपाईंले प्रशिक्षकको फोटो, सम्पर्क र विवरणहरू हेर्न र सम्पादन गर्न सक्नुहुन्छ।
                    </p>
                  </div>

                  <div className="flex flex-col items-center space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-slate-950 border-2 border-amber-500/40 shadow-lg">
                      <img
                        src={instructorProfile.photoUrl}
                        alt="Instructor Preview"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{instructorProfile.nameNepali}</h4>
                      <p className="text-xs text-amber-400 font-bold mt-0.5">{instructorProfile.roleNepali}</p>
                      <p className="text-[10px] text-slate-400 italic">({instructorProfile.nameEnglish} - {instructorProfile.roleEnglish})</p>
                      
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
                        <span className="text-left">📞 {instructorProfile.phone || 'N/A'}</span>
                        <span className="text-right">✉️ {instructorProfile.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem({ ...instructorProfile });
                        setEditingJsonText(JSON.stringify(instructorProfile, null, 2));
                        setIsJsonMode(false);
                        setModalType('instructor');
                        setEditModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>प्रशिक्षक विवरण सम्पादन गर्नुहोस् (Edit Profile)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* INSTITUTE INFO TAB */}
              {activeTab === 'institute' && (
                <div className="max-w-xl mx-auto bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white">संस्थाको सम्पूर्ण विवरण (Institute Info Editor)</h3>
                  <p className="text-xs text-slate-400">यहाँबाट संस्थाको नाम, फोन, इमेल र ठेगाना पूर्ण रूपमा परिवर्तन गर्न सक्नुहुन्छ।</p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold">संस्थाको नाम (English)</label>
                      <input
                        type="text"
                        value={instInfo.nameEnglish || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, nameEnglish: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold">संस्थाको नाम (Nepali)</label>
                      <input
                        type="text"
                        value={instInfo.nameNepali || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, nameNepali: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold">प्राथमिक फोन (Primary Phone)</label>
                      <input
                        type="text"
                        value={instInfo.phonePrimary || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, phonePrimary: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold">द्वितीयर फोन (Secondary Phone)</label>
                      <input
                        type="text"
                        value={instInfo.phoneSecondary || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, phoneSecondary: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold">इमेल (Email)</label>
                      <input
                        type="text"
                        value={instInfo.emailTop || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, emailTop: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold">ठेगाना (Location)</label>
                      <input
                        type="text"
                        value={instInfo.location || ''}
                        onChange={(e) => setInstInfo({ ...instInfo, location: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6" id="admin-gallery-manager">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-cyan-400" />
                        <span>फोटो र भिडियो ग्यालरी व्यवस्थापन (Media Gallery)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        यहाँबाट नयाँ फोटो तथा तालिमका युट्युब भिडियोहरू थप्न, सम्पादन गर्न वा हटाउन सक्नुहुन्छ।
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newId = String(Date.now());
                        const freshItem = {
                          id: newId,
                          title: '',
                          titleEnglish: '',
                          category: 'lab' as const,
                          type: 'image' as const,
                          thumbnailUrl: '',
                          mediaUrl: '',
                          description: ''
                        };
                        setEditingItem(freshItem);
                        setEditingJsonText(JSON.stringify(freshItem, null, 2));
                        setModalType('gallery');
                        setIsJsonMode(false);
                        setEditModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ फोटो / भिडियो थप्नुहोस्</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gallery.map((item) => (
                      <div key={item.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-all shadow-lg relative group">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 relative">
                          <img 
                            src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=150&q=80'} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            item.type === 'video' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {item.type === 'video' ? 'Video' : 'Photo'}
                          </span>
                        </div>

                        {/* Text Detail */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-bold border border-slate-700 uppercase">
                                {item.category}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate mt-1.5" title={item.title}>
                              {item.title || <span className="text-slate-500 italic">No Title</span>}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                              {item.description || 'No description provided.'}
                            </p>
                          </div>

                          {/* Actions */}
                          {deletingGalleryId === item.id ? (
                            <div className="mt-3 bg-rose-950/30 border border-rose-500/20 rounded-xl p-2.5 space-y-2">
                              <p className="text-[10px] text-rose-200 font-bold">के तपाईं यो मिडिया हटाउन निश्चित हुनुहुन्छ?</p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const updatedGallery = gallery.filter((g: any) => g.id !== item.id);
                                    setGallery(updatedGallery);
                                    localStorage.setItem('nitvt_gallery', JSON.stringify(updatedGallery));
                                    window.dispatchEvent(new Event('nitvt_gallery_updated'));
                                    setDeletingGalleryId(null);
                                    setSuccessMessage('मिडियालाई सफलतापूर्वक हटाइयो।');
                                    setTimeout(() => setSuccessMessage(''), 4000);
                                  }}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-lg transition-all shadow active:scale-95"
                                >
                                  हो, मेटाउनुहोस्
                                </button>
                                <button
                                  onClick={() => setDeletingGalleryId(null)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-lg transition-all"
                                >
                                  रद्द गर्नुहोस्
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...item });
                                  setEditingJsonText(JSON.stringify(item, null, 2));
                                  setModalType('gallery');
                                  setIsJsonMode(false);
                                  setEditModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>सम्पादन (Edit)</span>
                              </button>
                              <button
                                onClick={() => setDeletingGalleryId(item.id)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 rounded-lg text-xs font-bold transition-all border border-slate-800 hover:border-rose-900/50 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>मेटाउनुहोस्</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {gallery.length === 0 && (
                      <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl">
                        <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">ग्यालरी खाली छ। नयाँ थप्न माथिको बटन थिच्नुहोस्।</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="max-w-xl mx-auto bg-slate-950/70 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">एडमिन लगइन पासवर्ड तथा युजरनेम परिवर्तन</h3>
                      <p className="text-xs text-slate-400">
                        Admin Login को प्रयोगकर्ता नाम (Username) र पासवर्ड (Password) नयाँ राख्न वा परिवर्तन गर्न सकिन्छ।
                      </p>
                    </div>
                  </div>

                  {credentialSuccess && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{credentialSuccess}</span>
                    </div>
                  )}

                  {credentialError && (
                    <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{credentialError}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>नयाँ प्रयोगकर्ता नाम (New Username)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="उदा: admin_new"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>नयाँ पासवर्ड (New Password)</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="नयाँ पासवर्ड राख्नुहोस्"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          title={showNewPassword ? "पासवर्ड लुकाउनुहोस्" : "पासवर्ड हेर्नुहोस्"}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>नयाँ पासवर्ड पुनः पुष्टि गर्नुहोस् (Confirm New Password)</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="माथि राखेकै पासवर्ड दोहोऱ्याउनुहोस्"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          title={showConfirmPassword ? "पासवर्ड लुकाउनुहोस्" : "पासवर्ड हेर्नुहोस्"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="submit"
                        className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4 text-slate-950" />
                        <span>पासवर्ड र युजरनेम सेभ गर्नुहोस्</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetDefaultCredentials}
                        className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
                        title="पूर्वनिर्धारित admin / admin123 मा रिसेट गर्नुहोस्"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Default रिसेट</span>
                      </button>
                    </div>
                  </form>

                  {/* Telecom Note Password Management Card */}
                  <div className="bg-slate-950/70 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">टेलीकम नोट पासवर्ड नियन्त्रण (Telecom Note Access Control)</h3>
                        <p className="text-xs text-slate-400">
                          टेलीकम नोट (Telecom Note) सेक्सन खोल्न प्रयोगकर्ताहरूलाई आवश्यक पर्ने पासवर्ड परिवर्तन गर्नुहोस्।
                        </p>
                      </div>
                    </div>

                    {telecomPassSuccess && (
                      <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{telecomPassSuccess}</span>
                      </div>
                    )}

                    {telecomPassError && (
                      <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{telecomPassError}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateTelecomNotePass} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>नयाँ टेलीकम नोट पासवर्ड (New Telecom Note Password)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showTelecomPass ? "text" : "password"}
                            required
                            value={newTelecomNotePass}
                            onChange={(e) => setNewTelecomNotePass(e.target.value)}
                            placeholder="उदा: telecom123"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowTelecomPass(!showTelecomPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                            title={showTelecomPass ? "पासवर्ड लुकाउनुहोस्" : "पासवर्ड हेर्नुहोस्"}
                          >
                            {showTelecomPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4 text-white" />
                        <span>टेलीकम नोट पासवर्ड परिवर्तन गर्नुहोस् (Save Telecom Note Password)</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* BLOG MANAGEMENT TAB */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  {/* Header & Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Newspaper className="w-4.5 h-4.5 text-amber-400" />
                        <span>ब्लग तथा समाचार व्यवस्थापन (Blog & News Management)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        संस्थाका सबै प्राविधिक लेख, समाचार तथा गाइडहरू थप्ने, सम्पादन गर्ने वा हटाउने
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newBlog: BlogPost = {
                          id: `blog-${Date.now()}`,
                          titleNepali: '',
                          titleEnglish: '',
                          category: 'optical_fiber',
                          categoryLabel: 'अप्टिकल फाइबर (Optical Fiber)',
                          author: 'सुरेन्द्र ऐर (Surendra Air)',
                          authorRole: 'मुख्य प्रशिक्षक तथा टेलिकम विज्ञ',
                          date: new Date().toLocaleDateString('ne-NP'),
                          readTime: '५ मिनेट',
                          imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
                          summaryNepali: '',
                          contentNepali: '',
                          tags: ['Telecom', 'NITVT'],
                          views: 1,
                          likes: 0
                        };
                        setEditingItem(newBlog);
                        setEditingJsonText(JSON.stringify(newBlog, null, 2));
                        setIsJsonMode(false);
                        setModalType('blog');
                        setEditModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>नयाँ ब्लग/लेख थप्नुहोस्</span>
                    </button>
                  </div>

                  {/* Search & Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <select
                        value={blogCategoryFilter}
                        onChange={(e) => setBlogCategoryFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                      >
                        <option value="all">सबै क्याटेगोरी ({blogPosts.length})</option>
                        <option value="optical_fiber">अप्टिकल फाइबर</option>
                        <option value="telecom">टेलिकम इन्जिनियरिङ</option>
                        <option value="exams">परीक्षा तयारी</option>
                        <option value="ctevt_news">CTEVT समाचार</option>
                        <option value="tips">प्राविधिक टिप्स</option>
                      </select>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="ब्लग खोज्नुहोस्..."
                          value={blogSearchQuery}
                          onChange={(e) => setBlogSearchQuery(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 w-48 sm:w-64"
                        />
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold">
                      जम्मा ब्लग लेखहरू: <span className="text-amber-400 font-bold">{blogPosts.length}</span>
                    </span>
                  </div>

                  {/* Blog Posts List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogPosts
                      .filter(b => {
                        if (blogCategoryFilter !== 'all' && b.category !== blogCategoryFilter) return false;
                        if (blogSearchQuery) {
                          const q = blogSearchQuery.toLowerCase();
                          return (b.titleNepali || '').toLowerCase().includes(q) ||
                                 (b.summaryNepali || '').toLowerCase().includes(q) ||
                                 (b.author || '').toLowerCase().includes(q);
                        }
                        return true;
                      })
                      .map((post, idx) => (
                        <div key={post.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
                          <div className="space-y-2">
                            <div className="relative h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                              <img src={post.imageUrl} alt={post.titleNepali} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <span className="absolute top-2 left-2 bg-slate-950/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                                {post.categoryLabel || post.category}
                              </span>
                              {post.isFeatured && (
                                <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                                  ★ Featured
                                </span>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400">{post.date} • {post.readTime}</span>
                              <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{post.titleNepali}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{post.summaryNepali}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <div className="text-[10px] text-slate-400">
                              <span>👁 {post.views || 0}</span> • <span>👍 {post.likes || 0}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...post });
                                  setEditingJsonText(JSON.stringify(post, null, 2));
                                  setIsJsonMode(false);
                                  setModalType('blog');
                                  setEditModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> सम्पादन
                              </button>
                              <button
                                type="button"
                                onClick={() => setBlogToDelete({ id: post.id, title: post.titleNepali })}
                                className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs transition-colors"
                                title="लेख हटाउनुहोस्"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

        </div> {/* Close Modal Scrollable Body */}

        {/* Pinned Bottom Actions Bar for logged-in Admin */}
        {isAdminLoggedIn && (
          <div className="border-t border-slate-800 bg-slate-950/90 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                title="एडमिन बन्द गर्नुहोस् (Close - ESC)"
              >
                <X className="w-3.5 h-3.5" />
                <span>बन्द गर्नुहोस् (Close Admin)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdminLoggedIn(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-medium transition-colors border border-slate-800"
              >
                लगआउट
              </button>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={isCloudSyncing}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isCloudSyncing ? 'क्लाउडमा सेभ हुँदैछ...' : 'सबै परिवर्तनहरू सेभ गर्नुहोस्'}</span>
            </button>

          </div>
        )}

        {/* EDIT ITEM MODAL WITH FORM & JSON TOGGLE */}
        {editModalOpen && editingItem && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className={`relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full ${
                modalType === 'map' || modalType === 'instructor' ? 'max-w-sm sm:max-w-md' : 'max-w-md sm:max-w-lg'
              } flex flex-col max-h-[82vh] sm:max-h-[76vh] shadow-2xl text-left overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-3.5 py-2.5 sm:px-4 sm:py-3 shrink-0 bg-slate-900/90">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    {modalType === 'map' && <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />}
                    {modalType === 'instructor' && <User className="w-4 h-4 text-amber-400 shrink-0" />}
                    {modalType === 'course' && 'कोर्स सम्पादन (Edit Course)'}
                    {modalType === 'tool' && 'औजार सम्पादन (Edit Tool)'}
                    {modalType === 'note' && 'नोट सम्पादन (Edit Manual Note)'}
                    {modalType === 'exam' && 'प्रश्न सम्पादन (Edit Exam Question)'}
                    {modalType === 'level1' && 'तह-१ नोट सम्पादन (Edit Level-1 Note)'}
                    {modalType === 'level1-practical' && 'तह-१ प्रयोगात्मक सेट सम्पादन (Edit Level-1 Practical Set)'}
                    {modalType === 'level1-viva' && 'तह-१ VIVA प्रश्न सम्पादन (Edit Level-1 Viva Question)'}
                    {modalType === 'level1-knot' && 'तह-१ गाँठो सम्पादन (Edit Level-1 Knot)'}
                    {modalType === 'level2' && 'तह-२ अध्याय सम्पादन (Edit Level-2 Chapter)'}
                    {modalType === 'level2-mcq' && 'तह-२ वस्तुगत MCQ प्रश्न सम्पादन (Edit Level-2 MCQ)'}
                    {modalType === 'level2-subjective' && 'तह-२ विषयगत प्रश्न सम्पादन (Edit Level-2 Subjective)'}
                    {modalType === 'level2-matching' && 'तह-२ जोडा मिलाउने समूह सम्पादन (Edit Level-2 Matching)'}
                    {modalType === 'level2-spotting' && 'तह-२ स्थलगत चिन्हाइ सम्पादन (Edit Level-2 Spotting)'}
                    {modalType === 'level2-practical' && 'तह-२ प्रयोगात्मक कार्य सम्पादन (Edit Level-2 Practical)'}
                    {modalType === 'level2-viva' && 'तह-२ VIVA मौखिक प्रश्न सम्पादन (Edit Level-2 Viva Question)'}
                    {modalType === 'level2-pole' && 'तह-२ पोल मापदण्ड सम्पादन (Edit Level-2 Pole Standard)'}
                    {modalType === 'map' && 'नक्सा तथा रेखाचित्र सम्पादन (Edit Map)'}
                    {modalType === 'instructor' && 'प्रशिक्षक प्रोफाइल सम्पादन (Edit Instructor)'}
                    {modalType === 'blog' && 'ब्लग तथा समाचार लेख सम्पादन (Edit Blog Post)'}
                  </h3>
                  <button
                    onClick={() => {
                      if (!isJsonMode) {
                        setEditingJsonText(JSON.stringify(editingItem, null, 2));
                      } else {
                        try {
                          const parsed = JSON.parse(editingJsonText);
                          setEditingItem(parsed);
                        } catch (err) {
                          alert('अमान्य JSON ढाँचा (Invalid JSON format)');
                          return;
                        }
                      }
                      setIsJsonMode(!isJsonMode);
                    }}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors shrink-0"
                  >
                    <Code className="w-3 h-3" />
                    <span>{isJsonMode ? 'फारम' : 'JSON'}</span>
                  </button>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-600/30 hover:text-rose-300 text-slate-300 flex items-center justify-center transition-colors shadow-sm shrink-0 ml-2"
                  title="बन्द गर्नुहोस् / Close (ESC)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">

              {isJsonMode ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-amber-300">तपाईंले यहाँ सिधै JSON जस्ताको तस्तै एडिट गर्न सक्नुहुन्छ:</p>
                  <textarea
                    rows={12}
                    value={editingJsonText}
                    onChange={(e) => setEditingJsonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ) : modalType === 'blog' ? (
                /* Sleek Custom Compact Bilingual Blog Edit Form */
                <div className="space-y-3.5 text-xs text-left">
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-amber-300 font-bold block mb-1">ब्लग लेख शीर्षक (Nepali Title) *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.titleNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                        placeholder="उदा: FTTH स्प्लाइसिङ गर्दा लस घटाउने ५ उपायहरू..."
                      />
                    </div>
                    <div>
                      <label className="text-cyan-300 font-bold block mb-1">English Title (Optional)</label>
                      <input
                        type="text"
                        value={editingItem.titleEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                        placeholder="e.g., 5 Practical Tips to Minimize Splice Loss in FTTH..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">विधा (Category)</label>
                      <select
                        value={editingItem.category || 'optical_fiber'}
                        onChange={(e) => {
                          const cat = e.target.value as any;
                          const labels: Record<string, { ne: string; en: string }> = {
                            optical_fiber: { ne: 'अप्टिकल फाइबर (Optical Fiber)', en: 'Optical Fiber (FTTH)' },
                            telecom: { ne: 'टेलिकम इन्जिनियरिङ (Telecom Engineering)', en: 'Telecom Engineering' },
                            exams: { ne: 'परीक्षा तयारी (Exam Prep)', en: 'Exams & Preparation' },
                            ctevt_news: { ne: 'CTEVT समाचार (CTEVT News)', en: 'Career & Industry News' },
                            tips: { ne: 'प्राविधिक टिप्स (Tech Tips)', en: 'Technical Tips & Testing' },
                          };
                          const selected = labels[cat] || { ne: cat, en: cat };
                          setEditingItem({ 
                            ...editingItem, 
                            category: cat, 
                            categoryLabel: selected.ne,
                            categoryLabelEnglish: selected.en 
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="optical_fiber">अप्टिकल फाइबर (Optical Fiber)</option>
                        <option value="telecom">टेलिकम इन्जिनियरिङ (Telecom)</option>
                        <option value="exams">परीक्षा तयारी (Exam Prep)</option>
                        <option value="ctevt_news">CTEVT समाचार (CTEVT News)</option>
                        <option value="tips">प्राविधिक टिप्स (Tech Tips)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">लेखकको नाम (Author)</label>
                      <input
                        type="text"
                        value={editingItem.author || 'सुरेन्द्र ऐर (Surendra Air)'}
                        onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">लेखक पद/भूमिका (Nepali / English)</label>
                      <input
                        type="text"
                        value={editingItem.authorRole || 'मुख्य प्रशिक्षक'}
                        onChange={(e) => setEditingItem({ ...editingItem, authorRole: e.target.value, authorRoleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">मिती (Date - Nepali & English)</label>
                      <input
                        type="text"
                        value={editingItem.date || new Date().toLocaleDateString('ne-NP')}
                        onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value, dateEnglish: new Date().toLocaleDateString('en-US') })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">पढ्न लाग्ने समय (Read Time)</label>
                      <input
                        type="text"
                        value={editingItem.readTime || '५ मिनेट'}
                        onChange={(e) => setEditingItem({ ...editingItem, readTime: e.target.value, readTimeEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Photo Uploader */}
                  <ImageUploader
                    label="कभर फोटो (Cover Image / Photo Upload)"
                    currentImageUrl={editingItem.imageUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                    maxWidth={1000}
                    maxHeight={800}
                    aspectRatio="video"
                  />

                  {/* Summary Nepali & English */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-amber-300 font-semibold block mb-1">छोटो सारसंक्षेप (Nepali Summary)</label>
                      <textarea
                        rows={2}
                        value={editingItem.summaryNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, summaryNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
                        placeholder="ब्लगको २-३ वाक्यको छोटो विवरण..."
                      />
                    </div>
                    <div>
                      <label className="text-cyan-300 font-semibold block mb-1">English Summary (Optional)</label>
                      <textarea
                        rows={2}
                        value={editingItem.summaryEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, summaryEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
                        placeholder="2-3 sentences concise summary in English..."
                      />
                    </div>
                  </div>

                  {/* Content Nepali & English */}
                  <div>
                    <label className="text-amber-300 font-semibold block mb-1">मुख्य लेख सामग्री (Nepali Content - Markdown Supported)</label>
                    <textarea
                      rows={8}
                      value={editingItem.contentNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contentNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono leading-relaxed"
                      placeholder="यहाँ नेपालीमा पूर्ण लेख तथा समाचार सामग्री लेख्नुहोस्..."
                    />
                  </div>

                  <div>
                    <label className="text-cyan-300 font-semibold block mb-1">English Detailed Content (Optional - Markdown Supported)</label>
                    <textarea
                      rows={6}
                      value={editingItem.contentEnglish || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contentEnglish: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono leading-relaxed"
                      placeholder="Write full article content in English (Markdown supported)..."
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">ट्यागहरू (Tags - comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : (editingItem.tags || '')}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      placeholder="उदा: FTTH, Splicing, Telecom, NITVT"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isFeaturedCheck"
                      checked={!!editingItem.isFeatured}
                      onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="isFeaturedCheck" className="text-amber-300 font-bold cursor-pointer">
                      ★ मुख्य विशेषतामा राख्नुहोस् (Featured Main Article)
                    </label>
                  </div>
                </div>
              ) : modalType === 'instructor' ? (
                /* Sleek Custom Compact Instructor Edit Form */
                <div className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">नाम (नेपाली)</label>
                      <input
                        type="text"
                        value={editingItem.nameNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, nameNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">नाम (English)</label>
                      <input
                        type="text"
                        value={editingItem.nameEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, nameEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">पद (Nepali Role)</label>
                      <input
                        type="text"
                        value={editingItem.roleNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, roleNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">पद (English Role)</label>
                      <input
                        type="text"
                        value={editingItem.roleEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, roleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">सम्पर्क फोन नम्बर</label>
                      <input
                        type="text"
                        value={editingItem.phone || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">ईमेल ठेगाना</label>
                      <input
                        type="text"
                        value={editingItem.email || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">अनुभव ब्याज (Experience Badge)</label>
                      <input
                        type="text"
                        value={editingItem.experienceBadge || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, experienceBadge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">CTEVT / NSTB Assessor ब्याज</label>
                      <input
                        type="text"
                        value={editingItem.assessorBadge || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, assessorBadge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">मुल नारा / विचार (Motto)</label>
                      <input
                        type="text"
                        value={editingItem.mottoNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, mottoNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-amber-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">मुख्य शीर्षक (Heading)</label>
                      <input
                        type="text"
                        value={editingItem.headingNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, headingNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  {/* Instructor Photo Uploader directly inside popup */}
                  <ImageUploader
                    label="प्रशिक्षक तस्बिर (Instructor Profile Photo)"
                    currentImageUrl={editingItem.photoUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, photoUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, photoUrl: '' })}
                    maxWidth={800}
                    maxHeight={900}
                    aspectRatio="portrait"
                  />

                  {/* Paragraphs List Editor */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>विवरण अनुच्छेदहरू (Written Paragraphs)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedP = [...(editingItem.paragraphsNepali || []), ''];
                          setEditingItem({ ...editingItem, paragraphsNepali: updatedP });
                        }}
                        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[10px] font-bold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {editingItem.paragraphsNepali?.map((pText: string, pIdx: number) => (
                        <div key={pIdx} className="relative group">
                          <textarea
                            rows={2}
                            value={pText}
                            onChange={(e) => {
                              const updatedP = [...editingItem.paragraphsNepali];
                              updatedP[pIdx] = e.target.value;
                              setEditingItem({ ...editingItem, paragraphsNepali: updatedP });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white pr-7 text-[11px] focus:border-amber-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedP = editingItem.paragraphsNepali.filter((_: any, i: number) => i !== pIdx);
                              setEditingItem({ ...editingItem, paragraphsNepali: updatedP });
                            }}
                            className="absolute right-1 top-1 text-rose-400 hover:text-rose-300 p-1 bg-slate-950/60 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : modalType === 'gallery' ? (
                /* Sleek Custom Gallery Edit Form */
                <div className="space-y-4 text-xs text-left">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">शीर्षक (नेपाली)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                        placeholder="उदा: अप्टिकल फाइबर स्प्लिसिङ"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">शीर्षक (English)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.titleEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                        placeholder="e.g. Optical Fiber Splicing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">मिडियाको प्रकार (Media Type)</label>
                      <select
                        value={editingItem.type || 'image'}
                        onChange={(e) => {
                          const newType = e.target.value as 'image' | 'video';
                          setEditingItem({ 
                            ...editingItem, 
                            type: newType,
                            category: newType === 'video' ? 'video' : (editingItem.category === 'video' ? 'lab' : editingItem.category)
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        <option value="image">तस्बिर / Photo</option>
                        <option value="video">भिडियो / Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">विधा (Category)</label>
                      <select
                        value={editingItem.category || 'lab'}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        <option value="lab">ल्याब स्टेशनहरू (Lab Station)</option>
                        <option value="splicing">फ्युजन स्प्लिसिङ (Fusion Splicing)</option>
                        <option value="outdoor">आउटडोर पोल एसेसरिज (Outdoor Pole)</option>
                        <option value="classroom">सैद्धान्तिक क्लासरूम (Classroom)</option>
                        <option value="video">तालिम भिडियोहरू (Videos)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">मिडिया लिङ्क / भिडियो एम्बेड लिङ्क (Media URL)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.mediaUrl || ''}
                      onChange={(e) => {
                        const mUrl = e.target.value;
                        setEditingItem({ 
                          ...editingItem, 
                          mediaUrl: mUrl,
                          thumbnailUrl: editingItem.type === 'image' && !editingItem.thumbnailUrl ? mUrl : editingItem.thumbnailUrl 
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono text-[11px]"
                      placeholder={editingItem.type === 'video' ? "https://www.youtube.com/embed/VIDEO_ID" : "https://images.unsplash.com/... or Base64"}
                    />
                    {editingItem.type === 'video' && (
                      <p className="text-[10px] text-amber-300/80 mt-1">
                        * भिडियोको लागि सधैं YouTube Embed लिङ्क (`https://www.youtube.com/embed/xxxx`) राख्नुहोला।
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">थम्बनेल लिङ्क (Thumbnail URL)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.thumbnailUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, thumbnailUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono text-[11px]"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">विवरण (Nepali Description)</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      placeholder="फोटो वा भिडियोको छोटो विवरण नेपालीमा राख्नुहोस्..."
                    />
                  </div>

                  {editingItem.type === 'image' && (
                    <ImageUploader
                      label="कम्प्युटरबाट फोटो सिधा अपलोड गर्नुहोस् (Gallery Photo Upload)"
                      currentImageUrl={editingItem.mediaUrl || ''}
                      onImageUploaded={(url) => setEditingItem({
                        ...editingItem,
                        mediaUrl: url,
                        thumbnailUrl: url
                      })}
                      onImageRemoved={() => setEditingItem({
                        ...editingItem,
                        mediaUrl: '',
                        thumbnailUrl: ''
                      })}
                      maxWidth={1000}
                      maxHeight={900}
                      aspectRatio="video"
                    />
                  )}

                  {editingItem.type === 'video' && (
                    <div className="space-y-3">
                      {/* Video File Uploader */}
                      <div className="bg-slate-950 border border-red-500/30 p-3 rounded-xl space-y-2">
                        <label className="text-red-400 font-bold flex items-center gap-1.5 text-[11px]">
                          <svg className="w-4 h-4 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          <span>कम्प्युटरबाट भिडियो सिधा अपलोड गर्नुहोस् (Upload Local Video)</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            {editingItem.mediaUrl && !editingItem.mediaUrl.includes('youtube.com') && !editingItem.mediaUrl.includes('youtu.be') && !editingItem.mediaUrl.includes('/embed/') && (
                              <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <video src={editingItem.mediaUrl} className="w-full h-full object-cover" muted />
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <label className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 shadow">
                                <span>कम्प्युटरबाट भिडियो फाइल रोज्नुहोस्</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 5 * 1024 * 1024) {
                                        alert('चेतावनी: यो भिडियो फाइल ५ MB भन्दा ठूलो छ। धेरै ठूलो फाइलले ब्राउजरको LocalStorage सीमा नाघ्न सक्छ। कृपया २-३ MB सम्मको छोटो क्लिप मात्र अपलोड गर्नुहोस्, वा भिडियो युट्युबमा हालेर यसको Embed लिङ्क राख्नुहोस्।');
                                      }
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const base64String = event.target?.result as string;
                                        setEditingItem({
                                          ...editingItem,
                                          mediaUrl: base64String
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              <p className="text-[10px] text-slate-400">MP4, WebM वा OGG फाइल स्वीकार्य छ।</p>
                            </div>
                          </div>
                          <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded-lg text-[10px] text-amber-300">
                            <strong>सुझाव:</strong> ठूला भिडियोहरू युट्युबमा अपलोड गरेर त्यसको Embed लिङ्क राख्नु नै सबैभन्दा राम्रो र छिटो लोड हुने उपाय हो।
                          </div>
                        </div>
                      </div>

                      {/* Video Thumbnail Image Uploader */}
                      <ImageUploader
                        label="भिडियोको लागि थम्बनेल तस्बिर (Video Thumbnail Image)"
                        currentImageUrl={editingItem.thumbnailUrl || ''}
                        onImageUploaded={(url) => setEditingItem({ ...editingItem, thumbnailUrl: url })}
                        onImageRemoved={() => setEditingItem({ ...editingItem, thumbnailUrl: '' })}
                        maxWidth={640}
                        maxHeight={360}
                        aspectRatio="video"
                      />
                    </div>
                  )}
                </div>
              ) : modalType === 'map' ? (
                /* Sleek Custom Compact Map Edit Form */
                <div className="space-y-3 text-xs text-left">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">नक्साको शीर्षक (नेपाली) (Title Nepali)</label>
                    <input
                      type="text"
                      value={editingItem.titleNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, titleNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">नक्साको शीर्षक (English)</label>
                      <input
                        type="text"
                        value={editingItem.titleEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">श्रेणी (Category)</label>
                      <input
                        type="text"
                        value={editingItem.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">नक्साको विवरण (Nepali Description)</label>
                    <textarea
                      rows={2}
                      value={editingItem.descriptionNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, descriptionNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">मुख्य ASCII रेखाचित्र (ASCII Diagram Layout)</label>
                    <textarea
                      rows={8}
                      value={editingItem.asciiDiagram || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, asciiDiagram: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-[10px] leading-tight text-cyan-300 whitespace-pre overflow-x-auto"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">अतिरिक्त नोट / सन्देश (Notes Nepali)</label>
                    <input
                      type="text"
                      value={editingItem.notesNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, notesNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-amber-300"
                    />
                  </div>

                  {/* Map JPG Image Upload */}
                  <ImageUploader
                    label="नक्सा तस्बिर (JPG/PNG Map Image Upload)"
                    currentImageUrl={editingItem.imageUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                    maxWidth={1200}
                    maxHeight={1200}
                    aspectRatio="video"
                  />

                  {/* Map PDF File Upload */}
                  <div className="bg-slate-950 border border-rose-500/30 p-3 rounded-xl space-y-2">
                    <label className="text-rose-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span>नक्सा PDF फाइल (Map PDF File)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {editingItem.pdfUrl && (
                        <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center flex-shrink-0 text-rose-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          <span className="text-[8px] uppercase font-bold mt-0.5">PDF Uploaded</span>
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="PDF URL वा Base64 कोड"
                          value={editingItem.pdfUrl || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, pdfUrl: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-[10px] font-mono"
                        />
                        <div className="flex items-center gap-1.5">
                          <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 shadow">
                            <span>कम्प्युटरबाट अपलोड (Upload PDF)</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (uploadEvent) => {
                                    const base64String = uploadEvent.target?.result as string;
                                    setEditingItem({ ...editingItem, pdfUrl: base64String });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend Items Sub-Editor */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>संकेतहरू (Legend Items)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLegend = [...(editingItem.legendItems || []), { label: '', color: '#38bdf8' }];
                          setEditingItem({ ...editingItem, legendItems: updatedLegend });
                        }}
                        className="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded text-[10px] font-bold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {editingItem.legendItems?.map((legend: any, lIdx: number) => (
                        <div key={lIdx} className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                          <input
                            type="color"
                            value={legend.color || '#38bdf8'}
                            onChange={(e) => {
                              const updatedLegend = [...editingItem.legendItems];
                              updatedLegend[lIdx] = { ...legend, color: e.target.value };
                              setEditingItem({ ...editingItem, legendItems: updatedLegend });
                            }}
                            className="w-6 h-6 border-0 rounded bg-transparent shrink-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="विवरण (e.g. 50-pair Cable)"
                            value={legend.label || ''}
                            onChange={(e) => {
                              const updatedLegend = [...editingItem.legendItems];
                              updatedLegend[lIdx] = { ...legend, label: e.target.value };
                              setEditingItem({ ...editingItem, legendItems: updatedLegend });
                            }}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedLegend = editingItem.legendItems.filter((_: any, i: number) => i !== lIdx);
                              setEditingItem({ ...editingItem, legendItems: updatedLegend });
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
              ) : (modalType === 'note' || modalType === 'level1' || modalType === 'level2') ? (
                /* Dedicated Comprehensive Manual Chapter Editor */
                <div className="space-y-4 text-xs text-left">
                  {/* Top Bar: Chapter Number, Category, Page Ref */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-amber-400 font-bold block mb-1">खण्ड / अध्याय नं. (Chapter No.)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.chapterNumber || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, chapterNumber: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold"
                        placeholder="उदा: खण्ड १ वा Chapter 1"
                      />
                    </div>
                    <div>
                      <label className="text-cyan-400 font-bold block mb-1">विषयगत श्रेणी (Category)</label>
                      <select
                        value={editingItem.category || 'osp_telecom'}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                      >
                        <option value="osp_telecom">OSP तथा टेलिफोन नेटवर्क</option>
                        <option value="optical_fiber">अप्टिकल फाइबर र FTTH</option>
                        <option value="wireless_satellite">मोबाइल, रेडियो र स्याटेलाइट</option>
                        <option value="networking">कम्प्युटर नेटवर्किङ र IP</option>
                        <option value="electrical">विद्युत, ब्याट्री र अर्थिङ</option>
                        <option value="electronics">इलेक्ट्रोनिक्स र लजिक गेट्स</option>
                        <option value="safety_tools">सुरक्षा, औजार र A/C</option>
                        <option value="ntc_standards">NTC मापदण्ड र प्रयोगात्मक</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">म्यानुअल पृष्ठ (Page Reference)</label>
                      <input
                        type="text"
                        value={editingItem.pageRef || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, pageRef: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono"
                        placeholder="उदा: म्यानुअल पृष्ठ: १-३"
                      />
                    </div>
                  </div>

                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-white font-bold block mb-1">अध्याय शीर्षक (नेपालीमा)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.titleNepali || editingItem.title || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleNepali: e.target.value, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                        placeholder="उदा: टेलिफोन एक्सचेन्ज र OSP नेटवर्क"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Title in English</label>
                      <input
                        type="text"
                        value={editingItem.titleEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        placeholder="e.g. Telephone Exchange and OSP Network"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">
                      संक्षिप्त प्राविधिक सारसंक्षेप (Chapter Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.summaryNepali || editingItem.summary || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, summaryNepali: e.target.value, summary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs leading-relaxed"
                      placeholder="यो अध्यायको संक्षिप्त सार..."
                    />
                  </div>

                  {/* Key Points (Array of Strings) */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>मुख्य प्राविधिक बुँदाहरू (Key Points - {editingItem.keyPoints?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingItem.keyPoints || []), ''];
                          setEditingItem({ ...editingItem, keyPoints: updated });
                        }}
                        className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> नयाँ बुँदा थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(editingItem.keyPoints || []).map((point: string, pIdx: number) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-500/80 font-bold w-4 text-center">{pIdx + 1}.</span>
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const updated = [...(editingItem.keyPoints || [])];
                              updated[pIdx] = e.target.value;
                              setEditingItem({ ...editingItem, keyPoints: updated });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                            placeholder="प्राविधिक बुँदा लेख्नुहोस्..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingItem.keyPoints || []).filter((_: any, i: number) => i !== pIdx);
                              setEditingItem({ ...editingItem, keyPoints: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(!editingItem.keyPoints || editingItem.keyPoints.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic py-1">कुनै मुख्य बुँदा छैन। माथिको बटन थिचेर थप्नुहोस्।</p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Content (Markdown) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold block">
                        विस्तृत नोट तथा अध्ययन सामग्री (Detailed Markdown / Notes Content)
                      </label>
                      <span className="text-[10px] text-cyan-400 font-mono">Markdown समर्थित (#, ##, -, *, Tables)</span>
                    </div>
                    <textarea
                      rows={10}
                      value={editingItem.contentNepali || editingItem.content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contentNepali: e.target.value, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                      placeholder="### १. विस्तृत विषयवस्तु&#10;यहाँ पूर्ण प्राविधिक सिद्धान्त, नियमहरू तथा व्याख्या लेख्नुहोस्..."
                    />
                  </div>

                  {/* Exam Highlights (Array of Strings) */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>परीक्षा हाइलाइट्स तथा सम्भावित प्रश्नहरू (Exam Highlights - {editingItem.examHighlights?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingItem.examHighlights || []), ''];
                          setEditingItem({ ...editingItem, examHighlights: updated });
                        }}
                        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> हाइलाइट थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(editingItem.examHighlights || []).map((highlight: string, hIdx: number) => (
                        <div key={hIdx} className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-500/80 font-bold w-4 text-center">★</span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const updated = [...(editingItem.examHighlights || [])];
                              updated[hIdx] = e.target.value;
                              setEditingItem({ ...editingItem, examHighlights: updated });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                            placeholder="परीक्षामा बारम्बार सोधिने प्रश्न वा महत्वपूर्ण तथ्य..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingItem.examHighlights || []).filter((_: any, i: number) => i !== hIdx);
                              setEditingItem({ ...editingItem, examHighlights: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(!editingItem.examHighlights || editingItem.examHighlights.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic py-1">कुनै परीक्षा हाइलाइट छैन।</p>
                      )}
                    </div>
                  </div>

                  {/* Formula List (Objects with name, formula, explanation) */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-purple-400 font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>महत्वपूर्ण प्राविधिक सूत्रहरू (Formulas - {editingItem.formulaList?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingItem.formulaList || []), { name: '', formula: '', explanation: '' }];
                          setEditingItem({ ...editingItem, formulaList: updated });
                        }}
                        className="px-2 py-0.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> नयाँ सूत्र थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {(editingItem.formulaList || []).map((fItem: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingItem.formulaList || []).filter((_: any, i: number) => i !== fIdx);
                              setEditingItem({ ...editingItem, formulaList: updated });
                            }}
                            className="absolute right-2 top-2 text-rose-400 hover:text-rose-300 p-1"
                            title="हटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">सूत्रको नाम (Formula Name)</label>
                              <input
                                type="text"
                                value={fItem.name || ''}
                                onChange={(e) => {
                                  const updated = [...(editingItem.formulaList || [])];
                                  updated[fIdx] = { ...fItem, name: e.target.value };
                                  setEditingItem({ ...editingItem, formulaList: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                                placeholder="उदा: ओहमको नियम (Ohm's Law)"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-purple-300 block mb-0.5">सूत्र (Formula Equation)</label>
                              <input
                                type="text"
                                value={fItem.formula || ''}
                                onChange={(e) => {
                                  const updated = [...(editingItem.formulaList || [])];
                                  updated[fIdx] = { ...fItem, formula: e.target.value };
                                  setEditingItem({ ...editingItem, formulaList: updated });
                                }}
                                className="w-full bg-slate-950 border border-purple-500/40 rounded-lg px-2 py-1 text-purple-300 font-mono font-bold text-xs"
                                placeholder="उदा: V = I × R वा Attenuation = α × L"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">व्याख्या / एकाइ (Explanation / Units)</label>
                            <input
                              type="text"
                              value={fItem.explanation || ''}
                              onChange={(e) => {
                                const updated = [...(editingItem.formulaList || [])];
                                updated[fIdx] = { ...fItem, explanation: e.target.value };
                                setEditingItem({ ...editingItem, formulaList: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                              placeholder="उदा: V = भोल्टेज (Volt), I = करेन्ट (Ampere), R = रेसिस्टेन्स (Ohm)"
                            />
                          </div>
                        </div>
                      ))}
                      {(!editingItem.formulaList || editingItem.formulaList.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic py-1">कुनै सूत्र समावेश गरिएको छैन।</p>
                      )}
                    </div>
                  </div>

                  {/* Viva Questions (Objects with question, answer) */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-blue-400 font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>अन्तर्वार्ता तथा मौखिक प्रश्नोत्तर (Viva Questions - {editingItem.vivaQuestions?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingItem.vivaQuestions || []), { question: '', answer: '' }];
                          setEditingItem({ ...editingItem, vivaQuestions: updated });
                        }}
                        className="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> नयाँ Viva प्रश्न थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {(editingItem.vivaQuestions || []).map((vItem: any, vIdx: number) => (
                        <div key={vIdx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingItem.vivaQuestions || []).filter((_: any, i: number) => i !== vIdx);
                              setEditingItem({ ...editingItem, vivaQuestions: updated });
                            }}
                            className="absolute right-2 top-2 text-rose-400 hover:text-rose-300 p-1"
                            title="हटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="pr-6">
                            <label className="text-[10px] text-blue-300 font-bold block mb-0.5">प्रश्न (Question #{vIdx + 1})</label>
                            <input
                              type="text"
                              value={vItem.question || ''}
                              onChange={(e) => {
                                const updated = [...(editingItem.vivaQuestions || [])];
                                updated[vIdx] = { ...vItem, question: e.target.value };
                                setEditingItem({ ...editingItem, vivaQuestions: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold"
                              placeholder="उदा: FTTH मा सामान्यतया कति स्प्लिटर रेसियो प्रयोग गरिन्छ?"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">उत्तर (Expected Answer)</label>
                            <textarea
                              rows={2}
                              value={vItem.answer || ''}
                              onChange={(e) => {
                                const updated = [...(editingItem.vivaQuestions || [])];
                                updated[vIdx] = { ...vItem, answer: e.target.value };
                                setEditingItem({ ...editingItem, vivaQuestions: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-emerald-300 text-xs"
                              placeholder="उदा: सामान्यतया 1:8, 1:16 वा 1:32 को PLC स्प्लिटर प्रयोग हुन्छ..."
                            />
                          </div>
                        </div>
                      ))}
                      {(!editingItem.vivaQuestions || editingItem.vivaQuestions.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic py-1">कुनै Viva प्रश्न छैन।</p>
                      )}
                    </div>
                  </div>

                  {/* Diagrams List (Objects with title, type, data, caption) */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>प्राविधिक रेखाचित्र र डायग्रामहरू (Diagrams & Flowcharts - {editingItem.diagrams?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(editingItem.diagrams || []),
                            {
                              title: 'नयाँ रेखाचित्र',
                              type: 'box',
                              data: '[ब्लक १] ---> [ब्लक २] ---> [ब्लक ३]',
                              caption: 'रेखाचित्र विवरण...'
                            }
                          ];
                          setEditingItem({ ...editingItem, diagrams: updated });
                        }}
                        className="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> नयाँ डायग्राम थप्नुहोस्
                      </button>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {(editingItem.diagrams || []).map((diag: any, dIdx: number) => (
                        <div key={dIdx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingItem.diagrams || []).filter((_: any, i: number) => i !== dIdx);
                              setEditingItem({ ...editingItem, diagrams: updated });
                            }}
                            className="absolute right-2.5 top-2.5 text-rose-400 hover:text-rose-300 p-1"
                            title="डायग्राम हटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                            <div>
                              <label className="text-[10px] text-white font-bold block mb-0.5">डायग्राम शीर्षक (Title)</label>
                              <input
                                type="text"
                                value={diag.title || ''}
                                onChange={(e) => {
                                  const updated = [...(editingItem.diagrams || [])];
                                  updated[dIdx] = { ...diag, title: e.target.value };
                                  setEditingItem({ ...editingItem, diagrams: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                                placeholder="उदा: OLT देखि ONT सम्मको सिग्नल प्रवाह"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-cyan-400 font-bold block mb-0.5">डायग्राम प्रकार (Diagram Type)</label>
                              <select
                                value={diag.type || 'box'}
                                onChange={(e) => {
                                  const updated = [...(editingItem.diagrams || [])];
                                  updated[dIdx] = { ...diag, type: e.target.value };
                                  setEditingItem({ ...editingItem, diagrams: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                              >
                                <option value="box">बक्स / ब्लक डायग्राम (Box Diagram)</option>
                                <option value="ascii">ASCII आर्ट / कोड डायग्राम (ASCII Text)</option>
                                <option value="flow">फ्लोचार्ट (Flowchart)</option>
                                <option value="svg">SVG कोड (Vector Graphics)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-300 font-mono block mb-0.5">
                              डायग्राम डेटा / कोड / रेखाचित्र (Diagram Data)
                            </label>
                            <textarea
                              rows={4}
                              value={diag.data || ''}
                              onChange={(e) => {
                                const updated = [...(editingItem.diagrams || [])];
                                updated[dIdx] = { ...diag, data: e.target.value };
                                setEditingItem({ ...editingItem, diagrams: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-cyan-300 text-[11px] font-mono whitespace-pre overflow-x-auto leading-tight focus:outline-none focus:border-cyan-500"
                              placeholder="[OLT] ──(Feeder)──> [FDC] ──(Distribution)──> [FAT] ──(Drop)──> [ONT]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">क्याप्सन / व्याख्या (Caption)</label>
                            <input
                              type="text"
                              value={diag.caption || ''}
                              onChange={(e) => {
                                const updated = [...(editingItem.diagrams || [])];
                                updated[dIdx] = { ...diag, caption: e.target.value };
                                setEditingItem({ ...editingItem, diagrams: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-xs"
                              placeholder="उदा: चित्र १.१: अप्टिकल नेटवर्कको पूर्ण सिग्नल प्रवाह ढाँचा"
                            />
                          </div>
                        </div>
                      ))}
                      {(!editingItem.diagrams || editingItem.diagrams.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic py-1">कुनै रेखाचित्र छैन।</p>
                      )}
                    </div>
                  </div>

                  {/* Chapter Image / Photo Uploader */}
                  <ImageUploader
                    label="खण्डको तस्बिर / फोटो (Chapter Illustration Photo)"
                    currentImageUrl={editingItem.imageUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                    maxWidth={900}
                    maxHeight={800}
                    aspectRatio="video"
                  />
                </div>
              ) : modalType === 'symbol' ? (
                /* Dedicated Symbol Editor */
                <div className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-amber-400 font-bold block mb-1">संकेत चिन्ह / Symbol Char</label>
                      <input
                        type="text"
                        required
                        value={editingItem.symbol || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, symbol: e.target.value })}
                        className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-extrabold text-xl text-center"
                        placeholder="उदा: ⏚ वा ⚡ वा ⊗"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-white font-bold block mb-1">संकेतको नाम (नेपालीमा)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.nameNepali || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, nameNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                        placeholder="उदा: ग्राउन्डिङ / अर्थिङ संकेत"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">विस्तृत प्राविधिक विवरण र प्रयोग</label>
                    <textarea
                      rows={4}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
                      placeholder="यो संकेतको अर्थ, नक्सा वा डायग्राममा प्रयोग हुने तरिका र मापदण्ड..."
                    />
                  </div>

                  {/* Symbol Image Uploader */}
                  <ImageUploader
                    label="संकेतको तस्बिर / फोटो (Symbol Illustration Photo)"
                    currentImageUrl={editingItem.imageUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                    maxWidth={600}
                    maxHeight={600}
                    aspectRatio="square"
                  />
                </div>
              ) : (modalType === 'spotting' || modalType === 'spotting2083' || modalType === 'level2-spotting') ? (
                /* Dedicated Spotting Item Editor */
                <div className="space-y-4 text-xs text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white font-bold block mb-1">नाम (नेपालीमा) / Name (Nepali)</label>
                      <input
                        type="text"
                        value={editingItem.nameNepali || editingItem.itemName || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, nameNepali: e.target.value, itemName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                        placeholder="उदा: पिलास (Pliers)"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">अंग्रेजी नाम (English Name)</label>
                      <input
                        type="text"
                        value={editingItem.nameEnglish || editingItem.itemName || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, nameEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
                        placeholder="e.g. Pliers"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-purple-400 font-bold block mb-1">वर्ग / Category</label>
                      <input
                        type="text"
                        value={editingItem.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-2 text-purple-100"
                        placeholder="उदा: हातहतियार (Hand Tools)"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-400 font-bold block mb-1">अंग्रेजी उद्देश्य (English Purpose)</label>
                      <input
                        type="text"
                        value={editingItem.purposeEnglish || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, purposeEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-100"
                        placeholder="English Purpose"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-emerald-400 font-bold block mb-1">उद्देश्य / प्रयोग (Purpose - Nepali)</label>
                    <textarea
                      rows={3}
                      value={editingItem.purposeNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, purposeNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-100"
                      placeholder="यस औजारको मुख्य काम के हो?"
                    />
                  </div>

                  <div>
                    <label className="text-amber-400 font-bold block mb-1">सुझाव / टिप (Tip)</label>
                    <textarea
                      rows={2}
                      value={editingItem.tipNepali || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, tipNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-100"
                      placeholder="विद्यार्थीलाई सुझाव"
                    />
                  </div>

                  {/* Photo Upload for Spotting Item */}
                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-blue-400 font-bold block mb-2 text-sm">औजारको तस्बिर (Tool Image Upload)</label>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <ImageUploader
                        label="तस्बिर छान्नुहोस् / Upload Photo"
                        currentImageUrl={editingItem.imageUrl || ''}
                        onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                        onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                        maxWidth={800}
                      />
                    </div>
                  </div>
                </div>
              ) : modalType === 'ntc_number' ? (
                /* Dedicated NTC Shortcode Editor */
                <div className="space-y-3.5 text-xs text-left">
                  <div>
                    <label className="text-emerald-400 font-bold block mb-1">सर्टकोड / फोन नम्बर (Shortcode Number)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.number || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, number: e.target.value })}
                      className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-emerald-300 font-mono font-extrabold text-lg"
                      placeholder="उदा: 198 वा 1498 वा 197"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold block mb-1">सेवा तथा विवरण (Service Description)</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.service || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, service: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed font-semibold"
                      placeholder="उदा: FTTH, ADSL तथा टेलिफोन मर्मत तथा कम्प्लेन दर्ता..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {/* Dedicated Direct Photo Upload Box */}
                  <ImageUploader
                    label="तस्बिर सिधा अपलोड गर्नुहोस् (Direct Photo Upload)"
                    currentImageUrl={editingItem.imageUrl || ''}
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    onImageRemoved={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                    maxWidth={900}
                    maxHeight={800}
                    aspectRatio="auto"
                  />

                  {/* Dynamic form rendering based on keys of editingItem */}
                  {Object.keys(editingItem).map((key) => {
                    const val = editingItem[key];
                    if (key === 'id' || key === 'imageUrl') return null; // handled above or locked
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-slate-300 font-semibold capitalize flex items-center justify-between">
                          <span>{key}</span>
                          <span className="text-[10px] text-slate-500 font-normal">{typeof val}</span>
                        </label>
                        {Array.isArray(val) ? (
                          <input
                            type="text"
                            value={val.join(', ')}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              [key]: e.target.value.split(',').map((s: string) => s.trim())
                            })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                            placeholder="comma separated values"
                          />
                        ) : typeof val === 'boolean' ? (
                          <select
                            value={val ? 'true' : 'false'}
                            onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value === 'true' })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : typeof val === 'number' ? (
                          <input
                            type="number"
                            value={val}
                            onChange={(e) => setEditingItem({ ...editingItem, [key]: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        ) : (
                          <div className="space-y-1.5">
                            <textarea
                              rows={key === 'asciiDiagram' ? 6 : String(val || '').length > 80 ? 3 : 1}
                              value={val || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                              className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white ${
                                key === 'asciiDiagram' ? 'font-mono text-cyan-300 text-[11px] leading-snug whitespace-pre overflow-x-auto' : ''
                              }`}
                            />
                            {key === 'imageUrl' && modalType === 'tool' && (
                              <div className="flex items-center gap-2 mt-1">
                                <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                  <span>फोटो कम्प्युटरबाट अपलोड गर्नुहोस् (Upload File)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const base64String = await compressAndProcessImage(file, 900, 900, 0.85);
                                          setEditingItem({ ...editingItem, imageUrl: base64String });
                                        } catch (err) {
                                          console.error('Image compression error:', err);
                                          alert('तस्बिर प्रोसेस गर्दा त्रुटि भयो।');
                                        }
                                      }
                                    }}
                                  />
                                </label>
                                <span className="text-[10px] text-slate-400">तस्बिर छानेर सिधै राख्नुहोस्</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              </div> {/* Close Scrollable Container */}

              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 border-t border-slate-800 bg-slate-900/90 shrink-0">
                {modalType === 'blog' && editingItem?.id && (
                  <button
                    type="button"
                    onClick={() => setBlogToDelete({ id: editingItem.id, title: editingItem.titleNepali || '' })}
                    className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>हटाउनुहोस् (Delete)</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    title="रद्द गरेर बन्द गर्नुहोस् (ESC)"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>रद्द / बन्द (Close)</span>
                  </button>
                <button
                  onClick={() => {
                    let finalItem = editingItem;
                    if (isJsonMode) {
                      try {
                        finalItem = JSON.parse(editingJsonText);
                      } catch (err) {
                        alert('अमान्य JSON ढाँचा (Invalid JSON)');
                        return;
                      }
                    }

                    if (modalType === 'course') {
                      const exists = courses.some((c: any) => c.id === finalItem.id);
                      const updated = exists
                        ? courses.map((c: any) => c.id === finalItem.id ? finalItem : c)
                        : [finalItem, ...courses];
                      setCourses(updated);
                      saveToCloud('nitvt_courses', updated);
                    } else if (modalType === 'tool') {
                      const exists = tools.some((t: any) => t.id === finalItem.id);
                      const updated = exists
                        ? tools.map((t: any) => t.id === finalItem.id ? finalItem : t)
                        : [finalItem, ...tools];
                      setTools(updated);
                      saveToCloud('nitvt_tools', updated);
                    } else if (modalType === 'note') {
                      const exists = notes.some((n: any) => n.id === finalItem.id);
                      const updated = exists
                        ? notes.map((n: any) => n.id === finalItem.id ? finalItem : n)
                        : [finalItem, ...notes];
                      setNotes(updated);
                      saveToCloud('nitvt_notes', updated);
                    } else if (modalType === 'symbol') {
                      const exists = symbols.some((s: any) => (s.id && s.id === finalItem.id) || s.symbol === finalItem.symbol);
                      const updated = exists
                        ? symbols.map((s: any) => ((s.id && s.id === finalItem.id) || s.symbol === finalItem.symbol) ? finalItem : s)
                        : [finalItem, ...symbols];
                      setSymbols(updated);
                      saveToCloud('nitvt_symbols', updated);
                    } else if (modalType === 'ntc_number') {
                      const exists = ntcNumbers.some((n: any) => n.number === finalItem.number);
                      const updated = exists
                        ? ntcNumbers.map((n: any) => n.number === finalItem.number ? finalItem : n)
                        : [finalItem, ...ntcNumbers];
                      setNtcNumbers(updated);
                      saveToCloud('nitvt_ntc_numbers', updated);
                    } else if (modalType === 'exam') {
                      const exists = exams.some((ex: any) => ex.id === finalItem.id);
                      const updated = exists
                        ? exams.map((ex: any) => ex.id === finalItem.id ? finalItem : ex)
                        : [finalItem, ...exams];
                      setExams(updated);
                      saveToCloud('nitvt_exams', updated);
                    } else if (modalType === 'exam2083') {
                      const exists = exams2083.some((ex: any) => ex.id === finalItem.id);
                      const updated = exists
                        ? exams2083.map((ex: any) => ex.id === finalItem.id ? finalItem : ex)
                        : [finalItem, ...exams2083];
                      setExams2083(updated);
                      saveToCloud('nitvt_exams_2083', updated);
                    } else if (modalType === 'matching') {
                      const exists = matchingExams.some((m: any) => m.id === finalItem.id);
                      const updated = exists
                        ? matchingExams.map((m: any) => m.id === finalItem.id ? finalItem : m)
                        : [finalItem, ...matchingExams];
                      setMatchingExams(updated);
                      saveToCloud('nitvt_matching_exams', updated);
                    } else if (modalType === 'matching2083') {
                      const exists = matching2083Exams.some((m: any) => m.groupName === finalItem.groupName);
                      const updated = exists
                        ? matching2083Exams.map((m: any) => m.groupName === finalItem.groupName ? finalItem : m)
                        : [finalItem, ...matching2083Exams];
                      setMatching2083Exams(updated);
                      saveToCloud('nitvt_matching_2083', updated);
                    } else if (modalType === 'spotting') {
                      const exists = spottingExams.some((s: any) => s.id === finalItem.id);
                      const updated = exists
                        ? spottingExams.map((s: any) => s.id === finalItem.id ? finalItem : s)
                        : [finalItem, ...spottingExams];
                      setSpottingExams(updated);
                      // Save to Firestore & local storage
                      saveToCloud('nitvt_spotting_exams', updated);
                      import('firebase/firestore').then(async ({ doc, setDoc }) => {
                        const { db } = await import('../lib/firebase');
                        await setDoc(doc(db, 'spottingItems', 'spotting_exams'), { items: updated });
                      }).catch(e => console.error('Firestore save failed', e));
                    } else if (modalType === 'spotting2083') {
                      const key = finalItem.sheetKey || 'sheet1';
                      const cleanItem = { ...finalItem };
                      delete cleanItem.sheetKey;
                      const currentSheet = spotting2083Exams[key] || [];
                      const exists = currentSheet.some((s: any) => s.id === cleanItem.id);
                      const updatedSheet = exists ? currentSheet.map((s: any) => s.id === cleanItem.id ? cleanItem : s) : [cleanItem, ...currentSheet];
                      const updated = { ...spotting2083Exams, [key]: updatedSheet };
                      setSpotting2083Exams(updated);
                      // Save to Firestore & local storage
                      saveToCloud('nitvt_spotting_2083', updated);
                      import('firebase/firestore').then(async ({ doc, setDoc }) => {
                        const { db } = await import('../lib/firebase');
                        await setDoc(doc(db, 'spottingItems', 'spotting_2083'), { items: updated });
                      }).catch(e => console.error('Firestore save failed', e));
                    } else if (modalType === 'subjective') {
                      const exists = subjectiveExams.some((s: any) => s.id === finalItem.id);
                      const updated = exists
                        ? subjectiveExams.map((s: any) => s.id === finalItem.id ? finalItem : s)
                        : [finalItem, ...subjectiveExams];
                      setSubjectiveExams(updated);
                      saveToCloud('nitvt_subjective_exams', updated);
                    } else if (modalType === 'subjective2083') {
                      const exists = subjective2083Exams.some((s: any) => s.id === finalItem.id);
                      const updated = exists
                        ? subjective2083Exams.map((s: any) => s.id === finalItem.id ? finalItem : s)
                        : [finalItem, ...subjective2083Exams];
                      setSubjective2083Exams(updated);
                      saveToCloud('nitvt_subjective_2083', updated);
                    } else if (modalType === 'viva') {
                      const exists = vivaExams.some((v: any) => v.id === finalItem.id);
                      const updated = exists
                        ? vivaExams.map((v: any) => v.id === finalItem.id ? finalItem : v)
                        : [finalItem, ...vivaExams];
                      setVivaExams(updated);
                      saveToCloud('nitvt_viva_exams', updated);
                    } else if (modalType === 'viva2083') {
                      const key = finalItem.sheetKey || 'sheet1';
                      const cleanItem = { ...finalItem };
                      delete cleanItem.sheetKey;
                      const currentSheet = viva2083Exams[key] || [];
                      const exists = currentSheet.some((v: any) => v.id === cleanItem.id);
                      const updatedSheet = exists ? currentSheet.map((v: any) => v.id === cleanItem.id ? cleanItem : v) : [cleanItem, ...currentSheet];
                      const updated = { ...viva2083Exams, [key]: updatedSheet };
                      setViva2083Exams(updated);
                      saveToCloud('nitvt_viva_2083', updated);
                    } else if (modalType === 'handbook') {
                      const exists = handbookExams.some((h: any) => h.id === finalItem.id);
                      const updated = exists
                        ? handbookExams.map((h: any) => h.id === finalItem.id ? finalItem : h)
                        : [finalItem, ...handbookExams];
                      setHandbookExams(updated);
                      saveToCloud('nitvt_handbook_qa', updated);
                    } else if (modalType === 'abbrev') {
                      const exists = abbrevExams.some((a: any) => a.abbreviation === finalItem.abbreviation);
                      const updated = exists
                        ? abbrevExams.map((a: any) => a.abbreviation === finalItem.abbreviation ? finalItem : a)
                        : [finalItem, ...abbrevExams];
                      setAbbrevExams(updated);
                      saveToCloud('nitvt_abbreviations', updated);
                    } else if (modalType === 'practical') {
                      const sheetIdx = (finalItem.sheetIdx || 1) - 1;
                      const cleanItem = { ...finalItem };
                      delete cleanItem.sheetIdx;
                      const sheets = Array.isArray(practicalExams) ? [...practicalExams] : [[], [], []];
                      const currentSheet = sheets[sheetIdx] || [];
                      const exists = currentSheet.some((p: any) => p.id === cleanItem.id);
                      sheets[sheetIdx] = exists ? currentSheet.map((p: any) => p.id === cleanItem.id ? cleanItem : p) : [...currentSheet, cleanItem];
                      setPracticalExams(sheets);
                      saveToCloud('nitvt_practical_sheets', sheets);
                    } else if (modalType === 'level1') {
                      const exists = level1Notes.some((n: any) => n.id === finalItem.id);
                      const updated = exists
                        ? level1Notes.map((n: any) => n.id === finalItem.id ? finalItem : n)
                        : [finalItem, ...level1Notes];
                      setLevel1Notes(updated);
                      saveToCloud('nitvt_level1_notes', updated);
                    } else if (modalType === 'level1-practical') {
                      const targetIdx = finalItem._targetIndex !== undefined ? finalItem._targetIndex : -1;
                      const cleanItem = { ...finalItem };
                      delete cleanItem._targetIndex;
                      const updated = targetIdx >= 0 && targetIdx < level1PracticalSetsState.length
                        ? level1PracticalSetsState.map((s: any, idx: number) => idx === targetIdx ? cleanItem : s)
                        : [cleanItem, ...level1PracticalSetsState];
                      setLevel1PracticalSetsState(updated);
                      saveToCloud('nitvt_level1_practicals', updated);
                    } else if (modalType === 'level1-viva') {
                      const exists = level1VivaState.some((v: any) => v.id === finalItem.id);
                      const updated = exists
                        ? level1VivaState.map((v: any) => v.id === finalItem.id ? finalItem : v)
                        : [finalItem, ...level1VivaState];
                      setLevel1VivaState(updated);
                      saveToCloud('nitvt_level1_viva', updated);
                    } else if (modalType === 'level1-knot') {
                      const targetIdx = finalItem._targetIndex !== undefined ? finalItem._targetIndex : -1;
                      const cleanItem = { ...finalItem };
                      delete cleanItem._targetIndex;
                      const updated = targetIdx >= 0 && targetIdx < level1KnotsState.length
                        ? level1KnotsState.map((k: any, idx: number) => idx === targetIdx ? cleanItem : k)
                        : [cleanItem, ...level1KnotsState];
                      setLevel1KnotsState(updated);
                      saveToCloud('nitvt_level1_knots', updated);
                    } else if (modalType === 'level2') {
                      const exists = level2Notes.some((n: any) => n.id === finalItem.id);
                      const updated = exists
                        ? level2Notes.map((n: any) => n.id === finalItem.id ? finalItem : n)
                        : [finalItem, ...level2Notes];
                      setLevel2Notes(updated);
                      saveToCloud('nitvt_level2_notes', updated);
                    } else if (modalType === 'level2-mcq') {
                      const questions = level2ExamPaperState.objectiveSection?.questions || [];
                      const exists = questions.some((q: any) => q.qNo === finalItem.qNo);
                      const updatedQuestions = exists
                        ? questions.map((q: any) => q.qNo === finalItem.qNo ? finalItem : q)
                        : [...questions, finalItem];
                      const updatedExamPaper = {
                        ...level2ExamPaperState,
                        objectiveSection: {
                          ...level2ExamPaperState.objectiveSection,
                          questions: updatedQuestions
                        }
                      };
                      setLevel2ExamPaperState(updatedExamPaper);
                      saveToCloud('nitvt_level2_exam_paper', updatedExamPaper);
                    } else if (modalType === 'level2-subjective') {
                      const questions = level2ExamPaperState.subjectiveSection?.questions || [];
                      const exists = questions.some((q: any) => q.qNo === finalItem.qNo);
                      const updatedQuestions = exists
                        ? questions.map((q: any) => q.qNo === finalItem.qNo ? finalItem : q)
                        : [...questions, finalItem];
                      const updatedExamPaper = {
                        ...level2ExamPaperState,
                        subjectiveSection: {
                          ...level2ExamPaperState.subjectiveSection,
                          questions: updatedQuestions
                        }
                      };
                      setLevel2ExamPaperState(updatedExamPaper);
                      saveToCloud('nitvt_level2_exam_paper', updatedExamPaper);
                    } else if (modalType === 'level2-matching') {
                      const groups = level2ExamPaperState.matchingSection || [];
                      const targetIdx = finalItem._targetIndex !== undefined ? finalItem._targetIndex : -1;
                      const cleanItem = { ...finalItem };
                      delete cleanItem._targetIndex;
                      let updatedGroups: any[];
                      if (targetIdx >= 0 && targetIdx < groups.length) {
                        updatedGroups = [...groups];
                        updatedGroups[targetIdx] = cleanItem;
                      } else {
                        const exists = groups.some((g: any) => g.groupTitle === cleanItem.groupTitle);
                        updatedGroups = exists
                          ? groups.map((g: any) => g.groupTitle === cleanItem.groupTitle ? cleanItem : g)
                          : [...groups, cleanItem];
                      }
                      const updatedExamPaper = {
                        ...level2ExamPaperState,
                        matchingSection: updatedGroups
                      };
                      setLevel2ExamPaperState(updatedExamPaper);
                      saveToCloud('nitvt_level2_exam_paper', updatedExamPaper);
                    } else if (modalType === 'level2-spotting') {
                      const items = level2ExamPaperState.spottingSection || [];
                      const exists = items.some((s: any) => s.id === finalItem.id);
                      const updatedItems = exists
                        ? items.map((s: any) => s.id === finalItem.id ? finalItem : s)
                        : [...items, finalItem];
                      const updatedExamPaper = {
                        ...level2ExamPaperState,
                        spottingSection: updatedItems
                      };
                      setLevel2ExamPaperState(updatedExamPaper);
                      saveToCloud('nitvt_level2_exam_paper', updatedExamPaper);
                      
                      // Save to Firestore collection
                      const saveToFirestore = async (items: any) => {
                        try {
                          const { doc, setDoc } = await import('firebase/firestore');
                          const { db } = await import('../lib/firebase');
                          const docRef = doc(db, 'spottingItems', 'level2_spotting');
                          await setDoc(docRef, { items: items });
                        } catch (e) {
                          console.error('Error saving spotting items to Firestore:', e);
                        }
                      };
                      saveToFirestore(updatedItems);
                    } else if (modalType === 'level2-practical') {
                      const tasks = level2ExamPaperState.practicalAssignments || [];
                      const exists = tasks.some((t: any) => t.qNo === finalItem.qNo);
                      const updatedTasks = exists
                        ? tasks.map((t: any) => t.qNo === finalItem.qNo ? finalItem : t)
                        : [...tasks, finalItem];
                      const updatedExamPaper = {
                        ...level2ExamPaperState,
                        practicalAssignments: updatedTasks
                      };
                      setLevel2ExamPaperState(updatedExamPaper);
                      saveToCloud('nitvt_level2_exam_paper', updatedExamPaper);
                    } else if (modalType === 'level2-viva') {
                      const exists = level2VivaBankState.some((v: any) => v.id === finalItem.id);
                      const updated = exists
                        ? level2VivaBankState.map((v: any) => v.id === finalItem.id ? finalItem : v)
                        : [...level2VivaBankState, finalItem];
                      setLevel2VivaBankState(updated);
                      saveToCloud('nitvt_level2_viva_bank', updated);
                    } else if (modalType === 'level2-pole') {
                      const targetIdx = finalItem._targetIndex !== undefined ? finalItem._targetIndex : -1;
                      const cleanItem = { ...finalItem };
                      delete cleanItem._targetIndex;
                      let updated: PoleStandardSpec[];
                      if (targetIdx >= 0 && targetIdx < level2PoleSpecsState.length) {
                        updated = [...level2PoleSpecsState];
                        updated[targetIdx] = cleanItem;
                      } else {
                        const exists = level2PoleSpecsState.some((p) => p.item === cleanItem.item);
                        updated = exists
                          ? level2PoleSpecsState.map((p) => p.item === cleanItem.item ? cleanItem : p)
                          : [...level2PoleSpecsState, cleanItem];
                      }
                      setLevel2PoleSpecsState(updated);
                      saveToCloud('nitvt_level2_pole_specs', updated);
                    } else if (modalType === 'map') {
                      const exists = surveyMaps.some((m: any) => m.id === finalItem.id);
                      const updatedMaps = exists
                        ? surveyMaps.map((m: any) => m.id === finalItem.id ? finalItem : m)
                        : [finalItem, ...surveyMaps];
                      setSurveyMaps(updatedMaps);
                      saveToCloud('nitvt_survey_maps', updatedMaps);
                    } else if (modalType === 'instructor') {
                      setInstructorProfile(finalItem);
                      saveToCloud('nitvt_instructor_profile', finalItem);
                    } else if (modalType === 'gallery') {
                      const exists = gallery.some((g: any) => g.id === finalItem.id);
                      const updatedGallery = exists
                        ? gallery.map((g: any) => g.id === finalItem.id ? finalItem : g)
                        : [finalItem, ...gallery];
                      setGallery(updatedGallery);
                      saveToCloud('nitvt_gallery', updatedGallery);
                    } else if (modalType === 'blog') {
                      const exists = blogPosts.some((b: any) => b.id === finalItem.id);
                      const updatedBlog = exists
                        ? blogPosts.map((b: any) => b.id === finalItem.id ? finalItem : b)
                        : [finalItem, ...blogPosts];
                      setBlogPosts(updatedBlog);
                      saveToCloud('nitvt_blog_posts', updatedBlog);
                    }
                    setEditModalOpen(false);
                    setSuccessMessage('सफलतापूर्वक सेभ गरियो! शीर्ष "सबै परिवर्तनहरू सेभ गर्नुहोस्" बटन थिच्न नबिर्सनुहोला।');
                    setTimeout(() => setSuccessMessage(''), 5000);
                  }}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>सेभ र बन्द गर्नुहोस् (Save & Close)</span>
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION MODAL FOR ADMIN */}
        {blogToDelete && (
          <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 bg-rose-500/20 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">ब्लग लेख स्थायी रूपमा हटाउनुहुन्छ?</h3>
                  <p className="text-xs text-slate-400">यो प्रक्रिया रद्द गर्न सकिँदैन।</p>
                </div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-xs text-amber-300 font-bold line-clamp-2">
                  "{blogToDelete.title}"
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBlogToDelete(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteBlog(blogToDelete.id, blogToDelete.title)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हो, हटाउनुहोस् (Delete)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
