'use client'

import {
  DnaIcon,
  Forward01Icon,
  Forward02Icon,
  MoreVerticalIcon,
  PlayIcon,
  RotateRight01Icon as RotateIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { resetGame, setGameSpeed } from '~/libs/features/game/game-slice'
import {
  selectDnaPoints,
  selectGameState,
  selectGameStatus,
} from '~/libs/features/game/selectors'
import { useAppDispatch, useAppSelector } from '~/libs/hooks'
import EvolutionLab from '../dashboard/evolution-lab'

export default function GameControls() {
  const dispatch = useAppDispatch()
  const dnaPoints = useAppSelector(selectDnaPoints)
  const gameState = useAppSelector(selectGameState)
  const gameStatus = useAppSelector(selectGameStatus)

  const handleSpeedChange = (speed: number) => {
    dispatch(setGameSpeed(speed))
  }

  const handleReset = () => {
    dispatch(resetGame())
  }

  if (gameStatus !== 'playing') {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 p-2 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
        {/* DNA Counter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600/20 border border-purple-500/30">
          <HugeiconsIcon icon={DnaIcon} size={18} className="text-purple-400" />
          <span className="text-xl font-black text-purple-300 font-mono">
            {dnaPoints}
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 px-2">
          <Button
            size="sm"
            variant={gameState.gameSpeed === 1 ? 'secondary' : 'ghost'}
            onClick={() => handleSpeedChange(1)}
            className="rounded-xl h-10 w-10 p-0"
          >
            <HugeiconsIcon icon={PlayIcon} size={16} />
          </Button>
          <Button
            size="sm"
            variant={gameState.gameSpeed === 2 ? 'secondary' : 'ghost'}
            onClick={() => handleSpeedChange(2)}
            className="rounded-xl h-10 w-10 p-0"
          >
            <HugeiconsIcon icon={Forward01Icon} size={16} />
          </Button>
          <Button
            size="sm"
            variant={gameState.gameSpeed === 3 ? 'secondary' : 'ghost'}
            onClick={() => handleSpeedChange(3)}
            className="rounded-xl h-10 w-10 p-0"
          >
            <HugeiconsIcon icon={Forward02Icon} size={16} />
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Evolution Lab Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-2xl px-5 h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold shadow-lg shadow-purple-900/30">
              <HugeiconsIcon icon={DnaIcon} size={18} />
              <span className="text-sm">Evolution Lab</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden bg-zinc-950/95 backdrop-blur-2xl border-white/10 rounded-3xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white">
                <div className="p-2 bg-purple-600 rounded-xl">
                  <HugeiconsIcon
                    icon={DnaIcon}
                    size={20}
                    className="text-white"
                  />
                </div>
                Evolution Lab
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 overflow-y-auto">
              <EvolutionLab />
            </div>
          </DialogContent>
        </Dialog>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl h-10 w-10 p-0"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900/95 backdrop-blur-xl border-white/10 rounded-2xl p-2 min-w-[180px]"
          >
            <DropdownMenuItem
              onClick={handleReset}
              className="rounded-xl cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
            >
              <HugeiconsIcon icon={RotateIcon} size={16} className="mr-2" />
              Reset Game
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
