'use client';

import React from 'react';
import Header from '@/components/page/Header';
import SearchControls from '@/components/page/SearchControls';
import MapContainer from '@/components/page/MapContainer';
import Instructions from '@/components/page/Instructions';
import Footer from '@/components/page/Footer';
import VisaLegend from '@/components/VisaLegend';
import CountryDetails from '@/components/CountryDetails';
import MapLegend, { WarningModal } from '@/components/worldmap/MapLegend';
import { COUNTRIES } from '@/lib/countries';
import { VisaStatus } from '@/types/visa';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { useVisaMap } from '@/hooks/useVisaMap';
import { STYLES } from '@/constants/ui';

function HomeContent() {
  const {
    userPassportCountry,
    selectedDestination,
    showLegend,
    showLegendModal,
    showCountryDetails,
    visaData,
    isFirstClick,
    setUserPassportCountry,
    setSelectedDestination,
    setShowLegend,
    setShowLegendModal,
    setShowCountryDetails,
    setVisaData,
    setIsFirstClick,
  } = useAppContext();

  // Используем кастомный хук для логики приложения
  const {
    handlePassportCountrySelect,
    handleDestinationSelect,
    handleMapCountryClick: handleMapClick,
    handleResetDestination,
    getCurrentVisaStatus,
    getCountryName,
    getVisaStatusDescription,
  } = useVisaMap({
    userPassportCountry,
    selectedDestination,
    visaData,
    setUserPassportCountry,
    setSelectedDestination,
    setShowCountryDetails,
    setVisaData,
    setIsFirstClick,
  });

  // Адаптер для handleMapCountryClick чтобы передать isFirstClick
  const handleMapCountryClick = (countryCode: string) => {
    handleMapClick(countryCode, isFirstClick);
  };

  return (
    <div className={STYLES.page.container}>
      <Header
        userPassportCountry={userPassportCountry}
        onOpenLegendModal={() => setShowLegendModal(true)}
      />

      <main className={STYLES.page.main} style={{ minHeight: 'auto' }}>
        <SearchControls
          userPassportCountry={userPassportCountry}
          selectedDestination={selectedDestination}
          onPassportCountrySelect={handlePassportCountrySelect}
          onDestinationSelect={handleDestinationSelect}
          onResetDestination={handleResetDestination}
        />

        {/* Legend */}
        {showLegend && (
          <div className={STYLES.legend.wrapper}>
            <VisaLegend />
          </div>
        )}

        <MapContainer
          selectedCountry={selectedDestination}
          userPassportCountry={userPassportCountry}
          visaData={visaData}
          isFirstClick={isFirstClick}
          onCountryClick={handleMapCountryClick}
        />

        <Instructions />
      </main>

      <Footer />

      {/* Country Details Modal */}
      {showCountryDetails && userPassportCountry && selectedDestination && (
        <CountryDetails
          fromCountry={userPassportCountry}
          toCountry={selectedDestination}
          visaStatus={getCurrentVisaStatus()}
          onClose={() => setShowCountryDetails(false)}
        />
      )}

      {/* Legend Modal */}
      <MapLegend
        userPassportCountry={userPassportCountry}
        isOpen={showLegendModal}
        onClose={() => setShowLegendModal(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}
