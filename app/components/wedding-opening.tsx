"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Countdown } from "./countdown";
import { ScratchReveal } from "./scratch-reveal";
import { WeddingPortrait } from "./wedding-portrait";
import { WaxSeal } from "./wax-seal";
import {
  FrameCorners,
  GoldDust,
  KalashamMark,
  MandalaBackdrop,
  OrnamentDivider
} from "./royal-ornaments";

// "announcing" carries the names, the background portrait and the scratch card
// together, so the card arrives with the reveal rather than after it.
type Act = "sealed" | "unsealing" | "announcing" | "revealed";

const EASE = [0.22, 1, 0.36, 1] as const;

const riseIn = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE }
  }
};

function PaperFlap({
  side,
  open,
  reducedMotion
}: {
  side: "left" | "right";
  open: boolean;
  reducedMotion: boolean;
}) {
  const direction = side === "left" ? -1 : 1;

  return (
    <motion.div
      aria-hidden="true"
      className={`paper-flap paper-flap-${side}`}
      animate={
        open
          ? reducedMotion
            ? { opacity: 0 }
            : { rotateY: direction * 118, z: 60, opacity: 0 }
          : { rotateY: 0, z: 0, opacity: 1 }
      }
      transition={
        open
          ? reducedMotion
            ? { duration: 0.25 }
            : {
                // The far door lags so the card unfolds rather than splitting.
                rotateY: {
                  duration: 1.45,
                  ease: EASE,
                  delay: side === "left" ? 0.06 : 0.18
                },
                z: { duration: 1.45, ease: EASE },
                opacity: {
                  delay: side === "left" ? 0.72 : 0.85,
                  duration: 0.5,
                  ease: "easeOut"
                }
              }
          : { duration: 0.3 }
      }
    >
      <span className="paper-flap-face" />
      <span className="paper-flap-edge" />
    </motion.div>
  );
}

export function WeddingOpening({
  onAnnouncement
}: {
  onAnnouncement: () => void;
}) {
  const [act, setAct] = useState<Act>("sealed");
  // Held back until the scratch panel has finished exiting. Mounting the
  // portrait and countdown while it is still occupying space makes the whole
  // stage squeeze and snap back.
  const [heroReady, setHeroReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);

  const flapsOpen = act !== "sealed";
  const photoVisible = act === "announcing" || act === "revealed";
  const revealed = act === "revealed";

  useEffect(() => {
    if (act !== "unsealing") return;
    // Short enough that the announcement starts rising while the doors are
    // still swinging; any longer and the stage sits empty after the tap.
    const timeout = window.setTimeout(
      () => setAct("announcing"),
      reduced ? 200 : 820
    );
    return () => window.clearTimeout(timeout);
  }, [act, reduced]);

  useEffect(() => {
    if (act === "revealed") onAnnouncement();
  }, [act, onAnnouncement]);

  useEffect(() => {
    if (act !== "revealed") return;
    const timeout = window.setTimeout(
      () => setHeroReady(true),
      reduced ? 0 : 700
    );
    return () => window.clearTimeout(timeout);
  }, [act, reduced]);

  const handleScratched = useCallback(() => {
    window.setTimeout(() => setAct("revealed"), reduced ? 0 : 780);
  }, [reduced]);

  return (
    <section
      aria-label="Wedding invitation"
      className="landing"
      data-act={act}
      id="opening"
    >
      <div className="landing-sky" aria-hidden="true" />
      <MandalaBackdrop />
      <GoldDust count={reduced ? 0 : 18} />

      <motion.div
        aria-hidden="true"
        className="landing-photo"
        animate={{
          opacity: photoVisible ? (revealed ? 0.16 : 0.42) : 0,
          scale: revealed ? 1.1 : 1
        }}
        transition={{ duration: reduced ? 0.25 : 1.35, ease: "easeOut" }}
      >
        <WeddingPortrait
          alt=""
          float={false}
          objectPosition="50% 20%"
          preload
          scene="opening"
          sizes="100vw"
          variant="bleed"
        />
      </motion.div>

      <div className="landing-frame">
        <FrameCorners />

        <PaperFlap side="left" open={flapsOpen} reducedMotion={reduced} />
        <PaperFlap side="right" open={flapsOpen} reducedMotion={reduced} />

        <div className="landing-stage">
          <AnimatePresence>
            {act === "sealed" ? (
              <motion.div
                className="landing-seal-slot"
                key="seal"
                initial={false}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, filter: "blur(5px)" }
                }
                transition={{ duration: reduced ? 0.2 : 0.42, ease: EASE }}
              >
                <KalashamMark className="landing-crest" />
                <span className="landing-telugu-crest">శుభలేఖ</span>
                <span className="landing-invited">You are invited</span>
                <WaxSeal opened={flapsOpen} onOpen={() => setAct("unsealing")} />
                <span className="landing-seal-hint">tap the seal</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {heroReady && (
            <motion.div
              className="landing-hero-portrait"
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 1.15, ease: EASE }}
            >
              <WeddingPortrait
                alt="Rithwik and Kalyani"
                objectPosition="50% 0%"
                preload
                scene="opening"
                sizes="(max-width: 640px) 86vw, 320px"
                variant="oval"
                zoom={1.85}
              />
            </motion.div>
          )}

          {photoVisible && (
            <motion.div
              className="announcement"
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "shown"}
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.2, delayChildren: 0.04 } }
              }}
            >
              <motion.span className="announcement-kicker" variants={riseIn}>
                WE&apos;RE GETTING MARRIED
              </motion.span>
              <motion.h1 className="announcement-names" variants={riseIn}>
                Rithwik <i>&amp;</i> Kalyani
              </motion.h1>
              <motion.div variants={riseIn}>
                <OrnamentDivider className="announcement-rule" />
              </motion.div>
              <motion.p className="announcement-blessing" variants={riseIn}>
                With the blessings of our elders, and of everyone who got us here
              </motion.p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {act === "announcing" && (
              <motion.div
                className="scratch-slot"
                key="scratch"
                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE }}
              >
                <ScratchReveal
                  active
                  autoReveal={reduced}
                  onRevealed={handleScratched}
                />
              </motion.div>
            )}

            {revealed && (
              <motion.div
                className="date-hero"
                key="date"
                initial={reduced ? false : { opacity: 0, scale: 0.72, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 120, damping: 14, mass: 1.05 }
                }
              >
                <span className="date-hero-label">SAVE THE DATE</span>
                <time className="date-hero-date" dateTime="2026-10-29">
                  <span className="date-hero-day">29</span>
                  <span className="date-hero-rest">
                    <span className="date-hero-month">OCTOBER</span>
                    <span className="date-hero-year">2026</span>
                  </span>
                </time>
                <span className="date-hero-telugu">వివాహ శుభముహూర్తం</span>
              </motion.div>
            )}
          </AnimatePresence>

          {heroReady && (
            <motion.div
              className="landing-countdown"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : 0.3 }}
            >
              <Countdown variant="journey" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
