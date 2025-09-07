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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Выбор страны паспорта */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <CountrySearch
          onSelectCountry={onPassportCountrySelect}
          selectedCountry={userPassportCountry}
          placeholder="Поиск вашей страны..."
          label={<><AiOutlineGlobal className="inline mr-1" /> Ваш паспорт (страна гражданства)</>}
        />

        {userPassportCountry && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 mt-1">
              Теперь выберите страну назначения
            </p>
          </div>
        )}
      </div>

      {/* Выбор страны назначения */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <AiOutlineAim className="inline mr-1" /> Куда планируете поехать?
          </label>
          {selectedDestination && (
            <button
              onClick={onResetDestination}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Сбросить выбор"
            >
              <AiOutlineClose size={16} />
            </button>
          )}
        </div>
        <CountrySearch
          onSelectCountry={onDestinationSelect}
          selectedCountry={selectedDestination}
          placeholder="Поиск страны назначения..."
          label=""
        />

        {selectedDestination && userPassportCountry && selectedDestination !== userPassportCountry && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <AiOutlineGlobal className="inline mr-1" /> Маршрут: <span className="font-semibold">{getCountryName(userPassportCountry)}</span> → <span className="font-semibold">{getCountryName(selectedDestination)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
