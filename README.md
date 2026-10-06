# Rithwik & Kalyani Wedding Invitation

## Run locally

```bash
npm install
npm run dev
```

The invitation uses a button-led opening: open the sealed card, scratch to uncover the couple's names and wedding date, continue to the countdown, then press **Scroll for details** to reach the celebration timeline.

## Update the couple's portraits

Replace the supplied PNGs in `public/images/couple/`:

- `opening.png`
- `haldi.png`
- `wedding.png`
- `reception.png`

The shared [`WeddingPortrait`](./app/components/wedding-portrait.tsx) component maps each scene to its image and crops it inside a gold portrait medallion. The opening portrait is preloaded; ceremony portraits are lazy-loaded.

## Optional Google Sheets RSVP logging

The invitation already opens the pre-filled WhatsApp reply. Google Sheets logging is skipped until a Google Apps Script web app URL is configured.

1. Create a Google Sheet and copy its ID from the URL (the part between `/d/` and `/edit`).
2. Open **Extensions → Apps Script** and paste in [`scripts/google-apps-script.gs`](./scripts/google-apps-script.gs). Replace `YOUR_SPREADSHEET_ID` with the ID you copied.
3. Deploy the script as a **Web app**, execute it as yourself, allow access to anyone with the link, and copy its deployment URL.
4. Put `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec` in `.env.local` (or `.env`) and restart the Next.js app.

When configured, the RSVP JSON is sent in a background `no-cors` POST; WhatsApp remains the guest's visible confirmation step.

The RSVP payload keys match the Apps Script handler: `name`, `attendingHaldi`, `attendingWedding`, `attendingReception`, `travelNotes`, and `timestamp`. If you change the Apps Script code, update the existing web app deployment to a new version before testing new submissions.

## Wedding countdown

The countdown targets **29 October 2026 at 10:30 PM India Standard Time**.
