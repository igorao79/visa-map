// API клиент для passport-visa-api
import { VisaApiResponse, VisaStatus } from '@/types/visa';

// Используем наш локальный прокси API вместо прямого обращения к внешнему API
const VISA_API_BASE_URL = '/api/visa';

export class VisaApiClient {
  /**
   * Получить визовые требования для определенной страны
   * @param fromCountry ISO код страны паспорта
   * @param toCountry ISO код страны назначения (опционально)
   * @returns Объект с визовыми требованиями
   */
  static async getVisaRequirements(
    fromCountry: string,
    toCountry?: string
  ): Promise<VisaApiResponse> {
    try {
      // Пока поддерживаем только запросы по одной стране
      const url = `${VISA_API_BASE_URL}/${fromCountry}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при получении визовых требований:', error);
      throw error;
    }
  }

  /**
   * Получить список всех стран
   * @returns Список стран с кодами
   */
  static async getCountries(): Promise<{ code: string; name: string }[]> {
    try {
      const response = await fetch(`${VISA_API_BASE_URL}/countries`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при получении списка стран:', error);
      throw error;
    }
  }

  /**
   * Преобразует статус визы в читаемый формат
   * @param status Статус визы
   * @returns Описание статуса
   */
  static getVisaStatusDescription(status: VisaStatus): string {
    const descriptions: Record<VisaStatus, string> = {
      VF: 'Без визы',
      VOA: 'Виза по прилёту / eTA',
      EV: 'Электронная виза',
      VR: 'Требуется виза',
      NA: 'Въезд запрещён'
    };
    
    return descriptions[status] || 'Неизвестно';
  }
}
