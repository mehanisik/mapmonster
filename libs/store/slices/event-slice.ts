import type { GameSliceCreator, WorldEvent } from '../store-types'

export const createEventSlice: GameSliceCreator<
  import('../store-types').EventSlice
> = (set) => ({
  events: [],

  addEvent: (type, message, countryId, severity = 'info') => {
    set((state) => {
      const event: WorldEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: state.tickCount,
        type,
        message,
        severity,
        countryId,
      }
      state.events.unshift(event)
      if (state.events.length > 50) {
        state.events = state.events.slice(0, 50)
      }
    })
  },
})
