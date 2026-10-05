export type RsvpSubmission = {
  name: string;
  attendingHaldi: boolean;
  attendingWedding: boolean;
  attendingReception: boolean;
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

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(submission)
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Unable to log RSVP to Google Sheets.", error);
    }
  }
}
