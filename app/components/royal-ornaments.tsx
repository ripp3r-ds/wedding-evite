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

export function MandalaBackdrop() {
  const spokes = Array.from({ length: 24 }, (_, index) => index);
  const petals = Array.from({ length: 16 }, (_, index) => index);

  return (
    <svg
      aria-hidden="true"
      className="mandala-backdrop"
      viewBox="0 0 400 400"
      fill="none"
    >
      <g stroke="currentColor" fill="none">
        <circle cx="200" cy="200" r="188" strokeWidth=".8" opacity=".35" />
        <circle cx="200" cy="200" r="162" strokeWidth="1.4" opacity=".5" />
        <circle cx="200" cy="200" r="118" strokeWidth=".8" opacity=".4" />
        <circle cx="200" cy="200" r="74" strokeWidth="1.2" opacity=".55" />
        <circle cx="200" cy="200" r="36" strokeWidth=".8" opacity=".45" />
      </g>
      <g opacity=".5">
        {spokes.map((index) => (
          <line
            key={`spoke-${index}`}
            x1="200"
            y1="42"
            x2="200"
            y2="78"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${index * 15} 200 200)`}
          />
        ))}
      </g>
      <g opacity=".45">
        {petals.map((index) => (
          <ellipse
            key={`petal-${index}`}
            cx="200"
            cy="124"
            rx="13"
            ry="34"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${index * 22.5} 200 200)`}
          />
        ))}
      </g>
      <g opacity=".6">
        {petals.map((index) => (
          <circle
            key={`bead-${index}`}
            cx="200"
            cy="58"
            r="2.6"
            fill="currentColor"
            transform={`rotate(${index * 22.5 + 11} 200 200)`}
          />
        ))}
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
