'use client'

import {
  Airplane01Icon,
  GlobalIcon,
  Road01Icon,
  Shield01Icon,
  ShippingTruck01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { useSelectedCountry } from '~/libs/store/use-game-selectors'
import { useGameStore } from '~/libs/store/use-game-store'

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

function getClimateColor(climate: string): string {
  switch (climate) {
    case 'hot':
      return 'text-orange-400 bg-orange-500/10'
    case 'cold':
      return 'text-blue-400 bg-blue-500/10'
    case 'arid':
      return 'text-yellow-400 bg-yellow-500/10'
    default:
      return 'text-green-400 bg-green-500/10'
  }
}

function getWealthColor(wealth: string): string {
  switch (wealth) {
    case 'wealthy':
      return 'text-emerald-400 bg-emerald-500/10'
    case 'developing':
      return 'text-yellow-400 bg-yellow-500/10'
    default:
      return 'text-red-400 bg-red-500/10'
  }
}

const getTransportStatus = (has: boolean, open: boolean) => {
  if (!has) return 'None'
  return open ? 'Open' : 'Closed'
}

export default function CountryDetailSheet() {
  const country = useSelectedCountry()
  const setSelectedCountryId = useGameStore((state) => state.selectCountry)

  if (!country) return null

  const synchronizationRate =
    country.population > 0
      ? (country.synchronized / country.population) * 100
      : 0
  const unlinkedCount =
    country.population - country.synchronized - country.assimilated

  return (
    <Sheet
      open={!!country}
      onOpenChange={(open) => !open && setSelectedCountryId(null)}
    >
      <SheetContent className="w-[400px] sm:w-[480px] border-l border-white/10 bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className={`${getClimateColor(country.climate)} border-current`}
            >
              {country.climate.toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className={`${getWealthColor(country.wealth)} border-current`}
            >
              {country.wealth.toUpperCase()}
            </Badge>
            {country.isIsland && (
              <Badge
                variant="outline"
                className="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              >
                ISLAND
              </Badge>
            )}
          </div>
          <SheetTitle className="text-3xl font-black tracking-tight text-white">
            {country.name}
          </SheetTitle>
          <SheetDescription className="text-zinc-400 text-sm">
            {country.code} • Population: {formatNumber(country.population)}
          </SheetDescription>
        </SheetHeader>

        {}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Synchronization Progress
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {synchronizationRate.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={synchronizationRate}
              className="h-2 bg-zinc-800"
              indicatorClassName="bg-gradient-to-r from-cyan-600 to-cyan-400"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-cyan-400">
                  {formatNumber(country.synchronized)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Synchronized
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-magenta-400">
                  {formatNumber(country.assimilated)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Assimilated
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-zinc-400">
                  {formatNumber(unlinkedCount)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Unlinked
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={14}
                  className="text-yellow-500"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Awareness
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 font-mono">
                {country.awareness.toFixed(0)}%
              </div>
              <Progress
                value={country.awareness}
                className="h-1 mt-2 bg-zinc-800"
                indicatorClassName="bg-yellow-500"
              />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={14}
                  className="text-blue-500"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Cyber Resilience
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {country.healthcare}%
              </div>
              <Progress
                value={country.healthcare}
                className="h-1 mt-2 bg-zinc-800"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>

          {}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Infrastructure Status
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.airportsOpen
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <HugeiconsIcon icon={Airplane01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {getTransportStatus(country.hasAirport, country.airportsOpen)}
                </span>
              </div>
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.seaportsOpen
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <HugeiconsIcon icon={ShippingTruck01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {getTransportStatus(country.hasSeaport, country.seaportsOpen)}
                </span>
              </div>
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.bordersOpen
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <HugeiconsIcon icon={Road01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {country.bordersOpen ? 'Active' : 'Isolated'}
                </span>
              </div>
            </div>
          </div>

          {}
          {country.researchContribution > 0 && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={GlobalIcon}
                    size={16}
                    className="text-red-400"
                  />
                  <span className="text-sm font-bold text-red-300">
                    Contributing to Firewall Research
                  </span>
                </div>
                <span className="text-xs font-mono text-red-400">
                  +{country.researchContribution.toFixed(2)}/tick
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
