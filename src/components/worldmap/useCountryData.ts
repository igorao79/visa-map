import { useState, useEffect } from 'react';

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

export const useCountryData = () => {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { countries, loading };
};
