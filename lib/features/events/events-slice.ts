import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MapEvent {
  id: string;
  type: "earthquake" | "monster";
  lat: number;
  lng: number;
  magnitude?: number;
  title: string;
  timestamp: number;
  velocity?: { x: number; y: number };
  mood?: string;
  personality?: string;
  color?: string;
}

export interface EventsState {
  monsters: MapEvent[];
  performanceMode: boolean;
  maxMonsters: number;
  selectedAnomalyId: string | null;
  // Game Stats
  dnaPoints: number;
  cureProgress: number; // 0 to 100
  totalInfected: number;
  worldPopulation: number;
  gameStarted: boolean;
  upgrades: string[];
  difficulty: "casual" | "normal" | "biohazard";
  dnaAnomalies: { id: string; lat: number; lng: number; points: number }[];
  outbreaks: { id: string; lat: number; lng: number; intensity: number }[];
}

const initialState: EventsState = {
  monsters: [],
  performanceMode: false,
  maxMonsters: 100,
  selectedAnomalyId: null,
  dnaPoints: 0,
  cureProgress: 0,
  totalInfected: 1, // Start with 1 patient zero
  worldPopulation: 8000000000,
  gameStarted: false,
  upgrades: [],
  difficulty: "normal",
  dnaAnomalies: [],
  outbreaks: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setMonsters: (state, action: PayloadAction<MapEvent[]>) => {
      state.monsters = action.payload;
    },
    updateMonsterPositions: (state) => {
      state.monsters.forEach((monster) => {
        if (!monster.velocity) return;

        if (state.performanceMode) {
          const neighbors = state.monsters
            .filter(
              (m) =>
                m.id !== monster.id &&
                Math.abs(m.lat - monster.lat) < 5 &&
                Math.abs(m.lng - monster.lng) < 5,
            )
            .slice(0, 5);

          if (neighbors.length > 0) {
            let avgVelX = 0;
            let avgVelY = 0;
            neighbors.forEach((n) => {
              avgVelX += n.velocity?.x || 0;
              avgVelY += n.velocity?.y || 0;
            });
            monster.velocity.x +=
              (avgVelX / neighbors.length - monster.velocity.x) * 0.05;
            monster.velocity.y +=
              (avgVelY / neighbors.length - monster.velocity.y) * 0.05;
          }
        }

        monster.lat += monster.velocity.y;
        monster.lng += monster.velocity.x;

        if (monster.lat > 85 || monster.lat < -85) monster.velocity.y *= -1;
        if (monster.lng > 180 || monster.lng < -180) monster.velocity.x *= -1;
      });
    },
    setMaxMonsters: (state, action: PayloadAction<number>) => {
      state.maxMonsters = action.payload;
    },
    setPerformanceMode: (state, action: PayloadAction<boolean>) => {
      state.performanceMode = action.payload;
    },
    neutralizeMonster: (state, action: PayloadAction<string>) => {
      const monster = state.monsters.find((m) => m.id === action.payload);
      if (monster) {
        state.dnaPoints += 5; // Reward for manual action
      }
      state.monsters = state.monsters.filter((m) => m.id !== action.payload);
      if (state.selectedAnomalyId === action.payload) {
        state.selectedAnomalyId = null;
      }
    },
    selectAnomaly: (state, action: PayloadAction<string | null>) => {
      state.selectedAnomalyId = action.payload;
    },
    addDna: (state, action: PayloadAction<number>) => {
      state.dnaPoints += action.payload;
    },
    buyUpgrade: (
      state,
      action: PayloadAction<{ id: string; cost: number }>,
    ) => {
      if (state.dnaPoints >= action.payload.cost) {
        state.dnaPoints -= action.payload.cost;
        state.upgrades.push(action.payload.id);
      }
    },
    gameTick: (state) => {
      if (!state.gameStarted && state.totalInfected > 1) {
        state.gameStarted = true;
      }

      if (state.gameStarted) {
        const difficultyMultipliers = {
          casual: { infection: 1.2, cure: 0.3 },
          normal: { infection: 1.0, cure: 1.0 },
          biohazard: { infection: 0.8, cure: 2.0 },
        };

        const mult = difficultyMultipliers[state.difficulty];
        const infectionRate = state.totalInfected / state.worldPopulation;

        // Upgrade multipliers
        let upgradeInfectionMult = 1.0;
        let upgradeCureMult = 1.0;

        if (state.upgrades.includes("memes")) upgradeInfectionMult *= 1.25;
        if (state.upgrades.includes("public_transport"))
          upgradeInfectionMult *= 1.4;
        if (state.upgrades.includes("system_glitch"))
          upgradeInfectionMult *= 1.15;
        if (state.upgrades.includes("ai_hijack")) upgradeInfectionMult *= 1.8;
        if (state.upgrades.includes("encryption_mask")) upgradeCureMult *= 0.6;

        // LOGISTIC GROWTH: dN/dt = rN(1 - N/K)
        // r = baseRate * transmissionBoost * mult.infection
        const baseRate = 0.005;
        const transmissionBoost = 1 + state.upgrades.length * 0.1;
        const r =
          baseRate * transmissionBoost * mult.infection * upgradeInfectionMult;

        const growth = state.totalInfected * r * (1 - infectionRate);
        const prevInfected = state.totalInfected;
        state.totalInfected = Math.min(
          state.worldPopulation,
          state.totalInfected + Math.max(1, Math.ceil(growth)),
        );

        // Milestone DNA Rewards: Reward when moving to next power of 10
        const oldLog = Math.floor(Math.log10(prevInfected || 1));
        const newLog = Math.floor(Math.log10(state.totalInfected));
        if (newLog > oldLog && newLog >= 2) {
          state.dnaPoints += newLog * 10; // e.g. 1000 infected (3) gives 30 DNA
        }

        // CURE PROGRESS: Based on Awareness (Infection Rate)
        if (infectionRate > 0.001) {
          // 0.1% infected
          const awareness = (infectionRate * 10) ** 1.5;
          const cureBase = 0.002;
          state.cureProgress = Math.min(
            100,
            state.cureProgress +
              cureBase * awareness * mult.cure * upgradeCureMult,
          );
        }
      }
    },
    setDifficulty: (
      state,
      action: PayloadAction<"casual" | "normal" | "biohazard">,
    ) => {
      state.difficulty = action.payload;
    },
    startGame: (state) => {
      state.gameStarted = true;
    },
    spawnDnaAnomaly: (state) => {
      const id = `dna-${Date.now()}`;
      state.dnaAnomalies.push({
        id,
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 350,
        points: Math.floor(Math.random() * 5) + 5,
      });
      // Limit to 10 active anomalies
      if (state.dnaAnomalies.length > 10) state.dnaAnomalies.shift();
    },
    collectDnaAnomaly: (state, action: PayloadAction<string>) => {
      const anomaly = state.dnaAnomalies.find((a) => a.id === action.payload);
      if (anomaly) {
        state.dnaPoints += anomaly.points;
        state.dnaAnomalies = state.dnaAnomalies.filter(
          (a) => a.id !== action.payload,
        );
      }
    },
    spawnOutbreak: (state) => {
      const id = `outbreak-${Date.now()}`;
      state.outbreaks.push({
        id,
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 350,
        intensity: Math.random() * 0.5 + 0.5,
      });
      if (state.outbreaks.length > 15) state.outbreaks.shift();
    },
  },
});

export const {
  setMonsters,
  updateMonsterPositions,
  setMaxMonsters,
  setPerformanceMode,
  neutralizeMonster,
  selectAnomaly,
  addDna,
  buyUpgrade,
  gameTick,
  startGame,
  setDifficulty,
  spawnDnaAnomaly,
  collectDnaAnomaly,
  spawnOutbreak,
} = eventsSlice.actions;
export default eventsSlice.reducer;
