import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, 
  Download, Loader2, AlertTriangle, FileText, Maximize2, Minimize2,
  BookOpen, Layers, Lock
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfDocumentViewerProps {
  /** Can be a base64 data URI (data:application/pdf;base64,...), blob: URL, or public file URL */
  fileUrl: string;
  title: string;
  fileName?: string;
  onDownload?: () => void;
  allowDownload?: boolean;
}

interface PageRenderTask {
  pageNumber: number;
  canvas: HTMLCanvasElement;
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  fileUrl,
  title,
  fileName,
  onDownload,
  allowDownload = true,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('scroll');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const activeRenderTasks = useRef<Map<number, any>>(new Map());

  // Convert source URL or Data URI to Uint8Array safely
  const getPdfData = useCallback(async (src: string): Promise<Uint8Array> => {
    if (src.startsWith('data:')) {
      const base64Index = src.indexOf(';base64,');
      let base64 = '';
      if (base64Index !== -1) {
        base64 = src.substring(base64Index + 8);
      } else {
        const commaIndex = src.indexOf(',');
        base64 = commaIndex !== -1 ? src.substring(commaIndex + 1) : src;
      }
      const binaryString = atob(base64.trim());
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } else {
      const res = await fetch(src);
      const buffer = await res.arrayBuffer();
      return new Uint8Array(buffer);
    }
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadDoc = async () => {
      try {
        if (!fileUrl) {
          throw new Error('PDF file URL is missing.');
        }

        const data = await getPdfData(fileUrl);
        let doc: pdfjsLib.PDFDocumentProxy;

        try {
          const loadingTask = pdfjsLib.getDocument({
            data,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@6.3.289/cmaps/',
            cMapPacked: true,
          });
          doc = await loadingTask.promise;
        } catch (initialErr) {
          console.warn('Primary worker load failed, trying cdnjs fallback worker:', initialErr);
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const retryTask = pdfjsLib.getDocument({
            data,
          });
          doc = await retryTask.promise;
        }

        if (!isMounted) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to load PDF document with pdfjs-dist:', err);
        if (isMounted) {
          setError(err?.message || 'PDF फाइल खोल्न सकिएन।');
          setLoading(false);
        }
      }
    };

    loadDoc();

    return () => {
      isMounted = false;
      // Cancel active renders
      activeRenderTasks.current.forEach((task) => {
        try {
          task.cancel();
        } catch (_) {}
      });
      activeRenderTasks.current.clear();
      if (pdfDocRef.current) {
        try {
          pdfDocRef.current.destroy();
        } catch (_) {}
      }
    };
  }, [fileUrl, getPdfData]);

  // Render a specific page to its canvas
  const renderPage = useCallback(
    async (pageNumber: number, canvas: HTMLCanvasElement) => {
      const doc = pdfDocRef.current;
      if (!doc || !canvas) return;

      // Cancel existing render on this page if in progress
      if (activeRenderTasks.current.has(pageNumber)) {
        try {
          activeRenderTasks.current.get(pageNumber).cancel();
        } catch (_) {}
        activeRenderTasks.current.delete(pageNumber);
      }

      try {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        // Account for high-DPI displays for ultra-crisp text
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        activeRenderTasks.current.set(pageNumber, renderTask);

        await renderTask.promise;
        activeRenderTasks.current.delete(pageNumber);
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`Render error on page ${pageNumber}:`, err);
        }
      }
    },
    [scale]
  );

  // Render pages whenever doc, scale, currentPage, or viewMode changes
  useEffect(() => {
    if (!pdfDocRef.current || loading) return;

    if (viewMode === 'single') {
      const canvas = canvasRefs.current.get(currentPage);
      if (canvas) {
        renderPage(currentPage, canvas);
      }
    } else {
      // Scroll mode: render visible pages
      for (let p = 1; p <= numPages; p++) {
        const canvas = canvasRefs.current.get(p);
        if (canvas) {
          renderPage(p, canvas);
        }
      }
    }
  }, [loading, numPages, currentPage, scale, viewMode, renderPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(2.5, +(prev + 0.2).toFixed(2)));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.6, +(prev - 0.2).toFixed(2)));
  };

  const handleResetZoom = () => {
    setScale(1.15);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative select-none"
    >
      {/* Top Toolbar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        {/* Document Title & Badge */}
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white truncate" title={title}>
              {title}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {fileName || 'CTEVT_Telecom_Manual.pdf'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'scroll'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="सबै पानाहरू निरन्तर स्क्रोल गरी हेर्नुहोस् (Continuous Scroll)"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">स्क्रोल</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'single'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="एक पटकमा एक पाना मात्र हेर्नुहोस् (Single Page)"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">एकल पाना</span>
            </button>
          </div>

          {/* Page Navigation (Single Page Mode or Page Indicator) */}
          {numPages > 0 && (
            <div className="flex items-center bg-slate-800/90 rounded-xl px-2 py-1 border border-slate-700/60 text-xs text-slate-300 gap-1">
              {viewMode === 'single' && (
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-colors text-white"
                  title="अघिल्लो पाना"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="font-mono text-[11px] px-1 font-bold text-slate-200">
                {viewMode === 'single' ? `${currentPage} / ${numPages}` : `${numPages} पानाहरू`}
              </span>
              {viewMode === 'single' && (
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-colors text-white"
                  title="पछिल्लो पाना"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/90 rounded-xl px-1.5 py-1 border border-slate-700/60 text-xs gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="जुम घटाउनुहोस्"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-slate-300 w-9 text-center font-bold">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="जुम बढाउनुहोस्"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="रिसेट जुम"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors hidden md:flex items-center justify-center"
            title={isFullscreen ? 'सामान्य स्क्रिन' : 'फुलस्क्रिन हेर्नुहोस्'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Direct Download Button or Locked Badge */}
          {allowDownload === false ? (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium"
              title="प्रशासकद्वारा डाउनलोड निषेध गरिएको छ (केवल हेर्न मिल्ने)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">केवल हेर्न मिल्ने</span>
            </div>
          ) : onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/30"
              title="यो PDF फाइल सिधै डाउनलोड गर्नुहोस्"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">डाउनलोड</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main PDF Rendering Canvas Area */}
      <div className="flex-1 w-full overflow-auto bg-slate-900/60 p-4 flex flex-col items-center justify-start min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-white">PDF म्यानुअल सिधै लोड हुँदैछ...</p>
              <p className="text-xs text-slate-400">कृपया केही सेकेन्ड पर्खनुहोस्।</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md w-full my-auto bg-slate-900 border border-rose-500/40 p-6 rounded-3xl text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">PDF लोड गर्दा समस्या आयो</h4>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>फाइल डाउनलोड गरी खोल्नुहोस्</span>
              </button>
            )}
          </div>
        )}

        {!loading && !error && numPages > 0 && (
          <div className="w-full flex flex-col items-center space-y-6">
            {viewMode === 'scroll' ? (
              // All Pages continuous scroll
              Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <div
                    key={`page-${pageNum}`}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div className="shadow-2xl rounded-lg overflow-hidden bg-white border border-slate-700/60 transition-transform duration-150">
                      <canvas
                        ref={(el) => {
                          if (el) canvasRefs.current.set(pageNum, el);
                          else canvasRefs.current.delete(pageNum);
                        }}
                        className="block max-w-full"
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                      पाना {pageNum} / {numPages}
                    </div>
                  </div>
                );
              })
            ) : (
              // Single Page Mode
              <div className="flex flex-col items-center space-y-2">
                <div className="shadow-2xl rounded-lg overflow-hidden bg-white border border-slate-700/60">
                  <canvas
                    ref={(el) => {
                      if (el) canvasRefs.current.set(currentPage, el);
                      else canvasRefs.current.delete(currentPage);
                    }}
                    className="block max-w-full"
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  पाना {currentPage} / {numPages}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
