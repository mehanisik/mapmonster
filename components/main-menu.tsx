'use client'

import {
  DnaIcon,
  GlobalIcon,
  PlayIcon,
  SecurityIcon,
  SkullIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import {
  resetGame,
  setDifficulty,
  startGame,
} from '~/libs/features/game/game-slice'
import {
  selectDifficulty,
  selectGameStatus,
} from '~/libs/features/game/selectors'
import { useAppDispatch, useAppSelector } from '~/libs/hooks'
import type { Difficulty } from '~/libs/types/game'

const DIFFICULTY_OPTIONS: Array<{
  id: Difficulty
  name: string
  description: string
  icon: typeof GlobalIcon
  color: string
}> = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'Slower cure, faster spread. Learn the basics.',
    icon: GlobalIcon,
    color: 'text-emerald-500',
  },
  {
    id: 'normal',
    name: 'Normal',
    description: 'Balanced gameplay. Standard challenge.',
    icon: ZapIcon,
    color: 'text-purple-500',
  },
  {
    id: 'brutal',
    name: 'Brutal',
    description: 'Faster cure research. World fights back hard.',
    icon: SecurityIcon,
    color: 'text-orange-500',
  },
  {
    id: 'mega_brutal',
    name: 'Mega Brutal',
    description: 'Extreme difficulty. The world is prepared.',
    icon: SkullIcon,
    color: 'text-red-500',
  },
]

export default function MainMenu() {
  const dispatch = useAppDispatch()
  const gameStatus = useAppSelector(selectGameStatus)
  const currentDifficulty = useAppSelector(selectDifficulty)
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>(currentDifficulty)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleStart = () => {
    dispatch(resetGame())
    dispatch(setDifficulty(selectedDifficulty))
    dispatch(startGame())
  }

  if (gameStatus !== 'menu') {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl transition-all duration-700">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      <Card className="w-[520px] p-8 relative overflow-hidden border-white/5 bg-zinc-900/60 backdrop-blur-2xl shadow-2xl shadow-black rounded-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-600 rounded-xl">
              <HugeiconsIcon icon={DnaIcon} size={20} className="text-white" />
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-black uppercase tracking-widest text-[9px]">
              Plague Simulator
            </Badge>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            CHAOS <span className="text-purple-500">INC.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Global Pathogen Evolution Simulator
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-4 mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">
            Select Difficulty
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 text-left ${
                  selectedDifficulty === d.id
                    ? 'bg-zinc-800 border-white/20 shadow-xl scale-[1.02]'
                    : 'bg-zinc-900/50 border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HugeiconsIcon
                    icon={d.icon}
                    size={16}
                    className={
                      selectedDifficulty === d.id ? d.color : 'text-zinc-500'
                    }
                  />
                  <span
                    className={`text-sm font-bold ${
                      selectedDifficulty === d.id
                        ? 'text-white'
                        : 'text-zinc-400'
                    }`}
                  >
                    {d.name}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 leading-relaxed">
                  {d.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              icon={soundEnabled ? VolumeHighIcon : VolumeMuteIcon}
              size={18}
              className="text-zinc-400"
            />
            <span className="text-xs font-bold text-zinc-300">
              Audio System
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
              soundEnabled ? 'bg-purple-600' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                soundEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-lg font-black tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-900/50 group"
        >
          <HugeiconsIcon
            icon={PlayIcon}
            size={24}
            className="mr-3 group-hover:animate-pulse"
          />
          INITIATE OUTBREAK
        </Button>

        {/* Footer tip */}
        <p className="text-center text-[10px] text-zinc-600 mt-4">
          Click a country on the map to start the infection
        </p>
      </Card>
    </div>
  )
}
