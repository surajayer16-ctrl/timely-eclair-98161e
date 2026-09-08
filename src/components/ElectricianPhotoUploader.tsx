import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link,
  Trash2,
  Check,
  Eye,
  X,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { compressAndProcessImage } from '../lib/imageCompressor';
import { saveImageToIndexedDb } from '../lib/fileStorageDb';

interface ElectricianPhotoUploaderProps {
  label: string;
  imageUrl?: string;
  imageCaption?: string;
  onImageChange: (url: string) => void;
  onCaptionChange?: (caption: string) => void;
  onRemove: () => void;
  aspectRatio?: 'video' | 'square' | 'auto';
  suggestedPresets?: { label: string; url: string }[];
}

export const ElectricianPhotoUploader: React.FC<ElectricianPhotoUploaderProps> = ({
  label,
  imageUrl,
  imageCaption = '',
  onImageChange,
  onCaptionChange,
  onRemove,
  aspectRatio = 'auto',
  suggestedPresets = []
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>(imageUrl || '');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and optimize image to keep localStorage lightweight (< 45KB) and save to IndexedDB
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया तस्विर (Image) फाइल मात्र चयन गर्नुहोस् (JPG, PNG, WebP, SVG)।');
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressAndProcessImage(file, 850, 850, 0.78);
      onImageChange(compressedDataUrl);
      setUrlInput(compressedDataUrl);

      // Save to IndexedDB permanent store
      const imgKey = `elec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await saveImageToIndexedDb(imgKey, compressedDataUrl);
    } catch (err: any) {
      console.error('Electrician photo processing failed:', err);
      alert('तस्विर प्रोसेस गर्दा त्रुटि भयो। कृपया अर्को तस्बिर छान्नुहोस्।');
    } finally {
      setIsProcessing(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onImageChange(urlInput.trim());
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              activeMode === 'upload'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>फोटो अपलोड</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              activeMode === 'url'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>लिङ्क (URL)</span>
          </button>
        </div>
      </div>

      {/* When Image Exists */}
      {imageUrl ? (
        <div className="space-y-2.5">
          <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 max-h-64 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={imageCaption || 'Uploaded Photo'}
              className={`w-full object-contain max-h-56 ${
                aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square' : ''
              }`}
            />
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => setPreviewZoom(true)}
                className="p-2 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-cyan-500/30"
                title="फोटो ठूलो पारी हेर्नुहोस्"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>ठूलो हेर्नुहोस्</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-slate-800/90 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-500/30"
                title="फोटो फेर्नुहोस्"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>फेर्नुहोस्</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                title="फोटो हटाउनुहोस्"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>हटाउनुहोस्</span>
              </button>
            </div>
          </div>

          {/* Caption Input */}
          {onCaptionChange && (
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                तस्विरको क्याप्सन / विवरण (Image Caption)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => onCaptionChange(e.target.value)}
                placeholder="उदा: २-वे स्विच वाइरिङको प्रयोगात्मक रेखाचित्र तथा कनेक्सन"
                className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>
      ) : (
        /* No Image Yet - Upload or URL inputs */
        <div className="space-y-2.5">
          {activeMode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-700 hover:border-amber-500/50 hover:bg-slate-900/60 bg-slate-950/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  {isProcessing ? 'तस्विर प्रोसेसिङ हुँदैछ...' : 'यहाँ क्लिक गरी डिभाइसबाट फोटो छान्नुहोस्'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  वा फोटो यहाँ तानेर ल्याउनुहोस् (JPG, PNG, WebP, SVG)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... वा वेब फोटो लिङ्क पेस्ट गर्नुहोस्"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>राख्नुहोस्</span>
              </button>
            </div>
          )}

          {/* Suggested Preset Technical Diagrams if provided */}
          {suggestedPresets.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>नमूना डायग्राम वा फोटो छनौट गर्नुहोस्:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      onImageChange(preset.url);
                      setUrlInput(preset.url);
                      if (onCaptionChange && !imageCaption) {
                        onCaptionChange(preset.label);
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-750 rounded-lg text-[10px] font-medium"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Size Zoom Modal */}
      {previewZoom && imageUrl && (
        <div
          className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewZoom(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-3 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewZoom(false)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 shadow z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={imageUrl}
              alt={imageCaption || 'Full view'}
              className="max-h-[78vh] w-auto object-contain rounded-2xl"
            />
            {imageCaption && (
              <p className="text-xs text-slate-300 font-medium text-center mt-3 px-4 py-1 bg-slate-950/80 rounded-xl border border-slate-800">
                {imageCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
