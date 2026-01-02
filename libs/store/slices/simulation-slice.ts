import type {
  Country,
  GameSliceCreator,
  SingularityTraits, // formerly DiseaseTraits
  WorldEvent,
} from '../store-types'

function getClimateMultiplier(
  country: Country,
  traits: SingularityTraits
): number {
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

function getWealthMultiplier(
  country: Country,
  traits: SingularityTraits
): number {
  let mult = 1.0
  if (country.wealth === 'wealthy') {
    mult *= 0.7 + traits.abilities.drugResistance * 0.15
  } else if (country.wealth === 'poor') {
    mult *= 1.3
  }
  return mult
}

export const createSimulationSlice: GameSliceCreator<
  import('../store-types').SimulationSlice
> = (set) => ({
  firewall: {
    // formerly cure
    progress: 0,
    isDetected: false,
    researchStarted: false,
    totalResearchPower: 0,
  },
  dataAnomalies: [], // formerly dnaAnomalies

  spawnDataAnomaly: () => {
    // formerly spawnDnaAnomaly
    set((state) => {
      if (state.dataAnomalies.length >= 10) return
      const synchronizedCountries = state.countries.filter(
        (c) => c.synchronized > 0
      )
      if (synchronizedCountries.length === 0) return

      const randomCountry =
        synchronizedCountries[
          Math.floor(Math.random() * synchronizedCountries.length)
        ]
      const offsetLat = (Math.random() - 0.5) * 20
      const offsetLng = (Math.random() - 0.5) * 40

      state.dataAnomalies.push({
        id: `data-${Date.now()}`,
        lat: randomCountry.lat + offsetLat,
        lng: randomCountry.lng + offsetLng,
        points: Math.floor(Math.random() * 4) + 2,
        countryId: randomCountry.id,
      })
    })
  },

  collectDataAnomaly: (id) => {
    // formerly collectDnaAnomaly
    set((state) => {
      const anomaly = state.dataAnomalies.find((a) => a.id === id)
      if (anomaly) {
        state.dataPoints += anomaly.points
        state.dataAnomalies = state.dataAnomalies.filter((a) => a.id !== id)
      }
    })
  },

  synchronizeCountry: (countryId, count) => {
    // formerly infectCountry
    set((state) => {
      const country = state.countries.find((c) => c.id === countryId)
      if (country && country.synchronized === 0) {
        country.synchronized = count
        const message = `Initial node established in ${country.name}!`

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

  gameTick: () => {
    set((state) => {
      if (state.status !== 'playing') return

      state.tickCount += 1

      const diffMult = {
        casual: { infection: 1.5, cure: 0.5, data: 1.5 },
        normal: { infection: 1.0, cure: 1.0, data: 1.0 },
        brutal: { infection: 0.8, cure: 1.5, data: 0.8 },
        mega_brutal: { infection: 0.7, cure: 2.0, data: 0.6 },
      }[state.difficulty]

      let totalSynchronized = 0
      let totalUnlinked = 0
      let totalAssimilated = 0

      for (const country of state.countries) {
        const currentlySynchronized = country.synchronized
        const currentlyAssimilated = country.assimilated
        const unlinked =
          country.population - currentlySynchronized - currentlyAssimilated

        if (currentlySynchronized > 0 && unlinked > 0) {
          const climateMult = getClimateMultiplier(country, state.traits)
          const wealthMult = getWealthMultiplier(country, state.traits)
          const healthcarePenalty = 1 - (country.healthcare / 100) * 0.8

          const baseInfectivity = 0.05 + state.stats.infectivity * 0.02
          const spreadRate =
            baseInfectivity *
            climateMult *
            wealthMult *
            healthcarePenalty *
            diffMult.infection

          const synchronizationRatio =
            currentlySynchronized / country.population
          const newSynchronizations = Math.max(
            1,
            Math.floor(
              currentlySynchronized * spreadRate * (1 - synchronizationRatio)
            )
          )

          country.synchronized = Math.min(
            country.population - country.assimilated,
            country.synchronized + newSynchronizations
          )
        }

        if (country.synchronized > 0 && state.stats.lethality > 0) {
          const baseLethality = state.stats.lethality * 0.001
          const healthcarePenalty = 1 - (country.healthcare / 100) * 0.5
          const deathRate = baseLethality * healthcarePenalty

          const newAssimilations = Math.max(
            0,
            Math.min(
              country.synchronized,
              Math.floor(country.synchronized * deathRate)
            )
          )

          country.assimilated += newAssimilations
          country.synchronized -= newAssimilations
        }

        const impactRatio =
          (country.synchronized + country.assimilated) / country.population
        const visibilityFactor = state.stats.severity * 0.1 + impactRatio * 50
        country.awareness = Math.min(
          100,
          country.awareness + visibilityFactor * 0.05
        )

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
            message: `${country.name} isolates network infrastructure.`,
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
            message: `${country.name} suspends inter-regional data transit.`,
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
            message: `${country.name} activates national airgap.`,
            severity: 'critical',
            countryId: country.id,
          })
        }

        if (country.awareness > 20) {
          const wealthFactor =
            { wealthy: 2.5, developing: 1.0, poor: 0.3 }[country.wealth] || 1.0
          const chaosFactor = 1 - (country.assimilated / country.population) * 2
          country.researchContribution = Math.max(
            0,
            country.healthcare * wealthFactor * chaosFactor * 0.005
          )
        }

        totalSynchronized += country.synchronized
        totalUnlinked +=
          country.population - country.synchronized - country.assimilated
        totalAssimilated += country.assimilated
      }

      if (state.tickCount % 5 === 0) {
        for (const route of state.routes) {
          const from = state.countries.find((c) => c.id === route.from)
          const to = state.countries.find((c) => c.id === route.to)

          if (!(from && to) || from.synchronized <= 10 || to.synchronized > 0)
            continue

          if (route.type === 'air' && !(from.airportsOpen && to.airportsOpen))
            continue
          if (route.type === 'sea' && !(from.seaportsOpen && to.seaportsOpen))
            continue
          if (route.type === 'land' && !(from.bordersOpen && to.bordersOpen))
            continue

          const fromSynchronizedRatio = from.synchronized / from.population
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
            fromSynchronizedRatio *
            route.traffic *
            0.02 *
            traitBonus *
            diffMult.infection

          if (Math.random() < transmissionChance) {
            to.synchronized = Math.ceil(Math.random() * 5) + 1
            state.events.unshift({
              id: `evt-${Date.now()}-${Math.random()}`,
              timestamp: state.tickCount,
              type: 'infection',
              message: `Synchronization protocol reached ${to.name}!`,
              severity: 'warning',
              countryId: to.id,
            })
          }
        }
      }

      if (state.firewall.isDetected || totalAssimilated > 0) {
        if (!state.firewall.isDetected) {
          state.firewall.isDetected = true
          state.firewall.researchStarted = true
          state.events.unshift({
            id: `evt-cure-start-${Date.now()}`,
            timestamp: state.tickCount,
            type: 'cure',
            message:
              'Global security alert! Multinational task force initiates Global Firewall development.',
            severity: 'critical',
          })
        }

        const researchPower = state.countries.reduce(
          (sum, c) => sum + c.researchContribution,
          0
        )
        state.firewall.totalResearchPower = researchPower

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
        state.firewall.progress = Math.min(
          100,
          state.firewall.progress + cureIncrease
        )
      }

      if (state.tickCount % 20 === 0) {
        const synchronizedRatio =
          totalSynchronized /
          (totalSynchronized + totalUnlinked + totalAssimilated)
        if (synchronizedRatio > 0) {
          const dataGain = Math.ceil(synchronizedRatio * 5 * diffMult.data)
          state.dataPoints += dataGain
        }
      }

      if (totalUnlinked === 0 && totalSynchronized === 0) {
        state.status = 'won'
      } else if (state.firewall.progress >= 100) {
        state.status = 'lost'
      }
    })
  },
})
