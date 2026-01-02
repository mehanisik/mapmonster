import type { GameSliceCreator } from '../store-types'

export const initialGameSliceState = {
  status: 'menu' as const,
  difficulty: 'normal' as const,
  tickCount: 0,
  gameSpeed: 1,
}

export const createGameSlice: GameSliceCreator<
  import('../store-types').GameSlice
> = (set) => ({
  ...initialGameSliceState,

  startGame: () => {
    set((state) => {
      state.status = 'selecting_start'
      state.tickCount = 0
      state.dataPoints = 5
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

  resetGame: () => {
    set((state) => {
      const savedCountries = state.countries.map((c) => ({
        ...c,
        synchronized: 0,
        assimilated: 0,
        bordersOpen: true,
        airportsOpen: true,
        seaportsOpen: true,
        awareness: 0,
        researchContribution: 0,
      }))
      const savedRoutes = state.routes

      state.status = 'menu'
      state.difficulty = 'normal'
      state.tickCount = 0
      state.gameSpeed = 1

      state.countries = savedCountries
      state.routes = savedRoutes
      state.selectedCountryId = null
      state.isLoadingData = false

      state.dataPoints = 0
      state.traits = {
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
      state.stats = { infectivity: 0, severity: 0, lethality: 0 }

      state.firewall = {
        progress: 0,
        isDetected: false,
        researchStarted: false,
        totalResearchPower: 0,
      }
      state.dataAnomalies = []

      state.events = []
    })
  },
})
