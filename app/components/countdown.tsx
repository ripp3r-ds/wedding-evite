"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const weddingMoment = Date.UTC(2026, 9, 29, 17, 0, 0);

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(now: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((weddingMoment - now) / 1000));

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
    <div className="countdown-unit" aria-label={`${value ?? "—"} ${label}`}>
      <span className="countdown-value" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value ?? "waiting"}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            {value === null ? "—" : String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export function Countdown({ variant = "story" }: { variant?: "story" | "journey" }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(Date.now()));
    update();
    const interval = window.setInterval(update, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Countdown to the wedding on October 29, 2026 at 10:30 PM India time"
      className={`countdown countdown-${variant}`}
    >
      <p className="countdown-kicker">UNTIL WE SAY “I DO”</p>
      <div className="countdown-clock">
        <CountdownUnit label="Days" value={timeLeft?.days ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">·</span>
        <CountdownUnit label="Hours" value={timeLeft?.hours ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">·</span>
        <CountdownUnit label="Minutes" value={timeLeft?.minutes ?? null} reducedMotion={reducedMotion} />
        <span className="countdown-separator" aria-hidden="true">·</span>
        <CountdownUnit label="Seconds" value={timeLeft?.seconds ?? null} reducedMotion={reducedMotion} />
      </div>
      <p className="countdown-date">29 October 2026 <span>·</span> 10:30 PM IST</p>
    </section>
  );
}
