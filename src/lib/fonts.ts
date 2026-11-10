/**
 * 9WERKS typography — three voices (see DESIGN_SYSTEM.md → Typography):
 *  - Mona Sans (variable, wdth 75–125): the engineered voice. Expanded width for
 *    display, normal width for body copy.
 *  - Bodoni Moda Italic (variable, opsz): the editorial accent, a few words at a time.
 *  - DM Mono: the technical voice — indices, labels, captions, spec rows.
 * All self-hosted at build time by next/font (no runtime requests to Google).
 */
import { Bodoni_Moda, DM_Mono, Mona_Sans } from "next/font/google";

export const fontSans = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-mona",
});

export const fontAccent = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});

export const fontMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

export const fontVariables = `${fontSans.variable} ${fontAccent.variable} ${fontMono.variable}`;
