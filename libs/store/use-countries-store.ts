import { create } from 'zustand'
import type { Climate, Country, WealthLevel } from '~/libs/types/game'

interface RestCountry {
  name: { common: string }
  cca2: string
  population: number
  latlng: [number, number]
  landlocked: boolean
  region: string
  subregion?: string
}

interface CountriesState {
  countries: Country[]
  isLoading: boolean
  error: string | null
  fetchCountries: () => Promise<void>
}

export const useCountriesStore = create<CountriesState>((set) => ({
  countries: [],
  isLoading: false,
  error: null,

  fetchCountries: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,cca2,population,latlng,landlocked,region,subregion'
      )
      if (!response.ok) throw new Error('Failed to fetch countries')

      const data: RestCountry[] = await response.json()

      const transformed = data
        .filter((c) => c.population > 100000)
        .map(transformCountry)
        .sort((a, b) => b.population - a.population)

      set({ countries: transformed, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },
}))

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
    healthcare: estimateHealthcare(wealth),
    hasAirport: rc.population > 500000,
    hasSeaport: !rc.landlocked,
    bordersOpen: true,
    airportsOpen: true,
    seaportsOpen: true,
    awareness: 0,
    researchContribution: 0,
  }
}

function estimateClimate(latlng: [number, number], region: string): Climate {
  const lat = Math.abs(latlng[0])
  if (lat > 60) return 'cold'
  if (
    region === 'Africa' &&
    (latlng[0] > 15 || latlng[0] < -20) &&
    Math.abs(latlng[0]) < 35
  )
    return 'arid'
  if (
    ['Saudi Arabia', 'UAE', 'Qatar', 'Iraq', 'Iran'].some((c) =>
      region.includes(c)
    )
  )
    return 'arid'
  if (lat < 23) return 'hot'
  return 'temperate'
}

function estimateWealth(country: RestCountry): WealthLevel {
  const { name, subregion, region, population } = country
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

  if (wealthyCountries.some((c) => name.common.includes(c))) return 'wealthy'
  if (
    subregion === 'Western Europe' ||
    subregion === 'Northern Europe' ||
    subregion === 'Northern America' ||
    subregion === 'Australia and New Zealand'
  )
    return 'wealthy'
  if (region === 'Africa' || subregion === 'South-Eastern Asia')
    return population > 50000000 ? 'developing' : 'poor'
  return 'developing'
}

function estimateHealthcare(wealth: WealthLevel): number {
  const base = { wealthy: 85, developing: 55, poor: 35 }[wealth] || 35
  const variance = Math.random() * 10 - 5
  return Math.min(100, Math.max(20, base + variance))
}
