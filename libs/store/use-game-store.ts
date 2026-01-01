import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
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
  TransportRoute,
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
  countries: [],
  routes: [],
  cure: {
    progress: 0,
    isDetected: false,
    researchStarted: false,
    totalResearchPower: 0,
  },
  events: [],
  selectedCountryId: null,
  isLoadingData: false,
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
  infectStartingCountry: (countryId: string) => void
  initializeGame: () => Promise<void>
}

export type GameStore = GameState & GameActions

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useGameStore = create<GameStore>()(
  immer((set) => ({
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
        state.status = 'selecting_start'
        state.tickCount = 0
        state.dnaPoints = 5
      })
    },

    infectStartingCountry: (countryId) => {
      set((state) => {
        if (state.status !== 'selecting_start') return

        const country = state.countries.find((c) => c.id === countryId)
        if (country) {
          country.infected = 1
          state.status = 'playing'
          state.gameSpeed = 1

          const message = `Outbreak initiated in ${country.name}. Target confirmed.`
          const event: WorldEvent = {
            id: `event-${Date.now()}`,
            timestamp: 0,
            type: 'milestone',
            message,
            severity: 'warning',
            countryId: country.id,
          }
          state.events.unshift(event)
        }
      })
    },

    resetGame: () => {
      set((state) => {
        const savedCountries = state.countries.map(c => ({
          ...c,
          infected: 0,
          dead: 0,
          bordersOpen: true,
          airportsOpen: true,
          seaportsOpen: true,
          awareness: 0,
          researchContribution: 0
        }))
        const savedRoutes = state.routes

        Object.assign(state, {
          ...initialState,
          countries: savedCountries,
          routes: savedRoutes,
          isLoadingData: false
        })
      })
    },

    initializeGame: async () => {
      set((state) => {
        state.isLoadingData = true
      })
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to load country data')
        const {
          countries,
          routes,
        }: { countries: Country[]; routes: TransportRoute[] } = await response.json()
        set((state) => {
          state.countries = countries
          state.routes = routes
          state.isLoadingData = false
        })
      } catch (error) {
        console.error('Failed to initialize game data:', error)
        set((state) => {
          state.isLoadingData = false
        })
      }
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
          casual: { infection: 1.5, cure: 0.5, dna: 1.5 },
          normal: { infection: 1.0, cure: 1.0, dna: 1.0 },
          brutal: { infection: 0.8, cure: 1.5, dna: 0.8 },
          mega_brutal: { infection: 0.7, cure: 2.0, dna: 0.6 },
        }[state.difficulty]

        let totalInfected = 0
        let totalHealthy = 0
        let totalDead = 0

        // Simulation logic
        for (const country of state.countries) {
          const currentlyInfected = country.infected
          const currentlyDead = country.dead
          const healthy = country.population - currentlyInfected - currentlyDead

          if (currentlyInfected > 0 && healthy > 0) {
            // 1. INFECTION SPREAD (Logistic Growth Model)
            const climateMult = getClimateMultiplier(country, state.traits)
            const wealthMult = getWealthMultiplier(country, state.traits)
            const healthcarePenalty = 1 - (country.healthcare / 100) * 0.8 // Max 80% reduction

            // Base rate scales with infectivity stats
            const baseInfectivity = 0.05 + state.stats.infectivity * 0.02
            const spreadRate =
              baseInfectivity *
              climateMult *
              wealthMult *
              healthcarePenalty *
              diffMult.infection

            // Logistic growth: dI/dt = r * I * (1 - I/N)
            const infectionRatio = currentlyInfected / country.population
            const newInfections = Math.max(
              1,
              Math.floor(currentlyInfected * spreadRate * (1 - infectionRatio))
            )

            country.infected = Math.min(
              country.population - country.dead,
              country.infected + newInfections
            )
          }

          // 2. DEATHS
          if (country.infected > 0 && state.stats.lethality > 0) {
            const baseLethality = state.stats.lethality * 0.001
            const healthcarePenalty = 1 - (country.healthcare / 100) * 0.5
            const deathRate = baseLethality * healthcarePenalty

            const newDeaths = Math.max(
              0,
              Math.min(
                country.infected,
                Math.floor(country.infected * deathRate)
              )
            )

            country.dead += newDeaths
            country.infected -= newDeaths
          }

          // 3. AWARENESS & RESPONSE
          // Awareness grows based on severity and how much of the population is infected/dead
          const impactRatio =
            (country.infected + country.dead) / country.population
          const visibilityFactor = state.stats.severity * 0.1 + impactRatio * 50
          country.awareness = Math.min(
            100,
            country.awareness + visibilityFactor * 0.05
          )

          // Border closures based on awareness
          if (
            country.awareness > 30 &&
            country.bordersOpen &&
            Math.random() < 0.05
          ) {
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
          if (
            country.awareness > 50 &&
            country.airportsOpen &&
            Math.random() < 0.03
          ) {
            country.airportsOpen = false
            state.events.unshift({
              id: `evt-${Date.now()}-${Math.random()}`,
              timestamp: state.tickCount,
              type: 'response',
              message: `${country.name} suspends all air travel.`,
              severity: 'warning',
              countryId: country.id,
            })
          }
          if (
            country.awareness > 70 &&
            country.seaportsOpen &&
            Math.random() < 0.02
          ) {
            country.seaportsOpen = false
            state.events.unshift({
              id: `evt-${Date.now()}-${Math.random()}`,
              timestamp: state.tickCount,
              type: 'response',
              message: `${country.name} shuts down seaports.`,
              severity: 'critical',
              countryId: country.id,
            })
          }

          // 4. RESEARCH CONTRIBUTION
          // Countries only contribute significantly if they are aware and not in total chaos
          if (country.awareness > 20) {
            const wealthFactor =
              { wealthy: 2.5, developing: 1.0, poor: 0.3 }[country.wealth] ||
              1.0
            const chaosFactor = 1 - (country.dead / country.population) * 2 // Research stops as deaths rise
            country.researchContribution = Math.max(
              0,
              country.healthcare * wealthFactor * chaosFactor * 0.005
            )
          }

          totalInfected += country.infected
          totalHealthy += country.population - country.infected - country.dead
          totalDead += country.dead
        }

        // 5. CROSS-BORDER TRANSMISSION (Simulated more logically)
        if (state.tickCount % 5 === 0) {
          for (const route of state.routes) {
            const from = state.countries.find((c) => c.id === route.from)
            const to = state.countries.find((c) => c.id === route.to)

            if (!(from && to) || from.infected <= 10 || to.infected > 0)
              continue

            // Check if ports are open
            if (route.type === 'air' && !(from.airportsOpen && to.airportsOpen))
              continue
            if (route.type === 'sea' && !(from.seaportsOpen && to.seaportsOpen))
              continue
            if (route.type === 'land' && !(from.bordersOpen && to.bordersOpen))
              continue

            // Transmission chance scales with infected ratio and route traffic
            const fromInfectedRatio = from.infected / from.population
            let traitBonus = 1.0
            if (route.type === 'air')
              traitBonus += state.traits.transmissions.air * 0.8
            if (route.type === 'sea')
              traitBonus += state.traits.transmissions.water * 0.8
            if (route.type === 'land')
              traitBonus +=
                (state.traits.transmissions.rodent +
                  state.traits.transmissions.livestock) *
                0.4

            const transmissionChance =
              fromInfectedRatio *
              route.traffic *
              0.02 *
              traitBonus *
              diffMult.infection

            if (Math.random() < transmissionChance) {
              to.infected = Math.ceil(Math.random() * 5) + 1
              state.events.unshift({
                id: `evt-${Date.now()}-${Math.random()}`,
                timestamp: state.tickCount,
                type: 'infection',
                message: `Disease has crossed borders into ${to.name}!`,
                severity: 'warning',
                countryId: to.id,
              })
            }
          }
        }

        // 6. CURE PROGRESS
        // Cure starts if detected or if global deaths reach a threshold
        if (state.cure.isDetected || totalDead > 0) {
          if (!state.cure.isDetected) {
            state.cure.isDetected = true
            state.cure.researchStarted = true
            state.events.unshift({
              id: `evt-cure-start-${Date.now()}`,
              timestamp: state.tickCount,
              type: 'cure',
              message:
                'Public health crisis declared! WHO initiates cure development.',
              severity: 'critical',
            })
          }

          const researchPower = state.countries.reduce(
            (sum, c) => sum + c.researchContribution,
            0
          )
          state.cure.totalResearchPower = researchPower

          const drugResistancePenalty =
            1 - state.traits.abilities.drugResistance * 0.2
          const hardeningPenalty =
            1 - state.traits.abilities.geneticHardening * 0.1

          const cureIncrease =
            researchPower *
            0.005 *
            drugResistancePenalty *
            hardeningPenalty *
            diffMult.cure
          state.cure.progress = Math.min(
            100,
            state.cure.progress + cureIncrease
          )
        }

        // 7. DNA REWARDS
        if (state.tickCount % 20 === 0) {
          const infectedRatio =
            totalInfected / (totalInfected + totalHealthy + totalDead)
          if (infectedRatio > 0) {
            const dnaGain = Math.ceil(infectedRatio * 5 * diffMult.dna)
            state.dnaPoints += dnaGain
          }
        }

        // 8. WIN/LOSS CONDITIONS
        if (totalHealthy === 0 && totalInfected === 0) {
          state.status = 'won'
        } else if (state.cure.progress >= 100) {
          state.status = 'lost'
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
