/**
 * Country Data - Realistic country definitions for the game simulation
 * Includes ~35 major nations with varying characteristics
 */

import type { Country } from '../types/game'

// Helper to create initial country state
function createCountry(
  id: string,
  name: string,
  code: string,
  population: number,
  lat: number,
  lng: number,
  climate: Country['climate'],
  wealth: Country['wealth'],
  healthcare: number,
  hasAirport: boolean,
  hasSeaport: boolean,
  isIsland = false
): Country {
  return {
    id,
    name,
    code,
    population,
    infected: 0,
    dead: 0,
    lat,
    lng,
    climate,
    isIsland,
    wealth,
    healthcare,
    hasAirport,
    hasSeaport,
    bordersOpen: true,
    airportsOpen: true,
    seaportsOpen: true,
    awareness: 0,
    researchContribution: 0,
  }
}

export const COUNTRIES: Country[] = [
  // North America
  createCountry(
    'usa',
    'United States',
    'US',
    331000000,
    39.8,
    -98.5,
    'temperate',
    'wealthy',
    85,
    true,
    true
  ),
  createCountry(
    'canada',
    'Canada',
    'CA',
    38000000,
    56.1,
    -106.3,
    'cold',
    'wealthy',
    90,
    true,
    true
  ),
  createCountry(
    'mexico',
    'Mexico',
    'MX',
    128000000,
    23.6,
    -102.5,
    'hot',
    'developing',
    65,
    true,
    true
  ),

  // South America
  createCountry(
    'brazil',
    'Brazil',
    'BR',
    213000000,
    -14.2,
    -51.9,
    'hot',
    'developing',
    60,
    true,
    true
  ),
  createCountry(
    'argentina',
    'Argentina',
    'AR',
    45000000,
    -38.4,
    -63.6,
    'temperate',
    'developing',
    70,
    true,
    true
  ),
  createCountry(
    'peru',
    'Peru',
    'PE',
    33000000,
    -9.2,
    -75.0,
    'hot',
    'developing',
    55,
    true,
    true
  ),
  createCountry(
    'colombia',
    'Colombia',
    'CO',
    51000000,
    4.6,
    -74.3,
    'hot',
    'developing',
    60,
    true,
    true
  ),

  // Europe
  createCountry(
    'uk',
    'United Kingdom',
    'GB',
    67000000,
    55.4,
    -3.4,
    'temperate',
    'wealthy',
    88,
    true,
    true,
    true
  ),
  createCountry(
    'france',
    'France',
    'FR',
    67000000,
    46.2,
    2.2,
    'temperate',
    'wealthy',
    90,
    true,
    true
  ),
  createCountry(
    'germany',
    'Germany',
    'DE',
    83000000,
    51.2,
    10.5,
    'temperate',
    'wealthy',
    92,
    true,
    true
  ),
  createCountry(
    'italy',
    'Italy',
    'IT',
    60000000,
    41.9,
    12.6,
    'temperate',
    'wealthy',
    85,
    true,
    true
  ),
  createCountry(
    'spain',
    'Spain',
    'ES',
    47000000,
    40.5,
    -3.7,
    'temperate',
    'wealthy',
    85,
    true,
    true
  ),
  createCountry(
    'russia',
    'Russia',
    'RU',
    146000000,
    61.5,
    105.3,
    'cold',
    'developing',
    70,
    true,
    true
  ),
  createCountry(
    'poland',
    'Poland',
    'PL',
    38000000,
    51.9,
    19.1,
    'temperate',
    'developing',
    75,
    true,
    true
  ),
  createCountry(
    'sweden',
    'Sweden',
    'SE',
    10000000,
    60.1,
    18.6,
    'cold',
    'wealthy',
    92,
    true,
    true
  ),
  createCountry(
    'norway',
    'Norway',
    'NO',
    5400000,
    60.5,
    8.5,
    'cold',
    'wealthy',
    95,
    true,
    true
  ),

  // Asia
  createCountry(
    'china',
    'China',
    'CN',
    1400000000,
    35.9,
    104.2,
    'temperate',
    'developing',
    75,
    true,
    true
  ),
  createCountry(
    'india',
    'India',
    'IN',
    1380000000,
    20.6,
    79.0,
    'hot',
    'developing',
    55,
    true,
    true
  ),
  createCountry(
    'japan',
    'Japan',
    'JP',
    126000000,
    36.2,
    138.3,
    'temperate',
    'wealthy',
    95,
    true,
    true,
    true
  ),
  createCountry(
    'south_korea',
    'South Korea',
    'KR',
    52000000,
    35.9,
    127.8,
    'temperate',
    'wealthy',
    90,
    true,
    true
  ),
  createCountry(
    'indonesia',
    'Indonesia',
    'ID',
    274000000,
    -0.8,
    113.9,
    'hot',
    'developing',
    55,
    true,
    true,
    true
  ),
  createCountry(
    'philippines',
    'Philippines',
    'PH',
    110000000,
    12.9,
    121.8,
    'hot',
    'developing',
    50,
    true,
    true,
    true
  ),
  createCountry(
    'thailand',
    'Thailand',
    'TH',
    70000000,
    15.9,
    100.9,
    'hot',
    'developing',
    65,
    true,
    true
  ),
  createCountry(
    'vietnam',
    'Vietnam',
    'VN',
    97000000,
    14.1,
    108.3,
    'hot',
    'developing',
    60,
    true,
    true
  ),
  createCountry(
    'saudi_arabia',
    'Saudi Arabia',
    'SA',
    35000000,
    23.9,
    45.1,
    'arid',
    'wealthy',
    80,
    true,
    true
  ),
  createCountry(
    'iran',
    'Iran',
    'IR',
    84000000,
    32.4,
    53.7,
    'arid',
    'developing',
    65,
    true,
    true
  ),
  createCountry(
    'turkey',
    'Turkey',
    'TR',
    84000000,
    39.0,
    35.2,
    'temperate',
    'developing',
    70,
    true,
    true
  ),
  createCountry(
    'pakistan',
    'Pakistan',
    'PK',
    221000000,
    30.4,
    69.3,
    'arid',
    'poor',
    45,
    true,
    true
  ),

  // Africa
  createCountry(
    'egypt',
    'Egypt',
    'EG',
    102000000,
    26.8,
    30.8,
    'arid',
    'developing',
    55,
    true,
    true
  ),
  createCountry(
    'south_africa',
    'South Africa',
    'ZA',
    60000000,
    -30.6,
    22.9,
    'temperate',
    'developing',
    60,
    true,
    true
  ),
  createCountry(
    'nigeria',
    'Nigeria',
    'NG',
    206000000,
    9.1,
    8.7,
    'hot',
    'poor',
    40,
    true,
    true
  ),
  createCountry(
    'morocco',
    'Morocco',
    'MA',
    37000000,
    31.8,
    -7.1,
    'arid',
    'developing',
    55,
    true,
    true
  ),

  // Oceania
  createCountry(
    'australia',
    'Australia',
    'AU',
    26000000,
    -25.3,
    133.8,
    'arid',
    'wealthy',
    90,
    true,
    true,
    true
  ),
  createCountry(
    'new_zealand',
    'New Zealand',
    'NZ',
    5000000,
    -40.9,
    174.9,
    'temperate',
    'wealthy',
    92,
    true,
    true,
    true
  ),

  // Hard-to-infect islands (classic Plague Inc. challenges)
  createCountry(
    'iceland',
    'Iceland',
    'IS',
    370000,
    65.0,
    -18.0,
    'cold',
    'wealthy',
    95,
    true,
    true,
    true
  ),
  createCountry(
    'greenland',
    'Greenland',
    'GL',
    56000,
    71.7,
    -42.6,
    'cold',
    'wealthy',
    85,
    false,
    true,
    true
  ),
  createCountry(
    'madagascar',
    'Madagascar',
    'MG',
    28000000,
    -18.8,
    46.9,
    'hot',
    'poor',
    35,
    true,
    true,
    true
  ),
  createCountry(
    'cuba',
    'Cuba',
    'CU',
    11000000,
    21.5,
    -77.8,
    'hot',
    'poor',
    70,
    true,
    true,
    true
  ),
]

// Calculate derived values
export const WORLD_POPULATION = COUNTRIES.reduce(
  (sum, c) => sum + c.population,
  0
)

// Country lookup map
export const COUNTRY_MAP = new Map<string, Country>(
  COUNTRIES.map((c) => [c.id, c])
)

// Get countries by climate
export function getCountriesByClimate(climate: Country['climate']): Country[] {
  return COUNTRIES.filter((c) => c.climate === climate)
}

// Get island countries
export function getIslandCountries(): Country[] {
  return COUNTRIES.filter((c) => c.isIsland)
}

// Get countries by wealth level
export function getCountriesByWealth(wealth: Country['wealth']): Country[] {
  return COUNTRIES.filter((c) => c.wealth === wealth)
}
