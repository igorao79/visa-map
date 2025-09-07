'use client';

import React, { useState, useEffect } from 'react';
import WorldMap from '@/components/WorldMap';
import CountrySearch from '@/components/CountrySearch';
import VisaLegend from '@/components/VisaLegend';
import CountryDetails from '@/components/CountryDetails';
import { VisaApiClient } from '@/lib/visa-api';
import { COUNTRIES } from '@/lib/countries';
import { VisaStatus, VisaApiResponse } from '@/types/visa';

export default function Home() {
  const [userPassportCountry, setUserPassportCountry] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showCountryDetails, setShowCountryDetails] = useState(false);
  const [visaData, setVisaData] = useState<VisaApiResponse>({});

  const handlePassportCountrySelect = (countryCode: string) => {
    setUserPassportCountry(countryCode);
    // Сбрасываем выбранную страну назначения при смене паспорта
    setSelectedDestination(null);
  };

  const handleDestinationSelect = (countryCode: string) => {
    setSelectedDestination(countryCode);
    setShowCountryDetails(true);
  };

  // Загружаем визовые данные при смене страны паспорта
  useEffect(() => {
    const loadVisaData = async () => {
      if (!userPassportCountry) {
        setVisaData({});
        return;
      }

      try {
        const data = await VisaApiClient.getVisaRequirements(userPassportCountry);
        setVisaData(data);
      } catch (error) {
        console.error('Ошибка загрузки визовых данных:', error);
        setVisaData({});
      }
    };

    loadVisaData();
  }, [userPassportCountry]);

  const getCurrentVisaStatus = (): VisaStatus | null => {
    if (!selectedDestination || !visaData) return null;
    return visaData[selectedDestination] as VisaStatus || null;
  };

  const getCountryName = (code: string | null): string => {
    if (!code) return '';
    const country = COUNTRIES.find(c => c.code === code);
    return country?.name || code;
  };

  const getVisaStatusDescription = (fromCountry: string, toCountry: string): string => {
    // Здесь можно было бы сделать запрос к API для получения конкретного статуса
    return 'Информация загружается...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                🌍 Карта визовых требований
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Узнайте визовые требования для путешествий по всему миру
              </p>
            </div>
            
            {/* Кнопка показа легенды */}
            <button
              onClick={() => setShowLegend(!showLegend)}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Выбор страны паспорта */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <CountrySearch
              onSelectCountry={handlePassportCountrySelect}
              selectedCountry={userPassportCountry}
              placeholder="Поиск вашей страны..."
              label="📘 Ваш паспорт (страна гражданства)"
            />
            
            {userPassportCountry && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Выбран паспорт: <span className="font-semibold">{getCountryName(userPassportCountry)}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Теперь кликните на любую страну на карте или найдите её ниже
                </p>
              </div>
            )}
          </div>

          {/* Выбор страны назначения */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <CountrySearch
              onSelectCountry={handleDestinationSelect}
              selectedCountry={selectedDestination}
              placeholder="Поиск страны назначения..."
              label="🎯 Куда планируете поехать?"
            />

            {selectedDestination && userPassportCountry && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  🗺️ Маршрут: <span className="font-semibold">{getCountryName(userPassportCountry)}</span> → <span className="font-semibold">{getCountryName(selectedDestination)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mb-6">
            <VisaLegend />
          </div>
        )}

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Карта всегда видна для тестирования */}
          <div className="relative" style={{ height: '500px' }}>
            <WorldMap
              selectedCountry={selectedDestination}
              userPassportCountry={userPassportCountry}
              visaData={visaData}
              onCountryClick={handleDestinationSelect}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Как пользоваться
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Выберите паспорт</h3>
                <p className="text-sm text-gray-600">Укажите страну вашего гражданства</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Изучите карту</h3>
                <p className="text-sm text-gray-600">Цвета показывают визовые требования</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Кликните страну</h3>
                <p className="text-sm text-gray-600">Получите детальную информацию</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Данные предоставляются справочно. Обязательно проверяйте актуальную информацию 
              на официальных сайтах посольств и консульств.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Powered by passport-visa-api · Создано с ❤️ для путешественников
            </p>
          </div>
        </div>
      </footer>

      {/* Country Details Modal */}
      {showCountryDetails && userPassportCountry && selectedDestination && (
        <CountryDetails
          fromCountry={userPassportCountry}
          toCountry={selectedDestination}
          visaStatus={getCurrentVisaStatus()}
          onClose={() => setShowCountryDetails(false)}
        />
      )}
    </div>
  );
}
