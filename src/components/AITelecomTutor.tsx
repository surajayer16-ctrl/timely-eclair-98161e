import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Volume2, ShieldCheck, HelpCircle, X, ExternalLink, Globe, Wifi, WifiOff, Cpu } from 'lucide-react';
import { instituteInfo } from '../data/coursesData';
import { NitvtLogo } from './NitvtLogo';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import { queryOfflineGuru } from '../lib/offlineAiGuruEngine';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isOfflineReply?: boolean;
}

interface AITelecomTutorProps {
  onClose?: () => void;
}

export const AITelecomTutor: React.FC<AITelecomTutorProps> = ({ onClose }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [forceOffline, setForceOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `नमस्कार! म सुरेन्द्र ऐर (Surendra Air) को मुख्य टेलिकम तथा अप्टिकल फाइबर प्रशिक्षक (प्राविधिक गुरु) हुँ। 
म अनलाइनमा Google Gemini AI र अफलाइनमा ३८ च्याप्टरको आन्तरिक CTEVT नलेज बेस (Offline Engine) बाट सञ्चालित छु।

इन्टरनेट नभएका बेला पनि म तपाईंलाई CTEVT तह-१, तह-२, Fusion Splicing, OTDR, Krone Punching, १२-कोर कलर कोड वा सुरक्षाहरू सम्बन्धी तुरुन्तै सहि उत्तर दिन सक्छु। केही सोध्नुहोस्!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'नेपाल टेलिकमको १२ कोर फाइबरको कलर कोड के के हुन् ?',
    'फ्युजन स्प्लाइसिङ गर्दा ९० डिग्री क्लिभिङ किन अनिवार्य छ ?',
    'अर्थिङ रेसिस्टेन्स ५ ओम वा १ ओम भन्दा कम कसरी बनाउने ?',
    '३३ केभी (33kV) र ११ केभी लाइनसँग टेलिकम केबलको सुरक्षित दूरी कति हुनुपर्छ ?',
    'OTDR मा स्टेप ड्रप र रिफ्लेक्टिभ पिक बीच के फरक छ ?',
    'Krone Insertion Tool ले १० पेयर ट्याग ब्लकमा कसरी पन्च गरिन्छ ?',
    'GSM मोबाइल नेटवर्कमा HLR र VLR बीचको मुख्य भिन्नता के हो ?',
    'नेपाल टेलिकमका मुख्य सर्टकोडहरू (१९८, १९७, १६०६) को काम के हो ?',
  ];

  const openGeminiDirectly = (customPrompt?: string) => {
    const promptText = customPrompt || inputValue || 'CTEVT Telecom and Optical Fiber training curriculum details Nepal';
    const encoded = encodeURIComponent(`[Surendra Air Telecom & Optical Fiber Institute]: ${promptText}`);
    window.open(`https://gemini.google.com/app?q=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsLoading(true);

    const shouldUseOfflineMode = forceOffline || !isOnline;

    if (shouldUseOfflineMode) {
      // Instant Client-side Offline Knowledge Engine response
      setTimeout(() => {
        const offlineReply = queryOfflineGuru(textToSend);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: offlineReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOfflineReply: true,
          },
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    // Try Online API
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, question: textToSend }),
      });

      if (!res.ok) throw new Error('Network / Server Error');

      const data = await res.json();
      const assistantReply = data.reply || queryOfflineGuru(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Online API fetch failed, falling back to offline engine:', err);
      // Seamless fallback to client-side offline guru engine
      const offlineFallback = queryOfflineGuru(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: offlineFallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOfflineReply: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    speakNepaliText(text, 'AI प्राविधिक गुरु उत्तर');
  };

  const isActuallyOfflineMode = forceOffline || !isOnline;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[680px] max-w-4xl mx-auto text-white">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-700 p-4 flex items-center justify-between shadow-md border-b border-indigo-900/60">
        <div className="flex items-center gap-3">
          <NitvtLogo size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">सुरेन्द्र ऐर AI प्राविधिक गुरु</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                isActuallyOfflineMode
                  ? 'bg-amber-500/30 text-amber-300 border-amber-400/40'
                  : 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
              }`}>
                {isActuallyOfflineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3 animate-pulse" />}
                {isActuallyOfflineMode ? 'OFFLINE ENGINE' : 'ONLINE LIVE 24/7'}
              </span>
            </div>
            <p className="text-xs text-amber-200 flex items-center gap-1.5 mt-0.5">
              <span>CTEVT ३८ म्यानुअल नलेज बेस</span>
              <span>•</span>
              <span className="text-cyan-200">
                {isActuallyOfflineMode ? 'अफलाइन मोड सक्रिय (Offline)' : 'Powered by Google Gemini'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Offline Mode Toggle */}
          <button
            onClick={() => setForceOffline(!forceOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all border ${
              forceOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950/70 hover:bg-slate-950 text-slate-200 border-slate-700'
            }`}
            title="अफलाइन र अनलाइन मोड स्विच गर्नुहोस्"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {forceOffline ? 'अफलाइन मोड : ON' : 'अफलाइन टेस्ट : OFF'}
            </span>
          </button>

          {/* Direct Link to Google Gemini */}
          <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-950/70 hover:bg-slate-950 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all group"
            title="Google Gemini Portal (gemini.google.com) खोल्नुहोस्"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Gemini Portal</span>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              aria-label="बन्द गर्नुहोस्"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status Banner */}
      <div className={`px-4 py-2 border-b flex items-center justify-between text-[11px] transition-colors ${
        isActuallyOfflineMode
          ? 'bg-amber-950/90 border-amber-800 text-amber-200'
          : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          {isActuallyOfflineMode ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>
                <strong>अफलाइन गुरु (Offline Engine) सक्रिय:</strong> इन्टरनेट नभए पनि ३८ वटा च्याप्टरको CTEVT पाठ्यक्रमबाट तुरुन्तै उत्तर मिल्नेछ।
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>
                सुरेन्द्र ऐर AI प्राविधिक गुरु <strong>Google Gemini</strong> र अफलाइन नलेज बेस दुवैसँग जोडिएको छ।
              </span>
            </>
          )}
        </div>

        <button
          onClick={() => setForceOffline(!forceOffline)}
          className="underline hover:text-white shrink-0 font-medium ml-2"
        >
          {isActuallyOfflineMode ? 'अनलाइन मोडमा जानुहोस्' : 'अफलाइन मोड परीक्षण गर्नुहोस्'}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/60 text-xs sm:text-sm">
        {messages.map((m, idx) => {
          const isAssistant = m.sender === 'assistant';
          return (
            <div
              key={idx}
              className={`flex gap-3 items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                  m.isOfflineReply
                    ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                }`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl space-y-2 shadow-lg leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-900 border border-slate-800 text-slate-100'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span>{m.timestamp}</span>
                    {isAssistant && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        m.isOfflineReply
                          ? 'text-amber-300 bg-amber-950/60 border-amber-700/50'
                          : 'text-cyan-400/80 bg-cyan-950/50 border-cyan-800/40'
                      }`}>
                        {m.isOfflineReply ? 'Offline Engine' : 'Gemini AI'}
                      </span>
                    )}
                  </div>

                  {isAssistant && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openGeminiDirectly(m.text.substring(0, 150))}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                        title="Google Gemini मा थप अनुसन्धान गर्नुहोस्"
                      >
                        <span>Gemini मा सोध्नुहोस्</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleSpeak(m.text)}
                        className="hover:text-amber-300 p-0.5 transition-colors"
                        title="सुन्नुहोस्"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600/50 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span>
              {isActuallyOfflineMode
                ? 'अफलाइन म्यानुअल नलेज बेसबाट उत्तर खोज्दैछ...'
                : 'Google Gemini AI प्राविधिक जवाफ तयार गर्दै हुनुहुन्छ...'}
            </span>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 overflow-x-auto flex items-center gap-2 no-scrollbar text-xs">
        <span className="text-slate-400 text-[11px] shrink-0 font-medium">सुझाइएका प्रश्नहरू:</span>
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 whitespace-nowrap px-3 py-1.5 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box & Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isActuallyOfflineMode
                ? 'अफलाइन मोड: कुनै पनि प्राविधिक प्रश्न सोध्नुहोस्...'
                : 'टेलिकम वा फाइबर सम्बन्धी कुनै पनि प्रश्न सोध्नुहोस्...'
            }
            className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-blue-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>सोध्नुहोस्</span>
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={() => openGeminiDirectly()}
            className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-3.5 py-3 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all whitespace-nowrap"
            title="Google Gemini (gemini.google.com) मा खोल्नुहोस्"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">Gemini मा खोल्नुहोस्</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isActuallyOfflineMode
                ? '३८ वटा च्याप्टर CTEVT अफलाइन नलेज बेस सक्रिय'
                : 'CTEVT तह १ र २ प्रमाणित पाठ्यक्रम अनुसार प्राविधिक जवाफ'}
            </span>
          </div>
          <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            <span>Google Gemini: https://gemini.google.com/</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};


