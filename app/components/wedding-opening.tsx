"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Countdown } from "./countdown";
import { ScratchReveal } from "./scratch-reveal";
import { WeddingPortrait } from "./wedding-portrait";

type GateStage = "closed" | "opening" | "open";

function BananaStem({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`banana-stem banana-stem-${side}`}
      viewBox="0 0 72 420"
      fill="none"
    >
      <path
        d="M36 12c4 38 6 90 5 140-1 62-6 118-4 168 1 28 6 58 14 88"
        stroke="#3f4a1c"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M36 12c4 38 6 90 5 140-1 62-6 118-4 168"
        stroke="#7d9333"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[48, 92, 138, 186, 236, 286].map((y, index) => {
        const flip = side === "left" ? 1 : -1;
        const dir = (index % 2 === 0 ? -1 : 1) * flip;
        return (
          <path
            key={y}
            d={`M36 ${y}c${18 * dir} 8 ${34 * dir} 6 ${40 * dir} -6 ${8 * dir} -16 ${2 * dir} -32 -12 ${-28}`}
            fill={index % 2 ? "#6f872c" : "#8aa63a"}
            stroke="#3f4a1c"
            strokeWidth="1.2"
          />
        );
      })}
    </svg>
  );
}

function HangingLamp({ delay }: { delay: string }) {
  return (
    <span className="vilakku" style={{ animationDelay: delay }}>
      <span className="vilakku-chain" />
      <span className="vilakku-bowl" />
      <span className="vilakku-flame" />
    </span>
  );
}

function Toran() {
  return (
    <div className="toran" aria-hidden="true">
      {Array.from({ length: 13 }, (_, index) => (
        <span
          className={`toran-leaf${index % 2 ? " toran-leaf-alt" : ""}`}
          key={index}
        />
      ))}
    </div>
  );
}

function Gopuram() {
  return (
    <svg aria-hidden="true" className="gopuram" viewBox="0 0 360 118" fill="none">
      <path d="M28 114h304" stroke="#e8c36a" strokeWidth="3" />
      <path d="M48 114 80 78h200l32 36" fill="#7a2b32" stroke="#e8c36a" strokeWidth="2" />
      <path d="M92 78 118 48h124l26 30" fill="#8e353c" stroke="#f0d48d" strokeWidth="2" />
      <path d="M130 48 154 24h52l24 24" fill="#a2434a" stroke="#f0d48d" strokeWidth="2" />
      <path d="M168 24 180 8h0l12 16" fill="#c9a24a" stroke="#fff1c2" strokeWidth="1.6" />
      <circle cx="180" cy="7" r="5" fill="#f3d98a" />
      <path d="M70 96h220M108 66h144M142 38h76" stroke="#f0d48d" strokeWidth="1" opacity=".7" />
      {[90, 130, 170, 210, 250].map((x) => (
        <rect key={x} x={x} y="84" width="10" height="16" rx="1" fill="#f3d48a" opacity=".85" />
      ))}
    </svg>
  );
}

function Kolam() {
  return (
    <svg aria-hidden="true" className="kolam" viewBox="0 0 160 46" fill="none">
      <ellipse cx="80" cy="23" rx="70" ry="12" stroke="#e8c36a" strokeWidth="1.2" />
      <ellipse cx="80" cy="23" rx="44" ry="7" stroke="#f3d98a" strokeWidth="1" />
      {[20, 40, 60, 80, 100, 120, 140].map((x) => (
        <circle key={x} cx={x} cy="23" r="2.1" fill="#f6e2a6" />
      ))}
    </svg>
  );
}

function DoorCarving() {
  return (
    <svg aria-hidden="true" className="door-carving" viewBox="0 0 120 240" fill="none">
      <rect x="10" y="10" width="100" height="220" rx="4" stroke="#e8c36a" strokeWidth="2" />
      <rect x="22" y="22" width="76" height="196" rx="3" stroke="#f0d48d" strokeWidth="1" />
      <circle cx="60" cy="88" r="22" stroke="#f3d98a" strokeWidth="1.4" />
      <path
        d="M60 70c6 8 12 12 18 14-6 4-12 10-18 18-6-8-12-14-18-18 6-2 12-6 18-14Z"
        fill="#c9a24a"
        opacity=".9"
      />
      <path d="M38 150h44M38 168h44M38 186h44" stroke="#e8c36a" strokeWidth="1.2" />
      <circle cx="98" cy="128" r="5" fill="#f0d48d" />
    </svg>
  );
}

export function WeddingOpening({
  onAnnouncement
}: {
  onAnnouncement: () => void;
}) {
  const [gate, setGate] = useState<GateStage>("closed");
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  const opened = gate !== "closed";

  useEffect(() => {
    if (gate !== "opening") return;
    const timeout = window.setTimeout(
      () => setGate("open"),
      reducedMotion ? 180 : 1_150
    );
    return () => window.clearTimeout(timeout);
  }, [gate, reducedMotion]);

  function handleReveal() {
    if (revealed) return;
    setRevealed(true);
    onAnnouncement();
  }

  return (
    <section
      aria-label="Wedding invitation mandapam"
      className={`journey-screen mandapam-screen${opened ? " is-open" : ""}${revealed ? " is-revealed" : ""}`}
      id="opening"
    >
      <div className="mandapam-courtyard" aria-hidden="true" />
      <BananaStem side="left" />
      <BananaStem side="right" />

      <div className="mandapam-stage">
        <Gopuram />
        <Toran />
        <div className="vilakku-row" aria-hidden="true">
          <HangingLamp delay="0s" />
          <HangingLamp delay=".4s" />
          <HangingLamp delay=".8s" />
          <HangingLamp delay=".2s" />
        </div>

        <div className="sanctum" style={{ perspective: reducedMotion ? undefined : 1200 }}>
          <span className="sanctum-pillar sanctum-pillar-left" aria-hidden="true" />
          <span className="sanctum-pillar sanctum-pillar-right" aria-hidden="true" />

          <div className="sanctum-inner">
            <ScratchReveal
              active={gate === "open"}
              autoReveal={Boolean(reducedMotion)}
              onRevealed={handleReveal}
            >
              <WeddingPortrait
                alt="Rithwik and Kalyani"
                className="sanctum-portrait"
                objectPosition="50% 18%"
                preload
                scene="opening"
              />
            </ScratchReveal>
          </div>

          <motion.div
            aria-hidden="true"
            className="mandapam-curtain mandapam-curtain-left"
            animate={
              opened
                ? { x: reducedMotion ? "-100%" : "-108%", opacity: reducedMotion ? 0 : 1 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: reducedMotion ? 0.25 : 1.05, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="mandapam-curtain mandapam-curtain-right"
            animate={
              opened
                ? { x: reducedMotion ? "100%" : "108%", opacity: reducedMotion ? 0 : 1 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: reducedMotion ? 0.25 : 1.05, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="mandapam-door mandapam-door-left"
            animate={
              opened
                ? reducedMotion
                  ? { opacity: 0 }
                  : { rotateY: -102, opacity: 1 }
                : { rotateY: 0, opacity: 1 }
            }
            transition={{ duration: reducedMotion ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <DoorCarving />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="mandapam-door mandapam-door-right"
            animate={
              opened
                ? reducedMotion
                  ? { opacity: 0 }
                  : { rotateY: 102, opacity: 1 }
                : { rotateY: 0, opacity: 1 }
            }
            transition={{
              duration: reducedMotion ? 0.2 : 1.1,
              delay: reducedMotion ? 0 : 0.05,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <DoorCarving />
          </motion.div>
        </div>

        <Kolam />

        <motion.div
          className="mandapam-open-wrap"
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          style={{ pointerEvents: opened ? "none" : "auto" }}
        >
          <motion.button
            className="mandapam-open-button"
            type="button"
            onClick={() => setGate("opening")}
            disabled={opened}
            whileTap={reducedMotion || opened ? undefined : { scale: 0.96 }}
          >
            <span className="kolam-ring" aria-hidden="true" />
            Open the mandapam
          </motion.button>
        </motion.div>
      </div>

      {revealed && (
        <motion.div
          className="mandapam-countdown"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
        >
          <Countdown variant="journey" />
        </motion.div>
      )}
    </section>
  );
}
