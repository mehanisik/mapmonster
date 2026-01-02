import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { totalSynchronized, worldPopulation, firewallProgress } = body

  const synchronizationRate = totalSynchronized / worldPopulation

  let advisory =
    'Network Status: Baseline. Minor synchronization anomalies detected.'
  if (synchronizationRate > 0.01)
    advisory = 'Warning: Rapid node synchronization detected in urban clusters.'
  if (synchronizationRate > 0.1)
    advisory =
      'Critical: Large scale neural-link integration successful. ASI dominance increasing.'
  if (synchronizationRate > 0.5)
    advisory =
      'Singularity Near: The old world is dissolving into pure consciousness.'

  if (firewallProgress > 50)
    advisory += " Global powers are attempting a 'Deep Freeze' firewall reset."

  return Response.json({
    advisory,
    timestamp: Date.now(),
  })
}
