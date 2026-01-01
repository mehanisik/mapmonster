'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '~/libs/store/use-game-store'

/**
 * SimulationEngine - Manages game ticks and simulation updates
 * This component runs the core game loop when the game is active
 */
export default function SimulationEngine() {
  const status = useGameStore((state) => state.status)
  const countries = useGameStore((state) => state.countries)
  const gameSpeed = useGameStore((state) => state.gameSpeed)
  const gameTick = useGameStore((state) => state.gameTick)
  const infectCountry = useGameStore((state) => state.infectCountry)
  const spawnDnaAnomaly = useGameStore((state) => state.spawnDnaAnomaly)

  const infectedCount = countries.filter((c) => c.infected > 0).length
  const initialized = useRef(false)

  // Start initial infection when game starts
  useEffect(() => {
    if (status === 'playing' && !initialized.current && infectedCount === 0) {
      initialized.current = true

      // Pick a random starting country (prefer developing/poor for balance)
      const eligibleCountries = countries.filter(
        (c) => c.wealth !== 'wealthy' && !c.isIsland
      )
      const startCountry =
        eligibleCountries[Math.floor(Math.random() * eligibleCountries.length)]

      if (startCountry) {
        infectCountry(startCountry.id, 1)
      }
    }

    // Reset initialization flag when game is reset
    if (status === 'menu') {
      initialized.current = false
    }
  }, [infectCountry, status, infectedCount, countries])

  // Main game tick loop
  const runTick = useCallback(() => {
    if (status !== 'playing') return
    gameTick()
  }, [gameTick, status])

  // Game loop with speed control
  useEffect(() => {
    if (status !== 'playing') return

    // Tick interval based on game speed: 1x=200ms, 2x=100ms, 3x=50ms
    const tickInterval = 200 / gameSpeed

    const interval = setInterval(runTick, tickInterval)

    return () => clearInterval(interval)
  }, [runTick, status, gameSpeed])

  // Spawn DNA anomalies periodically
  useEffect(() => {
    if (status !== 'playing') return

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        spawnDnaAnomaly()
      }
    }, 5000)

    return () => clearInterval(spawnInterval)
  }, [spawnDnaAnomaly, status])

  // This component doesn't render anything visible
  return null
}
