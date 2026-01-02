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
  const firewallProgress = useGameStore((state) => state.firewall.progress)

  const totalSynchronized = countries.reduce(
    (sum, c) => sum + c.synchronized,
    0
  )
  const worldPopulation = countries.reduce((sum, c) => sum + c.population, 0)

  const synchronizationPercentage = (totalSynchronized / worldPopulation) * 100

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
          <div className="p-2 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-900/20">
            <HugeiconsIcon
              icon={PopulationIcon}
              size={20}
              className="text-white"
            />
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Synchronized Nodes
            </div>
            <div className="text-xl font-black text-white leading-none">
              {formatNumber(totalSynchronized)}
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
                className="text-cyan-500"
              />
              System Synchronization
            </div>
            <div className="text-xs font-mono font-black text-cyan-400">
              {synchronizationPercentage < 0.001
                ? '< 0.001%'
                : `${synchronizationPercentage.toFixed(4)}%`}
            </div>
          </div>
          <Progress
            value={synchronizationPercentage}
            className="h-2 bg-white/5"
            indicatorClassName="bg-gradient-to-r from-cyan-700 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] px-6 py-3 flex flex-col justify-center gap-2 shadow-2xl min-w-[200px]">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              <HugeiconsIcon
                icon={ShieldIcon}
                size={14}
                className="text-red-500"
              />
              Global Firewall
            </div>
            <div className="text-xs font-mono font-black text-red-400">
              {firewallProgress.toFixed(1)}%
            </div>
          </div>
          <Progress
            value={firewallProgress}
            className="h-1 bg-white/5"
            indicatorClassName="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
          />
        </div>
      </div>
    </div>
  )
}
