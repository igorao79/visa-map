'use client';

import React from 'react';
import { AiOutlineHome, AiOutlineReload } from 'react-icons/ai';
import * as d3Selection from 'd3-selection';

interface MapZoomControlsProps {
  onResetZoom: () => void;
  onCenterMap: () => void;
}

export default function MapZoomControls({ onResetZoom, onCenterMap }: MapZoomControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
      <button
        onClick={onResetZoom}
        className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
        title="Сбросить масштаб"
      >
        <AiOutlineReload className="inline mr-1" /> Сброс
      </button>
      <button
        onClick={onCenterMap}
        className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
        title="Обычный масштаб"
      >
        <AiOutlineHome className="inline mr-1" /> Центр
      </button>
    </div>
  );
}
