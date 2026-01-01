import type {
  Country,
  GameSliceCreator,
  TransportRoute,
  WorldEvent,
} from '../store-types'

export const createWorldSlice: GameSliceCreator<
  import('../store-types').WorldSlice
> = (set) => ({
  countries: [],
  routes: [],
  selectedCountryId: null,
  isLoadingData: false,

  initializeGame: async () => {
    set((state) => {
      state.isLoadingData = true
    })
    try {
      const response = await fetch('/api/countries')
      if (!response.ok) throw new Error('Failed to load country data')
      const {
        countries,
        routes,
      }: { countries: Country[]; routes: TransportRoute[] } =
        await response.json()
      set((state) => {
        state.countries = countries
        state.routes = routes
        state.isLoadingData = false
      })
    } catch (error) {
      console.error('Failed to initialize game data:', error)
      set((state) => {
        state.isLoadingData = false
      })
    }
  },

  selectCountry: (countryId) => {
    set((state) => {
      state.selectedCountryId = countryId
    })
  },

  infectStartingCountry: (countryId) => {
    set((state) => {
      if (state.status !== 'selecting_start') return

      const country = state.countries.find((c) => c.id === countryId)
      if (country) {
        country.infected = 1
        state.status = 'playing'
        state.gameSpeed = 1

        const message = `Outbreak initiated in ${country.name}. Target confirmed.`
        const event: WorldEvent = {
          id: `event-${Date.now()}`,
          timestamp: 0,
          type: 'milestone',
          message,
          severity: 'warning',
          countryId: country.id,
        }
        state.events.unshift(event)
      }
    })
  },
})
