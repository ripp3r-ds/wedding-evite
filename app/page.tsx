"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WeddingOpening } from "./components/wedding-opening";
import { WeddingPortrait } from "./components/wedding-portrait";
import { CelebrationArtefacts, DiyaSprite } from "./components/celebration-artefacts";
import {
  FrameCorners,
  MugguBackdrop,
  OrnamentDivider
} from "./components/royal-ornaments";
import { logRsvpInBackground, type RsvpSubmission } from "../lib/rsvp";

const events = [
  {
    id: "haldi",
    number: "I",
    title: "Rithwik's Haldi",
    telugu: "మంగళ స్నానం",
    day: "28",
    month: "OCTOBER",
    year: "2026",
    weekday: "WEDNESDAY",
    date: "OCTOBER 28, 2026",
    time: "5:00 PM",
    place: "Rithwik's Home, Khammam",
    map: "https://maps.app.goo.gl/tnUscYRzi9mA4BR2A?g_st=ac",
    scene: "haldi",
    artefact: "marigold",
    note: "Turmeric, marigolds, and cousins with far too many opinions.",
    aside: "",
    rsvpLabel: "Rithwik's Haldi"
  },
  {
    id: "wedding",
    number: "II",
    title: "The Wedding",
    telugu: "వివాహం",
    day: "29",
    month: "OCTOBER",
    year: "2026",
    weekday: "THURSDAY",
    date: "OCTOBER 29, 2026",
    time: "10:30 PM",
    place: "Amaravati Banquet Hall, LB Nagar, Hyderabad",
    map: "https://maps.app.goo.gl/vrtDszsCvD4BAuDq8?g_st=ac",
    scene: "wedding",
    artefact: "thalambralu",
    note: "The muhurtham falls at 10:30 PM. Come early, the celebrations begin before it does.",
    aside: "",
    rsvpLabel: "Wedding"
  },
  {
    id: "reception",
    number: "III",
    title: "Reception",
    telugu: "విందు",
    day: "30",
    month: "OCTOBER",
    year: "2026",
    weekday: "FRIDAY",
    date: "OCTOBER 30, 2026",
    time: "7:00 PM",
    place: "Kalluru, Khammam",
    map: "https://maps.app.goo.gl/XMZRrdvo9hHRgTru7?g_st=ac",
    scene: "reception",
    artefact: "diya",
    note: "Come say hello, stay for dinner, and let the evening linger a little longer.",
    aside: "",
    rsvpLabel: "Reception"
  }
] as const;

const detailStops = [
  { id: "haldi", label: "KEEP SCROLLING" },
  { id: "wedding", label: "KEEP SCROLLING" },
  { id: "reception", label: "KEEP SCROLLING" },
  { id: "rsvp", label: "KEEP SCROLLING" }
] as const;

const hallColors = [
  "#2b0e12",
  "#3c2a09",
  "#4b1320",
  "#1b1838",
  "#2b0e12"
] as const;

type RsvpState = {
  guestNames: string;
  haldi: boolean;
  wedding: boolean;
  reception: boolean;
  travelNotes: string;
};

const initialRsvp: RsvpState = {
  guestNames: "",
  haldi: false,
  wedding: false,
  reception: false,
  travelNotes: ""
};

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="map-link-icon"
    >
      <path
        d="M11.5 3.5h5v5m-.5-4.5-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 10.5v4.25A1.75 1.75 0 0 1 13.75 16.5h-8A1.75 1.75 0 0 1 4 14.75v-8A1.75 1.75 0 0 1 5.75 5h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EventCard({
  event
}: {
  event: (typeof events)[number];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className="event-stop"
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-scene={event.scene}
      id={event.id}
    >
      {/* The wedding carries the strongest Telugu identity of the three, so it
          is the only ceremony that gets the muggu behind it. */}
      {event.scene === "wedding" ? (
        <MugguBackdrop className="event-muggu" />
      ) : null}

      <CelebrationArtefacts kind={event.artefact} seed={event.day.charCodeAt(1)} />

      <div className="event-portrait">
        <WeddingPortrait
          alt={`Rithwik and Kalyani at the ${event.scene}`}
          objectPosition="50% 6%"
          scene={event.scene}
          sizes="(max-width: 640px) 72vw, 240px"
          variant="oval"
          zoom={1.3}
        />
        {event.scene === "reception" ? (
          <span className="portrait-diya" aria-hidden="true">
            <DiyaSprite />
          </span>
        ) : null}
      </div>

      <div className="event-card">
        <FrameCorners />

        <div className="event-card-topline">
          <span className="event-number">{event.number}</span>
          <span className="event-telugu">{event.telugu}</span>
        </div>

        <h2 className="event-title">{event.title}</h2>
        <OrnamentDivider className="event-rule" />

        <div className="event-date-block">
          <span className="event-day">{event.day}</span>
          <span className="event-date-rest">
            <span className="event-month">{event.month}</span>
            <span className="event-year">{event.year}</span>
          </span>
        </div>
        <p className="event-when">
          {event.weekday} <span aria-hidden="true">·</span> {event.time}
        </p>

        <p className="event-note">{event.note}</p>

        {event.aside ? <p className="event-aside">{event.aside}</p> : null}

        <p className="event-place">{event.place}</p>

        <a
          className="map-link"
          href={event.map}
          target="_blank"
          rel="noreferrer"
        >
          Find us on the map <ExternalLinkIcon />
        </a>
      </div>
    </motion.article>
  );
}

function RSVPForm() {
  const [form, setForm] = useState<RsvpState>(initialRsvp);
  const [submitted, setSubmitted] = useState(false);
  const [logging, setLogging] = useState(false);
  const submitting = useRef(false);
  const reducedMotion = useReducedMotion();

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) {
      return;
    }

    submitting.current = true;
    setLogging(true);
    const payload: RsvpSubmission = {
      name: form.guestNames.trim(),
      attendingHaldi: form.haldi,
      attendingWedding: form.wedding,
      attendingReception: form.reception,
      travelNotes: form.travelNotes.trim(),
      timestamp: new Date().toISOString()
    };

    const message = [
      "Wedding RSVP for Rithwik & Kalyani",
      "",
      `Guest name(s): ${form.guestNames.trim()}`,
      `Rithwik's Haldi (Oct 28): ${form.haldi ? "Attending" : "Not attending"}`,
      `Wedding (Oct 29): ${form.wedding ? "Attending" : "Not attending"}`,
      `Reception (Oct 30): ${form.reception ? "Attending" : "Not attending"}`,
      `Travel arrival / notes: ${form.travelNotes.trim() || "None"}`
    ].join("\n");

    window.open(
      `https://wa.me/918179622114?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSubmitted(true);

    void logRsvpInBackground(payload).finally(() => {
      submitting.current = false;
      setLogging(false);
    });
  }

  function updateField<Key extends keyof RsvpState>(
    key: Key,
    value: RsvpState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <motion.section
      className="rsvp-section event-stop"
      id="rsvp"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="rsvp-heading"
    >
      <div className="mandapam">
        <div className="mandap-roof" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mandap-body">
          <FrameCorners />
          <div className="rsvp-heading-block">
            <span className="eyebrow">SAY YOU&apos;LL COME</span>
            <h2 id="rsvp-heading">Will you be there?</h2>
            <OrnamentDivider className="rsvp-rule" />
            <p>
              <span className="rsvp-telugu">మీ రాక కోసం ఎదురుచూస్తున్నాం</span>
              Tell us which celebrations you can join.
            </p>
          </div>

          <form onSubmit={submitRsvp}>
            <label className="text-field">
              <span>Guest name(s)</span>
              <input
                autoComplete="name"
                name="guestNames"
                onChange={(event) => updateField("guestNames", event.target.value)}
                placeholder="Name(s) of everyone attending"
                required
                value={form.guestNames}
              />
            </label>

            <fieldset className="attendance-fieldset">
              <legend>Mark the ones you&apos;ll be at</legend>
              {events.map((event) => (
                <label className="attendance-option" key={event.id}>
                  <input
                    checked={form[event.id]}
                    name={event.id}
                    onChange={(changeEvent) =>
                      updateField(event.id, changeEvent.target.checked)
                    }
                    type="checkbox"
                  />
                  <span className="custom-checkbox" aria-hidden="true" />
                  <span>
                    <strong>
                      {event.rsvpLabel} <i>{event.telugu}</i>
                    </strong>
                    <small>{event.date}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            <label className="text-field">
              <span>Travel arrival time / notes</span>
              <input
                name="travelNotes"
                onChange={(event) => updateField("travelNotes", event.target.value)}
                placeholder="Anything that will help us welcome you"
                value={form.travelNotes}
              />
            </label>

            <button className="whatsapp-button" disabled={logging} type="submit">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2a9.87 9.87 0 0 0-8.43 15l-1.32 4.82 4.94-1.3A9.95 9.95 0 1 0 12.04 2Zm0 18a8.04 8.04 0 0 1-4.1-1.12l-.29-.17-2.93.77.78-2.85-.19-.3A8.03 8.03 0 1 1 12.04 20Zm4.41-6.02c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.64-1.19-1.43-1.33-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.52.09.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
              {logging
                ? "Saving your reply…"
                : submitted
                  ? "Send another reply on WhatsApp"
                  : "Reply on WhatsApp"}
            </button>
            <AnimatePresence>
              {submitted && (
                <motion.p
                  aria-live="polite"
                  className="rsvp-success"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                >
                  Your RSVP message is ready in WhatsApp
                </motion.p>
              )}
            </AnimatePresence>
            <p className="form-footnote">
              Your reply opens in WhatsApp so you can send it when you&apos;re ready.
            </p>
          </form>
        </div>
      </div>
      <footer className="story-footer">
        <OrnamentDivider className="footer-rule" />
        <p>Stay late, dance badly, and make it a night we all remember.</p>
        <small>RITHWIK &amp; KALYANI &middot; OCTOBER 2026</small>
      </footer>
    </motion.section>
  );
}

function Story({ locked }: { locked: boolean }) {
  return (
    <main className="story" inert={locked}>
      <div className="story-grain" aria-hidden="true" />
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
      <RSVPForm />
    </main>
  );
}

export default function Home() {
  const [announced, setAnnounced] = useState(false);
  const [stopIndex, setStopIndex] = useState(-1);
  // The onward cue is only offered once the guest has settled on a section.
  const [scrolling, setScrolling] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const unlockStory = useCallback(() => setAnnounced(true), []);

  const nextStop = detailStops[stopIndex + 1];
  const hall = hallColors[stopIndex + 1] ?? hallColors[0];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    let settle = 0;
    const sectionIds = ["opening", ...detailStops.map((stop) => stop.id)];
    const syncStopToScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = scroller.getBoundingClientRect();
        const center = bounds.top + scroller.clientHeight / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        sectionIds.forEach((id, index) => {
          const section = document.getElementById(id);
          if (!section) return;
          const sectionBounds = section.getBoundingClientRect();
          const distance =
            center < sectionBounds.top
              ? sectionBounds.top - center
              : center > sectionBounds.bottom
                ? center - sectionBounds.bottom
                : 0;

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setStopIndex((current) =>
          current === closestIndex - 1 ? current : closestIndex - 1
        );
      });
    };

    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => setScrolling(false), 850);
      syncStopToScroll();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    syncStopToScroll();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, []);

  function scrollToStop(id: string) {
    const scroller = scrollerRef.current;
    const target = document.getElementById(id);
    if (!scroller || !target) return;
    const top =
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    scroller.scrollTo({
      top,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  function showNextDetails() {
    const upcoming = detailStops[stopIndex + 1];
    if (!upcoming) return;
    setStopIndex((current) => current + 1);
    window.requestAnimationFrame(() => scrollToStop(upcoming.id));
  }

  return (
    <div className="invitation" style={{ backgroundColor: hall }}>
      <div
        aria-label="Wedding invitation sections"
        className="invitation-scroller"
        data-locked={announced ? undefined : "true"}
        ref={scrollerRef}
        role="region"
        tabIndex={0}
      >
        <WeddingOpening onAnnouncement={unlockStory} />
        <Story locked={!announced} />
      </div>
      <AnimatePresence>
        {announced && nextStop && !scrolling && (
          <motion.button
            className="journey-next-button sticky-details"
            // Eases in a beat after the guest stops, and gets out of the way
            // quickly the moment they start moving again.
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0 : 0.6,
                delay: reducedMotion ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : 6,
              transition: { duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }
            }}
            onClick={showNextDetails}
            type="button"
          >
            <span className="journey-next-plaque">
              <span className="journey-next-text">{nextStop.label}</span>
              <span className="journey-next-chevron" aria-hidden="true">
                ↓
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
