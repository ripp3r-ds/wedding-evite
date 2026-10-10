export type InvitationCalendarEvent = {
  id: string;
  title: string;
  description: string;
  startUtc: string;
  endUtc: string;
  location: string;
  url: string;
};

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldCalendarLine(line: string) {
  const segments = line.match(/.{1,73}/g);
  return segments?.join("\r\n ") ?? line;
}

function calendarTimestamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function buildInvitationCalendar(events: readonly InvitationCalendarEvent[]) {
  if (events.length === 0) {
    throw new Error("At least one celebration is required to build a calendar.");
  }

  const stamp = calendarTimestamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rithwik and Kalyani//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Rithwik & Kalyani Wedding",
    "X-WR-TIMEZONE:Asia/Kolkata"
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}-2026@rithwikandkalyani.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${event.startUtc}`,
      `DTEND:${event.endUtc}`,
      `SUMMARY:${escapeCalendarText(event.title)}`,
      `DESCRIPTION:${escapeCalendarText(event.description)}`,
      `LOCATION:${escapeCalendarText(event.location)}`,
      `URL:${event.url}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldCalendarLine).join("\r\n")}\r\n`;
}

export function downloadInvitationCalendar(
  events: readonly InvitationCalendarEvent[],
  filename: string
) {
  const contents = buildInvitationCalendar(events);
  const blob = new Blob([contents], { type: "text/calendar;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
