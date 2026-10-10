"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readSessionValue, writeSessionValue } from "../../lib/session-storage";

const TRACK = "/music/wedding-ambience.mp3";
const VOLUME = 0.32;
const FADE_IN_MS = 1_100;
const FADE_OUT_MS = 650;
const MUSIC_START_EVENT = "wedding-invitation-opened";
const MUSIC_PREFERENCE_KEY = "wedding-invitation:music";

type MusicPreference = "playing" | "paused";

export function requestMusicStart() {
  window.dispatchEvent(new Event(MUSIC_START_EVENT));
}

/**
 * Background shehnai, started directly from the seal gesture so mobile autoplay
 * policies are satisfied. Manual choices are remembered for the tab.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef<number | null>(null);
  const playbackIntent = useRef(0);
  const preferenceRef = useRef<MusicPreference | null>(null);
  const resumeWhenVisible = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeFrame.current !== null) {
      window.cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target: number, duration: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelFade();
      const from = audio.volume;
      let startedAt: number | null = null;

      const step = (now: number) => {
        startedAt ??= now;
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = from + (target - from) * eased;

        if (progress < 1) {
          fadeFrame.current = window.requestAnimationFrame(step);
          return;
        }

        fadeFrame.current = null;
        onComplete?.();
      };

      fadeFrame.current = window.requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const remember = useCallback((preference: MusicPreference) => {
    preferenceRef.current = preference;
    writeSessionValue(MUSIC_PREFERENCE_KEY, preference);
  }, []);

  const start = useCallback(async (rememberChoice: boolean) => {
    const audio = audioRef.current;
    if (!audio) return false;

    const intent = ++playbackIntent.current;
    cancelFade();
    audio.volume = 0;

    try {
      await audio.play();
      if (intent !== playbackIntent.current || audio.paused) return false;
      fadeTo(VOLUME, FADE_IN_MS);
      if (rememberChoice) remember("playing");
      return true;
    } catch (error) {
      if (intent === playbackIntent.current) {
        console.error("Unable to start the wedding ambience.", error);
      }
      return false;
    }
  }, [cancelFade, fadeTo, remember]);

  const pause = useCallback(
    (rememberChoice: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      playbackIntent.current += 1;
      if (rememberChoice) remember("paused");
      if (audio.paused) {
        audio.volume = 0;
        return;
      }

      fadeTo(0, FADE_OUT_MS, () => audio.pause());
    },
    [fadeTo, remember]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    const savedPreference = readSessionValue(MUSIC_PREFERENCE_KEY);
    preferenceRef.current =
      savedPreference === "playing" || savedPreference === "paused"
        ? savedPreference
        : null;
    setReady(true);

    const startFromSeal = () => {
      if (preferenceRef.current !== "paused") {
        void start(true);
      }
    };

    const suspend = () => {
      resumeWhenVisible.current = !audio.paused;
      playbackIntent.current += 1;
      cancelFade();
      audio.volume = 0;
      audio.pause();
    };
    const resume = () => {
      if (
        resumeWhenVisible.current &&
        preferenceRef.current !== "paused"
      ) {
        resumeWhenVisible.current = false;
        void start(false);
      }
    };
    const handleVisibility = () => {
      if (document.hidden) suspend();
      else resume();
    };

    window.addEventListener(MUSIC_START_EVENT, startFromSeal);
    window.addEventListener("pagehide", suspend);
    window.addEventListener("pageshow", resume);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener(MUSIC_START_EVENT, startFromSeal);
      window.removeEventListener("pagehide", suspend);
      window.removeEventListener("pageshow", resume);
      document.removeEventListener("visibilitychange", handleVisibility);
      playbackIntent.current += 1;
      cancelFade();
      audio.pause();
    };
  }, [cancelFade, start]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void start(true);
    } else {
      pause(true);
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
