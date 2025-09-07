'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import * as d3Selection from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import { VisaApiResponse } from '@/types/visa';
import { convertToIso2 } from '@/lib/country-utils';
import CountryTooltip from './worldmap/CountryTooltip';
import CountryPath from './worldmap/CountryPath';
import MapLegend from './worldmap/MapLegend';
import InfoPanel from './worldmap/InfoPanel';
import MapZoomControls from './worldmap/MapZoomControls';
import { getCountryColor, getVisaStatusText } from './worldmap/mapUtils';
import { useMapZoom } from './worldmap/useMapZoom';
import { useCountryData } from './worldmap/useCountryData';
import { useMapInteractions } from './worldmap/useMapInteractions';
import { MAP_PROJECTION, ZOOM_CONFIG, SVG_CONFIG } from './worldmap/mapConstants';

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
  const { zoomState, resetZoom, centerMap, updateZoomState } = useMapZoom({ svgRef });
  const {
    hoveredCountry,
    tooltipPosition,
    handleCountryClick,
    handleMouseEnter,
    handleMouseLeave,
    clearHoverState
  } = useMapInteractions({ countries, onCountryClick });




  // Создаем проекцию карты с большим масштабом
  const projection = geoNaturalEarth1()
    .scale(MAP_PROJECTION.SCALE)
    .translate(MAP_PROJECTION.TRANSLATE);

  // Создаем генератор путей
  const pathGenerator = geoPath().projection(projection);

  // Инициализация zoom функциональности
  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3Selection.select(svgRef.current);
    const g = svg.select('g');

    const zoomBehavior = d3Zoom.zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_CONFIG.SCALE_EXTENT)
      .on('zoom', (event: any) => {
        const { x, y, k } = event.transform;
        updateZoomState({ x, y, k });
        g.attr('transform', `translate(${x},${y}) scale(${k})`);
      });

    svg.call(zoomBehavior);

    // Устанавливаем начальный zoom
    const initialTransform = d3Zoom.zoomTransform(svg.node()!).translate(zoomState.x, zoomState.y).scale(zoomState.k);
    svg.call(zoomBehavior.transform, initialTransform);

  }, [loading]); // Убрали zoomState из зависимостей чтобы избежать бесконечного цикла

  // Обновляем transform группы стран при изменении zoomState
  useEffect(() => {
    if (svgRef.current && !loading) {
      const g = d3Selection.select(svgRef.current).select('g');
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
        viewBox={`0 0 ${SVG_CONFIG.WIDTH} ${SVG_CONFIG.HEIGHT}`}
        className="w-full h-full cursor-move"
        style={{ backgroundColor: '#f8fafc' }}
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
                onClick={handleCountryClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>
      </svg>

      <InfoPanel
        isFirstClick={isFirstClick}
        userPassportCountry={userPassportCountry}
        selectedCountry={selectedCountry}
      />

      <MapZoomControls onResetZoom={resetZoom} onCenterMap={centerMap} />

      <MapLegend userPassportCountry={userPassportCountry} />

      <CountryTooltip
        hoveredCountry={hoveredCountry}
        tooltipPosition={tooltipPosition}
        visaData={visaData}
        getVisaStatusText={getVisaStatusText}
      />
    </div>
  );
}