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
  const spawnDataAnomaly = useGameStore((state) => state.spawnDataAnomaly)

  const runTick = useCallback(() => {
    if (status !== 'playing') return
    gameTick()
  }, [status, gameTick])

  useEffect(() => {
    if (status !== 'playing') return

    const tickInterval = 200 / gameSpeed

    const interval = setInterval(runTick, tickInterval)

    return () => clearInterval(interval)
  }, [status, gameSpeed, runTick])

  useEffect(() => {
    if (status !== 'playing') return

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        spawnDataAnomaly()
      }
    }, 5000)

    return () => clearInterval(spawnInterval)
  }, [spawnDataAnomaly, status])

  return null
}
