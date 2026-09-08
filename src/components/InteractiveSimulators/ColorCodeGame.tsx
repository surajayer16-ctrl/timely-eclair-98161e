import React, { useState, useEffect } from 'react';
import { nepalTelecom12CoreOFC, copper25PairTable, copper10PairColorCode } from '../../data/colorCodesData';
import { Sparkles, Trophy, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ColorCodeGame: React.FC = () => {
  const [mode, setMode] = useState<'ofc-ntc' | 'ofc-intl' | 'copper-10' | 'copper-25'>('ofc-ntc');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Generate question
  const currentOfc = nepalTelecom12CoreOFC[currentIndex % nepalTelecom12CoreOFC.length];
  const currentCopper10 = copper10PairColorCode[currentIndex % copper10PairColorCode.length];
  const currentCopper = copper25PairTable[currentIndex % copper25PairTable.length];

  // Options
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'ofc-ntc') {
      const correct = currentOfc.nepaliName;
      const others = nepalTelecom12CoreOFC
        .filter((c) => c.nepaliName !== correct)
        .map((c) => c.nepaliName)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setShuffledOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    } else if (mode === 'ofc-intl') {
      const correct = `${currentOfc.internationalColor} (${currentOfc.internationalNepali})`;
      const others = nepalTelecom12CoreOFC
        .filter((c) => c.number !== currentOfc.number)
        .map((c) => `${c.internationalColor} (${c.internationalNepali})`)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setShuffledOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    } else if (mode === 'copper-10') {
      const correct = `${currentCopper10.colorEnglish} (${currentCopper10.colorNepali})`;
      const others = copper10PairColorCode
        .filter((c) => c.pairNo !== currentCopper10.pairNo)
        .map((c) => `${c.colorEnglish} (${c.colorNepali})`)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setShuffledOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    } else {
      const correct = `${currentCopper.tipWire} / ${currentCopper.ringWire}`;
      const others = copper25PairTable
        .filter((c) => c.pairNo !== currentCopper.pairNo)
        .map((c) => `${c.tipWire} / ${c.ringWire}`)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setShuffledOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    }
  }, [currentIndex, mode]);

  const handleAnswer = (chosen: string) => {
    if (feedback) return; // prevent double click

    setTotalAttempts((prev) => prev + 1);

    const isCorrect =
      mode === 'ofc-ntc'
        ? chosen === currentOfc.nepaliName
        : mode === 'ofc-intl'
        ? chosen === `${currentOfc.internationalColor} (${currentOfc.internationalNepali})`
        : mode === 'copper-10'
        ? chosen === `${currentCopper10.colorEnglish} (${currentCopper10.colorNepali})`
        : chosen === `${currentCopper.tipWire} / ${currentCopper.ringWire}`;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback({
        isCorrect: true,
        message: `सहि उत्तर! ✓ ${
          mode === 'ofc-ntc'
            ? `NTC कोर नं. ${currentOfc.number} = ${currentOfc.nepaliName} (${currentOfc.englishName})`
            : mode === 'ofc-intl'
            ? `Intl कोर नं. ${currentOfc.number} = ${currentOfc.internationalColor} (${currentOfc.internationalNepali})`
            : mode === 'copper-10'
            ? `पेयर नं. ${currentCopper10.pairNo} = ${currentCopper10.colorEnglish}`
            : `पेयर नं. ${currentCopper.pairNo} = ${currentCopper.tipWire} + ${currentCopper.ringWire}`
        }`,
      });

      if (newStreak % 5 === 0) {
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        } catch (_) {}
      }
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        message: `गल्ती भयो! ✗ सही उत्तर: ${
          mode === 'ofc-ntc'
            ? `NTC कोर नं. ${currentOfc.number} = ${currentOfc.nepaliName} (${currentOfc.englishName})`
            : mode === 'ofc-intl'
            ? `Intl कोर नं. ${currentOfc.number} = ${currentOfc.internationalColor} (${currentOfc.internationalNepali})`
            : mode === 'copper-10'
            ? `पेयर नं. ${currentCopper10.pairNo} = ${currentCopper10.colorEnglish}`
            : `पेयर नं. ${currentCopper.pairNo} = ${currentCopper.tipWire} + ${currentCopper.ringWire}`
        }`,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1400);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setFeedback(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-3 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Speed Color Code Trainer</span>
          </div>
          <h3 className="text-xl font-bold text-white">कलर कोडिङ स्पिड ट्रेनर (Color Code Game)</h3>
          <p className="text-xs text-slate-400">
            नेपाल टेलिकम १२-कोर फाइबर, १०-पेयर र २५-पेयर कपर केबल रङ पहिचान गर्ने द्रुत अभ्यास।
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              setMode('ofc-ntc');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'ofc-ntc' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            NTC १२-कोर फाइबर
          </button>
          <button
            onClick={() => {
              setMode('ofc-intl');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'ofc-intl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Intl १२-कोर फाइबर
          </button>
          <button
            onClick={() => {
              setMode('copper-10');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'copper-10' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            १० पेयर कपर
          </button>
          <button
            onClick={() => {
              setMode('copper-25');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'copper-25' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            २५ पेयर कपर
          </button>
        </div>
      </div>

      {/* Score & Streak Bar */}
      <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center text-xs">
        <div>
          <span className="text-slate-400 text-[10px] block uppercase">स्कोर (Score)</span>
          <strong className="text-base text-emerald-400 font-bold">{score} / {totalAttempts}</strong>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block uppercase">लगातार सही (Streak)</span>
          <strong className="text-base text-amber-400 font-bold">🔥 {streak}</strong>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block uppercase">शुद्धता (Accuracy)</span>
          <strong className="text-base text-cyan-400 font-bold">
            {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 100}%
          </strong>
        </div>
      </div>

      {/* Question Presentation Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-5">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {mode === 'ofc-ntc' ? 'नेपाल टेलिकम १२-कोर अप्टिकल फाइबर (NTC Standard)' : mode === 'ofc-intl' ? 'अन्तर्राष्ट्रिय मापदण्ड १२-कोर अप्टिकल फाइबर (TIA/EIA-598)' : mode === 'copper-10' ? 'कपर केबल १०-पेयर मापदण्ड' : 'टेलिकम २५-पेयर कपर केबल'}
        </span>

        {mode === 'ofc-ntc' ? (
          <div className="space-y-3">
            <div
              className="w-20 h-20 rounded-full mx-auto shadow-2xl border-4 border-slate-700 flex items-center justify-center font-black text-2xl"
              style={{
                backgroundColor: currentOfc.hexColor,
                color: currentOfc.textColor || '#ffffff',
              }}
            >
              #{currentOfc.number}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              नेपाल टेलिकम (NTC) फाइबर कोर नं. {currentOfc.number} को रङ कुन हो ?
            </h4>
          </div>
        ) : mode === 'ofc-intl' ? (
          <div className="space-y-3">
            <div
              className="w-20 h-20 rounded-full mx-auto shadow-2xl border-4 border-slate-700 flex items-center justify-center font-black text-2xl"
              style={{
                backgroundColor: currentOfc.internationalHex,
                color: currentOfc.internationalHex === '#f8fafc' || currentOfc.internationalHex === '#eab308' || currentOfc.internationalHex === '#06b6d4' ? '#0f172a' : '#ffffff',
              }}
            >
              #{currentOfc.number}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              अन्तर्राष्ट्रिय मापदण्ड (Intl Standard) फाइबर कोर नं. {currentOfc.number} को रङ कुन हो ?
            </h4>
          </div>
        ) : mode === 'copper-10' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-lg flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: currentCopper10.primaryHex, color: '#ffffff' }}
              >
                P1
              </div>
              <span className="text-slate-500 font-bold">+</span>
              <div
                className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-lg flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: currentCopper10.secondaryHex }}
              >
                P2
              </div>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              १०-पेयर केबलको पेयर नं. {currentCopper10.pairNo} को रङ कुन हो ?
            </h4>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-lg flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: currentCopper.primaryColorHex, color: '#0f172a' }}
              >
                Tip
              </div>
              <span className="text-slate-500 font-bold">+</span>
              <div
                className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-lg flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: currentCopper.secondaryColorHex }}
              >
                Ring
              </div>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              पेयर नं. {currentCopper.pairNo} को जोडी रङ के हुन्छ ?
            </h4>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fade-in ${
              feedback.isCorrect
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700'
                : 'bg-rose-950/90 text-rose-300 border border-rose-700'
            }`}
          >
            {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Shuffled Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {shuffledOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              className="bg-slate-800/90 hover:bg-blue-600 disabled:opacity-50 text-white font-bold p-3.5 rounded-xl text-xs sm:text-sm border border-slate-700 hover:border-blue-400 transition-all shadow-md active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

