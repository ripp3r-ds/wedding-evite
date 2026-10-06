"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Countdown } from "./countdown";
import { ScratchReveal } from "./scratch-reveal";
import { WeddingPortrait } from "./wedding-portrait";

type OpeningStage = "sealed" | "opening" | "scratch" | "countdown";

function OpeningOrnament() {
  return (
    <svg
      aria-hidden="true"
      className="opening-ornament"
      viewBox="0 0 280 76"
      fill="none"
    >
      <path d="M5 72C52 8 91 5 140 37c49-32 88-29 135 35" />
      <path d="M44 63c25-24 48-24 72-7m48 0c24-17 47-17 72 7" />
      <circle cx="140" cy="37" r="5" />
      <circle cx="140" cy="37" r="13" />
      <path d="m140 17 3.5 14.5L158 37l-14.5 3.5L140 55l-3.5-14.5L122 37l14.5-5.5L140 17Z" />
      {[44, 68, 92, 188, 212, 236].map((x, index) => (
        <circle key={x} cx={x} cy={index < 3 ? 52 - index * 5 : 42 + (index - 3) * 5} r="2.3" />
      ))}
    </svg>
  );
}

function InvitationCover({
  opening,
  reducedMotion,
  onOpen
}: {
  opening: boolean;
  reducedMotion: boolean | null;
  onOpen: () => void;
}) {
  return (
    <div className="opening-layout">
      <OpeningOrnament />
      <motion.div
        className="invitation-cover"
        animate={
          opening
            ? { y: -170, opacity: 0, scale: 0.96 }
            : { y: 0, opacity: 1, scale: 1 }
        }
        transition={{
          duration: reducedMotion ? 0 : opening ? 0.82 : 0.5,
          delay: opening && !reducedMotion ? 1.2 : 0,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ pointerEvents: opening ? "none" : "auto" }}
      >
        <div className="cover-paper">
          <div className="cover-floral-corner cover-floral-top" aria-hidden="true">❋</div>
          <div className="cover-floral-corner cover-floral-bottom" aria-hidden="true">❋</div>
          <span className="cover-intro">TOGETHER WITH OUR FAMILIES</span>
          <span className="cover-rule" aria-hidden="true" />
          <h1>Rithwik <i>&amp;</i> Kalyani</h1>
          <p>request the pleasure of your company</p>
          <span className="cover-date">OCTOBER 2026</span>
        </div>
        <motion.div
          className="cover-leaf cover-leaf-left"
          animate={
            opening && !reducedMotion
              ? { x: "-108%", rotateY: -28, opacity: 0 }
              : { x: 0, rotateY: 0, opacity: 1 }
          }
          transition={{ duration: reducedMotion ? 0 : 1.1, delay: opening ? 0.28 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="cover-foil-motif">✳</span>
          <span className="cover-panel-label">RITHWIK</span>
          <span className="cover-panel-subtitle">TOGETHER WITH OUR FAMILIES</span>
        </motion.div>
        <motion.div
          className="cover-leaf cover-leaf-right"
          animate={
            opening && !reducedMotion
              ? { x: "108%", rotateY: 28, opacity: 0 }
              : { x: 0, rotateY: 0, opacity: 1 }
          }
          transition={{ duration: reducedMotion ? 0 : 1.1, delay: opening ? 0.34 : 0, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <span className="cover-panel-label">KALYANI</span>
          <span className="cover-panel-flower">✿</span>
        </motion.div>
        <motion.span
          className="cover-wax-seal"
          animate={
            opening && !reducedMotion
              ? { scale: 1.28, rotate: 18, opacity: 0, filter: "drop-shadow(0 0 22px #e8c477)" }
              : { scale: 1, rotate: 0, opacity: 1, filter: "drop-shadow(0 5px 8px rgba(68,44,31,.25))" }
          }
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: opening ? 0.2 : 0 }}
          aria-hidden="true"
        >
          <span>R <i>&amp;</i> K</span>
        </motion.span>
      </motion.div>

      <motion.button
        className="tap-to-open"
        type="button"
        onClick={onOpen}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? 7 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
        disabled={opening}
      >
        <span aria-hidden="true">↓</span>
        TAP TO OPEN
      </motion.button>
    </div>
  );
}

export function WeddingOpening({ onShowDetails }: { onShowDetails: () => void }) {
  const [stage, setStage] = useState<OpeningStage>("sealed");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (stage !== "opening") return;
    const timeout = window.setTimeout(
      () => setStage("scratch"),
      reducedMotion ? 650 : 2_150
    );
    return () => window.clearTimeout(timeout);
  }, [stage, reducedMotion]);

  function showDetails() {
    onShowDetails();
    window.requestAnimationFrame(() => {
      document.getElementById("haldi")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  return (
    <div className="wedding-journey">
      <AnimatePresence mode="wait" initial={false}>
        {(stage === "sealed" || stage === "opening") && (
          <motion.section
            key="opening"
            aria-label="Wedding invitation"
            className={`journey-screen opening-screen${stage === "opening" ? " is-unsealing" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -14 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
          >
            <div className="journey-paper-grain" aria-hidden="true" />
            <InvitationCover
              opening={stage === "opening"}
              reducedMotion={reducedMotion}
              onOpen={() => setStage("opening")}
            />
            {stage === "opening" && (
              <div className="opening-petals" aria-hidden="true">
                {["✧", "·", "✦", "·", "✧", "·", "✦", "·"].map((petal, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      y: (index % 2 ? -1 : 1) * (26 + index * 3),
                      x: (index % 2 ? 1 : -1) * (18 + index * 4),
                      scale: [0.6, 1, 0.75]
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 1.15,
                      delay: reducedMotion ? 0 : 0.38 + index * 0.035
                    }}
                  >
                    {petal}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {stage === "scratch" && (
          <motion.section
            key="scratch"
            aria-label="Scratch here"
            className="journey-screen scratch-screen"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            transition={{ duration: reducedMotion ? 0 : 0.65 }}
          >
            <div className="journey-paper-grain" aria-hidden="true" />
            <ScratchReveal onContinue={() => setStage("countdown")} />
          </motion.section>
        )}

        {stage === "countdown" && (
          <motion.section
            key="countdown"
            aria-label="Wedding dates and countdown"
            className="journey-screen countdown-screen"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.75 }}
          >
            <div className="journey-paper-grain" aria-hidden="true" />
            <WeddingPortrait
              alt="Rithwik and Kalyani"
              className="countdown-portrait"
              objectPosition="50% 20%"
              preload
              scene="opening"
            />
            <Countdown variant="journey" />
            <button
              className="journey-next-button scroll-details-button"
              onClick={showDetails}
              type="button"
            >
              Scroll for details <span aria-hidden="true">↓</span>
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
