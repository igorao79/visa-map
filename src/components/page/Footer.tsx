'use client';

import { AiOutlineHeart } from 'react-icons/ai';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Данные предоставляются справочно. Обязательно проверяйте актуальную информацию
            на официальных сайтах посольств и консульств.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by passport-visa-api · Создано с <AiOutlineHeart className="inline mx-1 text-red-500" /> для путешественников
          </p>
        </div>
      </div>
    </footer>
  );
}



