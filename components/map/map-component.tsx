'use client'

import { useEffect, useEffectEvent, useRef } from 'react'
import { GameMap } from '~/libs/map/game-map'
import { useGameStore } from '~/libs/store/use-game-store'
import 'ol/ol.css'

export default function MapComponent() {
  const status = useGameStore((state) => state.status)
  const countries = useGameStore((state) => state.countries)
  const dataAnomalies = useGameStore((state) => state.dataAnomalies)
  const selectCountry = useGameStore((state) => state.selectCountry)
  const initializeStartingNode = useGameStore(
    (state) => state.initializeStartingNode
  )
  const collectDataAnomaly = useGameStore((state) => state.collectDataAnomaly)

  const mapElement = useRef<HTMLDivElement>(null)
  const gameMap = useRef<GameMap | null>(null)

  const handleMapClick = useEffectEvent(
    (id: string, type: 'data' | 'country') => {
      if (type === 'data') {
        collectDataAnomaly(id)
      } else if (type === 'country') {
        const countryId = id
        if (status === 'selecting_start') {
          initializeStartingNode(countryId)
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
      gameMap.current.updateDataAnomalies(dataAnomalies)
    }
  }, [dataAnomalies])

  return (
    <div
      ref={mapElement}
      className="absolute inset-0 w-full h-full bg-zinc-950"
    />
  )
}
