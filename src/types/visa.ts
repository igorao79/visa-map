// Типы для визовых требований
export type VisaStatus = 'VF' | 'VOA' | 'EV' | 'VR' | 'NA';

export interface VisaInfo {
  status: VisaStatus;
  note?: string;
  duration?: string;
}

export interface Country {
  name: string;
  code: string; // ISO Alpha-2 код
  visaStatus?: VisaStatus;
}

export interface VisaApiResponse {
  [countryCode: string]: VisaStatus;
}

// Цвета для визовых статусов
export const VISA_COLORS: Record<VisaStatus, string> = {
  VF: '#4CAF50',  // Зелёный - Visa Free
  VOA: '#FFC107', // Жёлтый - Visa On Arrival / eTA
  EV: '#2196F3',  // Синий - eVisa Only
  VR: '#FF9800',  // Оранжевый - Visa Required
  NA: '#F44336'   // Красный - No Admission
};

// Выбранная страна всегда фиолетовая
export const SELECTED_COUNTRY_COLOR = '#9C27B0';
export const DEFAULT_COUNTRY_COLOR = '#E0E0E0';
