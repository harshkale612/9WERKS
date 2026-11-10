"use client";

import { useEffect, useRef } from "react";

/** Build-time year, corrected in the DOM on the client so the static export never shows a stale year. */
export function CurrentYear() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = String(new Date().getFullYear());
  }, []);
  return (
    <span ref={ref} suppressHydrationWarning>
      {new Date().getFullYear()}
    </span>
  );
}
