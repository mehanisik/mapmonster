import type {
  Country,
  DiseaseTraits,
  GameSliceCreator,
  WorldEvent,
} from '../store-types'

function getClimateMultiplier(country: Country, traits: DiseaseTraits): number {
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

function getWealthMultiplier(country: Country, traits: DiseaseTraits): number {
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
  cure: {
    progress: 0,
    isDetected: false,
    researchStarted: false,
    totalResearchPower: 0,
  },
  dnaAnomalies: [],

  spawnDnaAnomaly: () => {
    set((state) => {
      if (state.dnaAnomalies.length >= 10) return
      const infectedCountries = state.countries.filter((c) => c.infected > 0)
      if (infectedCountries.length === 0) return

      const randomCountry =
        infectedCountries[Math.floor(Math.random() * infectedCountries.length)]
      const offsetLat = (Math.random() - 0.5) * 20
      const offsetLng = (Math.random() - 0.5) * 40

      state.dnaAnomalies.push({
        id: `dna-${Date.now()}`,
        lat: randomCountry.lat + offsetLat,
        lng: randomCountry.lng + offsetLng,
        points: Math.floor(Math.random() * 4) + 2,
        countryId: randomCountry.id,
      })
    })
  },

  collectDnaAnomaly: (id) => {
    set((state) => {
      const anomaly = state.dnaAnomalies.find((a) => a.id === id)
      if (anomaly) {
        state.dnaPoints += anomaly.points
        state.dnaAnomalies = state.dnaAnomalies.filter((a) => a.id !== id)
      }
    })
  },

  infectCountry: (countryId, count) => {
    set((state) => {
      const country = state.countries.find((c) => c.id === countryId)
      if (country && country.infected === 0) {
        country.infected = count
        const message = `First case detected in ${country.name}!`

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
        casual: { infection: 1.5, cure: 0.5, dna: 1.5 },
        normal: { infection: 1.0, cure: 1.0, dna: 1.0 },
        brutal: { infection: 0.8, cure: 1.5, dna: 0.8 },
        mega_brutal: { infection: 0.7, cure: 2.0, dna: 0.6 },
      }[state.difficulty]

      let totalInfected = 0
      let totalHealthy = 0
      let totalDead = 0

      
      for (const country of state.countries) {
        const currentlyInfected = country.infected
        const currentlyDead = country.dead
        const healthy = country.population - currentlyInfected - currentlyDead

        if (currentlyInfected > 0 && healthy > 0) {
          
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

          
          const infectionRatio = currentlyInfected / country.population
          const newInfections = Math.max(
            1,
            Math.floor(currentlyInfected * spreadRate * (1 - infectionRatio))
          )

          country.infected = Math.min(
            country.population - country.dead,
            country.infected + newInfections
          )
        }

        
        if (country.infected > 0 && state.stats.lethality > 0) {
          const baseLethality = state.stats.lethality * 0.001
          const healthcarePenalty = 1 - (country.healthcare / 100) * 0.5
          const deathRate = baseLethality * healthcarePenalty

          const newDeaths = Math.max(
            0,
            Math.min(country.infected, Math.floor(country.infected * deathRate))
          )

          country.dead += newDeaths
          country.infected -= newDeaths
        }

        
        
        const impactRatio =
          (country.infected + country.dead) / country.population
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
            message: `${country.name} closes land borders.`,
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
            message: `${country.name} suspends all air travel.`,
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
            message: `${country.name} shuts down seaports.`,
            severity: 'critical',
            countryId: country.id,
          })
        }

        
        
        if (country.awareness > 20) {
          const wealthFactor =
            { wealthy: 2.5, developing: 1.0, poor: 0.3 }[country.wealth] || 1.0
          const chaosFactor = 1 - (country.dead / country.population) * 2 
          country.researchContribution = Math.max(
            0,
            country.healthcare * wealthFactor * chaosFactor * 0.005
          )
        }

        totalInfected += country.infected
        totalHealthy += country.population - country.infected - country.dead
        totalDead += country.dead
      }

      
      if (state.tickCount % 5 === 0) {
        for (const route of state.routes) {
          const from = state.countries.find((c) => c.id === route.from)
          const to = state.countries.find((c) => c.id === route.to)

          if (!(from && to) || from.infected <= 10 || to.infected > 0) continue

          
          if (route.type === 'air' && !(from.airportsOpen && to.airportsOpen))
            continue
          if (route.type === 'sea' && !(from.seaportsOpen && to.seaportsOpen))
            continue
          if (route.type === 'land' && !(from.bordersOpen && to.bordersOpen))
            continue

          
          const fromInfectedRatio = from.infected / from.population
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
            fromInfectedRatio *
            route.traffic *
            0.02 *
            traitBonus *
            diffMult.infection

          if (Math.random() < transmissionChance) {
            to.infected = Math.ceil(Math.random() * 5) + 1
            state.events.unshift({
              id: `evt-${Date.now()}-${Math.random()}`,
              timestamp: state.tickCount,
              type: 'infection',
              message: `Disease has crossed borders into ${to.name}!`,
              severity: 'warning',
              countryId: to.id,
            })
          }
        }
      }

      
      
      if (state.cure.isDetected || totalDead > 0) {
        if (!state.cure.isDetected) {
          state.cure.isDetected = true
          state.cure.researchStarted = true
          state.events.unshift({
            id: `evt-cure-start-${Date.now()}`,
            timestamp: state.tickCount,
            type: 'cure',
            message:
              'Public health crisis declared! WHO initiates cure development.',
            severity: 'critical',
          })
        }

        const researchPower = state.countries.reduce(
          (sum, c) => sum + c.researchContribution,
          0
        )
        state.cure.totalResearchPower = researchPower

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
        state.cure.progress = Math.min(100, state.cure.progress + cureIncrease)
      }

      
      if (state.tickCount % 20 === 0) {
        const infectedRatio =
          totalInfected / (totalInfected + totalHealthy + totalDead)
        if (infectedRatio > 0) {
          const dnaGain = Math.ceil(infectedRatio * 5 * diffMult.dna)
          state.dnaPoints += dnaGain
        }
      }

      
      if (totalHealthy === 0 && totalInfected === 0) {
        state.status = 'won'
      } else if (state.cure.progress >= 100) {
        state.status = 'lost'
      }
    })
  },
})
