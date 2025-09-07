'use client';

import React from 'react';
import Flag from 'react-world-flags';
import { VisaStatus } from '@/types/visa';
import { VisaApiClient } from '@/lib/visa-api';
import { COUNTRIES } from '@/lib/countries';

interface CountryDetailsProps {
  fromCountry: string | null;
  toCountry: string | null;
  visaStatus: VisaStatus | null;
  onClose: () => void;
}

export default function CountryDetails({
  fromCountry,
  toCountry,
  visaStatus,
  onClose
}: CountryDetailsProps) {
  if (!fromCountry || !toCountry) return null;

  const getCountryName = (code: string): string => {
    const country = COUNTRIES.find(c => c.code === code);
    return country?.name || code;
  };

  const getVisaStatusInfo = (status: VisaStatus | null) => {
    if (!status) return { title: 'Информация недоступна', description: '', color: 'gray', icon: '❓' };

    const statusInfo = {
      VF: {
        title: 'Без визы',
        description: 'Вы можете въезжать без предварительного оформления визы. Обычно разрешается пребывание от 30 до 90 дней.',
        color: 'green',
        icon: '✅'
      },
      VOA: {
        title: 'Виза по прилёту / eTA',
        description: 'Виза оформляется непосредственно при въезде в страну или требуется электронное разрешение на въезд.',
        color: 'yellow',
        icon: '🛂'
      },
      EV: {
        title: 'Электронная виза',
        description: 'Необходимо подать заявку на электронную визу онлайн до поездки. Обычно процесс занимает от 3 до 10 дней.',
        color: 'blue',
        icon: '💻'
      },
      VR: {
        title: 'Требуется виза',
        description: 'Необходимо заранее оформить визу в консульстве или визовом центре. Процесс может занять от 5 до 30 дней.',
        color: 'orange',
        icon: '📄'
      },
      NA: {
        title: 'Въезд запрещён',
        description: 'Въезд в данную страну временно или постоянно ограничен для граждан вашей страны.',
        color: 'red',
        icon: '🚫'
      }
    };

    return statusInfo[status];
  };

  const statusInfo = getVisaStatusInfo(visaStatus);

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Информация о поездке
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Route */}
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <Flag code={fromCountry.toLowerCase()} className="w-12 h-8 mx-auto mb-2 rounded border" />
              <p className="text-sm font-medium text-gray-900">{getCountryName(fromCountry)}</p>
              <p className="text-xs text-gray-500">Откуда</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="h-px bg-gray-300 flex-1"></div>
              <svg className="w-5 h-5 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <div className="text-center">
              <Flag code={toCountry.toLowerCase()} className="w-12 h-8 mx-auto mb-2 rounded border" />
              <p className="text-sm font-medium text-gray-900">{getCountryName(toCountry)}</p>
              <p className="text-xs text-gray-500">Куда</p>
            </div>
          </div>

          {/* Visa Status */}
          <div className={`p-4 rounded-lg border-2 ${getColorClasses(statusInfo.color)}`}>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{statusInfo.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{statusInfo.title}</h3>
                <p className="text-sm opacity-80">Визовый статус</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{statusInfo.description}</p>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Важно помнить:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Визовые требования могут изменяться</li>
                  <li>Проверьте действительность паспорта (обычно не менее 6 месяцев)</li>
                  <li>Уточните актуальную информацию в консульстве</li>
                  <li>Некоторые страны требуют дополнительные документы</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Полезные ссылки:</h4>
            <div className="grid grid-cols-1 gap-2">
              <a
                href={`https://www.google.com/search?q=visa+requirements+${getCountryName(toCountry)}+for+${getCountryName(fromCountry)}+citizens`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Найти консульство
              </a>
              
              <a
                href={`https://www.google.com/search?q=${getCountryName(toCountry)}+embassy+consulate+visa+application`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Актуальная информация
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
