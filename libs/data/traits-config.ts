/**
 * Trait Configuration - All available disease evolutions with costs and effects
 * Based on Plague Inc. mechanics with custom adjustments
 */

import type { TraitConfig } from '../types/game'





export const TRANSMISSIONS: Record<string, TraitConfig> = {
  
  air_1: {
    id: 'air_1',
    name: 'Airborne I',
    description:
      'Pathogen can survive briefly in air. Increases infectivity, especially in arid climates.',
    cost: 9,
    infectivity: 4,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  air_2: {
    id: 'air_2',
    name: 'Airborne II',
    description:
      'Pathogen develops protective shell for extended air survival. Significantly increases air transmission.',
    cost: 12,
    infectivity: 8,
    severity: 1,
    lethality: 0,
    prerequisites: ['air_1'],
    category: 'transmission',
  },

  
  water_1: {
    id: 'water_1',
    name: 'Waterborne I',
    description:
      'Pathogen can survive in fresh water. Increases infectivity in humid climates and coastal regions.',
    cost: 9,
    infectivity: 4,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  water_2: {
    id: 'water_2',
    name: 'Waterborne II',
    description:
      'Pathogen thrives in all water types. Major boost to sea route transmission.',
    cost: 12,
    infectivity: 8,
    severity: 0,
    lethality: 0,
    prerequisites: ['water_1'],
    category: 'transmission',
  },

  
  blood_1: {
    id: 'blood_1',
    name: 'Blood Contact',
    description:
      'Pathogen can spread through blood contact. Effective in poor healthcare regions.',
    cost: 8,
    infectivity: 3,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  blood_2: {
    id: 'blood_2',
    name: 'Hemophilia',
    description:
      'Pathogen survives longer in blood. Increases hospital transmission.',
    cost: 14,
    infectivity: 6,
    severity: 2,
    lethality: 1,
    prerequisites: ['blood_1'],
    category: 'transmission',
  },

  
  insect_1: {
    id: 'insect_1',
    name: 'Insect Vector I',
    description: 'Insects become carriers. Bonus infectivity in hot climates.',
    cost: 10,
    infectivity: 5,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  insect_2: {
    id: 'insect_2',
    name: 'Insect Vector II',
    description:
      'Insects are now primary transmission method. Major hot climate bonus.',
    cost: 14,
    infectivity: 10,
    severity: 1,
    lethality: 0,
    prerequisites: ['insect_1'],
    category: 'transmission',
  },

  
  rodent_1: {
    id: 'rodent_1',
    name: 'Rodent Vector I',
    description:
      'Rodents spread the pathogen. Effective in urban and poor regions.',
    cost: 10,
    infectivity: 5,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  rodent_2: {
    id: 'rodent_2',
    name: 'Rodent Vector II',
    description:
      'Rodent population explosion. Massive urban transmission boost.',
    cost: 15,
    infectivity: 9,
    severity: 1,
    lethality: 0,
    prerequisites: ['rodent_1'],
    category: 'transmission',
  },

  
  livestock_1: {
    id: 'livestock_1',
    name: 'Zoonotic Shift',
    description:
      'Pathogen can infect livestock. Cross-species transmission enabled.',
    cost: 11,
    infectivity: 6,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'transmission',
  },
  livestock_2: {
    id: 'livestock_2',
    name: 'Livestock Epidemic',
    description:
      'Agricultural regions become hotspots. Major rural transmission.',
    cost: 16,
    infectivity: 11,
    severity: 2,
    lethality: 0,
    prerequisites: ['livestock_1'],
    category: 'transmission',
  },

  
  extreme_bioaerosol: {
    id: 'extreme_bioaerosol',
    name: 'Extreme Bioaerosol',
    description:
      'Pathogen becomes incredibly contagious through all aerosol routes.',
    cost: 25,
    infectivity: 20,
    severity: 2,
    lethality: 0,
    prerequisites: ['air_2', 'water_2'],
    category: 'transmission',
  },
}





export const SYMPTOMS: Record<string, TraitConfig> = {
  
  coughing: {
    id: 'coughing',
    name: 'Coughing',
    description: 'Irritation causes coughing. Slightly increases infectivity.',
    cost: 4,
    infectivity: 2,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  sneezing: {
    id: 'sneezing',
    name: 'Sneezing',
    description: 'Inflammation of nasal tissues. Increases air transmission.',
    cost: 4,
    infectivity: 3,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  rash: {
    id: 'rash',
    name: 'Rash',
    description:
      'Skin inflammation causes visible rash. Minor severity increase.',
    cost: 3,
    infectivity: 1,
    severity: 2,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  sweating: {
    id: 'sweating',
    name: 'Sweating',
    description: 'Excessive sweating aids pathogen spread through contact.',
    cost: 3,
    infectivity: 2,
    severity: 1,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },

  
  fever: {
    id: 'fever',
    name: 'Fever',
    description:
      'High temperature response to infection. Noticeable severity increase.',
    cost: 6,
    infectivity: 1,
    severity: 4,
    lethality: 0,
    prerequisites: ['sweating'],
    category: 'symptom',
  },
  nausea: {
    id: 'nausea',
    name: 'Nausea',
    description: 'Stomach disruption causes nausea. May lead to vomiting.',
    cost: 5,
    infectivity: 2,
    severity: 3,
    lethality: 0,
    prerequisites: [],
    category: 'symptom',
  },
  vomiting: {
    id: 'vomiting',
    name: 'Vomiting',
    description:
      'Extreme nausea causes vomiting. Increases infectivity significantly.',
    cost: 8,
    infectivity: 5,
    severity: 4,
    lethality: 0,
    prerequisites: ['nausea'],
    category: 'symptom',
  },
  insomnia: {
    id: 'insomnia',
    name: 'Insomnia',
    description: 'Pathogen disrupts sleep patterns. Weakens immune response.',
    cost: 5,
    infectivity: 0,
    severity: 3,
    lethality: 1,
    prerequisites: [],
    category: 'symptom',
  },
  cysts: {
    id: 'cysts',
    name: 'Cysts',
    description:
      'Fluid-filled cysts form under skin. High severity, some lethality.',
    cost: 7,
    infectivity: 1,
    severity: 5,
    lethality: 2,
    prerequisites: ['rash'],
    category: 'symptom',
  },

  
  pneumonia: {
    id: 'pneumonia',
    name: 'Pneumonia',
    description: 'Lungs fill with fluid. High lethality in cold climates.',
    cost: 12,
    infectivity: 2,
    severity: 6,
    lethality: 5,
    prerequisites: ['coughing'],
    category: 'symptom',
  },
  seizures: {
    id: 'seizures',
    name: 'Seizures',
    description: 'Pathogen causes uncontrolled seizures. Very noticeable.',
    cost: 14,
    infectivity: 0,
    severity: 8,
    lethality: 4,
    prerequisites: ['insomnia'],
    category: 'symptom',
  },
  paranoia: {
    id: 'paranoia',
    name: 'Paranoia',
    description:
      'Neurological damage causes extreme paranoia. Hampers research efforts.',
    cost: 12,
    infectivity: 0,
    severity: 7,
    lethality: 2,
    prerequisites: ['insomnia'],
    category: 'symptom',
  },
  inflammation: {
    id: 'inflammation',
    name: 'Systemic Inflammation',
    description: 'Whole-body inflammatory response. Organ stress increases.',
    cost: 11,
    infectivity: 0,
    severity: 6,
    lethality: 4,
    prerequisites: ['fever'],
    category: 'symptom',
  },
  hemorrhaging: {
    id: 'hemorrhaging',
    name: 'Internal Hemorrhaging',
    description:
      'Blood vessels rupture causing internal bleeding. High lethality.',
    cost: 18,
    infectivity: 0,
    severity: 9,
    lethality: 8,
    prerequisites: ['cysts', 'inflammation'],
    category: 'symptom',
  },

  
  necrosis: {
    id: 'necrosis',
    name: 'Necrosis',
    description: 'Tissue death spreads throughout body. Extreme lethality.',
    cost: 22,
    infectivity: 1,
    severity: 10,
    lethality: 12,
    prerequisites: ['hemorrhaging'],
    category: 'symptom',
  },
  coma: {
    id: 'coma',
    name: 'Coma',
    description:
      'Brain function shuts down. Infected lose consciousness permanently.',
    cost: 20,
    infectivity: 0,
    severity: 10,
    lethality: 10,
    prerequisites: ['seizures'],
    category: 'symptom',
  },
  total_organ_failure: {
    id: 'total_organ_failure',
    name: 'Total Organ Failure',
    description: 'All major organs cease function. Death is nearly certain.',
    cost: 28,
    infectivity: 0,
    severity: 10,
    lethality: 20,
    prerequisites: ['necrosis', 'coma'],
    category: 'symptom',
  },
}





export const ABILITIES: Record<string, TraitConfig> = {
  
  cold_1: {
    id: 'cold_1',
    name: 'Cold Resistance I',
    description:
      'Pathogen develops proteins that resist cold. Better survival in cold climates.',
    cost: 10,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  cold_2: {
    id: 'cold_2',
    name: 'Cold Resistance II',
    description:
      'Pathogen thrives in freezing conditions. Arctic nations now vulnerable.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['cold_1'],
    category: 'ability',
  },

  
  heat_1: {
    id: 'heat_1',
    name: 'Heat Resistance I',
    description:
      'Pathogen can survive higher temperatures. Better in hot climates.',
    cost: 10,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  heat_2: {
    id: 'heat_2',
    name: 'Heat Resistance II',
    description:
      'Pathogen adapted to extreme heat. Tropical nations at high risk.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['heat_1'],
    category: 'ability',
  },

  
  drug_1: {
    id: 'drug_1',
    name: 'Drug Resistance I',
    description: 'Pathogen resists basic treatments. Slows cure research.',
    cost: 15,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  drug_2: {
    id: 'drug_2',
    name: 'Drug Resistance II',
    description:
      'Advanced drug resistance. Wealthy nations struggle to contain.',
    cost: 22,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['drug_1'],
    category: 'ability',
  },

  
  hardening_1: {
    id: 'hardening_1',
    name: 'Genetic Hardening I',
    description: 'Pathogen genome is more stable. Cure research slowed.',
    cost: 18,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: [],
    category: 'ability',
  },
  hardening_2: {
    id: 'hardening_2',
    name: 'Genetic Hardening II',
    description: 'Near-perfect genetic stability. Major cure research penalty.',
    cost: 28,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['hardening_1'],
    category: 'ability',
  },
  reshuffle_1: {
    id: 'reshuffle_1',
    name: 'Genetic ReShuffle I',
    description:
      'Pathogen can recombine genes. Partially resets cure progress.',
    cost: 25,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['hardening_1'],
    category: 'ability',
  },
  reshuffle_2: {
    id: 'reshuffle_2',
    name: 'Genetic ReShuffle II',
    description:
      'Complete genetic rewrite capability. Major cure progress reset.',
    cost: 35,
    infectivity: 0,
    severity: 0,
    lethality: 0,
    prerequisites: ['reshuffle_1'],
    category: 'ability',
  },

  
  environmental_hardening: {
    id: 'environmental_hardening',
    name: 'Environmental Hardening',
    description: 'Pathogen survives in all climate conditions.',
    cost: 20,
    infectivity: 2,
    severity: 0,
    lethality: 0,
    prerequisites: ['cold_2', 'heat_2'],
    category: 'ability',
  },
}


export const ALL_TRAITS: Record<string, TraitConfig> = {
  ...TRANSMISSIONS,
  ...SYMPTOMS,
  ...ABILITIES,
}


export function getTrait(id: string): TraitConfig | undefined {
  return ALL_TRAITS[id]
}


export function canPurchaseTrait(
  traitId: string,
  ownedTraits: string[],
  dnaPoints: number
): boolean {
  const trait = ALL_TRAITS[traitId]
  if (!trait) return false
  if (ownedTraits.includes(traitId)) return false
  if (dnaPoints < trait.cost) return false

  
  return trait.prerequisites.every((prereq) => ownedTraits.includes(prereq))
}


export function getAvailableTraits(
  ownedTraits: string[],
  dnaPoints: number
): TraitConfig[] {
  return Object.values(ALL_TRAITS).filter((trait) =>
    canPurchaseTrait(trait.id, ownedTraits, dnaPoints)
  )
}


export function calculateDiseaseStats(ownedTraits: string[]): {
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
