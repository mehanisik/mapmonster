import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { COUNTRIES } from '~/libs/data/countries'
import { TRANSPORT_ROUTES } from '~/libs/data/routes'
import {
  calculateDiseaseStats,
  canPurchaseTrait,
  getTrait,
} from '~/libs/data/traits-config'
import type {
  Country,
  Difficulty,
  DiseaseTraits,
  GameState,
  WorldEvent,
} from '~/libs/types/game'

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialTraits: DiseaseTraits = {
  transmissions: {
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
}

const initialState: GameState = {
  status: 'menu',
  difficulty: 'normal',
  tickCount: 0,
  gameSpeed: 1,
  dnaPoints: 0,
  traits: initialTraits,
  stats: { infectivity: 0, severity: 0, lethality: 0 },
  countries: COUNTRIES.map((c) => ({ ...c })),
  routes: TRANSPORT_ROUTES,
  cure: {
    progress: 0,
    isDetected: false,
    researchStarted: false,
    totalResearchPower: 0,
  },
  events: [],
  selectedCountryId: null,
  dnaAnomalies: [],
}

// ============================================================================
// STORE ACTIONS INTERFACE
// ============================================================================

interface GameActions {
  startGame: () => void
  resetGame: () => void
  setDifficulty: (difficulty: Difficulty) => void
  setGameSpeed: (speed: number) => void
  selectCountry: (countryId: string | null) => void
  infectCountry: (countryId: string, count: number) => void
  purchaseTrait: (traitId: string) => void
  spawnDnaAnomaly: () => void
  collectDnaAnomaly: (id: string) => void
  gameTick: () => void
  addEvent: (
    type: WorldEvent['type'],
    message: string,
    countryId?: string,
    severity?: WorldEvent['severity']
  ) => void
}

export type GameStore = GameState & GameActions

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    addEvent: (type, message, countryId, severity = 'info') => {
      set((state) => {
        const event: WorldEvent = {
          id: `event-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: state.tickCount,
          type,
          message,
          severity,
          countryId,
        }
        state.events.unshift(event)
        if (state.events.length > 50) {
          state.events = state.events.slice(0, 50)
        }
      })
    },

    startGame: () => {
      set((state) => {
        state.status = 'playing'
        state.tickCount = 0
        state.dnaPoints = 5
      })
      get().addEvent('milestone', 'Patient Zero has been infected.', 'warning')
    },

    resetGame: () => {
      set((state) => {
        Object.assign(state, {
          ...initialState,
          countries: COUNTRIES.map((c) => ({ ...c })),
        })
      })
    },

    setDifficulty: (difficulty) => {
      set((state) => {
        state.difficulty = difficulty
      })
    },

    setGameSpeed: (speed) => {
      set((state) => {
        state.gameSpeed = Math.max(1, Math.min(3, speed))
      })
    },

    selectCountry: (countryId) => {
      set((state) => {
        state.selectedCountryId = countryId
      })
    },

    infectCountry: (countryId, count) => {
      set((state) => {
        const country = state.countries.find((c) => c.id === countryId)
        if (country && country.infected === 0) {
          country.infected = count
          const message = `First case detected in ${country.name}!`

          // Note: can't call get().addEvent inside set with immer easily if it updates the same state
          // but we are in immer's set, so we can just do the logic
          const event: WorldEvent = {
            id: `event-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: state.tickCount,
            type: 'infection',
            message,
            severity: 'warning',
            countryId: country.id,
          }
          state.events.unshift(event)
          if (state.events.length > 50) state.events = state.events.slice(0, 50)
        }
      })
    },

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
                state.traits.abilities[
                  key as keyof typeof state.traits.abilities
                ]
              return Array.from({ length: level }, (_, i) => `${key}_${i + 1}`)
            })
          )

        if (!canPurchaseTrait(traitId, ownedTraits, state.dnaPoints)) return

        state.dnaPoints -= trait.cost

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
            state.traits.abilities[
              base as keyof typeof state.traits.abilities
            ] = Number.parseInt(level, 10)
          }
        }

        const newOwnedTraits = [...ownedTraits, traitId]
        state.stats = calculateDiseaseStats(newOwnedTraits)

        state.events.unshift({
          id: `event-${Date.now()}`,
          timestamp: state.tickCount,
          type: 'mutation',
          message: `Disease evolved: ${trait.name}`,
          severity: trait.severity > 5 ? 'critical' : 'info',
        })
      })
    },

    spawnDnaAnomaly: () => {
      set((state) => {
        if (state.dnaAnomalies.length >= 10) return
        const infectedCountries = state.countries.filter((c) => c.infected > 0)
        if (infectedCountries.length === 0) return

        const randomCountry =
          infectedCountries[
            Math.floor(Math.random() * infectedCountries.length)
          ]
        const offsetLat = (Math.random() - 0.5) * 20
        const offsetLng = (Math.random() - 0.5) * 40

        state.dnaAnomalies.push({
          id: `dna-${Date.now()}`,
          lat: randomCountry.lat + offsetLat,
          lng: randomCountry.lng + offsetLng,
          points: Math.floor(Math.random() * 4) + 2,
        })
      })
    },

    collectDnaAnomaly: (id) => {
      set((state) => {
        const anomaly = state.dnaAnomalies.find((a) => a.id === id)
        if (anomaly) {
          state.dnaPoints += anomaly.points
          state.dnaAnomalies = state.dnaAnomalies.filter((a) => a.id !== id)
        }
      })
    },

    gameTick: () => {
      set((state) => {
        if (state.status !== 'playing') return

        state.tickCount += 1

        const diffMult = {
          casual: { infection: 1.3, cure: 0.5, dna: 1.5 },
          normal: { infection: 1.0, cure: 1.0, dna: 1.0 },
          brutal: { infection: 0.8, cure: 1.5, dna: 0.7 },
          mega_brutal: { infection: 0.6, cure: 2.0, dna: 0.5 },
        }[state.difficulty]

        let totalInfected = 0
        let totalHealthy = 0

        // Simulation logic
        for (const country of state.countries) {
          if (country.infected === 0) continue

          const healthy = country.population - country.infected - country.dead
          if (healthy <= 0) continue

          // Infection spread within country
          const climateMult = getClimateMultiplier(country, state.traits)
          const wealthMult = getWealthMultiplier(country, state.traits)
          const healthcarePenalty = 1 - country.healthcare / 200

          const baseSpreadRate = 0.001 + state.stats.infectivity * 0.0005
          const spreadRate =
            baseSpreadRate *
            climateMult *
            wealthMult *
            healthcarePenalty *
            diffMult.infection

          const infectionRate = country.infected / country.population
          const newInfections = Math.floor(
            country.infected * spreadRate * (1 - infectionRate) * 100
          )

          country.infected = Math.min(
            country.population - country.dead,
            country.infected + Math.max(1, newInfections)
          )

          // Deaths
          if (state.stats.lethality > 0) {
            const deathRate = state.stats.lethality * 0.0001 * healthcarePenalty
            const newDeaths = Math.floor(country.infected * deathRate)
            country.dead += newDeaths
            country.infected = Math.max(0, country.infected - newDeaths)
          }

          // Awareness and Government Response
          const visibilityFactor = state.stats.severity * infectionRate * 10
          country.awareness = Math.min(
            100,
            country.awareness + visibilityFactor * 0.1
          )

          if (country.awareness > 20 && Math.random() < 0.01) {
            if (country.bordersOpen && country.awareness > 40) {
              country.bordersOpen = false
              state.events.unshift({
                id: `evt-${Date.now()}-${Math.random()}`,
                timestamp: state.tickCount,
                type: 'response',
                message: `${country.name} closes land borders.`,
                severity: 'warning',
                countryId: country.id,
              })
            }
          }
          if (country.awareness > 50 && Math.random() < 0.005) {
            if (country.airportsOpen) {
              country.airportsOpen = false
              state.events.unshift({
                id: `evt-${Date.now()}-${Math.random()}`,
                timestamp: state.tickCount,
                type: 'response',
                message: `${country.name} closes airports.`,
                severity: 'warning',
                countryId: country.id,
              })
            }
          }
          if (country.awareness > 70 && Math.random() < 0.003) {
            if (country.seaportsOpen) {
              country.seaportsOpen = false
              state.events.unshift({
                id: `evt-${Date.now()}-${Math.random()}`,
                timestamp: state.tickCount,
                type: 'response',
                message: `${country.name} closes seaports.`,
                severity: 'critical',
                countryId: country.id,
              })
            }
          }

          // Research contribution
          if (country.awareness > 30) {
            const wealthBonus =
              { wealthy: 2, developing: 1, poor: 0.5 }[country.wealth] || 0.5
            country.researchContribution =
              country.healthcare * wealthBonus * 0.01
          }

          totalInfected += country.infected
          totalHealthy += country.population - country.infected - country.dead
        }

        // Cross-border transmission
        if (state.tickCount % 5 === 0) {
          for (const route of state.routes) {
            const from = state.countries.find((c) => c.id === route.from)
            const to = state.countries.find((c) => c.id === route.to)

            if (!(from && to) || from.infected === 0 || to.infected > 0)
              continue

            if (route.type === 'air' && !(from.airportsOpen && to.airportsOpen))
              continue
            if (route.type === 'sea' && !(from.seaportsOpen && to.seaportsOpen))
              continue
            if (route.type === 'land' && !(from.bordersOpen && to.bordersOpen))
              continue

            let routeMult = 1.0
            if (route.type === 'air')
              routeMult = 1 + state.traits.transmissions.air * 0.5
            if (route.type === 'sea')
              routeMult = 1 + state.traits.transmissions.water * 0.5

            const infectedRatio = from.infected / from.population
            const transmissionChance =
              infectedRatio *
              route.traffic *
              0.01 *
              routeMult *
              diffMult.infection

            if (Math.random() < transmissionChance) {
              to.infected = Math.ceil(Math.random() * 3) + 1
              state.events.unshift({
                id: `evt-${Date.now()}-${Math.random()}`,
                timestamp: state.tickCount,
                type: 'infection',
                message: `Disease spreads to ${to.name}!`,
                severity: 'warning',
                countryId: to.id,
              })
            }
          }
        }

        // Cure progress
        if (state.cure.isDetected || totalInfected > 10000) {
          if (!state.cure.isDetected && totalInfected > 10000) {
            state.cure.isDetected = true
            state.cure.researchStarted = true
            state.events.unshift({
              id: `evt-cure-${Date.now()}`,
              timestamp: state.tickCount,
              type: 'cure',
              message: 'Disease has been detected! Global research begins.',
              severity: 'critical',
            })
          }

          const researchPower = state.countries.reduce(
            (sum, c) => sum + c.researchContribution,
            0
          )
          state.cure.totalResearchPower = researchPower

          const drugResistancePenalty =
            1 - state.traits.abilities.drugResistance * 0.15
          const hardeningPenalty =
            1 - state.traits.abilities.geneticHardening * 0.1

          state.cure.progress = Math.min(
            100,
            state.cure.progress +
              researchPower *
                0.01 *
                drugResistancePenalty *
                hardeningPenalty *
                diffMult.cure
          )
        }

        // DNA rewards
        const totalPopulation = state.countries.reduce(
          (sum, c) => sum + c.population,
          0
        )
        const globalInfectionRate = totalInfected / totalPopulation

        if (state.tickCount % 50 === 0 && globalInfectionRate > 0.001) {
          const dnaGain = Math.ceil(globalInfectionRate * 10 * diffMult.dna)
          state.dnaPoints += dnaGain
        }

        // Win/Lose conditions
        if (totalHealthy === 0 && totalInfected === 0) {
          state.status = 'won'
          state.events.unshift({
            id: `win-${Date.now()}`,
            timestamp: state.tickCount,
            type: 'milestone',
            message: 'Humanity has been eradicated. You win!',
            severity: 'critical',
          })
        }

        if (state.cure.progress >= 100) {
          state.status = 'lost'
          state.events.unshift({
            id: `lost-${Date.now()}`,
            timestamp: state.tickCount,
            type: 'cure',
            message: 'Cure has been deployed. Disease eradicated. You lose.',
            severity: 'critical',
          })
        }
      })
    },
  }))
)

// ============================================================================
// HELPERS
// ============================================================================

function getClimateMultiplier(country: Country, traits: DiseaseTraits): number {
  let mult = 1.0
  if (country.climate === 'cold') {
    mult *= 0.5 + traits.abilities.coldResistance * 0.25
  } else if (country.climate === 'hot') {
    mult *= 0.5 + traits.abilities.heatResistance * 0.25
  } else if (country.climate === 'arid') {
    mult *= 0.7 + traits.transmissions.air * 0.1
  }
  return mult
}

function getWealthMultiplier(country: Country, traits: DiseaseTraits): number {
  let mult = 1.0
  if (country.wealth === 'wealthy') {
    mult *= 0.7 + traits.abilities.drugResistance * 0.15
  } else if (country.wealth === 'poor') {
    mult *= 1.3
  }
  return mult
}
