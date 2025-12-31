"use client";

import { MonsterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MapMonsterLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-150 animate-pulse" />
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <HugeiconsIcon
            icon={MonsterIcon}
            size={32}
            className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-950 rounded-full border-2 border-white" />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="text-xl font-black tracking-tighter text-zinc-950">
            MAP
          </span>
          <span className="text-xs font-bold tracking-[0.2em] text-red-600 -mt-1">
            MONSTER
          </span>
        </div>
      </div>
    </div>
  );
}

export function MiniLogo() {
  return (
    <div className="relative">
      <HugeiconsIcon icon={MonsterIcon} size={20} className="text-red-500" />
      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-zinc-950 rounded-full" />
    </div>
  );
}
