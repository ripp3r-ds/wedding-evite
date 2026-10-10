"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACK = "/music/wedding-ambience.mp3";
const VOLUME = 0.32;

/**
 * Background shehnai, with a brass medallion to silence it.
 *
 * Phones refuse bare autoplay, so the first play attempt is deferred until the
 * guest's first gesture, which on this site is the tap on the wax seal. If the
 * browser still refuses, the medallion simply stays in its paused state and
 * waits to be pressed.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  // The medallion is withheld until the audio is actually usable, so guests
  // never press a control that cannot do anything.
  const [ready, setReady] = useState(false);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    setReady(true);

    let done = false;
    const tryStart = () => {
      if (done) return;
      done = true;
      void start();
      detach();
    };

    const detach = () => {
      document.removeEventListener("pointerdown", tryStart);
      document.removeEventListener("keydown", tryStart);
    };

    // A muted autoplay attempt is pointless for ambience, so instead we ride
    // the first real gesture, which satisfies the autoplay policy.
    void audio.play().then(
      () => {
        done = true;
        detach();
      },
      () => {
        document.addEventListener("pointerdown", tryStart, { once: true });
        document.addEventListener("keydown", tryStart, { once: true });
      }
    );

    return detach;
  }, [start]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void start();
    } else {
      audio.pause();
    }
  }

  return (
    <>
      <audio
        loop
        preload="metadata"
        ref={audioRef}
        src={TRACK}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {ready && (
        <button
          aria-label={playing ? "Pause the music" : "Play the music"}
          aria-pressed={playing}
          className="music-toggle"
          data-playing={playing ? "true" : undefined}
          onClick={toggle}
          type="button"
        >
          <span className="music-toggle-face">
            {playing ? (
              <span className="music-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <svg
                aria-hidden="true"
                className="music-glyph"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 6.8v10.4a.6.6 0 0 0 .93.5l7.6-5.2a.6.6 0 0 0 0-1l-7.6-5.2a.6.6 0 0 0-.93.5Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        </button>
      )}
    </>
  );
}
