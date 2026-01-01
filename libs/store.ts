import { configureStore } from '@reduxjs/toolkit'
import { countriesApi } from './data/countries-api'
import eventsReducer from './features/events/events-slice'
import gameReducer from './features/game/game-slice'

export const store = configureStore({
  reducer: {
    [countriesApi.reducerPath]: countriesApi.reducer,
    game: gameReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(countriesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
