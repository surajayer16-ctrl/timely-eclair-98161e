import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileText, Image as ImageIcon, Trash2, Download, Eye, 
  Plus, CheckCircle2, AlertCircle, RefreshCw, Sparkles, X, ShieldCheck, 
  HardDrive, Calendar, ArrowDownToLine, ExternalLink, Loader2, Lock 
} from 'lucide-react';
import { DownloadableTelecomNote } from '../types';
import { 
  getStoredDownloadableNotes, 
  fetchDownloadableNotesFromCloud, 
  saveDownloadableNote, 
  deleteDownloadableNote, 
  triggerFileDownload,
  INITIAL_DOWNLOADABLE_NOTES,
  getNoteFileUrl,
  getNoteFileUrlAsync,
  getBlobUrlForData,
  openNoteInNewTab,
  toggleNoteDownloadPermission
} from '../lib/downloadableNotesService';
import { PdfDocumentViewer } from './PdfDocumentViewer';

export const AdminDownloadableNotesManager: React.FC = () => {
  const [notes, setNotes] = useState<DownloadableTelecomNote[]>(() => getStoredDownloadableNotes());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form State for new upload
  const [formTitleNepali, setFormTitleNepali] = useState<string>('');
  const [formTitleEnglish, setFormTitleEnglish] = useState<string>('');
  const [formCategory, setFormCategory] = useState<DownloadableTelecomNote['category']>('level1');
  const [formFileType, setFormFileType] = useState<'pdf' | 'jpg' | 'png'>('pdf');
  const [formFileName, setFormFileName] = useState<string>('');
  const [formFileSize, setFormFileSize] = useState<string>('');
  const [formFileUrl, setFormFileUrl] = useState<string>('');
  const [formDescNepali, setFormDescNepali] = useState<string>('');
  const [formDescEnglish, setFormDescEnglish] = useState<string>('');
  const [formFeatured, setFormFeatured] = useState<boolean>(false);
  const [formAllowDownload, setFormAllowDownload] = useState<boolean>(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Preview modal inside admin
  const [adminPreviewNote, setAdminPreviewNote] = useState<DownloadableTelecomNote | null>(null);
  const [adminPreviewBlobUrl, setAdminPreviewBlobUrl] = useState<string>('');
  const [adminIsLoadingPreview, setAdminIsLoadingPreview] = useState<boolean>(false);

  // In-app confirmation modal states (no window.confirm so it works reliably in iframes)
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string; fileName?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with service
  useEffect(() => {
    fetchDownloadableNotesFromCloud().then((cloudNotes) => {
      if (cloudNotes && cloudNotes.length > 0) {
        setNotes(cloudNotes);
      }
    });

    const handleUpdate = () => {
      setNotes(getStoredDownloadableNotes());
    };

    window.addEventListener('nitvt_downloadable_notes_updated', handleUpdate);
    return () => {
      window.removeEventListener('nitvt_downloadable_notes_updated', handleUpdate);
    };
  }, []);

  // When admin preview note changes, resolve URL
  useEffect(() => {
    let active = true;
    if (!adminPreviewNote) {
      setAdminPreviewBlobUrl('');
      setAdminIsLoadingPreview(false);
      return;
    }

    setAdminIsLoadingPreview(true);
    getNoteFileUrlAsync(adminPreviewNote.id, adminPreviewNote.fileUrl)
      .then((resolved) => {
        if (!active) return;
        if (resolved) {
          const bUrl = getBlobUrlForData(resolved);
          setAdminPreviewBlobUrl(bUrl);
        }
        setAdminIsLoadingPreview(false);
      })
      .catch(() => {
        if (!active) return;
        setAdminIsLoadingPreview(false);
      });

    return () => {
      active = false;
    };
  }, [adminPreviewNote]);

  // Handle file selection (PDF or JPG/PNG)
  const handleFileChosen = (file: File) => {
    setErrorMsg('');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setErrorMsg('कृपया PDF (.pdf) वा तस्विर (.jpg, .jpeg, .png) फाइल मात्र अपलोड गर्नुहोस्।');
      return;
    }

    // Determine type
    const determinedType = isPdf ? 'pdf' : (file.name.toLowerCase().endsWith('.png') ? 'png' : 'jpg');
    setFormFileType(determinedType);
    setFormFileName(file.name);

    // Compute formatted size
    const sizeInKb = file.size / 1024;
    const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${Math.round(sizeInKb)} KB`;
    setFormFileSize(formattedSize);

    // If title is empty, prefill from filename
    if (!formTitleNepali) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormTitleNepali(cleanName);
      setFormTitleEnglish(cleanName);
    }

    // Read as Data URL
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormFileUrl(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg('फाइल पढ्नमा त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChosen(e.dataTransfer.files[0]);
    }
  };

  // Submit Note Upload
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFileUrl) {
      setErrorMsg('कृपया पहिले PDF वा JPG फाइल चयन गर्नुहोस्।');
      return;
    }
    if (!formTitleNepali.trim()) {
      setErrorMsg('कृपया नोटको शीर्षक लेख्नुहोस्।');
      return;
    }

    const newNote: DownloadableTelecomNote = {
      id: `note-${Date.now()}`,
      titleNepali: formTitleNepali.trim(),
      titleEnglish: formTitleEnglish.trim() || formTitleNepali.trim(),
      category: formCategory,
      fileType: formFileType,
      fileName: formFileName || `NITVT_${formCategory}_${Date.now()}.${formFileType}`,
      fileSize: formFileSize || '1.0 MB',
      fileUrl: formFileUrl,
      uploadedAt: new Date().toISOString().split('T')[0],
      descriptionNepali: formDescNepali.trim() || 'NITVT अधिकृत प्राविधिक नोट।',
      descriptionEnglish: formDescEnglish.trim() || 'Official technical training note.',
      downloadsCount: 0,
      featured: formFeatured,
      allowDownload: formAllowDownload
    };

    try {
      await saveDownloadableNote(newNote);
      setSaveSuccessMsg('नोट सफलतापूर्वक अपलोड भयो र डाउनलोडका लागि उपलब्ध भयो!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);

      // Reset form
      setFormTitleNepali('');
      setFormTitleEnglish('');
      setFormFileName('');
      setFormFileSize('');
      setFormFileUrl('');
      setFormDescNepali('');
      setFormDescEnglish('');
      setFormFeatured(false);
      setFormAllowDownload(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setErrorMsg('सेभ गर्दा त्रुटि भयो।');
    }
  };

  const handleToggleDownloadPermission = async (note: DownloadableTelecomNote) => {
    const nextStatus = note.allowDownload === false; // Toggle to true if was false, or false if was true/undefined
    setTogglingId(note.id);
    
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, allowDownload: nextStatus } : n))
    );

    try {
      const success = await toggleNoteDownloadPermission(note.id, nextStatus);
      if (success) {
        setSaveSuccessMsg(
          nextStatus
            ? `"${note.titleNepali}" को डाउनलोड अनुमति खुला गरियो!`
            : `"${note.titleNepali}" को डाउनलोड बन्द गरियो (केवल प्रिभ्यू मात्र)!`
        );
        setTimeout(() => setSaveSuccessMsg(''), 3500);
      } else {
        setErrorMsg('अनुमति परिवर्तन गर्न सकिएन।');
        setTimeout(() => setErrorMsg(''), 3500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('त्रुटि भयो।');
      setTimeout(() => setErrorMsg(''), 3500);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteClick = (id: string, title: string, fileName?: string) => {
    setNoteToDelete({ id, title, fileName });
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      const targetId = noteToDelete.id;
      const targetTitle = noteToDelete.title;

      // Optimistic update
      setNotes((prev) => prev.filter((n) => n.id !== targetId));

      const success = await deleteDownloadableNote(targetId);
      if (success) {
        setSaveSuccessMsg(`"${targetTitle}" नोट सफलतापूर्वक मेटाइयो!`);
        setTimeout(() => setSaveSuccessMsg(''), 3500);
      } else {
        setErrorMsg('नोट मेटाउँदा त्रुटि भयो। पुनः प्रयास गर्नुहोस्।');
        setTimeout(() => setErrorMsg(''), 3500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('नोट मेटाउँदा समस्या आयो।');
      setTimeout(() => setErrorMsg(''), 3500);
    } finally {
      setIsDeleting(false);
      setNoteToDelete(null);
    }
  };

  const handleResetDefaultsClick = () => {
    setShowResetModal(true);
  };

  const confirmResetDefaults = async () => {
    setIsResetting(true);
    try {
      for (const item of INITIAL_DOWNLOADABLE_NOTES) {
        await saveDownloadableNote(item);
      }
      setNotes(getStoredDownloadableNotes());
      setSaveSuccessMsg('डिफल्ट नोटहरू सफलतापूर्वक रिस्टोर गरियो!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('डिफल्ट रिस्टोर गर्दा समस्या आयो।');
    } finally {
      setIsResetting(false);
      setShowResetModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4 text-amber-400" />
            <span>टेलिकम डाउनलोड नोट तथा रेखाचित्र व्यवस्थापन (PDF / JPG Upload Hub)</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            यहाँबाट जुनियर टेलिकम तह-१, तह-२, OSP नेटवर्क, फाइबर स्प्लाइसिङ तथा इलेक्ट्रिसियनका PDF म्यानुअल र JPG रेखाचित्रहरू अपलोड र डाउनलोड योग्य बनाउनुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaultsClick}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="पुनः डिफल्ट नोटहरू रिस्टोर गर्नुहोस्"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>डिफल्ट रिस्टोर</span>
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {saveSuccessMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Form Box */}
      <form onSubmit={handleSaveNote} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>नयाँ नोट वा रेखाचित्र अपलोड गर्नुहोस् (Upload PDF or JPG)</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Supported: .pdf, .jpg, .jpeg, .png
          </span>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-amber-400 bg-amber-500/10' 
              : formFileUrl 
              ? 'border-emerald-500/60 bg-emerald-950/20' 
              : 'border-slate-700 hover:border-amber-500/50 bg-slate-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChosen(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="py-4 space-y-2">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-300">फाइल प्रोसेस हुँदैछ, कृपया प्रतीक्षा गर्नुहोस्...</p>
            </div>
          ) : formFileUrl ? (
            <div className="py-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                {formFileType === 'pdf' ? (
                  <FileText className="w-7 h-7 text-rose-400" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-sky-400" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formFileName}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  साइज: <span className="text-amber-300 font-mono">{formFileSize}</span> • फर्म्याट: <span className="uppercase font-bold text-slate-300">{formFileType}</span>
                </p>
                <span className="text-[10px] text-amber-400 underline mt-1 inline-block">
                  अर्को फाइल चयन गर्न यहाँ क्लिक गर्नुहोस्
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-200">
                यहाँ PDF वा JPG फाइल तान्नुहोस् (Drag & Drop) वा क्लिक गरेर छान्नुहोस्
              </p>
              <p className="text-[11px] text-slate-400">
                अधिकतम फाइल साइज: ५० MB सम्म (PDF, JPG, PNG)
              </p>
            </div>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              नोटको शीर्षक (नेपालीमा) *
            </label>
            <input
              type="text"
              required
              placeholder="उदा: अप्टिकल फाइबर स्प्लाइसिङ र कलर कोड म्यानुअल"
              value={formTitleNepali}
              onChange={(e) => setFormTitleNepali(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              Title (English)
            </label>
            <input
              type="text"
              placeholder="e.g. Optical Fiber Splicing & Color Code Manual"
              value={formTitleEnglish}
              onChange={(e) => setFormTitleEnglish(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              विषयगत श्रेणी (Category)
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="level1">तह–१ (Junior Telecom Technician Level 1)</option>
              <option value="level2">तह–२ (Telecom Technician Level 2)</option>
              <option value="optical-fiber">अप्टिकल फाइबर तथा FTTH (Optical Fiber)</option>
              <option value="osp-telecom">OSP टेलिकम नेटवर्क तथा पोलिङ (Outside Plant)</option>
              <option value="electrician">बिल्डिङ इलेक्ट्रिसियन (Building Electrician)</option>
              <option value="exam">CTEVT परीक्षा तयारी तथा मोडल सेट (Exam Prep)</option>
              <option value="manual">आधिकारिक पाठ्यक्रम तथा SOP (Manuals)</option>
              <option value="other">अन्य प्राविधिक सामग्री (Other)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              फाइलको नाम (File Name with extension)
            </label>
            <input
              type="text"
              placeholder="उदा: Telecom_Level1_Handout.pdf"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              संक्षिप्त विवरण (नेपालीमा)
            </label>
            <textarea
              rows={2}
              placeholder="नोटमा समावेश गरिएका मुख्य विषयहरू, जस्तै: फ्युजन स्प्लाइसिङ, ओटीडीआर टेस्टिङ, १२-कोर कलर कोडिङ..."
              value={formDescNepali}
              onChange={(e) => setFormDescNepali(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Download Permission Toggle for New Upload */}
          <div className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                formAllowDownload ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {formAllowDownload ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>विद्यार्थीहरूलाई डाउनलोड गर्न दिने? (Download Permission)</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    formAllowDownload ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {formAllowDownload ? 'हो (डाउनलोड खुला)' : 'होइन (केवल अनलाइन हेर्न मिल्ने)'}
                  </span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formAllowDownload 
                    ? 'प्रयोगकर्ताहरूले यो PDF वा JPG फाइल आफ्नो मोबाइल/कम्प्युटरमा सिधै डाउनलोड र सेभ गर्न सक्नेछन्।' 
                    : 'डाउनलोड निषेध: विद्यार्थीहरूले यो फाइल एपभित्र सिधै पढ्न/हेर्न मात्र सक्नेछन्, डाउनलोड गर्न पाउने छैनन्।'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFormAllowDownload(!formAllowDownload)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors shrink-0 flex items-center gap-1.5 ${
                formAllowDownload
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                  : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-800'
              }`}
            >
              {formAllowDownload ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>डाउनलोड खुला छ</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>केवल हेर्न मिल्ने (डाउनलोड बन्द)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featuredNoteCheck"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:outline-none"
            />
            <label htmlFor="featuredNoteCheck" className="text-xs text-slate-300 cursor-pointer font-bold">
              विशेष सामग्रीको रूपमा सूचीकृत गर्नुहोस् (Mark as Featured)
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={!formFileUrl || isUploading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
              formFileUrl && !isUploading
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>नोट सुरक्षित र प्रकाशित गर्नुहोस् (Publish Note for Download)</span>
          </button>
        </div>
      </form>

      {/* Uploaded Files Table / List */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>हाल उपलब्ध नोटहरू ({notes.length})</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              प्रत्येक PDF र JPG फाइलको डाउनलोड अनुमति यहीँबाट एक-क्लिकमा नियन्त्रण (खुला वा बन्द) गर्नुहोस्
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              डाउनलोड खुला: {notes.filter((n) => n.allowDownload !== false).length}
            </span>
            <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Lock className="w-3 h-3" />
              केवल हेर्न मिल्ने: {notes.filter((n) => n.allowDownload === false).length}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {notes.map((note) => {
            const isPdf = note.fileType === 'pdf';

            return (
              <div
                key={note.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {isPdf ? (
                      <FileText className="w-5 h-5 text-rose-400" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-sky-400" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isPdf ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {note.fileType}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                        {note.category}
                      </span>
                      {/* Download Status Badge */}
                      {note.allowDownload === false ? (
                        <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          केवल हेर्न मिल्ने (View Only)
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          डाउनलोड खुला
                        </span>
                      )}
                      {note.featured && (
                        <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          विशेष
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {note.fileSize}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white truncate">
                      {note.titleNepali}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      {note.titleEnglish} • {note.fileName}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Download Permission Toggle Button */}
                  <button
                    type="button"
                    disabled={togglingId === note.id}
                    onClick={() => handleToggleDownloadPermission(note)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all shadow-sm ${
                      note.allowDownload !== false
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-400'
                        : 'bg-rose-950/70 border-rose-500/50 text-rose-300 hover:bg-rose-900/80 hover:border-rose-400'
                    }`}
                    title={
                      note.allowDownload !== false
                        ? 'डाउनलोड अनुमति खुला छ (क्लिक गरी बन्द / केवल प्रिभ्यू बनाउनुहोस्)'
                        : 'डाउनलोड बन्द छ / केवल हेर्न मिल्ने (क्लिक गरी डाउनलोड अनुमति दिनुहोस्)'
                    }
                  >
                    {togglingId === note.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : note.allowDownload !== false ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>
                      {note.allowDownload !== false ? 'डाउनलोड: खुला (Allowed)' : 'डाउनलोड: बन्द (View Only)'}
                    </span>
                  </button>

                  {/* Open in New Tab directly */}
                  <button
                    onClick={() => openNoteInNewTab(note)}
                    className="bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white p-2 rounded-xl transition-colors"
                    title="नयाँ ट्याबमा सिधै खोल्नुहोस्"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* Test Download */}
                  <button
                    onClick={() => triggerFileDownload(note)}
                    disabled={note.allowDownload === false}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                      note.allowDownload !== false
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                    }`}
                    title={note.allowDownload !== false ? 'डाउनलोड टेस्ट गर्नुहोस्' : 'प्रशासकले डाउनलोड निषेध गरेको छ'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>डाउनलोड ({note.downloadsCount || 0})</span>
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => setAdminPreviewNote(note)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl transition-colors"
                    title="सिधै प्रिभ्यू हेर्नुहोस्"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteClick(note.id, note.titleNepali, note.fileName)}
                    className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 p-2 rounded-xl transition-colors hover:scale-105 active:scale-95"
                    title="यो नोट स्थायी रूपमा हटाउनुहोस्"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-App Delete Confirmation Modal (Reliable in iframes) */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">नोट हटाउने पुष्टि गर्नुहोस् (Delete Note)</h4>
                <p className="text-[11px] text-slate-400">यो कार्य रद्द गर्न सकिँदैन।</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-slate-100">{noteToDelete.title}</p>
              {noteToDelete.fileName && (
                <p className="text-[11px] text-slate-400 font-mono">{noteToDelete.fileName}</p>
              )}
              <p className="text-[11px] text-rose-300/80 pt-1">
                के तपाईं यो फाइल डाउनलोड सूचीबाट स्थायी रूपमा मेटाउन चाहनुहुन्छ?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                रद्द गर्नुहोस् (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-60 transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-900/30"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>मेटाउँदै...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>निश्चित मेटाउनुहोस् (Delete)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Reset Defaults Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">डिफल्ट नोटहरू रिस्टोर</h4>
                <p className="text-[11px] text-slate-400">पूर्वनिर्धारित CTEVT नोटहरू पुनः लोड हुनेछन्।</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              सबै डिफल्ट म्यानुअल र रेखाचित्रहरू पुनः लोड गर्न चाहनुहुन्छ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="button"
                onClick={confirmResetDefaults}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 transition-colors flex items-center gap-1.5 shadow"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>लोड हुँदै...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>रिस्टोर गर्नुहोस्</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {adminPreviewNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-white truncate">{adminPreviewNote.titleNepali}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">({adminPreviewNote.fileType.toUpperCase()})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openNoteInNewTab(adminPreviewNote)}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow"
                  title="नयाँ ट्याबमा खोल्नुहोस्"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">नयाँ ट्याब</span>
                </button>
                <button
                  onClick={() => triggerFileDownload(adminPreviewNote)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड</span>
                </button>
                <button
                  onClick={() => setAdminPreviewNote(null)}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-slate-950 flex items-center justify-center overflow-auto">
              {adminIsLoadingPreview ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <span className="text-xs text-slate-400">फाइल लोड हुँदैछ...</span>
                </div>
              ) : adminPreviewNote.fileType === 'pdf' ? (
                <div className="w-full h-full flex flex-col min-h-0">
                  <PdfDocumentViewer
                    fileUrl={adminPreviewBlobUrl || getNoteFileUrl(adminPreviewNote.id, adminPreviewNote.fileUrl)}
                    title={adminPreviewNote.titleNepali || adminPreviewNote.titleEnglish}
                    fileName={adminPreviewNote.fileName}
                    onDownload={() => triggerFileDownload(adminPreviewNote)}
                  />
                </div>
              ) : (
                <img
                  src={adminPreviewBlobUrl || getNoteFileUrl(adminPreviewNote.id, adminPreviewNote.fileUrl)}
                  alt={adminPreviewNote.titleNepali}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
