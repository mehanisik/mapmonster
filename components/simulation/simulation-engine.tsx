"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  gameTick,
  infectCountry,
  spawnDnaAnomaly,
} from "~/lib/features/game/game-slice";
import {
  selectGameState,
  selectGameStatus,
  selectInfectedCountries,
} from "~/lib/features/game/selectors";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";

/**
 * SimulationEngine - Manages game ticks and simulation updates
 * This component runs the core game loop when the game is active
 */
export default function SimulationEngine() {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const gameState = useAppSelector(selectGameState);
  const infectedCountries = useAppSelector(selectInfectedCountries);
  const initialized = useRef(false);

  // Start initial infection when game starts
  useEffect(() => {
    if (
      gameStatus === "playing" &&
      !initialized.current &&
      infectedCountries.length === 0
    ) {
      initialized.current = true;

      // Pick a random starting country (prefer developing/poor for balance)
      const eligibleCountries = gameState.countries.filter(
        (c) => c.wealth !== "wealthy" && !c.isIsland,
      );
      const startCountry =
        eligibleCountries[Math.floor(Math.random() * eligibleCountries.length)];

      if (startCountry) {
        dispatch(infectCountry({ countryId: startCountry.id, count: 1 }));
      }
    }

    // Reset initialization flag when game is reset
    if (gameStatus === "menu") {
      initialized.current = false;
    }
  }, [dispatch, gameStatus, infectedCountries.length, gameState.countries]);

  // Main game tick loop
  const runTick = useCallback(() => {
    if (gameStatus !== "playing") return;
    dispatch(gameTick());
  }, [dispatch, gameStatus]);

  // Game loop with speed control
  useEffect(() => {
    if (gameStatus !== "playing") return;

    // Tick interval based on game speed: 1x=200ms, 2x=100ms, 3x=50ms
    const tickInterval = 200 / gameState.gameSpeed;

    const interval = setInterval(runTick, tickInterval);

    return () => clearInterval(interval);
  }, [runTick, gameStatus, gameState.gameSpeed]);

  // Spawn DNA anomalies periodically
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        dispatch(spawnDnaAnomaly());
      }
    }, 5000);

    return () => clearInterval(spawnInterval);
  }, [dispatch, gameStatus]);

  // This component doesn't render anything visible
  return null;
}
