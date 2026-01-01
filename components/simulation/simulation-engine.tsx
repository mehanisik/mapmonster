'use client'

import { useEffect } from 'react'
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

  const runTick = () => {
    if (status !== 'playing') return
    gameTick()
  }

  useEffect(() => {
    if (status !== 'playing') return

    const tickInterval = 200 / gameSpeed

    const interval = setInterval(runTick, tickInterval)

    return () => clearInterval(interval)
  }, [status, gameSpeed])

  useEffect(() => {
    if (status !== 'playing') return

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        spawnDnaAnomaly()
      }
    }, 5000)

    return () => clearInterval(spawnInterval)
  }, [spawnDnaAnomaly, status])

  return null
}
