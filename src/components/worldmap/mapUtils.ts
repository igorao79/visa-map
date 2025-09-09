import { VisaApiResponse, VISA_COLORS, SELECTED_COUNTRY_COLOR, DEFAULT_COUNTRY_COLOR } from '@/types/visa';
import { convertToIso2 } from '@/lib/country-utils';

// Функция для получения цвета страны
export const getCountryColor = (
  countryCode: string,
  selectedCountry: string | null,
  visaData: VisaApiResponse,
  userPassportCountry: string | null
) => {
  // Конвертируем 3-буквенный код в 2-буквенный для поиска в visaData
  const iso2Code = convertToIso2(countryCode);

  // Приоритет выбранных стран (паспорт + назначение)
  const countriesToHighlight = [selectedCountry, userPassportCountry].filter(Boolean);

  for (const highlightCountry of countriesToHighlight) {
    if (highlightCountry) {
      // Конвертируем страну для выделения в 2-буквенный код для сравнения
      const highlightIso2 = convertToIso2(highlightCountry);

      // Проверяем совпадение с учетом всех возможных форматов
      const isHighlighted = (
        iso2Code === highlightIso2 ||              // Оба в 2-буквенном формате
        iso2Code === highlightCountry ||           // iso2Code совпадает с highlightCountry
        countryCode === highlightCountry ||        // 3-буквенный код совпадает напрямую
        convertToIso2(countryCode) === highlightIso2  // Конвертируем countryCode и сравниваем
      );

      if (isHighlighted) {
        return SELECTED_COUNTRY_COLOR; // #9C27B0 - ярко-фиолетовый
      }
    }
  }

  // Цвет по визовому статусу (только если есть данные паспорта)
  if (userPassportCountry && visaData && Object.keys(visaData).length > 0) {
    const visaStatus = visaData[iso2Code];

    if (visaStatus && VISA_COLORS[visaStatus as keyof typeof VISA_COLORS]) {
      return VISA_COLORS[visaStatus as keyof typeof VISA_COLORS];
    }

    // Специальная обработка для территорий без данных
    if (iso2Code === 'GL' && visaData['DK']) {
      // Гренландия использует датские правила
      const dkStatus = visaData['DK'];
      if (dkStatus && VISA_COLORS[dkStatus as keyof typeof VISA_COLORS]) {
        return VISA_COLORS[dkStatus as keyof typeof VISA_COLORS];
      }
    }

    if (iso2Code === 'AQ') {
      // Антарктида - специальный цвет
      return '#B0B0B0';
    }
  }

  // Серый цвет по умолчанию
  return DEFAULT_COUNTRY_COLOR;
};

// Функция для получения текста статуса визы
export const getVisaStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'VF': 'Без визы',
    'VOA': 'Виза по прилёту',
    'EV': 'Электронная виза',
    'VR': 'Требуется виза',
    'NA': 'Въезд запрещён'
  };
  return statusMap[status] || 'Неизвестно';
};



