"use client";

import { ZapIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";

export default function PerformanceMonitor() {
  const [fps, setFps] = React.useState(0);
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());

  React.useEffect(() => {
    let animationId: number;

    const update = () => {
      frameCount.current++;
      const now = performance.now();

      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-black/5 bg-white/60 backdrop-blur-3xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/5">
      <div className="relative">
        <HugeiconsIcon
          icon={ZapIcon}
          size={12}
          className={fps < 30 ? "text-red-500" : "text-green-500"}
        />
        <div
          className={`absolute inset-0 blur-md ${fps < 30 ? "bg-red-500" : "bg-green-500"} opacity-50`}
        />
      </div>
      <span className="text-zinc-400">VIBE_CHECK</span>
      <span
        className={`font-mono ${fps < 30 ? "text-red-600" : "text-green-600"}`}
      >
        {fps} VIBES
      </span>
    </div>
  );
}
