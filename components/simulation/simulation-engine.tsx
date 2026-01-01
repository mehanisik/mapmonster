'use client'

import { useCallback, useEffect } from 'react'
import { useGameStore } from '~/libs/store/use-game-store'

/**
 * SimulationEngine - Manages game ticks and simulation updates
 * This component runs the core game loop when the game is active
 */
export default function SimulationEngine() {
  const status = useGameStore((state) => state.status)
  const gameTick = useGameStore((state) => state.gameTick)
  const gameSpeed = useGameStore((state) => state.gameSpeed)
  const spawnDnaAnomaly = useGameStore((state) => state.spawnDnaAnomaly)

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
