import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CourseCatalog } from './components/CourseCatalog';
import { CurriculumViewer } from './components/CurriculumViewer';
import { ToolsCatalog } from './components/ToolsCatalog';
import { FusionSplicingSimulator } from './components/InteractiveSimulators/FusionSplicingSimulator';
import { ColorCodeGame } from './components/InteractiveSimulators/ColorCodeGame';
import { OtdrSimulator } from './components/InteractiveSimulators/OtdrSimulator';
import { OhmsLawCalculator } from './components/InteractiveSimulators/OhmsLawCalculator';
import { EpabxCommandTester } from './components/InteractiveSimulators/EpabxCommandTester';
import { NetworkDiagramViewer } from './components/InteractiveSimulators/NetworkDiagramViewer';
import { ExamPreparation } from './components/ExamPreparation';
import { AITelecomTutor } from './components/AITelecomTutor';
import { EnrollmentModal } from './components/EnrollmentModal';
import { StudentTestimonials } from './components/StudentTestimonials';
import { ContactFooter } from './components/ContactFooter';
import { Level1CourseHub } from './components/Level1CourseHub';
import { Level2CourseHub } from './components/Level2CourseHub';
import { AboutInstructor } from './components/AboutInstructor';
import { TelecomNoteHub } from './components/TelecomNoteHub';
import { TelecomOutsideNetworkSymbols } from './components/TelecomOutsideNetworkSymbols';
import { ElectricianNoteHub } from './components/ElectricianNoteHub';
import { AdminModal } from './components/AdminModal';
import { VoiceReaderPlayer } from './components/VoiceReaderPlayer';
import { MediaGallery } from './components/MediaGallery';
import { BlogSection } from './components/BlogSection';
import { Course, TechnicalTool } from './types';
import { coursesList, instituteInfo } from './data/coursesData';
import { Sparkles, Award, ShieldCheck, Phone, BookOpen, Wrench, FileCheck, Layers, Zap } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { initCloudSync } from './lib/cloudSyncService';

export default function App() {
  const { t, isEnglish } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState<boolean>(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<Course | null>(null);
  const [isAiTutorModalOpen, setIsAiTutorModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [activeSimulatorSubTab, setActiveSimulatorSubTab] = useState<
    'fusion-splice' | 'color-code' | 'otdr' | 'ohms-law' | 'epabx' | 'network-topology'
  >('fusion-splice');

  // Initialize Firestore Cloud Sync across all devices
  useEffect(() => {
    initCloudSync();
  }, []);


  // Auto-lock Telecom Note whenever user leaves the Telecom Note category / tabs
  useEffect(() => {
    const noteTabs = ['telecom-note', 'level1', 'level2', 'curriculum', 'tools', 'simulators', 'exams', 'outside-symbols', 'electrician-note', 'electrician'];
    const isNoteTab = noteTabs.includes(activeTab);

    if (!isNoteTab) {
      // User switched away from Telecom Note section (e.g. to home, courses, testimonials, about)
      sessionStorage.removeItem('nitvt_telecom_note_unlocked');
      window.dispatchEvent(new Event('telecom_note_autolock'));
    } else {
      // User is trying to access a note sub-tab directly without unlocking
      const isUnlocked = sessionStorage.getItem('nitvt_telecom_note_unlocked') === 'true';
      if (!isUnlocked && activeTab !== 'telecom-note') {
        setActiveTab('telecom-note');
      }
    }
  }, [activeTab]);

  // Lock Telecom Note session when user minimizes window, switches browser tab or hides page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.removeItem('nitvt_telecom_note_unlocked');
        window.dispatchEvent(new Event('telecom_note_autolock'));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleOpenEnrollment = (course?: Course) => {
    setSelectedCourseForEnrollment(course || coursesList[0]);
    setIsEnrollmentOpen(true);
  };

  const handleOpenCurriculumForCourse = (courseId: string) => {
    if (courseId === 'junior-telecom-level-1') {
      setActiveTab('level1');
    } else if (courseId === 'telecom-technician-level-2') {
      setActiveTab('level2');
    } else {
      setActiveTab('curriculum');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEnrollment={() => handleOpenEnrollment()}
        onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroSection
              onOpenEnrollment={() => handleOpenEnrollment()}
              onExploreCurriculum={() => setActiveTab('curriculum')}
              onOpenSimulator={() => setActiveTab('simulators')}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />

            {/* Institute Credibility & History Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                      {t('१९ वर्षको गौरवमय प्राविधिक इतिहास', '19+ Years of Technical Excellence')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                      {t('सुरेन्द्र ऐर (Surendra Air)', 'Surendra Air (NITVT)')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                      {t(
                        'विगत १९ वर्षदेखि निरन्तर रूपमा टेलिकम, अप्टिकल फाइबर, इलेक्ट्रिकल तथा निर्माण सम्बन्धी सीपमूलक तालिमहरू सञ्चालन।',
                        'Providing premier hands-on professional training in Telecom, Optical Fiber, Electrical & Vocational Trades for over 19 years.'
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEnrollment()}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
                    >
                      {t('नयाँ भर्ना सिट सुरक्षित गर्नुहोस्', 'Book Admission Seat')}
                    </button>
                  </div>
                </div>

                {/* 4 Feature Highlights Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <strong className="text-white block font-bold text-sm">
                      {t('CTEVT / NSTB मान्यता', 'CTEVT & NSTB Certified')}
                    </strong>
                    <p className="text-slate-300">
                      {t(
                        'राष्ट्रिय सीप परीक्षण समितिबाट सीप परीक्षण (Skill Test) गराई आधिकारिक प्रमाणपत्र प्रदान।',
                        'Official certification through the National Skill Testing Board (NSTB).'
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <strong className="text-white block font-bold text-sm">
                      {t('१००% प्रयोगात्मक पूर्वाधार', '100% Practical Field Labs')}
                    </strong>
                    <p className="text-slate-300">
                      {t(
                        'आफ्नै Optical Fiber Lab, Fusion Splicer, OTDR, Power Meter, र पोल इरेक्सन यार्ड।',
                        'In-house Optical Fiber Lab, Fusion Splicers, OTDR, Optical Power Meters & Pole Erection Yards.'
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <strong className="text-white block font-bold text-sm">
                      {t('रोजगारीको उच्च सम्भावना', 'High Job Placement')}
                    </strong>
                    <p className="text-slate-300">
                      {t(
                        'नेपाल टेलिकम, एनसेल, विभिन्न ISP हरू, जलविद्युत तथा विदेशमा उच्च माग।',
                        'High demand across Nepal Telecom, Ncell, ISPs, Hydropower & Foreign Employment.'
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <strong className="text-white block font-bold text-sm">
                      {t('अनुभवी इन्जिनियर समूह', 'Expert Engineer Mentors')}
                    </strong>
                    <p className="text-slate-300">
                      {t(
                        'नेपाल टेलिकमका पूर्व मुख्य इन्जिनियर तथा फिल्ड विज्ञहरूद्वारा प्रत्यक्ष प्रशिक्षण।',
                        'Direct coaching from veteran telecom engineers and certified industry assessors.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* About Instructor Profile & Vision Section */}
            <AboutInstructor
              onOpenEnrollment={() => handleOpenEnrollment()}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />

            {/* Courses Overview Section */}
            <CourseCatalog
              onSelectCourse={(course) => handleOpenEnrollment(course)}
              onOpenCurriculumForCourse={handleOpenCurriculumForCourse}
            />

            {/* Quick Interactive Simulator Teaser on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-3 py-0.5 rounded-full mb-1 inline-block">
                      {t('भर्चुअल प्रयोगात्मक ल्याब', 'Virtual Engineering Lab')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {t('फ्युजन स्प्लाइसिङ तथा कलर कोडिङ सिमुलेटर', 'Fusion Splicing & Color Coding Simulator')}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('simulators')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>{t('सम्पूर्ण सिमुलेटरहरू खोल्नुहोस्', 'Open All Simulators')}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
                <FusionSplicingSimulator />
              </div>
            </section>

            {/* Student Testimonials Section on Home */}
            <div className="py-4">
              <StudentTestimonials
                onOpenEnrollment={() => handleOpenEnrollment()}
                onSelectCourse={handleOpenCurriculumForCourse}
              />
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="py-6">
            <CourseCatalog
              onSelectCourse={(course) => handleOpenEnrollment(course)}
              onOpenCurriculumForCourse={handleOpenCurriculumForCourse}
            />
          </div>
        )}

        {/* TELECOM NOTE UNIFIED HUB TAB */}
        {activeTab === 'telecom-note' && (
          <TelecomNoteHub
            setActiveTab={setActiveTab}
            onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            onOpenEnrollment={() => handleOpenEnrollment()}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        )}

        {/* JUNIOR TELECOM TECHNICIAN LEVEL-1 MASTER HUB */}
        {activeTab === 'level1' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <Level1CourseHub
              onOpenEnrollment={() => handleOpenEnrollment(coursesList.find(c => c.id === 'junior-telecom-level-1') || coursesList[1])}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />
          </div>
        )}

        {/* TELECOM TECHNICIAN LEVEL-2 MASTER HUB */}
        {activeTab === 'level2' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <Level2CourseHub
              onOpenEnrollment={() => handleOpenEnrollment(coursesList.find(c => c.id === 'telecom-technician-level-2') || coursesList[0])}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />
          </div>
        )}

        {/* CURRICULUM TAB */}
        {activeTab === 'curriculum' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <CurriculumViewer
              onOpenTool={(toolId) => {
                setActiveTab('tools');
              }}
              onOpenExamPrep={() => {
                setActiveTab('exams');
              }}
            />
          </div>
        )}

        {/* TOOLS 90+ CATALOG TAB */}
        {activeTab === 'tools' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <ToolsCatalog />
          </div>
        )}

        {/* INTERACTIVE SIMULATORS SUITE TAB */}
        {activeTab === 'simulators' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NITVT Virtual Engineering Lab Suite</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {t('इन्टरएक्टिभ टेलिकम ल्याब सिमुलेटरहरू', 'Interactive Telecom Lab Simulators')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {t(
                    'फ्युजन स्प्लाइसिङ, १२-कोर कलर कोड स्पिड ट्रेनर, ओटीडीआर वेभफर्म ग्राफ, ओम्स ल तथा लुप रेसिस्टेन्स, ईपीएबीएक्स कमान्ड र टेलिकम सञ्जालको प्रत्यक्ष अभ्यास।',
                    'Hands-on interactive practice with Fusion Splicing, 12-Core Color Coding Trainer, OTDR Trace Simulator, Ohm\'s Law, EPABX Commands & Telecom Network Topology.'
                  )}
                </p>
              </div>

              {/* Simulator Sub-tab Pill Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto no-scrollbar max-w-full">
                <button
                  onClick={() => setActiveSimulatorSubTab('fusion-splice')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'fusion-splice'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('फ्युजन स्प्लाइसिङ', 'Fusion Splicing')}
                </button>
                <button
                  onClick={() => setActiveSimulatorSubTab('color-code')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'color-code'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('कलर कोड स्पिड ट्रेनर', 'Color Code Speed Trainer')}
                </button>
                <button
                  onClick={() => setActiveSimulatorSubTab('otdr')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'otdr'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('OTDR ट्रेस सिमुलेटर', 'OTDR Trace Simulator')}
                </button>
                <button
                  onClick={() => setActiveSimulatorSubTab('ohms-law')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'ohms-law'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('ओम्स ल र अर्थिङ', 'Ohm\'s Law & Earthing')}
                </button>
                <button
                  onClick={() => setActiveSimulatorSubTab('epabx')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'epabx'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('EPABX कमान्ड टेस्टर', 'EPABX Command Tester')}
                </button>
                <button
                  onClick={() => setActiveSimulatorSubTab('network-topology')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    activeSimulatorSubTab === 'network-topology'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('टेलिकम सञ्जाल (Network)', 'Telecom Network Topology')}
                </button>
              </div>
            </div>

            {/* Active Sub-Simulator Component */}
            {activeSimulatorSubTab === 'fusion-splice' && <FusionSplicingSimulator />}
            {activeSimulatorSubTab === 'color-code' && <ColorCodeGame />}
            {activeSimulatorSubTab === 'otdr' && <OtdrSimulator />}
            {activeSimulatorSubTab === 'ohms-law' && <OhmsLawCalculator />}
            {activeSimulatorSubTab === 'epabx' && <EpabxCommandTester />}
            {activeSimulatorSubTab === 'network-topology' && <NetworkDiagramViewer />}
          </div>
        )}

        {/* CTEVT EXAMS TAB */}
        {activeTab === 'exams' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <ExamPreparation />
          </div>
        )}

        {/* TELECOM OUTSIDE NETWORK SYMBOLS TAB (NITVT २६ आधिकारिक संकेतहरू) */}
        {activeTab === 'outside-symbols' && (
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <button
              onClick={() => setActiveTab('telecom-note')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>{t('← टेलीकम नोट (Telecom Note) मा फर्कनुहोस्', '← Back to Telecom Note Hub')}</span>
            </button>
            <TelecomOutsideNetworkSymbols />
          </div>
        )}

        {/* ELECTRICIAN NOTE TAB (बिल्डिङ इलेक्ट्रिसियन पूर्ण नोट तथा रेखाचित्रहरू - Days 1 to 38 All-in-One) */}
        {(activeTab === 'electrician' || activeTab === 'electrician-note') && (
          <ElectricianNoteHub onBack={() => setActiveTab('telecom-note')} />
        )}

        {/* ALUMNI SUCCESS STORIES & TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="py-8">
            <StudentTestimonials
              onOpenEnrollment={() => handleOpenEnrollment()}
              onSelectCourse={handleOpenCurriculumForCourse}
            />
          </div>
        )}

        {/* ABOUT INSTRUCTOR (मेरो बारेमा) TAB */}
        {activeTab === 'about' && (
          <div className="py-8">
            <AboutInstructor
              onOpenEnrollment={() => handleOpenEnrollment()}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />
          </div>
        )}

        {/* PHOTO & VIDEO GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="py-6">
            <MediaGallery />
          </div>
        )}

        {/* OUR BLOG & NEWS TAB */}
        {activeTab === 'blog' && (
          <div className="py-6">
            <BlogSection
              onOpenEnrollment={() => handleOpenEnrollment()}
              onOpenAiTutor={() => setIsAiTutorModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating AI Telecom Instructor Widget / Modal */}
      {isAiTutorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl">
            <AITelecomTutor onClose={() => setIsAiTutorModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Enrollment Reservation Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        initialCourse={selectedCourseForEnrollment}
      />

      {/* Admin Database Editor Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Institute Footer */}
      <ContactFooter
        onOpenEnrollment={() => handleOpenEnrollment()}
        onSelectTab={setActiveTab}
      />

      {/* Global Nepali Voice Reader Player */}
      <VoiceReaderPlayer />

    </div>
  );
}
