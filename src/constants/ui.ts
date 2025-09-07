// Константы для UI компонентов

export const STYLES = {
  page: {
    container: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",
    main: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
  },
  legend: {
    wrapper: "mb-6",
  },
} as const;

export const MESSAGES = {
  sameCountryError: "Нельзя выбрать одинаковые страны! Страна паспорта и страна назначения должны быть разными.",
  visaStatusLoading: "Информация загружается...",
} as const;
