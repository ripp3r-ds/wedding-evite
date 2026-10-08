"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.3;

// The foil is only a covering. Whatever is handed in as children is the panel
// that stays on screen afterwards, so nothing is swapped out at the reveal.
export function ScratchReveal({
  active,
  autoReveal,
  children,
  onRevealed
}: {
  active: boolean;
  autoReveal?: boolean;
  children: ReactNode;
  onRevealed: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeRef = useRef(false);
  const moveCount = useRef(0);
  const [scratched, setScratched] = useState(false);
  const [touched, setTouched] = useState(false);

  const finish = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    setScratched(true);
    onRevealed();
  }, [onRevealed]);

  const paintSurface = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || completeRef.current) return;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const width = bounds.width;
    const height = bounds.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const foil = context.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, "#f7e6b8");
    foil.addColorStop(0.18, "#d7b063");
    foil.addColorStop(0.36, "#fbf1d0");
    foil.addColorStop(0.55, "#c99f49");
    foil.addColorStop(0.74, "#f4e3b5");
    foil.addColorStop(1, "#b78d40");
    context.fillStyle = foil;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalAlpha = 0.16;
    context.strokeStyle = "#fffaea";
    context.lineWidth = 1;
    for (let x = -height; x < width + height; x += 9) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }
    context.restore();

    context.save();
    context.globalAlpha = 0.1;
    context.strokeStyle = "#6d4713";
    context.lineWidth = 1;
    for (let x = -height; x < width + height; x += 23) {
      context.beginPath();
      context.moveTo(x + height, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    context.restore();

    context.strokeStyle = "rgba(118, 78, 28, .55)";
    context.lineWidth = 1.4;
    context.strokeRect(8.5, 8.5, width - 17, height - 17);
    context.strokeStyle = "rgba(118, 78, 28, .3)";
    context.lineWidth = 1;
    context.strokeRect(14.5, 14.5, width - 29, height - 29);

    const radius = Math.min(width, height) * 0.3;
    context.save();
    context.strokeStyle = "rgba(112, 72, 24, .34)";
    context.lineWidth = 1.1;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.66, 0, Math.PI * 2);
    context.stroke();

    for (let petal = 0; petal < 16; petal += 1) {
      context.save();
      context.translate(centerX, centerY);
      context.rotate((Math.PI * 2 * petal) / 16);
      context.beginPath();
      context.ellipse(0, -radius * 0.84, radius * 0.12, radius * 0.26, 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    context.fillStyle = "rgba(112, 72, 24, .3)";
    for (let bead = 0; bead < 24; bead += 1) {
      const angle = (Math.PI * 2 * bead) / 24;
      context.beginPath();
      context.arc(
        centerX + Math.cos(angle) * radius * 1.2,
        centerY + Math.sin(angle) * radius * 1.2,
        1.6,
        0,
        Math.PI * 2
      );
      context.fill();
    }
    context.restore();
  }, []);

  useEffect(() => {
    paintSurface();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(paintSurface);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintSurface]);

  useEffect(() => {
    if (active && autoReveal) finish();
  }, [active, autoReveal, finish]);

  const measureScratch = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context || completeRef.current) return;

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const stride = 28;
    let samples = 0;
    let cleared = 0;
    for (let pixel = 3; pixel < data.length; pixel += stride * 4) {
      samples += 1;
      if (data[pixel] < 24) cleared += 1;
    }
    if (samples && cleared / samples >= REVEAL_THRESHOLD) finish();
  }, [finish]);

  const scratchAt = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !context || completeRef.current || !active) return;
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = 46;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.arc(x, y, 23, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(x, y);

      moveCount.current += 1;
      if (moveCount.current % 8 === 0) measureScratch();
    },
    [active, measureScratch]
  );

  function beginScratch(event: React.PointerEvent<HTMLCanvasElement>) {
    if (completeRef.current || !active) return;
    setTouched(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = event.currentTarget.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    context.beginPath();
    context.moveTo(event.clientX - bounds.left, event.clientY - bounds.top);
    scratchAt(event);
  }

  return (
    <div className={`scratch-card${scratched ? " is-scratched" : ""}`}>
      <div className="scratch-face" aria-live="polite">
        {children}
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden={!active || scratched}
        aria-label="Scratch to reveal our wedding date"
        className="scratch-surface"
        role="button"
        tabIndex={active && !scratched ? 0 : -1}
        onPointerDown={beginScratch}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) scratchAt(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          measureScratch();
        }}
        onPointerCancel={measureScratch}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            finish();
          }
        }}
      />

      {active && !scratched && !touched && (
        <div className="scratch-prompt" aria-hidden="true">
          <span className="scratch-prompt-coin" />
          <span className="scratch-prompt-text">Scratch to reveal our wedding date</span>
        </div>
      )}
    </div>
  );
}
