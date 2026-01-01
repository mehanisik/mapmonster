'use client'

import { useEffect, useEffectEvent, useRef } from 'react'
import { GameMap } from '~/libs/map/game-map'
import { useGameStore } from '~/libs/store/use-game-store'
import 'ol/ol.css'

export default function MapComponent() {
  const status = useGameStore((state) => state.status)
  const countries = useGameStore((state) => state.countries)
  const dnaAnomalies = useGameStore((state) => state.dnaAnomalies)
  const selectCountry = useGameStore((state) => state.selectCountry)
  const infectStartingCountry = useGameStore(
    (state) => state.infectStartingCountry
  )
  const collectDnaAnomaly = useGameStore((state) => state.collectDnaAnomaly)

  const mapElement = useRef<HTMLDivElement>(null)
  const gameMap = useRef<GameMap | null>(null)

  const handleMapClick = useEffectEvent(
    (id: string, type: 'dna' | 'country') => {
      if (type === 'dna') {
        collectDnaAnomaly(id)
      } else if (type === 'country') {
        const countryId = id
        if (status === 'selecting_start') {
          infectStartingCountry(countryId)
        } else {
          selectCountry(countryId)
        }
      }
    }
  )

  useEffect(() => {
    if (!mapElement.current || gameMap.current) return
    gameMap.current = new GameMap(mapElement.current, handleMapClick)

    return () => {
      gameMap.current?.destroy()
      gameMap.current = null
    }
  }, [])

  useEffect(() => {
    if (gameMap.current && countries.length > 0) {
      gameMap.current.updateCountries(countries)
    }
  }, [countries])

  useEffect(() => {
    if (gameMap.current) {
      gameMap.current.updateDnaAnomalies(dnaAnomalies)
    }
  }, [dnaAnomalies])

  return (
    <div
      ref={mapElement}
      className="absolute inset-0 w-full h-full bg-zinc-950"
    />
  )
}
