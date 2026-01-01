'use client'

import CountryDetailSheet from '~/components/hud/country-detail-sheet'
import GameControls from '~/components/hud/game-controls'
import GameOverScreen from '~/components/hud/game-over-screen'
import NewsFeed from '~/components/hud/news-feed'
import WorldStatsPanel from '~/components/hud/world-stats-panel'
import MainMenu from '~/components/main-menu'
import MapComponent from '~/components/map/map-component'
import SimulationEngine from '~/components/simulation/simulation-engine'
import {
  selectGameStatus,
  selectIsGameOver,
} from '~/libs/features/game/selectors'
import { useAppSelector } from '~/libs/hooks'

export default function Home() {
  const gameStatus = useAppSelector(selectGameStatus)
  const isGameOver = useAppSelector(selectIsGameOver)

  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Map Background */}
      <MapComponent />

      {/* Main Menu Overlay */}
      <MainMenu />

      {/* Game Over Screen */}
      {isGameOver && <GameOverScreen />}

      {/* HUD Elements (only show when playing) */}
      {gameStatus === 'playing' && (
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
