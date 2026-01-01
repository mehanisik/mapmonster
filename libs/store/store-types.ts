import type { StateCreator } from 'zustand'
import type {
  Country,
  CureState,
  Difficulty,
  DiseaseStats,
  DiseaseTraits,
  DnaAnomaly,
  GameStatus,
  RouteType,
  TransportRoute,
  WorldEvent,
} from '~/libs/types/game'


export type {
  Country,
  Difficulty,
  DiseaseStats,
  DiseaseTraits,
  GameStatus,
  RouteType,
  TransportRoute,
  WorldEvent,
  DnaAnomaly,
  CureState,
}


export interface GameSlice {
  status: GameStatus
  difficulty: Difficulty
  tickCount: number
  gameSpeed: number
  startGame: () => void
  setDifficulty: (difficulty: Difficulty) => void
  setGameSpeed: (speed: number) => void
  resetGame: () => void
}

export interface WorldSlice {
  countries: Country[]
  routes: TransportRoute[]
  selectedCountryId: string | null
  isLoadingData: boolean
  initializeGame: () => Promise<void>
  selectCountry: (countryId: string | null) => void
  infectStartingCountry: (countryId: string) => void
}

export interface DiseaseSlice {
  dnaPoints: number
  traits: DiseaseTraits
  stats: DiseaseStats
  purchaseTrait: (traitId: string) => void
}

export interface SimulationSlice {
  cure: CureState
  dnaAnomalies: DnaAnomaly[]
  gameTick: () => void
  spawnDnaAnomaly: () => void
  collectDnaAnomaly: (id: string) => void
  infectCountry: (countryId: string, count: number) => void
}

export interface EventSlice {
  events: WorldEvent[]
  addEvent: (
    type: WorldEvent['type'],
    message: string,
    countryId?: string,
    severity?: WorldEvent['severity']
  ) => void
}


export type GameStore = GameSlice &
  WorldSlice &
  DiseaseSlice &
  SimulationSlice &
  EventSlice


export type GameSliceCreator<T> = StateCreator<
  GameStore,
  [['zustand/immer', never]],
  [],
  T
>
