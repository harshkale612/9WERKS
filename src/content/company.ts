/**
 * 9WERKS — company story, principles and customer journey.
 * All wording is preserved from the official site / brief (lightly edited for
 * flow, never extended with new claims). See BUSINESS_CONTENT.md.
 */
import type { PhotoId } from "./photos";

/** "9WERKS is a crew of certified technicians in Aundh, Pune, dedicated to keeping vehicles in peak condition." */
export const companyIntro =
  "9WERKS is a crew of certified technicians in Aundh, Pune, dedicated to keeping vehicles in peak condition.";

export const story = [
  "At 9WERKS, we are dedicated to providing exceptional automotive care tailored to the unique needs of your vehicle. Whether it's routine maintenance, advanced diagnostics or a complex repair, we have the expertise and technology to deliver top-quality results every time.",
  "Our team of certified professionals combines years of experience with state-of-the-art tools to make sure your car receives the best possible care. From oil changes to engine diagnostics, brake services and beyond, we stand for reliability, efficiency and customer satisfaction.",
  "Trust 9WERKS to keep your vehicle in peak condition. We aim to exceed expectations, so every drive is safe, smooth and worry-free.",
] as const;

/** Short philosophy line from the official homepage. */
export const philosophy =
  "Performance and luxury cars need more than a general garage. We're dedicated to care tailored to your car — from a routine check to advanced diagnostics or a complex repair.";

export interface Pillar {
  index: string;
  title: string;
  body: string;
  photo: PhotoId;
}

/** The three things 9WERKS never compromises on (official site). */
export const pillars: Pillar[] = [
  {
    index: "01",
    title: "Quality servicing",
    body: "Strict quality standards, premium-grade parts and materials, and advanced techniques that keep your car running smoothly and reliably.",
    photo: "z4-bay",
  },
  {
    index: "02",
    title: "Expert crew",
    body: "Highly skilled, certified technicians with years in the automotive industry — from routine maintenance to complex repairs, handled with precision.",
    photo: "crew",
  },
  {
    index: "03",
    title: "Modern equipment",
    body: "State-of-the-art equipment and diagnostic tools for efficient, accurate work. We stay current with the technology in today's cars.",
    photo: "m5-lift",
  },
];

/** Trust points (official site). "Award-winning" is omitted: no award is named or verifiable — see BUSINESS_CONTENT.md. */
export const trustPoints = [
  { index: "01", title: "Professional & expert", body: "Certified technicians who deliver reliable, high-quality service for your vehicle." },
  { index: "02", title: "Quality servicing centre", body: "Top-notch vehicle care with advanced tools and certified professionals." },
  { index: "03", title: "Committed to every job", body: "Safety, reliability and customer satisfaction on every car that comes through our doors." },
] as const;

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

/** The four-step customer journey (official site). */
export const processSteps: ProcessStep[] = [
  { index: "01", title: "Book", body: "Send a request online, on WhatsApp, or just call us. Pick a day that suits you." },
  { index: "02", title: "Inspect", body: "We check your car, find what it needs and walk you through it." },
  { index: "03", title: "Service", body: "Our crew gets to work with quality parts and the right equipment." },
  { index: "04", title: "Drive away", body: "Pick up your car, checked and ready for the road." },
];
