"use client";

/**
 * Ends the brand intro: early on any key / click / the Skip button, otherwise
 * when the CSS sequence completes. Removing `intro-play` makes the overlay
 * disappear and stops it from ever replaying on soft navigations.
 */
import { useEffect } from "react";

const DURATION = 2700;

export function BrandIntroController() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro-play")) return;
    const finish = () => {
      html.classList.remove("intro-play");
      html.classList.add("intro-done");
      cleanup();
    };
    const timer = window.setTimeout(finish, DURATION);
    const onKey = () => finish();
    const onPointer = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(".brand-intro, .brand-intro__skip")) finish();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    function cleanup() {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    }
    return cleanup;
  }, []);

  return (
    <button
      type="button"
      className="brand-intro__skip label fixed bottom-6 right-6 z-[81] min-h-11 items-center gap-2 border border-line-strong bg-ink-950 px-4 text-fg-muted transition-colors hover:text-fg"
      onClick={() => {
        document.documentElement.classList.remove("intro-play");
        document.documentElement.classList.add("intro-done");
      }}
    >
      Skip intro
    </button>
  );
}
