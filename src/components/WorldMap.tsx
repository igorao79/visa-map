'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import * as d3Selection from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import { VisaApiResponse, VISA_COLORS, SELECTED_COUNTRY_COLOR, DEFAULT_COUNTRY_COLOR } from '@/types/visa';

interface WorldMapProps {
  selectedCountry: string | null;
  userPassportCountry: string | null;
  visaData: VisaApiResponse;
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

// Маппинг 3-буквенных кодов в 2-буквенные
const iso3ToIso2: Record<string, string> = {
  'AFG': 'AF', 'AGO': 'AO', 'ALB': 'AL', 'ARE': 'AE', 'ARG': 'AR',
  'ARM': 'AM', 'ATA': 'AQ', 'ATF': 'TF', 'AUS': 'AU', 'AUT': 'AT',
  'AZE': 'AZ', 'BDI': 'BI', 'BEL': 'BE', 'BEN': 'BJ', 'BFA': 'BF',
  'BGD': 'BD', 'BGR': 'BG', 'BHS': 'BS', 'BIH': 'BA', 'BLR': 'BY',
  'BLZ': 'BZ', 'BMU': 'BM', 'BOL': 'BO', 'BRA': 'BR', 'BRN': 'BN',
  'BTN': 'BT', 'BWA': 'BW', 'CAF': 'CF', 'CAN': 'CA', 'CHE': 'CH',
  'CHL': 'CL', 'CHN': 'CN', 'CIV': 'CI', 'CMR': 'CM', 'COD': 'CD',
  'COG': 'CG', 'COL': 'CO', 'CRI': 'CR', 'CUB': 'CU', 'CYP': 'CY',
  'CYP-N': 'CY', 'CZE': 'CZ', 'DEU': 'DE', 'DJI': 'DJ', 'DNK': 'DK',
  'DOM': 'DO', 'DZA': 'DZ', 'ECU': 'EC', 'EGY': 'EG', 'ERI': 'ER',
  'ESP': 'ES', 'EST': 'EE', 'ETH': 'ET', 'FIN': 'FI', 'FJI': 'FJ',
  'FRA': 'FR', 'GAB': 'GA', 'GBR': 'GB', 'GEO': 'GE', 'GHA': 'GH',
  'GIN': 'GN', 'GMB': 'GM', 'GNB': 'GW', 'GNQ': 'GQ', 'GRC': 'GR',
  'GRL': 'GL', 'GTM': 'GT', 'GUY': 'GY', 'HND': 'HN', 'HRV': 'HR',
  'HTI': 'HT', 'HUN': 'HU', 'IDN': 'ID', 'IND': 'IN', 'IRL': 'IE',
  'IRN': 'IR', 'IRQ': 'IQ', 'ISL': 'IS', 'ISR': 'IL', 'ITA': 'IT',
  'JAM': 'JM', 'JOR': 'JO', 'JPN': 'JP', 'KAZ': 'KZ', 'KEN': 'KE',
  'KGZ': 'KG', 'KHM': 'KH', 'KOR': 'KR', 'KWT': 'KW', 'LAO': 'LA',
  'LBN': 'LB', 'LBR': 'LR', 'LBY': 'LY', 'LCA': 'LC', 'LIE': 'LI',
  'LKA': 'LK', 'LSO': 'LS', 'LTU': 'LT', 'LUX': 'LU', 'LVA': 'LV',
  'MAR': 'MA', 'MCO': 'MC', 'MDA': 'MD', 'MDG': 'MG', 'MEX': 'MX',
  'MKD': 'MK', 'MLI': 'ML', 'MLT': 'MT', 'MMR': 'MM', 'MNE': 'ME',
  'MNG': 'MN', 'MOZ': 'MZ', 'MRT': 'MR', 'MWI': 'MW', 'MYS': 'MY',
  'NAM': 'NA', 'NCL': 'NC', 'NER': 'NE', 'NGA': 'NG', 'NIC': 'NI',
  'NLD': 'NL', 'NOR': 'NO', 'NPL': 'NP', 'NZL': 'NZ', 'OMN': 'OM',
  'PAK': 'PK', 'PAN': 'PA', 'PER': 'PE', 'PHL': 'PH', 'PNG': 'PG',
  'POL': 'PL', 'PRI': 'PR', 'PRT': 'PT', 'PRY': 'PY', 'QAT': 'QA',
  'ROU': 'RO', 'RUS': 'RU', 'RWA': 'RW', 'SAU': 'SA', 'SDN': 'SD',
  'SEN': 'SN', 'SGP': 'SG', 'SLB': 'SB', 'SLE': 'SL', 'SLV': 'SV',
  'SOM': 'SO', 'SOL': 'SO', 'SRB': 'RS', 'SSD': 'SS', 'SUR': 'SR',
  'SVK': 'SK', 'SVN': 'SI', 'SWE': 'SE', 'SWZ': 'SZ', 'SYR': 'SY',
  'TCD': 'TD', 'TGO': 'TG', 'THA': 'TH', 'TJK': 'TJ', 'TKM': 'TM',
  'TLS': 'TL', 'TTO': 'TT', 'TUN': 'TN', 'TUR': 'TR', 'TWN': 'TW',
  'TZA': 'TZ', 'UGA': 'UG', 'UKR': 'UA', 'URY': 'UY', 'USA': 'US',
  'UZB': 'UZ', 'VEN': 'VE', 'VNM': 'VN', 'VUT': 'VU', 'YEM': 'YE',
  'ZAF': 'ZA', 'ZMB': 'ZM', 'ZWE': 'ZW'
};

// Функция для конвертации 3-буквенного кода в 2-буквенный
const getIso2Code = (iso3Code: string): string => {
  return iso3ToIso2[iso3Code] || iso3Code;
};

// Функция для получения цвета страны
const getCountryColor = (countryCode: string, selectedCountry: string | null, visaData: VisaApiResponse, userPassportCountry: string | null) => {
  // Конвертируем 3-буквенный код в 2-буквенный для поиска в visaData
  const iso2Code = getIso2Code(countryCode);

  // Выбранная страна
  if (iso2Code === selectedCountry) {
    return SELECTED_COUNTRY_COLOR;
  }
  // Цвет по визовому статусу
  if (userPassportCountry && visaData && Object.keys(visaData).length > 0) {
    const visaStatus = visaData[iso2Code];
    if (visaStatus && VISA_COLORS[visaStatus as keyof typeof VISA_COLORS]) {
      return VISA_COLORS[visaStatus as keyof typeof VISA_COLORS];
    }
  }
  return DEFAULT_COUNTRY_COLOR;
};

export default function WorldMap({
  selectedCountry,
  userPassportCountry,
  visaData,
  onCountryClick
}: WorldMapProps) {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Состояние для zoom и pan
  const [zoomState, setZoomState] = useState({ x: 0, y: 0, k: 1.2 }); // Начинаем с небольшого увеличения
  const svgRef = useRef<SVGSVGElement>(null);

  // Отладка данных (только в development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('WorldMap Debug:', {
        selectedCountry,
        userPassportCountry,
        visaDataKeys: Object.keys(visaData || {}),
        visaDataLength: Object.keys(visaData || {}).length,
        sampleVisaData: visaData ? Object.entries(visaData).slice(0, 5) : 'No data'
      });
    }
  }, [selectedCountry, userPassportCountry, visaData]);

  // Загружаем данные стран
  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Используем import вместо fetch для большей надежности
        const data = await import('@/data/countries-real.json') as { default: GeoJSONData };
        setCountries(data.default.features);
        setLoading(false);
      } catch (error) {
        console.error('Error loading countries data:', error);
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Функция для получения текста статуса визы
  const getVisaStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'VF': 'Без визы',
      'VOA': 'Виза по прилёту',
      'EV': 'Электронная виза',
      'VR': 'Требуется виза',
      'NA': 'Въезд запрещён'
    };
    return statusMap[status] || 'Неизвестно';
  };

  // Обработчик клика по стране
  const handleCountryClick = useCallback((countryId: string, event: React.MouseEvent) => {
    console.log('Клик по стране:', countryId);
    console.log('Target element:', event.target);

    // Проверяем, что клик действительно произошел на стране, а не на фоне
    const target = event.target as SVGElement;
    if (target.tagName === 'path' && target.getAttribute('data-country-code')) {
      // Дополнительная проверка для предотвращения ложных кликов
      // Проверяем, что страна действительно существует в наших данных
      const countryExists = countries.some(country => getIso2Code(country.id) === countryId);

      if (!countryExists) {
        console.log('Страна не найдена в данных - игнорируем клик');
        return;
      }

      // Специальная проверка для островных территорий с очень детализированными границами
      const islandCountries = ['BM', 'CV', 'IC', 'SH', 'GS', 'FK', 'IO']; // Острова с потенциально проблемными границами

      if (islandCountries.includes(countryId)) {
        console.log(`Клик по островной территории ${countryId} - дополнительная проверка`);

        // Для Бермудских островов проверяем размер bounding box
        if (countryId === 'BM') {
          const target = event.target as SVGElement;
          const bbox = (target as SVGGraphicsElement).getBBox();

          // Если bounding box слишком большой для острова, игнорируем клик
          const maxSize = 50; // Максимальный размер в пикселях для островов
          if (bbox.width > maxSize || bbox.height > maxSize) {
            console.log('Бермудские острова имеют слишком большую область - игнорируем');
            return;
          }
        }
      }

      onCountryClick(countryId);
    }
  }, [onCountryClick, countries]);

  // Обработчик наведения мыши
  const handleMouseEnter = useCallback((countryId: string, event: React.MouseEvent) => {
    console.log('Наведение на страну:', countryId);

    // Проверяем, что наведение действительно произошло на стране
    const target = event.target as SVGElement;
    if (target.tagName === 'path' && target.getAttribute('data-country-code')) {
      // Дополнительная проверка для предотвращения ложных наведений
      const countryExists = countries.some(country => getIso2Code(country.id) === countryId);

      if (!countryExists) {
        console.log('Страна не найдена в данных - игнорируем наведение');
        return;
      }

      // Проверяем, что это не просто пересечение областей
      const targetCountryCode = target.getAttribute('data-country-iso2');
      if (targetCountryCode !== countryId) {
        console.log(`Несоответствие кодов: ожидалось ${countryId}, получено ${targetCountryCode} - игнорируем`);
        return;
      }

      // Специальная проверка для больших стран с потенциально проблемными границами
      const largeCountries = ['GB', 'RU', 'CN', 'US', 'CA', 'AU'];

      if (largeCountries.includes(countryId)) {
        console.log(`Наведение на большую страну ${countryId} - дополнительная проверка`);

        // Для больших стран добавляем проверку на то, что курсор действительно внутри path
        const svgElement = svgRef.current;
        if (svgElement) {
          const svgPoint = svgElement.createSVGPoint();
          const rect = svgElement.getBoundingClientRect();

          svgPoint.x = event.clientX - rect.left;
          svgPoint.y = event.clientY - rect.top;

          // Преобразуем координаты с учетом текущего transform
          const ctm = (target as SVGGraphicsElement).getCTM();
          if (ctm) {
            const transformedPoint = svgPoint.matrixTransform(ctm.inverse());
            // Здесь можно добавить дополнительную логику проверки
          }
        }
      }

      setHoveredCountry(countryId);

      // Получаем позицию относительно viewport
      const rect = (event.target as SVGElement).getBoundingClientRect();
      const svgRect = svgRef.current?.getBoundingClientRect();

      if (svgRect) {
        setTooltipPosition({
          x: rect.left + rect.width / 2 - svgRect.left,
          y: rect.top - svgRect.top - 10
        });
      }
    }
  }, [countries]);

  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    // Проверяем, что мышь действительно ушла с страны
    const target = event.target as SVGElement;
    const relatedTarget = event.relatedTarget as SVGElement;

    // Если мышь перешла на другую страну, не очищаем состояние
    if (relatedTarget && relatedTarget.tagName === 'path' && relatedTarget.getAttribute('data-country-code')) {
      return;
    }

    // Если мышь ушла на пустую область или за пределы SVG, очищаем состояние
    setHoveredCountry(null);
    setTooltipPosition(null);
  }, []);

  // Создаем проекцию карты с большим масштабом
  const projection = geoNaturalEarth1()
    .scale(200) // Увеличиваем масштаб
    .translate([500, 350]); // Центр

  // Создаем генератор путей
  const pathGenerator = geoPath().projection(projection);

  // Инициализация zoom функциональности
  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3Selection.select(svgRef.current);
    const g = svg.select('g');

    const zoomBehavior = d3Zoom.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8]) // Минимальный и максимальный масштаб
      .on('zoom', (event: any) => {
        const { x, y, k } = event.transform;
        setZoomState({ x, y, k });
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
        viewBox="0 0 1000 700"
        className="w-full h-full cursor-move"
        style={{ backgroundColor: '#f8fafc' }}
        onMouseEnter={(e) => {
          // Очищаем hover состояние при наведении на пустые области SVG
          const target = e.target as SVGElement;
          if (target.tagName === 'svg') {
            setHoveredCountry(null);
            setTooltipPosition(null);
          }
        }}
        onMouseLeave={() => {
          // Очищаем hover состояние при уходе с SVG
          setHoveredCountry(null);
          setTooltipPosition(null);
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
              /* Предотвращаем клики и hover на океанах и пустых областях */
              svg {
                pointer-events: none;
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
            const iso2Code = getIso2Code(countryCode);
            const fillColor = getCountryColor(countryCode, selectedCountry, visaData, userPassportCountry);

            return (
              <path
                key={countryCode}
                d={pathGenerator(country as any) || undefined}
                fill={fillColor}
                onClick={(e) => handleCountryClick(iso2Code, e)}
                onMouseEnter={(e) => handleMouseEnter(iso2Code, e)}
                onMouseLeave={(e) => handleMouseLeave(e)}
                data-country-code={countryCode}
                data-country-iso2={iso2Code}
                data-country-name={country.properties.name}
              />
            );
          })}
        </g>
      </svg>

      {/* Информационная панель */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-20 max-w-xs">
        <p className="text-sm text-gray-700 font-medium mb-2">
          🌍 Интерактивная карта мира
        </p>
        <p className="text-xs text-gray-600 mb-2">
          {userPassportCountry ? 'Карта окрашена по визовым требованиям' : 'Выберите страну паспорта для отображения виз'}
        </p>
        {userPassportCountry && (
          <div className="text-xs text-gray-500 space-y-1">
            <div>✅ Цвета применены автоматически</div>
            <div>🎯 Кликните на страну для подробностей</div>
            <div>🖱️ Наведите для показа информации</div>
            <div>🔍 Масштабируйте колесом мыши</div>
            <div>✋ Перетаскивайте для перемещения</div>
          </div>
        )}
      </div>

      {/* Кнопки управления картой */}
      <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
        <button
          onClick={() => {
            if (svgRef.current) {
              const svg = d3Selection.select(svgRef.current);
              const g = svg.select('g');
              const newZoomState = { x: 0, y: 0, k: 1.2 };
              setZoomState(newZoomState);
              g.attr('transform', `translate(${newZoomState.x},${newZoomState.y}) scale(${newZoomState.k})`);
            }
          }}
          className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
          title="Сбросить масштаб"
        >
          🔄 Сброс
        </button>
        <button
          onClick={() => {
            if (svgRef.current) {
              const svg = d3Selection.select(svgRef.current);
              const g = svg.select('g');
              const newZoomState = { x: 0, y: 0, k: 1 };
              setZoomState(newZoomState);
              g.attr('transform', `translate(${newZoomState.x},${newZoomState.y}) scale(${newZoomState.k})`);
            }
          }}
          className="bg-white/95 backdrop-blur-sm hover:bg-white/100 px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
          title="Обычный масштаб"
        >
          🎯 Центр
        </button>
      </div>

      {/* Легенда */}
      {userPassportCountry && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
          <p className="text-xs font-medium text-gray-700 mb-2">Легенда:</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VF }}></div>
              <span className="text-xs text-gray-600">Без визы</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VOA }}></div>
              <span className="text-xs text-gray-600">Виза по прилёту</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.EV }}></div>
              <span className="text-xs text-gray-600">Электронная виза</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: VISA_COLORS.VR }}></div>
              <span className="text-xs text-gray-600">Требуется виза</span>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip при наведении */}
      {hoveredCountry && tooltipPosition && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-40 pointer-events-none text-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-medium">
            {hoveredCountry} {/* Код страны */}
          </div>
          {visaData[hoveredCountry] && (
            <div className="text-xs opacity-90">
              {getVisaStatusText(visaData[hoveredCountry])}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}