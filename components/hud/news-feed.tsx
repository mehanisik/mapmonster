'use client'

import { Card } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { selectRecentEvents } from '~/libs/features/game/selectors'
import { useAppSelector } from '~/libs/hooks'
import type { WorldEvent } from '~/libs/types/game'

function getEventIcon(type: WorldEvent['type']): string {
  switch (type) {
    case 'infection':
      return '🦠'
    case 'death':
      return '💀'
    case 'cure':
      return '💉'
    case 'response':
      return '🚨'
    case 'mutation':
      return '🧬'
    case 'milestone':
      return '🎯'
    default:
      return '📰'
  }
}

function getEventColor(severity: WorldEvent['severity']): string {
  switch (severity) {
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/20'
    case 'warning':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    default:
      return 'text-zinc-400 bg-zinc-800/50 border-zinc-700/30'
  }
}

export default function NewsFeed() {
  const events = useAppSelector(selectRecentEvents)

  if (events.length === 0) {
    return (
      <Card className="p-4 bg-zinc-950/60 backdrop-blur-xl border-white/5 rounded-2xl">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <span>📰</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Awaiting events...
          </span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-950/60 backdrop-blur-xl border-white/5 rounded-2xl overflow-hidden">
      <div className="p-3 border-b border-white/5 flex items-center gap-2">
        <span className="text-lg">📰</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Global News Feed
        </span>
        <span className="ml-auto text-[9px] font-mono text-zinc-600">
          {events.length} events
        </span>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="p-2 space-y-1.5">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-2.5 rounded-xl border transition-all ${getEventColor(event.severity)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">
                  {getEventIcon(event.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-relaxed">
                    {event.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-600">
                      T+{event.timestamp}
                    </span>
                    {event.countryId && (
                      <span className="text-[9px] font-bold uppercase text-zinc-500">
                        {event.countryId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
