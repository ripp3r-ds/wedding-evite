"use client";

import { useMemo, useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type ArtefactKind = "marigold" | "thalambralu" | "diya";

type Artefact = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  spin: number;
  sway: number;
  opacity: number;
  tone: number;
};

/** Deterministic PRNG so server and client render identical artefact layouts. */
function mulberry32(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const presets: Record<
  ArtefactKind,
  { count: number; size: [number, number]; duration: [number, number]; rises: boolean }
> = {
  marigold: { count: 20, size: [13, 30], duration: [7.5, 14], rises: false },
  // A proper showering handful. The grains are slender, so they carry far less
  // visual weight each than a marigold head and need the numbers.
  thalambralu: { count: 44, size: [7, 15], duration: [5, 9.5], rises: false },
  // Still the slowest and largest of the three, so the reception reads
  // contemporary rather than like a second wedding.
  diya: { count: 16, size: [18, 32], duration: [13, 21], rises: true }
};

function MarigoldSprite({ tone }: { tone: number }) {
  const outer = tone > 0.62 ? "#f7a823" : tone > 0.3 ? "#ef8a1b" : "#f6c23a";
  const inner = tone > 0.62 ? "#e1700f" : tone > 0.3 ? "#d75d12" : "#e89a18";

  return (
    <svg viewBox="0 0 40 40" fill="none">
      {Array.from({ length: 12 }, (_, index) => (
        <ellipse
          key={`o-${index}`}
          cx="20"
          cy="8.5"
          rx="4.6"
          ry="7.2"
          fill={outer}
          transform={`rotate(${index * 30} 20 20)`}
        />
      ))}
      {Array.from({ length: 9 }, (_, index) => (
        <ellipse
          key={`i-${index}`}
          cx="20"
          cy="13"
          rx="3.6"
          ry="5.2"
          fill={inner}
          transform={`rotate(${index * 40 + 18} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.2" fill={inner} />
      <circle cx="20" cy="20" r="2" fill="#b8490b" opacity=".75" />
    </svg>
  );
}

/* Turmeric-stained rice. Every variant is a long basmati grain: the rounder
   pearl that used to stand in for the pale grains read as confetti at the size
   these fall. Drawn as a tapered capsule, roughly 1 : 3.4, with the tilt
   varying by tone so a handful never looks combed. */
function ThalambraluSprite({ tone }: { tone: number }) {
  const pale = tone > 0.72;
  const grain = pale ? "#fdf0cf" : tone > 0.4 ? "#f6dd9c" : "#f2c15f";
  const tip = pale ? "#e6cc96" : tone > 0.4 ? "#d9b566" : "#d79a34";
  const tilt = 8 + tone * 26;

  return (
    <svg viewBox="0 0 20 20" fill="none">
      <g transform={`rotate(${tilt} 10 10)`}>
        <path
          d="M10 2.2c1.9 1.6 2.8 4.2 2.8 7.8s-.9 6.2-2.8 7.8c-1.9-1.6-2.8-4.2-2.8-7.8S8.1 3.8 10 2.2Z"
          fill={grain}
        />
        {/* Darker husk end, so the grain has a direction. */}
        <path
          d="M10 2.2c1.4 1.2 2.2 2.9 2.6 5-1.5.8-3.7.8-5.2 0 .4-2.1 1.2-3.8 2.6-5Z"
          fill={tip}
          opacity=".7"
        />
        {/* Highlight down one flank. */}
        <path
          d="M8.6 5.2c-.7 1.4-1 3-1 4.8s.3 3.4 1 4.8c-.9-1.2-1.4-2.9-1.4-4.8s.5-3.6 1.4-4.8Z"
          fill="#fffbe9"
          opacity=".75"
        />
      </g>
    </svg>
  );
}

export function DiyaSprite() {
  return (
    <svg viewBox="0 0 44 48" fill="none">
      <ellipse cx="22" cy="44" rx="15" ry="3.4" fill="#f6b64a" opacity=".22" />
      <path
        d="M6 30c0 7 7 12 16 12s16-5 16-12c0-2-1-3-3-3H9c-2 0-3 1-3 3Z"
        fill="#a4562a"
      />
      <path d="M8 27h28c1.6 0 2.6 1 2.6 2H5.4c0-1 1-2 2.6-2Z" fill="#c8793c" />
      <path d="M12 27c3-2 7-3 10-3s7 1 10 3H12Z" fill="#e0a257" opacity=".8" />
      <path
        className="diya-flame"
        d="M22 4c4 5.6 7 9.4 7 14 0 4.4-3.1 7.6-7 7.6s-7-3.2-7-7.6c0-4.6 3-8.4 7-14Z"
        fill="#ffcf5e"
      />
      <path
        d="M22 11c2.2 3.4 3.6 5.6 3.6 8.2 0 2.5-1.6 4.2-3.6 4.2s-3.6-1.7-3.6-4.2c0-2.6 1.4-4.8 3.6-8.2Z"
        fill="#fff3c4"
      />
    </svg>
  );
}

function renderSprite(kind: ArtefactKind, tone: number) {
  if (kind === "marigold") return <MarigoldSprite tone={tone} />;
  if (kind === "thalambralu") return <ThalambraluSprite tone={tone} />;
  return <DiyaSprite />;
}

export function CelebrationArtefacts({
  kind,
  seed = 7
}: {
  kind: ArtefactKind;
  seed?: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(layerRef, { amount: 0.05, margin: "10% 0px" });
  const reducedMotion = useReducedMotion();
  const preset = presets[kind];

  const artefacts = useMemo<Artefact[]>(() => {
    const random = mulberry32(seed * 1013 + kind.length * 97);

    return Array.from({ length: preset.count }, (_, id) => {
      const [minSize, maxSize] = preset.size;
      const [minDuration, maxDuration] = preset.duration;

      return {
        id,
        left: random() * 100,
        delay: -random() * maxDuration,
        duration: minDuration + random() * (maxDuration - minDuration),
        size: minSize + random() * (maxSize - minSize),
        drift: (random() - 0.5) * (preset.rises ? 44 : 120),
        spin: preset.rises ? (random() - 0.5) * 40 : (random() - 0.5) * 900,
        sway: 8 + random() * 26,
        opacity: 0.55 + random() * 0.45,
        tone: random()
      };
    });
  }, [kind, preset, seed]);

  const active = inView && !reducedMotion;

  return (
    <div
      aria-hidden="true"
      className={`artefact-layer artefact-layer-${kind}`}
      data-active={active ? "true" : "false"}
      ref={layerRef}
    >
      {artefacts.map((artefact) => (
        <span
          className="artefact"
          key={artefact.id}
          style={
            {
              left: `${artefact.left}%`,
              width: `${artefact.size}px`,
              height: `${artefact.size}px`,
              animationDelay: `${artefact.delay}s`,
              animationDuration: `${artefact.duration}s`,
              "--artefact-drift": `${artefact.drift}px`,
              "--artefact-spin": `${artefact.spin}deg`,
              "--artefact-sway": `${artefact.sway}px`,
              "--artefact-opacity": artefact.opacity
            } as CSSProperties
          }
        >
          {renderSprite(kind, artefact.tone)}
        </span>
      ))}
    </div>
  );
}
