/**
 * Countries API - Fetch real-world country data from REST Countries API
 * https://restcountries.com/
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Climate, Country, WealthLevel } from '~/libs/types/game'

// REST Countries API response type
interface RestCountry {
  name: {
    common: string
    official: string
  }
  cca2: string // ISO 3166-1 alpha-2
  cca3: string // ISO 3166-1 alpha-3
  population: number
  latlng: [number, number]
  landlocked: boolean
  region: string
  subregion?: string
  continents: string[]
  flags: {
    png: string
    svg: string
  }
  gini?: Record<string, number> // Income inequality (for wealth estimation)
}

// Map regions to climate (simplified)
function estimateClimate(latlng: [number, number], region: string): Climate {
  const lat = Math.abs(latlng[0])

  // Polar/cold regions
  if (lat > 60) return 'cold'

  // Check for arid regions (simplified)
  if (
    region === 'Africa' &&
    (latlng[0] > 15 || latlng[0] < -20) &&
    Math.abs(latlng[0]) < 35
  ) {
    return 'arid'
  }

  // Middle East
  if (
    ['Saudi Arabia', 'UAE', 'Qatar', 'Iraq', 'Iran'].some((c) =>
      region.includes(c)
    )
  ) {
    return 'arid'
  }

  // Tropical
  if (lat < 23) return 'hot'

  // Temperate
  return 'temperate'
}

// Estimate wealth level from GDP or region
function estimateWealth(country: RestCountry): WealthLevel {
  const { region, subregion, population, name } = country

  // Known wealthy nations
  const wealthyCountries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
    'Norway',
    'Sweden',
    'Switzerland',
    'Netherlands',
    'South Korea',
    'Singapore',
    'New Zealand',
    'Austria',
    'Belgium',
    'Denmark',
    'Finland',
    'Ireland',
    'Iceland',
    'Luxembourg',
    'Israel',
    'United Arab Emirates',
    'Qatar',
    'Kuwait',
    'Saudi Arabia',
  ]

  if (wealthyCountries.some((c) => name.common.includes(c))) {
    return 'wealthy'
  }

  // By region (simplified)
  if (subregion === 'Western Europe' || subregion === 'Northern Europe') {
    return 'wealthy'
  }

  if (
    subregion === 'Northern America' ||
    subregion === 'Australia and New Zealand'
  ) {
    return 'wealthy'
  }

  if (region === 'Africa' || subregion === 'South-Eastern Asia') {
    return population > 50000000 ? 'developing' : 'poor'
  }

  return 'developing'
}

// Estimate healthcare quality
function estimateHealthcare(wealth: WealthLevel, _region: string): number {
  const base =
    {
      wealthy: 85,
      developing: 55,
      poor: 35,
    }[wealth] || 35
  const variance = Math.random() * 10 - 5
  return Math.min(100, Math.max(20, base + variance))
}

// Transform REST Countries response to our Country type
function transformCountry(rc: RestCountry): Country {
  const wealth = estimateWealth(rc)

  return {
    id: rc.cca2.toLowerCase(),
    name: rc.name.common,
    code: rc.cca2,
    population: rc.population,
    infected: 0,
    dead: 0,
    lat: rc.latlng[0],
    lng: rc.latlng[1],
    climate: estimateClimate(rc.latlng, rc.region),
    isIsland: rc.landlocked === false && rc.population < 50000000,
    wealth,
    healthcare: estimateHealthcare(wealth, rc.region),
    hasAirport: rc.population > 500000,
    hasSeaport: !rc.landlocked,
    bordersOpen: true,
    airportsOpen: true,
    seaportsOpen: true,
    awareness: 0,
    researchContribution: 0,
  }
}

// RTK Query API
export const countriesApi = createApi({
  reducerPath: 'countriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://restcountries.com/v3.1/',
  }),
  endpoints: (builder) => ({
    // Get all countries
    getAllCountries: builder.query<Country[], void>({
      query: () =>
        'all?fields=name,cca2,cca3,population,latlng,landlocked,region,subregion,continents,flags',
      transformResponse: (response: RestCountry[]) => {
        // Filter to countries with population > 100k for game balance
        return response
          .filter((c) => c.population > 100000)
          .map(transformCountry)
          .sort((a, b) => b.population - a.population)
      },
    }),

    // Get countries by region
    getCountriesByRegion: builder.query<Country[], string>({
      query: (region) =>
        `region/${region}?fields=name,cca2,cca3,population,latlng,landlocked,region,subregion,continents,flags`,
      transformResponse: (response: RestCountry[]) => {
        return response
          .filter((c) => c.population > 100000)
          .map(transformCountry)
      },
    }),
  }),
})

export const { useGetAllCountriesQuery, useGetCountriesByRegionQuery } =
  countriesApi
