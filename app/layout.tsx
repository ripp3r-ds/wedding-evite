import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const calligraphy = localFont({
  src: "./fonts/Tangerine-Regular.ttf",
  display: "swap",
  variable: "--font-calligraphy",
  weight: "400"
});

export const metadata: Metadata = {
  title: "Rithwik & Kalyani — Wedding Invitation",
  description:
    "Join Rithwik and Kalyani's families for three days of Telugu wedding celebrations in October 2026."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={calligraphy.variable}>{children}</body>
    </html>
  );
}
