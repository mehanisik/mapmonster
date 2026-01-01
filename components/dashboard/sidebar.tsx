'use client'

import {
  ActivityIcon,
  Settings02Icon,
  Shield01Icon as ShieldIcon,
  Target02Icon as TargetIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '~/components/ui/badge'
import { Card, CardDescription, CardHeader } from '~/components/ui/card'
import { MapMonsterLogo } from '~/components/ui/logo'
import { Progress } from '~/components/ui/progress'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useGameSummary } from '~/libs/store/use-game-selectors'
import { useGameStore } from '~/libs/store/use-game-store'
import EvolutionLab from './evolution-lab'

export default function Sidebar() {
  const countries = useGameStore((state) => state.countries)
  const summary = useGameSummary()

  const infectedCountries = countries.filter((c) => c.infected > 0)
  const infectionPercentage = (summary.infected / summary.population) * 100
  const cureProgress = summary.cureProgress
  const dnaPoints = summary.dnaPoints

  return (
    <Card className="w-80 pointer-events-auto h-[600px] flex flex-col overflow-hidden border-black/5 bg-white/70 backdrop-blur-3xl shadow-2xl">
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <MapMonsterLogo />
          <Badge
            variant="outline"
            className="font-mono text-[9px] py-0 px-2 border-black/10 text-zinc-400 bg-white/50"
          >
            V-CHAOS_0.1
          </Badge>
        </div>
        <CardDescription className="text-[9px] uppercase font-black tracking-[0.3em] text-zinc-400">
          Global Chaos Pathogen Controller
        </CardDescription>
      </CardHeader>

      <div className="px-6 mb-4 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Infection Progress</span>
            <span className="text-purple-600">
              {infectionPercentage.toFixed(4)}%
            </span>
          </div>
          <Progress
            value={infectionPercentage}
            className="h-1.5 bg-zinc-100"
            indicatorClassName="bg-purple-600"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Stability Patch (Cure)</span>
            <span className="text-emerald-600">{cureProgress.toFixed(2)}%</span>
          </div>
          <Progress
            value={cureProgress}
            className="h-1.5 bg-zinc-100"
            indicatorClassName="bg-emerald-500"
          />
        </div>
      </div>

      <Tabs
        defaultValue="monitor"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-6 mb-2">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-zinc-100/50 p-1">
            <TabsTrigger
              value="monitor"
              className="rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <HugeiconsIcon icon={ActivityIcon} size={14} className="mr-2" />
              Infection
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <HugeiconsIcon icon={Settings02Icon} size={14} className="mr-2" />
              Evolution
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-6">
          <TabsContent value="monitor" className="space-y-6 mt-2 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <HugeiconsIcon icon={ShieldIcon} size={12} />
                Active Hotspots
              </div>
              <div className="space-y-2">
                {infectedCountries.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="group p-3 rounded-2xl bg-zinc-50 border border-black/3 hover:border-purple-500/30 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={TargetIcon}
                          size={10}
                          className="text-purple-500"
                        />
                        <span className="text-[10px] font-mono font-bold text-zinc-400">
                          {c.code}
                        </span>
                      </div>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-tighter">
                        Infected
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight mb-2 truncate">
                      {c.name}
                    </div>
                    <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                      <span>
                        {((c.infected / c.population) * 100).toFixed(1)}% Reach
                      </span>
                      <span>{c.climate}</span>
                    </div>
                  </div>
                ))}
              </div>
              {infectedCountries.length > 5 && (
                <div className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-50 py-2 rounded-xl border border-dashed border-zinc-200">
                  + {infectedCountries.length - 5} More Regions
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <HugeiconsIcon
                  icon={ZapIcon}
                  size={12}
                  className="text-yellow-400"
                />
                Live Stat Stream
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[8px] text-zinc-500 uppercase font-black">
                    DNA_BANK
                  </div>
                  <div className="text-xs font-mono font-black text-purple-400">
                    {dnaPoints}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[8px] text-zinc-500 uppercase font-black">
                    INFECTED
                  </div>
                  <div className="text-xs font-mono font-black">
                    {summary.infected > 1000000
                      ? `${(summary.infected / 1000000).toFixed(1)}M`
                      : summary.infected.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="mt-2">
            <EvolutionLab />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  )
}
