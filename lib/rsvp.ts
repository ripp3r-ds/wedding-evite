export type RsvpSubmission = {
  name: string;
  attendingHaldi: boolean;
  attendingWedding: boolean;
  attendingReception: boolean;
  declined: boolean;
  travelNotes: string;
  timestamp: string;
};

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();

export async function logRsvpInBackground(
  submission: RsvpSubmission
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    return;
  }

  const body = JSON.stringify(submission);
  if (
    typeof navigator !== "undefined" &&
    "sendBeacon" in navigator &&
    navigator.sendBeacon(GOOGLE_SCRIPT_URL, body)
  ) {
    return;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body,
      keepalive: true
    });
  } catch (error) {
    console.error("Unable to log RSVP to Google Sheets.", error);
  }
}
