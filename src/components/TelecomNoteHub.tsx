import React, { useState, useEffect, useRef } from 'react';
import { Radio, Cpu, BookOpen, Wrench, Sparkles, FileCheck, ArrowRight, ShieldCheck, BookMarked, Layers, Search, CheckCircle2, Volume2, Lock, Unlock, KeyRound, Eye, EyeOff, AlertCircle, Timer, Clock, Send, MapPin, Phone, Mail, Image as ImageIcon, Zap, ArrowDownToLine, Download } from 'lucide-react';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import { sha256 } from '../utils/crypto';
import { useLanguage } from '../context/LanguageContext';
import { SpottingItem } from '../types';
import { spottingItemsList } from '../data/examData';
import { DownloadableNotesSection } from './DownloadableNotesSection';

interface TelecomNoteHubProps {
  setActiveTab: (tab: string) => void;
  onOpenAiTutor: () => void;
  onOpenEnrollment: () => void;
  onOpenAdmin?: () => void;
}

export const TelecomNoteHub: React.FC<TelecomNoteHubProps> = ({
  setActiveTab,
  onOpenAiTutor,
  onOpenEnrollment,
  onOpenAdmin,
}) => {
  const { t, isEnglish } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [hubPhone, setHubPhone] = useState('');
  const [hubSubmitted, setHubSubmitted] = useState(false);
  const [hubView, setHubView] = useState<'modules' | 'downloads'>('modules');
  
  const handleHubCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hubPhone.trim()) return;
    setHubSubmitted(true);
    setTimeout(() => {
      setHubSubmitted(false);
      setHubPhone('');
    }, 4000);
  };
  
  // Auto-lock time setting in minutes (default 3 mins)
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('nitvt_telecom_autolock_minutes');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('nitvt_telecom_note_unlocked') === 'true';
  });

  const [passInput, setPassInput] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [lockNotice, setLockNotice] = useState<string>('');

  // Countdown seconds state for auto-lock
  const [secondsLeft, setSecondsLeft] = useState<number>(autoLockMinutes * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to trigger lock
  const triggerAutoLock = (reasonMsg?: string) => {
    setIsUnlocked(false);
    sessionStorage.removeItem('nitvt_telecom_note_unlocked');
    setLockNotice(reasonMsg || t('सुरक्षाका लागि निष्कृयता (Inactivity) पछि टेलीकम नोट स्वतः लक भयो। (Auto-locked)', 'Telecom note has been auto-locked for security.'));
  };

  const handleLock = () => {
    triggerAutoLock(t('मैन्युअल रूपमा टेलीकम नोट लक गरियो।', 'Telecom note locked manually.'));
  };

  // Activity detection & Timer countdown
  useEffect(() => {
    if (!isUnlocked || autoLockMinutes <= 0) return;

    // Reset seconds remaining
    setSecondsLeft(autoLockMinutes * 60);

    const resetTimer = () => {
      setSecondsLeft(autoLockMinutes * 60);
    };

    // Listen to user interactions to reset idle timer
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));

    // Countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerAutoLock(t('सुरक्षाका लागि ३ मिनेट निष्कृय रहेकाले टेलीकम नोट स्वतः लक भयो। (Auto-locked due to inactivity)', 'Telecom note auto-locked due to inactivity.'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-lock when user switches browser tab or hides page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerAutoLock(t('ट्याब/पेज छाडेकाले टेलीकम नोट स्वतः लक भयो। (Auto-locked on tab switch)', 'Telecom note auto-locked on tab switch.'));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isUnlocked, autoLockMinutes, isEnglish]);

  useEffect(() => {
    const handlePassChanged = () => {
      triggerAutoLock(t('एडमिनले पासवर्ड परिवर्तन गरेकाले सेसन स्वतः लक गरियो।', 'Session auto-locked because admin changed the password.'));
    };

    const handleAutoLockEvent = () => {
      setIsUnlocked(false);
      sessionStorage.removeItem('nitvt_telecom_note_unlocked');
      setLockNotice(t('ट्याब/पेज परिवर्तन गरी बाहिर गएकाले वा निष्कृयताका कारण टेलीकम नोट स्वतः लक भयो। (Auto-locked on exit)', 'Telecom note auto-locked upon leaving section or inactivity.'));
    };

    const handleFocus = () => {
      const unlocked = sessionStorage.getItem('nitvt_telecom_note_unlocked') === 'true';
      if (!unlocked) {
        setIsUnlocked(false);
        setLockNotice(t('ट्याब/पेज परिवर्तन गरी बाहिर गएकाले टेलीकम नोट पुनः लक गरियो। (Auto-locked on exit)', 'Telecom note re-locked upon page switch.'));
      }
    };

    window.addEventListener('telecom_note_pass_changed', handlePassChanged);
    window.addEventListener('telecom_note_autolock', handleAutoLockEvent);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('telecom_note_pass_changed', handlePassChanged);
      window.removeEventListener('telecom_note_autolock', handleAutoLockEvent);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isEnglish]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check old non-hashed key for backwards compatibility
    const oldPass = localStorage.getItem('nitvt_telecom_note_pass');
    let isMatch = false;
    if (oldPass) {
      if (passInput === oldPass) {
        isMatch = true;
        // Upgrade on the fly to secure hash
        localStorage.setItem('nitvt_telecom_note_pass_hash', sha256(oldPass));
        localStorage.removeItem('nitvt_telecom_note_pass');
      }
    } else {
      const currentRequiredPassHash = localStorage.getItem('nitvt_telecom_note_pass_hash') || '790aa7c7e6c06c3246db24b64dba15e3ec432c124940b8626d4f102d897c421e'; // Hash of telecom123
      if (sha256(passInput) === currentRequiredPassHash) {
        isMatch = true;
      }
    }

    if (isMatch) {
      setIsUnlocked(true);
      sessionStorage.setItem('nitvt_telecom_note_unlocked', 'true');
      setErrorMsg('');
      setLockNotice('');
      setPassInput('');
    } else {
      setErrorMsg(t('गलत पासवर्ड! कृपया सही पासवर्ड प्रविष्ट गर्नुहोस्। (Invalid Password)', 'Incorrect password! Please enter the valid access key.'));
    }
  };

  const handleAutoLockChange = (mins: number) => {
    setAutoLockMinutes(mins);
    localStorage.setItem('nitvt_telecom_autolock_minutes', mins.toString());
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sections = [
    {
      id: 'level1',
      title: 'तह–१ (Junior Telecom Technician Level-1)',
      nepaliTitle: 'जुनियर टेलिकम टेक्निसियन तह-१ नोट तथा पाठ्यक्रम',
      description: 'आधारभूत अप्टिकल फाइबर स्प्लाइसिङ, कलर कोडिङ (१२-कोर), ओसीआर, पोल इरेक्सन, र सेफ्टी गाइडलाइनसहितको सम्पूर्ण नोट।',
      enDescription: 'Fundamental optical fiber splicing, 12-core color coding, OCR, pole erection, and complete technical safety notes.',
      icon: Radio,
      badge: 'CTEVT Level 1',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      topics: ['अप्टिकल फाइबर परिचय', '१२-कोर कलर कोड नियम', 'फ्युजन स्प्लाइसिङ प्रक्रिया', 'ड्रप केबल इन्स्टलेसन', 'सुरक्षा मापदण्ड (Safety)']
    },
    {
      id: 'level2',
      title: 'तह–२ (Telecom Technician Level-2)',
      nepaliTitle: 'टेलिकम टेक्निसियन तह-२ उन्नत नोट तथा अभ्यास',
      description: 'उन्नत ओटीडीआर टेस्टिङ, लूप रेसिस्टेन्स, ईपीएबीएक्स कन्फिगरेसन, PON/GPON आर्टेक्चर र नेटवर्क ट्रबलशुटिङ।',
      enDescription: 'Advanced OTDR testing, loop resistance, EPABX configuration, PON/GPON architecture, and network troubleshooting.',
      icon: Cpu,
      badge: 'CTEVT Level 2',
      color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
      topics: ['OTDR वेभफर्म एनालाइसिस', 'GPON / EPON वास्तुकला', 'EPABX र इन्टरकम प्रोग्रामिङ', 'फाइबर लस क्याल्कुलेसन', 'नेटवर्क ट्रबलशुटिङ']
    },
    {
      id: 'curriculum',
      title: 'म्यानुअल (Technical Manuals & Curriculum)',
      nepaliTitle: 'अधिकृत प्राविधिक म्यानुअल तथा पाठ्यक्रम',
      description: 'नेपाल टेलिकम, CTEVT तथा NSTB द्वारा निर्धारित आधिकारिक पाठ्यक्रम, अभ्यास पुस्तिका र स्टेप-बाई-स्टेप म्यानुअल।',
      enDescription: 'Official curriculum, practical workbooks, and step-by-step technical standard operating procedures (SOP).',
      icon: BookOpen,
      badge: 'Official Manuals',
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white font-bold',
      topics: ['CTEVT आधिकारिक सिलिबस', 'फिल्ड अपरेटिङ म्यानुअल', 'सुरक्षा निर्देशिका', 'उपकरण ह्यान्डबुक', 'स्ट्यान्डर्ड अपरेटिंग प्रोसिजर (SOP)']
    },
    {
      id: 'tools',
      title: 'औजार (90+ Professional Telecom Tools)',
      nepaliTitle: '९०+ व्यावसायिक टेलिकम औजार तथा उपकरण सूची',
      description: 'फ्युजन स्प्लाइसर, क्लिभर, ओटिडिआर, पावर मिटर, भिजुअल फल्ट लोकेटर (VFL) देखि ९०+ भन्दा बढी फिल्ड औजारहरूको विस्तृत विवरण।',
      enDescription: 'Detailed catalog of 90+ professional field tools including fusion splicer, cleaver, OTDR, optical power meter, and VFL.',
      icon: Wrench,
      badge: '90+ Tools Catalog',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold',
      topics: ['फ्युजन स्प्लाइसर मेशिन', 'हाई-प्रिसिजन क्लिभर', 'OTDR & VFL', 'ओप्टिकल पावर मिटर (OPM)', 'ह्यान्ड टुल र क्ल्याम्पिमिटर']
    },
    {
      id: 'simulators',
      title: 'सिमुलेटरहरू (Interactive Lab Simulators)',
      nepaliTitle: 'भर्चुअल प्राविधिक ल्याब तथा सिमुलेटरहरू',
      description: 'घरमै बसेर फ्युजन स्प्लाइसिङ, कलर कोड स्पिड टेस्ट, OTDR ट्रेस विश्लेषण, ओम्स ल र EPABX कमान्ड अभ्यास गर्ने डिजिटल ल्याब।',
      enDescription: 'Interactive digital lab to practice fusion splicing, color code speed quiz, OTDR trace analysis, and EPABX commands.',
      icon: Sparkles,
      badge: 'Digital Simulators',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
      buttonBg: 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold',
      topics: ['फ्युजन स्प्लाइसिङ सिमुलेटर', '१२-कोर कलर कोड गेम', 'OTDR वेभफर्म जेनरेटर', 'ओम्स ल क्याल्कुलेटर', 'EPABX कमान्ड टेस्टर']
    },
    {
      id: 'exams',
      title: 'CTEVT परीक्षा तयारी (Exam Prep & Model Qs)',
      nepaliTitle: 'CTEVT / NSTB परीक्षा तयारी तथा मोडल प्रश्नोत्तर',
      description: 'लिखित तथा प्रयोगात्मक परीक्षाका लागि महत्वपूर्ण वस्तुगत (MCQ) तथा विषयगत प्रश्नोत्तर, क्विज र मोडल परीक्षा सेटहरू।',
      enDescription: 'Essential multiple-choice questions (MCQs), written practical tips, and past exam model question papers.',
      icon: FileCheck,
      badge: 'Exam Preparation',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
      buttonBg: 'bg-purple-600 hover:bg-purple-500 text-white font-bold',
      topics: ['MCQ मोडल प्रश्नहरू', 'लिखित परीक्षा अभ्यास', 'प्रयोगात्मक परीक्षा टिप्स', 'पिछले वर्षका प्रश्नपत्र', 'मॉक एक्जाम सेट']
    },
    {
      id: 'outside-symbols',
      title: 'आउटसाइड नेटवर्क प्रतीकहरू (Outside Network Symbols)',
      nepaliTitle: 'टेलिकम बाहिरी नेटवर्क नक्सांकनका २६ आधिकारिक संकेतहरू',
      description: 'NITVT तथा CTEVT द्वारा निर्धारित आधिकारिक २-पृष्ठ प्राविधिक नक्सा संकेत सिट (Existing, To be installed र Dismantled संकेतहरू)।',
      enDescription: 'Official 2-page engineering symbols sheet used in telecommunication outside plant network drawings (Existing, To be installed, Dismantled).',
      icon: Layers,
      badge: 'NITVT Official Symbols',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
      buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold',
      topics: ['Manual / Auto Exchange', 'क्याबिनेट र बाउन्ड्री लाइन', 'DP (Wall, Internal, UG)', 'Pole & Strut / Stay', 'डक्ट रुट विथ म्यानहोल']
    },
    {
      id: 'electrician-note',
      title: 'इलेक्ट्रिसियन नोट (Building Electrician Course Note)',
      nepaliTitle: 'CTEVT बिल्डिङ इलेक्ट्रिसियन पूर्ण नोट तथा रेखाचित्रहरू',
      description: 'दैनिक कक्षा योजना (Days 1–38), विद्युत सिद्धान्त, औजारहरू, ६४ विद्युतिय चिन्हहरू, ओहमको नियम, ११ प्रयोगात्मक रेखाचित्रहरू र सुरक्षा नियमहरू जस्ताको तेस्तै।',
      enDescription: 'Complete CTEVT Building Electrician lesson plans (Days 1-38), 64 electrical symbols, 11 practical wiring diagrams, tools, and safety rules.',
      icon: Zap,
      badge: 'Building Electrician',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
      buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold',
      topics: ['कक्षा योजना (Days 1–38)', '६४ विद्युतिय चिन्हहरू', '११ प्रयोगात्मक रेखाचित्रहरू', 'ओहमको नियम र हिसाब', 'सुरक्षा तथा प्राथमिक उपचार']
    }
  ];
  
  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.nepaliTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('टेलीकम नोट पासवर्ड पहुँच (Telecom Note Locked)', 'Telecom Note Protected Access')}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(
                'सम्पूर्ण टेलिकम नोट, म्यानुअल, तह-१/२, औजार र परीक्षा सामग्री खोल्न कृपया पासवर्ड प्रविष्ट गर्नुहोस्।',
                'Please enter the access key to unlock all telecom notes, manuals, Level 1 & 2 guides, tools, and exam materials.'
              )}
            </p>
          </div>

          {lockNotice && (
            <div className="bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs p-3 rounded-2xl flex items-center gap-2.5 text-left font-medium">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{lockNotice}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            {errorMsg && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('पासवर्ड प्रविष्ट गर्नुहोस् (Enter Password)', 'Enter Access Password')}</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  title={showPass ? t('पासवर्ड लुकाउनुहोस्', 'Hide password') : t('पासवर्ड हेर्नुहोस्', 'Show password')}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-slate-950" />
              <span>{t('टेलीकम नोट अनलक गर्नुहोस् (Unlock Access)', 'Unlock Telecom Notes')}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 space-y-1 text-center">
            <p className="text-[11px] text-amber-400/90 font-medium flex items-center justify-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              <span>🔒 {t('स्वतः लक प्रणाली (Auto-Lock System Active)', 'Auto-Lock Security System Active')}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {t(
                'सुरक्षाका लागि नोट/ट्याबबाट बाहिर जाँदा (गृहपृष्ठ, तालिमहरू वा अन्य सेक्सनमा जाँदा), सेसन निष्कृय हुँदा वा ब्राउजर विन्डो छाड्दा टेलीकम नोट स्वतः लक हुन्छ।',
                'For security, the notes section locks automatically upon navigating away, switching browser tabs, or during prolonged inactivity.'
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Banner for Telecom Note Category */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('टेलीकम नोट (Unified Telecom Note Category)', 'Telecom Knowledge Hub & Notes')}</span>
              </div>

              {/* Live Auto-Lock Timer Badge */}
              <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm">
                <Timer className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>{t('स्वतः लक:', 'Auto-Lock:')} {formatTime(secondsLeft)}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t('सम्पूर्ण टेलिकम नोट, म्यानुअल, तह-१/२, औजार र परीक्षा सामग्री', 'Comprehensive Telecom Notes, Manuals, Level 1/2, Tools & Exam Prep')}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'सुरेन्द्र ऐर (NITVT) को आधिकारिक टेलिकम अध्ययन केन्द्र। यहाँबाट तपाईंले तह–१, तह–२, प्राविधिक म्यानुअल, ९०+ औजारहरू, डिजिटल ल्याब सिमुलेटरहरू र CTEVT परीक्षा तयारीका सम्पूर्ण सामग्रीहरू एकै ठाउँबाट प्राप्त गर्न सक्नुहुन्छ।',
                'Official telecom learning center by Surendra Air at NITVT. Access Level 1, Level 2 curricula, technical SOP manuals, 90+ professional telecom tools, digital simulation labs, and CTEVT exam preparation in one place.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Auto Lock Duration Selector */}
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{t('स्वतः लक:', 'Auto-Lock:')}</span>
              <select
                value={autoLockMinutes}
                onChange={(e) => handleAutoLockChange(parseInt(e.target.value, 10))}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value={1} className="bg-slate-900 text-white">{t('१ मिनेट', '1 min')}</option>
                <option value={3} className="bg-slate-900 text-white">{t('३ मिनेट', '3 mins')}</option>
                <option value={5} className="bg-slate-900 text-white">{t('५ मिनेट', '5 mins')}</option>
                <option value={10} className="bg-slate-900 text-white">{t('१० मिनेट', '10 mins')}</option>
              </select>
            </div>

            <button
              onClick={handleLock}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold px-3.5 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-colors"
              title={t('सेसन तुरुन्तै पासवर्ड लक गर्नुहोस्', 'Lock session immediately')}
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('अहिले लक गर्नुहोस्', 'Lock Now')}</span>
            </button>

            <button
              onClick={onOpenAiTutor}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('AI प्राविधिक गुरु', 'AI Guru')}</span>
            </button>

            <button
              onClick={onOpenEnrollment}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('सिट सुरक्षित गर्नुहोस्', 'Enroll Now')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Hub: Modules vs Download Center */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start">
            <button
              onClick={() => setHubView('modules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                hubView === 'modules'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('अध्ययन मोड्युलहरू (Course Modules)', 'Course Modules')}</span>
            </button>

            <button
              onClick={() => setHubView('downloads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                hubView === 'downloads'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4 text-amber-400" />
              <span>{t('📥 PDF / JPG डाउनलोड सेन्टर', 'PDF / JPG Download Center')}</span>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ml-1 animate-pulse">
                New
              </span>
            </button>
          </div>

          {/* Search Bar */}
          {hubView === 'modules' && (
            <div className="relative max-w-md w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('टेलिकम नोट, औजार, तह-१, म्यानुअल खोज्नुहोस्...', 'Search telecom notes, tools, Level 1, manuals...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Area Based on hubView */}
      {hubView === 'downloads' ? (
        <DownloadableNotesSection onOpenAdminUpload={onOpenAdmin} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((sec) => {
              const IconComp = sec.icon;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sec.color} border flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                        {sec.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {isEnglish ? sec.title : sec.title}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                        {isEnglish ? sec.title : sec.nepaliTitle}
                      </p>
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                        {isEnglish ? sec.enDescription : sec.description}
                      </p>
                    </div>

                    {/* Key Topics List */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {t('प्रमुख विषयहरू:', 'Key Topics:')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sec.topics.map((top, idx) => (
                          <span key={idx} className="bg-slate-800/80 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-amber-400" />
                            <span>{t(top, top)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakNepaliText(`${sec.title}। ${sec.nepaliTitle}। ${sec.description}। प्रमुख विषयहरू: ${sec.topics.join(', ')}`, sec.title);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                      title={t('नेपाली आवाजमा सुन्नुहोस्', 'Listen audio guide')}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('आवाजमा सुन्नुहोस्', 'Audio Guide')}</span>
                    </button>

                    <button className={`px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-transform group-hover:scale-105 shrink-0 ${sec.buttonBg}`}>
                      <span>
                        {sec.id === 'outside-symbols'
                          ? t('प्रतीक सिट खोल्नुहोस्', 'Open Symbols')
                          : sec.id === 'electrician-note'
                          ? t('इलेक्ट्रिसियन नोट खोल्नुहोस्', 'Open Electrician Note')
                          : t('खोल्नुहोस्', 'Explore')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Bottom Info Card - Unified with Phone Consultation & NITVT Map Location */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: text and actions */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/40">
              {t('सुरेन्द्र ऐर इन्स्टिच्युट (NITVT) • केन्द्रीय कार्यालय', 'Surendra Air Institute (NITVT) • Central Office')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {t('कुनै निश्चित पाठ्यक्रम वा नोट बारे थप बुझ्न चाहनुहुन्छ?', 'Need consultation on courses or technical syllabus?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t(
                'हाम्रा अनुभवी इन्जिनियरहरू र AI प्राविधिक गुरु तपाईंको सेवामा २४ घण्टा उपलब्ध छन्। तत्काल आफ्नो जिज्ञासा राख्नुहोस् वा केन्द्रीय कार्यालय भ्रमण गर्नुहोस्।',
                'Our experienced engineers and AI technical tutor are ready to help. Reach out anytime or visit our central campus in Lalitpur.'
              )}
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenAiTutor}
                className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('AI ट्युटरसँग कुरा गर्नुहोस्', 'Chat with AI Tutor')}</span>
              </button>
              <button
                onClick={onOpenEnrollment}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('सिट सुरक्षित गर्नुहोस्', 'Enroll Now')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Callback Form & Map Layout */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            
            {/* Quick Callback Mini Form */}
            <form onSubmit={handleHubCallback} className="space-y-2 text-left">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{t('तत्काल फोन परामर्श चाहियो भने मोबाइल नम्बर राख्नुहोस्:', 'Need quick phone advice? Enter your mobile number:')}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="9848805119"
                  required
                  value={hubPhone}
                  onChange={(e) => setHubPhone(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('पठाउनुहोस्', 'Submit')}</span>
                </button>
              </div>
              {hubSubmitted && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('धन्यवाद! हाम्रो केन्द्रीय कार्यालयबाट केही बेरमै फोन आउनेछ।', 'Thank you! Our counseling desk will call you shortly.')}</span>
                </div>
              )}
            </form>

            {/* NITVT Map Inline under Callback */}
            <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-1 space-y-1">
              <iframe
                title="NITVT Central Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.203928178125!2d85.33711311153163!3d27.66608487611029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19976dabd771%3A0x11e91df8d23a1862!2sNITVT%20(Nepal%20Institute%20of%20Technical%20%26%20Vocational%20Training%20Pvt.%20Ltd.)!5e0!3m2!1sen!2snp!4v1710000000000!5m2!1sen!2snp"
                width="100%"
                height="120"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
              <div className="flex items-center justify-between px-2 py-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{t('महालक्ष्मी–२, ललितपुर (बालकुमारी/ उदयबस्ती)', 'Mahalaxmi-2, Lalitpur (Balkumari / Udayabasti)')}</span>
                </span>
                <a
                  href="https://maps.app.goo.gl/m1LBFQCUKWqY2YaN9?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:underline font-bold transition-colors shrink-0"
                >
                  {t('गुगल म्याप ↗', 'Google Maps ↗')}
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
