import { useState, useCallback } from 'react';
import { convertToIso2 } from '@/lib/country-utils';
import { SPECIAL_COUNTRIES } from './mapConstants';

interface CountryFeature {
  type: 'Feature';
  id: string;
  properties: {
    name: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface UseMapInteractionsProps {
  countries: CountryFeature[];
  onCountryClick: (countryCode: string) => void;
}

export const useMapInteractions = ({ countries, onCountryClick }: UseMapInteractionsProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Обработчик клика по стране
  const handleCountryClick = useCallback((countryId: string, event: React.MouseEvent) => {
    // Проверяем, что клик действительно произошел на стране, а не на фоне
    const target = event.target as SVGElement;
    if (target.tagName === 'path' && target.getAttribute('data-country-code')) {
      // Запрещаем выбор Антарктиды
      if (countryId === SPECIAL_COUNTRIES.ANTARCTICA) {
        return;
      }

      // Дополнительная проверка для предотвращения ложных кликов
      // Проверяем, что страна действительно существует в наших данных
      const countryExists = countries.some(country => convertToIso2(country.id) === countryId);

      if (!countryExists) {
        return;
      }

      // Специальная проверка для островных территорий с очень детализированными границами
      if ((SPECIAL_COUNTRIES.ISLAND_COUNTRIES as readonly string[]).includes(countryId)) {
        // Для Бермудских островов проверяем размер bounding box
        if (countryId === 'BM') {
          const target = event.target as SVGElement;
          const bbox = (target as SVGGraphicsElement).getBBox();

          // Если bounding box слишком большой для острова, игнорируем клик
          if (bbox.width > SPECIAL_COUNTRIES.MAX_ISLAND_SIZE || bbox.height > SPECIAL_COUNTRIES.MAX_ISLAND_SIZE) {
            return;
          }
        }
      }

      onCountryClick(countryId);
    }
  }, [onCountryClick, countries]);

  // Обработчик наведения мыши
  const handleMouseEnter = useCallback((countryId: string, event: React.MouseEvent) => {
    // Проверяем, что наведение действительно произошло на стране
    const target = event.target as SVGElement;
    if (target.tagName === 'path' && target.getAttribute('data-country-code')) {
      // Запрещаем показ tooltip для Антарктиды
      if (countryId === SPECIAL_COUNTRIES.ANTARCTICA) {
        return;
      }

      // Дополнительная проверка для предотвращения ложных наведений
      const countryExists = countries.some(country => convertToIso2(country.id) === countryId);

      if (!countryExists) {
        return;
      }

      // Проверяем, что это не просто пересечение областей
      const targetCountryCode = target.getAttribute('data-country-iso2');
      if (targetCountryCode !== countryId) {
        return;
      }

      // Специальная проверка для больших стран с потенциально проблемными границами
      const largeCountries = ['GB', 'RU', 'CN', 'US', 'CA', 'AU'];

      if (largeCountries.includes(countryId)) {
        // Для больших стран проверяем, что курсор действительно находится внутри страны
        const target = event.target as SVGElement;
        const bbox = (target as SVGGraphicsElement).getBBox();
        const rect = target.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Если курсор слишком далеко от bounding box, игнорируем наведение
        const margin = 20; // Допустимое расстояние от bounding box
        if (
          mouseX < rect.left - margin ||
          mouseX > rect.right + margin ||
          mouseY < rect.top - margin ||
          mouseY > rect.bottom + margin
        ) {
          return;
        }
      }

      // Наведение на большую страну RU - дополнительная проверка
      if (countryId === 'RU') {
        const target = event.target as SVGElement;
        const bbox = (target as SVGGraphicsElement).getBBox();

        // Для России проверяем минимальный размер bounding box
        const minSize = 100; // Минимальный размер в пикселях для больших стран
        if (bbox.width < minSize || bbox.height < minSize) {
          return;
        }
      }

      setHoveredCountry(countryId);
      // Используем абсолютные координаты экрана для fixed позиционирования
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  }, [countries]);

  // Обработчик ухода мыши
  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    // Проверяем, что мышь действительно ушла за пределы SVG
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Если мышь все еще внутри SVG, не очищаем состояние
    if (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    ) {
      return;
    }

    // Если мышь ушла на пустую область или за пределы SVG, очищаем состояние
    setHoveredCountry(null);
    setTooltipPosition(null);
  }, []);

  const clearHoverState = useCallback(() => {
    setHoveredCountry(null);
    setTooltipPosition(null);
  }, []);

  return {
    hoveredCountry,
    tooltipPosition,
    handleCountryClick,
    handleMouseEnter,
    handleMouseLeave,
    clearHoverState,
  };
};
