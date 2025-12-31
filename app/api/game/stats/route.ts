import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { totalInfected, worldPopulation, cureProgress } = body;

  const infectionRate = totalInfected / worldPopulation;

  let advisory = "Global status: Stable. Minor technical glitches reported.";
  if (infectionRate > 0.01)
    advisory = "Emerging threat: Chaos vectors spreading through major hubs.";
  if (infectionRate > 0.1)
    advisory =
      "Global Emergency: Essential services disrupted by sentient glitches.";
  if (infectionRate > 0.5)
    advisory = "Collapse imminent: The digital world is resetting.";

  if (cureProgress > 50)
    advisory += " Humanity making progress with the 'Stability Patch'.";

  return Response.json({
    advisory,
    timestamp: Date.now(),
  });
}
