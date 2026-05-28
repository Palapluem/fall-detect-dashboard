"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type FootstepSide = "left" | "right";

export interface MovementPathPoint {
  x: number;
  y: number;
}

export interface FootstepPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  side: FootstepSide;
  timestamp: number;
}

interface WalkingTrailOptions {
  stepIntervalMs?: number;
  maxVisibleSteps?: number;
  strideLength?: number;
  stepOffset?: number;
  footprintLifetimeMs?: number;
}

const DEFAULT_OPTIONS: Required<WalkingTrailOptions> = {
  stepIntervalMs: 560,
  maxVisibleSteps: 6,
  strideLength: 24,
  stepOffset: 5.5,
  footprintLifetimeMs: 3400,
};

export function useWalkingTrailAnimation(
  path: MovementPathPoint[],
  options: WalkingTrailOptions = {},
) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const frames = useMemo(
    () => buildFootstepFrames(path, settings.strideLength, settings.stepOffset),
    [path, settings.strideLength, settings.stepOffset],
  );
  const cursorRef = useRef(0);
  const stepIdRef = useRef(0);
  const [steps, setSteps] = useState<FootstepPoint[]>([]);

  useEffect(() => {
    cursorRef.current = 0;
    setSteps([]);
  }, [frames]);

  useEffect(() => {
    if (!frames.length) return;

    const addStep = () => {
      const frame = frames[cursorRef.current % frames.length];
      const now = Date.now();
      stepIdRef.current += 1;
      const nextStep: FootstepPoint = {
        ...frame,
        id: stepIdRef.current,
        timestamp: now,
      };

      setSteps((existing) =>
        [
          ...existing.filter((step) => now - step.timestamp < settings.footprintLifetimeMs),
          nextStep,
        ].slice(-settings.maxVisibleSteps),
      );
      cursorRef.current = (cursorRef.current + 1) % frames.length;
    };

    addStep();
    const stepInterval = window.setInterval(addStep, settings.stepIntervalMs);
    const cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      setSteps((existing) =>
        existing.filter((step) => now - step.timestamp < settings.footprintLifetimeMs),
      );
    }, 420);

    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(cleanupInterval);
    };
  }, [frames, settings.footprintLifetimeMs, settings.maxVisibleSteps, settings.stepIntervalMs]);

  return steps;
}

function buildFootstepFrames(
  path: MovementPathPoint[],
  strideLength: number,
  stepOffset: number,
): Array<Omit<FootstepPoint, "id" | "timestamp">> {
  if (path.length < 2) return [];

  const frames: Array<Omit<FootstepPoint, "id" | "timestamp">> = [];
  let side: FootstepSide = "left";

  for (let segmentIndex = 0; segmentIndex < path.length - 1; segmentIndex += 1) {
    const start = path[segmentIndex];
    const end = path[segmentIndex + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) continue;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const segmentSteps = Math.max(1, Math.floor(distance / strideLength));

    for (let step = 1; step <= segmentSteps; step += 1) {
      const progress = step / (segmentSteps + 1);
      const sideMultiplier = side === "left" ? -1 : 1;
      const naturalDrift = Math.sin((frames.length + 1) * 0.72) * 1.4;
      const lateralOffset = sideMultiplier * stepOffset + naturalDrift;

      frames.push({
        x: start.x + dx * progress + normalX * lateralOffset,
        y: start.y + dy * progress + normalY * lateralOffset,
        angle,
        side,
      });

      side = side === "left" ? "right" : "left";
    }
  }

  return frames;
}
