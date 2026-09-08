import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2, RefreshCw, Link as LinkIcon, Sparkles } from 'lucide-react';
import { uploadImageToServerOrBase64, isImageFile } from '../lib/imageCompressor';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  label?: string;
  description?: string;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  label = 'तस्बिर अपलोड गर्नुहोस् (Upload Photo)',
  description = 'JPG, PNG, WebP, GIF फाइलहरू स्वतः कम्प्रेस भएर छिटो लोड हुने ढाँचामा सेभ हुन्छन्।',
  maxWidth = 900,
  maxHeight = 900,
  aspectRatio = 'auto',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!isImageFile(file)) {
      setErrorMessage('कृपया मान्य तस्बिर फाइल (JPG, PNG, WebP, GIF) छान्नुहोस्।');
      return;
    }

    // Limit extreme files > 25MB before reading
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('तस्बिर धेरै ठूलो छ (२५ MB भन्दा धेरै)। कृपया सानो फोटो प्रयोग गर्नुहोस्।');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Uploading image...', file);
      const result = await uploadImageToServerOrBase64(file, maxWidth, maxHeight);
      console.log('Upload result:', result);
      onImageUploaded(result.url);
      setManualUrl(result.url);
      setSuccessInfo(`✓ सफलतापुर्वक अपलोड भयो (${result.sizeKb} KB)`);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMessage(err.message || 'तस्बिर प्रोसेस गर्दा समस्या आयो। कृपया पुन: प्रयास गर्नुहोस्।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleManualUrlApply = () => {
    if (manualUrl.trim()) {
      onImageUploaded(manualUrl.trim());
      setSuccessInfo('✓ तस्बिर लिङ्क सफलतापुर्वक सेट भयो');
      setErrorMessage(null);
    }
  };

  const handleRemove = () => {
    if (onImageRemoved) {
      onImageRemoved();
    } else {
      onImageUploaded('');
    }
    setManualUrl('');
    setSuccessInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[160px]'
      : aspectRatio === 'video'
      ? 'aspect-video max-w-[240px]'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4] max-w-[140px]'
      : 'max-h-48 max-w-[240px]';

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Helper */}
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-slate-400 hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'अपलोड बक्स हेर्नुहोस्' : 'वेब लिङ्क (URL) राख्नुहोस्'}</span>
        </button>
      </div>

      {/* Manual URL Input if toggled */}
      {showUrlInput && (
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... वा तस्बिरको लिङ्क"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 font-mono outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleManualUrlApply}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
          >
            लागू गर्नुहोस्
          </button>
        </div>
      )}

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-3 sm:p-4 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/20'
            : currentImageUrl
            ? 'border-emerald-600/40 bg-slate-950'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/70'
        }`}
      >
        {isUploading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-blue-400">तस्बिर प्रोसेस तथा कम्प्रेस हुँदैछ...</p>
            <p className="text-[10px] text-slate-400">कृपया केही सेकेन्ड पर्खनुहोस्</p>
          </div>
        ) : currentImageUrl ? (
          /* Preview Mode */
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className={`relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 ${aspectClass}`}>
              <img
                src={currentImageUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1 right-1 bg-emerald-950/80 border border-emerald-500/60 rounded-full p-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
                <span className="text-2xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  तस्बिर लोड भयो
                </span>
                {successInfo && (
                  <span className="text-2xs text-slate-300 font-mono">
                    {successInfo}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>अर्को तस्बिर बदल्नुहोस्</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-semibold px-2.5 py-1.5 rounded-xl inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हटाउनुहोस्</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Upload Trigger */
          <div className="text-center py-4 sm:py-6 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-200">
                तस्बिर यहाँ तानेर ल्याउनुहोस् (Drag & Drop) वा तल छान्नुहोस्
              </p>
              <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-blue-950/50 hover:shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>कम्प्युटरबाट फोटो छान्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl inline-flex items-center gap-1.5 border border-slate-700 cursor-pointer sm:hidden"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>क्यामेरा खोल्नुहोस्</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileProcess(file);
          }}
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileProcess(file);
          }}
        />
      </div>

      {/* Error / Success Feedback */}
      {errorMessage && (
        <div className="bg-rose-950/70 border border-rose-800/80 rounded-xl p-2.5 flex items-start gap-2 text-rose-300 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">त्रुटि: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
