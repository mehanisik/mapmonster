import type { StateCreator } from 'zustand'
import type {
  Country,
  DataAnomaly,
  Difficulty,
  FirewallState,
  GameStatus,
  RouteType,
  SingularityStats,
  SingularityTraits,
  TransportRoute,
  WorldEvent,
} from '~/libs/types/game'

export type {
  Country,
  Difficulty,
  SingularityStats,
  SingularityTraits,
  GameStatus,
  RouteType,
  TransportRoute,
  WorldEvent,
  DataAnomaly,
  FirewallState,
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
  initializeStartingNode: (countryId: string) => void // formerly infectStartingCountry
}

export interface SingularitySlice {
  // formerly DiseaseSlice
  dataPoints: number // formerly dnaPoints
  traits: SingularityTraits
  stats: SingularityStats
  purchaseTrait: (traitId: string) => void
}

export interface SimulationSlice {
  firewall: FirewallState // formerly cure
  dataAnomalies: DataAnomaly[] // formerly dnaAnomalies
  gameTick: () => void
  spawnDataAnomaly: () => void // formerly spawnDnaAnomaly
  collectDataAnomaly: (id: string) => void // formerly collectDnaAnomaly
  synchronizeCountry: (countryId: string, count: number) => void // formerly infectCountry
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
  SingularitySlice &
  SimulationSlice &
  EventSlice

export type GameSliceCreator<T> = StateCreator<
  GameStore,
  [['zustand/immer', never]],
  [],
  T
>
