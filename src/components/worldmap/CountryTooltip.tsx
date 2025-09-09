'use client';

import React from 'react';
import { VisaApiResponse } from '@/types/visa';
import { COUNTRIES } from '@/lib/countries';

interface CountryTooltipProps {
  hoveredCountry: string | null;
  tooltipPosition: { x: number; y: number } | null;
  visaData: VisaApiResponse;
  getVisaStatusText: (status: string) => string;
}

// Функция для получения названия страны по коду
const getCountryName = (countryCode: string): string => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.name || countryCode;
};

export default function CountryTooltip({
  hoveredCountry,
  tooltipPosition,
  visaData,
  getVisaStatusText
}: CountryTooltipProps) {
  if (!hoveredCountry || !tooltipPosition) {
    return null;
  }

  return (
    <div
      className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-40 pointer-events-none text-sm"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'translate(-50%, -120%)'
      }}
    >
      <div className="font-medium">
        {getCountryName(hoveredCountry)} {/* Название страны */}
      </div>
      {visaData[hoveredCountry] && (
        <div className="text-xs opacity-90">
          {getVisaStatusText(visaData[hoveredCountry])}
        </div>
      )}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );
}

