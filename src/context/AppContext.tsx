'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VisaApiResponse } from '@/types/visa';

interface AppContextType {
  userPassportCountry: string | null;
  selectedDestination: string | null;
  showLegend: boolean;
  showCountryDetails: boolean;
  visaData: VisaApiResponse;
  isFirstClick: boolean; // true - выбираем страну назначения, false - страну паспорта
  setUserPassportCountry: (country: string | null) => void;
  setSelectedDestination: (country: string | null) => void;
  setShowLegend: (show: boolean) => void;
  setShowCountryDetails: (show: boolean) => void;
  setVisaData: (data: VisaApiResponse) => void;
  setIsFirstClick: (isFirst: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [userPassportCountry, setUserPassportCountry] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showCountryDetails, setShowCountryDetails] = useState(false);
  const [visaData, setVisaData] = useState<VisaApiResponse>({});
  const [isFirstClick, setIsFirstClick] = useState(true); // Начинаем с выбора страны паспорта

  const value = {
    userPassportCountry,
    selectedDestination,
    showLegend,
    showCountryDetails,
    visaData,
    isFirstClick,
    setUserPassportCountry,
    setSelectedDestination,
    setShowLegend,
    setShowCountryDetails,
    setVisaData,
    setIsFirstClick,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
