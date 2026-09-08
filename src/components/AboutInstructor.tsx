import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Phone,
  Mail,
  Sparkles,
  Radio,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Send,
  UserCheck,
  Wrench,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  Linkedin
} from 'lucide-react';
import { defaultInstructorProfile } from '../data/instructorData';
import { InstructorProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AboutInstructorProps {
  onOpenEnrollment?: () => void;
  onOpenAiTutor?: () => void;
}

export const AboutInstructor: React.FC<AboutInstructorProps> = ({
  onOpenEnrollment,
  onOpenAiTutor,
}) => {
  const { t, isEnglish } = useLanguage();
  const [profile, setProfile] = useState<InstructorProfile>(() => {
    try {
      const saved = localStorage.getItem('nitvt_instructor_profile');
      return saved ? JSON.parse(saved) : defaultInstructorProfile;
    } catch {
      return defaultInstructorProfile;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('nitvt_instructor_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
        } catch (err) {
          console.error('Error parsing instructor profile:', err);
        }
      }
    };

    window.addEventListener('nitvt_instructor_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('nitvt_instructor_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header Banner */}
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white">
            {t('प्रशिक्षक प्रोफाइल तथा परिचय (Trainer Profile)', 'Trainer Profile & Introduction')}
          </h1>
          <p className="text-xs text-slate-400">
            {t(
              'नेपाल इन्स्टिच्युट अफ टेक्निकल एण्ड भोकेसनल ट्रेनिङ (NITVT) का मुख्य प्रशिक्षकको परिचय र अनुभव',
              'Profile, professional experience, and accreditation of Chief Telecom Instructor at NITVT Nepal'
            )}
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-800/40 p-6 sm:p-10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Instructor Photograph & Badges */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-indigo-500 to-emerald-400 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              
              {/* Image Container */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl">
                <img
                  src={profile.photoUrl}
                  alt={`${profile.nameNepali} (${profile.nameEnglish}) - Telecom Instructor`}
                  className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Badge at Bottom of Photo */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-left">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t('आधिकारिक प्रशिक्षक (Instructor)', 'Official Master Instructor')}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {isEnglish ? profile.nameEnglish : `${profile.nameNepali} (${profile.nameEnglish})`}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isEnglish ? (profile.roleEnglish || 'Chief Instructor - Telecom & Fiber Optics') : (profile.roleNepali || profile.roleEnglish)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Badges below photo */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {profile.experienceBadge && (
                <span className="inline-flex items-center gap-1 bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> {t(profile.experienceBadge, '19+ Years Telecom Training Experience')}
                </span>
              )}
              {profile.assessorBadge && (
                <span className="inline-flex items-center gap-1 bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> {t(profile.assessorBadge, 'CTEVT / NSTB Certified Skill Assessor')}
                </span>
              )}
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-slate-200 transition-all hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profile.phone}</span>
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-slate-200 transition-all hover:text-white"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('ईमेल गर्नुहोस्', 'Send Email')}</span>
                </a>
              )}
            </div>

            {/* Surendra Air Social Media Grid */}
            <div className="pt-4 border-t border-slate-800/60 w-full max-w-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center lg:text-left mb-2.5">
                {t('प्रशिक्षक सुरेन्द्र ऐरको सामाजिक सञ्जालहरू', "Instructor Surendra Air's Social Channels")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.facebook.com/Surendra.aircom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-800 hover:border-indigo-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/@surendraair2464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-rose-950 hover:text-rose-300 border border-slate-800 hover:border-rose-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://www.tiktok.com/@surendra_air"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-purple-950 hover:text-purple-300 border border-slate-800 hover:border-purple-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <span className="text-pink-500 font-black text-sm select-none leading-none w-4 text-center">𝅘𝅥𝅮</span>
                  <span>TikTok</span>
                </a>
                <a
                  href="https://www.instagram.com/surendra_air_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 hover:border-amber-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://x.com/surendraair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <span className="font-bold text-xs select-none leading-none w-4 text-center text-slate-100">𝕏</span>
                  <span>X (Twitter)</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/surendra-air-537778171/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-sky-950 hover:text-sky-300 border border-slate-800 hover:border-sky-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
                  referrerPolicy="no-referrer"
                >
                  <Linkedin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://wa.me/9779848805119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-950/80 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-800 hover:border-emerald-800/40 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow col-span-2 justify-center"
                  referrerPolicy="no-referrer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp (+977 9848805119)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Formatted Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instructor Profile & Vision</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t(profile.headingNepali || 'मेरो बारेमा (About Me)', 'About Instructor Surendra Air')}
              </h2>
            </div>

            {/* Formatted Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
              {profile.paragraphsNepali && profile.paragraphsNepali.map((pText, pIdx) => {
                let enText = pText;
                if (pIdx === 0) {
                  enText = 'Namaste, I am Surendra Air. I have been continuously serving as a Senior Instructor in telecommunications, optical fiber technology, and vocational engineering for over 19 years since 2007 (2064 B.S.) at Nepal Institute of Technical & Vocational Training (NITVT) Pvt. Ltd., Lalitpur.';
                } else if (pIdx === 1) {
                  enText = 'Our institute is officially accredited by the Council for Technical Education and Vocational Training (CTEVT) and prepares technicians for National Skill Testing Board (NSTB) Level 1 & Level 2 certification. Having trained thousands of technicians now thriving in Nepal Telecom, private ISPs, Gulf countries, and European infrastructure projects, our mission is to empower youth with 100% practical, market-ready skills.';
                } else if (pIdx === 2) {
                  enText = 'We provide complete laboratory infrastructure featuring fusion splicers, OTDR optical analyzers, optical power meters, copper jointing kits, and EPABX intercom boards. I personally mentor every student through hands-on troubleshooting and real-world field projects.';
                }
                return (
                  <div
                    key={pIdx}
                    className={
                      pIdx === 0
                        ? "p-4 bg-slate-950/60 border border-indigo-900/40 rounded-2xl"
                        : pIdx === 2
                        ? "p-4 bg-blue-950/40 border border-blue-900/50 rounded-2xl text-slate-300"
                        : "text-slate-300"
                    }
                  >
                    <p>{t(pText, enText)}</p>
                  </div>
                );
              })}
            </div>

            {/* Highlight Motto Banner */}
            {profile.mottoNepali && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 border-2 border-amber-500/40 shadow-lg">
                <p className="text-base sm:text-lg font-extrabold text-amber-300 text-center tracking-wide">
                  {t(profile.mottoNepali, '"Quality Technical Training, Proven Hands-on Skills, and Guaranteed Career Pathways."')}
                </p>
              </div>
            )}

            {/* Signature & Closing */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-300">{t('धन्यवाद।', 'Thank you.')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">
                  {isEnglish ? profile.nameEnglish : (profile.signatureNameNepali || profile.nameNepali)}
                </p>
                <p className="text-xs font-semibold text-amber-400 italic">
                  {isEnglish ? (profile.roleEnglish || 'Chief Instructor') : (profile.signatureTitleNepali || profile.roleNepali)}
                </p>
              </div>

              {onOpenEnrollment && (
                <button
                  onClick={onOpenEnrollment}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('तालिममा सहभागी हुनुहोस्', 'Enroll in Training')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Specialized Training Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {t('तह–१ जुनियर टेलिकम टेक्निसियन', 'Level-1 Junior Telecom Technician')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(
              'कपर OSP केबल, MDF, क्याबिनेट, पोल इरेक्सन, स्टे वायर, DP बक्स, र कलर कोडको आधारभूत सीप।',
              'Copper OSP cabling, MDF, cabinets, pole erection, stay wire setup, DP boxes, and standard color code mastery.'
            )}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {t('तह–२ टेलिकम टेक्निसियन (OFC)', 'Level-2 Telecom Technician (OFC)')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(
              'अप्टिकल फाइबर, फ्युजन स्प्लाइसिङ, OTDR वेभफर्म विश्लेषण, पावर मिटर र GPON FTTH डिजाइन।',
              'Optical fiber jointing, fusion splicing, OTDR trace analysis, power meter dB measurement, and GPON FTTH link design.'
            )}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {t('EPABX & Structured Cabling', 'EPABX & Structured Cabling')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(
              'इन्टरकम प्रोग्रामिङ, क्याट-६ ल्यान स्ट्रक्चर्ड नेटवर्किङ, प्याच प्यानल र र्‍याक व्यवस्थापन।',
              'Intercom PBX programming, Cat-6 LAN structured cabling, patch panel crimping, and server rack management.'
            )}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {t('CTEVT / NSTB परीक्षा तयारी', 'CTEVT / NSTB Exam Prep')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(
              'अन्तरवार्ता (VIVA) प्रश्नोत्तर, प्रयोगात्मक परीक्षण (Practical Skill Test) तथा कार्यक्षेत्र सुरक्षा।',
              'VIVA oral interview prep, practical skill performance assessment, fault simulation, and OSHA occupational safety.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
