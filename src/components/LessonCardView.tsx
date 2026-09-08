import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Volume2,
  HelpCircle,
  Zap,
  Wrench,
  Layers,
  ArrowRight,
  Edit,
  Maximize2,
  X,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { ElectricianLesson, wireCapacityTable, electricalSymbolsList, practicalCircuitsData } from '../data/electricianNoteData';

interface LessonCardViewProps {
  lesson: ElectricianLesson;
  isWhitePaperMode: boolean;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  onNavigateTab?: (tab: 'symbols' | 'wire-table' | 'ohms-law' | 'safety' | 'practicals') => void;
}

export const LessonCardView: React.FC<LessonCardViewProps> = ({
  lesson,
  isWhitePaperMode,
  isSpeaking,
  speakText,
  onNavigateTab
}) => {
  const [zoomedImage, setZoomedImage] = useState<{ url: string; caption?: string } | null>(null);

  return (
    <div
      id={`lesson-day-${lesson.dayNumber}`}
      className={`rounded-3xl border p-5 sm:p-8 space-y-6 shadow-xl scroll-mt-24 transition-all ${
        isWhitePaperMode
          ? 'bg-white border-slate-200'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      {/* Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-slate-950 border border-slate-700 rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {zoomedImage.caption || `${lesson.day} - ${lesson.title}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={zoomedImage.url}
                  download={`electrician-diagram-day-${lesson.dayNumber}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  title="डाउनलोड / ठूलो ट्याबमा खोल्नुहोस्"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setZoomedImage(null)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[250px] max-h-[70vh]">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.caption || 'Electrician note photo'}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>

            {zoomedImage.caption && (
              <div className="w-full p-2.5 bg-slate-900/90 text-center border-t border-slate-800">
                <p className="text-xs text-amber-300 font-semibold">{zoomedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-lg shadow-sm">
              {lesson.day}
            </span>
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${
                isWhitePaperMode ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              समय: {lesson.duration}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                lesson.category === 'foundation'
                  ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                  : lesson.category === 'tools'
                  ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                  : lesson.category === 'circuits'
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                  : lesson.category === 'safety'
                  ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                  : lesson.category === 'symbols'
                  ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                  : 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
              }`}
            >
              {lesson.category.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 leading-tight">
            {lesson.title}
          </h2>
          <p
            className={`text-xs sm:text-sm font-semibold ${
              isWhitePaperMode ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {lesson.nepaliTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('nitvt_open_admin', {
                  detail: { tab: 'electrician', editElectricianDay: lesson.dayNumber }
                })
              );
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isWhitePaperMode
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
            }`}
            title="यो पाठ एडमिन प्यानलबाट सम्पादन गर्नुहोस्"
          >
            <Edit className="w-3.5 h-3.5 text-amber-400" />
            <span>एडमिन सम्पादन</span>
          </button>

          <button
            type="button"
            onClick={() =>
              speakText(
                `${lesson.day}। ${lesson.title}। उद्देश्य: ${lesson.objective}`
              )
            }
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : isWhitePaperMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'सुनाइ रोक्नुहोस्' : 'पाठ सुन्नुहोस्'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Objective */}
      <div
        className={`p-4 rounded-2xl border ${
          isWhitePaperMode
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
        }`}
      >
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          कक्षाको मुख्य उद्देश्य (Class Objective):
        </h3>
        <p className="text-sm font-medium leading-relaxed">
          {lesson.objective}
        </p>
      </div>

      {/* Main Lesson Photo / Diagram (If provided) */}
      {lesson.imageUrl && (
        <div
          className={`rounded-2xl border overflow-hidden p-3.5 space-y-2.5 transition-all group ${
            isWhitePaperMode
              ? 'bg-slate-50 border-slate-200 shadow-sm'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>पाठको आधिकारिक तस्विर तथा रेखाचित्र (Lesson Diagram)</span>
            </div>
            <button
              type="button"
              onClick={() => setZoomedImage({ url: lesson.imageUrl!, caption: lesson.imageCaption || lesson.title })}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ठूलो बनाएर हेर्नुहोस्</span>
            </button>
          </div>

          <div
            className="relative rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800/80 flex items-center justify-center max-h-80 sm:max-h-96"
            onClick={() => setZoomedImage({ url: lesson.imageUrl!, caption: lesson.imageCaption || lesson.title })}
          >
            <img
              src={lesson.imageUrl}
              alt={lesson.imageCaption || lesson.title}
              className="w-full h-auto max-h-80 sm:max-h-96 object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> क्लिक गरी जुम गर्नुहोस्
              </span>
            </div>
          </div>

          {lesson.imageCaption && (
            <p className="text-xs text-center text-slate-400 font-medium italic pt-1">
              📷 {lesson.imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Multiple Photos Gallery (if provided) */}
      {lesson.images && lesson.images.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            थप सम्बन्धित फोटोहरू ({lesson.images.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {lesson.images.map((img, iIdx) => (
              <div
                key={iIdx}
                onClick={() => setZoomedImage({ url: img.url, caption: img.caption || `${lesson.title} - Photo ${iIdx + 1}` })}
                className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-pointer hover:border-amber-500/60 transition-all shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.caption || 'Electrician photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] text-white font-bold truncate">
                    {img.caption || `फोटो ${iIdx + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehensive Content Sections */}
      <div className="space-y-6">
        {lesson.contentSections.map((sec, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${
              isWhitePaperMode
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-950/60 border-slate-800'
            } space-y-3`}
          >
            <h4 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{sec.heading}</span>
            </h4>
            <p
              className={`text-sm leading-relaxed whitespace-pre-line ${
                isWhitePaperMode ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {sec.text}
            </p>

            {/* Section Specific Custom Photo / Diagram */}
            {sec.imageUrl && (
              <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    खण्ड तस्विर / डायग्राम
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomedImage({ url: sec.imageUrl!, caption: sec.imageCaption || sec.heading })}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    जुम
                  </button>
                </div>
                <div
                  className="rounded-xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center cursor-pointer group"
                  onClick={() => setZoomedImage({ url: sec.imageUrl!, caption: sec.imageCaption || sec.heading })}
                >
                  <img
                    src={sec.imageUrl}
                    alt={sec.imageCaption || sec.heading}
                    className="w-full max-h-64 object-contain group-hover:scale-[1.01] transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {sec.imageCaption && (
                  <p className="text-[11px] text-center text-slate-400 italic">
                    📷 {sec.imageCaption}
                  </p>
                )}
              </div>
            )}

            {sec.bullets && (
              <ul className="space-y-1.5 pl-4 text-xs sm:text-sm list-disc marker:text-amber-500">
                {sec.bullets.map((b, bIdx) => (
                  <li
                    key={bIdx}
                    className={`leading-relaxed whitespace-pre-line ${
                      isWhitePaperMode ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* DIAGRAM 1: DC Waveform */}
            {sec.diagramType === 'dc-waveform' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-cyan-400 mb-2">
                  रेखा चित्र नं. १: दिष्ट धारा (Direct Current / D.C.)
                </span>
                <svg className="w-full max-w-md h-24" viewBox="0 0 300 80">
                  <line
                    x1="30"
                    y1="50"
                    x2="270"
                    y2="50"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1="30"
                    y1="20"
                    x2="30"
                    y2="70"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="30"
                    y1="30"
                    x2="260"
                    y2="30"
                    stroke="#ef4444"
                    strokeWidth="3"
                  />
                  <text
                    x="268"
                    y="34"
                    fill="#ef4444"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    +
                  </text>
                  <text x="270" y="54" fill="#64748b" fontSize="11">
                    0V
                  </text>
                  <text x="35" y="24" fill="#ef4444" fontSize="10">
                    स्थिर DC भोल्टेज (Constant Voltage)
                  </text>
                </svg>
                <span className="text-[11px] text-slate-400 mt-1">
                  D.C. मा एउटा ध्रुव जहिल्यै Positive (+) र अर्को Negative (-) मात्र हुन्छ।
                </span>
              </div>
            )}

            {/* DIAGRAM 2: AC Waveform */}
            {sec.diagramType === 'ac-waveform' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-amber-400 mb-2">
                  रेखा चित्र नं. २: प्रत्यावर्ती धारा (Alternating Current / A.C.) - ५० हर्ज साइन वेभ
                </span>
                <svg className="w-full max-w-md h-36" viewBox="0 0 320 120">
                  <line
                    x1="20"
                    y1="60"
                    x2="300"
                    y2="60"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="40"
                    y1="10"
                    x2="40"
                    y2="110"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <text
                    x="25"
                    y="20"
                    fill="#22c55e"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    +
                  </text>
                  <text
                    x="25"
                    y="105"
                    fill="#ef4444"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    -
                  </text>
                  <text x="25" y="64" fill="#94a3b8" fontSize="10">
                    0
                  </text>
                  <path
                    d="M 40 60 Q 95 10 150 60 Q 205 110 260 60"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <text
                    x="75"
                    y="35"
                    fill="#22c55e"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    +ve Half Cycle
                  </text>
                  <text x="90" y="20" fill="#f59e0b" fontSize="9">
                    अधिकतम
                  </text>
                  <text
                    x="180"
                    y="85"
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    -ve Half Cycle
                  </text>
                  <text x="195" y="102" fill="#f59e0b" fontSize="9">
                    न्युनतम
                  </text>
                  <line
                    x1="40"
                    y1="115"
                    x2="260"
                    y2="115"
                    stroke="#94a3b8"
                    strokeWidth="1"
                  />
                  <text
                    x="120"
                    y="112"
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    One Cycle (१ चक्र = १/५० सेकेन्ड)
                  </text>
                </svg>
                <span className="text-[11px] text-slate-400 mt-1">
                  १ सेकेन्डमा ५० पटक +ve र ५० पटक -ve (५० Hz फ्रिक्वेन्सी)।
                </span>
              </div>
            )}

            {/* DIAGRAM 3: Atom Structure */}
            {sec.diagramType === 'atom-structure' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-purple-400 mb-2">
                  रेखा चित्र नं. ३: परमाणुको बनावट (Structure of Atom - 2N² सुत्र)
                </span>
                <svg className="w-full max-w-sm h-64" viewBox="0 0 240 240">
                  <circle
                    cx="120"
                    cy="120"
                    r="105"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="80"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="55"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="30"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <circle cx="120" cy="120" r="15" fill="#f59e0b" />
                  <text
                    x="120"
                    y="123"
                    textAnchor="middle"
                    fill="#020617"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    Nucleus (P+N)
                  </text>
                  <text x="120" y="86" fill="#38bdf8" fontSize="8">
                    K=2
                  </text>
                  <text x="120" y="61" fill="#38bdf8" fontSize="8">
                    L=8
                  </text>
                  <text x="120" y="36" fill="#38bdf8" fontSize="8">
                    M=18
                  </text>
                  <text x="120" y="11" fill="#38bdf8" fontSize="8">
                    N=32
                  </text>
                  <circle cx="120" cy="90" r="3.5" fill="#ef4444" />
                  <circle cx="120" cy="150" r="3.5" fill="#ef4444" />
                  <circle cx="65" cy="120" r="3.5" fill="#ef4444" />
                  <circle cx="175" cy="120" r="3.5" fill="#ef4444" />
                  <circle cx="40" cy="120" r="3.5" fill="#ef4444" />
                  <circle cx="200" cy="120" r="3.5" fill="#ef4444" />
                  <circle cx="15" cy="120" r="3.5" fill="#ef4444" />
                  <circle cx="225" cy="120" r="3.5" fill="#ef4444" />
                </svg>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px] text-center w-full">
                  <span className="p-1 bg-slate-800 rounded-lg text-cyan-300">
                    K-Shell: 2×(1)² = २
                  </span>
                  <span className="p-1 bg-slate-800 rounded-lg text-cyan-300">
                    L-Shell: 2×(2)² = ८
                  </span>
                  <span className="p-1 bg-slate-800 rounded-lg text-cyan-300">
                    M-Shell: 2×(3)² = १८
                  </span>
                  <span className="p-1 bg-slate-800 rounded-lg text-cyan-300">
                    N-Shell: 2×(4)² = ३२
                  </span>
                </div>
              </div>
            )}

            {/* DIAGRAM 4: Ohm's Law Triangle */}
            {sec.diagramType === 'ohms-law-triangle' && (
              <div className="my-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-amber-400 mb-3">
                  ओहमको नियम त्रिकोण सुत्र (Ohm's Law Triangle: V, I, R)
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
                  <svg className="w-48 h-44 shrink-0" viewBox="0 0 160 140">
                    {/* Triangle Outline */}
                    <polygon
                      points="80,10 10,130 150,130"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                    {/* Horizontal dividing line */}
                    <line
                      x1="45"
                      y1="70"
                      x2="115"
                      y2="70"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    {/* Vertical dividing line */}
                    <line
                      x1="80"
                      y1="70"
                      x2="80"
                      y2="130"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    {/* Letters */}
                    <text
                      x="80"
                      y="52"
                      textAnchor="middle"
                      fill="#f59e0b"
                      fontSize="26"
                      fontWeight="black"
                    >
                      V
                    </text>
                    <text
                      x="48"
                      y="110"
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="24"
                      fontWeight="black"
                    >
                      I
                    </text>
                    <text
                      x="112"
                      y="110"
                      textAnchor="middle"
                      fill="#22c55e"
                      fontSize="24"
                      fontWeight="black"
                    >
                      R
                    </text>
                    <text
                      x="80"
                      y="108"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="14"
                    >
                      ×
                    </text>
                  </svg>
                  <div className="space-y-2 text-xs w-full">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <span className="font-bold text-amber-300">V (भोल्टेज):</span>
                      <span className="font-mono text-cyan-300 font-black">V = I × R</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <span className="font-bold text-cyan-300">I (करेन्ट):</span>
                      <span className="font-mono text-cyan-300 font-black">I = V / R</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <span className="font-bold text-emerald-300">R (अवरोध):</span>
                      <span className="font-mono text-cyan-300 font-black">R = V / I</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <span className="font-bold text-purple-300">P (पावर):</span>
                      <span className="font-mono text-purple-300 font-black">P = V × I</span>
                    </div>
                  </div>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('ohms-law')}
                    className="mt-3 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>ओहमको नियम डिजिटल क्यालकुलेटर चलाउनुहोस्</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* DIAGRAM 5: Circuit Types */}
            {sec.diagramType === 'circuit-types' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-amber-400 block text-center">
                  विद्युत परिपथका मुख्य अवस्था तथा प्रकारहरूको रेखाचित्र
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      १. खुल्ला परिपथ (Open Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      स्विच OFF भएको वा तार टुटेको अवस्था। करेन्ट = ०, बत्ती निभेको।
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      २. बन्द परिपथ (Closed Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      स्विच ON भएको र फेज-न्युट्रल पूर्ण भएको अवस्था। लोड बलेको।
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      ३. छोटो परिपथ (Short Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      लोड बिना नै फेज र न्युट्रल एकापसमा जुध्दा अत्यधिक करेन्ट बहने अवस्था।
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-cyan-400 flex items-center gap-1">
                      ४. लहरे परिपथ (Series Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      बत्तीहरू क्रमैसँग जोडिन्छन्। करेन्ट समान, भोल्टेज बाँडिन्छ।
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-purple-400 flex items-center gap-1">
                      ५. समानान्तर (Parallel Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      सबै लोडमा २३०V समान भोल्टेज जान्छ। घरायसी वाइरिङ यसैमा हुन्छ।
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <span className="font-bold text-pink-400 flex items-center gap-1">
                      ६. चुहिएको (Leakage Circuit)
                    </span>
                    <p className="text-[11px] text-slate-300">
                      इन्सुलेसन बिग्रेर उपकरणको धातुको बडीमा करेन्ट चुहिएको अवस्था।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DIAGRAM 6: Wire Joints */}
            {sec.diagramType === 'wire-joints' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-amber-400 block text-center">
                  चार मुख्य वायर जोइन्टहरू (Wire Joints Classification)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <div className="font-bold text-cyan-400">क) Twist Joint (ट्वीष्ट)</div>
                    <div className="text-[11px] text-slate-300">
                      सिंगल स्ट्राण्ड तारको लम्बाइ बढाउन तथा जक्सन बक्समा Rat/Pig Tail Joint बनाउन।
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <div className="font-bold text-emerald-400">ख) Married Joint (म्यारिड)</div>
                    <div className="text-[11px] text-slate-300">
                      मल्टी स्ट्राण्ड (३/२२, ७/२२) तारहरू एक-आपसमा उनिएर बनाइने बलियो जोइन्ट।
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <div className="font-bold text-amber-400">ग) Britannia Joint (ब्रिटानिया)</div>
                    <div className="text-[11px] text-slate-300">
                      ओभरहेड लाइनको नाङ्गो तारको लम्बाइ बढाउन तारहरू खप्टाई माथिबाट पातलो बाइन्डिङ तारले बाँधिन्छ।
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <div className="font-bold text-purple-400">घ) Western Union Joint (वेस्टन युनियन)</div>
                    <div className="text-[11px] text-slate-300">
                      ओभरहेड लाइनको सिङ्गल स्ट्राण्ड नाङ्गो तारको लम्बाइ तन्काउन अत्यधिक तन्काइ शक्ति धान्न।
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DIAGRAM 7: Symbols Table Preview */}
            {sec.diagramType === 'symbols-table' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    ६४ आधिकारिक विद्युतिय संकेतहरू (नमुना झलक)
                  </span>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('symbols')}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>सबै ६४ वटा हेर्नुहोस्</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {electricalSymbolsList.slice(0, 8).map(sym => (
                    <div
                      key={sym.sn}
                      className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>No. {sym.sn}</span>
                        <Zap className="w-3 h-3 text-amber-400" />
                      </div>
                      <div className="font-bold text-amber-300 text-xs my-1">
                        {sym.nameNep}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {sym.nameEng}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIAGRAM 8: Wire Capacity Table Preview */}
            {sec.diagramType === 'wire-table' && (
              <div className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    PVC Insulated Wire Current Capacity Table (तार क्षमता तालिका)
                  </span>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('wire-table')}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>पूर्ण तालिका</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-800 text-amber-300 font-bold">
                      <tr>
                        <th className="p-2.5 border border-slate-700/60">तार साइज (SWG)</th>
                        <th className="p-2.5 border border-slate-700/60">क्षेत्रफल (sq.mm)</th>
                        <th className="p-2.5 border border-slate-700/60 text-emerald-400">कपर (१-Phase)</th>
                        <th className="p-2.5 border border-slate-700/60 text-slate-400">आल्मुनियम (१-Phase)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {wireCapacityTable.slice(0, 5).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 border border-slate-700/60 font-bold text-amber-400">{row.swg}</td>
                          <td className="p-2.5 border border-slate-700/60 font-mono text-cyan-300">{row.sqmm}</td>
                          <td className="p-2.5 border border-slate-700/60 font-bold text-emerald-400">{row.singlePhaseCu} A</td>
                          <td className="p-2.5 border border-slate-700/60 text-slate-400">{row.singlePhaseAl} A</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DIAGRAM 9: Power Socket Wiring (Day 38) */}
            {sec.diagramType === 'power-socket' && (
              <div className="my-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-amber-400 mb-2">
                  १६ एम्पियर पावर सकेट जडान रेखाचित्र (16A Power Socket: N-E-P Wiring)
                </span>
                <svg className="w-full max-w-md h-52" viewBox="0 0 320 180">
                  {/* Socket Body Outline */}
                  <rect
                    x="90"
                    y="25"
                    width="140"
                    height="130"
                    rx="16"
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  {/* Top Earth Pin (Big) */}
                  <circle cx="160" cy="55" r="14" fill="#0f172a" stroke="#22c55e" strokeWidth="2.5" />
                  <text x="160" y="59" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">E</text>
                  {/* Left Neutral Pin */}
                  <circle cx="125" cy="105" r="11" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="125" y="109" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">N</text>
                  {/* Right Phase Pin */}
                  <circle cx="195" cy="105" r="11" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                  <text x="195" y="109" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">L</text>

                  {/* Incoming Wires */}
                  {/* Green Earth Wire from top */}
                  <line x1="160" y1="5" x2="160" y2="41" stroke="#22c55e" strokeWidth="3" />
                  <text x="165" y="15" fill="#22c55e" fontSize="9" fontWeight="bold">Earth Wire (हरियो)</text>

                  {/* Blue Neutral Wire from left */}
                  <path d="M 20 105 L 114 105" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="25" y="98" fill="#38bdf8" fontSize="9" fontWeight="bold">Neutral (कालो/निलो)</text>

                  {/* Red Phase Wire with Switch */}
                  <path d="M 300 145 L 250 145 L 250 105 L 206 105" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  {/* Switch on phase line */}
                  <rect x="238" y="125" width="24" height="16" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="250" y="136" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">16A SW</text>
                  <text x="250" y="160" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">Phase (रातो तार)</text>
                </svg>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-center w-full">
                  <div className="p-2 bg-slate-800 rounded-xl text-emerald-300 border border-emerald-500/20">
                    <span className="font-bold block">माथिल्लो ठूलो पिन (E)</span>
                    सुरक्षात्मक अर्थिङ (Green Wire)
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl text-cyan-300 border border-cyan-500/20">
                    <span className="font-bold block">देब्रे पिन (N)</span>
                    सिधै न्युट्रल तार (Black/Blue Wire)
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl text-rose-300 border border-rose-500/20">
                    <span className="font-bold block">दाहिने पिन (L)</span>
                    १६A स्विच मार्फत फेज तार (Red 7/22)
                  </div>
                </div>
              </div>
            )}

            {/* DIAGRAM 10: Practical Circuit Wiring & Schematics */}
            {sec.diagramType === 'practical-circuit' && (
              <div className="my-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                {(() => {
                  const pId = sec.practicalId || (lesson.dayNumber === 17 ? 1 : lesson.dayNumber === 19 ? 2 : lesson.dayNumber === 21 ? 3 : lesson.dayNumber === 23 ? 4 : lesson.dayNumber === 25 ? 5 : lesson.dayNumber === 27 ? 6 : lesson.dayNumber === 29 ? 7 : lesson.dayNumber === 31 ? 8 : lesson.dayNumber === 33 ? 9 : lesson.dayNumber === 35 ? 10 : lesson.dayNumber === 37 ? 11 : 1);
                  const prac = practicalCircuitsData.find(p => p.id === pId) || practicalCircuitsData[0];
                  return (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-xs font-black text-amber-400">
                            प्रयोगात्मक परिपथ नं. {prac.practicalNo}: {prac.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                              Condition: {prac.condition}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                              Control: {prac.controlBy}
                            </span>
                          </div>
                        </div>
                        {onNavigateTab && (
                          <button
                            type="button"
                            onClick={() => onNavigateTab('practicals')}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>सिमुलेटर ल्याब खोल्नुहोस्</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Schematic & Wiring details box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            जडान गरिने उपकरणहरू (Components):
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                            {prac.components.map((c, cIdx) => (
                              <li key={cIdx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                          <span className="font-bold text-cyan-300 flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5" />
                            आवश्यक सामाग्रीहरू (Materials):
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                            {prac.materials.map((m, mIdx) => (
                              <li key={mIdx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Circuit Logic */}
                      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-amber-400">सर्किट तार जडान विधि (Wiring Logic):</span>
                        <p className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">
                          {prac.circuitLogic}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Homework Section */}
      {lesson.homework.length > 0 && (
        <div
          className={`p-4 rounded-2xl border ${
            isWhitePaperMode
              ? 'bg-rose-50 border-rose-200'
              : 'bg-rose-950/20 border-rose-500/30'
          } space-y-2`}
        >
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            गृहकार्य प्रश्नहरू (Homework Questions):
          </h4>
          <ul className="space-y-1 pl-4 text-xs sm:text-sm list-disc marker:text-rose-400">
            {lesson.homework.map((hw, hIdx) => (
              <li
                key={hIdx}
                className={
                  isWhitePaperMode
                    ? 'text-slate-800 font-medium'
                    : 'text-slate-200'
                }
              >
                {hw}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
