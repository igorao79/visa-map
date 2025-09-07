'use client';

import React from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';

interface HeaderProps {
  showLegend: boolean;
  onToggleLegend: () => void;
}

export default function Header({ showLegend, onToggleLegend }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <AiOutlineGlobal className="inline mr-2" /> Карта визовых требований
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Узнайте визовые требования для путешествий по всему миру
            </p>
          </div>

          {/* Кнопка показа легенды */}
          <button
            onClick={onToggleLegend}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white
                     rounded-lg hover:bg-blue-700 transition-colors duration-200
                     shadow-sm hover:shadow-md text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{showLegend ? 'Скрыть легенду' : 'Показать легенду'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
