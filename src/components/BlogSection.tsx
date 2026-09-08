import React, { useState, useEffect } from 'react';
import { BlogPost, initialBlogPosts } from '../data/blogData';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Search, 
  Tag, 
  User, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  Eye, 
  Share2, 
  MessageSquare, 
  Sparkles, 
  Maximize2, 
  X, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  PlusCircle, 
  Check, 
  Bookmark, 
  TrendingUp,
  Award,
  Globe,
  Languages
} from 'lucide-react';

interface BlogSectionProps {
  onOpenEnrollment?: () => void;
  onOpenAiTutor?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenEnrollment, onOpenAiTutor }) => {
  const { language, setLanguage, t } = useLanguage();
  
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('nitvt_blog_posts');
      return saved ? JSON.parse(saved) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nitvt_blog_liked');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [comments, setComments] = useState<Record<string, Array<{ id: string; name: string; text: string; date: string }>>>(() => {
    try {
      const saved = localStorage.getItem('nitvt_blog_comments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Persist posts
  useEffect(() => {
    localStorage.setItem('nitvt_blog_posts', JSON.stringify(posts));
  }, [posts]);

  // Sync with external storage updates from Admin modal
  useEffect(() => {
    const handleBlogPostsUpdate = () => {
      try {
        const saved = localStorage.getItem('nitvt_blog_posts');
        if (saved !== null) {
          setPosts(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing blog posts:', err);
      }
    };

    window.addEventListener('nitvt_blog_posts_updated', handleBlogPostsUpdate);
    window.addEventListener('storage', handleBlogPostsUpdate);
    return () => {
      window.removeEventListener('nitvt_blog_posts_updated', handleBlogPostsUpdate);
      window.removeEventListener('storage', handleBlogPostsUpdate);
    };
  }, []);

  // Save liked posts
  useEffect(() => {
    localStorage.setItem('nitvt_blog_liked', JSON.stringify(likedPosts));
  }, [likedPosts]);

  // Save comments
  useEffect(() => {
    localStorage.setItem('nitvt_blog_comments', JSON.stringify(comments));
  }, [comments]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const categories = [
    { 
      id: 'all', 
      labelNepali: 'सबै समाचार तथा लेख', 
      labelEnglish: 'All Articles & News' 
    },
    { 
      id: 'optical_fiber', 
      labelNepali: 'अप्टिकल फाइबर (FTTH)', 
      labelEnglish: 'Optical Fiber (FTTH)' 
    },
    { 
      id: 'telecom', 
      labelNepali: 'टेलिकम इन्जिनियरिङ', 
      labelEnglish: 'Telecom Engineering' 
    },
    { 
      id: 'exams', 
      labelNepali: 'परीक्षा तथा तयारी', 
      labelEnglish: 'Exam Prep & Guides' 
    },
    { 
      id: 'ctevt_news', 
      labelNepali: 'CTEVT समाचार र अवसर', 
      labelEnglish: 'CTEVT News & Careers' 
    },
    { 
      id: 'tips', 
      labelNepali: 'प्राविधिक टिप्स', 
      labelEnglish: 'Technical Tips' 
    },
  ];

  const getPostTitle = (post: BlogPost) => {
    if (language === 'en' && post.titleEnglish) return post.titleEnglish;
    return post.titleNepali;
  };

  const getPostSummary = (post: BlogPost) => {
    if (language === 'en' && post.summaryEnglish) return post.summaryEnglish;
    return post.summaryNepali;
  };

  const getPostContent = (post: BlogPost) => {
    if (language === 'en' && post.contentEnglish) return post.contentEnglish;
    return post.contentNepali;
  };

  const getPostCategoryLabel = (post: BlogPost) => {
    if (language === 'en' && post.categoryLabelEnglish) return post.categoryLabelEnglish;
    return post.categoryLabel;
  };

  const getPostReadTime = (post: BlogPost) => {
    if (language === 'en' && post.readTimeEnglish) return post.readTimeEnglish;
    return post.readTime;
  };

  const getPostDate = (post: BlogPost) => {
    if (language === 'en' && post.dateEnglish) return post.dateEnglish;
    return post.date;
  };

  const getPostAuthorRole = (post: BlogPost) => {
    if (language === 'en' && post.authorRoleEnglish) return post.authorRoleEnglish;
    return post.authorRole;
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      post.titleNepali.toLowerCase().includes(query) ||
      (post.titleEnglish && post.titleEnglish.toLowerCase().includes(query)) ||
      post.summaryNepali.toLowerCase().includes(query) ||
      (post.summaryEnglish && post.summaryEnglish.toLowerCase().includes(query)) ||
      post.contentNepali.toLowerCase().includes(query) ||
      (post.contentEnglish && post.contentEnglish.toLowerCase().includes(query)) ||
      post.tags.some(t => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyLiked = !!likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, likes: isCurrentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1 };
        }
        return p;
      })
    );
  };

  const handleShare = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = window.location.href;
    const title = getPostTitle(post);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - NITVT Blog: ${shareUrl}`);
      setCopiedSlug(post.id);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const commentItem = {
      id: Date.now().toString(),
      name: newCommentName.trim() || (language === 'en' ? 'Telecom Participant' : 'प्राविधिक सहभागी'),
      text: newCommentText.trim(),
      date: language === 'en' ? new Date().toLocaleDateString('en-US') : new Date().toLocaleDateString('ne-NP'),
    };
    setComments(prev => ({
      ...prev,
      [postId]: [commentItem, ...(prev[postId] || [])]
    }));
    setNewCommentText('');
  };

  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'en' 
        ? 'Voice Text-to-Speech is not supported in your browser.' 
        : 'तपाईंको ब्राउजरमा Voice Text-to-Speech सुविधा उपलब्ध छैन।');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/#/g, '').replace(/---/g, '').replace(/\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (language === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
    } else {
      utterance.lang = 'ne-NP';
      utterance.rate = 0.9;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    // increment view count
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>NITVT Official Technical Blog & News Portal</span>
              </div>
              
              {/* Language Switcher Badge */}
              <div className="inline-flex items-center bg-slate-900/90 border border-slate-700 p-0.5 rounded-full text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage('ne')}
                  className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                    language === 'ne'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇳🇵</span>
                  <span>नेपाली</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                    language === 'en'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t('हाम्रो प्राविधिक ब्लग तथा समाचार (Our Blog)', 'Official Technical Blog & News Portal')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t(
                'नेपाल टेलिकम, अप्टिकल फाइबर (FTTH), CTEVT परीक्षा तयारी, सुरक्षा मापदण्ड तथा नवीनतम टेलिकम प्रविधि सम्बन्धी आधिकारिक लेख तथा गाइडहरू।',
                'Comprehensive guides, technical tutorials, CTEVT exam preparations, and industry updates on FTTH Optical Fiber, Telecom Engineering, and Safety Standards.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Language Toggle Button */}
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 p-1.5 rounded-2xl">
              <span className="text-xs text-slate-400 pl-2 font-medium flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('भाषा:', 'Language:')}</span>
              </span>
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'ne'
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                नेपाली (NP)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                English (EN)
              </button>
            </div>

            {onOpenAiTutor && (
              <button
                onClick={onOpenAiTutor}
                className="bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('AI गुरुसँग सोध्नुहोस्', 'Ask AI Tutor')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          {categories.map(cat => {
            const label = language === 'en' ? cat.labelEnglish : cat.labelNepali;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('ब्लग तथा समाचार खोज्नुहोस्...', 'Search articles & news...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* FEATURED BLOG POST (IF AVAILABLE & NO ACTIVE SEARCH/FILTER) */}
      {selectedCategory === 'all' && !searchQuery && featuredPost && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-6 relative overflow-hidden min-h-[260px] lg:min-h-full">
            <img
              src={featuredPost.imageUrl}
              alt={getPostTitle(featuredPost)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden" />
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('मुख्य विशेषता (Featured Post)', 'Featured Article')}</span>
            </span>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold px-2.5 py-0.5 rounded-lg">
                  {getPostCategoryLabel(featuredPost)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {getPostDate(featuredPost)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {getPostReadTime(featuredPost)}
                </span>
              </div>

              <h2 
                onClick={() => handleOpenPost(featuredPost)}
                className="text-xl sm:text-2xl font-black text-white hover:text-amber-300 cursor-pointer transition-colors leading-snug"
              >
                {getPostTitle(featuredPost)}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {getPostSummary(featuredPost)}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {featuredPost.tags.map((tag, i) => (
                  <span key={i} className="bg-slate-800/80 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  SA
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white leading-tight">{featuredPost.author}</p>
                  <p className="text-[10px] text-amber-400">{getPostAuthorRole(featuredPost)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPost(featuredPost)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
                >
                  <span>{t('पुरा लेख पढ्नुहोस्', 'Read Full Article')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOG POSTS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>
              {t('सबै प्रकाशित ब्लग तथा लेखहरू', 'All Published Articles & Insights')} ({filteredPosts.length})
            </span>
          </h3>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Search className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">
              {t('कुनै ब्लग लेख भेटिएन', 'No Articles Found')}
            </h4>
            <p className="text-xs text-slate-400">
              {t(
                'तपाईंले खोज्नुभएको विषय वा क्याटेगोरीमा लेख उपलब्ध छैन।',
                'No posts match your search query or selected category filter.'
              )}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="bg-slate-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-700"
            >
              {t('सबै ब्लगहरू हेर्नुहोस्', 'View All Articles')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const title = getPostTitle(post);
              const summary = getPostSummary(post);
              const categoryLabel = getPostCategoryLabel(post);
              const readTime = getPostReadTime(post);
              const date = getPostDate(post);

              return (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer" onClick={() => handleOpenPost(post)}>
                      <img
                        src={post.imageUrl}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {categoryLabel}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{readTime}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          {post.views} {t('पटक हेरियो', 'views')}
                        </span>
                      </div>

                      <h4
                        onClick={() => handleOpenPost(post)}
                        className="text-base font-bold text-white hover:text-amber-300 cursor-pointer transition-colors line-clamp-2 leading-snug"
                      >
                        {title}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {summary}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-slate-950 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleLike(post.id, e)}
                        className={`flex items-center gap-1 transition-colors ${
                          isLiked ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                        title={t('लाइक गर्नुहोस्', 'Like post')}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(post, e)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        title={t('लिङ्क प्रतिलिपि गर्नुहोस्', 'Copy share link')}
                      >
                        {copiedSlug === post.id ? (
                          <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{t('सेयर', 'Share')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenPost(post)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-xs pl-1"
                      >
                        <span>{t('पढ्नुहोस्', 'Read')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {getPostCategoryLabel(selectedPost)}
                </span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-300 hidden sm:inline">{getPostDate(selectedPost)}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch article language inside reader */}
                <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setLanguage('ne')}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      language === 'ne' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🇳🇵 NP
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>

                <button
                  onClick={() => handleReadAloud(getPostContent(selectedPost))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={language === 'en' ? 'Listen to Voice Reader' : 'आवाजमा सुन्नुहोस् (Voice Reader)'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span>{isSpeaking ? (language === 'en' ? 'Stop' : 'रोक्नुहोस्') : (language === 'en' ? 'Listen' : 'आवाजमा सुन्नुहोस्')}</span>
                </button>

                <button
                  onClick={() => {
                    if (isSpeaking) handleReadAloud('');
                    setSelectedPost(null);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 leading-relaxed font-sans">
              
              {/* Title & Author Info */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {getPostTitle(selectedPost)}
                </h2>

                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-800/80 py-3 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
                      SA
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{selectedPost.author}</p>
                      <p className="text-[11px] text-amber-400">{getPostAuthorRole(selectedPost)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {getPostReadTime(selectedPost)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      {selectedPost.views} {t('पटक हेरियो', 'views')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96">
                <img
                  src={selectedPost.imageUrl}
                  alt={getPostTitle(selectedPost)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Formatted Content */}
              <div className="space-y-4 text-sm sm:text-base text-slate-200 whitespace-pre-line leading-relaxed border-b border-slate-800 pb-6">
                {getPostContent(selectedPost)}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{t('सम्बन्धित विषयहरू:', 'Tags:')}</span>
                {selectedPost.tags.map((tItem, idx) => (
                  <span key={idx} className="bg-slate-800 text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700">
                    #{tItem}
                  </span>
                ))}
              </div>

              {/* Engagement Box */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleLike(selectedPost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      likedPosts[selectedPost.id]
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedPosts[selectedPost.id] ? 'fill-slate-950' : ''}`} />
                    <span>{t('सहमत / लाइक', 'Helpful / Like')} ({selectedPost.likes})</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(selectedPost, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedSlug === selectedPost.id ? 'Copied!' : t('सेयर गर्नुहोस्', 'Share')}</span>
                  </button>
                </div>

                {onOpenEnrollment && (
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      onOpenEnrollment();
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow transition-all"
                  >
                    {t('सिट सुरक्षित गर्नुहोस् (Enroll)', 'Join Training Batch')}
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>{t('प्रतिक्रिया तथा जिज्ञासा', 'Comments & Technical Discussion')} ({(comments[selectedPost.id] || []).length})</span>
                </h4>

                {/* Add comment box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={t('तपाईंको नाम (उदा: रमेश शर्मा)', 'Your Name (e.g. John Doe)')}
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder={t('यस लेख सम्बन्धी आफ्नो विचार वा प्रश्न लेख्नुहोस्...', 'Write your comments or questions regarding this topic...')}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleAddComment(selectedPost.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition-all"
                    >
                      {t('प्रतिक्रिया पठाउनुहोस्', 'Post Comment')}
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {(comments[selectedPost.id] || []).map((c) => (
                    <div key={c.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-bold text-amber-300">{c.name}</span>
                        <span className="text-[10px]">{c.date}</span>
                      </div>
                      <p className="text-slate-200">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
