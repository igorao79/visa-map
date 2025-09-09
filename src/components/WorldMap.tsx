'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import * as d3Selection from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import { VisaApiResponse } from '@/types/visa';
import { convertToIso2 } from '@/lib/country-utils';
import CountryTooltip from './worldmap/CountryTooltip';
import CountryPath from './worldmap/CountryPath';
import MapLegend, { WarningModal } from './worldmap/MapLegend';
// import InfoPanel from './worldmap/InfoPanel';
import MapZoomControls from './worldmap/MapZoomControls';
import { getCountryColor, getVisaStatusText } from './worldmap/mapUtils';
import { useMapZoom } from './worldmap/useMapZoom';
import { useCountryData } from './worldmap/useCountryData';
import { useMapInteractions } from './worldmap/useMapInteractions';
import { MAP_PROJECTION, ZOOM_CONFIG, SVG_CONFIG, MOBILE_SVG_CONFIG, MOBILE_PROJECTION, MOBILE_ZOOM_CONFIG } from './worldmap/mapConstants';

interface WorldMapProps {
  selectedCountry: string | null;
  userPassportCountry: string | null;
  visaData: VisaApiResponse;
  isFirstClick: boolean;
  onCountryClick: (countryCode: string) => void;
}

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

interface GeoJSONData {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

// Функция для конвертации 3-буквенного кода в 2-буквенный
const getIso2Code = (iso3Code: string): string => {
  return convertToIso2(iso3Code);
};


export default function WorldMap({
  selectedCountry,
  userPassportCountry,
  visaData,
  isFirstClick,
  onCountryClick
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { countries, loading } = useCountryData();
  
  // Состояние для размера экрана
  const [isMobile, setIsMobile] = useState(false);

  // Отслеживание размера экрана
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Выбор настроек в зависимости от размера экрана
  const svgConfig = isMobile ? MOBILE_SVG_CONFIG : SVG_CONFIG;
  const projectionConfig = isMobile ? MOBILE_PROJECTION : MAP_PROJECTION;
  const zoomConfig = isMobile ? MOBILE_ZOOM_CONFIG : ZOOM_CONFIG;
  
  const { zoomState, resetZoom, centerMap, updateZoomState } = useMapZoom({ svgRef, zoomConfig });

  // Состояние модальных окон
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);

  const {
    hoveredCountry,
    tooltipPosition,
    handleCountryClick,
    handleMouseEnter,
    handleMouseLeave,
    clearHoverState
  } = useMapInteractions({ countries, onCountryClick });

  // Обработчик клика по стране с проверкой на одинаковые страны
  const handleCountryClickWithWarning = useCallback((countryId: string, event: React.MouseEvent) => {
    if (!isFirstClick && countryId === userPassportCountry) {
      setIsWarningOpen(true);
      return;
    }
    handleCountryClick(countryId, event);
  }, [handleCountryClick, isFirstClick, userPassportCountry]);




  // Создаем проекцию карты с учетом размера экрана
  const projection = geoNaturalEarth1()
    .scale(projectionConfig.SCALE)
    .translate(projectionConfig.TRANSLATE);

  // Создаем генератор путей
  const pathGenerator = geoPath().projection(projection);

  // Инициализация zoom функциональности
  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3Selection.select(svgRef.current);
    const g = svg.select('g');

    const zoomBehavior = d3Zoom.zoom<SVGSVGElement, unknown>()
      .scaleExtent(zoomConfig.SCALE_EXTENT)
      .wheelDelta((event: WheelEvent) => {
        // Улучшенная поддержка wheel событий для touchpad'ов
        return -event.deltaY * (event.deltaMode ? 120 : 1) / 500;
      })
      .touchable(true) // Явно включаем поддержку touch
      .filter((event: any) => {
        // Разрешаем wheel события и touch события, но блокируем их на интерактивных элементах
        if (event.type === 'wheel') {
          return !event.ctrlKey || event.type === 'wheel';
        }
        // Для touch событий всегда разрешаем
        if (event.type.startsWith('touch')) {
          return true;
        }
        // Для mouse событий проверяем, что это не клик на страну
        return !event.target.closest('.country-path');
      })
      .on('zoom', (event: any) => {
        const { x, y, k } = event.transform;

        // Получаем размеры контейнера и SVG
        const svgRect = svgRef.current!.getBoundingClientRect();
        const containerWidth = svgRect.width;
        const containerHeight = svgRect.height;
        const svgWidth = svgConfig.WIDTH * k; // Ширина карты с учетом масштаба
        const svgHeight = svgConfig.HEIGHT * k; // Высота карты с учетом масштаба

        // Ограничиваем горизонтальное перемещение
        let clampedX;

        if (isMobile) {
          // Мобильная логика - контролируемые ограничения
          const mobileMinX = -30; // Ограничение влево (не дальше 30px)
          const mobileMaxX = 30;  // Ограничение вправо (не дальше 30px)
          clampedX = Math.max(mobileMinX, Math.min(mobileMaxX, x));
        } else {
          // Десктопная логика
          const minX = -(svgWidth - containerWidth) + 20; // Левая граница
          const maxX = -20; // Правая граница
          clampedX = Math.max(minX, Math.min(maxX, x));
        }

        // Разная логика для мобильных и десктопных устройств
        let clampedY;

        if (isMobile) {
          // Мобильная логика - контролируемое перемещение
          const mobileMinY = -50; // Ограничение вверх (не дальше 50px)
          const mobileMaxY = 50;  // Ограничение вниз (не дальше 50px)
          clampedY = Math.max(mobileMinY, Math.min(mobileMaxY, y));
        } else {
          // Десктопная логика - ограничения в зависимости от масштаба
          let minY, maxY;

          if (k <= 1.3) {
            // При базовом масштабе - жесткие ограничения
            minY = -5;  // Минимальное смещение вниз
            maxY = 5;   // Минимальное смещение вверх
          } else {
            // При увеличенном масштабе - более свободное перемещение
            minY = -(svgHeight - containerHeight) + 20; // Верхняя граница с отступом
            maxY = 50;  // Нижняя граница с большим отступом
          }

          clampedY = Math.max(minY, Math.min(maxY, y));
        }

        updateZoomState({ x: clampedX, y: clampedY, k });
        g.attr('transform', `translate(${clampedX},${clampedY}) scale(${k})`);
      });

    svg.call(zoomBehavior);

    // Устанавливаем начальный zoom
    const initialTransform = d3Zoom.zoomTransform(svg.node()!).translate(zoomState.x, zoomState.y).scale(zoomState.k);
    svg.call(zoomBehavior.transform, initialTransform);

  }, [loading, zoomConfig]); // Добавили zoomConfig для пересоздания при изменении настроек

  // Обновляем transform группы стран при изменении zoomState
  useEffect(() => {
    if (svgRef.current && !loading) {
      const g = d3Selection.select(svgRef.current).select('g');
      // Фиксируем вертикальное положение при обновлении состояния
      g.attr('transform', `translate(${zoomState.x},${zoomState.y}) scale(${zoomState.k})`);
    }
  }, [zoomState, loading]);

  if (loading) {
    return (
      <div className="w-full h-full relative bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка карты мира...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-blue-50 rounded-lg overflow-hidden">
      {/* SVG карта мира */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgConfig.WIDTH} ${svgConfig.HEIGHT}`}
        className="w-full h-full cursor-move"
        style={{ backgroundColor: '#3b82f6' }} // Приятный синий цвет океана
        onMouseEnter={(e) => {
          // Очищаем hover состояние при наведении на пустые области SVG
          const target = e.target as SVGElement;
          if (target.tagName === 'svg') {
            clearHoverState();
          }
        }}
        onMouseLeave={() => {
          // Очищаем hover состояние при уходе с SVG
          clearHoverState();
        }}
      >
        <defs>
          <style type="text/css">
            {`
              path {
                cursor: pointer;
                transition: all 0.2s ease;
                stroke: #ffffff;
                stroke-width: 0.8;
              }
              path:hover {
                stroke: #3b82f6;
                stroke-width: 1.5;
              }
              .countries-group {
                transition: transform 0.1s ease-out;
              }
              /* Разрешаем drag и zoom на пустых областях, но блокируем hover эффекты */
              svg {
                pointer-events: fill;
              }
              svg path {
                pointer-events: all;
              }
              /* Дополнительные правила для предотвращения ложных hover эффектов */
              svg:hover {
                /* Не показываем курсор на пустых областях */
              }
              /* Гарантируем, что только страны реагируют на hover */
              path:hover {
                stroke-width: 1.5 !important;
              }
            `}
          </style>
        </defs>

        {/* Группа для стран с начальным transform */}
        <g className="countries-group" transform={`translate(${zoomState.x},${zoomState.y}) scale(${zoomState.k})`}>
          {/* Рендерим все страны */}
          {countries.map((country) => {
            const countryCode = country.id;
            const fillColor = getCountryColor(countryCode, selectedCountry, visaData, userPassportCountry);

            return (
              <CountryPath
                key={countryCode}
                country={country}
                pathGenerator={pathGenerator}
                fillColor={fillColor}
                onClick={handleCountryClickWithWarning}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>
      </svg>

      {/* {isInfoPanelVisible && (
        <InfoPanel
          isFirstClick={isFirstClick}
          userPassportCountry={userPassportCountry}
          selectedCountry={selectedCountry}
          onClose={() => setIsInfoPanelVisible(false)}
        />
      )} */}

      <MapZoomControls onResetZoom={resetZoom} onCenterMap={centerMap} />

      {/* Кнопки управления */}
      {userPassportCountry && (
        <div className="absolute top-4 right-4 flex gap-2 z-30">
          {!isInfoPanelVisible && (
            <button
              onClick={() => setIsInfoPanelVisible(true)}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              title="Показать информацию"
            >
              Инфо
            </button>
          )}
        </div>
      )}

      <MapLegend
        userPassportCountry={userPassportCountry}
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />

      <CountryTooltip
        hoveredCountry={hoveredCountry}
        tooltipPosition={tooltipPosition}
        visaData={visaData}
        getVisaStatusText={getVisaStatusText}
      />
    </div>
  );
}