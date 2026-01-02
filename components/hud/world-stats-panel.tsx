'use client'

import {
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
  const firewall = useGameStore((state) => state.firewall)
  const synchronizedCountries = summary.synchronizedCountries

  const synchronizationPercentage =
    (summary.synchronized / summary.population) * 100

  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-stretch gap-3 pointer-events-auto">
        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-cyan-600 rounded-xl shadow-lg shadow-cyan-900/30">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={18}
              className="text-white"
            />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Synchronized
            </div>
            <div className="text-xl font-black text-cyan-400 leading-none font-mono">
              {formatNumber(summary.synchronized)}
            </div>
          </div>
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-magenta-600 rounded-xl shadow-lg shadow-magenta-900/30">
            <HugeiconsIcon icon={SkullIcon} size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Assimilated
            </div>
            <div className="text-xl font-black text-magenta-400 leading-none font-mono">
              {formatNumber(summary.assimilated)}
            </div>
          </div>
        </div>

        {}
        <div className="flex-1 bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-5 py-3 flex flex-col justify-center gap-1.5 shadow-xl">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <HugeiconsIcon
                icon={GlobalIcon}
                size={12}
                className="text-cyan-500"
              />
              Global Synchronization
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-zinc-500">
                {synchronizedCountries}/38 nodes
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {synchronizationPercentage < 0.001
                  ? '<0.001%'
                  : `${synchronizationPercentage.toFixed(3)}%`}
              </span>
            </div>
          </div>
          <Progress
            value={synchronizationPercentage}
            className="h-2 bg-white/5"
            indicatorClassName="bg-gradient-to-r from-cyan-700 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-5 py-3 flex flex-col justify-center gap-1.5 shadow-xl min-w-[180px]">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <HugeiconsIcon
                icon={ShieldIcon}
                size={12}
                className="text-red-500"
              />
              Global Firewall
            </div>
            <div className="text-xs font-mono font-bold text-red-400">
              {firewall.progress.toFixed(1)}%
            </div>
          </div>
          <Progress
            value={firewall.progress}
            className="h-1.5 bg-white/5"
            indicatorClassName={`${
              firewall.isDetected ? 'bg-red-500' : 'bg-zinc-700'
            } shadow-[0_0_10px_rgba(239,68,68,0.3)]`}
          />
          {!firewall.isDetected && (
            <div className="text-[8px] text-zinc-600 text-right">
              Undetected
            </div>
          )}
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="p-2 bg-cyan-600 rounded-xl shadow-lg shadow-cyan-900/40">
            <HugeiconsIcon icon={GlobalIcon} size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Data/Watts
            </div>
            <div className="text-xl font-black text-cyan-400 leading-none font-mono">
              {summary.dataPoints}
            </div>
          </div>
        </div>

        {}
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 shadow-xl">
          <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            Singularity
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-sm font-bold text-cyan-400 font-mono">
                {summary.infectivity}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">SYNC</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-blue-400 font-mono">
                {summary.severity}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">SEV</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-magenta-400 font-mono">
                {summary.lethality}
              </div>
              <div className="text-[7px] text-zinc-600 uppercase">ASIM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
