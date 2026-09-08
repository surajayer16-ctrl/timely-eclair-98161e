import React from 'react';
import { Award, CheckCircle2, Phone, MapPin, Zap, ArrowRight, ShieldAlert, Sparkles, BookOpen, Users, Compass, ExternalLink } from 'lucide-react';
import { instituteInfo } from '../data/coursesData';
import { NitvtLogo } from './NitvtLogo';
import nitvtOfficialLogo from '../assets/images/01KWY1QPEZJ5TJMDNWKHE6P1G6.png';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenEnrollment: () => void;
  onExploreCurriculum: () => void;
  onOpenSimulator: () => void;
  onOpenAiTutor?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenEnrollment,
  onExploreCurriculum,
  onOpenSimulator,
  onOpenAiTutor,
}) => {
  const { t, isEnglish } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 text-white py-12 lg:py-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Core Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Accreditation Badge with Official Logo */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-purple-950/90 border border-purple-600/50 text-purple-200 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <NitvtLogo size="xs" />
                <span>{t('सुरेन्द्र ऐर (Surendra Air)', 'Surendra Air (NITVT)')}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-950/80 border border-blue-700/50 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('CTEVT सम्बन्धन प्राप्त • स्था. २०६४', 'CTEVT Affiliated • Estd. 2007')}</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t('टेलिकम तथा अप्टिकल फाइबर', 'Telecom & Optical Fiber')}{' '}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent">
                  {t('व्यावसायिक प्राविधिक तालिम', 'Professional Vocational Training')}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {t(
                  'विगत १९ वर्षदेखि नेपालकै उत्कृष्ट टेलिकम इन्जिनियरहरूद्वारा १००% प्रयोगात्मक (Practical) कक्षा सञ्चालन। CTEVT राष्ट्रिय सीप परीक्षण (NSTB) तह-१ र तह-२ को सम्पूर्ण तयारी तथा रोजगारीको सुनिश्चित सहजीकरण।',
                  'Leading 100% hands-on practical training led by Nepal\'s top telecom engineers for over 19 years. Complete preparation for CTEVT National Skill Testing Board (NSTB) Level-1 & Level-2 certification and employment support.'
                )}
              </p>
            </div>

            {/* Key Feature Bullets from the prompt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-100 block font-semibold">
                    {t('CTEVT आधिकारिक प्रमाणपत्र', 'CTEVT Official Certification')}
                  </strong>
                  <span className="text-slate-300">
                    {t(
                      'राष्ट्रिय सीप परीक्षण समितिबाट सीप परीक्षण पश्चात प्रमाणपत्र।',
                      'Accredited certification upon clearing National Skill Testing Board (NSTB) exams.'
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-100 block font-semibold">
                    {t('आफ्नै पूर्ण प्रयोगात्मक पूर्वाधार', 'Dedicated Practical Lab Infrastructure')}
                  </strong>
                  <span className="text-slate-300">
                    {t(
                      'Fusion Splicer, OTDR, Power Meter, Cable Yard भएको एकमात्र संस्था।',
                      'Nepal\'s premier institute equipped with Fusion Splicers, OTDR, Power Meters & Cable Yards.'
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-100 block font-semibold">
                    {t('नेपाल टेलिकम र ISP मा रोजगारी', 'Employment in Telecom & ISPs')}
                  </strong>
                  <span className="text-slate-300">
                    {t(
                      'NTC, Ncell, WorldLink, Vianet, Subisu र विदेशमा उच्च माग।',
                      'High employment demand at NTC, Ncell, WorldLink, Vianet, Subisu & abroad.'
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-100 block font-semibold">
                    {t('Skill Test तयारी तथा सहजीकरण', 'Skill Test Preparation & Guidance')}
                  </strong>
                  <span className="text-slate-300">
                    {t(
                      'सीप भएका तर प्रमाणपत्र नभएकाहरूको लागि विशेष सहजीकरण कक्षा।',
                      'Special facilitation classes for experienced technicians seeking official credentials.'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenEnrollment}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-amber-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{t('आजै सिट सुरक्षित गर्नुहोस्', 'Book Your Seat Today')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreCurriculum}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{t('डिजिटल म्यानुअल हेर्नुहोस्', 'Explore Digital Manual')}</span>
              </button>

              <button
                onClick={onOpenSimulator}
                className="flex items-center gap-2 bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 border border-blue-700/60 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('प्रयोगात्मक सिमुलेटर', 'Lab Simulators')}</span>
              </button>

              {onOpenAiTutor && (
                <button
                  onClick={onOpenAiTutor}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-950 to-purple-950 hover:from-indigo-900 hover:to-purple-900 text-cyan-300 border border-cyan-500/40 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-950/50"
                  title="Google Gemini AI Telecom Guru"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{t('AI प्राविधिक गुरु (Gemini)', 'AI Telecom Guru (Gemini)')}</span>
                </button>
              )}
            </div>

            {/* Location & Direct Hotline */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{t('महालक्ष्मी-२, ललितपुर (बालकुमारी/ उदयबस्ती)', 'Mahalaxmi-2, Lalitpur (Balkumari / Udayabasti)')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">01-5203522 / 9848805119</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Course Highlight Box with Live Seat Stats */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* NITVT Official Website Large Link Card */}
            <a 
              href="https://nitvt.com.np/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative block bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 border-2 border-indigo-500/60 hover:border-amber-400/80 rounded-2xl p-5 shadow-2xl transition-all hover:scale-[1.01] hover:shadow-indigo-500/10 overflow-hidden cursor-pointer"
            >
              {/* Background Glow */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex gap-4 items-center relative z-10">
                {/* Large NITVT Logo */}
                <div className="bg-white p-1 rounded-2xl shadow-lg ring-4 ring-indigo-500/20 group-hover:ring-amber-500/30 transition-all shrink-0 w-16 h-16 flex items-center justify-center">
                  <img
                    src={nitvtOfficialLogo}
                    alt="NITVT Official Logo"
                    className="w-full h-full object-contain rounded-xl p-0.5"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider group-hover:border-amber-500/40 group-hover:text-amber-300 transition-colors">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{t('आधिकारिक वेबसाइट (Official Website)', 'Official Website')}</span>
                  </div>
                  
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-200 transition-colors leading-snug">
                    Nepal Institute of Technical & Vocational Training (NITVT)
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>https://nitvt.com.np</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Visit Button Banner at Bottom */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">
                <span className="text-slate-400 group-hover:text-amber-300 transition-colors">
                  {t('संस्थाको विस्तृत जानकारी र भर्नाको लागि', 'For detailed info and online admission')}
                </span>
                <span className="flex items-center gap-1 bg-indigo-600/80 group-hover:bg-amber-500 group-hover:text-slate-950 px-2.5 py-1 rounded-lg transition-all">
                  <span>{t('वेबसाइट खोल्नुहोस्', 'Open Website')}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>

            <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Badge & Seat Counter */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-full">
                    {t('नयाँ भर्ना', 'Admissions Open')}
                  </span>
                  <h2 className="text-base font-bold text-white mt-1.5">
                    {t('उपलब्ध तालिमहरू (Level 1, 2 & OFC)', 'Available Courses (Level 1, 2 & OFC)')}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 block leading-none">
                    {t('१७', '17')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('सिटहरू बाँकी', 'Seats Remaining')}
                  </span>
                </div>
              </div>

              {/* Course Badges List */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-900/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      OFC
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">
                        {t('अप्टिकल फाईबर टेक्निसियन', 'Optical Fiber Technician')}
                      </h3>
                      <p className="text-[10px] text-slate-400">Fusion Splicing, OTDR, VFL, FTTH</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-full font-medium">
                    {t('१ महिना / १५ दिन', '1 Month / 15 Days')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-900/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      L-1
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">
                        {t('जुनियर टेलिकम टेक्निसियन तह–१', 'Junior Telecom Technician Level-1')}
                      </h3>
                      <p className="text-[10px] text-slate-400">OSP, Poling, Drop Wire, DP Box</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    CTEVT Level 1
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-900/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      L-2
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">
                        {t('टेलिकम टेक्निसियन तह–२', 'Telecom Technician Level-2')}
                      </h3>
                      <p className="text-[10px] text-slate-400">MDF, EPABX, Earthing, GSM/CDMA</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full font-medium">
                    CTEVT Level 2
                  </span>
                </div>
              </div>

              {/* Quick Eligibility Note */}
              <div className="bg-amber-950/30 border border-amber-700/40 p-3 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{t('को-कसले तालिम लिने?', 'Who is this for?')}</strong>{' '}
                  {t(
                    'साधारण लेखपढ जान्ने, ISP मा कार्यरत, NTC बढुवा चाहने, र वैदेशिक रोजगारीका लागि सीप चाहने सम्पूर्णका लागि।',
                    'Open to beginners, ISP technicians, NTC promotion aspirants, and candidates seeking overseas technical employment.'
                  )}
                </span>
              </div>

              {/* Primary Card CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={onOpenEnrollment}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-[11px] sm:text-xs transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-1.5"
                >
                  <span>{t('अनलाइन सिट बुकिङ', 'Online Seat Booking')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="https://nitvt.com.np/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3 rounded-xl text-[11px] sm:text-xs transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-1.5"
                >
                  <span>{t('आधिकारिक आवेदन फारम', 'Official Application Form')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
