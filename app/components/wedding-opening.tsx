"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Countdown } from "./countdown";
import { ScratchReveal } from "./scratch-reveal";
import { WeddingPortrait } from "./wedding-portrait";
import { WaxSeal } from "./wax-seal";
import { DiyaSprite } from "./celebration-artefacts";
import {
  FrameCorners,
  GoldDust,
  KalashamMark,
  MugguBackdrop,
  OrnamentDivider,
  ThoranamHalf
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
    transition: { duration: 1.35, ease: EASE }
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
                  duration: 2.9,
                  ease: EASE,
                  delay: side === "left" ? 0.12 : 0.34
                },
                z: { duration: 2.9, ease: EASE },
                opacity: {
                  delay: side === "left" ? 1.55 : 1.8,
                  duration: 0.95,
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
  const announced = act === "announcing" || act === "revealed";
  const revealed = act === "revealed";

  useEffect(() => {
    if (act !== "unsealing") return;
    // Pinned to roughly half the door duration (~2.9s), so the announcement
    // starts rising while the doors are still swinging. This ratio is what
    // keeps the stage from sitting empty after the tap; if the swing is
    // retimed, move this with it rather than on its own.
    const timeout = window.setTimeout(
      () => setAct("announcing"),
      reduced ? 200 : 1480
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
      reduced ? 0 : 1250
    );
    return () => window.clearTimeout(timeout);
  }, [act, reduced]);

  // Long enough to read the date you just uncovered, short enough that the
  // spent card does not sit there waiting to be cleared.
  const handleScratched = useCallback(() => {
    window.setTimeout(() => setAct("revealed"), reduced ? 0 : 620);
  }, [reduced]);

  return (
    <section
      aria-label="Wedding invitation"
      className="landing"
      data-act={act}
      id="opening"
    >
      <div className="landing-sky" aria-hidden="true" />
      <GoldDust count={reduced ? 0 : 18} />

      {/* Two brass diyas at the threshold, the way a Telugu home is lit for
          guests. Siblings of the frame and stacked above it, so the card's
          paper board cannot dim them. */}
      <div className="landing-diyas" aria-hidden="true">
        <span className="landing-diya landing-diya-left">
          <DiyaSprite />
        </span>
        <span className="landing-diya landing-diya-right">
          <DiyaSprite />
        </span>
      </div>

      <div className="landing-frame">
        <FrameCorners />

        {/* The couple behind the announcement and the scratch card. It is gone
            by "revealed", where the hero oval takes over, so the two portrait
            treatments never share the screen. */}
        {announced && (
          <motion.div
            aria-hidden="true"
            className="landing-photo"
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: revealed ? 0 : 0.92, scale: revealed ? 1.1 : 1 }}
            transition={{ duration: reduced ? 0.25 : 1.7, ease: "easeOut" }}
          >
            <WeddingPortrait
              alt=""
              float={false}
              objectPosition="50% 18%"
              preload
              scene="opening"
              sizes="100vw"
              variant="bleed"
            />
          </motion.div>
        )}

        {/* Inside the frame, so the muggu reads as printed on the card stock
            rather than as wallpaper showing through behind it. */}
        <MugguBackdrop />

        <PaperFlap side="left" open={flapsOpen} reducedMotion={reduced} />
        <PaperFlap side="right" open={flapsOpen} reducedMotion={reduced} />

        {/* Mango toranam across the head of the card. It is strung on the same
            cord as the seal, so when the seal cracks the string parts at the
            centre and both halves swing out of frame with the doors. */}
        <div className="landing-thoranam" aria-hidden="true">
          {(["left", "right"] as const).map((side) => (
            <motion.span
              className={`thoranam-half thoranam-half-${side}`}
              key={side}
              animate={
                flapsOpen
                  ? reduced
                    ? { opacity: 0 }
                    : {
                        rotate: side === "left" ? -15 : 15,
                        x: side === "left" ? -14 : 14,
                        y: -10,
                        opacity: 0
                      }
                  : { rotate: 0, x: 0, y: 0, opacity: 1 }
              }
              transition={
                flapsOpen
                  ? reduced
                    ? { duration: 0.3 }
                    : {
                        // Snaps open quickly, then rides out with the doors:
                        // the travel tracks the 2.9s swing, and the fade is
                        // held back so the break is actually watched.
                        rotate: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
                        x: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
                        y: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 1.3, delay: 1.2, ease: "easeOut" }
                      }
                  : { duration: 0.3 }
              }
            >
              <ThoranamHalf side={side} />
            </motion.span>
          ))}
        </div>

        <div className="landing-stage">
          <AnimatePresence>
            {act === "sealed" ? (
              <motion.div
                className="landing-seal-slot"
                key="seal"
                initial={false}
                // A late, gentle fade only. No blur or scale here: this element
                // carries the wax shards, and blurring it would smear the break
                // the guest just triggered. The delay outlasts the shard
                // flight so they are gone before the slot clears.
                exit={{ opacity: 0 }}
                // Ends at 1.42s, just inside the shards' 1.45s flight, so the
                // slot unmounts at ~1.45s and is out of the stage's flex column
                // before "announcing" mounts the names at 1.48s. Overlapping
                // the two squeezes the stage and snaps it back.
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : { duration: 0.5, delay: 0.92, ease: EASE }
                }
              >
                {/* The lettering leaves on its own, quickly, so it does not sit
                    on screen while the seal is still breaking. */}
                <motion.div
                  className="landing-seal-words"
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: -12, filter: "blur(5px)" }
                  }
                  transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE }}
                >
                  <KalashamMark className="landing-crest" />
                  <span className="landing-telugu-crest">శుభలేఖ</span>
                  <span className="landing-invited">You are invited</span>
                </motion.div>

                <WaxSeal opened={flapsOpen} onOpen={() => setAct("unsealing")} />

                <motion.span
                  className="landing-seal-hint"
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.2 : 0.35, ease: "easeOut" }}
                >
                  tap the seal
                </motion.span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {heroReady && (
            <motion.div
              className="landing-hero-portrait"
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 1.9, ease: EASE }}
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

          {announced && (
            <motion.div
              className="announcement"
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "shown"}
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.38, delayChildren: 0.16 } }
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
                With the blessings of our families and elders
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
                // Shrinks away in place, like the spent foil being lifted off,
                // rather than sliding out as a card of its own.
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                transition={{
                  duration: reduced ? 0.2 : 0.62,
                  ease: EASE
                }}
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
                // Picks up close to full size so it reads as the same date
                // settling into place, not a second card popping in.
                initial={reduced ? false : { opacity: 0, scale: 0.9, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 58, damping: 18, mass: 1.15 }
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
              transition={{ duration: reduced ? 0 : 1.45, delay: reduced ? 0 : 0.7 }}
            >
              <Countdown variant="journey" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
