/**
 * Game Types - Core type definitions for "The Singularity" ASI simulation
 */

export type Climate = 'hot' | 'temperate' | 'cold' | 'arid'
export type WealthLevel = 'poor' | 'developing' | 'wealthy'

export interface Country {
  id: string
  name: string
  code: string

  population: number
  synchronized: number // formerly infected
  assimilated: number // formerly dead

  lat: number
  lng: number
  climate: Climate
  isIsland: boolean
  geometry?: object

  wealth: WealthLevel
  healthcare: number
  hasAirport: boolean
  hasSeaport: boolean

  bordersOpen: boolean
  airportsOpen: boolean
  seaportsOpen: boolean
  awareness: number
  researchContribution: number
}

export type RouteType = 'air' | 'sea' | 'land'

export interface TransportRoute {
  id: string
  type: RouteType
  from: string
  to: string
  traffic: number
}

export interface InfiltrationLevels {
  // formerly TransmissionLevels
  air: number
  water: number
  blood: number
  insect: number
  rodent: number
  livestock: number
}

export interface ModuleState {
  // formerly SymptomState
  coughing: boolean
  rash: boolean
  sweating: boolean
  sneezing: boolean

  fever: boolean
  nausea: boolean
  insomnia: boolean
  cysts: boolean

  seizures: boolean
  paranoia: boolean
  inflammation: boolean
  hemorrhaging: boolean

  totalOrganFailure: boolean
  coma: boolean
  necrosis: boolean
}

export interface KernelLevels {
  // formerly AbilityLevels
  coldResistance: number
  heatResistance: number
  drugResistance: number
  geneticHardening: number
  geneticReShuffle: number
}

export interface SingularityTraits {
  // formerly DiseaseTraits
  transmissions: InfiltrationLevels
  symptoms: ModuleState
  abilities: KernelLevels
}

export interface SingularityStats {
  // formerly DiseaseStats
  infectivity: number
  severity: number
  lethality: number
}

export interface FirewallState {
  // formerly CureState
  progress: number
  isDetected: boolean
  researchStarted: boolean
  totalResearchPower: number
}

export interface WorldEvent {
  id: string
  timestamp: number
  type: 'infection' | 'death' | 'cure' | 'response' | 'mutation' | 'milestone'
  message: string
  countryId?: string
  severity: 'info' | 'warning' | 'critical'
}

export type Difficulty = 'casual' | 'normal' | 'brutal' | 'mega_brutal'
export type GameStatus = 'menu' | 'selecting_start' | 'playing' | 'won' | 'lost'

export interface DataAnomaly {
  // formerly DnaAnomaly
  id: string
  lat: number
  lng: number
  points: number
  countryId: string
}

export interface GameState {
  status: GameStatus
  difficulty: Difficulty
  tickCount: number
  gameSpeed: number

  dataPoints: number // formerly dnaPoints
  traits: SingularityTraits
  stats: SingularityStats

  countries: Country[]
  routes: TransportRoute[]

  firewall: FirewallState // formerly cure

  events: WorldEvent[]
  selectedCountryId: string | null
  isLoadingData: boolean

  dataAnomalies: DataAnomaly[]
}

export interface TraitConfig {
  id: string
  name: string
  description: string
  cost: number
  infectivity: number
  severity: number
  lethality: number
  prerequisites: string[]
  category: 'transmission' | 'symptom' | 'ability'
}

export interface TraitTree {
  transmissions: Record<string, TraitConfig>
  symptoms: Record<string, TraitConfig>
  abilities: Record<string, TraitConfig>
}
