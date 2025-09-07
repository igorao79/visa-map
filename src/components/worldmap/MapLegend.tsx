'use client';

import React from 'react';
import { VISA_COLORS } from '@/types/visa';

interface MapLegendProps {
  userPassportCountry: string | null;
}

export default function MapLegend({ userPassportCountry }: MapLegendProps) {
  if (!userPassportCountry) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
      <p className="text-xs font-medium text-gray-700 mb-2">Легенда:</p>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VF }}></div>
          <span className="text-xs text-gray-600">Без визы</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VOA }}></div>
          <span className="text-xs text-gray-600">Виза по прилёту</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.EV }}></div>
          <span className="text-xs text-gray-600">Электронная виза</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VR }}></div>
          <span className="text-xs text-gray-600">Требуется виза</span>
        </div>
      </div>
    </div>
  );
}
