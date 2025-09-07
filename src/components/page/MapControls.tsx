'use client';

import React from 'react';
import { AiOutlineAim, AiOutlineSelect, AiOutlineZoomIn, AiOutlineHome, AiOutlineDrag, AiOutlineCheckCircle, AiOutlineIdcard, AiOutlineEnvironment, AiOutlineReload } from 'react-icons/ai';

interface MapControlsProps {
  isFirstClick: boolean;
  userPassportCountry: string | null;
  selectedCountry: string | null;
  onResetZoom: () => void;
  onResetToDefault: () => void;
}

export default function MapControls({
  isFirstClick,
  userPassportCountry,
  selectedCountry,
  onResetZoom,
  onResetToDefault
}: MapControlsProps) {
  return (
    <div>
      {/* Информационная панель */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-20 max-w-xs">
        <p className="text-sm text-gray-700 font-medium mb-2">
          <AiOutlineEnvironment className="inline mr-1" /> Интерактивная карта мира
        </p>
        <p className="text-xs text-gray-600 mb-2">
          {isFirstClick ? (
            <span>
              <span className="text-green-600 font-semibold">1-й клик:</span> Выберите страну паспорта
            </span>
          ) : (
            <span>
              <span className="text-blue-600 font-semibold">2-й клик:</span> Выберите страну назначения
            </span>
          )}
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          {userPassportCountry && (
            <div className="flex items-center gap-2">
              <AiOutlineIdcard className="text-green-600" />
              Паспорт: <span className="font-semibold text-green-700">{userPassportCountry.toUpperCase()}</span>
            </div>
          )}
          {selectedCountry && (
            <div className="flex items-center gap-2">
              <AiOutlineEnvironment className="text-blue-600" />
              Назначение: <span className="font-semibold text-blue-700">{selectedCountry.toUpperCase()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <AiOutlineCheckCircle className="text-green-500" />
            Цвета применены автоматически
          </div>
          <div className="flex items-center gap-2">
            {isFirstClick ? (
              <React.Fragment>
                <AiOutlineAim className="text-green-500" />
                <span className="text-green-600 font-medium">1-й клик: Выберите страну паспорта</span>
              </React.Fragment>
            ) : userPassportCountry ? (
              <React.Fragment>
                <AiOutlineAim className="text-blue-500" />
                <span className="text-blue-600 font-medium">2-й клик: Выберите страну назначения</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AiOutlineAim className="text-orange-500" />
                <span className="text-orange-600 font-medium">Сначала выберите страну паспорта</span>
              </React.Fragment>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineSelect className="text-blue-500" />
            Наведите для показа информации
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineZoomIn className="text-blue-500" />
            Масштабируйте колесом мыши
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineDrag className="text-blue-500" />
            Перетаскивайте для перемещения
          </div>
        </div>
      </div>

      {/* Кнопки управления картой */}
      <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
        <button
          onClick={onResetZoom}
          className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
          title="Сбросить масштаб"
        >
          <AiOutlineReload className="inline mr-1" /> Сброс
        </button>
        <button
          onClick={onResetToDefault}
          className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
          title="Обычный масштаб"
        >
          <AiOutlineHome className="inline mr-1" />
          Центр
        </button>
      </div>
    </div>
  );
}