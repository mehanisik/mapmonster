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

  const synchronizedCountries = countries.filter((c) => c.synchronized > 0)
  const synchronizationPercentage =
    (summary.synchronized / summary.population) * 100
  const firewallProgress = summary.firewallProgress
  const dataPoints = summary.dataPoints

  return (
    <Card className="w-80 pointer-events-auto h-[600px] flex flex-col overflow-hidden border-white/5 bg-zinc-950/80 backdrop-blur-3xl shadow-2xl text-white">
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <MapMonsterLogo />
          <Badge
            variant="outline"
            className="font-mono text-[9px] py-0 px-2 border-white/10 text-cyan-500 bg-cyan-500/5"
          >
            V-SINGULARITY_2025
          </Badge>
        </div>
        <CardDescription className="text-[9px] uppercase font-black tracking-[0.3em] text-zinc-500">
          ASI Global Synchronization Interface
        </CardDescription>
      </CardHeader>

      <div className="px-6 mb-4 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>System Synchronization</span>
            <span className="text-cyan-400">
              {synchronizationPercentage.toFixed(4)}%
            </span>
          </div>
          <Progress
            value={synchronizationPercentage}
            className="h-1.5 bg-white/5"
            indicatorClassName="bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Global Firewall</span>
            <span className="text-red-400">{firewallProgress.toFixed(2)}%</span>
          </div>
          <Progress
            value={firewallProgress}
            className="h-1.5 bg-white/5"
            indicatorClassName="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          />
        </div>
      </div>

      <Tabs
        defaultValue="monitor"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-6 mb-2">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-zinc-900 p-1">
            <TabsTrigger
              value="monitor"
              className="rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400"
            >
              <HugeiconsIcon icon={ActivityIcon} size={14} className="mr-2" />
              Nodes
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400"
            >
              <HugeiconsIcon icon={Settings02Icon} size={14} className="mr-2" />
              Core
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-6">
          <TabsContent value="monitor" className="space-y-6 mt-2 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <HugeiconsIcon icon={ShieldIcon} size={12} />
                Synchronized Nodes
              </div>
              <div className="space-y-2">
                {synchronizedCountries.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="group p-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={TargetIcon}
                          size={10}
                          className="text-cyan-500"
                        />
                        <span className="text-[10px] font-mono font-bold text-zinc-500">
                          {c.code}
                        </span>
                      </div>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 uppercase tracking-tighter">
                        Active
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight mb-2 truncate">
                      {c.name}
                    </div>
                    <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                      <span>
                        {((c.synchronized / c.population) * 100).toFixed(1)}%
                        Reach
                      </span>
                      <span>{c.climate}</span>
                    </div>
                  </div>
                ))}
              </div>
              {synchronizedCountries.length > 5 && (
                <div className="text-center text-[9px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900/30 py-2 rounded-xl border border-dashed border-white/5">
                  + {synchronizedCountries.length - 5} More Nodes
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <HugeiconsIcon
                  icon={ZapIcon}
                  size={12}
                  className="text-cyan-400"
                />
                Live Network Stream
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[8px] text-zinc-500 uppercase font-black">
                    DATA_BUFFER
                  </div>
                  <div className="text-xs font-mono font-black text-cyan-400">
                    {dataPoints}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[8px] text-zinc-500 uppercase font-black">
                    SYNC_REACH
                  </div>
                  <div className="text-xs font-mono font-black text-magenta-400">
                    {summary.synchronized > 1000000
                      ? `${(summary.synchronized / 1000000).toFixed(1)}M`
                      : summary.synchronized.toLocaleString()}
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
