import React, { useState, useEffect } from 'react';
import { 
  Download, FileText, Image as ImageIcon, Search, Eye, X, 
  Sparkles, CheckCircle2, ShieldCheck, Printer, ArrowDownToLine, 
  Maximize2, ZoomIn, ZoomOut, RotateCcw, Calendar, HardDrive,
  ExternalLink, Check, AlertCircle, Loader2, Trash2, Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DownloadableTelecomNote } from '../types';
import { 
  getStoredDownloadableNotes, 
  fetchDownloadableNotesFromCloud, 
  triggerFileDownload,
  getNoteFileUrl,
  getNoteFileUrlAsync,
  getBlobUrlForData,
  openNoteInNewTab,
  deleteDownloadableNote
} from '../lib/downloadableNotesService';
import { PdfDocumentViewer } from './PdfDocumentViewer';

// Dedicated thumbnail component for async loading of high-res images from IndexedDB
const NoteImageThumbnail: React.FC<{ note: DownloadableTelecomNote }> = ({ note }) => {
  const [imgUrl, setImgUrl] = useState<string>(() => getNoteFileUrl(note.id, note.fileUrl));
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getNoteFileUrlAsync(note.id, note.fileUrl).then((url) => {
      if (isMounted && url) {
        setImgUrl(url);
      }
    });
    return () => { isMounted = false; };
  }, [note.id, note.fileUrl]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
      {imgUrl ? (
        <img 
          src={imgUrl} 
          alt={note.titleEnglish || note.titleNepali}
          onLoad={() => setHasLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${hasLoaded ? 'opacity-100' : 'opacity-80'}`}
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-slate-500">
          <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
          <span className="text-[10px]">रेखाचित्र लोड हुँदैछ...</span>
        </div>
      )}
    </div>
  );
};

interface DownloadableNotesSectionProps {
  onOpenAdminUpload?: () => void;
}

export const DownloadableNotesSection: React.FC<DownloadableNotesSectionProps> = ({
  onOpenAdminUpload
}) => {
  const { t, isEnglish } = useLanguage();
  const [notes, setNotes] = useState<DownloadableTelecomNote[]>(() => getStoredDownloadableNotes());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Preview Modal State
  const [previewNote, setPreviewNote] = useState<DownloadableTelecomNote | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Active download state feedback
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // In-app delete confirmation state
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string; fileName?: string } | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState<boolean>(false);

  // Sync and listen for changes
  useEffect(() => {
    // Initial fetch from Firestore
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

  // When preview note changes, resolve URL to blob
  useEffect(() => {
    let active = true;
    if (!previewNote) {
      setPreviewBlobUrl('');
      setIsLoadingPreview(false);
      setZoomLevel(1);
      return;
    }

    setIsLoadingPreview(true);
    getNoteFileUrlAsync(previewNote.id, previewNote.fileUrl)
      .then((resolved) => {
        if (!active) return;
        if (resolved) {
          const bUrl = getBlobUrlForData(resolved);
          setPreviewBlobUrl(bUrl);
        }
        setIsLoadingPreview(false);
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Could not resolve preview URL:', err);
        setIsLoadingPreview(false);
      });

    return () => {
      active = false;
    };
  }, [previewNote]);

  // Handle direct download with visual feedback
  const handleDownloadClick = async (note: DownloadableTelecomNote) => {
    setDownloadingId(note.id);
    setDownloadToast(t(`${note.fileName || note.titleNepali} डाउनलोड सुरु भयो...`, `Downloading ${note.fileName || note.titleEnglish}...`));
    
    try {
      await triggerFileDownload(note);
      setTimeout(() => {
        setDownloadToast(t(`सफलतापूर्वक डाउनलोड भयो!`, `Download complete!`));
        setTimeout(() => setDownloadToast(null), 3000);
      }, 800);
    } catch (e) {
      console.error(e);
      setDownloadToast(null);
    } finally {
      setDownloadingId(null);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.titleNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.descriptionNepali && n.descriptionNepali.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.descriptionEnglish && n.descriptionEnglish.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'pdf') return n.fileType === 'pdf';
    if (selectedCategory === 'jpg') return n.fileType === 'jpg' || n.fileType === 'png';
    return n.category === selectedCategory;
  });

  const pdfCount = notes.filter(n => n.fileType === 'pdf').length;
  const jpgCount = notes.filter(n => n.fileType === 'jpg' || n.fileType === 'png').length;

  const handlePrint = async (note: DownloadableTelecomNote) => {
    const activeUrl = await getNoteFileUrlAsync(note.id, note.fileUrl);
    if (!activeUrl) return;

    if (note.fileType === 'jpg' || note.fileType === 'png') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${note.titleEnglish || note.titleNepali}</title>
              <style>
                body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; background: #fff; padding: 20px; }
                h2 { margin-bottom: 5px; color: #0f172a; text-align: center; }
                p { margin-top: 0; margin-bottom: 15px; color: #475569; font-size: 14px; text-align: center; }
                img { max-width: 100%; max-height: 85vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <h2>NITVT: ${note.titleNepali}</h2>
              <p>${note.titleEnglish} | Surendra Air Telecom Training</p>
              <img src="${activeUrl}" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      // PDF print
      openNoteInNewTab(note);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    setIsDeletingNote(true);
    try {
      const targetId = noteToDelete.id;
      const targetTitle = noteToDelete.title;

      // Optimistic state update
      setNotes((prev) => prev.filter((n) => n.id !== targetId));

      if (previewNote && previewNote.id === targetId) {
        setPreviewNote(null);
      }

      const ok = await deleteDownloadableNote(targetId);
      if (ok) {
        setDownloadToast(t(`"${targetTitle}" नोट सफलतापूर्वक मेटाइयो!`, `Note "${targetTitle}" deleted successfully!`));
        setTimeout(() => setDownloadToast(null), 3500);
      } else {
        setDownloadToast(t('नोट मेटाउन सकिएन। पुनः प्रयास गर्नुहोस्।', 'Failed to delete note. Please try again.'));
        setTimeout(() => setDownloadToast(null), 3500);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeletingNote(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div id="telecom-download-center" className="space-y-6 pt-4">
      {/* Section Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>{t('डाउनलोड सेन्टर (Download Center)', 'Download Center')}</span>
              </span>
              <span className="bg-slate-800/80 text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700/60">
                {pdfCount} {t('PDF म्यानुअल', 'PDF Manuals')}
              </span>
              <span className="bg-slate-800/80 text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700/60">
                {jpgCount} {t('JPG रेखाचित्रहरू', 'JPG Diagrams')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('टेलिकम नोट तथा आधिकारिक सामग्रीहरू डाउनलोड गर्नुहोस्', 'Download Telecom Notes, Manuals & Field Schematics')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t(
                'एडमिनद्वारा अपलोड गरिएका आधिकारिक CTEVT तथा NSTB पाठ्यक्रम, प्राविधिक म्यानुअल, स्प्लाइसिङ गाइड र उच्च-रिजोल्युसन OSP रेखाचित्रहरू PDF वा JPG फर्म्याटमा एक क्लिकमै डाउनलोड गर्नुहोस्।',
                'Instantly download official CTEVT & NSTB curriculum handouts, technical manuals, optical fiber color-coding sheets, and high-resolution outside plant engineering schematics uploaded by admin.'
              )}
            </p>
          </div>

          {/* Quick Stats & Admin Upload trigger button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onOpenAdminUpload && (
              <button
                onClick={onOpenAdminUpload}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('एडमिनबाट नोट थप्नुहोस्', 'Upload Note as Admin')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {[
              { id: 'all', label: t('सबै सामग्री', 'All Files'), count: notes.length },
              { id: 'pdf', label: t('📄 PDF म्यानुअल', 'PDF Manuals'), count: pdfCount },
              { id: 'jpg', label: t('🖼️ JPG रेखाचित्र', 'JPG Schematics'), count: jpgCount },
              { id: 'level1', label: t('तह-१', 'Level 1'), count: notes.filter(n => n.category === 'level1').length },
              { id: 'level2', label: t('तह-२', 'Level 2'), count: notes.filter(n => n.category === 'level2').length },
              { id: 'osp-telecom', label: t('OSP नेटवर्क', 'OSP Telecom'), count: notes.filter(n => n.category === 'osp-telecom').length },
              { id: 'optical-fiber', label: t('फाइबर स्प्लाइसिङ', 'Optical Fiber'), count: notes.filter(n => n.category === 'optical-fiber').length },
              { id: 'electrician', label: t('इलेक्ट्रिसियन', 'Electrician'), count: notes.filter(n => n.category === 'electrician').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === tab.id ? 'bg-slate-950/30 text-slate-900 font-extrabold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('नोट, म्यानुअल वा रेखाचित्र खोज्नुहोस्...', 'Search notes, manuals, diagrams...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Downloadable Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">
            {t('कुनै सामग्री फेला परेन', 'No downloadable notes found')}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('तपाईंले खोज्नुभएको शब्द वा श्रेणीसँग मिल्ने नोट उपलब्ध छैन। कृपया अर्को शब्द प्रयास गर्नुहोस्।', 'Try selecting another category or resetting the search filter.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const isPdf = note.fileType === 'pdf';

            return (
              <div
                key={note.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="space-y-3.5">
                  {/* Card Header with Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isPdf ? (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <FileText className="w-3 h-3 text-rose-400" />
                          <span>PDF DOCUMENT</span>
                        </span>
                      ) : (
                        <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-sky-400" />
                          <span>JPG SCHEMATIC</span>
                        </span>
                      )}

                      {note.featured && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                          {t('विशेष', 'Featured')}
                        </span>
                      )}

                      {note.allowDownload === false && (
                        <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1" title={t('प्रशासकले डाउनलोड बन्द गरेको छ (केवल हेर्न मिल्ने)', 'Download restricted by admin - View only')}>
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{t('केवल हेर्न मिल्ने', 'View Only')}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <HardDrive className="w-3 h-3 text-slate-500" />
                      <span>{note.fileSize || 'Standard'}</span>
                    </div>
                  </div>

                  {/* Thumbnail / Visual Representation */}
                  <div 
                    onClick={() => setPreviewNote(note)}
                    className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 cursor-pointer group-hover:border-amber-500/50 transition-colors flex items-center justify-center"
                  >
                    {isPdf ? (
                      <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-900">
                        <div className="flex items-center justify-between text-rose-400">
                          <FileText className="w-6 h-6" />
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                            PDF DOCUMENT
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100 line-clamp-2">
                            {note.titleNepali}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                            {note.fileName || 'CTEVT Course Material'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                          <span>Surendra Air NITVT</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{t('सिधै हेर्नुहोस्', 'View Document')}</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <NoteImageThumbnail note={note} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-3 pointer-events-none">
                          <span className="text-[10px] font-bold text-sky-300 bg-slate-900/90 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/60 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{t('विस्तृत रेखाचित्र हेर्नुहोस्', 'View Diagram')}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 scale-95 group-hover:scale-100 transition-transform">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('सिधै हेर्नुहोस् (प्रिभ्यू)', 'Direct Preview')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Titles */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {note.titleNepali}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {note.titleEnglish}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {isEnglish ? (note.descriptionEnglish || note.descriptionNepali) : note.descriptionNepali}
                    </p>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{note.uploadedAt}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <ArrowDownToLine className="w-3 h-3 text-amber-400" />
                      <span>{note.downloadsCount || 0} {t('पटक डाउनलोड', 'downloads')}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  {/* Download Button (Primary) or View-Only button */}
                  {note.allowDownload === false ? (
                    <button
                      onClick={() => setPreviewNote(note)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700/80 border border-amber-500/30 text-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                      title={t('प्रशासकले डाउनलोड बन्द गरेको छ (सिधै अनलाइन हेर्नुहोस्)', 'Download locked by Admin - View online directly')}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('केवल हेर्न मिल्ने (प्रिभ्यू)', 'View Only (Preview)')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownloadClick(note)}
                      disabled={downloadingId === note.id}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-75 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                      title={t('तुरुन्त फाइल डाउनलोड गर्नुहोस्', 'Download File Now')}
                    >
                      {downloadingId === note.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('डाउनलोड हुँदैछ...', 'Downloading...')}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{t('डाउनलोड', 'Download')}</span>
                          <span className="text-[10px] font-mono opacity-90">({isPdf ? 'PDF' : 'JPG'})</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Direct Preview Button */}
                  <button
                    onClick={() => setPreviewNote(note)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                    title={t('सिधै हेर्नुहोस्', 'Direct Preview')}
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">{t('हेर्नुहोस्', 'View')}</span>
                  </button>

                  {/* Direct New Tab View Button */}
                  <button
                    onClick={() => openNoteInNewTab(note)}
                    className="bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white p-2.5 rounded-xl text-xs transition-colors shrink-0"
                    title={t('नयाँ ट्याबमा सिधै पूरै हेर्नुहोस्', 'Open directly in new tab')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={() => handlePrint(note)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-xl text-xs transition-colors shrink-0"
                    title={t('प्रिन्ट गर्नुहोस्', 'Print Document')}
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setNoteToDelete({ id: note.id, title: note.titleNepali || note.titleEnglish, fileName: note.fileName })}
                    className="bg-slate-800 hover:bg-rose-950/80 border border-slate-700/60 hover:border-rose-800/80 text-slate-400 hover:text-rose-400 p-2.5 rounded-xl text-xs transition-colors shrink-0 hover:scale-105 active:scale-95"
                    title={t('यो नोट मेटाउनुहोस्', 'Delete this note')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold">{downloadToast}</p>
        </div>
      )}

      {/* Interactive Document Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Top Bar */}
            <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                  {previewNote.fileType === 'pdf' ? <FileText className="w-5 h-5 text-rose-400" /> : <ImageIcon className="w-5 h-5 text-sky-400" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {previewNote.titleNepali}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {previewNote.fileName || previewNote.titleEnglish} • {previewNote.fileSize || 'Standard'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Image zoom controls */}
                {previewNote.fileType !== 'pdf' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 mr-2">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-300 font-mono px-1">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Open in New Tab Button */}
                <button
                  onClick={() => openNoteInNewTab(previewNote)}
                  className="bg-sky-600 hover:bg-sky-500 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  title={t('नयाँ ट्याबमा खोल्नुहोस्', 'Open in New Tab')}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('नयाँ ट्याब', 'New Tab')}</span>
                </button>

                {/* Print button */}
                <button
                  onClick={() => handlePrint(previewNote)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  title={t('प्रिन्ट गर्नुहोस्', 'Print')}
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('प्रिन्ट', 'Print')}</span>
                </button>

                {/* Download button or Locked status badge */}
                {previewNote.allowDownload === false ? (
                  <div 
                    className="bg-slate-800/90 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    title={t('प्रशासकले यो फाइलको डाउनलोड बन्द गरेको छ (केवल हेर्न मिल्ने)', 'Download is restricted by Admin (View Only)')}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">{t('डाउनलोड बन्द (केवल हेर्न मिल्ने)', 'View Only')}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownloadClick(previewNote)}
                    disabled={downloadingId === previewNote.id}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-70 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    {downloadingId === previewNote.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{t('डाउनलोड गर्नुहोस्', 'Download')}</span>
                  </button>
                )}

                {/* Delete button in preview modal */}
                <button
                  onClick={() => setNoteToDelete({ id: previewNote.id, title: previewNote.titleNepali || previewNote.titleEnglish, fileName: previewNote.fileName })}
                  className="bg-slate-800 hover:bg-rose-950/80 border border-slate-700/60 hover:border-rose-800/80 text-slate-400 hover:text-rose-400 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  title={t('यो नोट मेटाउनुहोस्', 'Delete this note')}
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">{t('मेटाउनुहोस्', 'Delete')}</span>
                </button>

                {/* Close modal */}
                <button
                  onClick={() => {
                    setPreviewNote(null);
                    setZoomLevel(1);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 flex items-center justify-center transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick helper banner for PDF / JPG viewing */}
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {previewNote.fileType === 'pdf' 
                  ? t('PDF सिधै यहाँ पढ्न सक्नुहुन्छ वा नयाँ ट्याबमा पूरै खोल्न सक्नुहुन्छ।', 'You can read this PDF directly here or open it full-size in a new tab.')
                  : t('JPG रेखाचित्र जुम गरी हेर्नुहोस् वा सिधै डाउनलोड गर्नुहोस्।', 'Zoom in on the JPG schematic or download directly.')}
              </span>
              <button
                onClick={() => openNoteInNewTab(previewNote)}
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
              >
                <span>{t('नयाँ ट्याबमा पूरै स्क्रिन हेर्नुहोस्', 'Open Fullscreen in New Tab')}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Modal Body: PDF object/iframe or Image Viewer */}
            <div className="flex-1 bg-slate-950 p-3 sm:p-4 overflow-auto flex items-center justify-center relative">
              {isLoadingPreview ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">
                    {t('फाइल लोड हुँदैछ, कृपया एकछिन पर्खनुहोस्...', 'Loading file preview, please wait...')}
                  </p>
                </div>
              ) : previewNote.fileType === 'pdf' ? (
                <div className="w-full h-full flex flex-col min-h-0">
                  <PdfDocumentViewer
                    fileUrl={previewBlobUrl || getNoteFileUrl(previewNote.id, previewNote.fileUrl)}
                    title={previewNote.titleNepali || previewNote.titleEnglish}
                    fileName={previewNote.fileName}
                    allowDownload={previewNote.allowDownload !== false}
                    onDownload={previewNote.allowDownload !== false ? () => handleDownloadClick(previewNote) : undefined}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                  <img
                    src={previewBlobUrl || getNoteFileUrl(previewNote.id, previewNote.fileUrl)}
                    alt={previewNote.titleNepali}
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer with details */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NITVT Surendra Air Official Authorized Material (Estd. 2064)</span>
              </span>
              <span className="truncate max-w-md">{previewNote.descriptionNepali}</span>
            </div>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Reliable in iframe without browser popups) */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {t('नोट हटाउने पुष्टि गर्नुहोस्', 'Confirm Delete Note')}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {t('यो कार्य रद्द गर्न सकिँदैन।', 'This action cannot be undone.')}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-slate-100">{noteToDelete.title}</p>
              {noteToDelete.fileName && (
                <p className="text-[11px] text-slate-400 font-mono">{noteToDelete.fileName}</p>
              )}
              <p className="text-[11px] text-rose-300/80 pt-1">
                {t(
                  'के तपाईं यो फाइल डाउनलोड सूचीबाट स्थायी रूपमा मेटाउन चाहनुहुन्छ?',
                  'Are you sure you want to permanently delete this file from the download list?'
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                disabled={isDeletingNote}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {t('रद्द गर्नुहोस्', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                disabled={isDeletingNote}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-60 transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-900/30"
              >
                {isDeletingNote ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('मेटाउँदै...', 'Deleting...')}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('निश्चित मेटाउनुहोस् (Delete)', 'Confirm Delete')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
