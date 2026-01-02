import {
  calculateSingularityStats, // formerly calculateDiseaseStats
  canPurchaseTrait,
  getTrait,
} from '~/libs/data/traits-config'
import type { GameSliceCreator } from '../store-types'

export const createSingularitySlice: GameSliceCreator<
  // formerly createDiseaseSlice
  import('../store-types').SingularitySlice
> = (set) => ({
  dataPoints: 0, // formerly dnaPoints
  traits: {
    transmissions: {
      // terms stay same in struct for now, renamed in label
      air: 0,
      water: 0,
      blood: 0,
      insect: 0,
      rodent: 0,
      livestock: 0,
    },
    symptoms: {
      coughing: false,
      rash: false,
      sweating: false,
      sneezing: false,
      fever: false,
      nausea: false,
      insomnia: false,
      cysts: false,
      seizures: false,
      paranoia: false,
      inflammation: false,
      hemorrhaging: false,
      totalOrganFailure: false,
      coma: false,
      necrosis: false,
    },
    abilities: {
      coldResistance: 0,
      heatResistance: 0,
      drugResistance: 0,
      geneticHardening: 0,
      geneticReShuffle: 0,
    },
  },
  stats: { infectivity: 0, severity: 0, lethality: 0 },

  purchaseTrait: (traitId) => {
    set((state) => {
      const trait = getTrait(traitId)
      if (!trait) return

      const ownedTraits = Object.entries(state.traits.symptoms)
        .filter(([, owned]) => owned)
        .map(([id]) => id)
        .concat(
          Object.keys(state.traits.transmissions).flatMap((key) => {
            const level =
              state.traits.transmissions[
                key as keyof typeof state.traits.transmissions
              ]
            return Array.from({ length: level }, (_, i) => `${key}_${i + 1}`)
          })
        )
        .concat(
          Object.keys(state.traits.abilities).flatMap((key) => {
            const level =
              state.traits.abilities[key as keyof typeof state.traits.abilities]
            return Array.from({ length: level }, (_, i) => `${key}_${i + 1}`)
          })
        )

      if (!canPurchaseTrait(traitId, ownedTraits, state.dataPoints)) return

      state.dataPoints -= trait.cost

      if (trait.category === 'symptom') {
        ;(state.traits.symptoms as Record<string, boolean>)[traitId] = true
      } else if (trait.category === 'transmission') {
        const [base, level] = traitId.split('_')
        if (base && level) {
          state.traits.transmissions[
            base as keyof typeof state.traits.transmissions
          ] = Number.parseInt(level, 10)
        }
      } else if (trait.category === 'ability') {
        const [base, level] = traitId.split('_')
        if (base && level) {
          state.traits.abilities[base as keyof typeof state.traits.abilities] =
            Number.parseInt(level, 10)
        }
      }

      const newOwnedTraits = [...ownedTraits, traitId]
      state.stats = calculateSingularityStats(newOwnedTraits)

      state.events.unshift({
        id: `event-${Date.now()}`,
        timestamp: state.tickCount,
        type: 'mutation',
        message: `System Upgrade: ${trait.name}`,
        severity: trait.severity > 5 ? 'critical' : 'info',
      })
    })
  },
})
