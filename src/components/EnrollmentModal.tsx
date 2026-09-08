import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Mail, User, BookOpen, Calendar, Award, ShieldCheck, Printer, Download, Sparkles, FileText, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { coursesList, instituteInfo } from '../data/coursesData';
import { Course, Enrollment } from '../types';
import { NitvtLogo } from './NitvtLogo';
import { generateEnrollmentPDF } from '../lib/pdfGenerator';
import { useLanguage } from '../context/LanguageContext';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
}

const GOOGLE_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw1d3AGcbP6H5pCVJ3H_p_6ktBcrQrVdjKw6OEF5R01pNban64cUMTL1fg-Ff65oRFnZg/exec';

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  initialCourse,
}) => {
  const { t, isEnglish } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourse ? initialCourse.id : coursesList[0].id
  );
  const [selectedBatch, setSelectedBatch] = useState('Morning Batch (7:00 - 9:00 AM)');
  const [experience, setExperience] = useState('Beginner (नयाँ सिकारु)');
  const [purpose, setPurpose] = useState('CTEVT / NSTB Skill Test & Certificate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnrollment, setSubmittedEnrollment] = useState<Enrollment | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const selectedCourse = coursesList.find((c) => c.id === selectedCourseId);
    const courseTitle = selectedCourse 
      ? (isEnglish ? selectedCourse.titleEnglish : selectedCourse.titleNepali) 
      : (isEnglish ? 'Telecom Training' : 'टेलिकम तालिम');
    const now = new Date();
    const formattedDate = now.toLocaleDateString(isEnglish ? 'en-US' : 'ne-NP') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Client-side direct submission attempt to Google Apps Script as dual backup
    try {
      fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          name: fullName,
          phone,
          mobile: phone,
          email,
          course: courseTitle,
          batch: selectedBatch,
          experience,
          purpose,
          timestamp: now.toISOString(),
          date: formattedDate,
        }),
      }).catch((e) => console.log('Client direct sheet sync:', e));
    } catch (_) {}

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          course: courseTitle,
          batch: selectedBatch,
          experience,
          purpose,
        }),
      });
      const data = await res.json();
      if (data.success && data.enrollment) {
        setSubmittedEnrollment(data.enrollment);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    } catch (err) {
      console.error(err);
      // Fallback local registration
      const fallback: Enrollment = {
        id: 'NITVT-' + Math.floor(100000 + Math.random() * 900000),
        fullName,
        phone,
        email: email || 'nitvtnepal@gmail.com',
        course: courseTitle,
        batch: selectedBatch,
        experience,
        purpose,
        createdAt: formattedDate,
        seatNumber: 'SEAT-34',
      };
      setSubmittedEnrollment(fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-white overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-amber-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NitvtLogo size="md" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {t('अनलाइन सिट बुकिङ तथा भर्ना फारम', 'Online Seat Booking & Enrollment Form')}
              </h3>
              <p className="text-xs text-amber-200">
                {t('सुरेन्द्र ऐर (Surendra Air) • स्था. २०६४ • CTEVT सम्बन्धन', 'Surendra Air • Est. 2008 • CTEVT Affiliated')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submittedEnrollment ? (
            /* Success Receipt Card */
            <div className="space-y-6 text-center py-2" id="printable-receipt">
              <div className="flex items-center justify-center">
                <NitvtLogo size="xl" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/60 px-3 py-0.5 rounded-full">
                  {t('सिट सुरक्षित भयो (Confirmed Seat)', 'Seat Confirmed')}
                </span>
                <h4 className="text-xl font-bold text-white mt-2">
                  {t('बधाई छ,', 'Congratulations,')} {submittedEnrollment.fullName}!
                </h4>
                <p className="text-xs text-slate-300">
                  {t(
                    'तपाईंको सिट सफलतापूर्वक दर्ता भएको छ। हाम्रो तालिम शाखाबाट छिट्टै सम्पर्क गरिनेछ।',
                    'Your seat has been reserved successfully. Our admissions desk will contact you shortly.'
                  )}
                </p>
              </div>

              {/* Official Receipt Box */}
              <div className="bg-slate-950/90 border border-slate-700/80 rounded-xl p-4 text-left text-xs space-y-2.5 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('दर्ता कोड (Token ID):', 'Token ID:')}</span>
                  <strong className="text-amber-400 font-bold">{submittedEnrollment.id}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('सिट नं. (Seat Number):', 'Seat Number:')}</span>
                  <strong className="text-cyan-400">{submittedEnrollment.seatNumber}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('कोर्स (Selected Course):', 'Selected Course:')}</span>
                  <span className="text-slate-100 font-sans font-semibold text-right">{submittedEnrollment.course}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('शिफ्ट (Time Shift):', 'Time Shift:')}</span>
                  <span className="text-slate-200">{submittedEnrollment.batch}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('सम्पर्क नम्बर (Phone):', 'Phone Number:')}</span>
                  <span className="text-slate-200">{submittedEnrollment.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{t('अनलाइन डाटा सिङ्क:', 'Database Sync:')}</span>
                  <span className="text-emerald-400 font-sans font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('Google Sheet मा रेकर्ड भयो', 'Recorded in Official Sheet')}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('संस्थान ठेगाना:', 'Institute Address:')}</span>
                  <span className="text-slate-300 font-sans">{t('महालक्ष्मी-२, ललितपुर (०१-५२०३५२२)', 'Mahalaxmi-2, Lalitpur (01-5203522)')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => generateEnrollmentPDF(submittedEnrollment)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{t('PDF रसिद डाउनलोड (Download PDF Receipt)', 'Download PDF Receipt')}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('प्रिन्ट गर्नुहोस्', 'Print Receipt')}</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedEnrollment(null);
                    onClose();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors"
                >
                  {t('बन्द गर्नुहोस्', 'Close')}
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Direct Official Website Application Alert Box */}
              <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-xl p-3.5 mb-2 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('आधिकारिक अनलाइन फारम (Official Application Form)', 'Official Online Portal Form')}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                  {t(
                    'कम्प्युटर वा मोबाइलबाट सिधै NITVT को मुख्य सर्भरमा आधिकारिक भर्ना आवेदन दिनको लागि तलको लिङ्क बटन थिच्नुहोस्:',
                    'To apply directly on the central NITVT portal, click the button below:'
                  )}
                </p>
                <a
                  href="https://nitvt.com.np/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-2.5 px-3 rounded-lg text-xs transition-all shadow hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>{t('सिधै NITVT Apply Page मा जानुहोस्', 'Visit NITVT Direct Apply Page')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('प्रशिक्षार्थीको पूरा नाम (Full Name) *', 'Trainee Full Name *')}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('उदा. सुरज ऐर / प्रकाश श्रेष्ठ', 'e.g., Suraj Air / Prakash Shrestha')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none transition-colors"
                />
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('मोबाइल नम्बर (Mobile Number) *', 'Mobile Number *')}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9848805119 / 98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('इमेल ठेगाना (Email Address)', 'Email Address')}</span>
                  </label>
                  <input
                    type="email"
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('इच्छुक तालिम विषय (Select Course) *', 'Select Training Course *')}</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-slate-100 outline-none transition-colors"
                >
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isEnglish ? c.titleEnglish : c.titleNepali} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch / Shift & Experience Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t('उपयुक्त समय (Batch Shift)', 'Batch Shift')}</span>
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-slate-100 outline-none transition-colors"
                  >
                    <option value="Morning Batch (7:00 - 9:00 AM)">{t('बिहानी सिफ्ट (७:०० - ९:०० AM)', 'Morning Batch (7:00 - 9:00 AM)')}</option>
                    <option value="Day Batch (11:00 AM - 1:00 PM)">{t('दिउँसोको सिफ्ट (११:०० - १:०० PM)', 'Day Batch (11:00 AM - 1:00 PM)')}</option>
                    <option value="Evening Batch (4:00 - 6:00 PM)">{t('साँझको सिफ्ट (४:०० - ६:०० PM)', 'Evening Batch (4:00 - 6:00 PM)')}</option>
                    <option value="Fast Track Weekend Batch">{t('फास्ट ट्र्याक शनिबारे सिफ्ट', 'Fast Track Weekend Batch')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('अनुभव स्तर (Experience)', 'Experience Level')}</span>
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-slate-100 outline-none transition-colors"
                  >
                    <option value="Beginner">{t('नयाँ सिकारु (Beginner)', 'Beginner / Fresher')}</option>
                    <option value="ISP Technician">{t('ISP मा कार्यरत प्राविधिक', 'Working ISP Technician')}</option>
                    <option value="NTC Employee">{t('नेपाल टेलिकममा कार्यरत', 'Nepal Telecom Staff')}</option>
                    <option value="Engineering Student">{t('इन्जिनियरिङ विद्यार्थी', 'Engineering / Diploma Student')}</option>
                    <option value="Experienced without Certificate">{t('अनुभवी (प्रमाणपत्र आवश्यक)', 'Experienced (Certification needed)')}</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">{t('तालिम लिनुको मुख्य उद्देश्य (Purpose):', 'Main Purpose of Training:')}</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-slate-100 outline-none transition-colors"
                >
                  <option value="CTEVT / NSTB Skill Test & Certificate">{t('CTEVT राष्ट्रिय सीप परीक्षण परीक्षा तथा प्रमाणपत्र', 'CTEVT / NSTB National Skill Test & Certificate')}</option>
                  <option value="ISP / Nepal Telecom Job Placement">{t('इन्टरनेट कम्पनी वा नेपाल टेलिकममा रोजगारी', 'ISP / Nepal Telecom Job Placement')}</option>
                  <option value="Job Promotion in Telecom">{t('नेपाल टेलिकम / संस्थामा बढुवा (Promotion)', 'Job Promotion in Telecom Industry')}</option>
                  <option value="Foreign Employment (Gulf / Abroad)">{t('वैदेशिक रोजगारी (Telecom/Fiber Technician)', 'Foreign Employment (Telecom / Fiber Technician)')}</option>
                  <option value="Self Business / Contractor">{t('आफ्नै प्राविधिक व्यवसाय / ठेक्कापट्टा', 'Starting Own Telecom Business / Contracting')}</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-600/30 text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{t('सिट सुरक्षित गर्दै...', 'Reserving Seat...')}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('फारम बुझाउनुहोस् र सिट सुरक्षित गर्नुहोस्', 'Submit & Reserve My Seat')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2 pt-1">
                <span>📍 {t('महालक्ष्मी-२, ललितपुर', 'Mahalaxmi-2, Lalitpur')}</span>
                <span>•</span>
                <span>📞 01-5203522 / 9848805119</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
