'use client'

import {
  Award01Icon,
  DnaIcon,
  GlobalIcon,
  RotateRight01Icon,
  SkullIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { resetGame } from '~/libs/features/game/game-slice'
import {
  selectGameStatus,
  selectGameSummary,
  selectInfectedCountryCount,
} from '~/libs/features/game/selectors'
import { useAppDispatch, useAppSelector } from '~/libs/hooks'

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return num.toString()
}

export default function GameOverScreen() {
  const dispatch = useAppDispatch()
  const gameStatus = useAppSelector(selectGameStatus)
  const summary = useAppSelector(selectGameSummary)
  const infectedCountries = useAppSelector(selectInfectedCountryCount)

  const isWin = gameStatus === 'won'

  const handlePlayAgain = () => {
    dispatch(resetGame())
  }

  if (gameStatus !== 'won' && gameStatus !== 'lost') {
    return null
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <Card className="w-[480px] p-8 relative overflow-hidden border-white/5 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl shadow-black rounded-3xl">
        {/* Background glow */}
        <div
          className={`absolute inset-0 ${
            isWin
              ? 'bg-gradient-to-br from-red-600/20 via-transparent to-purple-600/20'
              : 'bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20'
          }`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon & Title */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 ${
                isWin
                  ? 'bg-red-600 shadow-lg shadow-red-900/50'
                  : 'bg-blue-600 shadow-lg shadow-blue-900/50'
              }`}
            >
              <HugeiconsIcon
                icon={isWin ? SkullIcon : Award01Icon}
                size={40}
                className="text-white"
              />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              {isWin ? 'HUMANITY ERASED' : 'CURE DEPLOYED'}
            </h1>
            <p
              className={`text-sm font-medium ${isWin ? 'text-red-400' : 'text-blue-400'}`}
            >
              {isWin
                ? 'Your pathogen has wiped out all human life.'
                : 'Scientists found a cure. The disease was eradicated.'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={20}
                className="mx-auto mb-2 text-red-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {formatNumber(summary.infected)}
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                Total Infected
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={SkullIcon}
                size={20}
                className="mx-auto mb-2 text-purple-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {formatNumber(summary.dead)}
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                Total Dead
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={20}
                className="mx-auto mb-2 text-cyan-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {infectedCountries}/38
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                Countries
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <HugeiconsIcon
                  icon={DnaIcon}
                  size={16}
                  className="text-purple-400"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {summary.dnaPoints}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  DNA Spent
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <HugeiconsIcon
                  icon={Award01Icon}
                  size={16}
                  className="text-blue-400"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {summary.cureProgress.toFixed(0)}%
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Cure Progress
                </div>
              </div>
            </div>
          </div>

          {/* Play Again Button */}
          <Button
            onClick={handlePlayAgain}
            className={`w-full h-14 rounded-2xl text-lg font-black tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${
              isWin
                ? 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 shadow-red-900/40'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-900/40'
            }`}
          >
            <HugeiconsIcon
              icon={RotateRight01Icon}
              size={20}
              className="mr-2"
            />
            PLAY AGAIN
          </Button>
        </div>
      </Card>
    </div>
  )
}
