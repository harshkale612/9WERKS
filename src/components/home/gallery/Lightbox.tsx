"use client";

/**
 * Accessible lightbox: modal dialog in a portal on <body>, focus moved in and
 * trapped, Escape closes, ←/→ navigate, focus returns to the opener, page
 * scroll paused (Lenis + overflow) while open.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { useLenis } from "@/components/motion/MotionProvider";
import type { GalleryItem } from "./GalleryGrid";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

const btn =
  "inline-flex size-12 items-center justify-center border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent-text";

export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const item = items[index];
  const count = items.length;

  // Open/close side effects: scroll lock, initial focus, focus return.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    lenis.stop();
    html.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      lenis.start();
      html.style.overflow = "";
      opener?.focus?.();
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        onIndexChange((index + 1) % count);
      } else if (e.key === "ArrowLeft") {
        onIndexChange((index - 1 + count) % count);
      } else if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button"));
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onIndexChange]);

  if (!item) return null;

  return createPortal(
    <m.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}: ${item.caption}`}
      className="theme-studio fixed inset-0 z-[95] flex flex-col !bg-ink-950/96"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      data-lenis-prevent=""
    >
      <div className="container-x flex h-20 shrink-0 items-center justify-between">
        <p className="label tabular text-fg-muted" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button type="button" onClick={onClose} className={btn} aria-label="Close photo viewer" data-autofocus="">
          <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <m.div key={item.id} className="relative mx-auto h-full max-w-6xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <Photo id={item.id} fill sizes="100vw" alt={item.alt} imgClassName="!object-contain" grade={false} />
        </m.div>
      </div>

      <div className="container-x flex shrink-0 items-center justify-between gap-6 py-6">
        <p className="label text-fg">{item.caption}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onIndexChange((index - 1 + count) % count)} className={btn} aria-label="Previous photo">
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => onIndexChange((index + 1) % count)} className={btn} aria-label="Next photo">
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </m.div>,
    document.body
  );
}
