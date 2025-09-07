'use client';

import React from 'react';
import WorldMap from '@/components/WorldMap';
import MapControls from './MapControls';
import { VisaApiResponse } from '@/types/visa';

interface MapContainerProps {
  selectedCountry: string | null;
  userPassportCountry: string | null;
  visaData: VisaApiResponse;
  isFirstClick: boolean;
  onCountryClick: (countryCode: string) => void;
}

export default function MapContainer({
  selectedCountry,
  userPassportCountry,
  visaData,
  isFirstClick,
  onCountryClick
}: MapContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Карта всегда видна для тестирования */}
      <div className="relative" style={{ height: '500px' }}>
        <WorldMap
          selectedCountry={selectedCountry}
          userPassportCountry={userPassportCountry}
          visaData={visaData}
          isFirstClick={isFirstClick}
          onCountryClick={onCountryClick}
        />

        <MapControls
          isFirstClick={isFirstClick}
          userPassportCountry={userPassportCountry}
          selectedCountry={selectedCountry}
          onResetZoom={() => {}}
          onResetToDefault={() => {}}
        />
      </div>
    </div>
  );
}
