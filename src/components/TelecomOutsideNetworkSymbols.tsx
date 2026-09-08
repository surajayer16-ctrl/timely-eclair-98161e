import React, { useState } from 'react';
import {
  outsideNetworkSymbolsList,
  OutsideNetworkSymbol,
} from '../data/telecomOutsideSymbolsData';
import {
  electricalElectronicsSymbolsList,
  ElectricalElectronicsSymbol,
} from '../data/electricalElectronicsSymbolsData';
import { OutsideNetworkSymbolSvg } from './OutsideNetworkSymbolSvg';
import { ElectricalElectronicsSymbolSvg } from './ElectricalElectronicsSymbolSvg';
import {
  Search,
  Printer,
  Volume2,
  FileText,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  X,
  Sun,
  Moon,
  Zap,
  Radio,
  Sliders,
  Cpu,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { speakNepaliText } from '../lib/nepaliVoiceReader';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  className?: string;
}

export const TelecomOutsideNetworkSymbols: React.FC<Props> = ({ className = '' }) => {
  const { t, isEnglish } = useLanguage();
  
  // Tab: 'osp' (26 symbols, pages 244-246) or 'electrical' (31 symbols, pages 239-243)
  const [activeSection, setActiveSection] = useState<'osp' | 'electrical'>('osp');
  
  // OSP Page filter: 'all' | '1' | '2'
  const [activeOspPage, setActiveOspPage] = useState<'all' | '1' | '2'>('all');

  // Electrical Page filter: 'all' | 239 | 240 | 241 | 242 | 243
  const [activeElecPage, setActiveElecPage] = useState<'all' | '239' | '240' | '241' | '242' | '243'>('all');

  // Category filter for Electrical: 'all' | 'power-source' | 'passive' | 'switch-relay' | 'semiconductor' | 'wiring-ic'
  const [activeElecCategory, setActiveElecCategory] = useState<string>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [paperTheme, setPaperTheme] = useState<'white' | 'dark'>('white');

  // Modals for inspection
  const [selectedOspSymbol, setSelectedOspSymbol] = useState<OutsideNetworkSymbol | null>(null);
  const [selectedElecSymbol, setSelectedElecSymbol] = useState<ElectricalElectronicsSymbol | null>(null);

  // Filtered OSP Symbols
  const filteredOspSymbols = outsideNetworkSymbolsList.filter((item) => {
    const matchesPage =
      activeOspPage === 'all'
        ? true
        : activeOspPage === '1'
        ? item.page === 1
        : item.page === 2;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.nameEnglish.toLowerCase().includes(query) ||
      item.nameNepali.toLowerCase().includes(query) ||
      item.descriptionNepali.toLowerCase().includes(query);

    return matchesPage && matchesSearch;
  });

  // Filtered Electrical & Electronics Symbols
  const filteredElecSymbols = electricalElectronicsSymbolsList.filter((item) => {
    const matchesPage =
      activeElecPage === 'all'
        ? true
        : item.pdfPage.toString() === activeElecPage;

    const matchesCategory =
      activeElecCategory === 'all' || item.category === activeElecCategory;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.nameEnglish.toLowerCase().includes(query) ||
      item.nameNepali.toLowerCase().includes(query) ||
      item.descriptionNepali.toLowerCase().includes(query) ||
      (item.parameterValue && item.parameterValue.toLowerCase().includes(query)) ||
      item.applicationNepali.toLowerCase().includes(query);

    return matchesPage && matchesCategory && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  const handlePlayOspVoice = (item: OutsideNetworkSymbol) => {
    const text = `${item.nameNepali}। अंग्रेजीमा ${item.nameEnglish}। ${item.descriptionNepali}। यसमा ठोस रेखा एक्जिस्टिङ, डटेड रेखा नयाँ जडान र दोहोरो क्रस रेखा हटाउनुपर्ने संकेत हो।`;
    speakNepaliText(text, item.nameEnglish);
  };

  const handlePlayElecVoice = (item: ElectricalElectronicsSymbol) => {
    const text = `${item.nameNepali}। अंग्रेजीमा ${item.nameEnglish}। मान वा प्यारामिटर ${item.parameterValue || 'नभएको'}। ${item.descriptionNepali}। प्रयोग: ${item.applicationNepali}`;
    speakNepaliText(text, item.nameEnglish);
  };

  const isLight = paperTheme === 'white';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Main Navigation & Section Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                  NITVT / CTEVT पाठ्यक्रम
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Professional Telecom Technician Manual
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white font-serif tracking-tight mt-0.5">
                {t('प्राविधिक नक्सांकन तथा सर्किट संकेत निर्देशिका', 'Engineering & Circuit Symbols Directory')}
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Paper Theme Toggle */}
            <button
              onClick={() => setPaperTheme(paperTheme === 'white' ? 'dark' : 'white')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all bg-slate-950 border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 shadow-sm"
              title={t('कागज ढाँचा परिवर्तन गर्नुहोस्', 'Toggle Engineering Paper / Dark Theme')}
            >
              {paperTheme === 'white' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>{t('डार्क मोड', 'Dark Blueprint')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>{t('ह्वाइट पेपर नक्सा', 'White Paper View')}</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors shadow-sm"
              title={t('प्रतीक सिट प्रिन्ट गर्नुहोस्', 'Print Symbols Sheet')}
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{t('प्रिन्ट / PDF', 'Print / PDF')}</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Switcher: OSP (26) vs Electrical & Electronics (31, p.239-243) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              setActiveSection('osp');
              setSearchTerm('');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
              activeSection === 'osp'
                ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                activeSection === 'osp' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">खण्ड १ (पृष्ठ २४४–२४६)</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">२६ संकेत</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  आउटसाइड नेटवर्क प्रतीकहरू (OSP Symbols)
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Existing, To be installed र Dismantled संकेतहरू
                </p>
              </div>
            </div>
            {activeSection === 'osp' && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSection('electrical');
              setSearchTerm('');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
              activeSection === 'electrical'
                ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                activeSection === 'electrical' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">खण्ड २ (पृष्ठ २३९–२४३)</span>
                  <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold">३१ संकेत</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  विद्युतीय तथा इलेक्ट्रोनिक्स प्रतीकहरू (Electrical & Electronics)
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Ground, Battery, AC/DC Source, Resistor, Diode, Transistor, IC...
                </p>
              </div>
            </div>
            {activeSection === 'electrical' && (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            )}
          </button>
        </div>

        {/* Sub-Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Section specific filters */}
          {activeSection === 'osp' ? (
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveOspPage('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeOspPage === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('सबै (१-२६)', 'All (1-26)')}
              </button>
              <button
                onClick={() => setActiveOspPage('1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeOspPage === '1'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('पृष्ठ १ (१-१४)', 'Page 1')}
              </button>
              <button
                onClick={() => setActiveOspPage('2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeOspPage === '2'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('पृष्ठ २ (१५-२६)', 'Page 2')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveElecPage('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                सबै (१-३१)
              </button>
              <button
                onClick={() => setActiveElecPage('239')}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === '239'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पृष्ठ २३९ (१-९)
              </button>
              <button
                onClick={() => setActiveElecPage('240')}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === '240'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पृष्ठ २४० (१०-१४)
              </button>
              <button
                onClick={() => setActiveElecPage('241')}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === '241'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पृष्ठ २४१ (१५-२२)
              </button>
              <button
                onClick={() => setActiveElecPage('242')}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === '242'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पृष्ठ २४२ (२३-२८)
              </button>
              <button
                onClick={() => setActiveElecPage('243')}
                className={`px-2 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeElecPage === '243'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पृष्ठ २४३ (२९-३१)
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeSection === 'osp'
                  ? t('OSP खोज्नुहोस् (उदा: Cabinet, Manhole, Wall DP)...', 'Search OSP (Cabinet, Manhole, Wall DP)...')
                  : t('इलेक्ट्रिकल खोज्नुहोस् (Resistor, Diode, Battery)...', 'Search Electrical (Resistor, Diode, Battery)...')
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: OSP SYMBOLS (PAGES 244-246)                    */}
      {/* ========================================================= */}
      {activeSection === 'osp' && (
        <div
          className={`rounded-2xl border transition-colors duration-300 shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900'
              : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}
        >
          {/* Document Header matching Page 1 & Page 2 (244-246) */}
          <div className={`text-center py-6 px-4 border-b ${isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
                Symbols used in Telecommunication outside Network
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                (नेपाल टेलिकम OSP बाहिरी नेटवर्क नक्सांकनका २६ आधिकारिक संकेतहरू — पृष्ठ २४४ देखि २४६)
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-300/60 dark:border-slate-800 flex flex-col items-center justify-center text-xs">
              <span className="font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                NITVT
              </span>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Nepal Institute of Technical & Vocational Training
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500 italic">
                (Affiliated with CTEVT and Department of Cottage & Small industries)
              </span>
            </div>
          </div>

          {/* The 4-Column Official Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className={`text-xs font-serif font-bold uppercase tracking-wider border-b ${
                  isLight ? 'bg-slate-100 border-slate-400 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}>
                  <th className="py-3.5 px-4 sm:px-6 border-r border-inherit w-1/4 min-w-[180px]">
                    Name of symbol
                  </th>
                  <th className="py-3.5 px-4 border-r border-inherit text-center w-1/4 min-w-[140px]">
                    Existing
                  </th>
                  <th className="py-3.5 px-4 border-r border-inherit text-center w-1/4 min-w-[140px]">
                    To be installed
                  </th>
                  <th className="py-3.5 px-4 text-center w-1/4 min-w-[140px]">
                    Dismantled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 dark:divide-slate-800 text-xs sm:text-sm">
                {filteredOspSymbols.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors group cursor-pointer ${
                        isLight
                          ? index % 2 === 0
                            ? 'bg-white hover:bg-amber-50/50'
                            : 'bg-slate-50/60 hover:bg-amber-50/60'
                          : index % 2 === 0
                          ? 'bg-slate-950 hover:bg-slate-900/80'
                          : 'bg-slate-900/30 hover:bg-slate-900/80'
                      }`}
                      onClick={() => setSelectedOspSymbol(item)}
                      title={t('थप विवरण हेर्न क्लिक गर्नुहोस्', 'Click to inspect symbol details')}
                    >
                      {/* Column 1: Name of Symbol */}
                      <td className="py-3 px-4 sm:px-6 border-r border-slate-300 dark:border-slate-800 align-middle">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                              #{item.id}
                            </span>
                            <span className="font-serif font-bold text-sm sm:text-base leading-tight">
                              {item.nameEnglish}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300/90 leading-tight">
                            {item.nameNepali}
                          </p>
                        </div>
                      </td>

                      {/* Column 2: Existing (Solid) */}
                      <td className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-800 text-center align-middle">
                        <div className="flex items-center justify-center min-h-[50px] group-hover:scale-105 transition-transform">
                          <OutsideNetworkSymbolSvg
                            svgKey={item.svgKey}
                            variant="existing"
                            isLight={isLight}
                            className="w-20 sm:w-24 h-12"
                          />
                        </div>
                      </td>

                      {/* Column 3: To be installed (Dashed) */}
                      <td className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-800 text-center align-middle">
                        <div className="flex items-center justify-center min-h-[50px] group-hover:scale-105 transition-transform">
                          <OutsideNetworkSymbolSvg
                            svgKey={item.svgKey}
                            variant="toInstall"
                            isLight={isLight}
                            className="w-20 sm:w-24 h-12"
                          />
                        </div>
                      </td>

                      {/* Column 4: Dismantled (Crossed //) */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex items-center justify-center min-h-[50px] group-hover:scale-105 transition-transform">
                          <OutsideNetworkSymbolSvg
                            svgKey={item.svgKey}
                            variant="dismantled"
                            isLight={isLight}
                            className="w-20 sm:w-24 h-12"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Document Official Footer */}
          <div className={`text-center py-6 px-4 border-t ${
            isLight ? 'border-slate-300 bg-slate-50 text-slate-800' : 'border-slate-800 bg-slate-900/60 text-slate-300'
          }`}>
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
                NITVT
              </h4>
              <p className="text-xs font-semibold">
                Nepal Institute of Technical & Vocational Training
              </p>
              <p className="text-[11px] text-slate-500 italic">
                (Affiliated with CTEVT and Department of Cottage & Small industries)
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
              <span>• Existing: ठोस रेखा (Solid lines / shapes)</span>
              <span>• To be installed: ड्यास रेखा (Dashed lines / shapes)</span>
              <span>• Dismantled: दोहोरो क्रस (Double slash // lines)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: ELECTRICAL & ELECTRONICS (PAGES 239-243)       */}
      {/* ========================================================= */}
      {activeSection === 'electrical' && (
        <div
          className={`rounded-2xl border transition-colors duration-300 shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900'
              : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}
        >
          {/* Document Header matching Page 239-243 in user's PDF */}
          <div className={`text-center py-6 px-4 border-b ${isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
                Electrical & Electronics Symbol
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                (विद्युतीय तथा इलेक्ट्रोनिक्स कम्पोनेन्टहरूका ३१ आधिकारिक संकेतहरू — पृष्ठ २३९ देखि २४३)
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-300/60 dark:border-slate-800 flex flex-col items-center justify-center text-xs">
              <span className="font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                Professional Telecom Technician Manual
              </span>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Nepal Institute of Technical and Vocational Training (NITVT) Pvt. Ltd.
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500 italic">
                Mahalaxmi Municipality-02, Lalitpur • Ph: 01-5203522 • E-mail: nitvtnepal@gmail.com
              </span>
            </div>
          </div>

          {/* The 3-Column Official Table matching the PDF */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className={`text-xs font-serif font-bold uppercase tracking-wider border-b ${
                  isLight ? 'bg-pink-100/70 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}>
                  <th className="py-3 px-4 border-r border-inherit w-16 text-center">
                    S. No.
                  </th>
                  <th className="py-3 px-4 sm:px-6 border-r border-inherit w-1/2 min-w-[240px]">
                    Name of the Component
                  </th>
                  <th className="py-3 px-4 text-center w-1/2 min-w-[200px]">
                    Symbol
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 dark:divide-slate-800 text-xs sm:text-sm">
                {filteredElecSymbols.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors group cursor-pointer ${
                        isLight
                          ? index % 2 === 0
                            ? 'bg-white hover:bg-cyan-50/40'
                            : 'bg-slate-50/70 hover:bg-cyan-50/50'
                          : index % 2 === 0
                          ? 'bg-slate-950 hover:bg-slate-900/80'
                          : 'bg-slate-900/30 hover:bg-slate-900/80'
                      }`}
                      onClick={() => setSelectedElecSymbol(item)}
                      title={t('थप विवरण हेर्न क्लिक गर्नुहोस्', 'Click to inspect electrical symbol details')}
                    >
                      {/* Column 1: S. No. */}
                      <td className="py-3 px-4 border-r border-slate-300 dark:border-slate-800 text-center font-mono font-bold text-slate-500 align-middle">
                        {item.id}.
                      </td>

                      {/* Column 2: Name of the Component */}
                      <td className="py-3 px-4 sm:px-6 border-r border-slate-300 dark:border-slate-800 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                              {item.nameEnglish}
                            </span>
                            {item.parameterValue && (
                              <span className="text-[10px] font-mono bg-cyan-500/10 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded font-bold">
                                {item.parameterValue}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight">
                            {item.nameNepali}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                            {item.descriptionNepali}
                          </p>
                        </div>
                      </td>

                      {/* Column 3: Symbol Graphic */}
                      <td className="py-2.5 px-4 text-center align-middle">
                        <div className="flex items-center justify-center min-h-[60px] group-hover:scale-105 transition-transform">
                          <ElectricalElectronicsSymbolSvg
                            svgKey={item.svgKey}
                            isLight={isLight}
                            className="w-24 sm:w-28 h-14"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer matching PDF Page 239-243 */}
          <div className={`text-center py-6 px-4 border-t ${
            isLight ? 'border-slate-300 bg-slate-50 text-slate-800' : 'border-slate-800 bg-slate-900/60 text-slate-300'
          }`}>
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider font-serif">
                Nepal Institute of Technical and Vocational Training (NITVT) Pvt. Ltd.
              </h4>
              <p className="text-xs font-semibold">
                Mahalaxmi Municipality-02, Lalitpur, Ph: 01-5203522, E-mail: nitvtnepal@gmail.com
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Electrical & Electronics Engineering Standard Reference (Page 239–243)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: OSP SYMBOL INSPECT                               */}
      {/* ========================================================= */}
      {selectedOspSymbol && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedOspSymbol(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-900/50">
                  प्रतीक #{selectedOspSymbol.id} • {selectedOspSymbol.page === 1 ? 'पृष्ठ २४४' : 'पृष्ठ २४५/२४६'}
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 font-serif">
                  {selectedOspSymbol.nameEnglish}
                </h3>
                <p className="text-sm text-amber-300 font-medium">
                  {selectedOspSymbol.nameNepali}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayOspVoice(selectedOspSymbol)}
                  className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl transition-colors"
                  title="नेपाली आवाजमा सुन्नुहोस्"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOspSymbol(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Existing */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Existing
                </span>
                <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 flex items-center justify-center min-h-[70px]">
                  <OutsideNetworkSymbolSvg
                    svgKey={selectedOspSymbol.svgKey}
                    variant="existing"
                    className="w-24 h-16"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  हाल फिल्डमा कायमै रहेको (ठोस रूप)
                </p>
              </div>

              {/* To be installed */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  To be installed
                </span>
                <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 flex items-center justify-center min-h-[70px]">
                  <OutsideNetworkSymbolSvg
                    svgKey={selectedOspSymbol.svgKey}
                    variant="toInstall"
                    className="w-24 h-16"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  नयाँ जडान गर्नुपर्ने (ड्यास रूप)
                </p>
              </div>

              {/* Dismantled */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Dismantled
                </span>
                <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 flex items-center justify-center min-h-[70px]">
                  <OutsideNetworkSymbolSvg
                    svgKey={selectedOspSymbol.svgKey}
                    variant="dismantled"
                    className="w-24 h-16"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  फिल्डबाट हटाउनुपर्ने (दोहोरो क्रस)
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>इन्जिनियरिङ OSP कार्य तथा व्याख्या:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedOspSymbol.descriptionNepali}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>नेपाल टेलिकम & CTEVT OSP मापदण्ड अनुसार</span>
              <button
                onClick={() => setSelectedOspSymbol(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ELECTRICAL & ELECTRONICS SYMBOL INSPECT          */}
      {/* ========================================================= */}
      {selectedElecSymbol && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedElecSymbol(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-900/50">
                    S. No. #{selectedElecSymbol.id} • म्यानुअल पृष्ठ {selectedElecSymbol.pdfPage}
                  </span>
                  {selectedElecSymbol.parameterValue && (
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      मान: {selectedElecSymbol.parameterValue}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-white mt-1.5 font-serif">
                  {selectedElecSymbol.nameEnglish}
                </h3>
                <p className="text-sm text-cyan-300 font-medium">
                  {selectedElecSymbol.nameNepali}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayElecVoice(selectedElecSymbol)}
                  className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl transition-colors"
                  title="नेपाली आवाजमा सुन्नुहोस्"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedElecSymbol(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Big Graphic Showcase */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                सर्किट स्किम्याटिक संकेत (Circuit Schematic Symbol)
              </span>
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-center w-full max-w-sm min-h-[100px] shadow-inner">
                <ElectricalElectronicsSymbolSvg
                  svgKey={selectedElecSymbol.svgKey}
                  className="w-40 h-24"
                />
              </div>
            </div>

            {/* Description & Application */}
            <div className="space-y-3">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>इलेक्ट्रोनिक्स कार्य तथा सिद्धान्त:</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedElecSymbol.descriptionNepali}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>नेपाल टेलिकम तथा प्राविधिक प्रयोग (Field Application):</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedElecSymbol.applicationNepali}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>NITVT Professional Telecom Technician Manual</span>
              <button
                onClick={() => setSelectedElecSymbol(null)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
