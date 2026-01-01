/**
 * Domain Helpers - Country and Simulation logic
 */

import type {
  Climate,
  Country,
  RouteType,
  TransportRoute,
  WealthLevel,
} from '~/libs/types/game'
import { calculateDistance } from './math'

export interface RestCountry {
  name: { common: string }
  cca2: string
  cca3: string
  population: number
  latlng: [number, number]
  landlocked: boolean
  region: string
  subregion: string
}

export function estimateClimate(
  latlng: [number, number],
  region: string
): Climate {
  if (!latlng || latlng.length < 2) return 'temperate'
  const lat = Math.abs(latlng[0])
  if (lat > 60) return 'cold'
  const isNorthernAfrica = latlng[0] > 15 && latlng[0] < 35
  const isSouthernAfrica = latlng[0] < -20 && latlng[0] > -35
  if (region === 'Africa' && (isNorthernAfrica || isSouthernAfrica)) {
    return 'arid'
  }
  if (lat < 23) return 'hot'
  return 'temperate'
}

export function estimateWealth(country: RestCountry): WealthLevel {
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

export function estimateHealthcare(wealth: WealthLevel): number {
  const base = { wealthy: 85, developing: 55, poor: 35 }[wealth] || 35
  return Math.min(100, Math.max(20, base + (Math.random() * 10 - 5)))
}

export function createBidirectionalRoute(
  from: string,
  to: string,
  type: RouteType,
  traffic: number
): TransportRoute[] {
  const id = `${type}-${from}-${to}`
  return [
    { id: `${id}-a`, type, from, to, traffic },
    { id: `${id}-b`, type, from: to, to: from, traffic },
  ]
}

export function getNearestNeighbors(
  country: Country,
  all: Country[],
  limit: number
): Country[] {
  return all
    .filter((c) => c.id !== country.id)
    .map((c) => ({
      country: c,
      dist: calculateDistance(country.lat, country.lng, c.lat, c.lng),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map((n) => n.country)
}
