"use client";

import { motion, useReducedMotion } from "framer-motion";

function SealMonogram() {
  return (
    <svg aria-hidden="true" className="wax-seal-art" viewBox="0 0 160 160" fill="none">
      <defs>
        <radialGradient id="waxBody" cx="34%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#a8323c" />
          <stop offset="46%" stopColor="#7a1d2a" />
          <stop offset="100%" stopColor="#4a0f1a" />
        </radialGradient>
        <radialGradient id="waxSheen" cx="32%" cy="24%" r="46%">
          <stop offset="0%" stopColor="#ffd9b0" stopOpacity=".55" />
          <stop offset="100%" stopColor="#ffd9b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="waxGold" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fbe9ba" />
          <stop offset="42%" stopColor="#d9ac52" />
          <stop offset="100%" stopColor="#9a7126" />
        </linearGradient>
      </defs>

      <path
        className="wax-seal-blob"
        d="M80 6c16-1 24 8 37 13 13 5 26 3 32 15 6 12-2 22-1 36 1 14 9 23 3 35-6 12-20 11-30 19-10 8-14 21-27 24-13 3-21-7-34-10-13-3-26 2-35-7-9-9-5-22-9-35-4-13-14-21-11-34 3-13 16-17 24-28 8-11 9-24 22-28 9-3 18 1 29 0Z"
        fill="url(#waxBody)"
      />
      <path
        d="M80 6c16-1 24 8 37 13 13 5 26 3 32 15 6 12-2 22-1 36 1 14 9 23 3 35-6 12-20 11-30 19-10 8-14 21-27 24-13 3-21-7-34-10-13-3-26 2-35-7-9-9-5-22-9-35-4-13-14-21-11-34 3-13 16-17 24-28 8-11 9-24 22-28 9-3 18 1 29 0Z"
        fill="url(#waxSheen)"
      />

      {/* The wax blob's area centroid is (80.4, 75), not the viewBox centre, so
          everything stamped into the wax is shifted up by 5 to sit true. */}
      <g transform="translate(0 -5)">
        <circle cx="80" cy="80" r="56" stroke="url(#waxGold)" strokeWidth="2.4" opacity=".92" />
        <circle cx="80" cy="80" r="50" stroke="#f0cf8c" strokeWidth=".9" opacity=".55" />

        <g opacity=".85">
          {Array.from({ length: 28 }, (_, index) => (
            <line
              key={index}
              x1="80"
              y1="24"
              x2="80"
              y2="31"
              stroke="#e7c276"
              strokeWidth="1.3"
              strokeLinecap="round"
              transform={`rotate(${index * (360 / 28)} 80 80)`}
            />
          ))}
        </g>

        {/* Set in the invitation's own display face so the monogram reads as
            engraved lettering rather than drawn strokes. */}
        {/* Baseline is placed by hand rather than via dominant-baseline, which
            centres on the em box and leaves all-caps sitting visibly high. */}
        <text
          className="wax-seal-monogram"
          x="80"
          y="94.5"
          textAnchor="middle"
          fill="url(#waxGold)"
        >
          <tspan>R</tspan>
          <tspan className="wax-seal-amp" dx="1">&amp;</tspan>
          <tspan dx="1">K</tspan>
        </text>

        <path
          d="M80 118c2.2 3 4.6 4.3 7.6 5.3-3 1-5.4 2.3-7.6 5.3-2.2-3-4.6-4.3-7.6-5.3 3-1 5.4-2.3 7.6-5.3Z"
          fill="#e7c276"
          opacity=".8"
        />
      </g>
    </svg>
  );
}

export function WaxSeal({
  opened,
  onOpen
}: {
  opened: boolean;
  onOpen: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="seal-rig">
      <motion.div
        className="seal-cord"
        aria-hidden="true"
        animate={
          opened || reducedMotion
            ? { rotate: 0, opacity: opened ? 0 : 1 }
            : { rotate: [-1.6, 1.6, -1.6] }
        }
        transition={
          opened || reducedMotion
            ? { duration: 0.55, ease: "easeOut" }
            : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg viewBox="0 0 40 320" fill="none" preserveAspectRatio="none">
          <path
            d="M20 0c0 70-7 104-5 150 1 34 6 58 5 86"
            stroke="#c7343c"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M20 0c0 70-7 104-5 150 1 34 6 58 5 86"
            stroke="#f0a89f"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity=".55"
          />
        </svg>
        <span className="seal-knot" />
      </motion.div>

      <motion.button
        aria-label="Open the wedding invitation"
        className="wax-seal"
        disabled={opened}
        onClick={onOpen}
        type="button"
        animate={
          opened
            ? reducedMotion
              ? { opacity: 0 }
              : { y: -170, rotate: -26, scale: 0.68, opacity: 0 }
            : reducedMotion
              ? { scale: 1, rotate: 0, y: 0, opacity: 1 }
              : { scale: [1, 1.055, 1], rotate: [-2.4, 2.4, -2.4], y: 0, opacity: 1 }
        }
        transition={
          opened
            ? { duration: reducedMotion ? 0.25 : 0.95, ease: [0.3, 0.9, 0.3, 1] }
            : reducedMotion
              ? { duration: 0.2 }
              : {
                  scale: { duration: 2.3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
                }
        }
        whileTap={opened || reducedMotion ? undefined : { scale: 0.93 }}
      >
        <span className="seal-halo" aria-hidden="true" />
        <span className="seal-ripple" aria-hidden="true" />
        <span className="seal-ripple seal-ripple-late" aria-hidden="true" />
        <SealMonogram />
        <span className="seal-glint" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
