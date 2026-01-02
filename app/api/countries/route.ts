import { NextResponse } from 'next/server'
import type { Country, TransportRoute } from '~/libs/types/game'
import {
  createBidirectionalRoute,
  estimateClimate,
  estimateHealthcare,
  estimateWealth,
  getNearestNeighbors,
  type RestCountry,
} from '~/libs/utils/game-domain'
import { calculateDistance } from '~/libs/utils/math'

const REST_COUNTRIES_API =
  'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,population,latlng,landlocked,region,subregion'
const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

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
      fetch(GEOJSON_URL),
    ])

    const isSuccess = rcRes.ok && geoRes.ok
    if (!isSuccess) {
      throw new Error('Failed to fetch data from source APIs')
    }

    const rcData: RestCountry[] = await rcRes.json()
    const geoData: { features: GeoJsonFeature[] } = await geoRes.json()

    const geoMap = new Map<string, GeoJsonFeature['geometry']>()
    for (const feature of geoData.features) {
      const { ISO_A3, ISO_A2 } = feature.properties

      if (ISO_A3 && ISO_A3 !== '-99') {
        geoMap.set(ISO_A3, feature.geometry)
      } else if (ISO_A2 && ISO_A2 !== '-99') {
        geoMap.set(ISO_A2, feature.geometry)
      }
    }

    const countries: Country[] = rcData
      .filter((rc) => rc.population > 50000)
      .map((rc) => {
        const geometry = geoMap.get(rc.cca3) || geoMap.get(rc.cca2)
        const wealth = estimateWealth(rc)

        return {
          id: rc.cca2.toLowerCase(),
          name: rc.name.common,
          code: rc.cca2,
          population: rc.population,
          synchronized: 0,
          assimilated: 0,
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
          geometry,
        }
      })
      .filter((c: Country) => c.geometry)
      .sort((a, b) => b.population - a.population)

    const routes: TransportRoute[] = []
    const hubs = countries.slice(0, 15)

    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const from = hubs[i]
        const to = hubs[j]
        routes.push(...createBidirectionalRoute(from.id, to.id, 'air', 8))
      }
    }

    for (const country of countries) {
      const neighbors = getNearestNeighbors(country, countries, 5)
      for (const neighbor of neighbors) {
        const dist = calculateDistance(
          country.lat,
          country.lng,
          neighbor.lat,
          neighbor.lng
        )

        if (dist < 800 && !country.isIsland && !neighbor.isIsland) {
          routes.push(
            ...createBidirectionalRoute(country.id, neighbor.id, 'land', 9)
          )
        }

        if (dist < 3000) {
          routes.push(
            ...createBidirectionalRoute(country.id, neighbor.id, 'air', 5)
          )
        }

        if (dist < 4000 && country.hasSeaport && neighbor.hasSeaport) {
          routes.push(
            ...createBidirectionalRoute(country.id, neighbor.id, 'sea', 6)
          )
        }
      }
    }

    const uniqueRoutes = Array.from(
      new Map(routes.map((r) => [r.id, r])).values()
    )

    return NextResponse.json({ countries, routes: uniqueRoutes })
  } catch (error) {
    console.error('Error fetching country data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch country data' },
      { status: 500 }
    )
  }
}
