import { NextRequest, NextResponse } from 'next/server';

// Прокси API для обхода CORS ограничений
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    
    // Валидация кода страны (должен быть 2 символа)
    if (!country || country.length !== 2) {
      return NextResponse.json(
        { error: 'Неверный код страны' },
        { status: 400 }
      );
    }

    const apiUrl = `https://rough-sun-2523.fly.dev/country/${country.toUpperCase()}`;
    
    // Делаем запрос к внешнему API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'VisaMapApp/1.0',
      },
      // Добавляем таймаут
      signal: AbortSignal.timeout(10000), // 10 секунд
    });

    if (!response.ok) {
      // Если API не доступен, возвращаем тестовые данные
      if (response.status >= 500) {
        console.log(`API недоступен для ${country}, используем fallback данные`);
        return NextResponse.json(await getFallbackData(country));
      }
      
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Преобразуем данные в нужный формат
    const transformedData = transformApiResponse(data);
    
    // Устанавливаем CORS заголовки
    return NextResponse.json(transformedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Кэш на час
      },
    });

  } catch (error) {
    console.error('Ошибка прокси API:', error);
    
    // В случае ошибки возвращаем fallback данные
    const resolvedParams = await params;
    const fallbackData = await getFallbackData(resolvedParams.country);
    
    return NextResponse.json(fallbackData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET', 
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // Кэш на 5 минут для fallback
      },
    });
  }
}

// OPTIONS для CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Тестовые данные на случай недоступности API
async function getFallbackData(country: string): Promise<Record<string, string>> {
  // Симуляция данных для российского паспорта
  const russianPassportData: Record<string, string> = {
    // Безвизовые страны
    'BY': 'VF', 'KZ': 'VF', 'KG': 'VF', 'AM': 'VF', 'AZ': 'VF',
    'MD': 'VF', 'UA': 'VF', 'GE': 'VF', 'UZ': 'VF', 'TJ': 'VF',
    'RS': 'VF', 'ME': 'VF', 'BA': 'VF', 'MK': 'VF', 'AL': 'VF',
    'TR': 'VF', 'IL': 'VF', 'AR': 'VF', 'BR': 'VF', 'CL': 'VF',
    'CR': 'VF', 'EC': 'VF', 'GT': 'VF', 'HN': 'VF', 'NI': 'VF',
    'PA': 'VF', 'PE': 'VF', 'PY': 'VF', 'UY': 'VF', 'VE': 'VF',
    
    // Виза по прилёту
    'EG': 'VOA', 'JO': 'VOA', 'LB': 'VOA', 'MA': 'VOA', 'TN': 'VOA',
    'ID': 'VOA', 'TH': 'VOA', 'VN': 'VOA', 'KH': 'VOA', 'LA': 'VOA',
    'MM': 'VOA', 'NP': 'VOA', 'LK': 'VOA', 'MV': 'VOA', 'BD': 'VOA',
    
    // Электронная виза
    'IN': 'EV', 'CN': 'EV', 'KE': 'EV', 'TZ': 'EV', 'ZM': 'EV',
    'ZW': 'EV', 'ET': 'EV', 'RW': 'EV', 'UG': 'EV', 'BF': 'EV',
    
    // Требуется виза
    'US': 'VR', 'GB': 'VR', 'CA': 'VR', 'AU': 'VR', 'NZ': 'VR',
    'JP': 'VR', 'KR': 'VR', 'SG': 'VR', 'MY': 'VR', 'PH': 'VR',
    'DE': 'VR', 'FR': 'VR', 'IT': 'VR', 'ES': 'VR', 'PT': 'VR',
    'NL': 'VR', 'BE': 'VR', 'AT': 'VR', 'CH': 'VR', 'SE': 'VR',
    'NO': 'VR', 'DK': 'VR', 'FI': 'VR', 'IS': 'VR', 'IE': 'VR',
    'PL': 'VR', 'CZ': 'VR', 'SK': 'VR', 'HU': 'VR', 'SI': 'VR',
    'HR': 'VR', 'BG': 'VR', 'RO': 'VR', 'EE': 'VR', 'LV': 'VR',
    'LT': 'VR', 'GR': 'VR', 'CY': 'VR', 'MT': 'VR', 'LU': 'VR',
    
    // Въезд запрещён
    'AF': 'NA', 'IQ': 'NA', 'SY': 'NA', 'YE': 'NA', 'SO': 'NA',
  };

  // Для других стран генерируем базовые данные
  const defaultData: Record<string, string> = {
    'RU': 'VF', // Сама страна
    'US': 'VR', 'GB': 'VR', 'DE': 'VR', 'FR': 'VR', 'IT': 'VR',
    'JP': 'VR', 'CN': 'EV', 'IN': 'EV', 'BR': 'VF', 'CA': 'VR',
    'AU': 'VR', 'TR': 'VF', 'EG': 'VOA', 'TH': 'VOA', 'SG': 'VR',
  };

  return country.toUpperCase() === 'RU' ? russianPassportData : defaultData;
}

// Функция для преобразования ответа API в нужный формат
function transformApiResponse(apiData: any): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Обрабатываем каждую категорию
  ['VF', 'VOA', 'EV', 'VR', 'NA'].forEach(category => {
    if (apiData[category] && Array.isArray(apiData[category])) {
      apiData[category].forEach((country: any) => {
        if (country.code) {
          result[country.code] = category;
        }
      });
    }
  });
  
  return result;
}