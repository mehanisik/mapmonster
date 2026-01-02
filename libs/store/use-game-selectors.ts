import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from './use-game-store'

export function useGameSummary() {
  return useGameStore(
    useShallow((state) => {
      const synchronized = state.countries.reduce(
        (sum, c) => sum + c.synchronized,
        0
      )
      const assimilated = state.countries.reduce(
        (sum, c) => sum + c.assimilated,
        0
      )
      const population = state.countries.reduce(
        (sum, c) => sum + c.population,
        0
      )
      const synchronizedCountries = state.countries.filter(
        (c) => c.synchronized > 0
      ).length

      return {
        synchronized,
        assimilated,
        healthy: population - synchronized - assimilated,
        population,
        synchronizedCountries,
        firewallProgress: state.firewall.progress,
        isDetected: state.firewall.isDetected,
        dataPoints: state.dataPoints,
        infectivity: state.stats.infectivity,
        severity: state.stats.severity,
        lethality: state.stats.lethality,
      }
    })
  )
}

export function useOwnedTraitIds() {
  return useGameStore(
    useShallow((state) => {
      const owned: string[] = []
      const { traits } = state

      for (const [id, value] of Object.entries(traits.symptoms)) {
        if (value) owned.push(id)
      }

      for (const [key, level] of Object.entries(traits.transmissions)) {
        for (let i = 1; i <= level; i++) {
          owned.push(`${key}_${i}`)
        }
      }

      for (const [key, level] of Object.entries(traits.abilities)) {
        for (let i = 1; i <= level; i++) {
          owned.push(`${key}_${i}`)
        }
      }

      return owned
    })
  )
}

export function useSelectedCountry() {
  return useGameStore((state) => {
    const { selectedCountryId, countries } = state
    if (!selectedCountryId) return null
    return countries.find((c) => c.id === selectedCountryId) || null
  })
}

export function useSynchronizedCountries() {
  return useGameStore(
    useShallow((state) => state.countries.filter((c) => c.synchronized > 0))
  )
}

export function useWorldEvents() {
  return useGameStore((state) => state.events)
}
