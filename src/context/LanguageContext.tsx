'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LocalizedLocationContent, UITranslations } from '@/types/language';
import { CHAPTER_NAMES, LOCALIZED_LOCATIONS, UI_TRANSLATIONS } from '@/data/translations';
import { ravanaLocations } from '@/data/ravanaLocations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: UITranslations;
  getChapterName: (chapter: string) => string;
  getLocationContent: (locationId: string) => LocalizedLocationContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'ravana_trail_language_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'si' || saved === 'hi') {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  };

  const t = UI_TRANSLATIONS[language];

  const getChapterName = (chapter: string): string => {
    return CHAPTER_NAMES[language][chapter] || chapter;
  };

  const getLocationContent = (locationId: string): LocalizedLocationContent => {
    const localized = LOCALIZED_LOCATIONS[locationId]?.[language];
    const fallbackLoc = ravanaLocations.find((l) => l.id === locationId);

    if (localized) {
      return {
        ...localized,
        imageUrl: fallbackLoc?.imageUrl || localized.imageUrl || '',
        imageAlt: fallbackLoc?.imageAlt || localized.imageAlt || '',
        gallery: fallbackLoc?.gallery || localized.gallery || [],
      };
    }
    // Fallback to original English values from ravanaLocations
    return {
      title: fallbackLoc?.title || locationId,
      subTitle: fallbackLoc?.sinhalaTitle || '',
      district: fallbackLoc?.district || '',
      difficulty: fallbackLoc?.difficulty || 'Moderate',
      bestTime: fallbackLoc?.bestTime || '',
      story: fallbackLoc?.story || '',
      archaeologyNote: fallbackLoc?.archaeologyNote || '',
      folkloreNote: fallbackLoc?.folkloreNote || '',
      highlights: fallbackLoc?.highlights || [],
      imageUrl: fallbackLoc?.imageUrl || '',
      imageAlt: fallbackLoc?.imageAlt || '',
      gallery: fallbackLoc?.gallery || [],
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getChapterName,
        getLocationContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
