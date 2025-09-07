'use client';

import React from 'react';
import { VISA_COLORS, SELECTED_COUNTRY_COLOR } from '@/types/visa';
import { VisaApiClient } from '@/lib/visa-api';

interface VisaLegendProps {
  className?: string;
}

export default function VisaLegend({ className = '' }: VisaLegendProps) {
  const legendItems = [
    {
      color: VISA_COLORS.VF,
      status: 'VF',
      title: 'Без визы',
      description: 'Свободный въезд'
    },
    {
      color: VISA_COLORS.VOA,
      status: 'VOA',
      title: 'Виза по прилёту / eTA',
      description: 'Виза оформляется на месте'
    },
    {
      color: VISA_COLORS.EV,
      status: 'EV',
      title: 'Электронная виза',
      description: 'Требуется онлайн-заявка'
    },
    {
      color: VISA_COLORS.VR,
      status: 'VR',
      title: 'Требуется виза',
      description: 'Обычная виза в консульстве'
    },
    {
      color: VISA_COLORS.NA,
      status: 'NA',
      title: 'Въезд запрещён',
      description: 'Поездка невозможна'
    },
    {
      color: SELECTED_COUNTRY_COLOR,
      status: 'SELECTED',
      title: 'Выбранная страна',
      description: 'Страна назначения'
    }
  ] as const;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center sm:text-left">
        Легенда визовых требований
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {legendItems.map((item) => (
          <div 
            key={item.status}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Цветовой индикатор */}
            <div 
              className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            
            {/* Текстовая информация */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Информационная заметка */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg 
            className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Важная информация:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Данные могут изменяться - проверяйте актуальную информацию</li>
              <li>Некоторые страны могут иметь дополнительные требования</li>
              <li>Сроки пребывания могут отличаться</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
