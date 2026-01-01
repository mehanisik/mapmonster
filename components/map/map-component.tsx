'use client'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import HeatmapLayer from 'ol/layer/Heatmap'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OlMap from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import View from 'ol/View'
import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '~/libs/store/use-game-store'
import 'ol/ol.css'

export default function MapComponent() {
  const status = useGameStore((state) => state.status)
  const countries = useGameStore((state) => state.countries)
  const dnaAnomalies = useGameStore((state) => state.dnaAnomalies)
  const selectCountry = useGameStore((state) => state.selectCountry)
  const infectCountry = useGameStore((state) => state.infectCountry)
  const collectDnaAnomaly = useGameStore((state) => state.collectDnaAnomaly)

  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<OlMap | null>(null)
  const countrySourceRef = useRef<VectorSource | null>(null)
  const dnaSourceRef = useRef<VectorSource | null>(null)
  const heatmapLayerRef = useRef<HeatmapLayer | null>(null)

  const infectedCountries = countries.filter((c) => c.infected > 0)

  // Refs for reactive state access in callbacks
  const countriesRef = useRef(countries)
  const dnaAnomaliesRef = useRef(dnaAnomalies)

  // Keep refs in sync
  useEffect(() => {
    countriesRef.current = countries
  }, [countries])

  useEffect(() => {
    dnaAnomaliesRef.current = dnaAnomalies
  }, [dnaAnomalies])

  // Map click handler
  const handleMapClick = useCallback(
    (e: { pixel: number[] }) => {
      const feature = mapRef.current?.forEachFeatureAtPixel(e.pixel, (f) => f)
      if (feature) {
        const id = feature.getId()?.toString()
        if (id) {
          if (id.startsWith('dna-')) {
            collectDnaAnomaly(id)
          } else if (id.startsWith('country-')) {
            const countryId = id.replace('country-', '')

            // If game just started and no infections, clicking a country starts infection
            if (status === 'playing' && infectedCountries.length === 0) {
              infectCountry(countryId, 1)
            } else {
              selectCountry(countryId)
            }
          }
        }
      }
    },
    [
      collectDnaAnomaly,
      infectCountry,
      selectCountry,
      status,
      infectedCountries.length,
    ]
  )

  // Initialize map
  useEffect(() => {
    if (!mapElement.current || mapRef.current) return

    countrySourceRef.current = new VectorSource()
    dnaSourceRef.current = new VectorSource()

    // DNA anomaly layer
    const dnaLayer = new VectorLayer({
      source: dnaSourceRef.current,
      style: new Style({
        image: new CircleStyle({
          radius: 14,
          fill: new Fill({ color: 'rgba(168, 85, 247, 0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: '🧬',
          scale: 1.4,
          font: '14px sans-serif',
          offsetY: -1,
        }),
      }),
      zIndex: 100,
    })

    // Heatmap for infection visualization
    heatmapLayerRef.current = new HeatmapLayer({
      source: countrySourceRef.current,
      blur: 40,
      radius: 30,
      gradient: [
        '#000000',
        '#330033',
        '#660066',
        '#cc0033',
        '#ff3300',
        '#ff6600',
      ],
      weight: (feature) => {
        const infected = feature.get('infected') || 0
        const population = feature.get('population') || 1
        return Math.min(1, (infected / population) * 20)
      },
      zIndex: 10,
    })

    // Country markers layer
    const countryLayer = new VectorLayer({
      source: countrySourceRef.current,
      style: (feature) => {
        const infected = feature.get('infected') || 0
        const population = feature.get('population') || 1
        const infectionRate = infected / population

        // Color based on infection rate
        let color = 'rgba(100, 100, 100, 0.6)' // Uninfected
        if (infectionRate > 0) {
          const intensity = Math.min(1, infectionRate * 10)
          const r = Math.floor(239 * intensity + 100 * (1 - intensity))
          const g = Math.floor(68 * intensity + 100 * (1 - intensity))
          const b = Math.floor(68 * intensity + 100 * (1 - intensity))
          color = `rgba(${r}, ${g}, ${b}, 0.8)`
        }

        return new Style({
          image: new CircleStyle({
            radius: infected > 0 ? 8 + Math.min(10, infectionRate * 50) : 6,
            fill: new Fill({ color }),
            stroke: new Stroke({
              color:
                infected > 0
                  ? 'rgba(255,255,255,0.8)'
                  : 'rgba(255,255,255,0.3)',
              width: infected > 0 ? 2 : 1,
            }),
          }),
          text:
            infected > 0
              ? new Text({
                  text: feature.get('name'),
                  font: 'bold 10px sans-serif',
                  fill: new Fill({ color: '#fff' }),
                  stroke: new Stroke({ color: '#000', width: 2 }),
                  offsetY: -18,
                })
              : undefined,
        })
      },
      zIndex: 20,
    })

    mapRef.current = new OlMap({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attributions:
              '© <a href="https://carto.com/attributions">CARTO</a>',
          }),
        }),
        heatmapLayerRef.current,
        countryLayer,
        dnaLayer,
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2.5,
        minZoom: 2,
        maxZoom: 8,
      }),
    })

    mapRef.current.on('click', handleMapClick)

    // Add pointer cursor on hover
    mapRef.current.on('pointermove', (e) => {
      const hit = mapRef.current?.hasFeatureAtPixel(e.pixel)
      if (mapElement.current) {
        mapElement.current.style.cursor = hit ? 'pointer' : ''
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined)
        mapRef.current = null
      }
    }
  }, [handleMapClick])

  // Update country features
  useEffect(() => {
    if (!countrySourceRef.current) return

    const features = countries.map((country) => {
      const f = new Feature({
        geometry: new Point(fromLonLat([country.lng, country.lat])),
        name: country.name,
        infected: country.infected,
        population: country.population,
        dead: country.dead,
      })
      f.setId(`country-${country.id}`)
      return f
    })

    countrySourceRef.current.clear()
    countrySourceRef.current.addFeatures(features)
  }, [countries])

  // Update DNA anomaly features
  useEffect(() => {
    if (!dnaSourceRef.current) return

    const features = dnaAnomalies.map((anomaly) => {
      const f = new Feature({
        geometry: new Point(fromLonLat([anomaly.lng, anomaly.lat])),
        points: anomaly.points,
      })
      f.setId(anomaly.id)
      return f
    })

    dnaSourceRef.current.clear()
    dnaSourceRef.current.addFeatures(features)
  }, [dnaAnomalies])

  return (
    <div className="relative w-full h-full bg-zinc-950">
      <div ref={mapElement} className="w-full h-full" />

      {/* Click hint for new game */}
      {status === 'playing' && infectedCountries.length === 0 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-purple-600/90 backdrop-blur-xl text-white text-sm font-bold animate-pulse shadow-xl shadow-purple-900/50">
          👆 Click a country to start the infection
        </div>
      )}
    </div>
  )
}
