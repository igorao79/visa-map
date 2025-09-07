import { useEffect } from 'react';
import { VisaStatus, VisaApiResponse } from '@/types/visa';
import { VisaApiClient } from '@/lib/visa-api';
import { COUNTRIES } from '@/lib/countries';
import { convertToIso2 } from '@/lib/country-utils';
import { MESSAGES } from '@/constants/ui';

interface UseVisaMapProps {
  userPassportCountry: string | null;
  selectedDestination: string | null;
  visaData: VisaApiResponse;
  setUserPassportCountry: (country: string | null) => void;
  setSelectedDestination: (country: string | null) => void;
  setShowCountryDetails: (show: boolean) => void;
  setVisaData: (data: VisaApiResponse) => void;
  setIsFirstClick: (isFirst: boolean) => void;
}

export const useVisaMap = ({
  userPassportCountry,
  selectedDestination,
  visaData,
  setUserPassportCountry,
  setSelectedDestination,
  setShowCountryDetails,
  setVisaData,
  setIsFirstClick,
}: UseVisaMapProps) => {
  // Загружаем визовые данные при смене страны паспорта
  useEffect(() => {
    const loadVisaData = async () => {
      if (!userPassportCountry) {
        setVisaData({});
        return;
      }

      try {
        const data = await VisaApiClient.getVisaRequirements(userPassportCountry);
        setVisaData(data);
      } catch (error) {
        console.error('Ошибка загрузки визовых данных:', error);
        setVisaData({});
      }
    };

    loadVisaData();
  }, [userPassportCountry, setVisaData]);

  // Обработчики событий
  const handlePassportCountrySelect = (countryCode: string) => {
    const iso2Code = convertToIso2(countryCode);
    setUserPassportCountry(iso2Code);

    // Если выбранная страна совпадает с уже выбранной для назначения - сбрасываем назначение
    if (selectedDestination === iso2Code) {
      setSelectedDestination(null);
    }
    setIsFirstClick(false); // Теперь следующий клик будет выбирать страну назначения
  };

  const handleDestinationSelect = (countryCode: string) => {
    const iso2Code = convertToIso2(countryCode);
    if (iso2Code === userPassportCountry) {
      alert(MESSAGES.sameCountryError);
      setSelectedDestination(null);
      setIsFirstClick(true);
      return;
    }
    setSelectedDestination(iso2Code);
    setShowCountryDetails(true);
  };

  const handleMapCountryClick = (countryCode: string, isFirstClick: boolean) => {
    if (isFirstClick) {
      // Первый клик - ТОЛЬКО выбираем страну паспорта
      const iso2Code = convertToIso2(countryCode);
      setUserPassportCountry(iso2Code);

      // Если выбранная страна совпадает с уже выбранной для назначения - сбрасываем назначение
      if (selectedDestination === iso2Code) {
        setSelectedDestination(null);
      }
      setIsFirstClick(false);
      setShowCountryDetails(false);
    } else {
      // Второй клик - ТОЛЬКО выбираем страну назначения
      const iso2Code = convertToIso2(countryCode);
      if (iso2Code === userPassportCountry) {
        alert(MESSAGES.sameCountryError);
        return;
      }
      setSelectedDestination(iso2Code);
      setIsFirstClick(true);
      setShowCountryDetails(true);
    }
  };

  const handleResetDestination = () => {
    setSelectedDestination(null);
    setIsFirstClick(true);
    setShowCountryDetails(false);
    setVisaData({});
  };

  // Вспомогательные функции
  const getCurrentVisaStatus = (): VisaStatus | null => {
    if (!selectedDestination || !visaData) return null;
    return visaData[selectedDestination] as VisaStatus || null;
  };

  const getCountryName = (code: string | null): string => {
    if (!code) return '';
    const country = COUNTRIES.find(c => c.code === code);
    return country?.name || code;
  };

  const getVisaStatusDescription = (fromCountry: string, toCountry: string): string => {
    // Здесь можно было бы сделать запрос к API для получения конкретного статуса
    return MESSAGES.visaStatusLoading;
  };

  return {
    handlePassportCountrySelect,
    handleDestinationSelect,
    handleMapCountryClick,
    handleResetDestination,
    getCurrentVisaStatus,
    getCountryName,
    getVisaStatusDescription,
  };
};
