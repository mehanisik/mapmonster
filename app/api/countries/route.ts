import { NextResponse } from 'next/server'
import type { Climate, Country, WealthLevel, TransportRoute, RouteType } from '~/libs/types/game'

// URLs for the data
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,population,latlng,landlocked,region,subregion'
const GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

interface RestCountry {
  name: { common: string }
  cca2: string
  cca3: string
  population: number
  latlng: [number, number]
  landlocked: boolean
  region: string
  subregion: string
}

interface GeoJsonFeature {
  type: 'Feature'
  geometry: {
    type: string
    coordinates: unknown[]
  }
  properties: {
    ISO_A3: string
    ISO_A2: string
    NAME: string
    [key: string]: string | number
  }
}

export async function GET() {
  try {
    const [rcRes, geoRes] = await Promise.all([
      fetch(REST_COUNTRIES_API),
      fetch(GEOJSON_URL)
    ])

    const isSuccess = rcRes.ok && geoRes.ok
    if (!isSuccess) {
      throw new Error('Failed to fetch data from source APIs')
    }

    const rcData: RestCountry[] = await rcRes.json()
    const geoData: { features: GeoJsonFeature[] } = await geoRes.json()

    // Create a map of ISO alpha-3 to geometry for joining
    const geoMap = new Map<string, GeoJsonFeature['geometry']>()
    for (const feature of geoData.features) {
      const { ISO_A3, ISO_A2 } = feature.properties
      
      // Some Natural Earth features have -99 for missing ISO codes
      if (ISO_A3 && ISO_A3 !== '-99') {
        geoMap.set(ISO_A3, feature.geometry)
      } else if (ISO_A2 && ISO_A2 !== '-99') {
        geoMap.set(ISO_A2, feature.geometry)
      }
    }

    const countries: Country[] = rcData
      .filter((rc) => rc.population > 50000) // Filter out very small territories
      .map((rc) => {
        const geometry = geoMap.get(rc.cca3) || geoMap.get(rc.cca2)
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
          hasAirport: rc.population > 1000000,
          hasSeaport: !rc.landlocked,
          bordersOpen: true,
          airportsOpen: true,
          seaportsOpen: true,
          awareness: 0,
          researchContribution: 0,
          geometry
        }
      })
      .filter((c: Country) => c.geometry) // Only include countries with geometry
      .sort((a, b) => b.population - a.population)

    // Generate Routes
    const routes: TransportRoute[] = []
    const hubs = countries.slice(0, 15) // Top 15 as major hubs

    // 1. Air Hub Connections
    for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
            const from = hubs[i]
            const to = hubs[j]
            routes.push(...createBidirectionalRoute(from.id, to.id, 'air', 8))
        }
    }

    // 2. Proximity-based routes (Land and Local Air)
    for (const country of countries) {
        const neighbors = getNearestNeighbors(country, countries, 5)
        for (const neighbor of neighbors) {
            const dist = calculateDistance(country.lat, country.lng, neighbor.lat, neighbor.lng)
            
            // Land borders (if very close and both not islands)
            if (dist < 800 && !country.isIsland && !neighbor.isIsland) {
                routes.push(...createBidirectionalRoute(country.id, neighbor.id, 'land', 9))
            }
            
            // Regional Air
            if (dist < 3000) {
                routes.push(...createBidirectionalRoute(country.id, neighbor.id, 'air', 5))
            }

            // Regional Sea (if both have seaports)
            if (dist < 4000 && country.hasSeaport && neighbor.hasSeaport) {
                routes.push(...createBidirectionalRoute(country.id, neighbor.id, 'sea', 6))
            }
        }
    }

    // De-duplicate routes by ID
    const uniqueRoutes = Array.from(new Map(routes.map(r => [r.id, r])).values())

    return NextResponse.json({ countries, routes: uniqueRoutes })
  } catch (error) {
    console.error('Error fetching country data:', error)
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 })
  }
}

function createBidirectionalRoute(from: string, to: string, type: RouteType, traffic: number): TransportRoute[] {
    const id = `${type}-${from}-${to}`
    return [
        { id: `${id}-a`, type, from, to, traffic },
        { id: `${id}-b`, type, from: to, to: from, traffic },
    ]
}

function getNearestNeighbors(country: Country, all: Country[], limit: number) {
    return all
        .filter(c => c.id !== country.id)
        .map(c => ({
            country: c,
            dist: calculateDistance(country.lat, country.lng, c.lat, c.lng)
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, limit)
        .map(n => n.country)
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Helpers (Copied and adapted from use-countries-store.ts)
function estimateClimate(latlng: [number, number], region: string): Climate {
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

function estimateWealth(country: RestCountry): WealthLevel {
  const { name, subregion, region, population } = country
  const wealthyCountries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan',
    'Australia', 'Norway', 'Sweden', 'Switzerland', 'Netherlands', 'South Korea',
    'Singapore', 'New Zealand', 'Austria', 'Belgium', 'Denmark', 'Finland',
    'Ireland', 'Iceland', 'Luxembourg', 'Israel', 'United Arab Emirates',
    'Qatar', 'Kuwait', 'Saudi Arabia'
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
  return Math.min(100, Math.max(20, base + (Math.random() * 10 - 5)))
}
