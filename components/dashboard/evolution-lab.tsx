'use client'

import {
  DnaIcon,
  Shield01Icon as ShieldIcon,
  Bug01Icon as VirusIcon,
  WifiIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  ABILITIES,
  canPurchaseTrait,
  SYMPTOMS,
  TRANSMISSIONS,
} from '~/libs/data/traits-config'
import { useOwnedTraitIds } from '~/libs/store/use-game-selectors'
import { useGameStore } from '~/libs/store/use-game-store'
import type { TraitConfig } from '~/libs/types/game'

interface TraitCardProps {
  trait: TraitConfig
  isOwned: boolean
  canAfford: boolean
  canPurchase: boolean
  onPurchase: () => void
}

function TraitCard({
  trait,
  isOwned,
  canAfford,
  canPurchase,
  onPurchase,
}: TraitCardProps) {
  let cardStyles = 'bg-zinc-900/40 border-white/5 opacity-50'
  if (isOwned) {
    cardStyles = 'bg-emerald-500/10 border-emerald-500/30'
  } else if (canPurchase) {
    cardStyles =
      'bg-zinc-900/80 border-white/10 hover:border-purple-500/50 hover:shadow-lg'
  }

  let buttonLabel = 'Need DNA'
  if (canPurchase) {
    buttonLabel = 'Evolve'
  } else if (canAfford) {
    buttonLabel = 'Locked'
  }

  return (
    <div
      className={`group p-4 rounded-2xl border transition-all duration-300 ${cardStyles}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">{trait.name}</div>
          <div className="text-[10px] text-zinc-500 font-medium leading-relaxed">
            {trait.description}
          </div>
        </div>
        {!isOwned && (
          <Badge
            variant="outline"
            className={`ml-2 shrink-0 text-[10px] font-mono ${
              canAfford
                ? 'border-purple-500/50 text-purple-400'
                : 'border-zinc-700 text-zinc-600'
            }`}
          >
            {trait.cost} DNA
          </Badge>
        )}
        {isOwned && (
          <Badge className="ml-2 shrink-0 bg-emerald-500 text-white text-[8px] font-bold">
            ✓
          </Badge>
        )}
      </div>

      {}
      <div className="flex gap-2 mt-3 flex-wrap">
        {trait.infectivity > 0 && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-mono">
            +{trait.infectivity} INF
          </span>
        )}
        {trait.severity > 0 && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-mono">
            +{trait.severity} SEV
          </span>
        )}
        {trait.lethality > 0 && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono">
            +{trait.lethality} LTH
          </span>
        )}
      </div>

      {}
      {trait.prerequisites.length > 0 && !isOwned && (
        <div className="mt-2 text-[9px] text-zinc-600">
          Requires: {trait.prerequisites.join(', ')}
        </div>
      )}

      {}
      {!isOwned && (
        <Button
          size="sm"
          disabled={!canPurchase}
          onClick={onPurchase}
          className={`w-full mt-3 h-8 text-[10px] font-bold rounded-xl transition-all ${
            canPurchase
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  )
}

export default function EvolutionLab() {
  const dnaPoints = useGameStore((state) => state.dnaPoints)
  const purchaseTrait = useGameStore((state) => state.purchaseTrait)
  const ownedTraitIds = useOwnedTraitIds()

  const handlePurchase = (traitId: string) => {
    purchaseTrait(traitId)
  }

  const renderTraitList = (traits: Record<string, TraitConfig>) => {
    return Object.values(traits).map((trait) => {
      const isOwned = ownedTraitIds.includes(trait.id)
      const canAfford = dnaPoints >= trait.cost
      const canPurchase = canPurchaseTrait(trait.id, ownedTraitIds, dnaPoints)

      return (
        <TraitCard
          key={trait.id}
          trait={trait}
          isOwned={isOwned}
          canAfford={canAfford}
          canPurchase={canPurchase}
          onPurchase={() => handlePurchase(trait.id)}
        />
      )
    })
  }

  return (
    <div className="space-y-4">
      {}
      <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/30">
            <HugeiconsIcon icon={DnaIcon} size={20} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Available DNA
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {dnaPoints}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-zinc-600 uppercase tracking-wider">
            Evolved
          </div>
          <div className="text-lg font-bold text-purple-400">
            {ownedTraitIds.length}
          </div>
        </div>
      </div>

      {}
      <Tabs defaultValue="transmission" className="w-full">
        <TabsList className="w-full bg-zinc-900/60 border border-white/5 p-1 rounded-2xl">
          <TabsTrigger
            value="transmission"
            className="flex-1 rounded-xl text-[10px] font-bold data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
          >
            <HugeiconsIcon icon={WifiIcon} size={12} className="mr-1.5" />
            Transmission
          </TabsTrigger>
          <TabsTrigger
            value="symptoms"
            className="flex-1 rounded-xl text-[10px] font-bold data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
          >
            <HugeiconsIcon icon={VirusIcon} size={12} className="mr-1.5" />
            Symptoms
          </TabsTrigger>
          <TabsTrigger
            value="abilities"
            className="flex-1 rounded-xl text-[10px] font-bold data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <HugeiconsIcon icon={ShieldIcon} size={12} className="mr-1.5" />
            Abilities
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[400px] mt-4">
          <TabsContent value="transmission" className="mt-0">
            <div className="grid gap-3">{renderTraitList(TRANSMISSIONS)}</div>
          </TabsContent>

          <TabsContent value="symptoms" className="mt-0">
            <div className="grid gap-3">{renderTraitList(SYMPTOMS)}</div>
          </TabsContent>

          <TabsContent value="abilities" className="mt-0">
            <div className="grid gap-3">{renderTraitList(ABILITIES)}</div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
