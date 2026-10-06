"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type CoupleScene = "opening" | "haldi" | "wedding" | "reception";

const portraits: Record<CoupleScene, string> = {
  opening: "/images/couple/opening.png",
  haldi: "/images/couple/haldi.png",
  wedding: "/images/couple/wedding.png",
  reception: "/images/couple/reception.png"
};

export function WeddingPortrait({
  scene,
  alt,
  className = "",
  objectPosition = "50% 23%",
  preload = false
}: {
  scene: CoupleScene;
  alt: string;
  className?: string;
  objectPosition?: string;
  preload?: boolean;
}) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const portraitRef = useRef<HTMLDivElement>(null);
  const inView = useInView(portraitRef, { once: false, margin: "-10% 0px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={portraitRef}
      className={`wedding-portrait ${className}`}
      animate={
        inView && !reducedMotion
          ? { y: [0, -3, 0], scale: [1, 1.015, 1] }
          : { y: 0, scale: 1 }
      }
      transition={
        inView && !reducedMotion
          ? { duration: 8, ease: "easeInOut", repeat: Infinity }
          : { duration: 0.4 }
      }
      role="img"
      aria-label={alt}
    >
      {imageAvailable ? (
        <Image
          alt=""
          className="wedding-portrait-image"
          fill
          loading={preload ? "eager" : "lazy"}
          onError={() => setImageAvailable(false)}
          preload={preload}
          sizes={preload ? "(max-width: 640px) 86vw, 420px" : "(max-width: 640px) 48vw, 240px"}
          src={portraits[scene]}
          style={{ objectPosition }}
        />
      ) : (
        <span className="wedding-portrait-fallback" aria-hidden="true">
          R <i>&amp;</i> K
        </span>
      )}
      <span className="portrait-inner-ring" aria-hidden="true" />
      <span className="portrait-glint" aria-hidden="true" />
    </motion.div>
  );
}
