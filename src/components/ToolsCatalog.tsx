import React, { useState } from 'react';
import { allToolsList } from '../data/toolsData';
import { TechnicalTool } from '../types';
import { Wrench, Search, ShieldCheck, Zap, Radio, Cpu, Layers, Eye, HelpCircle, CheckCircle2, Volume2 } from 'lucide-react';
import { speakNepaliText } from '../lib/nepaliVoiceReader';

interface ToolsCatalogProps {
  onSelectToolForExam?: (tool: TechnicalTool) => void;
}

export const ToolsCatalog: React.FC<ToolsCatalogProps> = ({
  onSelectToolForExam,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTool, setActiveModalTool] = useState<TechnicalTool | null>(null);

  const [toolsList, setToolsList] = useState<TechnicalTool[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_tools');
      return saved ? JSON.parse(saved) : allToolsList;
    } catch {
      return allToolsList;
    }
  });

  React.useEffect(() => {
    const handleToolsUpdated = () => {
      try {
        const saved = localStorage.getItem('nitvt_tools');
        if (saved) {
          setToolsList(JSON.parse(saved));
        } else {
          setToolsList(allToolsList);
        }
      } catch (err) {
        console.error('Failed to parse updated tools:', err);
      }
    };

    window.addEventListener('nitvt_tools_updated', handleToolsUpdated);
    window.addEventListener('storage', handleToolsUpdated);
    return () => {
      window.removeEventListener('nitvt_tools_updated', handleToolsUpdated);
      window.removeEventListener('storage', handleToolsUpdated);
    };
  }, []);

  const categories = [
    { id: 'all', label: 'सबै औजार (९०+ All Tools)' },
    { id: 'optical-fiber', label: 'Optical Fiber Tools' },
    { id: 'copper-splicing', label: 'Copper & Splicing' },
    { id: 'measuring-testing', label: 'Meters & Testing' },
    { id: 'pole-civil', label: 'Pole & Civil Hardware' },
    { id: 'electrical-power', label: 'Electrical & Power' },
    { id: 'safety-ppe', label: 'Safety PPE Equipment' },
  ];

  const filteredTools = toolsList.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tool.nepaliName.toLowerCase().includes(q) ||
      tool.englishName.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.usagePlace.toLowerCase().includes(q) ||
      tool.keyExamFact.toLowerCase().includes(q)
    );
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'optical-fiber':
        return <span className="bg-blue-900/80 text-blue-300 border border-blue-700/60 text-[10px] px-2 py-0.5 rounded-full font-semibold">Optical Fiber</span>;
      case 'copper-splicing':
        return <span className="bg-amber-900/80 text-amber-300 border border-amber-700/60 text-[10px] px-2 py-0.5 rounded-full font-semibold">Copper & Splicing</span>;
      case 'measuring-testing':
        return <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-[10px] px-2 py-0.5 rounded-full font-semibold">Testing Meters</span>;
      case 'pole-civil':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">Pole & Civil</span>;
      case 'electrical-power':
        return <span className="bg-purple-900/80 text-purple-300 border border-purple-700/60 text-[10px] px-2 py-0.5 rounded-full font-semibold">Electrical & Power</span>;
      case 'safety-ppe':
      default:
        return <span className="bg-rose-900/80 text-rose-300 border border-rose-700/60 text-[10px] px-2 py-0.5 rounded-full font-semibold">Safety PPE</span>;
    }
  };

  const getCleanToolId = (id: string | number, fallbackIndex?: number) => {
    const str = String(id);
    if (str.startsWith('tool-') || str.length > 5 || /^\d{6,}$/.test(str)) {
      return fallbackIndex !== undefined ? String(fallbackIndex + 1) : (str.replace('tool-', '').slice(-3) || '1');
    }
    return str;
  };

  return (
    <section className="py-10 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1 rounded-full mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>सचित्र प्राविधिक औजार तथा उपकरण सूची (Tools & Equipment Database)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              टेलिकम तथा फाइबर औजार नामावली (९०+ Tools Catalog)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              फिल्डमा प्रयोग हुने सम्पूर्ण मेसिन, औजार, नाप्ने यन्त्रहरू र पोल एसेसरिजहरूको नाम, काम, प्रयोग स्थल र परीक्षोपयोगी विवरण।
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="औजार खोज्नुहोस् (उदा. OTDR, Cleaver, Megger)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>कुल फेला परेका औजारहरू: <strong className="text-white">{filteredTools.length}</strong></span>
          <span className="hidden sm:inline">क्लिक गरेर विस्तृत विवरण हेर्नुहोस्</span>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool, idx) => (
            <div
              key={tool.id}
              onClick={() => setActiveModalTool(tool)}
              className="bg-slate-800/60 border border-slate-700/70 hover:border-blue-500/60 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-blue-950/30 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Tool Image / Thumbnail if available */}
                {tool.imageUrl ? (
                  <div className="w-full h-44 bg-slate-950/90 rounded-xl overflow-hidden border border-slate-700/80 relative mb-3 p-1.5 flex items-center justify-center">
                    <img
                      src={tool.imageUrl}
                      alt={tool.englishName}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700">
                        #{getCleanToolId(tool.id, idx)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-24 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center relative mb-3 group-hover:border-blue-500/40 transition-colors">
                    <div className="text-center p-2">
                      <Wrench className="w-8 h-8 text-blue-400/70 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-slate-400 font-mono">Nitvt Telecom Tool</span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-900/90 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700">
                        #{getCleanToolId(tool.id, idx)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Number & Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">औजार कोड: #{getCleanToolId(tool.id, idx)}</span>
                  {getCategoryBadge(tool.category)}
                </div>

                {/* Tool Name */}
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {tool.nepaliName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-1">
                    {tool.englishName}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                {/* Usage Place */}
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <div className="text-slate-400 line-clamp-1">
                    <strong className="text-slate-300">प्रयोग स्थल:</strong> {tool.usagePlace}
                  </div>
                  <div className="text-amber-300/90 font-medium line-clamp-1">
                    ★ {tool.keyExamFact}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300 font-medium">
                <span>विस्तृत विवरण तथा फोटो</span>
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Tool Modal */}
        {activeModalTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md">
                      #{getCleanToolId(activeModalTool.id)}
                    </span>
                    {getCategoryBadge(activeModalTool.category)}
                  </div>
                  <h3 className="text-xl font-bold text-white">{activeModalTool.nepaliName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{activeModalTool.englishName}</p>
                </div>
                <button
                  onClick={() => setActiveModalTool(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Modal Tool Image Preview */}
                {activeModalTool.imageUrl ? (
                  <div className="w-full max-h-72 min-h-[160px] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center p-2">
                    <img
                      src={activeModalTool.imageUrl}
                      alt={activeModalTool.englishName}
                      className="max-h-64 max-w-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
                    <div className="text-center">
                      <Wrench className="w-10 h-10 text-blue-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">औजारको फोटो एडमिन प्यानلबाट थप्न सकिन्छ</span>
                    </div>
                  </div>
                )}

                <div>
                  <strong className="text-slate-300 block mb-1">मुख्य कार्य तथा विवरण:</strong>
                  <p className="text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    {activeModalTool.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block text-xs mb-1">प्रयोग स्थल (Usage Area):</strong>
                    <span className="text-slate-300 text-xs">{activeModalTool.usagePlace}</span>
                  </div>
                  <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/60">
                    <strong className="text-amber-400 block text-xs mb-1">परीक्षामा सोधिने मुख्य बुँदा:</strong>
                    <span className="text-amber-200 text-xs">{activeModalTool.keyExamFact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const fullText = `औजार: ${activeModalTool.nepaliName} (${activeModalTool.englishName})। विवरण: ${activeModalTool.description}। प्रयोग स्थल: ${activeModalTool.usagePlace}। परीक्षा बुँदा: ${activeModalTool.keyExamFact}`;
                    speakNepaliText(fullText, activeModalTool.nepaliName);
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                  title="नेपाली आवाजमा सुन्नुहोस्"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>आवाजमा सुन्नुहोस् (Listen)</span>
                </button>

                <button
                  onClick={() => setActiveModalTool(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
                >
                  बन्द गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
