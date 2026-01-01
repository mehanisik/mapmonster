import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createDiseaseSlice } from './slices/disease-slice'
import { createEventSlice } from './slices/event-slice'
import { createGameSlice } from './slices/game-slice'
import { createSimulationSlice } from './slices/simulation-slice'
import { createWorldSlice } from './slices/world-slice'
import type { GameStore } from './store-types'

export const useGameStore = create<GameStore>()(
  immer((...a) => ({
    ...createGameSlice(...a),
    ...createWorldSlice(...a),
    ...createDiseaseSlice(...a),
    ...createSimulationSlice(...a),
    ...createEventSlice(...a),
  }))
)
