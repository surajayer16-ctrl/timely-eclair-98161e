import React, { useState } from 'react';
import { PhoneCall, Terminal, CheckCircle2, Play, RefreshCw, Key } from 'lucide-react';

export const EpabxCommandTester: React.FC = () => {
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    'System Ready: Hi-Tech Microprocessor EPABX 308/412 Active',
    'Enter Programming Mode via Operator Ext 11: Dial *#0000',
  ]);

  const presetCommands = [
    { code: '*#0000', label: 'Program Mode Entry (पासवर्ड *#००००)', response: '✓ Programming Mode Activated (BEEP BEEP)' },
    { code: '#01 11', label: 'Set Operator Extension to 11', response: '✓ Ext 11 is now System Operator' },
    { code: '#12 01', label: 'Enable Outgoing Call on Line 1', response: '✓ Trunk CO Line 1 Enabled for Outgoing' },
    { code: '#30 11 0', label: 'Barring / STD/ISD Lock on Ext 11', response: '✓ Ext 11 Toll Level: Local Only' },
    { code: '#9999', label: 'Save & Exit Programming Mode', response: '✓ System Saved. Exited to Normal Dial Tone.' },
  ];

  const handleKeyClick = (val: string) => {
    setEnteredCode((prev) => prev + val);
  };

  const handleExecute = () => {
    if (!enteredCode.trim()) return;

    const matched = presetCommands.find((c) => c.code.replace(/\s+/g, '') === enteredCode.replace(/\s+/g, ''));
    if (matched) {
      setConsoleLog((prev) => [...prev, `> Dialed: ${enteredCode}`, matched.response]);
    } else {
      setConsoleLog((prev) => [
        ...prev,
        `> Dialed: ${enteredCode}`,
        `✗ Command Unrecognized! Hint: Enter *#0000 to enter program mode.`,
      ]);
    }
    setEnteredCode('');
  };

  const handleClear = () => {
    setEnteredCode('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950/70 border border-purple-800/60 px-3 py-0.5 rounded-full mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>Intercom & EPABX Simulator</span>
        </div>
        <h3 className="text-xl font-bold text-white">ईपीएबीएक्स कमान्ड टेस्टर (EPABX Programming Lab)</h3>
        <p className="text-xs text-slate-400">
          Hi-Tech 308/412/616 एक्सचेन्जमा पासवर्ड, अपरेटर सेटिङ (#०१), कलिङ ब्यारिङ (#३०) र ट्रंक लाइन कन्फिगर गर्ने अभ्यास।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Telephone Dialpad Keypad */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          
          {/* LCD Display */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-right font-mono text-cyan-300 min-h-[44px] flex items-center justify-end text-lg tracking-widest">
            {enteredCode || <span className="text-slate-600 text-xs">DIAL COMMAND...</span>}
          </div>

          {/* Keypad Grid 3x4 */}
          <div className="grid grid-cols-3 gap-2 text-sm font-mono font-bold">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                className="bg-slate-800 hover:bg-blue-600 active:bg-blue-700 text-white py-3 rounded-xl border border-slate-700 transition-colors shadow-sm text-center"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Space / Exec / Clear Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleKeyClick(' ')}
              className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs py-2 px-3 rounded-xl border border-slate-700 font-mono"
            >
              [Space]
            </button>
            <button
              onClick={handleClear}
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs py-2 px-3 rounded-xl border border-rose-800/80"
            >
              Clear
            </button>
            <button
              onClick={handleExecute}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>कमान्ड पठाउनुहोस् (Send)</span>
            </button>
          </div>

        </div>

        {/* Console Log Terminal & Quick Commands List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Terminal Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 h-44 overflow-y-auto">
            <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800">
              --- EPABX PROGRAMMING CONSOLE LOGS ---
            </div>
            {consoleLog.map((log, i) => (
              <div
                key={i}
                className={log.startsWith('✓') ? 'text-emerald-400 font-bold' : log.startsWith('✗') ? 'text-rose-400' : 'text-slate-300'}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">
              सामान्य EPABX कमान्डहरू (क्लिक गरी टेस्ट गर्नुहोस्):
            </span>
            <div className="space-y-1.5">
              {presetCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setEnteredCode(cmd.code);
                  }}
                  className="w-full bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors"
                >
                  <span className="font-mono text-cyan-300">{cmd.code}</span>
                  <span className="text-slate-300 text-[11px]">{cmd.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
