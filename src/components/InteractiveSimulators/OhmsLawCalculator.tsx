import React, { useState } from 'react';
import { Zap, Calculator, Gauge, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const OhmsLawCalculator: React.FC = () => {
  // Ohm's Law state
  const [voltage, setVoltage] = useState<number>(48); // 48V DC Telecom standard
  const [resistance, setResistance] = useState<number>(100);
  const current = resistance > 0 ? (voltage / resistance) : 0;
  const power = voltage * current;

  // Loop Resistance state
  const [gauge, setGauge] = useState<'0.4' | '0.5' | '0.63' | '0.9'>('0.5');
  const [lengthKm, setLengthKm] = useState<number>(1.5);
  
  const resistancePerKm: Record<string, number> = {
    '0.4': 280, // ohm/loop-km
    '0.5': 175,
    '0.63': 110,
    '0.9': 56,
  };

  const totalLoopResistance = (resistancePerKm[gauge] || 175) * lengthKm;

  // Earth Megger state
  const [earthResistance, setEarthResistance] = useState<number>(4.2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-3 py-0.5 rounded-full mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Electrical & Circuit Simulator</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          ओम्स ल, लुप रेसिस्टेन्स र अर्थिङ क्यालकुलेटर
        </h3>
        <p className="text-xs text-slate-400">
          V = I × R, P = V × I, टेलिफोन कपर केबल लुप रेसिस्टेन्स र सब-स्टेशन अर्थिङ (&lt; ५ ओम) हिसाब।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Ohm's Law V=IR */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <span>१. ओम्स ल क्यालकुलेटर (V = I × R)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">भोल्टेज (Voltage V in Volts):</label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                नेपाल टेलिकम एक्सचेन्ज स्ट्यान्डर्ड: -४८ भोल्ट DC
              </span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">रेसिस्टेन्स (Resistance R in Ohms Ω):</label>
              <input
                type="number"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* Results Display */}
            <div className="bg-blue-950/40 border border-blue-800/60 p-3 rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">करेन्ट (Current I = V/R):</span>
                <strong className="text-cyan-300">{current.toFixed(3)} Amperes</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">पावर (Power P = V×I):</span>
                <strong className="text-amber-400">{power.toFixed(2)} Watts</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Copper Loop Resistance */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Gauge className="w-4 h-4" />
            <span>२. केबल लुप रेसिस्टेन्स (Loop Resistance)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">तारको मोटाइ (Wire Gauge):</label>
              <select
                value={gauge}
                onChange={(e) => setGauge(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
              >
                <option value="0.4">०.४ मिमी (0.4 mm) - 280 Ω/km</option>
                <option value="0.5">०.५ मिमी (0.5 mm) - 175 Ω/km (Standard)</option>
                <option value="0.63">०.६३ मिमी (0.63 mm) - 110 Ω/km</option>
                <option value="0.9">०.९ मिमी (0.9 mm) - 56 Ω/km</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">दूरी (Distance in km):</label>
              <input
                type="number"
                step="0.1"
                value={lengthKm}
                onChange={(e) => setLengthKm(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* Loop Calculation Output */}
            <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">कुल लुप रेसिस्टेन्स:</span>
                <strong className="text-amber-300 font-bold text-sm">{totalLoopResistance.toFixed(1)} Ω</strong>
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-1">
                नेपाल टेलिकमको अधिकतम अनुमति सीमा: <strong>&le; १२०० Ω (1200 Ohms)</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Earth Megger Tester */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>३. अर्थिङ रेसिस्टेन्स टेस्टर (Earth Tester)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">नापिएको अर्थ रेसिस्टेन्स (Ω):</label>
              <input
                type="number"
                step="0.1"
                value={earthResistance}
                onChange={(e) => setEarthResistance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            {/* Evaluation Status */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1 font-sans ${
                earthResistance <= 5.0
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-700 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {earthResistance <= 5.0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>स्वीकृत (Pass) - मानक भित्र</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>अस्वीकृत (Fail) - रेसिस्टेन्स धेरै बढी!</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {earthResistance <= 5.0
                  ? 'नेपाल टेलिकम तथा सबस्टेशनका लागि ५ ओम भन्दा कम हुनुपर्छ। यो पूर्ण सुरक्षित छ।'
                  : 'अर्थिङ खाडलमा नुन, कोइला, र पानी थपेर ५ ओम भन्दा कममा झार्नुहोस्।'}
              </p>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              विन्दुहरू: E (Earth), P (Potential 10m), C (Current 20m) 3-Point Fall of Potential.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
