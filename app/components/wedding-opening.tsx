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

// The save-the-date surround grows away from the number the guest just
// uncovered: the label lifts off its top edge, the Telugu line settles out of
// its foot. Both start where the date is, so nothing arrives from off-stage.
const outFromDate = (from: number) => ({
  hidden: { opacity: 0, y: from },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE }
  }
});

const dateLabelOut = outFromDate(11);
const dateTeluguOut = outFromDate(-11);

const dateRulesOut = {
  hidden: { opacity: 0, scaleX: 0.42 },
  shown: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.9, ease: EASE }
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
  // Held back so the countdown arrives after the save-the-date panel has
  // finished building itself around the uncovered number.
  const [heroReady, setHeroReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);

  const flapsOpen = act !== "sealed";
  const announced = act === "announcing" || act === "revealed";
  const revealed = act === "revealed";

  useEffect(() => {
    if (act !== "unsealing") return;
    // The doors are eased on a quintic, so they are ~90% open by 1s even
    // though the swing runs 2.9s. Handing over at 0.82s means the card starts
    // blending in as the doors clear rather than after they have finished and
    // left the guest looking at bare board.
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
    // After the rules, the label and the Telugu line have settled (~1.5s).
    const timeout = window.setTimeout(
      () => setHeroReady(true),
      reduced ? 0 : 1150
    );
    return () => window.clearTimeout(timeout);
  }, [act, reduced]);

  // Long enough for the foil to finish lifting (0.6s) and the date to finish
  // its pop, so the panel starts building outward from a number that has
  // already settled.
  const handleScratched = useCallback(() => {
    window.setTimeout(() => setAct("revealed"), reduced ? 0 : 760);
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

        {/* The couple behind the announcement and the scratch panel. It belongs
            to the announcement only: once the date is uncovered it dissolves
            back into the card stock, leaving the save-the-date on bare board.
            No scale drift, which would read as a second movement under the
            date that is meant to be settling. */}
        {announced && (
          <motion.div
            aria-hidden="true"
            className="landing-photo"
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: revealed ? 0 : 0.92, scale: 1 }}
            transition={
              reduced
                ? { duration: 0.25 }
                : revealed
                  ? { duration: 1.1, ease: "easeInOut" }
                  : { duration: 1.4, ease: "easeOut" }
            }
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
          {/* popLayout: the seal is lifted out of the flex column the instant
              it starts leaving, so the announcement can mount underneath it at
              0.82s without the stage squeezing. The broken wax then flies away
              over the arriving names instead of holding them back. */}
          <AnimatePresence mode="popLayout">
            {act === "sealed" ? (
              <motion.div
                className="landing-seal-slot"
                key="seal"
                initial={false}
                // A gentle fade only. No blur or scale here: this element
                // carries the wax shards, and blurring it would smear the break
                // the guest just triggered. The delay outlasts the shard
                // flight so they are gone before the slot clears.
                exit={{ opacity: 0 }}
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : { duration: 0.45, delay: 0.62, ease: EASE }
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

          {announced && (
            <motion.div
              className="announcement"
              // No layout animation here. Every height change at the reveal is
              // driven by CSS transitions on the same curve, and a framer
              // layout pass measuring mid-transition would fight them.
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "shown"}
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.3, delayChildren: 0.1 } }
              }}
            >
              <motion.span className="announcement-kicker" variants={riseIn}>
                WE&apos;RE GETTING MARRIED
              </motion.span>
              <motion.h1 className="announcement-names" variants={riseIn}>
                Rithwik <i>&amp;</i> Kalyani
              </motion.h1>
              <motion.div className="announcement-rule-slot" variants={riseIn}>
                <OrnamentDivider className="announcement-rule" />
              </motion.div>
              <motion.p className="announcement-blessing" variants={riseIn}>
                With the blessings of our families and elders
              </motion.p>
            </motion.div>
          )}

          {/* One panel, mounted once and never replaced. The foil is painted
              over the top of it, so when the guest scratches it off the date is
              already exactly where it will stay; only the surround builds in
              around it. Nothing here unmounts at the reveal, which is what used
              to make it read as a change of page. */}
          {announced && (
            <motion.div
              className="scratch-slot"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              // Starts just behind the names and takes its time, so it blends
              // up out of the card while the doors are still clearing.
              transition={{
                duration: reduced ? 0.2 : 1.1,
                delay: reduced ? 0 : 0.35,
                ease: EASE
              }}
            >
              <ScratchReveal
                active={act === "announcing"}
                autoReveal={reduced}
                onRevealed={handleScratched}
              >
                <motion.div
                  className="date-hero"
                  // No entrance of its own. The rules, the label and the Telugu
                  // line hold their final positions from the start so the date
                  // never shifts; they just fade up once the foil is gone.
                  initial={false}
                  animate={revealed || reduced ? "shown" : "hidden"}
                  variants={{
                    hidden: {},
                    shown: {
                      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
                    }
                  }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="date-hero-rules"
                    variants={dateRulesOut}
                  />
                  <motion.span className="date-hero-label" variants={dateLabelOut}>
                    SAVE THE DATE
                  </motion.span>
                  <time className="date-hero-date" dateTime="2026-10-29">
                    <span className="date-hero-day">29</span>
                    <span className="date-hero-rest">
                      <span className="date-hero-month">OCTOBER</span>
                      <span className="date-hero-year">2026</span>
                    </span>
                  </time>
                  <motion.span
                    className="date-hero-telugu"
                    variants={dateTeluguOut}
                  >
                    వివాహ శుభముహూర్తం
                  </motion.span>
                </motion.div>
              </ScratchReveal>
            </motion.div>
          )}

          {/* Pinned to the foot of the stage rather than stacked under the
              date, so it fades up into space that was already empty. In the
              flex column it was adding its own height to the stage's centring
              and shoving the date back up a second time. */}
          {heroReady && (
            <motion.div
              className="landing-countdown"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
            >
              <Countdown variant="journey" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
