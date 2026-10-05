"use client";

import Image from "next/image";
import { useState } from "react";

export type CoupleScene = "opening" | "haldi" | "wedding" | "reception";

const sceneAssets: Record<CoupleScene, string> = {
  opening: "/images/couple/opening.png",
  haldi: "/images/couple/haldi.png",
  wedding: "/images/couple/wedding.png",
  reception: "/images/couple/reception.png"
};

const sceneInitials: Record<CoupleScene, string> = {
  opening: "R & K",
  haldi: "H",
  wedding: "W",
  reception: "R"
};

export function CoupleArtwork({
  scene,
  alt,
  className = "",
  imageClassName = "",
  reveal = false
}: {
  scene: CoupleScene;
  alt: string;
  className?: string;
  imageClassName?: string;
  reveal?: boolean;
}) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div
      aria-label={alt}
      className={`couple-artwork ${className}`}
      role="img"
    >
      {!imageAvailable && (
        <span aria-hidden="true" className="artwork-monogram">
          {sceneInitials[scene]}
        </span>
      )}
      {imageAvailable && (
        <Image
          alt=""
          className={`couple-artwork-image ${imageClassName}`}
          fill
          loading={scene === "opening" ? "eager" : "lazy"}
          onError={() => setImageAvailable(false)}
          preload={scene === "opening"}
          sizes={scene === "opening" ? "(max-width: 640px) 70vw, 360px" : "(max-width: 640px) 40vw, 280px"}
          src={sceneAssets[scene]}
        />
      )}
      {reveal && <span className="artwork-light" aria-hidden="true" />}
    </div>
  );
}
