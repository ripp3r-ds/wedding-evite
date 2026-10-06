"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const REVEAL_THRESHOLD = 0.53;

export function ScratchReveal({ onContinue }: { onContinue: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeRef = useRef(false);
  const moveCount = useRef(0);
  const [scratched, setScratched] = useState(false);
  const reducedMotion = useReducedMotion();

  const paintSurface = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
    gold.addColorStop(0, "#ebd8a7");
    gold.addColorStop(0.46, "#d7bd7d");
    gold.addColorStop(1, "#e8d3a0");
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
    context.strokeRect(12.5, 12.5, width - 25, height - 25);
    context.strokeStyle = "rgba(255, 248, 223, 0.7)";
    context.strokeRect(16.5, 16.5, width - 33, height - 33);

    const centerX = width / 2;
    const centerY = height / 2;
    context.strokeStyle = "rgba(128, 87, 49, 0.23)";
    context.lineWidth = 1.2;
    for (let petal = 0; petal < 8; petal += 1) {
      const angle = (Math.PI * 2 * petal) / 8;
      const x = centerX + Math.cos(angle) * 62;
      const y = centerY + Math.sin(angle) * 44;
      context.beginPath();
      context.ellipse(x, y, 9, 18, angle, 0, Math.PI * 2);
      context.stroke();
    }
    context.beginPath();
    context.arc(centerX, centerY, 11, 0, Math.PI * 2);
    context.stroke();
  }, []);

  useEffect(() => {
    paintSurface();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(paintSurface);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintSurface]);

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
    if (samples && cleared / samples >= REVEAL_THRESHOLD) {
      completeRef.current = true;
      setScratched(true);
    }
  }, []);

  const scratchAt = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context || completeRef.current) return;
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
  }, [measureScratch]);

  function beginScratch(event: React.PointerEvent<HTMLCanvasElement>) {
    if (completeRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = event.currentTarget.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    context.beginPath();
    context.moveTo(event.clientX - bounds.left, event.clientY - bounds.top);
    scratchAt(event);
  }

  return (
    <div className="scratch-stage">
      <motion.div
        className={`scratch-card${scratched ? " is-scratched" : ""}`}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -12, scale: reducedMotion ? 1 : 0.985 }}
        transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="scratch-date-reveal"
          aria-live="polite"
          aria-hidden={!scratched}
          aria-label="Rithwik and Kalyani are getting hitched on October 29, 2026"
        >
          <span className="scratch-couple-names">
            Rithwik <i>&amp;</i><br />Kalyani
          </span>
          <strong>are getting hitched</strong>
          <time dateTime="2026-10-29">Oct 29, 2026</time>
        </div>
        <canvas
          ref={canvasRef}
          aria-label="Scratch here"
          className="scratch-surface"
          role="button"
          tabIndex={0}
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
              completeRef.current = true;
              setScratched(true);
            }
          }}
        />
        <div className="scratch-prompt" aria-hidden="true">
          <span>Scratch here</span>
        </div>
        <span className="scratch-flower scratch-flower-left" aria-hidden="true">✿</span>
        <span className="scratch-flower scratch-flower-right" aria-hidden="true">✿</span>
      </motion.div>
      {scratched && (
        <motion.button
          className="journey-next-button"
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
        >
          Continue to countdown <span aria-hidden="true">↓</span>
        </motion.button>
      )}
    </div>
  );
}
