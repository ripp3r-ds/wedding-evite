export function CornerFlourish({
  corner
}: {
  corner: "tl" | "tr" | "bl" | "br";
}) {
  return (
    <svg
      aria-hidden="true"
      className={`corner-flourish corner-flourish-${corner}`}
      viewBox="0 0 72 72"
      fill="none"
    >
      <path
        d="M4 4h26M4 4v26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 9h14M9 9v14"
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M9 30c10 0 18-8 18-18 0 7 5 12 12 12-8 0-14 6-14 14 0-5-4-8-9-8Z"
        fill="currentColor"
        opacity=".55"
      />
      <circle cx="36" cy="10" r="2" fill="currentColor" opacity=".8" />
      <circle cx="10" cy="36" r="2" fill="currentColor" opacity=".8" />
      <path
        d="M30 4c14 1 24 6 32 14M4 30c1 14 6 24 14 32"
        stroke="currentColor"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  );
}

export function FrameCorners() {
  return (
    <>
      <CornerFlourish corner="tl" />
      <CornerFlourish corner="tr" />
      <CornerFlourish corner="bl" />
      <CornerFlourish corner="br" />
    </>
  );
}

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`ornament-divider ${className}`}
      viewBox="0 0 220 18"
      fill="none"
    >
      <path d="M6 9h74M140 9h74" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <path
        d="M110 1c3.6 4.6 7.4 6.6 12.2 8-4.8 1.4-8.6 3.4-12.2 8-3.6-4.6-7.4-6.6-12.2-8 4.8-1.4 8.6-3.4 12.2-8Z"
        fill="currentColor"
      />
      <circle cx="88" cy="9" r="2.4" fill="currentColor" opacity=".85" />
      <circle cx="132" cy="9" r="2.4" fill="currentColor" opacity=".85" />
      <circle cx="80" cy="9" r="1.2" fill="currentColor" opacity=".6" />
      <circle cx="140" cy="9" r="1.2" fill="currentColor" opacity=".6" />
    </svg>
  );
}

/**
 * A pulli muggu: the dot lattice a Telugu muggu is drawn around, with kolam
 * loops threaded through it. Deliberately not a concentric mandala, which
 * reads as generic temple decor rather than a doorstep drawing.
 */
export function MugguBackdrop({ className = "" }: { className?: string }) {
  const outerLoops = Array.from({ length: 8 }, (_, index) => index * 45);
  const innerLoops = Array.from({ length: 8 }, (_, index) => index * 45 + 22.5);

  // Diamond lattice of pulli, the dots the loops are drawn around.
  const dotRows = [1, 3, 5, 7, 9, 7, 5, 3, 1];
  const dots: { x: number; y: number }[] = [];
  dotRows.forEach((count, row) => {
    const y = 200 + (row - 4) * 38;
    for (let column = 0; column < count; column += 1) {
      dots.push({ x: 200 + (column - (count - 1) / 2) * 38, y });
    }
  });

  return (
    <svg
      aria-hidden="true"
      className={`muggu-backdrop ${className}`}
      viewBox="0 0 400 400"
      fill="none"
    >
      <g className="muggu-dots" fill="currentColor" opacity=".75">
        {dots.map((dot) => (
          <circle cx={dot.x} cy={dot.y} key={`${dot.x}-${dot.y}`} r="2.1" />
        ))}
      </g>
      <g
        className="muggu-loops"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* pathLength normalises every stroke to 1 so the draw-in reveal runs
            at the same rate on loops and rings of very different lengths. */}
        {outerLoops.map((angle) => (
          <path
            d="M200 200C154 176 150 118 200 68C250 118 246 176 200 200Z"
            key={`outer-${angle}`}
            pathLength={1}
            strokeWidth="1.6"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}
        {innerLoops.map((angle) => (
          <path
            d="M200 200C180 188 178 158 200 136C222 158 220 188 200 200Z"
            key={`inner-${angle}`}
            pathLength={1}
            strokeWidth="1.2"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}
        <circle cx="200" cy="200" opacity=".7" pathLength={1} r="168" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

export function KalashamMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`kalasham-mark ${className}`}
      viewBox="0 0 64 72"
      fill="none"
    >
      <path
        d="M22 30c-5 5-7 11-7 17 0 11 8 19 17 19s17-8 17-19c0-6-2-12-7-17H22Z"
        fill="currentColor"
        opacity=".9"
      />
      <path d="M18 26h28l-4 6H22l-4-6Z" fill="currentColor" />
      <path
        d="M32 26c-4-4-10-5-14-3 2-5 8-7 14-5 6-2 12 0 14 5-4-2-10-1-14 3Z"
        fill="currentColor"
        opacity=".75"
      />
      <circle cx="32" cy="14" r="6" fill="currentColor" opacity=".85" />
      <path
        d="M32 3c1.6 3 3 4.4 6 5.6-3 1.2-4.4 2.6-6 5.6-1.6-3-3-4.4-6-5.6 3-1.2 4.4-2.6 6-5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* One half of the mango-leaf toranam strung across the top of the card, drawn
   in halves so the string can snap at the centre when the seal breaks.

   The swag is the quadratic Bezier (0,4) -> ctrl (200,28) -> (400,4), split at
   t = 0.5 by de Casteljau. In local coordinates that leaves:
     left   cord "M0 4 Q100 16 200 16",  x = 200t,  y = 4 + 24t - 12t^2
     right  cord "M0 16 Q100 16 200 4",  x = 200s,  y = 16 - 12s^2
   which is the same curve mirrored, so the halves meet flush at the centre.
   x is exactly linear in the parameter, so leaves space evenly by x. */
const THORANAM_LEAVES = 14;

export function ThoranamHalf({ side }: { side: "left" | "right" }) {
  const mirror = side === "right";

  const leaves = Array.from({ length: THORANAM_LEAVES }, (_, index) => {
    const t = (index + 1) / (THORANAM_LEAVES + 1);
    const x = 200 * t;
    const y = 4 + 24 * t - 12 * t * t;
    // Alternating lean so the leaves read as cut foliage, not a comb. Mirrored
    // on the right half so the two sides stay symmetric about the centre.
    const tilt = ((index % 3) - 1) * (mirror ? -1 : 1);
    // Longest towards the middle of the swag, where a real toranam hangs
    // deepest.
    const scale = 0.86 + 0.14 * t;

    return { x: mirror ? 200 - x : x, y, tilt, scale };
  });

  const cord = mirror ? "M0 16 Q100 16 200 4" : "M0 4 Q100 16 200 16";

  return (
    <svg
      aria-hidden="true"
      className="thoranam-art"
      viewBox="0 0 200 44"
      fill="none"
      // Pinned top so both halves scale identically and their cord ends still
      // meet in the middle whatever height the container resolves to.
      preserveAspectRatio="xMidYMin meet"
    >
      <g className="thoranam-leaves">
        {leaves.map((leaf, index) => (
          <g
            key={index}
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.tilt * 7}) scale(${leaf.scale})`}
          >
            <path d="M0 0C3.5 6.5 3.5 17 0 24C-3.5 17-3.5 6.5 0 0Z" fill="#1d4521" />
            {/* Lighter blade and midrib, so a leaf is not a flat blob. */}
            <path
              d="M0 1.6C2.3 7 2.3 16 0 21.5C-2.3 16-2.3 7 0 1.6Z"
              fill="#2f6b32"
              opacity=".85"
            />
            <path d="M0 2.4V21.5" stroke="#8fbd73" strokeWidth=".45" opacity=".45" />
          </g>
        ))}
      </g>

      {/* The same red cord as the seal, run thinner. Drawn last so it crosses
          over the leaf tops, the way a toranam is actually tied. */}
      <path d={cord} stroke="#c7343c" strokeWidth="2" strokeLinecap="round" />
      <path
        d={cord}
        stroke="#f0a89f"
        strokeWidth=".7"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

export function GoldDust({ count = 16 }: { count?: number }) {
  const motes = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="gold-dust" aria-hidden="true">
      {motes.map((index) => {
        const left = (index * 37) % 100;
        const delay = (index % 8) * 1.4;
        const duration = 11 + (index % 5) * 2.6;
        const size = 2 + (index % 3);

        return (
          <span
            className="gold-mote"
            key={index}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`
            }}
          />
        );
      })}
    </div>
  );
}
