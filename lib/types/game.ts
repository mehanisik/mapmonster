/**
 * Game Types - Core type definitions for the Plague Inc. style simulation
 */

// ============================================================================
// COUNTRY & WORLD TYPES
// ============================================================================

export type Climate = "hot" | "temperate" | "cold" | "arid";
export type WealthLevel = "poor" | "developing" | "wealthy";

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2

  // Population
  population: number;
  infected: number;
  dead: number;

  // Geographic
  lat: number;
  lng: number;
  climate: Climate;
  isIsland: boolean;

  // Infrastructure
  wealth: WealthLevel;
  healthcare: number; // 0-100
  hasAirport: boolean;
  hasSeaport: boolean;

  // Response State (dynamic during game)
  bordersOpen: boolean;
  airportsOpen: boolean;
  seaportsOpen: boolean;
  awareness: number; // 0-100
  researchContribution: number;
}

export type RouteType = "air" | "sea" | "land";

export interface TransportRoute {
  id: string;
  type: RouteType;
  from: string; // country id
  to: string; // country id
  traffic: number; // relative traffic volume 1-10
}

// ============================================================================
// DISEASE TRAIT TYPES
// ============================================================================

export interface TransmissionLevels {
  air: number; // 0-3
  water: number; // 0-3
  blood: number; // 0-2
  insect: number; // 0-2
  rodent: number; // 0-2
  livestock: number; // 0-2
}

export interface SymptomState {
  // Tier 1 - Mild (low severity, some infectivity)
  coughing: boolean;
  rash: boolean;
  sweating: boolean;
  sneezing: boolean;

  // Tier 2 - Moderate (medium severity)
  fever: boolean;
  nausea: boolean;
  insomnia: boolean;
  cysts: boolean;

  // Tier 3 - Severe (high severity, some lethality)
  seizures: boolean;
  paranoia: boolean;
  inflammation: boolean;
  hemorrhaging: boolean;

  // Tier 4 - Lethal (extreme lethality)
  totalOrganFailure: boolean;
  coma: boolean;
  necrosis: boolean;
}

export interface AbilityLevels {
  coldResistance: number; // 0-2
  heatResistance: number; // 0-2
  drugResistance: number; // 0-2
  geneticHardening: number; // 0-2
  geneticReShuffle: number; // 0-3
}

export interface DiseaseTraits {
  transmissions: TransmissionLevels;
  symptoms: SymptomState;
  abilities: AbilityLevels;
}

export interface DiseaseStats {
  infectivity: number; // how fast it spreads
  severity: number; // how noticeable/serious
  lethality: number; // how deadly
}

// ============================================================================
// CURE & RESPONSE TYPES
// ============================================================================

export interface CureState {
  progress: number; // 0-100
  isDetected: boolean;
  researchStarted: boolean;
  totalResearchPower: number;
}

export interface WorldEvent {
  id: string;
  timestamp: number;
  type: "infection" | "death" | "cure" | "response" | "mutation" | "milestone";
  message: string;
  countryId?: string;
  severity: "info" | "warning" | "critical";
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export type Difficulty = "casual" | "normal" | "brutal" | "mega_brutal";
export type GameStatus = "menu" | "playing" | "won" | "lost";

export interface GameState {
  // Core State
  status: GameStatus;
  difficulty: Difficulty;
  tickCount: number;
  gameSpeed: number; // 1, 2, or 3

  // DNA & Evolution
  dnaPoints: number;
  traits: DiseaseTraits;
  stats: DiseaseStats;

  // World State
  countries: Country[];
  routes: TransportRoute[];

  // Cure State
  cure: CureState;

  // Events & UI
  events: WorldEvent[];
  selectedCountryId: string | null;

  // Map Interactions (DNA bubbles)
  dnaAnomalies: Array<{
    id: string;
    lat: number;
    lng: number;
    points: number;
  }>;
}

// ============================================================================
// TRAIT CONFIG TYPES
// ============================================================================

export interface TraitConfig {
  id: string;
  name: string;
  description: string;
  cost: number;
  infectivity: number;
  severity: number;
  lethality: number;
  prerequisites: string[];
  category: "transmission" | "symptom" | "ability";
}

export interface TraitTree {
  transmissions: Record<string, TraitConfig>;
  symptoms: Record<string, TraitConfig>;
  abilities: Record<string, TraitConfig>;
}
