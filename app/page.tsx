'use client'

import { useEffect } from 'react'
import CountryDetailSheet from '~/components/hud/country-detail-sheet'
import GameControls from '~/components/hud/game-controls'
import GameOverScreen from '~/components/hud/game-over-screen'
import NewsFeed from '~/components/hud/news-feed'
import WorldStatsPanel from '~/components/hud/world-stats-panel'
import MainMenu from '~/components/main-menu'
import MapComponent from '~/components/map/map-component'
import SimulationEngine from '~/components/simulation/simulation-engine'
import { useGameStore } from '~/libs/store/use-game-store'

export default function Home() {
  const status = useGameStore((state) => state.status)
  const initializeGame = useGameStore((state) => state.initializeGame)
  const isLoadingData = useGameStore((state) => state.isLoadingData)
  const isGameOver = status === 'won' || status === 'lost'

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-red-950 rounded-full" />
            <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-4 bg-red-600/20 rounded-full blur-xl animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-100 text-lg font-bold tracking-widest uppercase">
              MapMonster
            </span>
            <span className="text-zinc-500 text-sm font-medium tracking-wider animate-pulse">
              Synthesizing Global Geodata...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Map Background */}
      <MapComponent />

      {/* Main Menu Overlay */}
      <MainMenu />

      {/* Game Over Screen */}
      {isGameOver && <GameOverScreen />}

      {/* HUD Elements (only show when playing) */}
      {status === 'playing' && (
        <>
          {/* Top Stats Panel */}
          <WorldStatsPanel />

          {/* Bottom Right News Feed */}
          <div className="fixed bottom-24 right-4 w-[340px] z-40">
            <NewsFeed />
          </div>

          {/* Game Controls */}
          <GameControls />

          {/* Country Detail Sheet */}
          <CountryDetailSheet />
        </>
      )}

      {/* Simulation Engine (always runs when game is active) */}
      <SimulationEngine />
    </main>
  )
}
