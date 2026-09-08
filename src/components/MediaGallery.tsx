import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Play, X, ExternalLink, Filter, Search, Grid, Eye, Video, ZoomIn, Camera, BookOpen, Wrench, MapPin, Plus, CheckCircle2, Upload } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { safeLocalStorageSet } from '../lib/imageCompressor';

export interface GalleryItem {
  id: string;
  title: string;
  titleEnglish: string;
  category: 'lab' | 'splicing' | 'outdoor' | 'video' | 'classroom';
  type: 'image' | 'video';
  thumbnailUrl: string;
  mediaUrl: string; // Image URL or YouTube embed URL
  description: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'अप्टिकल फाइबर फ्युजन स्प्लिसिङ अभ्यास',
    titleEnglish: 'Optical Fiber Fusion Splicing Practice',
    category: 'splicing',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    description: 'विद्यार्थीहरूद्वारा अत्याधुनिक Fusion Splicing Machine को प्रयोग गरेर कपर तथा सिंगल मोड फाइबर जोड्ने प्रत्यक्ष प्रयोगात्मक अभ्यास।'
  },
  {
    id: '2',
    title: 'फ्युजन स्प्लिसर कसरी चलाउने? (तालिम भिडियो)',
    titleEnglish: 'How to use Fusion Splicer (Training Video)',
    category: 'video',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://www.youtube.com/embed/5Wn3g6b_k80', // Educational fiber splicing video
    description: 'नेपाल इन्स्टिच्युट अफ टेक्निकल ट्रेनिङ (NITVT) को ल्याबमा फ्युजन स्प्लिसर मेसिन सुचारु गरी फाइबर कोर ताछ्ने, सफा गर्ने र स्लाइस गर्ने पूर्ण तरिका।'
  },
  {
    id: '3',
    title: 'सिभिल पोल इरेक्सन तथा एसेसरिज जडान',
    titleEnglish: 'Outdoor Pole Erection and Accessories Fitting',
    category: 'outdoor',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1200&q=80',
    description: 'आउटडोर ट्रेनिङ यार्डमा ८ मिटर र ७.५ मिटर स्टील पोल गाड्ने र त्यसमा डिस्ट्रीब्युसन ब्राकेट, स्टे वायर, र डी.पी. बक्स फिट गर्ने अभ्यास।'
  },
  {
    id: '4',
    title: 'OTDR र फाइबर फल्ट लोकलाइजेसन भिडियो ट्यूटोरियल',
    titleEnglish: 'OTDR & Fiber Fault Localization Video Tutorial',
    category: 'video',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://www.youtube.com/embed/rK3H1P_0fL8', // Educational OTDR testing video
    description: 'OTDR (Optical Time Domain Reflectometer) मिटर जडान गरी अप्टिकल केबल टुटफुट भएको (Fiber Cut) ठाउँ मिटरमै सटिक रूपमा पत्ता लगाउने विधि।'
  },
  {
    id: '5',
    title: 'केन्द्रीय ओ.टी.डी.आर (OTDR) तथा टेस्टिङ ल्याब',
    titleEnglish: 'Central OTDR & Testing Lab Station',
    category: 'lab',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    description: 'NITVT को केन्द्रीय ल्याबमा राखिएका फाइबर केबल रिङहरू, पावर मिटर (OPM), र लेजर सोर्स (VFL) को परीक्षण स्टेसन।'
  },
  {
    id: '6',
    title: 'टेलिकम टेक्निसियन सैद्धान्तिक क्लासरूम',
    titleEnglish: 'Telecom Technician Theory Classroom Sessions',
    category: 'classroom',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    description: 'सुरेन्द्र ऐर सरद्वारा २५-पेयर कपर कलर कोडिङ र ट्रान्समिसन सिद्धान्तहरू (Transmission Line Fundamentals) को विस्तृत व्याख्या।'
  },
  {
    id: '7',
    title: 'FTTH (Fiber To The Home) बक्स र स्पिलिटर जडान',
    titleEnglish: 'FTTH FDB Box & PLC Splitter Installation',
    category: 'lab',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    description: '१:८ र १:१६ PLC Splitter जडान गरी ग्राहकको घरसम्म हाई-स्पीड इन्टरनेट फाइबर बाँडफाँड गर्ने प्रयोगात्मक डिभाइस सेटअप।'
  },
  {
    id: '8',
    title: 'टेलिकम नेटवर्क र कलर कोडिङ गाइड (भिडियो)',
    titleEnglish: 'Telecom Network & Color Coding Masterclass',
    category: 'video',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://www.youtube.com/embed/gN3PGo17g-Q', // Color coding & copper network video
    description: '२५-पेयर कलर कोड र ५ मेजर (Major) तथा ५ माइनर (Minor) कलरहरूको सम्झिने सटिक सुत्र र प्रयोगात्मक कार्यदिशा भिडियो ट्यूटोरियल।'
  }
];

export const MediaGallery: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'lab' | 'splicing' | 'outdoor' | 'video' | 'classroom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState<Partial<GalleryItem>>({
    type: 'image',
    category: 'lab',
    title: '',
    titleEnglish: '',
    description: '',
    thumbnailUrl: '',
    mediaUrl: ''
  });
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_gallery');
      return saved ? JSON.parse(saved) : GALLERY_ITEMS;
    } catch {
      return GALLERY_ITEMS;
    }
  });

  const handleSaveNewMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title?.trim() || !newMedia.mediaUrl?.trim()) {
      alert('कृपया शीर्षक र तस्बिर/भिडियो छान्नुहोस्');
      return;
    }

    const itemToAdd: GalleryItem = {
      id: `media_${Date.now()}`,
      title: newMedia.title.trim(),
      titleEnglish: newMedia.titleEnglish?.trim() || newMedia.title.trim(),
      category: newMedia.category || 'lab',
      type: newMedia.type || 'image',
      thumbnailUrl: newMedia.thumbnailUrl?.trim() || newMedia.mediaUrl.trim(),
      mediaUrl: newMedia.mediaUrl.trim(),
      description: newMedia.description?.trim() || ''
    };

    const updated = [itemToAdd, ...galleryItems];
    setGalleryItems(updated);
    safeLocalStorageSet('nitvt_gallery', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nitvt_gallery_updated'));

    setIsUploadModalOpen(false);
    setNewMedia({
      type: 'image',
      category: 'lab',
      title: '',
      titleEnglish: '',
      description: '',
      thumbnailUrl: '',
      mediaUrl: ''
    });
    setUploadSuccessMsg('✓ नयाँ फोटो/भिडियो सफलतापुर्वक ग्यालरीमा थपियो!');
    setTimeout(() => setUploadSuccessMsg(''), 5000);
  };

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('nitvt_gallery');
        if (saved) {
          setGalleryItems(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error parsing gallery updates from localStorage:', e);
      }
    };
    window.addEventListener('nitvt_gallery_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nitvt_gallery_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8" id="media-gallery-container">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold text-amber-400 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-800/60 shadow-md">
          तालिम र ल्याबका महत्वपूर्ण झलकहरू
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          फोटो र भिडियो ग्यालरी (Media Gallery)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          NITVT को अप्टिकल फाइबर ल्याब, फ्युजन स्प्लिसिङ अभ्यास, आउटडोर पोल फिटिङ र हाम्रा विद्यार्थीहरूले गर्ने प्रत्यक्ष प्राविधिक कार्यहरूका सुन्दर तस्बिरहरू तथा शैक्षिक भिडियो सामग्रीहरू।
        </p>
      </div>

      {/* Control Panel: Filters, Search & Upload */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>सबै (All)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'lab'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>ल्याब (Lab)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('splicing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'splicing'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>स्प्लिसिङ (Splicing)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('outdoor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'outdoor'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>आउटडोर (Outdoor)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('classroom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'classroom'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>क्लासरूम (Theory)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'video'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-slate-850 bg-amber-950/20'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>तालिम भिडियोहरू (Videos)</span>
          </button>
        </div>

        {/* Search Input & Upload Action */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="ग्यालरी खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all flex-shrink-0 cursor-pointer"
            title="नयाँ फोटो वा भिडियो ग्यालरीमा अपलोड गर्नुहोस्"
          >
            <Plus className="w-4 h-4" />
            <span>अपलोड (Upload)</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{uploadSuccessMsg}</span>
        </motion.div>
      )}

      {/* Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-900 rounded-3xl space-y-3">
          <Filter className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">कुनै मिडिया भेटिएन</h3>
          <p className="text-xs text-slate-500">तपाईंको सर्च वा फिल्टर परिवर्तन गरेर पुन: प्रयास गर्नुहोस्।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`media-card-${item.id}`}
              whileHover={{ y: -6 }}
              onClick={() => setActiveMedia(item)}
              className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-950 flex-shrink-0">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Overlay with indicator */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-slate-900/90 border border-slate-700/60 p-3 rounded-full shadow-xl">
                    {item.type === 'video' ? (
                      <Play className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
                    ) : (
                      <ZoomIn className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                </div>

                {/* Badge Indicator */}
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                    item.type === 'video'
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {item.type === 'video' ? 'VIDEO' : 'IMAGE'}
                  </span>
                  <span className="bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-800">
                    {item.category === 'lab' && 'Lab'}
                    {item.category === 'splicing' && 'Splicing'}
                    {item.category === 'outdoor' && 'Outdoor'}
                    {item.category === 'classroom' && 'Theory'}
                    {item.category === 'video' && 'Video Guide'}
                  </span>
                </div>
              </div>

              {/* Media Content Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                    {item.titleEnglish}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>पूर्ण हेर्नुहोस्</span>
                  </span>
                  <span className="text-amber-500 group-hover:underline">हेर्नुहोस् ↗</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox / Full-Screen View Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row"
            >
              {/* Media Block Left */}
              <div className="flex-1 bg-slate-950 relative aspect-video md:aspect-auto md:min-h-[420px] flex items-center justify-center">
                {activeMedia.type === 'video' ? (
                  activeMedia.mediaUrl.includes('youtube.com') || activeMedia.mediaUrl.includes('youtu.be') || activeMedia.mediaUrl.includes('/embed/') ? (
                    <iframe
                      title={activeMedia.title}
                      src={activeMedia.mediaUrl.includes('?') ? `${activeMedia.mediaUrl}&autoplay=1` : `${activeMedia.mediaUrl}?autoplay=1`}
                      className="w-full h-full min-h-[300px] md:min-h-[420px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      src={activeMedia.mediaUrl}
                      className="w-full h-full min-h-[300px] md:min-h-[420px] bg-black object-contain"
                    />
                  )
                ) : (
                  <img
                    src={activeMedia.mediaUrl}
                    alt={activeMedia.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain max-h-[500px]"
                  />
                )}
                
                {/* Close Button on Mobile */}
                <button
                  onClick={() => setActiveMedia(null)}
                  className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full border border-slate-700 md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Meta details right */}
              <div className="p-6 md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/40">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                      activeMedia.type === 'video'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {activeMedia.type === 'video' ? 'VIDEO GUIDE' : 'LAB PHOTO'}
                    </span>
                    <button
                      onClick={() => setActiveMedia(null)}
                      className="hidden md:flex items-center justify-center bg-slate-950 hover:bg-slate-850 border border-slate-850 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-base font-extrabold text-white leading-snug">
                      {activeMedia.title}
                    </h2>
                    <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                      {activeMedia.titleEnglish}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeMedia.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-850 space-y-3">
                  <div className="text-[10px] text-slate-500">
                    Category: <span className="text-slate-300 font-bold capitalize">{activeMedia.category}</span>
                  </div>
                  <button
                    onClick={() => setActiveMedia(null)}
                    className="w-full bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white font-bold py-2.5 rounded-xl text-xs border border-slate-800 transition-colors"
                  >
                    बन्द गर्नुहोस् (Close)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Upload Media Modal */}
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsUploadModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">ग्यालरीमा तस्बिर / भिडियो थप्नुहोस्</h2>
                    <p className="text-[10px] text-slate-400">NITVT Media Gallery Upload</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewMedia} className="p-5 space-y-4">
                {/* Media Type & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">मिडिया प्रकार (Type)</label>
                    <select
                      value={newMedia.type || 'image'}
                      onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as 'image' | 'video' })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="image">तस्बिर / फोटो (Photo)</option>
                      <option value="video">भिडियो (Video / Embed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">विधा / क्याटलग (Category)</label>
                    <select
                      value={newMedia.category || 'lab'}
                      onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="lab">ल्याब (Lab)</option>
                      <option value="splicing">स्प्लिसिङ (Splicing)</option>
                      <option value="outdoor">आउटडोर (Outdoor)</option>
                      <option value="classroom">क्लासरूम (Theory)</option>
                      <option value="video">भिडियो (Video)</option>
                    </select>
                  </div>
                </div>

                {/* Title Nepali */}
                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">
                    शीर्षक (नेपालीमा) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: अप्टिकल फाइबर स्प्लिसिङ तथा ट्रे ओटिङ..."
                    value={newMedia.title || ''}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Title English */}
                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">Title (English - Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Fiber Splicing & Tray Routing Session..."
                    value={newMedia.titleEnglish || ''}
                    onChange={(e) => setNewMedia({ ...newMedia, titleEnglish: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Image or Video Uploader */}
                {newMedia.type === 'image' ? (
                  <ImageUploader
                    label="तस्बिर छान्नुहोस् वा अपलोड गर्नुहोस् (Select / Upload Photo)"
                    currentImageUrl={newMedia.mediaUrl || ''}
                    onImageUploaded={(url) => setNewMedia({ ...newMedia, mediaUrl: url, thumbnailUrl: url })}
                    onImageRemoved={() => setNewMedia({ ...newMedia, mediaUrl: '', thumbnailUrl: '' })}
                    maxWidth={1200}
                    maxHeight={1000}
                    aspectRatio="video"
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">
                        YouTube Embed / Video Link वा URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/embed/... वा भिडियो लिङ्क"
                        value={newMedia.mediaUrl || ''}
                        onChange={(e) => setNewMedia({ ...newMedia, mediaUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                    <ImageUploader
                      label="भिडियोको थम्बनेल तस्बिर (Video Thumbnail)"
                      currentImageUrl={newMedia.thumbnailUrl || ''}
                      onImageUploaded={(url) => setNewMedia({ ...newMedia, thumbnailUrl: url })}
                      onImageRemoved={() => setNewMedia({ ...newMedia, thumbnailUrl: '' })}
                      maxWidth={640}
                      maxHeight={360}
                      aspectRatio="video"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">विवरण (Description - Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="तस्बिर वा भिडियोको संक्षिप्त प्राविधिक विवरण..."
                    value={newMedia.description || ''}
                    onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    रद्द गर्नुहोस् (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                  >
                    ग्यालरीमा थप्नुहोस् (Save to Gallery)
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
