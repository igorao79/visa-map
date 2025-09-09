'use client';

import React from 'react';
import { AiOutlineGlobal, AiOutlineAim, AiOutlineClose } from 'react-icons/ai';
import CountrySearch from '@/components/CountrySearch';

interface SearchControlsProps {
  userPassportCountry: string | null;
  selectedDestination: string | null;
  onPassportCountrySelect: (countryCode: string) => void;
  onDestinationSelect: (countryCode: string) => void;
  onResetDestination: () => void;
}

export default function SearchControls({
  userPassportCountry,
  selectedDestination,
  onPassportCountrySelect,
  onDestinationSelect,
  onResetDestination
}: SearchControlsProps) {
  const getCountryName = (code: string | null): string => {
    if (!code) return '';
    // Здесь можно добавить логику получения названия страны по коду
    return code.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-0" style={{ minHeight: '160px' }}>
      {/* Выбор страны паспорта */}
      <div
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
        style={{
          height: '180px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CountrySearch
          onSelectCountry={onPassportCountrySelect}
          selectedCountry={userPassportCountry}
          onClearSelection={() => onPassportCountrySelect('')}
          placeholder="Поиск вашей страны..."
          label={<><AiOutlineGlobal className="inline mr-1" /> Ваш паспорт (страна гражданства)</>}
        />

        {userPassportCountry && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm z-10">
            <p className="text-xs text-green-600">
              Теперь выберите страну назначения
            </p>
          </div>
        )}
      </div>

      {/* Выбор страны назначения */}
      <div
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
        style={{
          height: '180px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <AiOutlineAim className="inline mr-1" /> Куда планируете поехать?
        </label>

        {!selectedDestination ? (
          /* Показываем поле ввода, когда страна не выбрана */
          <CountrySearch
            onSelectCountry={onDestinationSelect}
            selectedCountry={selectedDestination}
            onClearSelection={onResetDestination}
            placeholder="Поиск страны назначения..."
            label=""
          />
        ) : (
          /* Показываем выбранную страну вместо поля ввода */
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
               onClick={() => {
                 // При клике на блок - сбрасываем выбор и показываем поле ввода
                 onResetDestination();
               }}
               title="Кликните для изменения страны назначения">
            <div className="flex items-center">
              <div className="w-8 h-6 bg-green-200 rounded flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-green-800">
                  {selectedDestination}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Выбрано: {getCountryName(selectedDestination)}
                </p>
                <p className="text-xs text-green-600">
                  Кликните для изменения
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем всплытие клика
                onResetDestination();
              }}
              className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full transition-all duration-200"
              title="Сбросить выбор"
              aria-label="Сбросить выбор страны назначения"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>
        )}

        {/* Динамические подсказки в зависимости от состояния */}
        {!userPassportCountry && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              <AiOutlineGlobal className="inline mr-1" /> Сначала выберите вашу страну (паспорт)
            </p>
          </div>
        )}

        {userPassportCountry && !selectedDestination && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <AiOutlineGlobal className="inline mr-1" /> Теперь выберите страну назначения через поле выше или кликните на карте
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

