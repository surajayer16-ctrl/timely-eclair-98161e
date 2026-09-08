import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ne' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isNepali: boolean;
  isEnglish: boolean;
  t: (nepaliText: string, englishText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Built-in English translation dictionary for key phrases and terms across the platform
const DICTIONARY: Record<string, string> = {
  // Navigation & General
  'गृहपृष्ठ': 'Home',
  'तालिमहरू': 'Courses',
  'टेलीकम नोट': 'Telecom Note',
  'सफलताका कथाहरू': 'Success Stories',
  'ग्यालेरी': 'Gallery',
  'ब्लग': 'Blog & News',
  'मेरो बारेमा': 'About Instructor',
  'सिट सुरक्षित गर्नुहोस्': 'Book Your Seat',
  'नयाँ भर्ना': 'New Admission',
  'नयाँ भर्ना खुला (Apply)': 'Apply Online (Admissions Open)',
  'AI प्राविधिक गुरु': 'AI Telecom Tutor',
  'एडमिन / डाटाबेस': 'Admin / Database',
  'डिजिटल म्यानुअल हेर्नुहोस्': 'Explore Curriculum',
  'प्रयोगात्मक सिमुलेटर': 'Lab Simulators',
  'आजै सिट सुरक्षित गर्नुहोस्': 'Enroll Now',
  'अनलाइन सिट बुकिङ': 'Online Seat Booking',
  'आधिकारिक आवेदन फारम': 'Official Application Form',
  'सम्पूर्ण सिमुलेटरहरू खोल्नुहोस्': 'Open All Simulators',
  'सबै कोर्सहरू': 'All Courses',
  'अवधि (Duration)': 'Duration',
  'प्रयोगात्मक (Practical)': 'Hands-On Practical',
  'कसले लिने?': 'Who can enroll?',
  'रोजगारीको क्षेत्र': 'Job Prospects',
  'मुख्य तालिम सामग्री तथा सीपहरू:': 'Key Skills & Course Content:',
  'तह-१ म्यानुअल': 'Level-1 Manual',
  'तह-२ म्यानुअल': 'Level-2 Manual',
  'पाठ्यक्रम': 'Curriculum',
  'सुरेन्द्र ऐर (Surendra Air)': 'Surendra Air (NITVT)',
  '१९ वर्षको गौरवमय प्राविधिक इतिहास': '19+ Years of Technical Excellence',
  'CTEVT / NSTB मान्यता': 'CTEVT & NSTB Certified',
  '१००% प्रयोगात्मक पूर्वाधार': '100% Practical Field Labs',
  'रोजगारीको उच्च सम्भावना': 'High Employment Opportunities',
  'अनुभवी इन्जिनियर समूह': 'Expert Telecom Engineers',
  'भर्चुअल प्रयोगात्मक ल्याब': 'Virtual Engineering Lab',
  'फ्युजन स्प्लाइसिङ तथा कलर कोडिङ सिमुलेटर': 'Fusion Splicing & Color Code Simulator',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nitvt_language');
      if (saved === 'en' || saved === 'ne') return saved;
      return 'ne'; // Default to Nepali
    } catch {
      return 'ne';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('nitvt_language', lang);
      window.dispatchEvent(new CustomEvent('nitvt_language_changed', { detail: lang }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error saving language:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ne' ? 'en' : 'ne');
  };

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('nitvt_language');
        if (saved === 'en' || saved === 'ne') {
          setLanguageState(saved);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('nitvt_language_changed', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('nitvt_language_changed', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const t = (nepaliText: string, englishText?: string): string => {
    if (language === 'en') {
      if (englishText) return englishText;
      if (DICTIONARY[nepaliText]) return DICTIONARY[nepaliText];
      return nepaliText;
    }
    return nepaliText;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isNepali: language === 'ne',
        isEnglish: language === 'en',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      language: 'ne',
      setLanguage: () => {},
      toggleLanguage: () => {},
      isNepali: true,
      isEnglish: false,
      t: (ne: string, en: string) => ne,
    };
  }
  return context;
};
