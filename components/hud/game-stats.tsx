'use client'

import {
  GlobalIcon,
  UserGroupIcon as PopulationIcon,
  Shield01Icon as ShieldIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Progress } from '~/components/ui/progress'
import { useGameStore } from '~/libs/store/use-game-store'

export default function GameStats() {
  const countries = useGameStore((state) => state.countries)
  const cureProgress = useGameStore((state) => state.cure.progress)

  const totalInfected = countries.reduce((sum, c) => sum + c.infected, 0)
  const worldPopulation = countries.reduce((sum, c) => sum + c.population, 0)

  const infectionPercentage = (totalInfected / worldPopulation) * 100

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="fixed top-0 left-0 right-0 p-6 z-50 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-stretch gap-4 pointer-events-auto">
        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] px-6 py-3 flex items-center gap-4 shadow-2xl">
          <div className="p-2 bg-red-600 rounded-2xl shadow-lg shadow-red-900/20">
            <HugeiconsIcon
              icon={PopulationIcon}
              size={20}
              className="text-white"
            />
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Confirmed Assets
            </div>
            <div className="text-xl font-black text-white leading-none">
              {formatNumber(totalInfected)}
            </div>
          </div>
        </div>

        {}
        <div className="flex-1 bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] px-8 py-3 flex flex-col justify-center gap-2 shadow-2xl">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={14}
                className="text-purple-500"
              />
              Global Reach
            </div>
            <div className="text-xs font-mono font-black text-purple-400">
              {infectionPercentage < 0.001
                ? '< 0.001%'
                : `${infectionPercentage.toFixed(4)}%`}
            </div>
          </div>
          <Progress
            value={infectionPercentage}
            className="h-2 bg-white/5"
            indicatorClassName="bg-gradient-to-r from-purple-700 to-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] px-6 py-3 flex flex-col justify-center gap-2 shadow-2xl min-w-[200px]">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              <HugeiconsIcon
                icon={ShieldIcon}
                size={14}
                className="text-emerald-500"
              />
              Countermeasure
            </div>
            <div className="text-xs font-mono font-black text-emerald-400">
              {cureProgress.toFixed(1)}%
            </div>
          </div>
          <Progress
            value={cureProgress}
            className="h-1 bg-white/5"
            indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
        </div>
      </div>
    </div>
  )
}
