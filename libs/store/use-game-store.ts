import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createEventSlice } from './slices/event-slice'
import { createGameSlice } from './slices/game-slice'
import { createSimulationSlice } from './slices/simulation-slice'
import { createSingularitySlice } from './slices/singularity-slice'
import { createWorldSlice } from './slices/world-slice'
import type { GameStore } from './store-types'

export const useGameStore = create<GameStore>()(
  immer((...a) => ({
    ...createGameSlice(...a),
    ...createWorldSlice(...a),
    ...createSingularitySlice(...a),
    ...createSimulationSlice(...a),
    ...createEventSlice(...a),
  }))
)
