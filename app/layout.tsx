import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import {
  Cinzel,
  Cinzel_Decorative,
  Cormorant_Garamond,
  Noto_Serif_Telugu
} from "next/font/google";
import "./globals.css";

const script = localFont({
  src: "./fonts/Tangerine-Regular.ttf",
  display: "swap",
  variable: "--font-script",
  weight: "400"
});

const display = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-display"
});

const label = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-label"
});

const body = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body"
});

const telugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  display: "swap",
  variable: "--font-telugu"
});

// Absolute URLs are required for the WhatsApp/OG link preview image. Set
// NEXT_PUBLIC_SITE_URL to the deployed origin so the portrait resolves.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rithwikandkalyani.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rithwik & Kalyani are getting married",
  description:
    "29 October 2026, Hyderabad. Open the invitation for the haldi, the wedding and the reception, and tell us you're coming.",
  openGraph: {
    title: "Rithwik & Kalyani are getting married",
    description:
      "29 October 2026, Hyderabad. Open the invitation and tell us you're coming.",
    type: "website",
    images: [
      {
        url: "/images/couple/opening.png",
        width: 848,
        height: 1264,
        alt: "Rithwik and Kalyani"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2b0e12"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${script.variable} ${display.variable} ${label.variable} ${body.variable} ${telugu.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
