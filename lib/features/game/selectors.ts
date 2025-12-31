/**
 * Game Selectors - Memoized selectors for derived game state
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Country } from "../../types/game";

// Base selectors
export const selectGameState = (state: RootState) => state.game;
export const selectCountries = (state: RootState) => state.game.countries;
export const selectRoutes = (state: RootState) => state.game.routes;
export const selectTraits = (state: RootState) => state.game.traits;
export const selectStats = (state: RootState) => state.game.stats;
export const selectCure = (state: RootState) => state.game.cure;
export const selectEvents = (state: RootState) => state.game.events;
export const selectDnaPoints = (state: RootState) => state.game.dnaPoints;
export const selectDnaAnomalies = (state: RootState) => state.game.dnaAnomalies;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectDifficulty = (state: RootState) => state.game.difficulty;
export const selectSelectedCountryId = (state: RootState) =>
  state.game.selectedCountryId;

// Derived selectors

/**
 * Get total infected globally
 */
export const selectTotalInfected = createSelector(
  [selectCountries],
  (countries) => countries.reduce((sum, c) => sum + c.infected, 0),
);

/**
 * Get total dead globally
 */
export const selectTotalDead = createSelector([selectCountries], (countries) =>
  countries.reduce((sum, c) => sum + c.dead, 0),
);

/**
 * Get total healthy globally
 */
export const selectTotalHealthy = createSelector(
  [selectCountries],
  (countries) =>
    countries.reduce((sum, c) => sum + (c.population - c.infected - c.dead), 0),
);

/**
 * Get world population
 */
export const selectWorldPopulation = createSelector(
  [selectCountries],
  (countries) => countries.reduce((sum, c) => sum + c.population, 0),
);

/**
 * Get global infection percentage
 */
export const selectInfectionPercentage = createSelector(
  [selectTotalInfected, selectWorldPopulation],
  (infected, population) => (infected / population) * 100,
);

/**
 * Get number of infected countries
 */
export const selectInfectedCountryCount = createSelector(
  [selectCountries],
  (countries) => countries.filter((c) => c.infected > 0).length,
);

/**
 * Get number of fully infected countries
 */
export const selectFullyInfectedCountryCount = createSelector(
  [selectCountries],
  (countries) =>
    countries.filter((c) => c.infected >= c.population * 0.95).length,
);

/**
 * Get countries sorted by infection rate
 */
export const selectCountriesByInfection = createSelector(
  [selectCountries],
  (countries) =>
    [...countries].sort(
      (a, b) => b.infected / b.population - a.infected / a.population,
    ),
);

/**
 * Get selected country details
 */
export const selectSelectedCountry = createSelector(
  [selectCountries, selectSelectedCountryId],
  (countries, selectedId): Country | null =>
    selectedId ? countries.find((c) => c.id === selectedId) || null : null,
);

/**
 * Get infected countries
 */
export const selectInfectedCountries = createSelector(
  [selectCountries],
  (countries) => countries.filter((c) => c.infected > 0),
);

/**
 * Get uninfected countries
 */
export const selectUninfectedCountries = createSelector(
  [selectCountries],
  (countries) => countries.filter((c) => c.infected === 0),
);

/**
 * Get countries with closed borders
 */
export const selectClosedBorderCountries = createSelector(
  [selectCountries],
  (countries) =>
    countries.filter(
      (c) => !c.bordersOpen || !c.airportsOpen || !c.seaportsOpen,
    ),
);

/**
 * Get recent events (last 10)
 */
export const selectRecentEvents = createSelector([selectEvents], (events) =>
  events.slice(0, 10),
);

/**
 * Get owned trait IDs
 */
export const selectOwnedTraitIds = createSelector([selectTraits], (traits) => {
  const owned: string[] = [];

  // Symptoms
  for (const [id, value] of Object.entries(traits.symptoms)) {
    if (value) owned.push(id);
  }

  // Transmissions
  for (const [key, level] of Object.entries(traits.transmissions)) {
    for (let i = 1; i <= level; i++) {
      owned.push(`${key}_${i}`);
    }
  }

  // Abilities
  for (const [key, level] of Object.entries(traits.abilities)) {
    for (let i = 1; i <= level; i++) {
      owned.push(`${key}_${i}`);
    }
  }

  return owned;
});

/**
 * Check if game is in progress
 */
export const selectIsPlaying = createSelector(
  [selectGameStatus],
  (status) => status === "playing",
);

/**
 * Check if game is over
 */
export const selectIsGameOver = createSelector(
  [selectGameStatus],
  (status) => status === "won" || status === "lost",
);

/**
 * Get game summary stats
 */
export const selectGameSummary = createSelector(
  [
    selectTotalInfected,
    selectTotalDead,
    selectWorldPopulation,
    selectInfectedCountryCount,
    selectCure,
    selectDnaPoints,
    selectStats,
  ],
  (infected, dead, population, countryCount, cure, dna, stats) => ({
    infected,
    dead,
    healthy: population - infected - dead,
    population,
    infectedCountries: countryCount,
    cureProgress: cure.progress,
    isDetected: cure.isDetected,
    dnaPoints: dna,
    infectivity: stats.infectivity,
    severity: stats.severity,
    lethality: stats.lethality,
  }),
);
