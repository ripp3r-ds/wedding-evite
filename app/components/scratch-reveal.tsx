"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const REVEAL_THRESHOLD = 0.2;

export function ScratchReveal({
  active,
  autoReveal,
  onRevealed,
  children
}: {
  active: boolean;
  autoReveal?: boolean;
  onRevealed: () => void;
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeRef = useRef(false);
  const moveCount = useRef(0);
  const [scratched, setScratched] = useState(false);

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
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const width = bounds.width;
    const height = bounds.height;
    const gold = context.createLinearGradient(0, 0, width, height);
    gold.addColorStop(0, "rgba(235, 216, 167, .82)");
    gold.addColorStop(0.46, "rgba(215, 189, 125, .76)");
    gold.addColorStop(1, "rgba(232, 211, 160, .82)");
    context.fillStyle = gold;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalAlpha = 0.18;
    context.strokeStyle = "#fff7e2";
    context.lineWidth = 1;
    for (let x = -height; x < width + height; x += 17) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }
    context.restore();

    context.strokeStyle = "rgba(123, 83, 46, 0.5)";
    context.lineWidth = 1;
    context.strokeRect(10.5, 10.5, width - 21, height - 21);

    const centerX = width / 2;
    const centerY = height / 2;
    context.strokeStyle = "rgba(128, 87, 49, 0.28)";
    context.lineWidth = 1.2;
    for (let petal = 0; petal < 8; petal += 1) {
      const angle = (Math.PI * 2 * petal) / 8;
      const x = centerX + Math.cos(angle) * 54;
      const y = centerY + Math.sin(angle) * 38;
      context.beginPath();
      context.ellipse(x, y, 8, 16, angle, 0, Math.PI * 2);
      context.stroke();
    }
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
      context.lineWidth = 38;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.arc(x, y, 19, 0, Math.PI * 2);
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
      <div className="scratch-photo-frame">{children}</div>

      <div className="opening-announcement" aria-live="polite">
        <span className="opening-kicker">WE&apos;RE GETTING MARRIED</span>
        <h1 className="opening-names">
          Rithwik <i>&amp;</i> Kalyani
        </h1>
        <p className="opening-subtitle">With the blessings of our families</p>
      </div>

      <div
        className="scratch-date-reveal"
        aria-live="polite"
        aria-hidden={!scratched}
        aria-label="The wedding dates are 28, 29 and 30 October 2026"
      >
        <span className="scratch-panel-label">SCRATCH TO REVEAL OUR DATES</span>
        <time dateTime="2026-10-28">28 · 29 · 30 OCTOBER 2026</time>
      </div>

      <canvas
        ref={canvasRef}
        aria-label="Scratch to reveal"
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
      {active && !scratched && (
        <div className="scratch-prompt" aria-hidden="true">
          <span>Now, a little reveal...</span>
        </div>
      )}
    </div>
  );
}
