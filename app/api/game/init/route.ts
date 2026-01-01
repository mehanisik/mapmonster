export async function GET() {
  const worldData = {
    worldPopulation: 8000000000,
    baseInfectionRate: 0.001,
    difficultySettings: {
      casual: { cureSpeed: 0.5, infectionRate: 1.5, dnaGain: 1.5 },
      normal: { cureSpeed: 1.0, infectionRate: 1.0, dnaGain: 1.0 },
      biohazard: { cureSpeed: 2.0, infectionRate: 0.7, dnaGain: 0.5 },
    },
    narrativeEntries: [
      'Patient Zero detected in a remote digital terminal.',
      "Global awareness of the 'Chaos' phenomenon is zero.",
      'Scientists focus on minor glitches while the strain evolves.',
    ],
  }

  return Response.json(worldData)
}
