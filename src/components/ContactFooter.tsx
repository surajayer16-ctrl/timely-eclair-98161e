import React, { useState } from 'react';
import { instituteInfo } from '../data/coursesData';
import { MapPin, Phone, Mail, Globe, Award, ShieldCheck, Clock, Send, CheckCircle2, Facebook, Youtube, Instagram, MessageCircle, MessageSquare } from 'lucide-react';
import { NitvtLogo } from './NitvtLogo';
import { useLanguage } from '../context/LanguageContext';

interface ContactFooterProps {
  onOpenEnrollment: () => void;
  onSelectTab: (tab: string) => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  onOpenEnrollment,
  onSelectTab,
}) => {
  const { t, isEnglish } = useLanguage();
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setQuickPhone('');
    }, 4000);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Institute Overview & Accreditation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <NitvtLogo size="lg" />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {t('सुरेन्द्र ऐर (Surendra Air)', 'Surendra Air (NITVT)')}
                </h3>
                <p className="text-[11px] text-amber-300 font-mono">
                  Nepal Institute of Technical & Vocational Training (NITVT) Pvt. Ltd.
                </p>
                <p className="text-[10px] text-amber-400 font-medium">
                  {t('Estd. २०६४ • CTEVT Affiliated', 'Estd. 2007 • CTEVT Affiliated')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t(
                'विगत १९ वर्षदेखि प्राविधिक क्षेत्रमा गुणस्तरीय तालिम प्रदान गर्दै आएको CTEVT बाट सम्बन्धन प्राप्त अग्रिणी संस्था। आफ्नै पूर्ण प्रयोगात्मक पूर्वाधार (Practical Lab) मा दक्ष टेलिकम इन्जिनियरहरूद्वारा १००% सीपमूलक तालिम।',
                'A premier CTEVT-affiliated technical institute delivering top-quality professional vocational education for over 19 years. 100% practical, hands-on field training led by veteran telecom engineers in fully equipped laboratories.'
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                {t('CTEVT सम्बन्धन प्राप्त', 'CTEVT Affiliated')}
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {t('NSTB Skill Test Ready', 'NSTB Skill Test Ready')}
              </span>
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {t('१९ वर्षको इतिहास (२०६४)', '19+ Years Legacy (Estd. 2007)')}
              </span>
            </div>

            {/* NITVT Social Links */}
            <div className="space-y-2 pt-3 border-t border-slate-900/60">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                {t('NITVT सामाजिक सञ्जालहरू (NITVT Socials)', 'NITVT Social Channels')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href="https://www.facebook.com/nitvt.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-800 hover:border-indigo-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <Facebook className="w-3 h-3 text-blue-500" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/@NITVT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-rose-950 hover:text-rose-300 border border-slate-800 hover:border-rose-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <Youtube className="w-3 h-3 text-red-500" />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://www.tiktok.com/@nitvtnepal?_r=1&_t=ZS-974GqfuQJHR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-purple-950 hover:text-purple-300 border border-slate-800 hover:border-purple-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <span className="text-pink-500 font-black text-xs select-none">𝅘𝅥𝅮</span>
                  <span>TikTok</span>
                </a>
                <a
                  href="https://www.instagram.com/nitvt_nepal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 hover:border-amber-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <Instagram className="w-3 h-3 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://x.com/nitvtnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <span className="font-bold text-[11px] select-none text-slate-100">𝕏</span>
                  <span>X (Twitter)</span>
                </a>
                <a
                  href="https://www.messenger.com/t/279781338553846/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                  <span>Messenger</span>
                </a>
                <a
                  href="https://wa.me/9779810692221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-800 hover:border-emerald-800/40 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
                  referrerPolicy="no-referrer"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('द्रुत लिङ्कहरू (Quick Navigation)', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('अप्टिकल फाईबर टेक्निसियन (OFC)', 'Optical Fiber Technician (OFC)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('जुनियर टेलिकम टेक्निसियन तह–१', 'Junior Telecom Technician Level-1')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('टेलिकम टेक्निसियन तह–२', 'Telecom Technician Level-2')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('curriculum')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('डिजिटल पाठ्यक्रम म्यानुअल (९ वटा च्याप्टर)', 'Digital Curriculum Manual (9 Chapters)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('tools')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('प्राविधिक औजार तथा उपकरण सूची (९०+)', 'Technical Tools & Equipment Catalog (90+)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('exams')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('CTEVT राष्ट्रिय सीप परीक्षण मोडल परीक्षा', 'CTEVT NSTB Model Exams & Quizzes')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blog')}
                  className="hover:text-amber-300 transition-colors text-cyan-300 font-bold text-left"
                >
                  • {t('हाम्रो प्राविधिक ब्लग तथा समाचार (Our Blog)', 'Technical Blog & News')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-amber-300 transition-colors text-amber-400 font-semibold text-left"
                >
                  • {t('प्रशिक्षक सुरेन्द्र ऐर (मेरो बारेमा - About)', 'Instructor Surendra Air (About Me)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('testimonials')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • {t('पूर्व-विद्यार्थी सफलताका कथाहरू (Testimonials)', 'Alumni Success Stories & Testimonials')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details & Callback */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('सम्पर्क ठेगाना (Contact & Location)', 'Contact & Location')}
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{t('केन्द्रीय कार्यालय / तालिम केन्द्र:', 'Head Office & Training Center:')}</strong> <br />
                  {t('महालक्ष्मी नगरपालिका–२, ललितपुर (बालकुमारी/ उदयबस्ती)', 'Mahalaxmi Municipality-2, Lalitpur (Balkumari / Udayabasti)')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{t('फोन:', 'Phone:')}</strong> 01-5203522 / 9848805119
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${instituteInfo.email}`} className="hover:text-amber-400 transition-colors">
                  <strong>{t('इमेल:', 'Email:')}</strong> {instituteInfo.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>{t('वेबसाइट:', 'Website:')}</strong> www.nitvt.com.np
                </span>
              </div>
            </div>

            {/* Quick Callback Mini Form */}
            <form onSubmit={handleQuickCallback} className="pt-2">
              <div className="text-[11px] font-semibold text-slate-300 mb-1">
                {t('तत्काल फोन परामर्श चाहियो भने मोबाइल नम्बर राख्नुहोस्:', 'Need quick consultation? Enter your mobile number:')}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="tel"
                  placeholder="9848805119"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {submitted && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('धन्यवाद! हाम्रो शाखाबाट केही बेरमै फोन आउनेछ।', 'Thank you! Our admission desk will call you shortly.')}</span>
                </div>
              )}
            </form>

            {/* NITVT Office Location Map right below */}
            <div id="footer-office-map-card" className="w-full rounded-xl overflow-hidden border border-slate-900 shadow-md bg-slate-900/40 p-1 mt-1">
              <iframe
                title="NITVT Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.203928178125!2d85.33711311153163!3d27.66608487611029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19976dabd771%3A0x11e91df8d23a1862!2sNITVT%20(Nepal%20Institute%20of%20Technical%20%26%20Vocational%20Training%20Pvt.%20Ltd.)!5e0!3m2!1sen!2snp!4v1710000000000!5m2!1sen!2snp"
                width="100%"
                height="100"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
              <div className="flex items-center justify-between px-2 py-0.5 text-[9px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" /> NITVT Office Location
                </span>
                <a
                  href="https://maps.app.goo.gl/m1LBFQCUKWqY2YaN9?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:underline hover:text-amber-400 transition-colors"
                >
                  {t('गुगल म्याप ↗', 'Google Maps ↗')}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            {t(
              `© २०६४ – ${new Date().getFullYear()} सुरेन्द्र ऐर (Surendra Air). सर्वाधिकार सुरक्षित।`,
              `© 2007 – ${new Date().getFullYear()} Surendra Air (NITVT). All rights reserved.`
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://ctevt.org.np/curriculum/short-term"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
              referrerPolicy="no-referrer"
            >
              CTEVT Short-Term Curriculum ↗
            </a>
            <span>•</span>
            <a
              href="https://www.nstb.org.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              referrerPolicy="no-referrer"
            >
              NSTB Nepal ↗
            </a>
            <span>•</span>
            <span>Lalitpur, Nepal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
