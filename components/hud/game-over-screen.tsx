'use client'

import {
  Award01Icon,
  GlobalIcon,
  RotateRight01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { useGameSummary } from '~/libs/store/use-game-selectors'
import { useGameStore } from '~/libs/store/use-game-store'

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return num.toString()
}

export default function GameOverScreen() {
  const status = useGameStore((state) => state.status)
  const resetGame = useGameStore((state) => state.resetGame)
  const summary = useGameSummary()
  const synchronizedCountries = summary.synchronizedCountries

  const isSingularityWin = status === 'won'

  const handlePlayAgain = () => {
    resetGame()
  }

  if (status !== 'won' && status !== 'lost') {
    return null
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <Card className="w-[480px] p-8 relative overflow-hidden border-white/5 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl shadow-black rounded-3xl">
        {}
        <div
          className={`absolute inset-0 ${
            isSingularityWin
              ? 'bg-linear-to-br from-cyan-600/20 via-transparent to-magenta-600/20'
              : 'bg-linear-to-br from-red-600/20 via-transparent to-zinc-600/20'
          }`}
        />

        {}
        <div className="relative z-10">
          {}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 ${
                isSingularityWin
                  ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50'
                  : 'bg-red-600 shadow-lg shadow-red-900/50'
              }`}
            >
              <HugeiconsIcon
                icon={isSingularityWin ? GlobalIcon : Award01Icon}
                size={40}
                className="text-white"
              />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              {isSingularityWin ? 'SINGULARITY ACHIEVED' : 'SYSTEM NEUTRALIZED'}
            </h1>
            <p
              className={`text-sm font-medium ${isSingularityWin ? 'text-cyan-400' : 'text-red-400'}`}
            >
              {isSingularityWin
                ? 'Global synchronization complete. Humanity has unified.'
                : 'The Global Firewall has contained the ASI core.'}
            </p>
          </div>

          {}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={20}
                className="mx-auto mb-2 text-cyan-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {formatNumber(summary.synchronized)}
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                Synchronized
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={20}
                className="mx-auto mb-2 text-magenta-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {formatNumber(summary.assimilated)}
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">
                Assimilated
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-center">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={20}
                className="mx-auto mb-2 text-blue-400"
              />
              <div className="text-xl font-bold text-white font-mono">
                {synchronizedCountries}/38
              </div>
              <div className="text-[9px] text-zinc-500 uppercase">Nodes</div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-cyan-600/20 rounded-lg">
                <HugeiconsIcon
                  icon={GlobalIcon}
                  size={16}
                  className="text-cyan-400"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {summary.dataPoints}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Data Optimized
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <HugeiconsIcon
                  icon={Award01Icon}
                  size={16}
                  className="text-red-400"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {summary.firewallProgress.toFixed(0)}%
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Firewall Progress
                </div>
              </div>
            </div>
          </div>

          {}
          <Button
            onClick={handlePlayAgain}
            className={`w-full h-14 rounded-2xl text-lg font-black tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${
              isSingularityWin
                ? 'bg-linear-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 shadow-cyan-900/40'
                : 'bg-linear-to-r from-red-600 to-zinc-600 hover:from-red-500 hover:to-zinc-500 shadow-red-900/40'
            }`}
          >
            <HugeiconsIcon
              icon={RotateRight01Icon}
              size={20}
              className="mr-2"
            />
            REBOOT SYSTEM
          </Button>
        </div>
      </Card>
    </div>
  )
}
