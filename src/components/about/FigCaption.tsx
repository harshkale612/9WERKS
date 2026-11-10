/**
 * Technical figure caption — "FIG. 02 ── On the lift" — in the mono voice.
 *
 * `authenticCaption()` only returns a caption for photographs whose provenance
 * is "authentic", so an unverified image can never be captioned as 9WERKS work.
 */
import type { ReactNode } from "react";
import { getPhoto, type PhotoId } from "@/content/photos";
import { cn } from "@/lib/cn";

export function authenticCaption(id: PhotoId): string | undefined {
  const photo = getPhoto(id);
  if (photo.provenance !== "authentic") return undefined;
  return photo.caption?.replace(/\s+—\s+/g, " · ");
}

interface FigCaptionProps {
  index: string;
  children: ReactNode;
  className?: string;
}

export function FigCaption({ index, children, className }: FigCaptionProps) {
  return (
    <figcaption className={cn("label mt-5 flex items-center gap-3 text-fg-muted", className)}>
      <span className="tabular shrink-0 text-accent-text">Fig. {index}</span>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-current opacity-50" />
      <span>{children}</span>
    </figcaption>
  );
}
