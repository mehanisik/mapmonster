import { useGameStore } from './use-game-store'

export function useGameSummary() {
  return useGameStore((state) => {
    const infected = state.countries.reduce((sum, c) => sum + c.infected, 0)
    const dead = state.countries.reduce((sum, c) => sum + c.dead, 0)
    const population = state.countries.reduce((sum, c) => sum + c.population, 0)
    const infectedCountries = state.countries.filter(
      (c) => c.infected > 0
    ).length

    return {
      infected,
      dead,
      healthy: population - infected - dead,
      population,
      infectedCountries,
      cureProgress: state.cure.progress,
      isDetected: state.cure.isDetected,
      dnaPoints: state.dnaPoints,
      infectivity: state.stats.infectivity,
      severity: state.stats.severity,
      lethality: state.stats.lethality,
    }
  })
}

export function useOwnedTraitIds() {
  return useGameStore((state) => {
    const owned: string[] = []
    const { traits } = state

    // Symptoms
    for (const [id, value] of Object.entries(traits.symptoms)) {
      if (value) owned.push(id)
    }

    // Transmissions
    for (const [key, level] of Object.entries(traits.transmissions)) {
      for (let i = 1; i <= level; i++) {
        owned.push(`${key}_${i}`)
      }
    }

    // Abilities
    for (const [key, level] of Object.entries(traits.abilities)) {
      for (let i = 1; i <= level; i++) {
        owned.push(`${key}_${i}`)
      }
    }

    return owned
  })
}

export function useSelectedCountry() {
  return useGameStore((state) => {
    const { selectedCountryId, countries } = state
    if (!selectedCountryId) return null
    return countries.find((c) => c.id === selectedCountryId) || null
  })
}

export function useInfectedCountries() {
  return useGameStore((state) => state.countries.filter((c) => c.infected > 0))
}

export function useWorldEvents() {
  return useGameStore((state) => state.events)
}
