"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion
} from "framer-motion";
import { WeddingOpening } from "./components/wedding-opening";
import { WeddingPortrait } from "./components/wedding-portrait";
import { MusicToggle, requestMusicStart } from "./components/music-toggle";
import { CelebrationArtefacts, DiyaSprite } from "./components/celebration-artefacts";
import {
  FrameCorners,
  MugguBackdrop,
  OrnamentDivider
} from "./components/royal-ornaments";
import {
  downloadInvitationCalendar,
  type InvitationCalendarEvent
} from "../lib/calendar";
import { logRsvpInBackground, type RsvpSubmission } from "../lib/rsvp";
import {
  readSessionValue,
  removeSessionValue,
  writeSessionValue
} from "../lib/session-storage";
import { CELEBRATIONS_END } from "../lib/wedding-time";

const PROGRESS_KEY = "wedding-invitation:progress";
const LAST_STOP_KEY = "wedding-invitation:last-stop";
const RSVP_DRAFT_KEY = "wedding-invitation:rsvp-draft";

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
    dateTime: "2026-10-28T17:00:00+05:30",
    startUtc: "20261028T113000Z",
    endUtc: "20261028T143000Z",
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
    dateTime: "2026-10-29T22:30:00+05:30",
    startUtc: "20261029T170000Z",
    endUtc: "20261029T210000Z",
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
    dateTime: "2026-10-30T19:00:00+05:30",
    startUtc: "20261030T133000Z",
    endUtc: "20261030T163000Z",
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
  { id: "haldi", label: "NEXT: HALDI" },
  { id: "wedding", label: "NEXT: WEDDING" },
  { id: "reception", label: "NEXT: RECEPTION" },
  { id: "rsvp", label: "CONTINUE TO RSVP" }
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
  declining: boolean;
  travelNotes: string;
};

const initialRsvp: RsvpState = {
  guestNames: "",
  haldi: false,
  wedding: false,
  reception: false,
  declining: false,
  travelNotes: ""
};

function isRsvpState(value: unknown): value is RsvpState {
  return (
    typeof value === "object" &&
    value !== null &&
    "guestNames" in value &&
    typeof value.guestNames === "string" &&
    "haldi" in value &&
    typeof value.haldi === "boolean" &&
    "wedding" in value &&
    typeof value.wedding === "boolean" &&
    "reception" in value &&
    typeof value.reception === "boolean" &&
    "declining" in value &&
    typeof value.declining === "boolean" &&
    "travelNotes" in value &&
    typeof value.travelNotes === "string"
  );
}

function normalizeGuestName(value: string | null) {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}

function calendarEvent(
  event: (typeof events)[number]
): InvitationCalendarEvent {
  return {
    id: event.id,
    title: `Rithwik & Kalyani | ${event.rsvpLabel}`,
    description: `${event.note}\nTime shown in India Standard Time.`,
    startUtc: event.startUtc,
    endUtc: event.endUtc,
    location: event.place,
    url: event.map
  };
}

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

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="calendar-link-icon"
      fill="none"
      viewBox="0 0 20 20"
    >
      <rect
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
        width="14"
        x="3"
        y="4"
      />
      <path
        d="M6.5 2.8v3M13.5 2.8v3M3.5 8h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path d="M7 11h2v2H7zM11 11h2v2h-2z" fill="currentColor" />
    </svg>
  );
}

function EventCard({
  event
}: {
  event: (typeof events)[number];
}) {
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { amount: 0.15, margin: "5% 0px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className="event-stop"
      data-active={inView ? "true" : "false"}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-scene={event.scene}
      id={event.id}
      ref={cardRef}
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
          <span className="event-telugu" lang="te">{event.telugu}</span>
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
        <time className="event-when" dateTime={event.dateTime}>
          {event.weekday} <span aria-hidden="true">·</span> {event.time}
        </time>

        <p className="event-note">{event.note}</p>

        {event.aside ? <p className="event-aside">{event.aside}</p> : null}

        <p className="event-place">{event.place}</p>

        <div className="event-actions">
          <a
            className="map-link"
            href={event.map}
            target="_blank"
            rel="noreferrer"
          >
            Find us on the map <ExternalLinkIcon />
          </a>
          <button
            className="calendar-link"
            onClick={() =>
              downloadInvitationCalendar(
                [calendarEvent(event)],
                `rithwik-kalyani-${event.id}.ics`
              )
            }
            type="button"
          >
            Add to calendar <CalendarIcon />
          </button>
        </div>
        <span
          aria-hidden="true"
          className="event-end-marker"
          data-journey-end={event.id}
        />
      </div>
    </motion.article>
  );
}

function RSVPForm({
  onReplay,
  prefillName
}: {
  onReplay: () => void;
  prefillName: string;
}) {
  const [form, setForm] = useState<RsvpState>(initialRsvp);
  const [submitted, setSubmitted] = useState(false);
  const [logging, setLogging] = useState(false);
  const [launchFailed, setLaunchFailed] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [responseError, setResponseError] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [closed, setClosed] = useState(false);
  const submitting = useRef(false);
  const draftRestored = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setClosed(Date.now() >= CELEBRATIONS_END);
  }, []);

  useEffect(() => {
    if (draftRestored.current) return;
    draftRestored.current = true;

    const savedDraft = readSessionValue(RSVP_DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft: unknown = JSON.parse(savedDraft);
        if (isRsvpState(parsedDraft)) {
          setForm({
            ...parsedDraft,
            guestNames: parsedDraft.guestNames || prefillName
          });
        } else {
          console.error("The saved RSVP draft had an unexpected shape.");
          removeSessionValue(RSVP_DRAFT_KEY);
        }
      } catch (error) {
        console.error("Unable to restore the RSVP draft.", error);
        removeSessionValue(RSVP_DRAFT_KEY);
      }
    } else if (prefillName) {
      setForm((current) => ({ ...current, guestNames: prefillName }));
    }

    setDraftReady(true);
  }, [prefillName]);

  useEffect(() => {
    if (draftReady) {
      writeSessionValue(RSVP_DRAFT_KEY, JSON.stringify(form));
    }
  }, [draftReady, form]);

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) {
      return;
    }

    const attending = form.haldi || form.wedding || form.reception;
    if (!attending && !form.declining) {
      setResponseError("Choose a celebration, or let us know you cannot make it.");
      return;
    }

    setResponseError("");
    submitting.current = true;
    setLogging(true);
    const payload: RsvpSubmission = {
      name: form.guestNames.trim(),
      attendingHaldi: form.haldi,
      attendingWedding: form.wedding,
      attendingReception: form.reception,
      declined: form.declining,
      travelNotes: form.travelNotes.trim(),
      timestamp: new Date().toISOString()
    };

    const attendanceLines = form.declining
      ? ["Attendance: Sadly, we can't make it"]
      : [
          `Rithwik's Haldi (Oct 28): ${form.haldi ? "Attending" : "Not attending"}`,
          `Wedding (Oct 29): ${form.wedding ? "Attending" : "Not attending"}`,
          `Reception (Oct 30): ${form.reception ? "Attending" : "Not attending"}`
        ];
    const message = [
      "Wedding RSVP for Rithwik & Kalyani",
      "",
      `Guest name(s): ${form.guestNames.trim()}`,
      ...attendanceLines,
      `Travel arrival / notes: ${form.travelNotes.trim() || "None"}`
    ].join("\n");

    const url = `https://wa.me/918179622114?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open("", "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.location.href = url;
      setLaunchFailed(false);
      setWhatsappUrl("");
    } else {
      setLaunchFailed(true);
      setWhatsappUrl(url);
    }
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
    setResponseError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateAttendance(
    key: (typeof events)[number]["id"],
    attending: boolean
  ) {
    setResponseError("");
    setForm((current) => ({
      ...current,
      [key]: attending,
      declining: attending ? false : current.declining
    }));
  }

  function updateDeclining(declining: boolean) {
    setResponseError("");
    setForm((current) => ({
      ...current,
      declining,
      haldi: declining ? false : current.haldi,
      wedding: declining ? false : current.wedding,
      reception: declining ? false : current.reception
    }));
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
            <span className="eyebrow">
              {closed ? "WITH LOVE AND GRATITUDE" : "SAY YOU'LL COME"}
            </span>
            <h2 id="rsvp-heading">{closed ? "Thank you" : "Will you be there?"}</h2>
            <OrnamentDivider className="rsvp-rule" />
            <p>
              <span className="rsvp-telugu" lang="te">మీ రాక కోసం ఎదురుచూస్తున్నాం</span>
              {closed
                ? "Thank you for being part of the celebrations."
                : "Tell us which celebrations you can join."}
            </p>
          </div>

          {closed ? (
            <div className="rsvp-closed">
              <p>Rithwik and Kalyani are so grateful you celebrated with them.</p>
            </div>
          ) : (
            <>
              <button
                className="itinerary-button"
                onClick={() =>
                  downloadInvitationCalendar(
                    events.map(calendarEvent),
                    "rithwik-kalyani-all-celebrations.ics"
                  )
                }
                type="button"
              >
                <CalendarIcon /> Save all celebrations
              </button>

              <form onSubmit={submitRsvp}>
                <label className="text-field">
                  <span>Guest name(s)</span>
                  <input
                    autoComplete="name"
                    name="guestNames"
                    onChange={(event) => updateField("guestNames", event.target.value)}
                    placeholder="Name(s) of everyone replying"
                    required
                    value={form.guestNames}
                  />
                </label>

                <fieldset className="attendance-fieldset">
                  <legend>Choose what works for you</legend>
                  {events.map((event) => (
                    <label className="attendance-option" key={event.id}>
                      <input
                        checked={form[event.id]}
                        name={event.id}
                        onChange={(changeEvent) =>
                          updateAttendance(event.id, changeEvent.target.checked)
                        }
                        type="checkbox"
                      />
                      <span className="custom-checkbox" aria-hidden="true" />
                      <span>
                        <strong>
                          {event.rsvpLabel} <i lang="te">{event.telugu}</i>
                        </strong>
                        <small>{event.date}</small>
                      </span>
                    </label>
                  ))}
                  <label className="attendance-option decline-option">
                    <input
                      checked={form.declining}
                      name="declining"
                      onChange={(event) => updateDeclining(event.target.checked)}
                      type="checkbox"
                    />
                    <span className="custom-checkbox" aria-hidden="true" />
                    <span>
                      <strong>Sadly, we can&apos;t make it</strong>
                      <small>Send Rithwik and Kalyani your love</small>
                    </span>
                  </label>
                </fieldset>

                {responseError ? (
                  <p className="form-error" role="alert">{responseError}</p>
                ) : null}

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
                    ? "Preparing your reply…"
                    : submitted
                      ? "Open WhatsApp again"
                      : "Continue in WhatsApp"}
                </button>
                <AnimatePresence>
                  {submitted && !launchFailed ? (
                    <motion.p
                      aria-live="polite"
                      className="rsvp-success"
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                      transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    >
                      Your reply is ready. Tap Send in WhatsApp to confirm.
                    </motion.p>
                  ) : null}
                </AnimatePresence>
                {launchFailed && whatsappUrl ? (
                  <p className="whatsapp-fallback" role="alert">
                    WhatsApp did not open.{" "}
                    <a href={whatsappUrl} rel="noreferrer" target="_blank">
                      Open WhatsApp
                    </a>
                  </p>
                ) : null}
                <p className="form-footnote">
                  Nothing is sent until you tap Send in WhatsApp.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      <footer className="story-footer">
        <OrnamentDivider className="footer-rule" />
        <p>
          {closed
            ? "Rithwik and Kalyani are grateful you were part of their celebration."
            : "Stay late, dance badly, and make it a night we all remember."}
        </p>
        <small>RITHWIK &amp; KALYANI &middot; OCTOBER 2026</small>
        <button className="replay-button" onClick={onReplay} type="button">
          Replay invitation
        </button>
      </footer>
    </motion.section>
  );
}

function Story({
  onReplay,
  prefillName
}: {
  onReplay: () => void;
  prefillName: string;
}) {
  return (
    <main className="story">
      <div className="story-grain" aria-hidden="true" />
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
      <RSVPForm onReplay={onReplay} prefillName={prefillName} />
    </main>
  );
}

export default function Home() {
  const [announced, setAnnounced] = useState(false);
  const [openingReady, setOpeningReady] = useState(false);
  const [resumeRevealed, setResumeRevealed] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [stopIndex, setStopIndex] = useState(-1);
  const [scrolling, setScrolling] = useState(false);
  const [seenSectionEnds, setSeenSectionEnds] = useState<Set<string>>(
    () => new Set()
  );
  const [resumeStop, setResumeStop] = useState<string | null | undefined>(
    undefined
  );
  const [openingKey, setOpeningKey] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const unlockStory = useCallback(() => {
    setAnnounced(true);
    writeSessionValue(PROGRESS_KEY, "revealed");
  }, []);
  const markOpeningReady = useCallback(() => setOpeningReady(true), []);
  const startMusic = useCallback(() => requestMusicStart(), []);

  const nextStop = detailStops[stopIndex + 1];
  const hall = hallColors[stopIndex + 1] ?? hallColors[0];
  const currentStop = stopIndex >= 0 ? detailStops[stopIndex] : undefined;
  const cueReady =
    stopIndex < 0
      ? openingReady
      : currentStop !== undefined && seenSectionEnds.has(currentStop.id);
  const progressIndex = Math.min(
    detailStops.length - 1,
    Math.max(0, stopIndex + 1)
  );

  const scrollToStop = useCallback(
    (id: string, behavior?: ScrollBehavior) => {
      const scroller = scrollerRef.current;
      const target = document.getElementById(id);
      if (!scroller || !target) return;
      const top =
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop;
      scroller.scrollTo({
        top,
        behavior: behavior ?? (reducedMotion ? "auto" : "smooth")
      });
    },
    [reducedMotion]
  );

  useEffect(() => {
    const personalizedName = normalizeGuestName(
      new URLSearchParams(window.location.search).get("guest")
    );
    setGuestName(personalizedName);

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "reload") {
      removeSessionValue(PROGRESS_KEY);
      removeSessionValue(LAST_STOP_KEY);
      setResumeStop(null);
      return;
    }

    const revealed = readSessionValue(PROGRESS_KEY) === "revealed";
    const savedStop = readSessionValue(LAST_STOP_KEY);
    const validStop =
      savedStop === "opening" ||
      detailStops.some((stop) => stop.id === savedStop);

    if (revealed) {
      setResumeRevealed(true);
      setAnnounced(true);
      setResumeStop(validStop ? savedStop : "opening");
    } else {
      setResumeStop(null);
    }
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !announced) return;

    let settle = 0;
    const sectionIds = ["opening", ...detailStops.map((stop) => stop.id)];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    // Which section the guest is on is tracked by the browser rather than by
    // measuring on every scroll event. The old listener called
    // getBoundingClientRect on each section inside a rAF, which forced a
    // layout several times a frame while dragging: a real cost on a phone and
    // part of why scrolling felt like it was catching.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = sectionIds[0];
        let bestRatio = -1;
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        const nextIndex = sectionIds.indexOf(bestId) - 1;
        setStopIndex((current) => (current === nextIndex ? current : nextIndex));
      },
      {
        root: scroller,
        // Enough steps to tell which section owns most of the viewport without
        // firing on every pixel.
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach((section) => observer.observe(section));

    const endObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.journeyEnd;
          if (!id) continue;
          setSeenSectionEnds((current) => {
            if (current.has(id)) return current;
            const next = new Set(current);
            next.add(id);
            return next;
          });
        }
      },
      {
        root: scroller,
        rootMargin: "0px 0px -72px 0px",
        threshold: 0.99
      }
    );
    document
      .querySelectorAll<HTMLElement>("[data-journey-end]")
      .forEach((marker) => endObserver.observe(marker));

    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => setScrolling(false), 850);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      endObserver.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
    };
  }, [announced]);

  useEffect(() => {
    if (!announced || resumeStop === undefined) return;
    if (resumeStop === null || resumeStop === "opening") {
      setResumeStop(null);
      return;
    }

    let restored = 0;
    const frame = window.requestAnimationFrame(() => {
      scrollToStop(resumeStop, "auto");
      restored = window.setTimeout(() => setResumeStop(null), 350);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(restored);
    };
  }, [announced, resumeStop, scrollToStop]);

  useEffect(() => {
    if (!announced || resumeStop !== null) return;
    const stop = stopIndex >= 0 ? detailStops[stopIndex]?.id : "opening";
    if (stop) writeSessionValue(LAST_STOP_KEY, stop);
  }, [announced, resumeStop, stopIndex]);

  function showNextDetails() {
    const upcoming = detailStops[stopIndex + 1];
    if (!upcoming) return;
    setStopIndex((current) => current + 1);
    window.requestAnimationFrame(() => scrollToStop(upcoming.id));
  }

  function replayInvitation() {
    const scroller = scrollerRef.current;
    scroller?.scrollTo({ top: 0, behavior: "auto" });
    removeSessionValue(PROGRESS_KEY);
    removeSessionValue(LAST_STOP_KEY);
    setAnnounced(false);
    setOpeningReady(false);
    setResumeRevealed(false);
    setResumeStop(null);
    setStopIndex(-1);
    setScrolling(false);
    setSeenSectionEnds(new Set());
    setOpeningKey((current) => current + 1);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(".wax-seal")?.focus();
      });
    });
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
        <WeddingOpening
          guestName={guestName}
          key={openingKey}
          onAnnouncement={unlockStory}
          onInvitationOpen={startMusic}
          onJourneyReady={markOpeningReady}
          resumeRevealed={resumeRevealed}
        />
        {announced ? (
          <Story onReplay={replayInvitation} prefillName={guestName} />
        ) : null}
      </div>
      <AnimatePresence>
        {announced &&
          resumeStop === null &&
          nextStop &&
          cueReady &&
          !scrolling && (
          <motion.button
            aria-label={`Go to ${nextStop.id === "rsvp" ? "RSVP" : nextStop.id}`}
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
            <span className="journey-progress" aria-hidden="true">
              {detailStops.map((stop, index) => (
                <i
                  data-state={
                    index < progressIndex
                      ? "complete"
                      : index === progressIndex
                        ? "current"
                        : undefined
                  }
                  key={stop.id}
                />
              ))}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <MusicToggle />
    </div>
  );
}
