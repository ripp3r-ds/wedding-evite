"use client";

import {
  FormEvent,
  useRef,
  useState
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { CoupleArtwork } from "./components/couple-artwork";
import { Countdown } from "./components/countdown";
import { logRsvpInBackground, type RsvpSubmission } from "../lib/rsvp";

const events = [
  {
    id: "haldi",
    number: "01",
    title: "Haldi Ceremony",
    date: "October 28",
    time: "5:00 PM",
    place: "Our Home, Khammam",
    map: "https://maps.app.goo.gl/tnUscYRzi9mA4BR2A?g_st=ac",
    scene: "haldi",
    note: "A little turmeric, lots of laughter, and the beginning of everything."
  },
  {
    id: "wedding",
    number: "02",
    title: "The Wedding",
    date: "October 29",
    time: "10:00 PM",
    place: "LB Nagar, Hyderabad",
    map: "https://maps.app.goo.gl/vrtDszsCvD4BAuDq8?g_st=ac",
    scene: "wedding",
    note: "Under the evening sky, two paths become one."
  },
  {
    id: "reception",
    number: "03",
    title: "Reception",
    date: "October 30",
    time: "7:00 PM",
    place: "Kalluru, Khammam",
    map: "https://maps.app.goo.gl/XMZRrdvo9hHRgTru7?g_st=ac",
    scene: "reception",
    note: "One more evening together, filled with music and home-cooked joy."
  }
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
      className="h-4 w-4"
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

function BrassLamp({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 110"
      fill="none"
      className={className}
    >
      <path
        d="M40 3c-7 9-8 16-3 22l3 3 3-3c5-6 4-13-3-22Z"
        fill="#F4BE55"
        className="lamp-flame"
      />
      <path
        d="M17 57c0 9 10 14 23 14s23-5 23-14H17Z"
        fill="#BD8136"
        stroke="#6A3C27"
        strokeWidth="2"
      />
      <path
        d="M12 57h56M22 72l6 7h24l6-7m-18 7v18m-13 0h26m-32 8h38"
        stroke="#8B5A30"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 51c0-10 9-18 20-18s20 8 20 18H20Z"
        fill="#DAA74C"
        stroke="#8B5A30"
        strokeWidth="2"
      />
      <circle cx="40" cy="51" r="3" fill="#F7D987" />
      <path
        d="M29 53c3 3 6 4 11 4s8-1 11-4"
        stroke="#F6D88A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MangoLeaves() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 82"
      fill="none"
      className="mango-garland"
    >
      <path
        d="M5 10c48 68 182 68 230 0"
        stroke="#8B6840"
        strokeWidth="2"
      />
      {[22, 48, 75, 103, 137, 165, 192, 218].map((x, index) => (
        <path
          key={x}
          d={`M${x} ${19 + Math.round(Math.sin(index) * 10)}c-10-7-9-16 1-18 8 8 6 14-1 18Zm2 1c9-7 18-6 18 4-8 7-15 5-18-4Z`}
          fill={index % 2 === 0 ? "#66744C" : "#7D8052"}
          stroke="#536340"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function EventCard({
  event,
  index
}: {
  event: (typeof events)[number];
  index: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className={`event-row ${index % 2 === 0 ? "event-row-odd" : "event-row-even"}`}
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
      id={event.id}
    >
      <motion.div
        className={`event-artwork event-artwork-${index % 2 === 0 ? "right" : "left"}`}
        initial={reducedMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: reducedMotion ? 0 : 0.9,
          delay: reducedMotion ? 0 : 0.12,
          ease: [0.22, 1, 0.36, 1]
        }}
        aria-hidden="true"
      >
        <CoupleArtwork
          alt={`${event.title} couple illustration`}
          className="event-artwork-image"
          scene={event.scene}
        />
      </motion.div>
      <span className="event-marker" aria-hidden="true">
        <span>{event.number}</span>
      </span>
      <div className="event-card">
        <div className="event-card-topline">
          <span>YOU ARE INVITED</span>
          <span className="event-date">{event.date}</span>
        </div>
        <h2>{event.title}</h2>
        <p className="event-note">{event.note}</p>
        <div className="event-details">
          <span className="event-time">{event.time}</span>
          <span aria-hidden="true" className="detail-divider">·</span>
          <span>{event.place}</span>
        </div>
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
      "Wedding RSVP — Rithwik & Kalyani",
      "",
      `Guest name(s): ${form.guestNames.trim()}`,
      `Haldi Ceremony (Oct 28): ${form.haldi ? "Attending" : "Not attending"}`,
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
      className="rsvp-section"
      id="rsvp"
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="rsvp-heading"
    >
      <div className="mandapam">
        <div className="mandap-roof" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mandap-body">
          <div className="rsvp-heading-block">
            <span className="eyebrow">SAVE A LITTLE PLACE FOR US</span>
            <h2 id="rsvp-heading">Will you be there?</h2>
            <p>It wouldn&apos;t be the same without you.</p>
          </div>

          <form onSubmit={submitRsvp}>
            <label className="text-field">
              <span>Guest name(s)</span>
              <input
                autoComplete="name"
                name="guestNames"
                onChange={(event) => updateField("guestNames", event.target.value)}
                placeholder="The whole family, if you like"
                required
                value={form.guestNames}
              />
            </label>

            <fieldset className="attendance-fieldset">
              <legend>Which celebrations can you join?</legend>
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
                    <strong>{event.title}</strong>
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
                  ✳ Your RSVP message is ready in WhatsApp ✳
                </motion.p>
              )}
            </AnimatePresence>
            <p className="form-footnote">
              All food is vegetarian. Your reply opens in WhatsApp so you can send it when you&apos;re ready.
            </p>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

function Story() {
  const timelineRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.46, 0.74, 1],
    ["#77805d", "#672e38", "#c39a43", "#c69250"]
  );
  return (
    <motion.main className="story" ref={timelineRef} style={{ backgroundColor }}>
      <div className="story-grain" aria-hidden="true" />
      <div className="story-intro">
        <span className="eyebrow">FROM OUR LITTLE CORNER OF THE WORLD</span>
        <p>
          With full hearts and our families by our side,
          <br className="desktop-break" /> we invite you to celebrate
        </p>
        <h1>Rithwik <span>&amp;</span> Kalyani</h1>
        <div className="intro-rule"><span>✳</span></div>
        <p className="intro-caption">Three days. One village. A lifetime together.</p>
        <Countdown />
      </div>

      <div className="timeline">
        <div className="thread-line" aria-hidden="true">
          <motion.span className="thread-red" style={{ scaleY: scrollYProgress }} />
        </div>
        <div className="event-list">
          {events.map((event, index) => (
            <EventCard event={event} index={index} key={event.id} />
          ))}
        </div>
        <RSVPForm />
      </div>

      <footer className="story-footer">
        <span aria-hidden="true">❋</span>
        <p>Until then, keep a little light in your window.</p>
        <small>WITH LOVE, RITHWIK &amp; KALYANI</small>
      </footer>
    </motion.main>
  );
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [opening, setOpening] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="invitation">
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.section
            key="welcome"
            className="welcome-screen"
            initial={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: reducedMotion ? 1 : 1.025,
              y: reducedMotion ? 0 : -12
            }}
            transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            animate={{ opacity: 1 }}
            aria-label="Welcome"
          >
            <div className="welcome-grain" aria-hidden="true" />
            <MangoLeaves />
            <div className="welcome-landscape" aria-hidden="true">
              <div className="hill hill-back" />
              <div className="hill hill-front" />
              <div className="village-home"><span /><span /><span /></div>
              <div className="welcome-fireflies">✦ <span>✧</span> ✦</div>
            </div>
            <BrassLamp className="brass-lamp lamp-left" />
            <BrassLamp className="brass-lamp lamp-right" />
            <div className={`welcome-copy${opening ? " is-opening" : ""}`}>
              <span className="eyebrow">A LITTLE WEDDING INVITATION</span>
              <motion.div
                className="invitation-card"
                animate={{
                  rotateY: opening && !reducedMotion ? -8 : 0,
                  scale: opening && !reducedMotion ? 1.025 : 1
                }}
                onAnimationComplete={() => {
                  if (opening) {
                    setEntered(true);
                  }
                }}
                transition={{
                  duration: reducedMotion ? 0 : 1.35,
                  delay: opening && !reducedMotion ? 0.2 : 0,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="invitation-card-inner">
                  <span className="invitation-card-topline">WITH LOVE, WE INVITE YOU</span>
                  <CoupleArtwork
                    alt="Rithwik and Kalyani"
                    className="opening-artwork"
                    imageClassName="opening-artwork-image"
                    reveal={opening}
                    scene="opening"
                  />
                  <h1>Rithwik <span>&amp;</span> Kalyani</h1>
                  <span className="welcome-divider">✳</span>
                  <p>Our village is waiting for you</p>
                  <span className="welcome-date">OCTOBER 28 — 30, 2026</span>
                </div>
                <motion.div
                  className="invitation-envelope-flap"
                  animate={{ rotateX: opening && !reducedMotion ? -155 : 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 1.05,
                    delay: opening && !reducedMotion ? 0.12 : 0,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  aria-hidden="true"
                />
                <div className="invitation-card-border" aria-hidden="true" />
              </motion.div>
              <button
                className="enter-prompt"
                disabled={opening}
                onClick={() => setOpening(true)}
                type="button"
              >
                <span aria-hidden="true">{opening ? "✳" : "↓"}</span>
                {opening ? "Opening your invitation…" : "Tap to open"}
              </button>
            </div>
            <span className="welcome-corner corner-left" aria-hidden="true">❋</span>
            <span className="welcome-corner corner-right" aria-hidden="true">❋</span>
          </motion.section>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.1 }}
          >
            <Story />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
