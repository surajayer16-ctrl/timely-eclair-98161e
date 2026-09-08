import React from 'react';
import { Phone, Mail, Award, BookOpen, Wrench, FileCheck, HelpCircle, ShieldCheck, Sparkles, GraduationCap, ExternalLink, Radio, Cpu, User, BookMarked, Database, Image, Newspaper, Globe, Languages } from 'lucide-react';
import { instituteInfo } from '../data/coursesData';
import { NitvtLogo } from './NitvtLogo';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnrollment: () => void;
  onOpenAiTutor: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEnrollment,
  onOpenAiTutor,
  onOpenAdmin
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-amber-600 py-1.5 px-4 text-xs font-medium text-white shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a 
              href="https://nitvt.com.np/apply" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-400 text-slate-950 hover:bg-amber-300 hover:scale-105 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse flex items-center gap-1 transition-all"
              title="अनलाइन भर्ना आवेदन फारम / Apply Online"
            >
              <span>{t('नयाँ भर्ना खुला (Apply)', 'Apply Now (Admissions Open)')}</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-950" />
            </a>
            <span className="hidden sm:inline">
              {t(
                `${instituteInfo.establishedNepali} • CTEVT बाट सम्बन्धन प्राप्त`,
                `Established 2005 • Affiliated with CTEVT`
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Language Switcher in Top Bar */}
            <div className="flex items-center bg-slate-950/60 border border-white/20 p-0.5 rounded-full text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                  language === 'ne'
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="नेपाली भाषा"
              >
                <span>🇳🇵</span>
                <span>नेपाली</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English Language"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <span className="hidden sm:inline text-white/40">|</span>

            <a href={`tel:${instituteInfo.phonePrimary}`} className="flex items-center gap-1 hover:text-amber-200 transition-colors">
              <Phone className="w-3 h-3" />
              <span>{instituteInfo.phonePrimary}</span>
            </a>
            <span className="hidden md:inline text-white/40">|</span>
            <a href={`mailto:${instituteInfo.emailTop || 'surajayer16@gmail.com'}`} className="hidden md:flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{instituteInfo.emailTop || 'surajayer16@gmail.com'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <NitvtLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {t('सुरेन्द्र ऐर (Surendra Air)', 'Surendra Air (NITVT)')}
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 bg-purple-950 border border-purple-800 text-purple-300 text-[11px] px-2 py-0.5 rounded-full font-medium">
                <Award className="w-3 h-3 text-amber-400" /> CTEVT Approved
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              Nepal Institute of Technical & Vocational Training (NITVT) Pvt. Ltd.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {t('गृहपृष्ठ (Home)', 'Home')}
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {t('तालिमहरू (Courses)', 'Courses')}
          </button>
          <button
            onClick={() => setActiveTab('telecom-note')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              ['telecom-note', 'level1', 'level2', 'curriculum', 'tools', 'simulators', 'exams', 'outside-symbols', 'electrician-note', 'electrician'].includes(activeTab)
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-amber-300 hover:text-white hover:bg-slate-700/50 bg-amber-950/50 border border-amber-800/60'
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>{t('टेलीकम नोट (Telecom Note)', 'Telecom Note')}</span>
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'testimonials'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{t('सफलताका कथाहरू (Alumni)', 'Alumni')}</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Image className="w-4 h-4 text-cyan-400" />
            <span>{t('ग्यालेरी (Gallery)', 'Gallery')}</span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'blog'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>{t('ब्लग (Blog)', 'Blog & News')}</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                : 'text-amber-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>{t('मेरो बारेमा (About)', 'About')}</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-850 hover:to-indigo-900 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-cyan-900/40 group"
            title="Google Gemini AI Telecom Instructor"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left flex flex-col">
              <span className="hidden sm:inline font-bold leading-tight text-white">{t('AI प्राविधिक गुरु', 'AI Telecom Tutor')}</span>
              <span className="text-[10px] text-cyan-300 font-normal leading-tight hidden lg:inline">Gemini AI</span>
            </div>
            <span className="sm:hidden font-bold">AI Guru</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/50 hover:border-amber-400 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md group"
            title="Admin Control Panel"
          >
            <Database className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">{t('एडमिन / डाटाबेस', 'Admin')}</span>
            <span className="md:hidden">Admin</span>
          </button>

          <button
            onClick={onOpenEnrollment}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>{t('सिट सुरक्षित गर्नुहोस्', 'Book Seat')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
            activeTab === 'home' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
          }`}
        >
          {t('गृहपृष्ठ', 'Home')}
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
            activeTab === 'courses' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
          }`}
        >
          {t('तालिमहरू', 'Courses')}
        </button>
        <button
          onClick={() => setActiveTab('telecom-note')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap font-bold transition-colors ${
            ['telecom-note', 'level1', 'level2', 'curriculum', 'tools', 'simulators', 'exams', 'outside-symbols', 'electrician-note', 'electrician'].includes(activeTab)
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-amber-400 bg-amber-950/40 border border-amber-800/50'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>{t('Telecom Note', 'Telecom Note')}</span>
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
            activeTab === 'testimonials' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
          }`}
        >
          {t('सफलताका कथाहरू', 'Alumni')}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap font-bold transition-colors ${
            activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('ग्यालेरी', 'Gallery')}</span>
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap font-bold transition-colors ${
            activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('ब्लग', 'Blog')}</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-bold transition-colors ${
            activeTab === 'about' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-amber-400 bg-amber-950/40'
          }`}
        >
          {t('मेरो बारेमा', 'About')}
        </button>
      </div>
    </header>
  );
};
