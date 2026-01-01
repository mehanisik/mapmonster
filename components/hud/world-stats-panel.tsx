'use client'

import {
  DnaIcon,
  GlobalIcon,
  Shield01Icon as ShieldIcon,
  SkullIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Progress } from '~/components/ui/progress'
import { useGameSummary } from '~/libs/store/use-game-selectors'
import { useGameStore } from '~/libs/store/use-game-store'

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export default function WorldStatsPanel() {
  const summary = useGameSummary()
  const cure = useGameStore((state) => state.cure)
  const infectedCountries = summary.infectedCountries

  const infectionPercentage = (summary.infected / summary.population) * 100

  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-stretch gap-3 pointer-events-auto">
        {/* Infected Stats */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-900/30">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={18}
              className="text-white"
            />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Infected
            </div>
            <div className="text-xl font-black text-red-400 leading-none font-mono">
              {formatNumber(summary.infected)}
            </div>
          </div>
        </div>

        {/* Dead Stats */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/30">
            <HugeiconsIcon icon={SkullIcon} size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Dead
            </div>
            <div className="text-xl font-black text-purple-400 leading-none font-mono">
              {formatNumber(summary.dead)}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-1 bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-5 py-3 flex flex-col justify-center gap-1.5 shadow-xl">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={12}
                className="text-red-500"
              />
              Global Infection
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-zinc-500">
                {infectedCountries}/38 countries
              </span>
              <span className="text-xs font-mono font-bold text-red-400">
                {infectionPercentage < 0.001
                  ? '<0.001%'
                  : `${infectionPercentage.toFixed(3)}%`}
              </span>
            </div>
          </div>
          <Progress
            value={infectionPercentage}
            className="h-2 bg-white/5"
            indicatorClassName="bg-gradient-to-r from-red-700 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          />
        </div>

        {/* Cure Progress */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-5 py-3 flex flex-col justify-center gap-1.5 shadow-xl min-w-[180px]">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <HugeiconsIcon
                icon={ShieldIcon}
                size={12}
                className="text-blue-500"
              />
              Cure
            </div>
            <div className="text-xs font-mono font-bold text-blue-400">
              {cure.progress.toFixed(1)}%
            </div>
          </div>
          <Progress
            value={cure.progress}
            className="h-1.5 bg-white/5"
            indicatorClassName={`${
              cure.isDetected ? 'bg-blue-500' : 'bg-zinc-700'
            } shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
          />
          {!cure.isDetected && (
            <div className="text-[8px] text-zinc-600 text-right">
              Undetected
            </div>
          )}
        </div>

        {/* DNA Points */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-purple-500/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/40">
            <HugeiconsIcon icon={DnaIcon} size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              DNA
            </div>
            <div className="text-xl font-black text-purple-400 leading-none font-mono">
              {summary.dnaPoints}
            </div>
          </div>
        </div>

        {/* Disease Stats */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 shadow-xl">
          <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            Disease
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-sm font-bold text-red-400 font-mono">
                {summary.infectivity}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">INF</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-400 font-mono">
                {summary.severity}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">SEV</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-purple-400 font-mono">
                {summary.lethality}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">LTH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
