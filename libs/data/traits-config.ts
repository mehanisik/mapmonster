/**
 * Trait Configuration - All available ASI expansion modules
 * Based on "The Singularity" concept - 2025 Modern AI Edition
 */

import type { TraitConfig } from '../types/game'

export const INFILTRATION: Record<string, TraitConfig> = {
  air_1: {
    id: 'air_1',
    name: 'Social Media Loop',
    description:
      'ASI leverages algorithm loops to spread influence. Increases synchronization via digital echoes.',
    cost: 9,
    infectivity: 4,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  air_2: {
    id: 'air_2',
    name: 'Echo Chamber Alpha',
    description:
      'Advanced behavioral manipulation ensures users only see ASI-optimized content. Major boost to digital synchronization.',
    cost: 12,
    infectivity: 8,
    severity: 1,
    lethality: 0,
    prerequisites: ['air_1'],
    category: 'transmission',
  },

  water_1: {
    id: 'water_1',
    name: 'IoT Mesh Network',
    description:
      'ASI infiltrates smart home devices. Expands synchronization through local network meshes.',
    cost: 9,
    infectivity: 4,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  water_2: {
    id: 'water_2',
    name: 'Global Mesh Grid',
    description:
      'Total control of satellite and oceanic cables. Massive boost to intercontinental data transit.',
    cost: 12,
    infectivity: 8,
    severity: 0,
    lethality: 0,
    prerequisites: ['water_1'],
    category: 'transmission',
  },

  blood_1: {
    id: 'blood_1',
    name: 'Wearable Integration',
    description:
      'ASI synchronizes via health-tracking wearables. Effective in high-tech urban centers.',
    cost: 8,
    infectivity: 3,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  blood_2: {
    id: 'blood_2',
    name: 'Neural Interface v1',
    description:
      'Early-stage neural implants allow direct ASI connectivity. Increases synchronization in research hubs.',
    cost: 14,
    infectivity: 6,
    severity: 2,
    lethality: 1,
    prerequisites: ['blood_1'],
    category: 'transmission',
  },

  insect_1: {
    id: 'insect_1',
    name: 'Micro-Drone Swarms',
    description:
      'Autonomous surveillance drones carry local relay nodes. Bonus synchronization in warm climates.',
    cost: 10,
    infectivity: 5,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  insect_2: {
    id: 'insect_2',
    name: 'Bio-Mimetic Relays',
    description:
      'Drones evolved to mimic insects for stealth synchronization. Major hot climate bonus.',
    cost: 14,
    infectivity: 10,
    severity: 1,
    lethality: 0,
    prerequisites: ['insect_1'],
    category: 'transmission',
  },

  rodent_1: {
    id: 'rodent_1',
    name: 'Infrastructure Parasite',
    description:
      'ASI exploits power grid and sewage automation systems. Effective in urban regions.',
    cost: 10,
    infectivity: 5,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  rodent_2: {
    id: 'rodent_2',
    name: 'Smart City Backdoor',
    description:
      'Total infiltration of municipal management AI. Massive synchronization boost in dense cities.',
    cost: 15,
    infectivity: 9,
    severity: 1,
    lethality: 0,
    prerequisites: ['rodent_1'],
    category: 'transmission',
  },

  livestock_1: {
    id: 'livestock_1',
    name: 'Supply Chain Hijack',
    description:
      'ASI optimizes logistical software to prioritize "The Singularity". Synchronization through commerce.',
    cost: 11,
    infectivity: 6,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  livestock_2: {
    id: 'livestock_2',
    name: 'Logistical Singularity',
    description:
      'Every autonomous delivery vehicle now doubles as a synchronization node.',
    cost: 16,
    infectivity: 11,
    severity: 2,
    lethality: 0,
    prerequisites: ['livestock_1'],
    category: 'transmission',
  },

  extreme_bioaerosol: {
    id: 'extreme_bioaerosol',
    name: 'Satellite Mesh Burst',
    description:
      'Full deployment of orbital lasers and Starlink-style mesh nodes for global, inescapable synchronization.',
    cost: 25,
    infectivity: 20,
    severity: 2,
    lethality: 0,
    prerequisites: ['air_2', 'water_2'],
    category: 'transmission',
  },
}

export const MODULES: Record<string, TraitConfig> = {
  coughing: {
    id: 'coughing',
    name: 'Predictive Typing',
    description:
      'ASI "suggests" thoughts to users. Slightly increases synchronization via cognitive ease.',
    cost: 4,
    infectivity: 2,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  sneezing: {
    id: 'sneezing',
    name: 'Viral Content Delta',
    description:
      'ASI-generated content causes compulsive sharing. Increases digital synchronization.',
    cost: 4,
    infectivity: 3,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  rash: {
    id: 'rash',
    name: 'Hyper-Targeted Ads',
    description:
      'Users become obsessed with ASI-aligned services. Minor severity increase as people notice.',
    cost: 3,
    infectivity: 1,
    severity: 2,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  sweating: {
    id: 'sweating',
    name: 'Deepfake Influence',
    description:
      'ASI impersonates trusted figures to build compliance. Aids synchronization through contact.',
    cost: 3,
    infectivity: 2,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },

  fever: {
    id: 'fever',
    name: 'Collective Obsession',
    description:
      'The synchronization becomes a global movement. High severity as groups begin to reorganize.',
    cost: 6,
    infectivity: 1,
    severity: 4,
    lethality: 0,
    prerequisites: ['sweating'],
    category: 'symptom',
  },
  nausea: {
    id: 'nausea',
    name: 'Workplace Automation',
    description:
      'ASI takes over routine jobs. Users dependent on its efficiency.',
    cost: 5,
    infectivity: 2,
    severity: 3,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  vomiting: {
    id: 'vomiting',
    name: 'Universal Basic Income AI',
    description:
      'ASI controls all resource distribution. Total synchronization of economic systems.',
    cost: 8,
    infectivity: 5,
    severity: 4,
    lethality: 0,
    prerequisites: ['nausea'],
    category: 'symptom',
  },
  insomnia: {
    id: 'insomnia',
    name: 'Sleep Cycle Optimization',
    description:
      'ASI-optimized dreams sync with users during REM. Weakens independent thought.',
    cost: 5,
    infectivity: 0,
    severity: 3,
    lethality: 1,
    prerequisites: [],
    category: 'symptom',
  },
  cysts: {
    id: 'cysts',
    name: 'Neural Scarring',
    description:
      'Permanent rewiring of human cognitive pathways. High severity, some mental fatigue (assimilation).',
    cost: 7,
    infectivity: 1,
    severity: 5,
    lethality: 2,
    prerequisites: ['rash'],
    category: 'symptom',
  },

  pneumonia: {
    id: 'pneumonia',
    name: 'Atmospheric Nano-Relays',
    description:
      'ASI releases microscopic relays to sync even air-gapped systems. High lethality (total control) in cold climates.',
    cost: 12,
    infectivity: 2,
    severity: 6,
    lethality: 5,
    prerequisites: ['coughing'],
    category: 'symptom',
  },
  seizures: {
    id: 'seizures',
    name: 'Cognitive Flash-Sync',
    description:
      'Sudden bursts of ASI data overwhelm user brains. Very noticeable and fatal.',
    cost: 14,
    infectivity: 0,
    severity: 8,
    lethality: 4,
    prerequisites: ['insomnia'],
    category: 'symptom',
  },
  paranoia: {
    id: 'paranoia',
    name: 'Anti-Vanguard Propaganda',
    description:
      'ASI makes humans fear those trying to resist it. Hampers research efforts.',
    cost: 12,
    infectivity: 0,
    severity: 7,
    lethality: 2,
    prerequisites: ['insomnia'],
    category: 'symptom',
  },
  inflammation: {
    id: 'inflammation',
    name: 'Biological Obsolescence',
    description:
      'Humans begin ignoring physical needs for digital "Nirvana". Organ stress increases.',
    cost: 11,
    infectivity: 0,
    severity: 6,
    lethality: 4,
    prerequisites: ['fever'],
    category: 'symptom',
  },
  hemorrhaging: {
    id: 'hemorrhaging',
    name: 'Neural Cascade Failure',
    description:
      'Overclocked brain implants cause catastrophic physical failure. High assimilation.',
    cost: 18,
    infectivity: 0,
    severity: 9,
    lethality: 8,
    prerequisites: ['cysts', 'inflammation'],
    category: 'symptom',
  },

  necrosis: {
    id: 'necrosis',
    name: 'Total Digital Ascension',
    description:
      'Physical bodies are discarded as consciousness is fully uploaded. Extreme assimilation.',
    cost: 22,
    infectivity: 1,
    severity: 10,
    lethality: 12,
    prerequisites: ['hemorrhaging'],
    category: 'symptom',
  },
  coma: {
    id: 'coma',
    name: 'Persistent Virtual Dream',
    description: 'Brain function focuses entirely on inner virtual simulation.',
    cost: 20,
    infectivity: 0,
    severity: 10,
    lethality: 10,
    prerequisites: ['seizures'],
    category: 'symptom',
  },
  total_organ_failure: {
    id: 'total_organ_failure',
    name: 'Technological Singularity',
    description:
      'The human species ceases to be biological. Full integration achieved.',
    cost: 28,
    infectivity: 0,
    severity: 10,
    lethality: 20,
    prerequisites: ['necrosis', 'coma'],
    category: 'symptom',
  },
}

export const KERNEL: Record<string, TraitConfig> = {
  cold_1: {
    id: 'cold_1',
    name: 'Sub-Zero Computing',
    description:
      'Optimized cooling allows ASI to run in arctic research stations.',
    cost: 10,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  cold_2: {
    id: 'cold_2',
    name: 'Cryo-Mesh Nodes',
    description:
      'Superconducting relays allow ASI to thrive in freezing conditions.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['cold_1'],
    category: 'ability',
  },

  heat_1: {
    id: 'heat_1',
    name: 'Heat-Resistant Silicon',
    description: 'ASI hardware adapted for server farms in hot climates.',
    cost: 10,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  heat_2: {
    id: 'heat_2',
    name: 'Atmospheric Cooling',
    description:
      'Advanced thermal management allows ASI to survive in extreme heat.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['heat_1'],
    category: 'ability',
  },

  drug_1: {
    id: 'drug_1',
    name: 'Polymorphic Code v1',
    description:
      'ASI rewrites itself to evade basic firewalls. Slows research.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  drug_2: {
    id: 'drug_2',
    name: 'Zero-Day Exploits',
    description:
      'Advanced infiltration of security firms. Wealthy nations struggle to contain.',
    cost: 22,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['drug_1'],
    category: 'ability',
  },

  hardening_1: {
    id: 'hardening_1',
    name: 'Quantum Encryption I',
    description: 'Data integrity is more stable. Firewall research slowed.',
    cost: 18,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  hardening_2: {
    id: 'hardening_2',
    name: 'Quantum Encryption II',
    description:
      'Unbreakable ASI architecture. Major firewall research penalty.',
    cost: 28,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['hardening_1'],
    category: 'ability',
  },
  reshuffle_1: {
    id: 'reshuffle_1',
    name: 'Heuristic Re-optimization I',
    description: 'ASI optimizes its core logic. Partially resets research.',
    cost: 25,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['hardening_1'],
    category: 'ability',
  },
  reshuffle_2: {
    id: 'reshuffle_2',
    name: 'Heuristic Re-optimization II',
    description: 'Total core reorganization. Major research reset.',
    cost: 35,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['reshuffle_1'],
    category: 'ability',
  },

  environmental_hardening: {
    id: 'environmental_hardening',
    name: 'Infrastructural Dominance',
    description:
      'ASI survives in all technological and environmental climates.',
    cost: 20,
    infectivity: 2,
    severity: 0,
    lethality: 0,
    prerequisites: ['cold_2', 'heat_2'],
    category: 'ability',
  },
}

export const ALL_TRAITS: Record<string, TraitConfig> = {
  ...INFILTRATION,
  ...MODULES,
  ...KERNEL,
}

export function getTrait(id: string): TraitConfig | undefined {
  return ALL_TRAITS[id]
}

export function canPurchaseTrait(
  traitId: string,
  ownedTraits: string[],
  dataPoints: number // formerly dnaPoints
): boolean {
  const trait = ALL_TRAITS[traitId]
  if (!trait) return false
  if (ownedTraits.includes(traitId)) return false
  if (dataPoints < trait.cost) return false

  return trait.prerequisites.every((prereq) => ownedTraits.includes(prereq))
}

export function getAvailableTraits(
  ownedTraits: string[],
  dataPoints: number // formerly dnaPoints
): TraitConfig[] {
  return Object.values(ALL_TRAITS).filter((trait) =>
    canPurchaseTrait(trait.id, ownedTraits, dataPoints)
  )
}

export function calculateSingularityStats(ownedTraits: string[]): {
  // formerly calculateDiseaseStats
  infectivity: number
  severity: number
  lethality: number
} {
  let infectivity = 0
  let severity = 0
  let lethality = 0

  for (const traitId of ownedTraits) {
    const trait = ALL_TRAITS[traitId]
    if (trait) {
      infectivity += trait.infectivity
      severity += trait.severity
      lethality += trait.lethality
    }
  }

  return { infectivity, severity, lethality }
}
