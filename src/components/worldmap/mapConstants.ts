// Константы для карты мира

// Проекция карты
export const MAP_PROJECTION = {
  SCALE: 200,
  TRANSLATE: [500, 300] as [number, number], // Смещаем карту вниз для лучшего показа Антарктиды
} as const;

// Zoom настройки
export const ZOOM_CONFIG = {
  SCALE_EXTENT: [1.2, 8] as [number, number], // Минимальный масштаб равен начальному (1.2)
  INITIAL_ZOOM: { x: 0, y: -15, k: 1.2 }, // Баланс между показом Антарктиды и использованием пространства
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

// Мобильные размеры SVG
export const MOBILE_SVG_CONFIG = {
  WIDTH: 300,
  HEIGHT: 125,
} as const;

// Мобильная проекция карты
export const MOBILE_PROJECTION = {
  SCALE: 60, // Уменьшенный масштаб для маленького экрана
  TRANSLATE: [120, 50] as [number, number], // Центрируем по новым размерам
} as const;

// Мобильные zoom настройки
export const MOBILE_ZOOM_CONFIG = {
  SCALE_EXTENT: [3, 12] as [number, number], // Минимальный масштаб равен начальному (3)
  INITIAL_ZOOM: { x: 0, y: -10, k: 3 }, // Увеличенный начальный зум
} as const;

