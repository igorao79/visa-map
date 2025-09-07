// Константы для карты мира

// Проекция карты
export const MAP_PROJECTION = {
  SCALE: 200,
  TRANSLATE: [500, 350] as [number, number],
} as const;

// Zoom настройки
export const ZOOM_CONFIG = {
  SCALE_EXTENT: [0.5, 8] as [number, number],
  INITIAL_ZOOM: { x: 0, y: 0, k: 1.2 },
} as const;

// Специальные страны и территории
export const SPECIAL_COUNTRIES = {
  ISLAND_COUNTRIES: ['BM', 'CV', 'IC', 'SH', 'GS', 'FK', 'IO'],
  MAX_ISLAND_SIZE: 50,
  GREENLAND_DEPENDENCY: 'DK',
  ANTARCTICA: 'AQ',
} as const;

// Размеры SVG
export const SVG_CONFIG = {
  WIDTH: 1000,
  HEIGHT: 700,
} as const;
