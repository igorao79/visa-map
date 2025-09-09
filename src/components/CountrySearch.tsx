'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Flag from 'react-world-flags';
import { searchCountries, COUNTRIES } from '@/lib/countries';
import { Country } from '@/types/visa';

interface CountrySearchProps {
  onSelectCountry: (countryCode: string) => void;
  selectedCountry: string | null;
  onClearSelection?: () => void;
  placeholder?: string;
  label?: ReactNode;
}

export default function CountrySearch({
  onSelectCountry,
  selectedCountry,
  onClearSelection,
  placeholder = "Поиск страны...",
  label = "Выберите страну"
}: CountrySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Обновляем результаты поиска при изменении запроса
  useEffect(() => {
    if (query.trim()) {
      const results = searchCountries(query);
      setFilteredCountries(results);
      setHighlightedIndex(-1);
    } else {
      setFilteredCountries([]);
    }
  }, [query]);

  // Закрываем выпадающий список при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработка клавиатурной навигации
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          handleSelectCountry(filteredCountries[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleSelectCountry = (country: Country) => {
    setQuery(country.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelectCountry(country.code);
  };

  const getSelectedCountryName = () => {
    if (!selectedCountry) return '';
    const country = COUNTRIES.find(c => c.code === selectedCountry);
    return country?.name || selectedCountry;
  };

  // Очистка поиска
  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ position: 'relative', zIndex: 1 }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-colors duration-200 bg-white shadow-sm
                     text-sm md:text-base"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          
          {/* Кнопка очистки */}
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Очистить"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Выпадающий список */}
        {isOpen && filteredCountries.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 
                     rounded-lg shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {filteredCountries.map((country, index) => (
              <div
                key={country.code}
                onClick={() => handleSelectCountry(country)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors
                          ${index === highlightedIndex 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'hover:bg-gray-50'
                          }`}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <div className="flex-shrink-0 mr-3">
                  <Flag 
                    code={country.code.toLowerCase()} 
                    className="w-6 h-4 object-cover rounded-sm border border-gray-200" 
                  />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {country.name}
                </span>
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  {country.code}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Отображение выбранной страны */}
        {selectedCountry && !query && (
          <div className="absolute top-full left-0 right-0 mt-1 flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm z-10">
            <div className="flex items-center">
              <Flag
                code={selectedCountry.toLowerCase()}
                className="w-6 h-4 object-cover rounded-sm border border-gray-200 mr-2"
              />
              <span className="text-sm font-medium text-blue-700">
                Выбрано: {getSelectedCountryName()}
              </span>
            </div>
            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="flex items-center justify-center w-6 h-6 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full transition-all duration-200 ml-2"
                aria-label="Сбросить выбор"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
