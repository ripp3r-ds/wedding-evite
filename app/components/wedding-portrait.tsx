"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type CoupleScene = "opening" | "haldi" | "wedding" | "reception";
export type PortraitVariant = "arch" | "medallion" | "bleed" | "oval";

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
  preload = false,
  variant = "arch",
  float = true,
  sizes,
  zoom = 1
}: {
  scene: CoupleScene;
  alt: string;
  className?: string;
  objectPosition?: string;
  preload?: boolean;
  variant?: PortraitVariant;
  float?: boolean;
  sizes?: string;
  /** Scales the photo inside its frame, anchored to the top, to crop in on faces. */
  zoom?: number;
}) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const portraitRef = useRef<HTMLDivElement>(null);
  const inView = useInView(portraitRef, { once: false, margin: "-10% 0px" });
  const reducedMotion = useReducedMotion();
  const animated = float && inView && !reducedMotion;

  return (
    <motion.div
      ref={portraitRef}
      className={`wedding-portrait wedding-portrait-${variant} portrait-scene-${scene} ${className}`}
      animate={animated ? { y: [0, -4, 0], scale: [1, 1.012, 1] } : { y: 0, scale: 1 }}
      transition={
        animated
          ? { duration: 9, ease: "easeInOut", repeat: Infinity }
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
          sizes={
            sizes ??
            (preload ? "(max-width: 640px) 92vw, 460px" : "(max-width: 640px) 60vw, 320px")
          }
          src={portraits[scene]}
          style={
            zoom === 1
              ? { objectPosition }
              : { objectPosition, transform: `scale(${zoom})`, transformOrigin: "50% 0%" }
          }
        />
      ) : (
        <span className="wedding-portrait-fallback" aria-hidden="true">
          R <i>&amp;</i> K
        </span>
      )}
      {variant !== "bleed" && (
        <>
          <span className="portrait-inner-ring" aria-hidden="true" />
          <span className="portrait-glint" aria-hidden="true" />
        </>
      )}
    </motion.div>
  );
}
