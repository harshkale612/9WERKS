"use client";

/**
 * The authentic workshop reel. Loads nothing until it approaches the viewport,
 * plays only while visible, pauses off-screen, and always offers a visible
 * play/pause control (WCAG 2.2.2). With reduced motion it never autoplays.
 */
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

interface ReelVideoProps {
  poster: string;
  label: string;
  className?: string;
}

export function ReelVideo({ poster, label, className }: ReelVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  /** User paused explicitly: never auto-resume. */
  const userPaused = useRef(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (el.preload !== "auto") {
            el.preload = "auto";
            el.load();
          }
          if (!reduce && !userPaused.current) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-ink-900", className)}>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/assets/video/workshop-reel.webm" type="video/webm" />
        <source src="/assets/video/workshop-reel.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        aria-label={playing ? "Pause workshop video" : "Play workshop video"}
        className="label absolute bottom-4 left-4 z-10 inline-flex min-h-11 items-center gap-3 border border-line-strong bg-ink-950/70 px-4 text-fg backdrop-blur-sm transition-colors hover:border-accent"
      >
        {playing ? <Pause aria-hidden="true" className="size-3.5" strokeWidth={1.5} /> : <Play aria-hidden="true" className="size-3.5" strokeWidth={1.5} />}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
