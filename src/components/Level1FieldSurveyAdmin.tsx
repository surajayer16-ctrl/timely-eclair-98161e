import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Volume2,
  Layers,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Code,
  Eye,
  Sliders,
  Sparkles,
  Cable,
  Building,
  Home,
  Check,
  X,
  BookOpen,
  Wrench,
  Network
} from 'lucide-react';
import {
  Level1FieldSurveyData,
  SurveyMapNode,
  SurveyProcedureStep,
  SurveyVivaQuestion,
  NitvtManualData,
  NitvtChapter,
  CopperVsFiberItem,
  FiberColorCodeRow,
  NitvtToolItem,
  NitvtFaultItem,
  defaultLevel1FieldSurveyData,
  getLevel1FieldSurveyData,
  saveLevel1FieldSurveyData,
  resetLevel1FieldSurveyData
} from '../data/level1FieldSurveyData';
import { ImageUploader } from './ImageUploader';
import { speakNepaliText } from '../lib/nepaliVoiceReader';

export const Level1FieldSurveyAdmin: React.FC = () => {
  const [formData, setFormData] = useState<Level1FieldSurveyData>(() => getLevel1FieldSurveyData());
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'photo' | 'nodes' | 'procedure' | 'viva' | 'nitvt_manual' | 'json'>('overview');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cabinet09');
  const [manualActiveSection, setManualActiveSection] = useState<'info' | 'chapters' | 'copper_fiber' | 'color_codes' | 'tools' | 'safety_faults'>('chapters');
  const [editingChapterIdx, setEditingChapterIdx] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(formData, null, 2));
  }, [formData]);

  const handleSave = () => {
    try {
      saveLevel1FieldSurveyData(formData);
      setSaveSuccess('ग्वार्को चोक, उदय बस्ती OSP फिल्ड सर्भे नक्सा सफलतापूर्वक सुरक्षित गरियो!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      alert('नक्सा डेटा सुरक्षित गर्न सकिएन: ' + (err as Error).message);
    }
  };

  const handleReset = () => {
    if (confirm('के तपाईं ग्वार्को चोक, उदय बस्ती OSP फिल्ड सर्भे नक्सालाई मूल पूर्वनिर्धारित (Default) अवस्थामा फर्काउन चाहनुहुन्छ? तपाईंका सबै परिवर्तनहरू मेटिनेछन्।')) {
      const reset = resetLevel1FieldSurveyData();
      setFormData(reset);
      setSaveSuccess('नक्सा मूल पूर्वनिर्धारित अवस्थामा रिसेट गरियो!');
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setFormData(parsed);
      saveLevel1FieldSurveyData(parsed);
      setJsonError(null);
      setSaveSuccess('JSON डेटाबाट नक्सा सफलतापूर्वक अद्यावधिक गरियो!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      setJsonError('अवैध JSON संरचना: ' + (err as Error).message);
    }
  };

  // Node operations
  const currentNode = formData.nodes[selectedNodeId] || Object.values(formData.nodes)[0];

  const updateCurrentNode = (updatedFields: Partial<SurveyMapNode>) => {
    if (!currentNode) return;
    setFormData((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [currentNode.id]: {
          ...currentNode,
          ...updatedFields,
        },
      },
    }));
  };

  const handleAddNode = () => {
    const newId = `node_${Date.now()}`;
    const newNode: SurveyMapNode = {
      id: newId,
      titleNepali: 'नयाँ लठ्ठा वा विन्दु (New Survey Node)',
      titleEnglish: 'New Survey Node',
      tag: 'New Asset',
      descNepali: 'यस नयाँ विन्दु वा पोलको प्राविधिक विवरण यहाँ लेख्नुहोस्।',
      specs: {
        'उपकरण प्रकार': 'टेलिकम पोल / डीपी',
        'स्थान': 'उदय बस्ती रुट',
      },
      keyNotes: ['परीक्षा तथा फिल्ड अभ्यासका लागि आवश्यक मुख्य बुँदा।'],
    };

    setFormData((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [newId]: newNode,
      },
    }));
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (idToDelete: string) => {
    if (Object.keys(formData.nodes).length <= 1) {
      alert('कम्तीमा एउटा नोड हुनैपर्छ!');
      return;
    }
    if (confirm(`के तपाईं यो नोड (${formData.nodes[idToDelete]?.titleNepali}) हटाउन चाहनुहुन्छ?`)) {
      setFormData((prev) => {
        const nextNodes = { ...prev.nodes };
        delete nextNodes[idToDelete];
        return { ...prev, nodes: nextNodes };
      });
      const remainingIds = Object.keys(formData.nodes).filter((id) => id !== idToDelete);
      setSelectedNodeId(remainingIds[0] || '');
    }
  };

  // Procedure step operations
  const updateProcedureStep = (index: number, updated: Partial<SurveyProcedureStep>) => {
    setFormData((prev) => {
      const nextProcedures = [...prev.procedures];
      nextProcedures[index] = { ...nextProcedures[index], ...updated };
      return { ...prev, procedures: nextProcedures };
    });
  };

  const handleAddProcedureStep = () => {
    const nextStepNum = formData.procedures.length + 1;
    const newStep: SurveyProcedureStep = {
      step: nextStepNum,
      title: `चरण ${nextStepNum}: नयाँ प्रयोगात्मक कार्यविधि`,
      desc: 'यस चरणमा गरिने फिल्ड अभ्यासको विस्तृत कार्यविधि यहाँ लेख्नुहोस्।',
      safety: 'सुरक्षा उपकरण (PPE) को अनिवार्य प्रयोग गर्नुहोस्।',
    };
    setFormData((prev) => ({
      ...prev,
      procedures: [...prev.procedures, newStep],
    }));
  };

  const handleDeleteProcedureStep = (index: number) => {
    if (confirm('के तपाईं यो कार्यविधि चरण हटाउन चाहनुहुन्छ?')) {
      setFormData((prev) => {
        const next = prev.procedures.filter((_, i) => i !== index);
        // renumber
        return {
          ...prev,
          procedures: next.map((item, idx) => ({ ...item, step: idx + 1 })),
        };
      });
    }
  };

  // Viva question operations
  const updateVivaQuestion = (index: number, updated: Partial<SurveyVivaQuestion>) => {
    setFormData((prev) => {
      const nextViva = [...prev.vivaQuestions];
      nextViva[index] = { ...nextViva[index], ...updated };
      return { ...prev, vivaQuestions: nextViva };
    });
  };

  const handleAddViva = () => {
    const newViva: SurveyVivaQuestion = {
      q: 'नक्सासम्बन्धी नयाँ मौखिक प्रश्न यहाँ लेख्नुहोस् ?',
      a: 'यस प्रश्नको आधिकारिक प्राविधिक उत्तर यहाँ लेख्नुहोस्।',
    };
    setFormData((prev) => ({
      ...prev,
      vivaQuestions: [...prev.vivaQuestions, newViva],
    }));
  };

  const handleDeleteViva = (index: number) => {
    if (confirm('के तपाईं यो VIVA प्रश्न हटाउन चाहनुहुन्छ?')) {
      setFormData((prev) => ({
        ...prev,
        vivaQuestions: prev.vivaQuestions.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-800/40 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                <MapPin className="w-3.5 h-3.5" /> Level-1 OSP Map Editor
              </span>
              <span className="text-xs bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 px-2 py-0.5 rounded-full font-medium">
                Gwarko • Udaya Basti • NITVT Office
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              नेपाल टेलिकम – ग्वार्को चोक, उदय बस्ती OSP फिल्ड सर्भे नक्सा सम्पादक
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              क्याबिनेट ०९, पोल ०९/२८–३२, डीपी ३१, ७० मिटर ड्रप वायर र NITVT अफिस इन्स्टलेसनका सम्पूर्ण पाठ, स्पेक्स, हटस्पट तथा प्रयोगात्मक विधि सम्पादन गर्नुहोस्।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
              title="पूर्वनिर्धारितमा रिसेट गर्नुहोस्"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>पूर्वनिर्धारित रिसेट</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>परिवर्तन सुरक्षित गर्नुहोस् (Save)</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-600/80 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      {/* Editor Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-800">
        {[
          { id: 'overview', label: '१. मुख्य विवरण र हाइलाइटहरू', icon: FileText, count: 'शीर्षक' },
          { id: 'photo', label: '२. नक्सा तस्बिर / ब्लुप्रिन्ट', icon: ImageIcon, count: 'Photo' },
          { id: 'nodes', label: '३. इन्टर्‍याक्टिभ हटस्पट (Nodes)', icon: Layers, count: Object.keys(formData.nodes).length },
          { id: 'procedure', label: '४. ५-चरणीय जडान विधि', icon: Sliders, count: formData.procedures.length },
          { id: 'viva', label: '५. फिल्ड VIVA प्रश्नोत्तर', icon: HelpCircle, count: formData.vivaQuestions.length },
          { id: 'nitvt_manual', label: '६. NITVT म्यानुअल र OSP प्रविधि', icon: BookOpen, count: '४ परिच्छेद' },
          { id: 'json', label: '७. कच्चा JSON कोड', icon: Code, count: 'Advanced' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-950/80 text-cyan-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: OVERVIEW & QUICK HIGHLIGHTS */}
      {activeSubTab === 'overview' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>नक्साको मुख्य शीर्षक तथा परिचय (Titles & Introduction)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                नक्साको नेपाली शीर्षक, अंग्रेजी नाम, उप-शीर्षक र अडियो वाचन पाठ सम्पादन गर्नुहोस्।
              </p>
            </div>
            <button
              type="button"
              onClick={() => speakNepaliText(formData.audioNarrationText, 'नक्सा परिचय')}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>अडियो परीक्षण</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">नक्सा शीर्षक (नेपाली):</label>
              <input
                type="text"
                value={formData.titleNepali}
                onChange={(e) => setFormData({ ...formData, titleNepali: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Title in English:</label>
              <input
                type="text"
                value={formData.titleEnglish}
                onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">उप-शीर्षक (Subtitle / Context):</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">विस्तृत नेपाली विवरण (Detailed Description):</label>
            <textarea
              rows={3}
              value={formData.descriptionNepali}
              onChange={(e) => setFormData({ ...formData, descriptionNepali: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>नेपाली अडियो वाचन पाठ (Nepali Voice Narration Script):</span>
            </label>
            <textarea
              rows={3}
              value={formData.audioNarrationText}
              onChange={(e) => setFormData({ ...formData, audioNarrationText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Specs 4-Box Grid */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              मुख्य हाइलाइटहरू (Quick Highlights in Header):
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400 font-semibold">क्याबिनेट नम्बर:</label>
                <input
                  type="text"
                  value={formData.quickSpecs.cabinetNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quickSpecs: { ...formData.quickSpecs, cabinetNo: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400 font-semibold">डीपी नम्बर / लठ्ठा:</label>
                <input
                  type="text"
                  value={formData.quickSpecs.dpNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quickSpecs: { ...formData.quickSpecs, dpNo: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400 font-semibold">ड्रप वायर लम्बाइ (D/W):</label>
                <input
                  type="text"
                  value={formData.quickSpecs.dropWireLength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quickSpecs: { ...formData.quickSpecs, dropWireLength: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400 font-semibold">ग्राहक ठेगाना:</label>
                <input
                  type="text"
                  value={formData.quickSpecs.customerAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quickSpecs: { ...formData.quickSpecs, customerAddress: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-purple-300 font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PHOTO / BLUEPRINT */}
      {activeSubTab === 'photo' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="border-b border-slate-800/80 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>नक्सा तस्बिर तथा कागजात ब्लुप्रिन्ट (Map Blueprint & Image)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              ग्वार्को चोक तथा उदय बस्ती फिल्ड नक्साको तस्बिर अपलोड गर्नुहोस् वा नयाँ लिङ्क राख्नुहोस्।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">तस्बिर URL (Image URL):</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/osp_level1_survey_map.jpg वा https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200">नयाँ फोटो अपलोड गर्नुहोस्:</span>
                <ImageUploader
                  currentImageUrl={formData.imageUrl}
                  onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                  label="नक्साको फोटो यहाँ ड्रप गर्नुहोस् वा छान्नुहोस्"
                  description="JPG, PNG, WebP फाइलहरू स्वतः कम्प्रेस भएर सुरक्षित हुन्छन्।"
                  maxWidth={1600}
                  maxHeight={1600}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">तस्बिर पूर्वावलोकन (Preview):</span>
              <div className="relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden min-h-[260px] flex items-center justify-center p-2">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="OSP Field Survey Map"
                    className="max-h-[320px] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-500">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">कुनै तस्बिर छानिएको छैन</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: INTERACTIVE HOTSPOT NODES */}
      {activeSubTab === 'nodes' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>इन्टर्‍याक्टिभ हटस्पट नोडहरू (Interactive Map Nodes & Poles)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                नक्सामा क्लिक गर्दा खुल्ने प्रत्येक पोल, क्याबिनेट, डीपी बक्स र ग्राहक घरको प्राविधिक विवरण।
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNode}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नयाँ नोड थप्नुहोस् (Add Node)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left List of Nodes */}
            <div className="space-y-2 border-r border-slate-800/80 pr-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                नोडहरूको सूची ({Object.keys(formData.nodes).length})
              </span>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                {(Object.values(formData.nodes) as SurveyMapNode[]).map((node) => {
                  const isSel = node.id === selectedNodeId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSel
                          ? 'bg-amber-500/10 border-amber-500/80 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSel ? 'bg-amber-400' : 'bg-slate-500'}`} />
                          <h5 className="text-xs font-bold truncate">{node.titleNepali}</h5>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate pl-3.5">{node.tag}</p>
                      </div>

                      {Object.keys(formData.nodes).length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded-lg shrink-0 transition-colors"
                          title="नोड मेटाउनुहोस्"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Node Detailed Editor */}
            <div className="lg:col-span-2 space-y-4">
              {currentNode ? (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      नोड आइडी: {currentNode.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {Object.keys(currentNode.specs || {}).length} स्पेसिफिकेसन
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">शीर्षक (नेपाली):</label>
                      <input
                        type="text"
                        value={currentNode.titleNepali}
                        onChange={(e) => updateCurrentNode({ titleNepali: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Title in English:</label>
                      <input
                        type="text"
                        value={currentNode.titleEnglish}
                        onChange={(e) => updateCurrentNode({ titleEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">ट्याग / वर्ग (Tag / Category Badge):</label>
                    <input
                      type="text"
                      value={currentNode.tag}
                      onChange={(e) => updateCurrentNode({ tag: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">नेपाली विस्तृत विवरण (Description):</label>
                    <textarea
                      rows={3}
                      value={currentNode.descNepali}
                      onChange={(e) => updateCurrentNode({ descNepali: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Node Specs (Key-Value pairs) */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">प्राविधिक स्पेसिफिकेसन (Specs):</span>
                      <button
                        type="button"
                        onClick={() => {
                          const keyName = prompt('नयाँ स्पेसिफिकेसन शीर्षक लेख्नुहोस् (उदा: भोल्टेज):');
                          if (keyName && keyName.trim()) {
                            const val = prompt(`'${keyName}' को मान (Value) लेख्नुहोस्:`) || '';
                            updateCurrentNode({
                              specs: { ...currentNode.specs, [keyName.trim()]: val },
                            });
                          }
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> नयाँ स्पेसिफिकेसन थप्नुहोस्
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {Object.entries(currentNode.specs || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-[11px] font-semibold text-slate-400 w-32 shrink-0 truncate">{k}:</span>
                          <input
                            type="text"
                            value={v}
                            onChange={(e) => {
                              updateCurrentNode({
                                specs: { ...currentNode.specs, [k]: e.target.value },
                              });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nextSpecs = { ...currentNode.specs };
                              delete nextSpecs[k];
                              updateCurrentNode({ specs: nextSpecs });
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="हटाउनुहोस्"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Notes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">परीक्षा तथा फिल्ड मुख्य बुँदाहरू (Key Notes):</span>
                      <button
                        type="button"
                        onClick={() => {
                          const note = prompt('नयाँ मुख्य बुँदा लेख्नुहोस्:');
                          if (note && note.trim()) {
                            updateCurrentNode({
                              keyNotes: [...(currentNode.keyNotes || []), note.trim()],
                            });
                          }
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> बुँदा थप्नुहोस्
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(currentNode.keyNotes || []).map((note, nIdx) => (
                        <div key={nIdx} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-amber-400 text-xs shrink-0">•</span>
                          <input
                            type="text"
                            value={note}
                            onChange={(e) => {
                              const nextNotes = [...currentNode.keyNotes];
                              nextNotes[nIdx] = e.target.value;
                              updateCurrentNode({ keyNotes: nextNotes });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateCurrentNode({
                                keyNotes: currentNode.keyNotes.filter((_, i) => i !== nIdx),
                              });
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">कृपया बायाँबाट कुनै नोड छान्नुहोस्।</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: 5-STEP INSTALLATION PROCEDURE */}
      {activeSubTab === 'procedure' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>ड्रप वायर जडान कार्यविधि चरणहरू (5-Step Dropwire Procedure)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                DP 31 बाट NITVT अफिस (House 16) सम्म ड्रप वायर तान्ने चरणबद्ध प्रयोगात्मक कार्यविधि।
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddProcedureStep}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नयाँ चरण थप्नुहोस्</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.procedures.map((proc, idx) => (
              <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {proc.step}
                    </span>
                    <input
                      type="text"
                      value={proc.title}
                      onChange={(e) => updateProcedureStep(idx, { title: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold w-72 sm:w-96 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteProcedureStep(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg"
                    title="चरण हटाउनुहोस्"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">विस्तृत कार्यविधि वर्णन:</label>
                  <textarea
                    rows={2}
                    value={proc.desc}
                    onChange={(e) => updateProcedureStep(idx, { desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>सुरक्षा सावधानी (Safety Caution):</span>
                  </label>
                  <input
                    type="text"
                    value={proc.safety}
                    onChange={(e) => updateProcedureStep(idx, { safety: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: FIELD VIVA QUESTIONS */}
      {activeSubTab === 'viva' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>फिल्ड सर्भे VIVA मौखिक प्रश्नोत्तर बैंक (Survey Viva Bank)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                ग्वार्को चोक, उदय बस्ती र NITVT अफिस फिल्ड नक्सासम्बन्धी मुख्य मौखिक प्रश्नहरू।
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddViva}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नयाँ VIVA प्रश्न थप्नुहोस्</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.vivaQuestions.map((viva, idx) => (
              <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    प्रश्न {idx + 1}:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteViva(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg"
                    title="प्रश्न हटाउनुहोस्"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={viva.q}
                    onChange={(e) => updateVivaQuestion(idx, { q: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                    placeholder="प्रश्न यहाँ लेख्नुहोस्..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-emerald-400">उत्तर (Answer):</label>
                  <textarea
                    rows={2}
                    value={viva.a}
                    onChange={(e) => updateVivaQuestion(idx, { a: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="उत्तर यहाँ लेख्नुहोस्..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: NITVT MANUAL & OFC TECHNICAL CONTENT EDITOR */}
      {activeSubTab === 'nitvt_manual' && (() => {
        const manual = formData.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;

        const updateManualInfo = (patch: Partial<NitvtManualData>) => {
          setFormData((prev) => ({
            ...prev,
            nitvtManual: {
              ...(prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!),
              ...patch,
            },
          }));
        };

        const updateChapter = (index: number, patch: Partial<NitvtChapter>) => {
          setFormData((prev) => {
            const m = prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;
            const chs = [...m.chapters];
            chs[index] = { ...chs[index], ...patch };
            return {
              ...prev,
              nitvtManual: { ...m, chapters: chs },
            };
          });
        };

        const updateCopperFiberRow = (index: number, patch: Partial<CopperVsFiberItem>) => {
          setFormData((prev) => {
            const m = prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;
            const list = [...m.copperVsFiber];
            list[index] = { ...list[index], ...patch };
            return {
              ...prev,
              nitvtManual: { ...m, copperVsFiber: list },
            };
          });
        };

        const updateColorCodeRow = (index: number, patch: Partial<FiberColorCodeRow>) => {
          setFormData((prev) => {
            const m = prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;
            const list = [...m.colorCodes];
            list[index] = { ...list[index], ...patch };
            return {
              ...prev,
              nitvtManual: { ...m, colorCodes: list },
            };
          });
        };

        const updateTool = (index: number, patch: Partial<NitvtToolItem>) => {
          setFormData((prev) => {
            const m = prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;
            const list = [...m.tools];
            list[index] = { ...list[index], ...patch };
            return {
              ...prev,
              nitvtManual: { ...m, tools: list },
            };
          });
        };

        const updateFault = (index: number, patch: Partial<NitvtFaultItem>) => {
          setFormData((prev) => {
            const m = prev.nitvtManual || defaultLevel1FieldSurveyData.nitvtManual!;
            const list = [...m.faults];
            list[index] = { ...list[index], ...patch };
            return {
              ...prev,
              nitvtManual: { ...m, faults: list },
            };
          });
        };

        return (
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800">
                  NITVT Technical Manual (PDF) Editor
                </span>
                <h4 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <span>फाइबर अप्टिक नेटवर्क प्राविधिक म्यानुअल सामग्री सम्पादन</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  ४ परिच्छेद, कापर बनाम फाइबर तुलना, १२-रङ कोडिङ, आधुनिक औजारहरू र सुरक्षा नियमहरू
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    speakNepaliText(
                      'NITVT प्राविधिक म्यानुअल सम्पादक खुला छ। यहाँबाट चारै परिच्छेद, १२-रङ कोड र सुरक्षा निर्देशिकाहरू सम्पादन गर्न सकिन्छ।',
                      'म्यानुअल सम्पादक'
                    );
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>सुन्नुहोस्</span>
                </button>
              </div>
            </div>

            {/* Sub-navigation inside NITVT Manual Admin */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-semibold">
              {[
                { id: 'chapters', label: '१. परिच्छेद १–४ (Chapters)' },
                { id: 'copper_fiber', label: '२. कापर बनाम FTTH तुलना (5 Rows)' },
                { id: 'color_codes', label: '३. १२-रङ फाइबर कलर कोड (Color Codes)' },
                { id: 'tools', label: '४. आधुनिक औजारहरू (7 Tools)' },
                { id: 'safety_faults', label: '५. सुरक्षा र फल्ट मर्मत (Safety & Faults)' },
                { id: 'info', label: '६. म्यानुअल शीर्षक र संस्था विवरण' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setManualActiveSection(sec.id as any)}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                    manualActiveSection === sec.id
                      ? 'bg-rose-600 text-white shadow-md font-bold'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* SECTION 1: CHAPTERS */}
            {manualActiveSection === 'chapters' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {manual.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setEditingChapterIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                        editingChapterIdx === idx
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      परिच्छेद {ch.chapterNo}: {ch.titleNepali.replace(/^परिच्छेद \d+:\s*/, '').slice(0, 18)}...
                    </button>
                  ))}
                </div>

                {(() => {
                  const ch = manual.chapters[editingChapterIdx];
                  if (!ch) return null;
                  return (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            परिच्छेद शीर्षक (नेपाली)
                          </label>
                          <input
                            type="text"
                            value={ch.titleNepali}
                            onChange={(e) => updateChapter(editingChapterIdx, { titleNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Chapter Title (English)
                          </label>
                          <input
                            type="text"
                            value={ch.titleEnglish}
                            onChange={(e) => updateChapter(editingChapterIdx, { titleEnglish: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          छोटो विवरण (Short Tagline)
                        </label>
                        <input
                          type="text"
                          value={ch.shortDesc}
                          onChange={(e) => updateChapter(editingChapterIdx, { shortDesc: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          परिच्छेदको विस्तृत प्राविधिक विवरण (Main Content - Nepali)
                        </label>
                        <textarea
                          rows={6}
                          value={ch.contentNepali}
                          onChange={(e) => updateChapter(editingChapterIdx, { contentNepali: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          मुख्य बुँदाहरू (प्रति लाइन एक बुँदा)
                        </label>
                        <textarea
                          rows={5}
                          value={ch.bulletPoints.join('\n')}
                          onChange={(e) =>
                            updateChapter(editingChapterIdx, {
                              bulletPoints: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-rose-500"
                          placeholder="प्रत्येक लाइनमा एक-एक प्राविधिक बुँदा लेख्नुहोस्..."
                        />
                      </div>

                      {ch.safetyOrAlert !== undefined && (
                        <div>
                          <label className="text-xs font-bold text-rose-300 block mb-1">
                            विशेष सुरक्षा / सतर्कता निर्देशन (Safety Alert Box)
                          </label>
                          <textarea
                            rows={3}
                            value={ch.safetyOrAlert || ''}
                            onChange={(e) => updateChapter(editingChapterIdx, { safetyOrAlert: e.target.value })}
                            className="w-full bg-slate-900 border border-rose-900/60 rounded-lg p-2.5 text-xs text-rose-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SECTION 2: COPPER VS FIBER */}
            {manualActiveSection === 'copper_fiber' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-300 uppercase">
                    ५ मुख्य रूपान्तरण चरणहरू (Gwarko Chowk Cabinet 09 ➔ FTTH)
                  </h5>
                </div>

                <div className="space-y-3">
                  {manual.copperVsFiber.map((row, idx) => (
                    <div key={row.sn} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-amber-400">चरण #{row.sn}</span>
                        <span className="text-[11px] text-slate-400 font-medium">Copper vs OFC Stage</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-amber-300 block">परम्परागत कापर</label>
                          <input
                            type="text"
                            value={row.copper}
                            onChange={(e) => updateCopperFiberRow(idx, { copper: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={row.copperDetails}
                            onChange={(e) => updateCopperFiberRow(idx, { copperDetails: e.target.value })}
                            placeholder="विस्तृत विवरण..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-cyan-300 block">आधुनिक FTTH फाइबर</label>
                          <input
                            type="text"
                            value={row.fiber}
                            onChange={(e) => updateCopperFiberRow(idx, { fiber: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={row.fiberDetails}
                            onChange={(e) => updateCopperFiberRow(idx, { fiberDetails: e.target.value })}
                            placeholder="विस्तृत विवरण..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                          ग्वार्को चोक OSP फिल्ड नक्सामा भूमिका (Role in Gwarko)
                        </label>
                        <input
                          type="text"
                          value={row.roleInGwarko}
                          onChange={(e) => updateCopperFiberRow(idx, { roleInGwarko: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: COLOR CODES */}
            {manualActiveSection === 'color_codes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-300 uppercase">
                    १२-कोर फाइबर कलर कोडिङ (नेपाल टेलिकम vs अन्तर्राष्ट्रिय)
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {manual.colorCodes.map((c, idx) => (
                    <div key={c.no} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow" style={{ backgroundColor: c.hex }} />
                          <span className="text-xs font-bold text-white">कोर #{c.no}</span>
                        </div>
                        <input
                          type="text"
                          value={c.hex}
                          onChange={(e) => updateColorCodeRow(idx, { hex: e.target.value })}
                          className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-center font-mono text-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-amber-400 block font-bold">NT रङ (नेपाली)</label>
                          <input
                            type="text"
                            value={c.ntColorNepali}
                            onChange={(e) => updateColorCodeRow(idx, { ntColorNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block font-bold">NT Color (EN)</label>
                          <input
                            type="text"
                            value={c.ntColorEnglish}
                            onChange={(e) => updateColorCodeRow(idx, { ntColorEnglish: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-cyan-400 block font-bold">Intl रङ (नेपाली)</label>
                          <input
                            type="text"
                            value={c.intlColorNepali}
                            onChange={(e) => updateColorCodeRow(idx, { intlColorNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-cyan-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-cyan-400 block font-bold">Intl Color (EN)</label>
                          <input
                            type="text"
                            value={c.intlColorEnglish}
                            onChange={(e) => updateColorCodeRow(idx, { intlColorEnglish: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-cyan-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: TOOLS */}
            {manualActiveSection === 'tools' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-300 uppercase">
                    ७ आधुनिक फाइबर औजारहरू (Specialized OFC Tools)
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {manual.tools.map((t, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                          यन्त्र #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold">औजारको नाम (नेपाली)</label>
                          <input
                            type="text"
                            value={t.nameNepali}
                            onChange={(e) => updateTool(idx, { nameNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-bold">Tool Name (English)</label>
                          <input
                            type="text"
                            value={t.nameEnglish}
                            onChange={(e) => updateTool(idx, { nameEnglish: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block font-bold">विवरण र प्राविधिक भूमिका</label>
                        <textarea
                          rows={2}
                          value={t.descNepali}
                          onChange={(e) => updateTool(idx, { descNepali: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-emerald-400 block font-bold">प्रयोग सल्लाह (Tip)</label>
                        <input
                          type="text"
                          value={t.usageTip}
                          onChange={(e) => updateTool(idx, { usageTip: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-emerald-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: SAFETY & FAULTS */}
            {manualActiveSection === 'safety_faults' && (
              <div className="space-y-6">
                {/* Faults */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-amber-400 uppercase">
                    ४ प्रमुख FTTH फल्टहरू र रोकथामका उपायहरू
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {manual.faults.map((f, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold">फल्ट (नेपाली)</label>
                            <input
                              type="text"
                              value={f.faultNepali}
                              onChange={(e) => updateFault(idx, { faultNepali: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold">Fault (EN)</label>
                            <input
                              type="text"
                              value={f.faultEnglish}
                              onChange={(e) => updateFault(idx, { faultEnglish: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-rose-400 block font-bold">फल्टको कारण (Cause)</label>
                          <input
                            type="text"
                            value={f.causeNepali}
                            onChange={(e) => updateFault(idx, { causeNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-emerald-400 block font-bold">रोकथाम / समाधान (Prevention)</label>
                          <textarea
                            rows={2}
                            value={f.preventionNepali}
                            onChange={(e) => updateFault(idx, { preventionNepali: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-emerald-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Guidelines */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h5 className="text-xs font-bold text-rose-400 uppercase">
                    सुरक्षा निर्देशिकाहरू (प्रति लाइन एक नियम)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        १. लेजर विकिरण सुरक्षा (Laser Radiation Rules)
                      </label>
                      <textarea
                        rows={4}
                        value={manual.safetyGuidelines.laser.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateManualInfo({
                            safetyGuidelines: {
                              ...manual.safetyGuidelines,
                              laser: lines,
                            },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        २. सिसाका टुक्रा सुरक्षा (Glass Shards Rules)
                      </label>
                      <textarea
                        rows={4}
                        value={manual.safetyGuidelines.glassShards.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateManualInfo({
                            safetyGuidelines: {
                              ...manual.safetyGuidelines,
                              glassShards: lines,
                            },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        ३. एरियल पोल सुरक्षा (Aerial Pole Rules)
                      </label>
                      <textarea
                        rows={4}
                        value={manual.safetyGuidelines.aerial.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateManualInfo({
                            safetyGuidelines: {
                              ...manual.safetyGuidelines,
                              aerial: lines,
                            },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        ४. म्यानहोल विषाक्त ग्यास सुरक्षा (Manhole Rules)
                      </label>
                      <textarea
                        rows={4}
                        value={manual.safetyGuidelines.manhole.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          updateManualInfo({
                            safetyGuidelines: {
                              ...manual.safetyGuidelines,
                              manhole: lines,
                            },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: INFO */}
            {manualActiveSection === 'info' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    म्यानुअलको शीर्षक
                  </label>
                  <input
                    type="text"
                    value={manual.title}
                    onChange={(e) => updateManualInfo({ title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      संस्था (Organization)
                    </label>
                    <input
                      type="text"
                      value={manual.organization}
                      onChange={(e) => updateManualInfo({ organization: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      स्थान (Location)
                    </label>
                    <input
                      type="text"
                      value={manual.location}
                      onChange={(e) => updateManualInfo({ location: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    लक्षित पद / भूमिका (Target Role)
                  </label>
                  <input
                    type="text"
                    value={manual.targetRole}
                    onChange={(e) => updateManualInfo({ targetRole: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* SUBTAB 7: RAW JSON CODE */}
      {activeSubTab === 'json' && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>कच्चा JSON डेटा सम्पादन (Raw JSON Editor)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                उन्नत प्राविधिकहरूका लागि सम्पूर्ण नक्सा संरचनालाई एकैचोटि JSON ढाँचामा सम्पादन गर्ने सुविधा।
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyJson}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>JSON लागू गर्नुहोस् (Apply JSON)</span>
            </button>
          </div>

          {jsonError && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/80 rounded-xl text-rose-300 text-xs font-mono">
              {jsonError}
            </div>
          )}

          <textarea
            rows={18}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setJsonError(null);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400">
          अन्तिम सम्पादन स्वतः प्रयोगकर्ता पृष्ठमा तुरुन्तै अद्यावधिक हुन्छ।
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>पूर्वनिर्धारित रिसेट</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>परिवर्तन सुरक्षित गर्नुहोस् (Save Changes)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
