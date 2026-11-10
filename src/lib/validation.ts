/**
 * Shared validation rules for the contact and booking forms (Zod v4).
 */
import { z } from "zod";

/** Digits, spaces, +, -, (, ) with 8–15 digits in total (Indian and international numbers). */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^[+\d\s()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
}

export const PHONE_ERROR = "Please enter a valid phone number, e.g. +91 98765 43210.";

export const nameField = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(80, "Please keep your name under 80 characters.");
