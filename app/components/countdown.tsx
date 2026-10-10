"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CELEBRATIONS_END,
  WEDDING_DAY_START,
  WEDDING_MOMENT
} from "../../lib/wedding-time";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(now: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((WEDDING_MOMENT - now) / 1000));

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60
  };
}

function CountdownUnit({
  label,
  value,
  reducedMotion
}: {
  label: string;
  value: number | null;
  reducedMotion: boolean | null;
}) {
  return (
    <div
      className="countdown-unit"
      aria-label={value === null ? `${label} loading` : `${value} ${label}`}
    >
      <span className="countdown-value" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value ?? "waiting"}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            transition={{ duration: reducedMotion ? 0 : 0.26 }}
          >
            {value === null ? "··" : String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export function Countdown({
  active = true,
  variant = "story"
}: {
  active?: boolean;
  variant?: "story" | "journey";
}) {
  const [now, setNow] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    if (!active) return;

    const interval = window.setInterval(update, 1_000);

    return () => window.clearInterval(interval);
  }, [active]);

  const timeLeft =
    now !== null && now < WEDDING_MOMENT ? getTimeLeft(now) : null;
  const weddingDay =
    now !== null && now >= WEDDING_DAY_START && now < WEDDING_MOMENT;

  if (now !== null && now >= WEDDING_MOMENT) {
    const celebrationsComplete = now >= CELEBRATIONS_END;

    return (
      <section
        aria-label={
          celebrationsComplete
            ? "The wedding celebrations are complete"
            : "The wedding celebrations are underway"
        }
        className={`countdown countdown-${variant} countdown-message-state`}
      >
        <p className="countdown-kicker">
          {celebrationsComplete ? "WITH LOVE AND GRATITUDE" : "THE CELEBRATIONS ARE UNDERWAY"}
        </p>
        <p className="countdown-message">
          {celebrationsComplete
            ? "Rithwik and Kalyani are so grateful you celebrated with them."
            : "Today is filled with family, laughter, and blessings."}
        </p>
        <p className="countdown-date">Rithwik <span>&amp;</span> Kalyani</p>
      </section>
    );
  }

  return (
    <section
      aria-label="Countdown to the wedding on October 29, 2026 at 10:30 PM India time"
      className={`countdown countdown-${variant}`}
    >
      <p className="countdown-kicker">
        {weddingDay ? "TODAY IS THE DAY" : "UNTIL THE MUHURTHAM"}
      </p>
      <div className="countdown-clock">
        <CountdownUnit label="Days" value={timeLeft?.days ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">❖</span>
        <CountdownUnit label="Hours" value={timeLeft?.hours ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">❖</span>
        <CountdownUnit label="Minutes" value={timeLeft?.minutes ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">❖</span>
        <CountdownUnit label="Seconds" value={timeLeft?.seconds ?? null} reducedMotion={reducedMotion} />
      </div>
      <p className="countdown-date">10:30 PM IST <span>·</span> Hyderabad</p>
    </section>
  );
}
