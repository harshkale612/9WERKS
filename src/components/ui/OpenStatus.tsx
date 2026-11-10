"use client";

/**
 * Live "Open now / Closed now" badge, evaluated in Asia/Kolkata time.
 * Server snapshot is empty (no hydration mismatch); the client re-evaluates
 * every 30 s via useSyncExternalStore.
 */
import { useSyncExternalStore } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { cn } from "@/lib/cn";

let snapshot: { key: string; value: Status } | null = null;

function getSnapshot(): Status {
  const s = getOpenStatus();
  const key = `${s.isOpen}|${s.label}|${s.detail}`;
  if (!snapshot || snapshot.key !== key) snapshot = { key, value: s };
  return snapshot.value;
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}

export function OpenStatus({ className, showDetail = true }: { className?: string; showDetail?: boolean }) {
  const status = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return (
    <span className={cn("label inline-flex min-h-5 items-center gap-2", className)} aria-live="polite">
      {status && (
        <>
          <span className="relative flex size-2" aria-hidden="true">
            {status.isOpen && <span className="absolute inline-flex size-full animate-ping rounded-full bg-go opacity-60 motion-reduce:hidden" />}
            <span className={cn("relative inline-flex size-2 rounded-full", status.isOpen ? "bg-go" : "bg-stop")} />
          </span>
          <span className="text-fg">{status.label}</span>
          {showDetail && status.detail && <span className="text-fg-muted">· {status.detail}</span>}
        </>
      )}
    </span>
  );
}
