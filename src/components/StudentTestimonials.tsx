import React, { useState, useMemo, useRef } from 'react';
import { 
  Award, 
  Star, 
  Quote, 
  Briefcase, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Globe2, 
  Search, 
  Filter, 
  Send, 
  MessageSquareHeart, 
  GraduationCap, 
  ArrowUpRight,
  ShieldCheck,
  Phone,
  Languages,
  PlusCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Testimonial, TestimonialCategory } from '../types';
import { alumniStats, hiringPartners, testimonialsList } from '../data/testimonialsData';
import { useLanguage } from '../context/LanguageContext';

interface StudentTestimonialsProps {
  onOpenEnrollment: () => void;
  onSelectCourse?: (courseId: string) => void;
  compact?: boolean;
}

export const StudentTestimonials: React.FC<StudentTestimonialsProps> = ({
  onOpenEnrollment,
  onSelectCourse,
  compact = false,
}) => {
  const { t, isEnglish } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<TestimonialCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState<number>(0);
  const [expandedEnglishQuotes, setExpandedEnglishQuotes] = useState<Record<string, boolean>>({});
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonialsList);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount * 0.85, behavior: 'smooth' });
    }
  };

  // New submission state
  const [formName, setFormName] = useState('');
  const [formBatch, setFormBatch] = useState('२०८० ब्याच (2023)');
  const [formCourse, setFormCourse] = useState('अप्टिकल फाईबर टेक्निसियन (FTTH & OFC Specialist)');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formLocation, setFormLocation] = useState('काठमाडौँ');
  const [formQuote, setFormQuote] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formCategory, setFormCategory] = useState<TestimonialCategory>('fiber');

  // Featured testimonials for spotlight
  const featuredTestimonials = useMemo(() => {
    return allTestimonials.filter((t) => t.featured);
  }, [allTestimonials]);

  const currentFeatured = featuredTestimonials[activeSpotlightIndex] || featuredTestimonials[0];

  const handleNextSpotlight = () => {
    setActiveSpotlightIndex((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const handlePrevSpotlight = () => {
    setActiveSpotlightIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  const toggleEnglishQuote = (id: string) => {
    setExpandedEnglishQuotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return allTestimonials.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.nameNepali.toLowerCase().includes(q) ||
        t.nameEnglish.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.currentRole.toLowerCase().includes(q) ||
        t.courseTaken.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.skillsMastered.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [allTestimonials, selectedCategory, searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim() || !formCompany.trim()) return;

    const newTestimonial: Testimonial = {
      id: `test-custom-${Date.now()}`,
      nameNepali: formName.trim(),
      nameEnglish: formName.trim(),
      batchYear: formBatch,
      courseTaken: formCourse,
      currentRole: formRole.trim() || 'Telecom Specialist',
      company: formCompany.trim(),
      location: formLocation.trim() || 'नेपाल',
      avatarColor: 'from-amber-600 to-red-600',
      rating: formRating,
      certificationBadge: 'NITVT Verified Graduate',
      quoteNepali: formQuote.trim(),
      quoteEnglish: formQuote.trim(),
      careerHighlight: 'नयाँ पूर्व-विद्यार्थी सफलताको कथा (Recently Added)',
      skillsMastered: ['Optical Fiber', 'Telecom Operations', 'Practical Engineering'],
      category: formCategory,
      featured: false,
    };

    setAllTestimonials((prev) => [newTestimonial, ...prev]);
    setSubmitSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setFormName('');
      setFormCompany('');
      setFormRole('');
      setFormQuote('');
    }, 2000);
  };

  return (
    <section className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>{t('NITVT पूर्व-विद्यार्थी सफलताका कथाहरू (Alumni Success Stories)', 'NITVT Alumni Success Stories & Testimonials')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('हाम्रा दक्ष ग्राजुयटहरू: स्वदेश तथा विदेशमा उत्कृष्ट रोजगारी', 'Our Skilled Graduates: Thriving Careers in Nepal & Abroad')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t(
            'विगत १९ वर्षमा ५,२०० भन्दा बढी प्रशिक्षार्थीहरूले सुरेन्द्र ऐर (NITVT) बाट १००% प्रयोगात्मक तालिम लिई नेपाल टेलिकम, Ncell, प्रमुख ISP हरू, तथा खाडी र युरोपेली मुलुकहरूमा उच्च तलबका साथ काम गरिरहेका छन्।',
            'Over the past 19 years, more than 5,200 technicians trained under Surendra Air at NITVT have built thriving careers at Nepal Telecom, Ncell, leading ISPs, and multinational telecommunications enterprises worldwide.'
          )}
        </p>
      </div>

      {/* Real-time Alumni Impact Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">
            {t('कुल उत्तीर्ण प्राविधिक', 'Total Certified Technicians')}
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-white mt-1 block">
            {alumniStats.totalGraduates}
          </strong>
          <span className="text-[11px] text-blue-400 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t('२०६४ सालदेखि निरन्तर', 'Continuous Since 2007')}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">
            {t('रोजगारी तथा प्लेसमेन्ट दर', 'Job Placement Rate')}
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
            {alumniStats.employmentRate}
          </strong>
          <span className="text-[11px] text-emerald-300 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t('उच्च माग भएको सीप', 'High Demand Practical Skills')}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-16 h-16 text-purple-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">
            {t('रोजगारदाता कम्पनी सञ्जाल', 'Partner Employer Network')}
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 block">
            {alumniStats.partnerCompanies}
          </strong>
          <span className="text-[11px] text-purple-300 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> NTC, Ncell, WorldLink, Vianet
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe2 className="w-16 h-16 text-amber-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">
            {t('वैदेशिक रोजगारी (Gulf & Abroad)', 'Overseas Placements (Gulf & Abroad)')}
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">
            {alumniStats.abroadPlacement}
          </strong>
          <span className="text-[11px] text-amber-300 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> UAE, Qatar, Saudi, Japan
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            {[
              { id: 'all', ne: 'सबै कथाहरू (All Stories)', en: 'All Stories' },
              { id: 'fiber', ne: 'अप्टिकल फाइबर (FTTH & OFC)', en: 'Optical Fiber (FTTH & OFC)' },
              { id: 'telecom', ne: 'नेपाल टेलिकम (NTC/Telecom)', en: 'Nepal Telecom (NTC/Telco)' },
              { id: 'isp', ne: 'ISP टेक्निसियन (WorldLink/Vianet)', en: 'ISP Technicians (ISPs)' },
              { id: 'abroad', ne: 'वैदेशिक रोजगारी (Gulf/Abroad)', en: 'Overseas Jobs (Gulf & Abroad)' },
              { id: 'women-tech', ne: 'महिला प्राविधिक (Women)', en: 'Women in Tech' },
              { id: 'entrepreneur', ne: 'उद्यमी (Entrepreneurs)', en: 'Entrepreneurs & Contractors' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as TestimonialCategory)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {t(cat.ne, cat.en)}
              </button>
            ))}
          </div>

          {/* Search Box & Add Story Button */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('नाम, कम्पनी वा सीप खोज्नुहोस्...', 'Search name, company or skill...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md transition-transform active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('आफ्नो अनुभव पठाउनुहोस्', 'Submit Your Story')}</span>
              <span className="sm:hidden">{t('समीक्षा पठाउनुहोस्', 'Submit Review')}</span>
            </button>
          </div>

        </div>

        {/* Search Result Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {t('देखाउँदै:', 'Showing:')} <strong className="text-white">{filteredTestimonials.length}</strong> {t('सफलताका कथाहरू', 'success stories')}
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-blue-400 hover:underline text-[11px]"
            >
              {t('सबै वर्ग देखाउनुहोस्', 'Show All Categories')}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Container of Testimonial Cards */}
      <div className="relative group/scroll px-1">
        {/* Scroll Left Button */}
        <button
          onClick={() => scrollTestimonials('left')}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 bg-slate-950/95 hover:bg-slate-900 border border-slate-800 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all opacity-100 md:opacity-0 md:group-hover/scroll:opacity-100 flex items-center justify-center cursor-pointer hover:border-amber-500/50"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5 text-amber-400" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={() => scrollTestimonials('right')}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 bg-slate-950/95 hover:bg-slate-900 border border-slate-800 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all opacity-100 md:opacity-0 md:group-hover/scroll:opacity-100 flex items-center justify-center cursor-pointer hover:border-amber-500/50"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </button>

        {/* Horizontal Scroll Track */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4 scroll-smooth no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredTestimonials.map((tItem) => (
            <div
              key={tItem.id}
              className="w-[290px] sm:w-[350px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="space-y-3.5">
                
                {/* Card Header: Avatar, Name & Batch */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tItem.avatarColor} p-0.5 shadow-md shrink-0 flex items-center justify-center`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-bold text-base">
                        {isEnglish ? tItem.nameEnglish.slice(0, 2).toUpperCase() : tItem.nameNepali.slice(0, 2)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {isEnglish ? tItem.nameEnglish : tItem.nameNepali}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {isEnglish ? tItem.nameEnglish : tItem.nameEnglish} • <span className="font-mono text-slate-300">{tItem.batchYear.split(' ')[0]}</span>
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center text-amber-400 gap-0.5 shrink-0 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300">{isEnglish ? '5.0' : '५.०'}</span>
                  </div>
                </div>

                {/* Role & Company Tag */}
                <div className="space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 line-clamp-1">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span>{tItem.currentRole}</span>
                  </p>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 line-clamp-1 text-white font-medium">
                      <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                      {tItem.company}
                    </span>
                    <span className="text-slate-400 shrink-0 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-red-400" />
                      {t(tItem.location.split(' ')[0], tItem.location.split(' ')[0])}
                    </span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{isEnglish ? tItem.quoteEnglish : tItem.quoteNepali}"
                  </p>

                  {/* Bilingual toggle */}
                  <div>
                    <button
                      onClick={() => toggleEnglishQuote(tItem.id)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <Languages className="w-3 h-3" />
                      <span>{expandedEnglishQuotes[tItem.id] ? (isEnglish ? 'Hide Nepali' : 'नेपाली मात्र') : (isEnglish ? 'View Nepali Original' : 'English Summary')}</span>
                    </button>

                    {expandedEnglishQuotes[tItem.id] && (
                      <p className="text-[11px] text-slate-300 italic bg-slate-950 p-2.5 rounded-lg mt-1.5 border border-slate-800">
                        "{isEnglish ? tItem.quoteNepali : tItem.quoteEnglish}"
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Card Footer: Skills and Certification */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {tItem.skillsMastered.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> {t(tItem.certificationBadge, tItem.certificationBadge)}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {tItem.courseTaken.split(' ')[0]}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Employer & Hiring Partners Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-bold text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60">
              {t('रोजगारदाता साझेदार (Hiring Partners)', 'Hiring Partners & Corporate Employers')}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              {t('हाम्रा विद्यार्थीहरू कार्यरत प्रमुख टेलिकम तथा इन्टरनेट सेवा प्रदायकहरू', 'Key Telecom & ISP Employers Hiring Our Certified Technicians')}
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            {t(
              'NITVT बाट तालिम लिने विद्यार्थीहरूलाई नेपालका ख्यातिप्राप्त कम्पनीहरूमा उच्च प्राथमिकता दिइन्छ।',
              'NITVT graduates are given high priority for technical field deployment across leading telecommunications firms.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
          {hiringPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 p-3.5 rounded-xl space-y-1 transition-colors"
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs sm:text-sm text-white font-bold block">
                  {partner.name}
                </strong>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] text-amber-400 font-medium block">
                {t(partner.type, partner.type)}
              </span>
              <p className="text-[10px] text-slate-400">
                {t(partner.role, partner.role)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Call to Action Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-full">
            {t('तपाईंको सफलताको यात्रा आजै सुरु गर्नुहोस्', 'Start Your Technical Career Today')}
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white">
            {t('आफ्नो भविष्यलाई प्राविधिक सीपले सुरक्षित बनाउनुहोस्', 'Secure Your Career with In-Demand Telecom Skills')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t(
              'सुरेन्द्र ऐर (NITVT) को १ महिना (दैनिक ६ घण्टा) वा १० महिना (१६९६ घण्टा) को CTEVT तह-२ तालिममा भर्ना भई राष्ट्रिय तथा अन्तर्राष्ट्रिय स्तरको सीप सिक्नुहोस्।',
              'Enroll in NITVT 1-month intensive or 10-month (1696 hrs) CTEVT Level-2 certified training under Surendra Air and master industry-standard hands-on skills.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={onOpenEnrollment}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            {t('नयाँ भर्ना फारम भर्नुहोस् →', 'Enroll Now →')}
          </button>
        </div>
      </div>

      {/* Modal: Submit Alumni Success Story */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2.5 py-1 rounded-full">
                <MessageSquareHeart className="w-3.5 h-3.5" />
                <span>{t('पूर्व-विद्यार्थी प्रतिक्रिया फारम', 'Alumni Feedback & Review Form')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('आफ्नो अनुभव तथा सफलताको कथा सेयर गर्नुहोस्', 'Share Your Experience & Career Success Story')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('तपाईंको अनुभवले नयाँ भर्ना हुने विद्यार्थीहरूलाई सही मार्गदर्शन र प्रेरणा दिनेछ।', 'Your review and career journey inspire upcoming students to choose practical technical pathways.')}
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-950/90 border border-emerald-700 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {t('धन्यवाद! तपाईंको समीक्षा सफलतापूर्वक सुरक्षित भयो!', 'Thank you! Your testimonial has been saved successfully!')}
                </h4>
                <p className="text-xs text-emerald-200">
                  {t('तपाईंको सफलताको कथा सफलता पृष्ठमा प्रत्यक्ष थपिएको छ।', 'Your success story is now live in our alumni showcase.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('पूरा नाम (Full Name) *', 'Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा: Sujan Maharjan"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('ब्याच वर्ष (Batch Year)', 'Batch Year')}
                    </label>
                    <select
                      value={formBatch}
                      onChange={(e) => setFormBatch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="२०८१ ब्याच (2024)">{t('२०८१ ब्याच (2024)', '2024 Batch')}</option>
                      <option value="२०८० ब्याच (2023)">{t('२०८० ब्याच (2023)', '2023 Batch')}</option>
                      <option value="२०७९ ब्याच (2022)">{t('२०७९ ब्याच (2022)', '2022 Batch')}</option>
                      <option value="२०७८ ब्याच (2021)">{t('२०७८ ब्याच (2021)', '2021 Batch')}</option>
                      <option value="२०७७ ब्याच (2020)">{t('२०७७ ब्याच (2020)', '2020 Batch')}</option>
                      <option value="२०७५ वा अघि">{t('२०७५ वा अघि (Senior Alumni)', '2018 or Earlier (Senior Alumni)')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('पूरा गरेको तालिम (Course Completed)', 'Course Completed')}
                  </label>
                  <select
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="अप्टिकल फाईबर टेक्निसियन (FTTH & OFC Specialist)">
                      {t('अप्टिकल फाईबर टेक्निसियन तालिम (FTTH & OFC)', 'Optical Fiber Technician (FTTH & OFC)')}
                    </option>
                    <option value="टेलिकम टेक्निसियन तालिम तह–२ (CTEVT Level-2)">
                      {t('टेलिकम टेक्निसियन तालिम तह–२ (CTEVT Level-2)', 'Telecom Technician Level-2 (CTEVT)')}
                    </option>
                    <option value="जुनियर टेलिकम टेक्निसियन तह–१">
                      {t('जुनियर टेलिकम टेक्निसियन तालिम तह–१', 'Junior Telecom Technician Level-1')}
                    </option>
                    <option value="इलेक्ट्रिकल तथा सबस्टेशन तालिम">
                      {t('इलेक्ट्रिकल तथा अन्य प्राविधिक तालिम', 'Electrical & Other Vocational Trades')}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('कार्यरत कम्पनी / संस्था (Company) *', 'Current Company / Employer *')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="WorldLink, Nepal Telecom, Du UAE"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('हालको पद (Current Designation)', 'Current Job Title / Designation')}
                    </label>
                    <input
                      type="text"
                      placeholder="Fiber Splicer, Field Engineer"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('कार्यस्थल / शहर (Location)', 'Work Location / Country')}
                    </label>
                    <input
                      type="text"
                      placeholder="Kathmandu / Dubai / Pokhara"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('श्रेणी (Category)', 'Category')}
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as TestimonialCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="fiber">{t('अप्टिकल फाइबर (FTTH)', 'Optical Fiber (FTTH)')}</option>
                      <option value="telecom">{t('टेलिकम (NTC/Ncell)', 'Telecom (NTC/Ncell)')}</option>
                      <option value="isp">{t('ISP टेक्निसियन', 'ISP Technician')}</option>
                      <option value="abroad">{t('वैदेशिक रोजगारी (Gulf/Abroad)', 'Overseas Jobs (Gulf & Abroad)')}</option>
                      <option value="women-tech">{t('महिला प्राविधिक', 'Women in Tech')}</option>
                      <option value="entrepreneur">{t('उद्यमी / कन्ट्राक्टर', 'Entrepreneur / Contractor')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('तपाईंको अनुभव र नयाँ विद्यार्थीलाई सल्लाह (Your Review / Story) *', 'Your Review / Advice to Prospective Students *')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t(
                      'NITVT को ल्याब अभ्यास, सुरेन्द्र सरको पढाइ र रोजगारी पाउन कसरी सहयोग भयो लेख्नुहोस्...',
                      'Share your experience about hands-on lab training at NITVT, instructor mentorship, and career placement...'
                    )}
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    {t('रद्द गर्नुहोस्', 'Cancel')}
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('समीक्षा पठाउनुहोस्', 'Submit Review')}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
