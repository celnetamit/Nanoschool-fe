'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CompareMentor {
  id: string;
  name: string;
  image: string;
  designation: string;
  organization: string;
  country: string;
  experience: string;
  domain: string;
  skills: string[];
}

interface ComparisonContextType {
  compared: CompareMentor[];
  toggle: (mentor: CompareMentor) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
}

const ComparisonContext = createContext<ComparisonContextType>({
  compared: [],
  toggle: () => {},
  isSelected: () => false,
  clear: () => {},
});

const STORAGE_KEY = 'ns_comparison';
const MAX_COMPARE = 4;

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [compared, setCompared] = useState<CompareMentor[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompared(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compared));
    } catch {}
  }, [compared]);

  const toggle = useCallback((mentor: CompareMentor) => {
    setCompared(prev => {
      const exists = prev.find(m => m.id === mentor.id);
      if (exists) {
        return prev.filter(m => m.id !== mentor.id);
      }
      if (prev.length >= MAX_COMPARE) {
        // Max 4 mentors — remove oldest and add new
        return [...prev.slice(1), mentor];
      }
      return [...prev, mentor];
    });
  }, []);

  const isSelected = useCallback((id: string) => compared.some(m => m.id === id), [compared]);

  const clear = useCallback(() => setCompared([]), []);

  return (
    <ComparisonContext.Provider value={{ compared, toggle, isSelected, clear }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => useContext(ComparisonContext);
