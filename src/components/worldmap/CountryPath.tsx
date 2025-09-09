'use client';

import React from 'react';
import { GeoPath } from 'd3-geo';
import { convertToIso2 } from '@/lib/country-utils';

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

interface CountryPathProps {
  country: CountryFeature;
  pathGenerator: GeoPath<any, any>;
  fillColor: string;
  onClick: (countryId: string, event: React.MouseEvent) => void;
  onMouseEnter: (countryId: string, event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
}

export default function CountryPath({
  country,
  pathGenerator,
  fillColor,
  onClick,
  onMouseEnter,
  onMouseLeave
}: CountryPathProps) {
  const countryCode = country.id;
  const iso2Code = convertToIso2(countryCode);

  return (
    <path
      key={countryCode}
      className="country-path"
      d={pathGenerator(country as any) || undefined}
      fill={fillColor}
      onClick={(e) => onClick(iso2Code, e)}
      onMouseEnter={(e) => onMouseEnter(iso2Code, e)}
      onMouseLeave={onMouseLeave}
      data-country-code={countryCode}
      data-country-iso2={iso2Code}
      data-country-name={country.properties.name}
    />
  );
}

