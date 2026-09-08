import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FusionSplicingSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cleaveAngle, setCleaveAngle] = useState<number>(90.0);
  const [isArcing, setIsArcing] = useState<boolean>(false);
  const [spliceResult, setSpliceResult] = useState<{ loss: number; status: string } | null>(null);

  const steps = [
    {
      num: 1,
      title: 'केबल तयारी (Cable Sheath Stripping)',
      desc: 'Sheath Cutter को सहायताले १ मिटर (1 m) बाहिरी ज्याकेट हटाउने र ओजेसी क्ल्याम्पका लागि ठीक १ सेमी FRP स्ट्रेन्थ मेम्बर सुरक्षित राख्ने।',
      actionLabel: '१ मिटर ज्याकेट हटाउनुहोस्',
    },
    {
      num: 2,
      title: 'फाइबर स्ट्रिपिङ (Buffer Stripping)',
      desc: 'Miller Stripper को २५०µm होल प्रयोग गरी १.५ देखि २ सेमी कोरिडोर कोटिंग (Coating) होशियारीपूर्वक ताछ्ने।',
      actionLabel: 'कलर कोटिंग स्ट्रिप गर्नुहोस्',
    },
    {
      num: 3,
      title: 'फाइबर सफाइ (Alcohol Cleaning)',
      desc: '९९% शुद्ध Isopropyl Alcohol (IPA) र Lint-free वाइप्सले सिसाको नाङ्गो कोरलाई एकै दिशामा सफा गर्ने।',
      actionLabel: 'IPA ले कोर सफा गर्नुहोस्',
    },
    {
      num: 4,
      title: 'प्रेसिजन क्लिभिङ (Precision 90° Cleaving)',
      desc: 'फाइबर क्लिभर (FC-6S) मा राखेर ठीक ९० डिग्री कोणमा समतल (Flat End-face) काट्ने।',
      actionLabel: '९०° कोणमा क्लिभ गर्नुहोस्',
    },
    {
      num: 5,
      title: 'फ्युजन आर्क स्प्लाइसिङ (Arc Fusion Alignment)',
      desc: 'स्प्लाइसिङ मेसिनको V-Groove मा दुई फाइबर राख्ने, अटो-एलाइनमेन्ट गर्ने र ८०००°C इलेक्ट्रिक आर्क दिएर जोड्ने।',
      actionLabel: 'इलेक्ट्रिक आर्क चालू गर्नुहोस् (Arc Fusion)',
    },
    {
      num: 6,
      title: 'हिट श्रिंक स्लिभ सुरक्षा (Heat Shrink Protection)',
      desc: '६० मिमी (60mm) को Protection Sleeve लाई जोर्नीमाथि सारेर मेसिनको हिटरमा तताएर कडा पार्ने।',
      actionLabel: 'स्लिभ तताएर सिल गर्नुहोस्',
    },
    {
      num: 7,
      title: 'ट्रेमा लुपिङ तथा अन्तिम परीक्षण (Tray Looping & Test)',
      desc: 'न्यूनतम ३० मिमी रेडियसमा स्प्लाइस ट्रेमा लुपिङ गरी बन्द गर्ने र OTDR / VFL द्वारा परीक्षण गर्ने।',
      actionLabel: 'स्प्लाइस ट्रेमा लुपिङ सम्पन्न भयो',
    },
  ];

  const handleNextStep = () => {
    if (currentStep === 4) {
      // Simulate high precision cleave
      setCleaveAngle(89.9);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setIsArcing(true);
      setTimeout(() => {
        setIsArcing(false);
        const randomLoss = 0.01;
        setSpliceResult({
          loss: randomLoss,
          status: 'उत्कृष्ट (Pass) - Loss < 0.02 dB (Nepal Telecom Standard)',
        });
        setCurrentStep(6);
      }, 1500);
    } else if (currentStep === 7) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (_) {}
      setCurrentStep(8);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCleaveAngle(90.0);
    setIsArcing(false);
    setSpliceResult(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-3 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Lab Simulation</span>
          </div>
          <h3 className="text-xl font-bold text-white">फ्युजन स्प्लाइसिङ भर्चुअल ल्याब सिमुलेटर (Fusion Splicer Lab)</h3>
          <p className="text-xs text-slate-400">
            फाइबर तयारी, ९०° क्लिभिङ, ८०००°C इलेक्ट्रिक आर्क र स्प्लाइस लस (Loss &lt; 0.02 dB) को प्रत्यक्ष अभ्यास।
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>पुनः सुरु गर्नुहोस् (Reset)</span>
        </button>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
        {steps.map((st) => {
          const isDone = currentStep > st.num;
          const isCurrent = currentStep === st.num;
          return (
            <div
              key={st.num}
              className={`p-2.5 rounded-xl border transition-all text-center ${
                isCurrent
                  ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold shadow-md'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider mb-0.5">चरण {st.num}</div>
              <div className="line-clamp-1 font-sans">{st.title.split('(')[0]}</div>
            </div>
          );
        })}
      </div>

      {/* Visual Animation Stage */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Step 1: Cable Sheath Stripping */}
        {currentStep === 1 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-1">
              <div className="h-6 w-32 bg-slate-800 border-2 border-slate-600 rounded-l-md flex items-center justify-center text-[10px] text-slate-400 font-mono">
                १ मिटर Sheath
              </div>
              <div className="h-4 w-16 bg-blue-600 rounded-r-sm text-[9px] flex items-center justify-center font-bold">
                Buffer Core
              </div>
            </div>
            <p className="text-xs text-amber-300 font-medium">
              ★ १ मिटर सिथ हटाईयो ताकि स्प्लाइस ट्रेमा सुरक्षित लुपिङ गर्न सकियोस्।
            </p>
          </div>
        )}

        {/* Step 2: Buffer Stripping */}
        {currentStep === 2 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-1">
              <div className="h-4 w-28 bg-blue-600 rounded-l-sm text-[9px] flex items-center justify-center font-mono">
                Buffer (२५०µm)
              </div>
              <div className="h-1.5 w-14 bg-cyan-200 rounded-r-full shadow-lg shadow-cyan-400"></div>
            </div>
            <p className="text-xs text-cyan-300 font-medium">
              ★ मिलर स्ट्रिपरले १.५-२ सेमी नाङ्गो सिसा (१२५µm Cladding + Core) निकालियो।
            </p>
          </div>
        )}

        {/* Step 3: Cleaning with IPA */}
        {currentStep === 3 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <div className="h-1.5 w-36 bg-cyan-100 shadow-[0_0_12px_#38bdf8] rounded-full"></div>
              <span className="text-2xl animate-bounce">🧻</span>
            </div>
            <p className="text-xs text-emerald-300 font-medium">
              ★ ९९% शुद्ध Isopropyl Alcohol ले धूलो, तेल र अवशेष सफा गरियो।
            </p>
          </div>
        )}

        {/* Step 4: Cleaving 90° */}
        {currentStep === 4 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="relative inline-block">
              <div className="h-2 w-40 bg-gradient-to-r from-blue-500 via-cyan-300 to-cyan-100 rounded-l-full"></div>
              <div className="absolute right-0 -top-4 bottom-0 w-0.5 bg-rose-500 animate-pulse"></div>
            </div>
            <div className="text-xs text-amber-300 font-mono">
              क्लिभिङ कोण (Cleave Angle): <strong className="text-white">९०.०° (समतल)</strong>
            </div>
          </div>
        )}

        {/* Step 5: Arc Fusion Splicing */}
        {currentStep === 5 && (
          <div className="text-center space-y-4">
            <div className="relative flex items-center justify-center gap-0.5">
              {/* Left Fiber */}
              <div className="h-1.5 w-28 bg-cyan-300 rounded-l-full shadow-md"></div>
              
              {/* Electric Arc Spark */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                {isArcing ? (
                  <div className="w-6 h-6 rounded-full bg-amber-400 animate-ping shadow-[0_0_20px_#f59e0b] flex items-center justify-center text-slate-950 font-black text-xs">
                    ⚡
                  </div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                )}
              </div>

              {/* Right Fiber */}
              <div className="h-1.5 w-28 bg-cyan-300 rounded-r-full shadow-md"></div>
            </div>

            <div className="text-xs font-mono text-cyan-300">
              {isArcing ? (
                <span className="text-amber-400 font-bold animate-pulse">
                  ⚡ ८०००°C इलेक्ट्रिक आर्क दिइँदैछ... Core Alignment & Fusion In Progress...
                </span>
              ) : (
                <span>दुई फाइबर कोर V-Groove मा एलाइन गरिएका छन्।</span>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Heat Shrink Sleeve */}
        {currentStep === 6 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center">
              <div className="h-5 w-44 bg-slate-700/80 border border-amber-400/60 rounded-full flex items-center justify-center text-[10px] text-amber-300 font-mono shadow-md">
                Heat Shrink Sleeve (६० mm)
              </div>
            </div>
            {spliceResult && (
              <div className="inline-block bg-emerald-950/80 border border-emerald-700 text-emerald-300 px-4 py-2 rounded-xl text-xs font-mono font-bold">
                ✓ स्प्लाइस लस (Splice Loss): {spliceResult.loss} dB • {spliceResult.status}
              </div>
            )}
          </div>
        )}

        {/* Step 7 & 8: Looping in Tray & Completion */}
        {currentStep >= 7 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-400 flex items-center justify-center mx-auto text-xs text-cyan-300 font-bold animate-spin-slow">
              R &ge; ३०mm
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-emerald-400">स्प्लाइसिङ तथा प्रोटेक्सन १००% सम्पन्न भयो!</h4>
              <p className="text-xs text-slate-300">
                लुपिङ सुरक्षित गरियो, ओजेसी वाटरप्रुफ बक्समा १ सेमी ग्रिप कायम राखियो।
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Step Description & Action CTA */}
      <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
            चरण {currentStep <= 7 ? currentStep : 7} / ७: {steps[Math.min(currentStep - 1, 6)].title}
          </div>
          <p className="text-xs sm:text-sm text-slate-200">
            {steps[Math.min(currentStep - 1, 6)].desc}
          </p>
        </div>

        {currentStep <= 7 ? (
          <button
            onClick={handleNextStep}
            disabled={isArcing}
            className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>{steps[currentStep - 1].actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>पुनः अभ्यास गर्नुहोस् (Practice Again)</span>
          </button>
        )}
      </div>

    </div>
  );
};
