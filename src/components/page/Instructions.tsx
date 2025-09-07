'use client';

import { AiOutlineFileText } from 'react-icons/ai';

export default function Instructions() {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        <AiOutlineFileText className="inline mr-2" /> Как пользоваться
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
  );
}
