"use client";

import {
  Airplane01Icon,
  GlobalIcon,
  Road01Icon,
  Shield01Icon,
  ShippingTruck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { selectCountry } from "~/lib/features/game/game-slice";
import { selectSelectedCountry } from "~/lib/features/game/selectors";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function getClimateColor(climate: string): string {
  switch (climate) {
    case "hot":
      return "text-orange-400 bg-orange-500/10";
    case "cold":
      return "text-blue-400 bg-blue-500/10";
    case "arid":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-green-400 bg-green-500/10";
  }
}

function getWealthColor(wealth: string): string {
  switch (wealth) {
    case "wealthy":
      return "text-emerald-400 bg-emerald-500/10";
    case "developing":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-red-400 bg-red-500/10";
  }
}

export default function CountryDetailSheet() {
  const dispatch = useAppDispatch();
  const country = useAppSelector(selectSelectedCountry);

  if (!country) return null;

  const infectionRate =
    country.population > 0 ? (country.infected / country.population) * 100 : 0;
  const _deathRate =
    country.population > 0 ? (country.dead / country.population) * 100 : 0;
  const healthyCount = country.population - country.infected - country.dead;

  return (
    <Sheet
      open={!!country}
      onOpenChange={(open) => !open && dispatch(selectCountry(null))}
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

        {/* Infection Stats */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Infection Status
              </span>
              <span className="text-xs font-mono text-red-400">
                {infectionRate.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={infectionRate}
              className="h-2 bg-zinc-800"
              indicatorClassName="bg-gradient-to-r from-red-600 to-red-400"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-red-400">
                  {formatNumber(country.infected)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Infected
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-purple-400">
                  {formatNumber(country.dead)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">Dead</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-zinc-800/50">
                <div className="text-lg font-bold text-emerald-400">
                  {formatNumber(healthyCount)}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase">
                  Healthy
                </div>
              </div>
            </div>
          </div>

          {/* Awareness & Healthcare */}
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
                  className="text-emerald-500"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Healthcare
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {country.healthcare}%
              </div>
              <Progress
                value={country.healthcare}
                className="h-1 mt-2 bg-zinc-800"
                indicatorClassName="bg-emerald-500"
              />
            </div>
          </div>

          {/* Transport Status */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Transport Status
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.airportsOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <HugeiconsIcon icon={Airplane01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {country.hasAirport
                    ? country.airportsOpen
                      ? "Open"
                      : "Closed"
                    : "None"}
                </span>
              </div>
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.seaportsOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <HugeiconsIcon icon={ShippingTruck01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {country.hasSeaport
                    ? country.seaportsOpen
                      ? "Open"
                      : "Closed"
                    : "None"}
                </span>
              </div>
              <div
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  country.bordersOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <HugeiconsIcon icon={Road01Icon} size={20} />
                <span className="text-[9px] font-bold mt-1 uppercase">
                  {country.bordersOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>

          {/* Research Contribution */}
          {country.researchContribution > 0 && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={GlobalIcon}
                    size={16}
                    className="text-blue-400"
                  />
                  <span className="text-sm font-bold text-blue-300">
                    Contributing to Cure Research
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-400">
                  +{country.researchContribution.toFixed(2)}/tick
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
