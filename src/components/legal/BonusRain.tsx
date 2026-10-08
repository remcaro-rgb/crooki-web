"use client";

import { useState, useSyncExternalStore } from "react";

// Subtle "rain" of Club Crooki Bonus coins over the club terms page.
// Drops only render on the client, so server and client HTML match.
// About 1 in 3 drops falls tilted ~20° to either side. Hidden when the
// visitor prefers reduced motion. Keyframes live in globals.css.

type Drop = {
  left: number; // vw
  size: number; // px
  duration: number; // s
  delay: number; // s (negative = already mid-fall on load)
  opacity: number;
  tilt: number; // deg
  sway: number; // s
};

const DROP_COUNT = 14;

function makeDrops(): Drop[] {
  return Array.from({ length: DROP_COUNT }, () => {
    const duration = 10 + Math.random() * 8;
    const tilted = Math.random() < 0.35;
    return {
      left: Math.random() * 96,
      size: 26 + Math.random() * 26,
      duration,
      delay: -Math.random() * duration,
      opacity: 0.18 + Math.random() * 0.22,
      tilt: tilted ? (Math.random() < 0.5 ? -20 : 20) : 0,
      sway: 3 + Math.random() * 3,
    };
  });
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function BonusRain() {
  // false on the server and during hydration, so random drops never cause a
  // hydration mismatch; true on the client unless reduced motion is on.
  const enabled = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const [drops] = useState(makeDrops);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {drops.map((d, i) => (
        <div
          key={i}
          className="bonus-drop absolute top-0"
          style={{
            left: `${d.left}vw`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        >
          <div className="bonus-sway" style={{ animationDuration: `${d.sway}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative sprite */}
            <img
              src="/bonus-rewards.webp"
              alt=""
              width={d.size}
              height={d.size}
              style={{ opacity: d.opacity, transform: `rotate(${d.tilt}deg)` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
