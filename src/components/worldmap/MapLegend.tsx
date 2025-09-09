'use client';

import React from 'react';
import { AiOutlineClose, AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai';
import { VISA_COLORS } from '@/types/visa';

interface MapLegendProps {
  userPassportCountry: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MapLegend({ userPassportCountry, isOpen, onClose }: MapLegendProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AiOutlineInfoCircle className="text-blue-500" />
            Легенда карты
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Цвета стран показывают визовые требования для граждан{' '}
          {userPassportCountry ? (
            <span className="font-semibold text-green-600">{userPassportCountry.toUpperCase()}</span>
          ) : (
            <span className="font-semibold text-blue-600">выбранной страны</span>
          )}
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded border-2 border-gray-300" style={{ backgroundColor: VISA_COLORS.VF }}></div>
            <span className="text-sm text-gray-700">Без визы</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded border-2 border-gray-300" style={{ backgroundColor: VISA_COLORS.VOA }}></div>
            <span className="text-sm text-gray-700">Виза по прилёту / eTA</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded border-2 border-gray-300" style={{ backgroundColor: VISA_COLORS.EV }}></div>
            <span className="text-sm text-gray-700">Электронная виза</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded border-2 border-gray-300" style={{ backgroundColor: VISA_COLORS.VR }}></div>
            <span className="text-sm text-gray-700">Требуется виза</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

// Модальное окно предупреждения при выборе одной страны
interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WarningModal({ isOpen, onClose }: WarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AiOutlineWarning className="w-8 h-8 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Предупреждение
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Нельзя выбрать одну и ту же страну для паспорта и назначения поездки.
          Пожалуйста, выберите другую страну назначения.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

